const gameContainer = document.querySelector(".game-board");
const guessContainer = document.getElementById('guess-count');
const highscoreContainer = document.getElementById('highscore');
const resetButton = document.querySelector('#resetGame');

const faceCards = [
  "archmage",
  "edwin",
  "grommash",
  "spider",
  "jaraxx",
  "kingkrush",
  "archmage",
  "edwin",
  "grommash",
  "spider",
  "jaraxx",
  "kingkrush"
];

let selectedCards = [];
let flipped = 0;
let gameOver = false;
let n = 0; //counter to set unique id for each card
let guesses = 0;
guessContainer.innerText = 'Guess #: ' + guesses;

// Helper function to shuffle using Fisher Yates algorithm 
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// Function loops over the array of faceCards creating a new div for each one
// Also adds an event listener for a click for each card
function createCards(faceArray) {
  shuffle(faceArray);
  for (let face of faceArray) {
    const newCardContainer = document.createElement("div");
    newCardContainer.classList.add('card-container');
    gameContainer.append(newCardContainer);

    const card = document.createElement('div');
    card.classList.add('card');
    newCardContainer.append(card);

    const cardBack = document.createElement("div");
    cardBack.classList.add('card-body', 'card-back');
    card.append(cardBack);

    const cardFace = document.createElement("div");
    cardFace.classList.add('card-body', face);
    card.append(cardFace);

    // add unique id for each card
    card.setAttribute('id', 'card' + n.toString())
    n++;

    // initiate handleCardClick when card is clicked
    card.addEventListener("click", handleCardClick);
  }
}

// validates user choice, if not a already matched card, add a reveal class and check the ID of the card
function handleCardClick(event) {
  if (flipped < 2) {
    const selectedCard = event.currentTarget;
    const isMatched = selectedCard.classList[2];
    console.log('num flipped:', flipped);
    if (isMatched === 'matched') {
      console.log('this card has been', isMatched, flipped);
    } else {
      selectedCard.classList.add('revealed');
      console.log('has been revealed!');
      checkCardID(selectedCard);
      // if the user successfully flips 2 cards, check if they match
      if (flipped === 2) {
        checkCardMatch(selectedCards);
        guesses++;
        guessContainer.innerText = 'Guess #: ' + guesses;
      }
    }
  }
}

// no card ID chosen state
let storedCardID = null;
// check if the id of the currently selected card differs from the previous card.
function checkCardID(card) {
  let currentCardID = card.id;
  if (storedCardID === null) {
    storedCardID = currentCardID;
    selectedCards.push(card);
    console.log('first card selected');
    return flipped++;
  } else if (storedCardID !== currentCardID) {
    selectedCards.push(card);
    console.log('different card selected');
    return flipped++;
  } else {
    console.log('same card selected!');
  }
}

// grab the children class and compare to see if they match, add matched class to matching cards
function checkCardMatch(listOfCards) {
  setTimeout(() => {
    firstFaceCard = listOfCards[0].querySelector(':nth-child(2)').classList[1];
    secondFaceCard = listOfCards[1].querySelector(':nth-child(2)').classList[1];
    if (firstFaceCard == secondFaceCard) {
      for (let card of listOfCards) {
        card.classList.add('matched');
      }
      console.log('matched!');
    } else {
      for (let card of listOfCards) {
        card.classList.remove('revealed');
      }
      console.log('not a match!')
    }

    // check if user matches everything
    const numRevealed = document.querySelectorAll('.revealed').length;
    if (numRevealed === faceCards.length) {
      let finalScore = guesses;
      alert('GOOD JOB! Final Score: ' + finalScore);
      localStorage.setItem('currentScore', JSON.stringify(finalScore));
      highscoreContainer.innerText = 'Highscore: ' + getLowestScore(finalScore);
    }
    storedCardID = null;
    flipped = 0;
    selectedCards = [];
  }, 1000);
}

// grab scores from localStorage and check for highscore
function getLowestScore(score) {
  let currentScore = JSON.parse(localStorage.getItem('currentScore'));
  let bestScore = JSON.parse(localStorage.getItem('bestScore'));
  // if you have no highscore then set current score as the new best score
  if (bestScore === null) {
    localStorage.setItem('bestScore', JSON.stringify(score));
    console.log('setted a new highscore!')
    return score;
    // if user beats old score, replace oldscore with new score, return new score
  } else if (score < bestScore) {
    localStorage.setItem('bestScore', JSON.stringify(score));
    console.log('New HIGHSCORE!');
    return currentScore;
    // if user doesnt beat the old score, then return the best score on storage;
  } else {
    console.log('you didnt beat your score!');
    return bestScore;
  }
}

// handle game reset
resetButton.addEventListener('click', function () {
  let resetClasses = ['revealed', 'matched'];
  let cards = document.querySelectorAll('.revealed');
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove(...resetClasses);
  }
  guesses = 0;
  guessContainer.innerText = 'Guess #: ' + guesses;

  gameContainer.innerHTML = '';
  createCards(faceCards);
})

// retrieve saved highscore
let savedHighscore = JSON.parse(localStorage.getItem('bestScore'));
if (savedHighscore == null) {
  highscoreContainer.innerHTML = 'Highscore: ' + 0;
} else {
  highscoreContainer.innerHTML = 'Highscore: ' + savedHighscore;
}

// when the DOM loads
createCards(faceCards);
