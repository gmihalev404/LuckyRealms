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
        }
    }
};