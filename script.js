const gameContainer = document.getElementById("game");
const guessContainer = document.getElementById('guess-count');
const highscoreContainer = document.getElementById('highscore');
const resetButton = document.querySelector('#resetGame');

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);
let selectedCards = [];
let flipped = 0;
let gameOver = false;
let n = 0; //counter to set unique id for each card
let guesses = 0;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // add unique id for each card
    newDiv.setAttribute('id', 'card' + n.toString())
    n++;
    // call a function handleCardClick when a div is clicked on
    // ensure that only two cards can be flipped
    newDiv.addEventListener("click", function (event) {
      if (flipped < 2) {
        handleCardClick(event);
      }
    });

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// no card ID chosen state
let storedCardID = null;

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);
  const selectedCard = event.target;
  const isMatched = selectedCard.classList[2];
  if (isMatched === 'matched') {
    console.log('this card has been', isMatched);
  } else {
    selectedCard.classList.add('revealed');
    checkCardID(selectedCard);

    if (flipped === 2) {
      checkCardMatch(selectedCards);
      guesses++;
      guessContainer.innerText = 'Guess #: ' + guesses;
    }
  }
}



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

function checkCardMatch(listOfCards) {
  setTimeout(() => {
    if (listOfCards[0].classList[0] == listOfCards[1].classList[0]) {
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
    if (numRevealed === COLORS.length) {
      let finalScore = guesses;
      console.log('GOOD JOB! Final Score: ' + finalScore);
      localStorage.setItem('currentScore', JSON.stringify(finalScore));
      highscoreContainer.innerText = 'Highscore: ' + getLowestScore(finalScore);
    }
    storedCardID = null;
    flipped = 0;
    selectedCards = [];
  }, 1000);
}

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

resetButton.addEventListener('click', function () {
  let resetClasses = ['revealed', 'matched'];
  let cards = document.querySelectorAll('.revealed');
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove(...resetClasses);
  }
  guesses = 0;
  guessContainer.innerText = 'Guess #: ' + guesses;

  gameContainer.innerHTML = '';
  createDivsForColors(shuffledColors);
})

// retrieve saved highscore
let savedHighscore = JSON.parse(localStorage.getItem('bestScore'));
if (savedHighscore == null) {
  highscoreContainer.innerHTML = 'Highscore: ' + 0;
} else {
  highscoreContainer.innerHTML = 'Highscore:' + savedHighscore;
}

// when the DOM loads
createDivsForColors(shuffledColors);
