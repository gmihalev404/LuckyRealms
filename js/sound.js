const SOUND_STORAGE_KEY =
    "luckyRealmsSoundEnabled";

const MUSIC_STORAGE_KEY =
    "luckyRealmsMusicEnabled";

const VOLUME_STORAGE_KEY =
    "luckyRealmsVolume";


const MUSIC_TRACKS = {
    dragon:
        "../assets/audio/dragon-theme.mp3",

    poseidon:
        "../assets/audio/poseidon-theme.mp3",

    shadow:
        "../assets/audio/shadow-theme.mp3"
};


/*
    Background music is intentionally quieter
    than the sound effects.
*/
const MUSIC_VOLUME_MULTIPLIER = 0.55;


let soundEnabled =
    localStorage.getItem(
        SOUND_STORAGE_KEY
    ) !== "false";


let musicEnabled =
    localStorage.getItem(
        MUSIC_STORAGE_KEY
    ) !== "false";


let masterVolume =
    Number(
        localStorage.getItem(
            VOLUME_STORAGE_KEY
        )
    );


if (
    !Number.isFinite(masterVolume)
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


    backgroundMusic.volume =
        Math.min(
            1,

            masterVolume *
            MUSIC_VOLUME_MULTIPLIER
        );
}


/* =========================================================
   GENERIC SFX TONE
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
   DRAGON SFX
   ========================================================= */

function dragonSpin() {

    playTone(
        190,
        0.28,
        {
            type: "sawtooth",
            volume: 0.09,
            endFrequency: 80
        }
    );
}


function dragonReelStop(column) {

    playTone(
        180 + column * 28,
        0.09,
        {
            type: "square",
            volume: 0.07,

            endFrequency:
                130 +
                column * 20
        }
    );
}


function dragonWin() {

    const notes = [
        392,
        523,
        659,
        784
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.22,
                {
                    type: "triangle",
                    volume: 0.12,
                    delay:
                        index * 0.1
                }
            );
        }
    );
}


function dragonBonus() {

    const notes = [
        196,
        392,
        523,
        659,
        784,
        1046
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.32,
                {
                    type: "sawtooth",
                    volume: 0.1,

                    delay:
                        index * 0.11
                }
            );
        }
    );
}


/* =========================================================
   POSEIDON SFX
   ========================================================= */

function poseidonSpin() {

    playTone(
        330,
        0.35,
        {
            type: "sine",
            volume: 0.09,
            endFrequency: 180
        }
    );


    playTone(
        440,
        0.3,
        {
            type: "triangle",
            volume: 0.055,
            endFrequency: 260,
            delay: 0.04
        }
    );
}


function poseidonReelStop(column) {

    playTone(
        420 + column * 40,
        0.12,
        {
            type: "sine",
            volume: 0.075,

            endFrequency:
                300 +
                column * 25
        }
    );
}


function poseidonWin() {

    const notes = [
        523,
        659,
        784,
        1046
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.28,
                {
                    type: "sine",
                    volume: 0.12,

                    delay:
                        index * 0.11
                }
            );
        }
    );
}


function poseidonBonus() {

    const notes = [
        392,
        523,
        659,
        784,
        987,
        1318
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.35,
                {
                    type: "triangle",
                    volume: 0.105,

                    delay:
                        index * 0.13
                }
            );
        }
    );
}


/* =========================================================
   SHADOW SFX
   ========================================================= */

function shadowSpin() {

    playTone(
        115,
        0.45,
        {
            type: "sawtooth",
            volume: 0.09,
            endFrequency: 48
        }
    );


    playTone(
        82,
        0.4,
        {
            type: "sine",
            volume: 0.07,
            endFrequency: 55
        }
    );
}


function shadowReelStop(column) {

    playTone(
        120 + column * 13,
        0.14,
        {
            type: "square",
            volume: 0.065,

            endFrequency:
                80 +
                column * 10
        }
    );
}


function shadowWin() {

    const notes = [
        220,
        261,
        311,
        440
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.3,
                {
                    type: "triangle",
                    volume: 0.11,

                    delay:
                        index * 0.13
                }
            );
        }
    );
}


function shadowBonus() {

    const notes = [
        110,
        146,
        174,
        220,
        311,
        440
    ];


    notes.forEach(
        (note, index) => {

            playTone(
                note,
                0.42,
                {
                    type: "sine",
                    volume: 0.11,

                    delay:
                        index * 0.16
                }
            );
        }
    );
}


/* =========================================================
   THEME SFX
   ========================================================= */

const themeEffects = {

    dragon: {
        spin:
            dragonSpin,

        reelStop:
            dragonReelStop,

        win:
            dragonWin,

        bonus:
            dragonBonus
    },


    poseidon: {
        spin:
            poseidonSpin,

        reelStop:
            poseidonReelStop,

        win:
            poseidonWin,

        bonus:
            poseidonBonus
    },


    shadow: {
        spin:
            shadowSpin,

        reelStop:
            shadowReelStop,

        win:
            shadowWin,

        bonus:
            shadowBonus
    }
};


function playThemeEffect(
    effect,
    ...args
) {

    if (
        !soundEnabled
    ) {
        return;
    }


    const theme =
        themeEffects[
            currentTheme
        ] ||
        themeEffects.dragon;


    theme[effect](
        ...args
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


    backgroundMusic =
        new Audio(
            MUSIC_TRACKS[
                currentTheme
            ]
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


    updateMusicVolume();


    backgroundMusic
        .play()
        .catch(
            () => {
                /*
                    Browser may block audio until
                    a user interaction occurs.
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


    /*
        Do not reset currentTime.
        If music is enabled again,
        it continues from the same point.
    */

    backgroundMusic.pause();
}


/* =========================================================
   SETTINGS
   ========================================================= */

function setTheme(theme) {

    const newTheme =
        MUSIC_TRACKS[theme]
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


function setVolume(value) {

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


    spin() {

        playThemeEffect(
            "spin"
        );
    },


    reelStop(column) {

        playThemeEffect(
            "reelStop",
            column
        );
    },


    win() {

        playThemeEffect(
            "win"
        );
    },


    bonus() {

        playThemeEffect(
            "bonus"
        );
    },


    startMusic,
    stopMusic,

    toggleSound,
    toggleMusic,

    setVolume,
    getVolume,

    isSoundEnabled,
    isMusicEnabled
};