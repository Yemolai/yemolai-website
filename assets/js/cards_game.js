const Suit = {
  spades: "♠",
  hearts: "♥",
  clubs: "♣",
  diamonds: "♦",
};
const CardColor = Object.freeze({ black: "black", red: "red" });
const SuitColor = Object.freeze({
  [Suit.clubs]: CardColor.black,
  [Suit.spades]: CardColor.black,
  [Suit.diamonds]: CardColor.red,
  [Suit.hearts]: CardColor.red,
});
const suits = Object.freeze(Object.values(Suit));
const Rank = Object.freeze({
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  X: "10",
  J: "J",
  Q: "Q",
  K: "K",
  A: "A",
});
const RankValue = Object.freeze({
  [Rank[2]]: 2,
  [Rank[3]]: 3,
  [Rank[4]]: 4,
  [Rank[5]]: 5,
  [Rank[6]]: 6,
  [Rank[7]]: 7,
  [Rank[8]]: 8,
  [Rank[9]]: 9,
  [Rank.X]: 10,
  [Rank.J]: 11,
  [Rank.Q]: 12,
  [Rank.K]: 13,
  [Rank.A]: 1,
});

const ranks = Object.freeze(Object.values(Rank));

const gameState = {
  deck: [],
  playerHand: [],
  leftPlayerHand: [],
  rightPlayerHand: [],
  oppositePlayerHand: [],
  discardPile: [],
};

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function initializeDeck() {
  gameState.deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      gameState.deck.push({ suit, rank });
    });
  });
  shuffle(gameState.deck);
}

function distributePlayerHands() {
  const players = [
    gameState.playerHand,
    gameState.leftPlayerHand,
    gameState.oppositePlayerHand,
    gameState.rightPlayerHand,
  ];
  const playerCount = 4;
  const initialHandSize = 7;
  for (let handSize = 0; handSize < initialHandSize; handSize += 1) {
    for (let playerIdx = 0; playerIdx < playerCount; playerIdx += 1) {
      const card = gameState.deck.pop();
      players[playerIdx].push(card);
    }
  }
}

function discardFromDeckPile() {
  gameState.discardPile.push(gameState.deck.pop());
}

function initializeGame() {
  initializeDeck();
  distributePlayerHands();
  discardFromDeckPile();
  renderGame();
}

function updateGameState(newState) {
  Object.assign(gameState, newState);
  renderGame();
}

function discardCard(card) {
  const { rank, suit } = card;
  const handCard = gameState.playerHand.find(
    (hc) => hc.rank == rank && hc.suit == suit
  );
  if (handCard) {
    gameState.discardPile.push(handCard);
    gameState.playerHand.splice(gameState.playerHand.indexOf(handCard), 1);
  }
  renderGame();
}

function handlePlayerCardClick(event) {
  discardCard({
    rank: event.target.dataset.rank,
    suit: event.target.dataset.suit,
  });
}

function renderGame() {
  const playerHand = document.getElementById("player-hand");
  const leftPlayerHand = document.getElementById("left-player-hand");
  const rightPlayerHand = document.getElementById("right-player-hand");
  const oppositePlayerHand = document.getElementById("opposite-player-hand");
  const deckPile = document.getElementById("deck");
  const discardPile = document.getElementById("discard-pile");

  playerHand.innerHTML = "";
  leftPlayerHand.innerHTML = "";
  rightPlayerHand.innerHTML = "";
  oppositePlayerHand.innerHTML = "";
  deckPile.innerHTML = "";
  discardPile.innerHTML = "";

  gameState.playerHand.forEach((card, handIdx, hand) => {
    const handTotal = hand.length;
    const cardElement = createCardElement({ ...card, handIdx, handTotal });
    cardElement.addEventListener("click", handlePlayerCardClick);
    playerHand.appendChild(cardElement);
  });

  [
    [gameState.leftPlayerHand, leftPlayerHand],
    [gameState.oppositePlayerHand, oppositePlayerHand],
    [gameState.rightPlayerHand, rightPlayerHand],
  ].forEach(([handState, handArea]) => {
    handState.forEach((_card, handIdx) => {
      const handTotal = handState.length;
      const cardElement = createCardBackElement({
        handIdx,
        handTotal,
      });
      handArea.appendChild(cardElement);
    });
  });

  if (gameState.deck.length) {
    gameState.deck
      .forEach((card) => {
        const cardElement = createCardBackElement({ ...card, pile: true });
        deckPile.appendChild(cardElement);
      });
  }

  if (gameState.discardPile.length) {
    gameState.discardPile
      .forEach((card) => {
        const cardElement = createCardElement({ ...card, pile: true });
        discardPile.appendChild(cardElement);
      });
  }
}

// prettier-ignore
const cardGrid = Object.freeze([
  [[4,5,6,7,8,9,10], [2,3], [4,5,6,7,8,9,10]], // row 1
  [[], [10], []], // row 2
  [[9,10], [7, 8], [9,10]], // row 3
  [[6,7, 8], [1,3,5,9], [6,7, 8]], // row 4
  [[9,10], [8], [9,10]], // row 5
  [[], [10], []], // row 6
  [[4,5,6,7,8,9,10], [2,3], [4,5,6,7,8,9,10]], // row 7
]);

function suitGrid(suit, rank) {
  const value = RankValue[rank];
  const color = SuitColor[suit];
  const gridContainer = document.createElement("div");
  gridContainer.className = `art-grid text-${color}`;
  gridContainer.dataset.suit = suit;
  gridContainer.dataset.rank = rank;
  if (value > 10) {
    const specialCell = document.createElement("div");
    specialCell.className = `special-rank ${color} ${rank.toLowerCase()}`;
    return specialCell;
  }
  new Array(cardGrid.length).fill(null).forEach((_, idx) =>
    new Array(cardGrid[0].length).fill(idx).forEach((line, col) => {
      const cell = document.createElement("div");
      cell.className = "suit-cell";
      if (cardGrid[line][col].includes(value)) {
        cell.style.setProperty("--cell-line", line);
        cell.style.setProperty("--cell-col", col);
        cell.dataset.line = line + 1;
        cell.dataset.col = col + 1;
        cell.innerHTML = `${suit}`;
        gridContainer.appendChild(cell);
      }
    })
  );
  return gridContainer;
}

function createCardElement(card) {
  const { suit, rank, handIdx, handTotal, faceDown, pile } = card;
  const cardElement = document.createElement("div");
  if (suit) cardElement.className = `card ${SuitColor[suit]}`;
  if (suit && rank && !faceDown) {
    cardElement.dataset.suit = suit;
    cardElement.dataset.rank = rank;
    const rankEl = `<div class="rank">
      <svg width="9" height="14" preserveAspectRatio="none" viewBox="0 -3 9 12">
        <text x="50%" y="50%" font-size="9" text-anchor="middle" alignment-baseline="middle" fill="${SuitColor[suit]}">
          ${rank}
        </text>
      </svg>
    </div>`
    const suitEl = `<div class="suit">
      <svg width="8" height="12" preserveAspectRatio="none" viewBox="0 -3 9 12">
        <text x="50%" y="50%" font-size="9" text-anchor="middle" alignment-baseline="middle" fill="${SuitColor[suit]}">
          ${suit}
        </text>
      </svg>
    </div>`
    cardElement.innerHTML = `
      <div class="top-left-corner flex flex-col items-center justify-center">
        ${rankEl}${suitEl}
      </div>
      <div class="bottom-right-corner flex flex-col items-center justify-center">
      ${rankEl}${suitEl}
      </div>
    `;
    cardElement.appendChild(suitGrid(suit, rank));
  }
  if (faceDown == true) cardElement.className = "card face-down-card";
  if (pile === true) cardElement.className += " piled";
  if (handIdx !== undefined && handTotal) {
    cardElement.style.setProperty("--hand-idx", `${handIdx}`);
    cardElement.style.setProperty("--hand-total", `${handTotal}`);
  }
  return cardElement;
}

function createCardBackElement(card) {
  return createCardElement({ ...card, faceDown: true });
}

function moveAndFlipCard(card, fromElement, toElement) {
  const gameBoard = document.getElementById("game-board");
  const cardElement = createCardElement(card);
  const backCardElement = createCardBackElement();
  cardElement.classList.add("moving");
  backCardElement.classList.add("moving");
  gameBoard.appendChild(cardElement);
  gameBoard.appendChild(backCardElement);

  const refRect = gameBoard.getBoundingClientRect();
  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();

  const cardTop = `${fromRect.top}px`;
  const cardLeft = `${fromRect.left}px`;

  cardElement.style.top = cardTop;
  cardElement.style.left = cardLeft;
  backCardElement.style.top = cardTop;
  backCardElement.style.left = cardLeft;

  requestAnimationFrame(() => {
    cardElement.style.animation = "faceMoveAndFlip 1.2s forwards";
    backCardElement.style.animation = "backMoveAndFlip 1.2s forwards";

    cardElement.addEventListener(
      "animationend",
      () => {
        cardElement.remove();
        gameState.playerHand.push(card);
        renderGame();
      },
      { once: true }
    );
  });
}

// Example of moving and flipping a card from the deck to the player's hand
document.getElementById("deck").addEventListener("click", () => {
  const card = gameState.deck.pop();
  moveAndFlipCard(
    card,
    document.getElementById("deck"),
    document.getElementById("player-hand")
  );
  updateGameState(gameState);
});

const gameBoard = document.getElementById("game-board");

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  const { innerWidth, innerHeight } = window;
  const xFactor = (-0.5 + (clientX / innerWidth)) / 2;
  const yFactor = (-0.5 + (clientY / innerHeight)) / 2;

  gameBoard.style.setProperty("--board-x-angle", `${(yFactor * -1).toFixed(4)}deg`);
  gameBoard.style.setProperty("--board-y-angle", `${(xFactor * -1).toFixed(4)}deg`);
})

// Initialize the deck and shuffle it
initializeGame();
