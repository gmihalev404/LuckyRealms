const MIN_BET = 10;
const MAX_BET = 100;
const BET_STEP = 10;

const ROWS = 3;
const COLUMNS = 5;

const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],

    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2]
];


/* =========================================================
   GAME CONFIG
   ========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const gameKey =
    params.get("game") ||
    "dragon";

const game =
    window.GAME_CONFIGS[
        gameKey
    ] ||
    window.GAME_CONFIGS.dragon;

const symbols =
    game.symbols;

const reelSymbols = [
    ...game.symbols,
    game.bonus
];

const totalSymbolWeight =
    reelSymbols.reduce(
        (sum, symbol) =>
            sum +
            symbol.weight,

        0
    );


/* =========================================================
   BALANCE
   ========================================================= */

const savedBalance =
    localStorage.getItem(
        "luckyRealmsBalance"
    );

let balance =
    savedBalance === null
        ? 1000
        : Number(
            savedBalance
        );

if (
    !Number.isFinite(
        balance
    )
) {
    balance = 1000;
}

let currentBet =
    MIN_BET;

let isSpinning =
    false;


/* =========================================================
   FREE SPINS
   ========================================================= */

const freeSpinsKey =
    `${game.statsKey}FreeSpins`;

let freeSpins =
    Number(
        localStorage.getItem(
            freeSpinsKey
        )
    ) || 0;

let currentSpinIsFree =
    false;


/* =========================================================
   STATS
   ========================================================= */

const savedStats =
    localStorage.getItem(
        game.statsKey
    );

let gameStats = {
    spins: 0,
    wins: 0,
    biggestWin: 0
};

if (
    savedStats !== null
) {

    try {

        gameStats =
            JSON.parse(
                savedStats
            );

    } catch {

        localStorage.removeItem(
            game.statsKey
        );
    }
}


/* =========================================================
   DOM
   ========================================================= */

const realmLabel =
    document.getElementById(
        "realm-label"
    );

const gameTitle =
    document.getElementById(
        "game-title"
    );

const gameDescription =
    document.getElementById(
        "game-description"
    );

const paytableGrid =
    document.getElementById(
        "paytable-grid"
    );

const paytableDescription =
    document.getElementById(
        "paytable-description"
    );

const balanceElement =
    document.getElementById(
        "balance"
    );

const betElement =
    document.getElementById(
        "bet"
    );

const lastWinElement =
    document.getElementById(
        "last-win"
    );

const messageElement =
    document.getElementById(
        "game-message"
    );

const winBreakdownElement =
    document.getElementById(
        "win-breakdown"
    );

const spinButton =
    document.getElementById(
        "spin-button"
    );

const decreaseBetButton =
    document.getElementById(
        "decrease-bet"
    );

const increaseBetButton =
    document.getElementById(
        "increase-bet"
    );

const totalSpinsElement =
    document.getElementById(
        "total-spins"
    );

const totalWinsElement =
    document.getElementById(
        "total-wins"
    );

const biggestWinElement =
    document.getElementById(
        "biggest-win"
    );

const freeSpinsElement =
    document.getElementById(
        "free-spins"
    );

const refillButton =
    document.getElementById(
        "refill-button"
    );

const slotGrid =
    document.getElementById(
        "slot-grid"
    );


/* AUDIO */

const soundToggleButton =
    document.getElementById(
        "sound-toggle"
    );

const musicToggleButton =
    document.getElementById(
        "music-toggle"
    );

const volumeSlider =
    document.getElementById(
        "volume-slider"
    );


let slotCells;


/* =========================================================
   SETUP
   ========================================================= */

function setupGame() {

    LuckySounds.setTheme(
        gameKey
    );


    createSlotGrid();


    document.title =
        `${game.title} | LuckyRealms`;


    document.body.classList.add(
        game.themeClass
    );


    realmLabel.textContent =
        game.realm;

    gameTitle.textContent =
        game.title;

    gameDescription.textContent =
        game.description;


    renderPaytable();


    const startingGrid =
        generateGrid();


    renderGrid(
        startingGrid
    );
}


/* =========================================================
   PAYTABLE
   ========================================================= */

function renderPaytable() {

    paytableGrid.innerHTML =
        "";


    for (
        const symbol
        of symbols
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.innerHTML = `
            <span>
                ${symbol.icon}
            </span>

            <strong>
                ×${symbol.multiplier}
            </strong>
        `;


        paytableGrid.appendChild(
            item
        );
    }


    const bonusItem =
        document.createElement(
            "div"
        );


    bonusItem.classList.add(
        "bonus-paytable-item"
    );


    bonusItem.innerHTML = `
        <span>
            ${game.bonus.icon}
        </span>

        <strong>
            ${game.bonus.triggerCount}+ =
            ${game.bonus.freeSpins}
            Free Spins
        </strong>
    `;


    paytableGrid.appendChild(
        bonusItem
    );


    paytableDescription.textContent =
        `Multipliers are applied to the bet per payline. ` +
        `Four and five matching symbols give larger rewards. ` +
        `${game.title} features ${PAYLINES.length} active paylines.`;
}


/* =========================================================
   STORAGE
   ========================================================= */

function saveStats() {

    localStorage.setItem(
        game.statsKey,

        JSON.stringify(
            gameStats
        )
    );
}


function saveFreeSpins() {

    localStorage.setItem(
        freeSpinsKey,
        freeSpins
    );
}


/* =========================================================
   DISPLAY
   ========================================================= */

function updateStatsDisplay() {

    totalSpinsElement.textContent =
        gameStats.spins;

    totalWinsElement.textContent =
        gameStats.wins;

    biggestWinElement.textContent =
        gameStats.biggestWin;

    freeSpinsElement.textContent =
        freeSpins;
}


function updateDisplay() {

    balanceElement.textContent =
        balance;

    betElement.textContent =
        currentBet;


    localStorage.setItem(
        "luckyRealmsBalance",
        balance
    );


    spinButton.disabled =
        isSpinning ||
        (
            balance <
            currentBet &&

            freeSpins === 0
        );


    decreaseBetButton.disabled =
        isSpinning ||
        freeSpins > 0;


    increaseBetButton.disabled =
        isSpinning ||
        freeSpins > 0;


    if (
        isSpinning
    ) {

        spinButton.textContent =
            "SPINNING...";

    } else if (
        freeSpins > 0
    ) {

        spinButton.textContent =
            `FREE SPIN (${freeSpins})`;

    } else {

        spinButton.textContent =
            "SPIN";
    }


    refillButton.hidden =
        balance >= MIN_BET;
}


/* =========================================================
   AUDIO DISPLAY
   ========================================================= */

function updateAudioControls() {

    soundToggleButton.textContent =
        LuckySounds.isSoundEnabled()
            ? "🔊 SFX"
            : "🔇 SFX";


    musicToggleButton.textContent =
        LuckySounds.isMusicEnabled()
            ? "🎵 Music"
            : "🔇 Music";


    volumeSlider.value =
        Math.round(
            LuckySounds.getVolume()
            * 100
        );
}


/* =========================================================
   GRID
   ========================================================= */

function createSlotGrid() {

    slotGrid.innerHTML =
        "";


    for (
        let i = 0;
        i < ROWS * COLUMNS;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.classList.add(
            "slot-cell"
        );


        slotGrid.appendChild(
            cell
        );
    }


    slotCells =
        document.querySelectorAll(
            ".slot-cell"
        );
}


function getCellIndex(
    row,
    column
) {

    return (
        row *
        COLUMNS +
        column
    );
}


/* =========================================================
   SYMBOL GENERATION
   ========================================================= */

function getRandomSymbol() {

    let random =
        Math.random() *
        totalSymbolWeight;


    for (
        const symbol
        of reelSymbols
    ) {

        random -=
            symbol.weight;


        if (
            random < 0
        ) {

            return symbol;
        }
    }


    return reelSymbols[
        reelSymbols.length - 1
    ];
}


function generateGrid() {

    const grid =
        [];


    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        const currentRow =
            [];


        for (
            let column = 0;
            column < COLUMNS;
            column++
        ) {

            currentRow.push(
                getRandomSymbol()
            );
        }


        grid.push(
            currentRow
        );
    }


    return grid;
}


/* =========================================================
   GRID RENDERING
   ========================================================= */

function renderGrid(
    grid
) {

    for (
        let column = 0;
        column < COLUMNS;
        column++
    ) {

        renderColumn(
            grid,
            column
        );
    }
}


function renderColumn(
    grid,
    column
) {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        const cellIndex =
            getCellIndex(
                row,
                column
            );


        slotCells[
            cellIndex
        ].textContent =
            grid[
                row
            ][
                column
            ].icon;
    }
}


function setColumnSpinning(
    column,
    spinning
) {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        const cellIndex =
            getCellIndex(
                row,
                column
            );


        slotCells[
            cellIndex
        ].classList.toggle(
            "spinning",
            spinning
        );
    }
}


function clearHighlights() {

    slotCells.forEach(
        cell => {

            cell.classList.remove(
                "winning-cell",
                "bonus-cell"
            );
        }
    );
}


/* =========================================================
   WIN CALCULATION
   ========================================================= */

function calculateLineWin(
    line
) {

    let bestWin = {
        amount: 0,
        matches: 0,
        startColumn: -1
    };


    const lineBet =
        currentBet /
        PAYLINES.length;


    for (
        let start = 0;
        start < line.length;
        start++
    ) {

        const symbol =
            line[start];


        if (
            symbol.isBonus
        ) {
            continue;
        }


        let matches =
            1;


        for (
            let column =
                start + 1;

            column <
            line.length;

            column++
        ) {

            if (
                line[column].icon !==
                symbol.icon
            ) {

                break;
            }


            matches++;
        }


        if (
            matches < 3
        ) {

            continue;
        }


        let matchMultiplier =
            1;


        if (
            matches === 4
        ) {

            matchMultiplier =
                2;
        }


        if (
            matches === 5
        ) {

            matchMultiplier =
                4;
        }


        const amount =
            lineBet *
            symbol.multiplier *
            matchMultiplier;


        if (
            amount >
            bestWin.amount
        ) {

            bestWin = {
                amount,
                matches,
                startColumn:
                    start
            };
        }
    }


    return bestWin;
}


function getPaylineSymbols(
    grid,
    payline
) {

    const line =
        [];


    for (
        let column = 0;
        column < COLUMNS;
        column++
    ) {

        const row =
            payline[
                column
            ];


        line.push(
            grid[
                row
            ][
                column
            ]
        );
    }


    return line;
}


function calculateWins(
    grid
) {

    let totalWin =
        0;

    const winningLines =
        [];


    for (
        let lineIndex = 0;
        lineIndex <
        PAYLINES.length;
        lineIndex++
    ) {

        const payline =
            PAYLINES[
                lineIndex
            ];


        const lineSymbols =
            getPaylineSymbols(
                grid,
                payline
            );


        const result =
            calculateLineWin(
                lineSymbols
            );


        if (
            result.amount > 0
        ) {

            totalWin +=
                result.amount;


            winningLines.push({
                lineNumber:
                    lineIndex + 1,

                payline,

                startColumn:
                    result.startColumn,

                matches:
                    result.matches,

                amount:
                    result.amount
            });
        }
    }


    return {
        totalWin,
        winningLines
    };
}


/* =========================================================
   WIN DISPLAY
   ========================================================= */

function highlightWins(
    winningLines
) {

    for (
        const line
        of winningLines
    ) {

        for (
            let column =
                line.startColumn;

            column <
            line.startColumn +
            line.matches;

            column++
        ) {

            const row =
                line.payline[
                    column
                ];


            const cellIndex =
                getCellIndex(
                    row,
                    column
                );


            slotCells[
                cellIndex
            ].classList.add(
                "winning-cell"
            );
        }
    }
}


function showWinBreakdown(
    winningLines
) {

    winBreakdownElement.innerHTML =
        "";


    for (
        const line
        of winningLines
    ) {

        const winLine =
            document.createElement(
                "div"
            );


        winLine.classList.add(
            "win-line"
        );


        winLine.innerHTML = `
            <span>
                Payline
                ${line.lineNumber}
            </span>

            <strong>
                +${line.amount}
            </strong>
        `;


        winBreakdownElement.appendChild(
            winLine
        );
    }
}


/* =========================================================
   BONUS
   ========================================================= */

function countBonusSymbols(
    grid
) {

    let count =
        0;


    for (
        const row
        of grid
    ) {

        for (
            const symbol
            of row
        ) {

            if (
                symbol.isBonus
            ) {

                count++;
            }
        }
    }


    return count;
}


function highlightBonusSymbols(
    grid
) {

    for (
        let row = 0;
        row < ROWS;
        row++
    ) {

        for (
            let column = 0;
            column < COLUMNS;
            column++
        ) {

            if (
                !grid[
                    row
                ][
                    column
                ].isBonus
            ) {

                continue;
            }


            const cellIndex =
                getCellIndex(
                    row,
                    column
                );


            slotCells[
                cellIndex
            ].classList.add(
                "bonus-cell"
            );
        }
    }
}


/* =========================================================
   FINISH SPIN
   ========================================================= */

function finishSpin(
    grid
) {

    const result =
        calculateWins(
            grid
        );


    const totalWin =
        result.totalWin;


    const bonusCount =
        countBonusSymbols(
            grid
        );


    let awardedFreeSpins =
        0;


    /* NORMAL WIN */

    if (
        totalWin > 0
    ) {

        balance +=
            totalWin;


        gameStats.wins++;


        gameStats.biggestWin =
            Math.max(
                gameStats.biggestWin,
                totalWin
            );


        highlightWins(
            result.winningLines
        );


        showWinBreakdown(
            result.winningLines
        );


        saveStats();

    } else {

        winBreakdownElement.innerHTML =
            "";
    }


    /* BONUS */

    if (
        bonusCount >=
        game.bonus.triggerCount
    ) {

        awardedFreeSpins =
            game.bonus.freeSpins;


        freeSpins +=
            awardedFreeSpins;


        saveFreeSpins();


        highlightBonusSymbols(
            grid
        );
    }


    /* MESSAGE */

    if (
        totalWin > 0 &&
        awardedFreeSpins > 0
    ) {

        messageElement.textContent =
            `You won ${totalWin} credits and triggered ${awardedFreeSpins} free spins!`;


        messageElement.classList.add(
            "win"
        );

    } else if (
        totalWin > 0
    ) {

        messageElement.textContent =
            `You won ${totalWin} credits!`;


        messageElement.classList.add(
            "win"
        );

    } else if (
        awardedFreeSpins > 0
    ) {

        messageElement.textContent =
            `Bonus! You won ${awardedFreeSpins} free spins!`;


        messageElement.classList.add(
            "win"
        );

    } else {

        messageElement.textContent =
            "No win. Try again.";


        messageElement.classList.remove(
            "win"
        );
    }


    /* WIN / BONUS SFX */

    if (
        awardedFreeSpins > 0
    ) {

        LuckySounds.bonus();

    } else if (
        totalWin > 0
    ) {

        LuckySounds.win();
    }


    lastWinElement.textContent =
        totalWin;


    isSpinning =
        false;


    updateStatsDisplay();
    updateDisplay();
}


/* =========================================================
   SPIN ANIMATION
   ========================================================= */

function animateSpin(
    finalGrid
) {

    for (
        let column = 0;
        column < COLUMNS;
        column++
    ) {

        setColumnSpinning(
            column,
            true
        );


        const interval =
            setInterval(
                () => {

                    for (
                        let row = 0;
                        row < ROWS;
                        row++
                    ) {

                        const cellIndex =
                            getCellIndex(
                                row,
                                column
                            );


                        slotCells[
                            cellIndex
                        ].textContent =
                            getRandomSymbol()
                                .icon;
                    }
                },

                80
            );


        const stopDelay =
            600 +
            column *
            180;


        setTimeout(
            () => {

                clearInterval(
                    interval
                );


                renderColumn(
                    finalGrid,
                    column
                );


                setColumnSpinning(
                    column,
                    false
                );


                LuckySounds.reelStop(
                    column
                );


                if (
                    column ===
                    COLUMNS - 1
                ) {

                    finishSpin(
                        finalGrid
                    );
                }
            },

            stopDelay
        );
    }
}


/* =========================================================
   SPIN
   ========================================================= */

function spin() {

    if (
        isSpinning
    ) {

        return;
    }


    if (
        balance <
        currentBet &&

        freeSpins === 0
    ) {

        messageElement.textContent =
            "Not enough credits.";

        return;
    }


    isSpinning =
        true;


    /*
        The browser allows music once
        the user has interacted with
        the page.
    */

    LuckySounds.startMusic();

    LuckySounds.spin();


    clearHighlights();


    winBreakdownElement.innerHTML =
        "";


    currentSpinIsFree =
        freeSpins > 0;


    if (
        currentSpinIsFree
    ) {

        freeSpins--;


        saveFreeSpins();

    } else {

        balance -=
            currentBet;
    }


    gameStats.spins++;


    saveStats();


    lastWinElement.textContent =
        0;


    messageElement.textContent =
        "The reels are spinning...";


    messageElement.classList.remove(
        "win"
    );


    updateStatsDisplay();
    updateDisplay();


    const finalGrid =
        generateGrid();


    animateSpin(
        finalGrid
    );
}


/* =========================================================
   BET CONTROLS
   ========================================================= */

decreaseBetButton.addEventListener(
    "click",
    () => {

        if (
            isSpinning
        ) {

            return;
        }


        currentBet =
            Math.max(
                MIN_BET,

                currentBet -
                BET_STEP
            );


        updateDisplay();
    }
);


increaseBetButton.addEventListener(
    "click",
    () => {

        if (
            isSpinning
        ) {

            return;
        }


        currentBet =
            Math.min(
                MAX_BET,

                currentBet +
                BET_STEP
            );


        updateDisplay();
    }
);


/* =========================================================
   SPIN BUTTON
   ========================================================= */

spinButton.addEventListener(
    "click",
    spin
);


/* =========================================================
   REFILL
   ========================================================= */

refillButton.addEventListener(
    "click",
    () => {

        if (
            isSpinning ||
            balance >=
            MIN_BET
        ) {

            return;
        }


        balance =
            1000;


        messageElement.textContent =
            "Your balance has been refilled.";


        winBreakdownElement.innerHTML =
            "";


        updateDisplay();
    }
);


/* =========================================================
   AUDIO CONTROLS
   ========================================================= */

soundToggleButton.addEventListener(
    "click",
    () => {

        LuckySounds.toggleSound();


        updateAudioControls();
    }
);


musicToggleButton.addEventListener(
    "click",
    () => {

        LuckySounds.toggleMusic();


        /*
            Re-render from the real current
            setting every time.

            This fixes the emoji not changing
            back after enabling music again.
        */

        updateAudioControls();
    }
);


volumeSlider.addEventListener(
    "input",
    () => {

        LuckySounds.setVolume(
            Number(
                volumeSlider.value
            ) / 100
        );
    }
);


/* =========================================================
   START
   ========================================================= */

setupGame();

updateStatsDisplay();

updateDisplay();

updateAudioControls();