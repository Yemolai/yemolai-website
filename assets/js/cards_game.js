const suits = ['♠', '♥', '♦', '♣'];
const redSuits = ['♥', '♦'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const gameState = {
  deck: [],
  playerHand: [],
  leftPlayerHand: [],
  rightPlayerHand: [],
  oppositePlayerHand: [],
  discardPile: []
};

function initializeDeck() {
  gameState.deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      gameState.deck.push({ suit, rank });
    });
  });
  shuffleDeck();
}

function shuffleDeck() {
  for (let i = gameState.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
  }
}

function updateGameState(newState) {
  Object.assign(gameState, newState);
  renderGame();
}

function renderGame() {
  const playerHand = document.getElementById('player-hand');
  const leftPlayerHand = document.getElementById('left-player-hand');
  const rightPlayerHand = document.getElementById('right-player-hand');
  const oppositePlayerHand = document.getElementById('opposite-player-hand');
  const discardPile = document.getElementById('discard-pile');

  playerHand.innerHTML = '';
  leftPlayerHand.innerHTML = '';
  rightPlayerHand.innerHTML = '';
  oppositePlayerHand.innerHTML = '';
  discardPile.innerHTML = '';

  gameState.playerHand.forEach(card => {
    const cardElement = createCardElement(card);
    playerHand.appendChild(cardElement);
  });

  gameState.leftPlayerHand.forEach(card => {
    const cardElement = createCardElement(card);
    leftPlayerHand.appendChild(cardElement);
  });

  gameState.rightPlayerHand.forEach(card => {
    const cardElement = createCardElement(card);
    rightPlayerHand.appendChild(cardElement);
  });

  gameState.oppositePlayerHand.forEach(card => {
    const cardElement = createCardElement(card);
    oppositePlayerHand.appendChild(cardElement);
  });

  gameState.discardPile.forEach(card => {
    const cardElement = createCardElement(card);
    discardPile.appendChild(cardElement);
  });
}

function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.className = `card ${redSuits.includes(card.suit) ? 'red' : 'black'}`;
  cardElement.innerHTML = `<div>${card.rank}</div><div class="suit">${card.suit}</div>`;
  return cardElement;
}

function createCardBackElement() {
  const faceDownCardElement = document.createElement('div');
  faceDownCardElement.className = 'card face-down-card';
  return faceDownCardElement;
}

function moveAndFlipCard(card, fromElement, toElement) {
  const gameBoard = document.getElementById('game-board');
  const cardElement = createCardElement(card);
  const backCardElement = createCardBackElement();
  cardElement.classList.add('moving');
  cardElement.classList.add('moving');
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
    cardElement.style.animation = 'faceMoveAndFlip 1.2s forwards';
    backCardElement.style.animation = 'backMoveAndFlip 1.2s forwards';

    cardElement.addEventListener('animationend', () => {
      cardElement.remove();
      gameState.playerHand.push(card);
      toElement.appendChild(createCardElement(card));
    }, { once: true });
  });
}

// Example of moving and flipping a card from the deck to the player's hand
document.getElementById('deck').addEventListener('click', () => {
  const card = gameState.deck.pop();
  moveAndFlipCard(card, document.getElementById('deck'), document.getElementById('player-hand'));
  updateGameState(gameState);
});

// Initialize the deck and shuffle it
initializeDeck();
updateGameState(gameState);
