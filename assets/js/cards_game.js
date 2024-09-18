const gameState = {
  deck: ['2H', '3D', '4S', '5C', '6H', '7D', '8S', '9C', '10H', 'JH', 'QH', 'KH', 'AH'],
  playerHand: [],
  leftPlayerHand: [],
  rightPlayerHand: [],
  oppositePlayerHand: []
};

function updateGameState(newState) {
  Object.assign(gameState, newState);
  renderGame();
}

function renderGame() {
  const playerHand = document.getElementById('player-hand');
  const leftPlayerHand = document.getElementById('left-player-hand');
  const rightPlayerHand = document.getElementById('right-player-hand');
  const oppositePlayerHand = document.getElementById('opposite-player-hand');

  playerHand.innerHTML = '';
  leftPlayerHand.innerHTML = '';
  rightPlayerHand.innerHTML = '';
  oppositePlayerHand.innerHTML = '';

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
}

function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.textContent = card;
  return cardElement;
}

function moveCard(card, fromElement, toElement) {
  const cardElement = createCardElement(card);
  cardElement.classList.add('moving');
  document.body.appendChild(cardElement);

  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();

  cardElement.style.top = `${fromRect.top}px`;
  cardElement.style.left = `${fromRect.left}px`;

  requestAnimationFrame(() => {
    cardElement.style.top = `${toRect.top}px`;
    cardElement.style.left = `${toRect.left}px`;

    cardElement.addEventListener('transitionend', () => {
      cardElement.remove();
      toElement.appendChild(createCardElement(card));
    }, { once: true });
  });
}

// Example of moving a card from the deck to the player's hand
document.getElementById('deck').addEventListener('click', () => {
  const card = gameState.deck.pop();
  gameState.playerHand.push(card);
  moveCard(card, document.getElementById('deck'), document.getElementById('player-hand'));
  updateGameState(gameState);
});
