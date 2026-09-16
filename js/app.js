const STARTING_BALANCE = 1000;

let balance = localStorage.getItem("luckyRealmsBalance");

if (balance === null) {
    balance = STARTING_BALANCE;

    localStorage.setItem(
        "luckyRealmsBalance",
        balance
    );
}

document.getElementById("balance").textContent = balance;