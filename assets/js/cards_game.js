const suits = ["♠", "♥", "♦", "♣"];
const redSuits = ["♥", "♦"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const gameState = {
  deck: [],
  playerHand: [],
  leftPlayerHand: [],
  rightPlayerHand: [],
  oppositePlayerHand: [],
  discardPile: [],
};

function shuffleDeck() {
  for (let cardAIdx = gameState.deck.length - 1; cardAIdx > 0; cardAIdx -= 1) {
    const cardBIdx = Math.floor(Math.random() * (cardAIdx + 1));
    const cardA = gameState.deck[cardAIdx];
    const cardB = gameState.deck[cardBIdx];
    [gameState.deck[cardAIdx], gameState.deck[cardBIdx]] = [cardA, cardB];
  }
}

function initializeDeck() {
  gameState.deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      gameState.deck.push({ suit, rank });
    });
  });
  shuffleDeck();
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

function initializeGame() {
  initializeDeck();
  distributePlayerHands();
  renderGame();
}

function updateGameState(newState) {
  Object.assign(gameState, newState);
  renderGame();
}

function renderGame() {
  const playerHand = document.getElementById("player-hand");
  const leftPlayerHand = document.getElementById("left-player-hand");
  const rightPlayerHand = document.getElementById("right-player-hand");
  const oppositePlayerHand = document.getElementById("opposite-player-hand");
  const discardPile = document.getElementById("discard-pile");

  playerHand.innerHTML = "";
  leftPlayerHand.innerHTML = "";
  rightPlayerHand.innerHTML = "";
  oppositePlayerHand.innerHTML = "";
  discardPile.innerHTML = "";

  console.log({ gameState });

  gameState.playerHand.forEach((card, handIdx, hand) => {
    const handTotal = hand.length;
    const cardElement = createCardElement({ ...card, handIdx, handTotal });
    playerHand.appendChild(cardElement);
  });

  [
    gameState.leftPlayerHand,
    gameState.oppositePlayerHand,
    gameState.rightPlayerHand,
  ].forEach((playerHand) => {
    playerHand.forEach((card, handIdx) => {
      const handTotal = playerHand.length;
      const cardElement = createCardBackElement({
        ...card,
        handIdx,
        handTotal,
      });
      playerHand.appendChild(cardElement);
    });
  });

  gameState.discardPile
    .slice()
    .reverse()
    .slice(0, 5)
    .forEach((card) => {
      const cardElement = createCardElement(card);
      discardPile.appendChild(cardElement);
    });
}

function createCardElement(card) {
  const { suit, rank, handIdx, handTotal, faceDown } = card;
  const cardElement = document.createElement("div");
  if (suit)
    cardElement.className = `card ${redSuits.includes(suit) ? "red" : "black"}`;
  if (suit && rank)
    cardElement.innerHTML = `<div class="rank">${rank}</div><div class="suit">${suit}</div>`;
  if (faceDown) cardElement.className = "card face-down-card";
  if (handIdx !== undefined && handTotal) {
    cardElement.style.setProperty("--hand-idx", `${handIdx}`);
    cardElement.style.setProperty("--hand-total", `${handTotal}`);
  }
  return cardElement;
}

function createCardBackElement(card) {
  return createCardElement({ ...card, faceDown });
}

function moveAndFlipCard(card, fromElement, toElement) {
  const gameBoard = document.getElementById("game-board");
  const cardElement = createCardElement(card);
  const backCardElement = createCardBackElement();
  cardElement.classList.add("moving");
  cardElement.classList.add("moving");
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
        toElement.appendChild(createCardElement(card));
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

// Initialize the deck and shuffle it
initializeGame();
