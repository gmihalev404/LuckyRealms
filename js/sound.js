const SOUND_STORAGE_KEY =
    "luckyRealmsSoundEnabled";

const MUSIC_STORAGE_KEY =
    "luckyRealmsMusicEnabled";

const VOLUME_STORAGE_KEY =
    "luckyRealmsVolume";


let soundEnabled =
    localStorage.getItem(
        SOUND_STORAGE_KEY
    ) !== "false";


let musicEnabled =
    localStorage.getItem(
        MUSIC_STORAGE_KEY
    ) !== "false";


const savedVolume =
    localStorage.getItem(
        VOLUME_STORAGE_KEY
    );

let masterVolume =
    savedVolume === null
        ? 0.7
        : Number(savedVolume);

if (
    !Number.isFinite(
        masterVolume
    )
) {
    masterVolume = 0.7;
}


masterVolume =
    Math.max(
        0,
        Math.min(
            1,
            masterVolume
        )
    );


let currentTheme =
    "dragon";


let audioContext =
    null;

let masterGain =
    null;

let effectsGain =
    null;

let backgroundMusic =
    null;


/* =========================================================
   GAME AUDIO CONFIG
   ========================================================= */

function getGameConfig() {

    return (
        window.GAME_CONFIGS[
            currentTheme
        ] ||
        window.GAME_CONFIGS.dragon
    );
}


function getAudioConfig() {

    return (
        getGameConfig().audio ||
        {}
    );
}


function getSfxConfig() {

    return (
        getAudioConfig().sfx ||
        {}
    );
}


/* =========================================================
   AUDIO CONTEXT
   ========================================================= */

function getAudioContext() {

    if (
        audioContext === null
    ) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        masterGain =
            audioContext.createGain();

        effectsGain =
            audioContext.createGain();


        effectsGain.connect(
            masterGain
        );


        masterGain.connect(
            audioContext.destination
        );


        effectsGain.gain.value =
            1;


        updateEffectsVolume();
    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }


    return audioContext;
}


function updateEffectsVolume() {

    if (
        masterGain === null
    ) {
        return;
    }


    masterGain.gain.value =
        masterVolume;
}


function updateMusicVolume() {

    if (
        backgroundMusic === null
    ) {
        return;
    }


    const audio =
        getAudioConfig();


    const multiplier =
        Number.isFinite(
            audio.musicVolume
        )
            ? audio.musicVolume
            : 0.55;


    backgroundMusic.volume =
        Math.min(
            1,

            masterVolume *
            multiplier
        );
}


/* =========================================================
   BASIC TONE
   ========================================================= */

function playTone(
    frequency,
    duration,
    options = {}
) {

    if (
        !soundEnabled
    ) {
        return;
    }


    const {
        type = "sine",
        volume = 0.08,
        delay = 0,
        endFrequency = frequency
    } = options;


    const context =
        getAudioContext();


    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();


    const startTime =
        context.currentTime +
        delay;


    const endTime =
        startTime +
        duration;


    oscillator.type =
        type;


    oscillator.frequency
        .setValueAtTime(
            frequency,
            startTime
        );


    oscillator.frequency
        .exponentialRampToValueAtTime(
            Math.max(
                endFrequency,
                1
            ),
            endTime
        );


    gain.gain
        .setValueAtTime(
            0.0001,
            startTime
        );


    gain.gain
        .exponentialRampToValueAtTime(
            volume,
            startTime + 0.015
        );


    gain.gain
        .exponentialRampToValueAtTime(
            0.0001,
            endTime
        );


    oscillator.connect(
        gain
    );


    gain.connect(
        effectsGain
    );


    oscillator.start(
        startTime
    );


    oscillator.stop(
        endTime
    );
}


/* =========================================================
   GENERIC SPIN SFX
   ========================================================= */

function playSpin() {

    const config =
        getSfxConfig().spin;


    if (
        !config ||
        !Array.isArray(
            config.tones
        )
    ) {
        return;
    }


    for (
        const tone
        of config.tones
    ) {

        playTone(
            tone.frequency,
            tone.duration,

            {
                type:
                    tone.type,

                volume:
                    tone.volume,

                delay:
                    tone.delay || 0,

                endFrequency:
                    tone.endFrequency ??
                    tone.frequency
            }
        );
    }
}


/* =========================================================
   GENERIC REEL STOP SFX
   ========================================================= */

function playReelStop(
    column
) {

    const config =
        getSfxConfig()
            .reelStop;


    if (
        !config
    ) {
        return;
    }


    const frequency =
        config.frequency +
        (
            config.frequencyStep ||
            0
        ) *
        column;


    const endFrequency =
        (
            config.endFrequency ??
            config.frequency
        ) +
        (
            config.endFrequencyStep ||
            0
        ) *
        column;


    playTone(
        frequency,
        config.duration,

        {
            type:
                config.type,

            volume:
                config.volume,

            endFrequency
        }
    );
}


/* =========================================================
   GENERIC NOTE SEQUENCE
   ========================================================= */

function playSequence(
    config
) {

    if (
        !config ||
        !Array.isArray(
            config.notes
        )
    ) {
        return;
    }


    config.notes.forEach(
        (note, index) => {

            playTone(
                note,
                config.duration,

                {
                    type:
                        config.type,

                    volume:
                        config.volume,

                    delay:
                        index *
                        (
                            config.spacing ||
                            0
                        )
                }
            );
        }
    );
}


function playWin() {

    playSequence(
        getSfxConfig().win
    );
}


function playBonus() {

    playSequence(
        getSfxConfig().bonus
    );
}


/* =========================================================
   BACKGROUND MUSIC
   ========================================================= */

function createBackgroundMusic() {

    if (
        backgroundMusic !== null
    ) {

        backgroundMusic.pause();

        backgroundMusic =
            null;
    }


    const musicPath =
        getAudioConfig().music;


    if (
        !musicPath
    ) {
        return;
    }


    backgroundMusic =
        new Audio(
            musicPath
        );


    backgroundMusic.loop =
        true;


    backgroundMusic.preload =
        "auto";


    updateMusicVolume();
}


function startMusic() {

    if (
        !musicEnabled
    ) {
        return;
    }


    if (
        backgroundMusic === null
    ) {

        createBackgroundMusic();
    }


    if (
        backgroundMusic === null
    ) {
        return;
    }


    updateMusicVolume();


    backgroundMusic
        .play()
        .catch(
            () => {
                /*
                    Browser may block playback
                    before user interaction.
                */
            }
        );
}


function stopMusic() {

    if (
        backgroundMusic === null
    ) {
        return;
    }


    backgroundMusic.pause();
}


/* =========================================================
   THEME
   ========================================================= */

function setTheme(
    theme
) {

    const newTheme =
        window.GAME_CONFIGS[
            theme
        ]
            ? theme
            : "dragon";


    if (
        newTheme ===
        currentTheme &&
        backgroundMusic !== null
    ) {
        return;
    }


    const wasPlaying =
        backgroundMusic !== null &&
        !backgroundMusic.paused;


    if (
        backgroundMusic !== null
    ) {

        backgroundMusic.pause();
    }


    currentTheme =
        newTheme;


    createBackgroundMusic();


    if (
        wasPlaying &&
        musicEnabled
    ) {

        startMusic();
    }
}


/* =========================================================
   SETTINGS
   ========================================================= */

function toggleSound() {

    soundEnabled =
        !soundEnabled;


    localStorage.setItem(
        SOUND_STORAGE_KEY,
        soundEnabled
    );


    return soundEnabled;
}


function toggleMusic() {

    musicEnabled =
        !musicEnabled;


    localStorage.setItem(
        MUSIC_STORAGE_KEY,
        musicEnabled
    );


    if (
        musicEnabled
    ) {

        startMusic();

    } else {

        stopMusic();
    }


    return musicEnabled;
}


function setVolume(
    value
) {

    masterVolume =
        Math.max(
            0,
            Math.min(
                1,
                value
            )
        );


    localStorage.setItem(
        VOLUME_STORAGE_KEY,
        masterVolume
    );


    updateEffectsVolume();

    updateMusicVolume();
}


function getVolume() {

    return masterVolume;
}


function isSoundEnabled() {

    return soundEnabled;
}


function isMusicEnabled() {

    return musicEnabled;
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.LuckySounds = {

    setTheme,

    spin:
        playSpin,

    reelStop:
        playReelStop,

    win:
        playWin,

    bonus:
        playBonus,

    startMusic,
    stopMusic,

    toggleSound,
    toggleMusic,

    setVolume,
    getVolume,

    isSoundEnabled,
    isMusicEnabled
};