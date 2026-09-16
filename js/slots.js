const symbols = [
    {
        icon: "🐉",
        multiplier: 10,
        weight: 8
    },
    {
        icon: "🔥",
        multiplier: 7,
        weight: 12
    },
    {
        icon: "💎",
        multiplier: 5,
        weight: 16
    },
    {
        icon: "👑",
        multiplier: 3,
        weight: 24
    },
    {
        icon: "💰",
        multiplier: 2,
        weight: 40
    }
];

const MIN_BET = 10;
const MAX_BET = 100;
const BET_STEP = 10;

const ROWS = 3;
const COLUMNS = 5;

const savedBalance =
    localStorage.getItem("luckyRealmsBalance");

let balance =
    savedBalance === null
        ? 1000
        : Number(savedBalance);

if (!Number.isFinite(balance)) {
    balance = 1000;
}

let currentBet = MIN_BET;
let isSpinning = false;


const balanceElement =
    document.getElementById("balance");

const betElement =
    document.getElementById("bet");

const lastWinElement =
    document.getElementById("last-win");

const messageElement =
    document.getElementById("game-message");

const spinButton =
    document.getElementById("spin-button");

const decreaseBetButton =
    document.getElementById("decrease-bet");

const increaseBetButton =
    document.getElementById("increase-bet");

const slotCells =
    document.querySelectorAll(".slot-cell");


function updateDisplay() {
    balanceElement.textContent = balance;
    betElement.textContent = currentBet;

    localStorage.setItem(
        "luckyRealmsBalance",
        balance
    );

    spinButton.disabled =
        isSpinning || balance < currentBet;

    decreaseBetButton.disabled = isSpinning;
    increaseBetButton.disabled = isSpinning;

    spinButton.textContent =
        isSpinning ? "SPINNING..." : "SPIN";
}


function getCellIndex(row, column) {
    return row * COLUMNS + column;
}


function getRandomSymbol() {
    const totalWeight = symbols.reduce(
        (sum, symbol) => sum + symbol.weight,
        0
    );

    let random =
        Math.random() * totalWeight;

    for (const symbol of symbols) {
        random -= symbol.weight;

        if (random < 0) {
            return symbol;
        }
    }

    return symbols[symbols.length - 1];
}


function generateGrid() {
    const grid = [];

    for (let row = 0; row < ROWS; row++) {
        const currentRow = [];

        for (
            let column = 0;
            column < COLUMNS;
            column++
        ) {
            currentRow.push(
                getRandomSymbol()
            );
        }

        grid.push(currentRow);
    }

    return grid;
}


function renderColumn(grid, column) {
    for (let row = 0; row < ROWS; row++) {

        const cellIndex =
            getCellIndex(row, column);

        slotCells[cellIndex].textContent =
            grid[row][column].icon;
    }
}


function setColumnSpinning(column, spinning) {
    for (let row = 0; row < ROWS; row++) {

        const cellIndex =
            getCellIndex(row, column);

        slotCells[cellIndex].classList.toggle(
            "spinning",
            spinning
        );
    }
}


function clearWinHighlights() {
    slotCells.forEach(cell => {
        cell.classList.remove("winning-cell");
    });
}


function calculateLineWin(row) {
    let bestWin = {
        amount: 0,
        matches: 0,
        startColumn: -1
    };

    for (let start = 0; start < row.length; start++) {

        const symbol = row[start];

        let matches = 1;

        for (
            let column = start + 1;
            column < row.length;
            column++
        ) {

            if (
                row[column].icon !== symbol.icon
            ) {
                break;
            }

            matches++;
        }

        if (matches < 3) {
            continue;
        }

        let matchMultiplier = 1;

        if (matches === 4) {
            matchMultiplier = 2;
        }

        if (matches === 5) {
            matchMultiplier = 4;
        }

        const amount =
            currentBet *
            symbol.multiplier *
            matchMultiplier;

        if (amount > bestWin.amount) {
            bestWin = {
                amount: amount,
                matches: matches,
                startColumn: start
            };
        }
    }

    return bestWin;
}


function calculateWins(grid) {
    let totalWin = 0;

    const winningLines = [];

    for (let row = 0; row < ROWS; row++) {

        const result =
            calculateLineWin(grid[row]);

        if (result.amount > 0) {

            totalWin += result.amount;

            winningLines.push({
                row: row,
                startColumn: result.startColumn,
                matches: result.matches,
                amount: result.amount
            });
        }
    }

    return {
        totalWin: totalWin,
        winningLines: winningLines
    };
}


function highlightWins(winningLines) {

    for (const line of winningLines) {

        for (
            let column = line.startColumn;
            column < line.startColumn + line.matches;
            column++
        ) {
            const cellIndex =
                getCellIndex(
                    line.row,
                    column
                );

            slotCells[cellIndex].classList.add(
                "winning-cell"
            );
        }
    }
}


function finishSpin(grid) {

    const result =
        calculateWins(grid);

    const totalWin =
        result.totalWin;

    if (totalWin > 0) {

        balance += totalWin;

        highlightWins(
            result.winningLines
        );

        messageElement.textContent =
            `You won ${totalWin} credits!`;

        messageElement.classList.add("win");

    } else {

        messageElement.textContent =
            "No win. Try again.";

        messageElement.classList.remove("win");
    }

    lastWinElement.textContent =
        totalWin;

    isSpinning = false;

    updateDisplay();
}


function animateSpin(finalGrid) {

    for (
        let column = 0;
        column < COLUMNS;
        column++
    ) {

        setColumnSpinning(
            column,
            true
        );

        const interval = setInterval(
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
                        getRandomSymbol().icon;
                }
            },
            80
        );


        const stopDelay =
            600 + column * 180;


        setTimeout(
            () => {

                clearInterval(interval);

                renderColumn(
                    finalGrid,
                    column
                );

                setColumnSpinning(
                    column,
                    false
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


function spin() {

    if (isSpinning) {
        return;
    }

    if (balance < currentBet) {

        messageElement.textContent =
            "Not enough credits.";

        return;
    }

    isSpinning = true;

    clearWinHighlights();

    balance -= currentBet;

    lastWinElement.textContent = 0;

    messageElement.textContent =
        "The reels are spinning...";

    messageElement.classList.remove("win");

    updateDisplay();

    const finalGrid =
        generateGrid();

    animateSpin(finalGrid);
}


decreaseBetButton.addEventListener(
    "click",
    () => {

        if (isSpinning) {
            return;
        }

        currentBet = Math.max(
            MIN_BET,
            currentBet - BET_STEP
        );

        updateDisplay();
    }
);


increaseBetButton.addEventListener(
    "click",
    () => {

        if (isSpinning) {
            return;
        }

        currentBet = Math.min(
            MAX_BET,
            currentBet + BET_STEP
        );

        updateDisplay();
    }
);


spinButton.addEventListener(
    "click",
    spin
);


updateDisplay();