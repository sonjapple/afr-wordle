import { WOORDE } from "./woorde.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WOORDE[Math.floor(Math.random() * WOORDE.length)]
console.log(rightGuessString)

function initBoard(){
  let board = document.getElementById('game-board')

  for(let i = 0; i < NUMBER_OF_GUESSES; i++){
    let row = document.createElement('div')
    row.className = 'letter-row'

    for(let j = 0; j < 5; j++){
      let box = document.createElement('div')
      box.className = 'letter-box'
      row.appendChild(box)
    }
    board.appendChild(row)
  }
}
initBoard()

document.addEventListener('keyup', (e) => {
  if(guessesRemaining === 0){
    return
  }

  let pressedKey = String(e.key)
  if(pressedKey === 'Backspace' && nextLetter !== 0){
    deleteLetter()
    return
  }

  if(pressedKey === 'Enter'){
    checkGuess()
    return
  }
  
  let found = pressedKey.match(/[a-z]/gi)
  if(!found || found.length > 1){
    return
  }else {
    insertLetter(pressedKey)
  }
})

let infoText = document.querySelector('h3')

function insertLetter (pressedKey) {
  infoText.innerText = ''
  if (nextLetter === 5) {
      return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let box = row.children[nextLetter]
  animateCSS(box, "pulse")
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

function deleteLetter () {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let box = row.children[nextLetter - 1]
  box.textContent = ""
  box.classList.remove("filled-box")
  currentGuess.pop()
  nextLetter -= 1
}

function checkGuess () {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let guessString = ''
  let rightGuess = Array.from(rightGuessString)

  for (const val of currentGuess) {
      guessString += val
  }

  if (guessString.length != 5) {
    infoText.innerText = "Nie genoeg letters nie!"
    infoText.style.color = '#FD8D14'
      return
  }

  if (!WOORDE.includes(guessString)) {
    infoText.innerText = "Die woord is nie op die lys nie!"
    infoText.style.color = '#FD8D14'
      return
  }

  
  for (let i = 0; i < 5; i++) {
      let letterColor = ''
      let box = row.children[i]
      let letter = currentGuess[i]
      
      let letterPosition = rightGuess.indexOf(currentGuess[i])
      // is letter in the correct guess
      if (letterPosition === -1) {
          letterColor = '#D8D9DA' //grey
      } else {
          // now, letter is definitely in word
          // if letter index and right guess index are the same
          // letter is in the right position 
          if (currentGuess[i] === rightGuess[i]) {
              // shade green 
              letterColor = '#6ECB63'
          } else {
              // shade box yellow
              letterColor = '#F7D060'
          }

          rightGuess[letterPosition] = "#"
      }

      let delay = 250 * i
      setTimeout(()=> {
           //flip box
          animateCSS(box, 'flipInX')
          //shade box
          box.style.backgroundColor = letterColor
          shadeKeyBoard(letter, letterColor)
      }, delay)
  }

  if (guessString === rightGuessString) {
    infoText.innerText = "Jy is reg! Mooi gedaan!"
    infoText.style.color = '#6ECB63'
    guessesRemaining = 0
    return
  } else {
      guessesRemaining -= 1;
      currentGuess = [];
      nextLetter = 0;

      if (guessesRemaining === 0) {
        infoText.innerText = "Jou opsies is verstreke. Jy verloor"
        infoText.style.color = '#C70039'
        infoText.innerText = `Die regte woord was: "${rightGuessString}"`
        infoText.style.color = '#FC70039'
      }
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
      if (elem.textContent === letter) {
          let oldColor = elem.style.backgroundColor
          if (oldColor === 'green') {
              return
          } 

          if (oldColor === 'yellow' && color !== 'green') {
              return
          }

          elem.style.backgroundColor = color
          break
      }
  }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target
  
  if (!target.classList.contains("keyboard-button")) {
      return
  }
  let key = target.textContent

  if (key === "Del") {
      key = "Backspace"
  } 

  document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


// Refresh page button
const refresh = document.getElementById('reset')
function handleClick() {
  window.location.reload();
}
refresh.addEventListener("click", handleClick);

// Change game-board font family
document.getElementById("game-board").style.fontFamily = "Open Sans, sans-serif";