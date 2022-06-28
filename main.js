import axios from './node_modules/axios';
// import dotenv from 'dotenv';
// dotenv.config();
// import img from './card_back.svg';
const img = new URL('card_back.svg', import.meta.url);

const BASE_URL = 'http://deckofcardsapi.com/api/deck/'//process.env.BASE_URL;
let player1Cards = document.querySelectorAll('.card-btn');
player1Cards = Array.from(player1Cards);
let computersCards = document.querySelectorAll('#player2-cards .card');
computersCards = Array.from(computersCards);
const pickupPile = document.querySelector('#pickup-pile');
const discardPile = document.querySelector('#discard-pile');
const discardListName = 'discard';
const discardPileImg = document.querySelector('#discard-pile-img');
const pickupPileImg = document.querySelector('#pickup-pile-img');
const nextBtn = document.querySelector('#next-btn');
const usersNameEl = document.querySelector('#player1-name');
const usersNameScoreEl = document.querySelector('#player1-name-span');
const cardsLeftEL = document.querySelector('#cards-left span');
let deckId;
let player1Hand;
let computersHand;
let discardCard;
let pickedUpCard = null;
let cardsLeftNum = 42;
let usersTurn = true;
let endUserTurn;

 const getCardDeck = async () => {
  try {
    let info = await axios.get(`${BASE_URL}new/shuffle/?deck_count=1`);
    deckId = await info.data.deck_id;
  } catch(e) {
    console.error(e);
  }
}

const drawCard = async count => {
  try {
    let info = await axios.get(`${BASE_URL}${deckId}/draw/?count=${count}`);
    return info.data.cards;
  } catch (e) {
    console.error(e);
  }
}

const setupTable = async () => {
  await getCardDeck();

  player1Hand = await drawCard(5);
  computersHand = await drawCard(5);
  discardCard = await drawCard(1); discardCard = discardCard[0]

  discardPileImg.src = discardCard.image;

  for(let i = 0; i < 5; i++) {
    player1Cards[i].innerHTML = `<img src='${player1Hand[i].image}' alt=''/>`;
    player1Cards[i].setAttribute('id', player1Hand[i].code);
    
    computersCards[i].innerHTML = `<img src='${computersHand[i].image}' alt=''/>`;
  }
}

const pick = async () => {
  try {
    pickedUpCard = await drawCard(1);
    pickedUpCard = pickedUpCard[0];
    cardsLeftNum -= 1;
    cardsLeftEL.textContent = cardsLeftNum;
    pickupPileImg.setAttribute('src', pickedUpCard.image);
  }
  catch(e) {
    console.error(e);
  }
}

const addCardToApiPile = async () => {
  try {
    await axios.get(`${BASE_URL}/${deckId}/pile/${discardListName}/add/?cards=${discardCard.code}`);
  }
  catch(e) {
    console.error(e);
  }
}

const dis = (count) => {
  if(pickedUpCard != null) {
    // addCardToApiPile()
    // .then(nothing => {
      discardCard = pickedUpCard
      discardPileImg.src = discardCard.image;
      pickedUpCard = null;
      pickupPileImg.src = img;

    // })
  }
  if(count == 2)
    if(endUserTurn) endUserTurn();
}

const waitForClick = () => {
  return new Promise(resolve => endUserTurn = resolve);
}

const addEventListenerToUsersCards = e => {
  let currentCardIndex = e.currentTarget.id;
  let temp = pickedUpCard ? pickedUpCard : discardCard;

  for(let n = 0; n < player1Hand.length; n++) {
    if(player1Hand[n].code == currentCardIndex) {
      currentCardIndex = n;
      break;
    }
  }
  
  if(pickedUpCard != null) {
    // addCardToApiPile()
    // .then(nothing => {
      console.log('user event if'+player1Hand[currentCardIndex])
      discardCard = player1Hand[currentCardIndex]
      player1Hand[currentCardIndex] = temp;
      e.currentTarget.innerHTML = `<img id='${player1Hand[currentCardIndex].value}' src='${player1Hand[currentCardIndex].image}' alt=''/>`;
      discardPileImg.src = discardCard.image;
      pickupPileImg.src = img;
      pickedUpCard = null;
    // })
  }
  else {
    // addCardToApiPile()
    // .then(nothing => {
      discardCard = player1Hand[currentCardIndex]
      player1Hand[currentCardIndex] = temp;
      e.currentTarget.innerHTML = `<img id='${player1Hand[currentCardIndex].code}' src='${player1Hand[currentCardIndex].image}' alt=''/>`;
      discardPileImg.src = discardCard.image;
    // })
  }
  if(endUserTurn) endUserTurn();
}

const checkForWinner = (cardPile, player) => {
  let countObj = {}
  
  cardPile.forEach(card => {
    countObj[card.value] ? 
    countObj[card.value] += 1 
    : 
    countObj[card.value] = 1;
  });
  
  if(Object.keys(countObj).length == 2) {
    player == 'user' ?
    alert('Player1 has won! 😁🙌🏽')
    :
    alert('The computer has won ☹️')
    return true;
  }
  return false;
}

const shouldComputerTakeDiscard = countObj => {
  let cardNumExists = false;
  let temp = discardCard;
  let foundIndex;

console.log(countObj)
  if(computersHand.some(c => c.value == temp.value) && countObj[temp.value].count < 3) {
    cardNumExists = true;
        for(const key in countObj) {
          if(key != temp.value && countObj[key].count == 1)
            foundIndex = countObj[key].index;
            break;
        }
      console.log(foundIndex)
      
      // addCardToApiPile()
      // .then(nothing => {
        discardCard = computersHand[foundIndex]
        computersHand[foundIndex] = temp;
        discardPileImg.src = discardCard.image;

        /****** FOR TESTING ONLY  ******/
        computersCards[foundIndex].innerHTML = `<img src='${temp.image}' alt=''/>`;
        /*************     ************/
      // })
  }
console.log(computersHand)
  return cardNumExists;
}

const computerPickUp = countObj => {
console.log(countObj)
  let cardNumExists = false;
  let temp = pickedUpCard[0];
  let foundIndex;
  // for(const c of computersHand) {
  //   if(c.value == temp.value) {
    if(computersHand.some(c => c.value == temp.value) && countObj[temp.value].count < 3) {
      cardNumExists = true;
      
      for(const key in countObj) {
        if(key != temp.value && countObj[key].count == 1)
          foundIndex = countObj[key].index;
          break;
      }
      console.log(foundIndex)
      
      // addCardToApiPile()
      // .then(nothing => {
        discardCard = computersHand[foundIndex]
        computersHand[foundIndex] = temp;
        discardPileImg.src = discardCard.image;

        /****** FOR TESTING ONLY  ******/
        computersCards[foundIndex].innerHTML = `<img src='${temp.image}' alt=''/>`;
        /*************     ************/
      // })
      // pickedUpCard = null;
    }

  if(!cardNumExists) {
      // addCardToApiPile()
      // .then(nothing => {
        discardCard = temp;
        discardPileImg.src = temp.image;
        console.log(temp)
      // })
  }
  pickedUpCard = null;
console.log(computersHand)
}

const playGame = async () => {
  await setupTable()
  let keepPlaying = true;
  let usersName = '';
  let i = 0;
  let count = 0;

  if(checkForWinner(player1Hand, 'user') || checkForWinner(computersHand, 'computer')) {
    alert('You lucked out and won without even lifting a finger! 🎉👌🏽');
  }
  
  const drawBtn = () => {
    count++;
    pick();
  }
  const disBtn = () => {
    count++;
    dis(count);
  }
  const cardsBtns = event => {
    addEventListenerToUsersCards.bind(this)(event);
  }

  const addClickListeners = () => {
    pickupPile.addEventListener('click', drawBtn, false);
    discardPile.addEventListener('click', disBtn, false);
    player1Cards.forEach(card => card.addEventListener('click', cardsBtns, false));
  }

  const removeClickListeners = () => {
    pickupPile.removeEventListener('click', drawBtn, false);
    discardPile.removeEventListener('click', disBtn, false);
    player1Cards.forEach(card => card.removeEventListener('click', cardsBtns, false));
  }

  usersName = window.prompt('Please enter your name 👇🏽');
  if(usersName) {
    usersNameEl.textContent = usersName;
    usersNameScoreEl.textContent = usersName;
  }

  addClickListeners(count);

  while(keepPlaying) {
    if(usersTurn) {
      console.log('user\'s turn')
      count = 0;

      await waitForClick();

      if(!checkForWinner(player1Hand, 'user')) {
        usersTurn = false;
      }
      else
        keepPlaying = false;
    }
  
    else {
      console.log('computer\'s turn')

      let countObj = {};
      
      computersHand.forEach((card, index) => {
        countObj[card.value] ? 
        countObj[card.value].count += 1 
        : 
        countObj[card.value] = {count: 1, index};
      });

      if(!shouldComputerTakeDiscard(countObj)) {
        pickedUpCard = await drawCard(1);
        cardsLeftNum -= 1;
        cardsLeftEL.textContent = cardsLeftNum;
        computerPickUp(countObj);
      }
      
      if(!checkForWinner(computersHand, 'computer')) {
        usersTurn = true;
      }
      else
        keepPlaying = false;
    }
  i++; console.log({i})
  }
  removeClickListeners();
}
playGame();
