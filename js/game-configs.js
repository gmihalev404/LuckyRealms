window.GAME_CONFIGS = {

    dragon: {
        cardIcon: "🐉",
        cardClass: "dragon-realm",

        title: "Dragon's Fortune",
        realm: "DRAGON REALM",

        description:
            "Match three or more consecutive symbols on a payline to claim the dragon's treasure.",

        statsKey: "dragonFortuneStats",
        themeClass: "dragon-theme",

        symbols: [
            {
                icon: "🐉",
                multiplier: 55,
                weight: 4
            },
            {
                icon: "🔥",
                multiplier: 24,
                weight: 9
            },
            {
                icon: "⚔️",
                multiplier: 11,
                weight: 16
            },
            {
                icon: "👑",
                multiplier: 4,
                weight: 27
            },
            {
                icon: "💰",
                multiplier: 2,
                weight: 40
            }
        ],

        bonus: {
            icon: "🥚",
            name: "Dragon Egg",
            weight: 4,
            triggerCount: 3,
            freeSpins: 5,
            isBonus: true
        },

        audio: {
            music:
                "../assets/audio/dragon-theme.mp3",

            musicVolume:
                0.25,

            sfx: {
                spin: {
                    tones: [
                        {
                            frequency: 190,
                            duration: 0.28,
                            type: "sawtooth",
                            volume: 0.09,
                            endFrequency: 80
                        }
                    ]
                },

                reelStop: {
                    frequency: 180,
                    frequencyStep: 28,

                    endFrequency: 130,
                    endFrequencyStep: 20,

                    duration: 0.09,
                    type: "square",
                    volume: 0.07
                },

                win: {
                    notes: [
                        392,
                        523,
                        659,
                        784
                    ],

                    duration: 0.22,
                    type: "triangle",
                    volume: 0.12,
                    spacing: 0.10
                },

                bonus: {
                    notes: [
                        196,
                        392,
                        523,
                        659,
                        784,
                        1046
                    ],

                    duration: 0.32,
                    type: "sawtooth",
                    volume: 0.10,
                    spacing: 0.11
                }
            }
        }
    },


    poseidon: {
        cardIcon: "🔱",
        cardClass: "ocean-realm",

        title: "Poseidon's Treasure",
        realm: "OCEAN REALM",

        description:
            "Explore the depths and match three or more symbols to uncover Poseidon's treasure.",

        statsKey: "poseidonTreasureStats",
        themeClass: "ocean-theme",

        symbols: [
            {
                icon: "🔱",
                multiplier: 28,
                weight: 8
            },
            {
                icon: "🐙",
                multiplier: 17,
                weight: 14
            },
            {
                icon: "💎",
                multiplier: 10,
                weight: 20
            },
            {
                icon: "🐚",
                multiplier: 5,
                weight: 25
            },
            {
                icon: "🐟",
                multiplier: 3,
                weight: 30
            }
        ],

        bonus: {
            icon: "⚓",
            name: "Ancient Anchor",
            weight: 3,
            triggerCount: 3,
            freeSpins: 4,
            isBonus: true
        },

        audio: {
            music:
                "../assets/audio/poseidon-theme.mp3",

            musicVolume:
                0.25,

            sfx: {
                spin: {
                    tones: [
                        {
                            frequency: 330,
                            duration: 0.35,
                            type: "sine",
                            volume: 0.09,
                            endFrequency: 180
                        },

                        {
                            frequency: 440,
                            duration: 0.30,
                            type: "triangle",
                            volume: 0.055,
                            endFrequency: 260,
                            delay: 0.04
                        }
                    ]
                },

                reelStop: {
                    frequency: 420,
                    frequencyStep: 40,

                    endFrequency: 300,
                    endFrequencyStep: 25,

                    duration: 0.12,
                    type: "sine",
                    volume: 0.075
                },

                win: {
                    notes: [
                        523,
                        659,
                        784,
                        1046
                    ],

                    duration: 0.28,
                    type: "sine",
                    volume: 0.12,
                    spacing: 0.11
                },

                bonus: {
                    notes: [
                        392,
                        523,
                        659,
                        784,
                        987,
                        1318
                    ],

                    duration: 0.35,
                    type: "triangle",
                    volume: 0.105,
                    spacing: 0.13
                }
            }
        }
    },


    shadow: {
        cardIcon: "💀",
        cardClass: "shadow-realm",

        title: "Shadow Fortune",
        realm: "SHADOW REALM",

        description:
            "Enter the darkness and uncover the riches hidden inside the shadow realm.",

        statsKey: "shadowFortuneStats",
        themeClass: "shadow-theme",

        symbols: [
            {
                icon: "💀",
                multiplier: 90,
                weight: 3
            },
            {
                icon: "🦇",
                multiplier: 28,
                weight: 7
            },
            {
                icon: "🔮",
                multiplier: 9,
                weight: 14
            },
            {
                icon: "🕯️",
                multiplier: 3,
                weight: 30
            },
            {
                icon: "🕸️",
                multiplier: 2,
                weight: 44
            }
        ],

        bonus: {
            icon: "🌑",
            name: "Dark Moon",
            weight: 2,
            triggerCount: 3,
            freeSpins: 6,
            isBonus: true
        },

        audio: {
            music:
                "../assets/audio/shadow-theme.mp3",

            musicVolume:
                0.25,

            sfx: {
                spin: {
                    tones: [
                        {
                            frequency: 115,
                            duration: 0.45,
                            type: "sawtooth",
                            volume: 0.09,
                            endFrequency: 48
                        },

                        {
                            frequency: 82,
                            duration: 0.40,
                            type: "sine",
                            volume: 0.07,
                            endFrequency: 55
                        }
                    ]
                },

                reelStop: {
                    frequency: 120,
                    frequencyStep: 13,

                    endFrequency: 80,
                    endFrequencyStep: 10,

                    duration: 0.14,
                    type: "square",
                    volume: 0.065
                },

                win: {
                    notes: [
                        220,
                        261,
                        311,
                        440
                    ],

                    duration: 0.30,
                    type: "triangle",
                    volume: 0.11,
                    spacing: 0.13
                },

                bonus: {
                    notes: [
                        110,
                        146,
                        174,
                        220,
                        311,
                        440
                    ],

                    duration: 0.42,
                    type: "sine",
                    volume: 0.11,
                    spacing: 0.16
                }
            }
        }
    }
};