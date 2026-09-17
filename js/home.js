const gamesGrid =
    document.getElementById(
        "games-grid"
    );

function renderGames() {
    gamesGrid.innerHTML = "";

    for (
        const [gameKey, game]
        of Object.entries(
            window.GAME_CONFIGS
        )
    ) {
        const card =
            document.createElement(
                "article"
            );

        card.classList.add(
            "game-card"
        );

        card.innerHTML = `
            <div class="game-image ${game.cardClass}">
                <span>${game.cardIcon}</span>
            </div>

            <div class="game-info">
                <h3>
                    ${game.title}
                </h3>

                <p>
                    ${game.description}
                </p>

                <a
                    href="games/slots.html?game=${gameKey}"
                    class="play-button">
                    Play
                </a>
            </div>
        `;

        gamesGrid.appendChild(
            card
        );
    }
}

renderGames();