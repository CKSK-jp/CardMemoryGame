const gameContainer = document.getElementById("game");

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
let n = 1;

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

let storedCardID = null;

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);
  const selectedCard = event.target;
  let isMatched = selectedCard.classList[2]
  if (isMatched === 'matched') {
    console.log('this card has been', isMatched);
  } else {
    let currentCardID = selectedCard.id;
    selectedCard.classList.add('revealed');
    if (storedCardID === null) {
      storedCardID = currentCardID;
      selectedCards.push(selectedCard);
      flipped++;
    } else if (storedCardID !== currentCardID) {
      selectedCards.push(selectedCard);
      flipped++;
      console.log('different card selected', flipped);
    }
    console.log(selectedCards)

    if (flipped === 2) {
      setTimeout(() => {
        if (selectedCards[0].classList[0] == selectedCards[1].classList[0]) {
          for (let card of selectedCards) {
            card.classList.add('matched');
          }
        } else {
          for (let card of selectedCards) {
            card.classList.remove('revealed');
            storedCardID = null;
          }
        }
        flipped = 0;
        selectedCards = [];

        if (document.querySelectorAll('.revealed').length === COLORS.length) {
          gameOver = true;
          return;
        }
      }, 1000);
      const numRevealed = document.querySelectorAll('.revealed').length;
      console.log(`num of cards flipped: ${flipped}, game over? ${gameOver}, number of cards revealed: ${numRevealed}`);
    }
  }
}

const resetButton = document.querySelector('#resetGame');
resetButton.addEventListener('click', function () {
  console.log('pressed!');
  let resetClasses = ['revealed', 'matched'];
  let cards = document.querySelectorAll('.revealed');
  console.log(cards[0].classList);
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove(...resetClasses);
  }
})
// when the DOM loads
createDivsForColors(shuffledColors);
