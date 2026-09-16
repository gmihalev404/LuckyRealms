const symbols = [
    {
        icon: "🐉",
        multiplier: 10
    },
    {
        icon: "🔥",
        multiplier: 7
    },
    {
        icon: "💎",
        multiplier: 5
    },
    {
        icon: "👑",
        multiplier: 3
    },
    {
        icon: "🪙",
        multiplier: 2
    }
];

const MIN_BET = 10;
const MAX_BET = 100;
const BET_STEP = 10;

let balance = Number(
    localStorage.getItem("luckyRealmsBalance")
);

if (!Number.isFinite(balance)) {
    balance = 1000;

    localStorage.setItem(
        "luckyRealmsBalance",
        balance
    );
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

const slotGrid =
    document.getElementById("slot-grid");

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
}


function getRandomSymbol() {
    const index = Math.floor(
        Math.random() * symbols.length
    );

    return symbols[index];
}


function generateGrid() {
    const grid = [];

    for (let row = 0; row < 3; row++) {
        const currentRow = [];

        for (let column = 0; column < 5; column++) {
            currentRow.push(
                getRandomSymbol()
            );
        }

        grid.push(currentRow);
    }

    return grid;
}


function renderGrid(grid) {
    let cellIndex = 0;

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 5; column++) {

            slotCells[cellIndex].textContent =
                grid[row][column].icon;

            cellIndex++;
        }
    }
}


function calculateLineWin(row) {
    const firstSymbol = row[0];

    let matches = 1;

    for (let i = 1; i < row.length; i++) {

        if (row[i].icon !== firstSymbol.icon) {
            break;
        }

        matches++;
    }

    if (matches < 3) {
        return 0;
    }

    let matchMultiplier = 1;

    if (matches === 4) {
        matchMultiplier = 2;
    }

    if (matches === 5) {
        matchMultiplier = 4;
    }

    return (
        currentBet *
        firstSymbol.multiplier *
        matchMultiplier
    );
}


function calculateTotalWin(grid) {
    let totalWin = 0;

    for (const row of grid) {
        totalWin += calculateLineWin(row);
    }

    return totalWin;
}


function finishSpin() {
    const grid = generateGrid();

    renderGrid(grid);

    const totalWin =
        calculateTotalWin(grid);

    if (totalWin > 0) {
        balance += totalWin;

        messageElement.textContent =
            `You won ${totalWin} credits!`;

        messageElement.classList.add("win");
    } else {
        messageElement.textContent =
            "No win. Try again.";

        messageElement.classList.remove("win");
    }

    lastWinElement.textContent = totalWin;

    isSpinning = false;

    slotGrid.classList.remove("spinning");

    updateDisplay();
}


function spin() {
    if (isSpinning || balance < currentBet) {
        return;
    }

    isSpinning = true;

    balance -= currentBet;

    lastWinElement.textContent = 0;

    messageElement.textContent =
        "The reels are spinning...";

    messageElement.classList.remove("win");

    slotGrid.classList.add("spinning");

    updateDisplay();

    setTimeout(
        finishSpin,
        900
    );
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

        if (currentBet > balance) {
            currentBet = Math.max(
                MIN_BET,
                Math.floor(balance / BET_STEP) * BET_STEP
            );
        }

        updateDisplay();
    }
);


spinButton.addEventListener(
    "click",
    spin
);


updateDisplay();