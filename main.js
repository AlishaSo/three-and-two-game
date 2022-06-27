import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();
import img from './card_back.svg';
// const img = './card_back.svg'

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
const usersNameScoreEl = document.querySelector('#player1-score-span');
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
    // console.log(info)
    deckId = await info.data.deck_id;
    // console.log(deckId)
  } catch(e) {
    console.error(e);
  }
}
// getCardDeck();

const drawCard = async count => {
  // const deckId = await getCardDeck();
  // console.log(deckId)
  // await getCardDeck();
  try {
    let info = await axios.get(`${BASE_URL}${deckId}/draw/?count=${count}`);
    // console.log(info)
    return info.data.cards;
  } catch (e) {
    console.error(e);
  }
}
// drawCard(5)

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
// setupTable();

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
  console.log(pickedUpCard)
  if(pickedUpCard != null) {
    // let index = discardCardArr.length == 2 ? 1 : 0;

    // discardCardArr.push(pickedUpCard);
    // discardCard[pickedUpCard]
    // addCardToApiPile()
    // .then(nothing => {
    //   let p = pickedUpCard
      discardCard = pickedUpCard
      // discardCardArr.shift();
      discardPileImg.src = discardCard.image;
      pickedUpCard = null;
      pickupPileImg.src = img;

    // })
  }
  else {
    console.log(discardCard);
  }
  if(count == 2)
    if(endUserTurn) endUserTurn();
}

const waitForClick = () => {
  return new Promise(resolve => endUserTurn = resolve);
}

const addEventListenerToUsersCards = e => {
  // let here = e.currentTarget
  let currentCardIndex = e.currentTarget.id;

  for(let n = 0; n < player1Hand.length; n++) {
    if(player1Hand[n].code == currentCardIndex) {
      currentCardIndex = n;
      break;
    }
  }
  
  if(pickedUpCard != null) {
    // addCardToApiPile()
    // .then(nothing => {
    //   let index = currentCardIndex
      discardCard = player1Hand[currentCardIndex]
      player1Hand[currentCardIndex] = pickedUpCard;
      e.currentTarget.innerHTML = `<img id='${pickedUpCard.value}' src='${pickedUpCard.image}' alt=''/>`;
      discardPileImg.src = discardCard.image;
      pickupPileImg.src = img;
      pickedUpCard = null;
    // })
  }
  else {
    // addCardToApiPile()
    // .then(nothing => {
      // let index = currentCardIndex
      discardCard = player1Hand[currentCardIndex]
      player1Hand[currentCardIndex] = discardCard;
      e.currentTarget.innerHTML = `<img id='${discardCard.code}' src='${discardCard.image}' alt=''/>`;
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

  if(countObj.length == 2) {
    player == 'user' ?
    alert('Player1 has won! 😁🙌🏽')
    :
    alert('The computer has won ☹️')
    keepPlaying = false;
    return;
  }
  usersTurn = !usersTurn;
  return;
}

const shouldComputerTakeDiscard = cardValsArr => {
  // let cardNumExists;

  for(const c of computersHand) {
    if(c.value == discardCard.value) {
      // cardNumExists = true;
      let temp = discardCard;
      const foundIndex = cardValsArr.findIndex(card => {
        if(card[0] != temp.value && card[1] == 1) {
          return card;
        }
      });
      
      // addCardToApiPile()
      // .then(nothing => {
      //   let index = foundIndex
      //   let t = temp
        discardCard = computersHand[foundIndex]
        computersHand[foundIndex] = temp;
        discardPileImg.src = discardCard.image;

        /****** FOR TESTING ONLY  ******/
        computersCards[foundIndex].innerHTML = `<img src='${temp.image}' alt=''/>`;
        /*************     ************/
      // })
      if(endUserTurn) endUserTurn();
      return true;
    }
    else
      return false;
  }
  // return cardNumExists;
}

const computerPickUp = (cardValsArr) => {
  let cardNumExists = false;
  // let here = pickedUpCard
  
  for(const c of computersHand) {
    if(c.value == pickedUpCard.value) {
      cardNumExists = true;
      const foundIndex = cardValsArr.findIndex(card => {
        if(card[0] != pickedUpCard.value && card[1] == 1) {
          return card;
        }
      });
      
      // addCardToApiPile()
      // .then(nothing => {
      //   let index = foundIndex
        discardCard = computersHand[foundIndex]
        computersHand[index] = pickedUpCard;
        discardPileImg.src = discardCard.image;

        /****** FOR TESTING ONLY  ******/
        computersCards[foundIndex].innerHTML = `<img src='${pickedUpCard.image}' alt=''/>`;
        /*************     ************/
      // })
      // pickedUpCard = null;
      break;
    }
  }

  if(!cardNumExists) {
      // addCardToApiPile()
      // .then(nothing => {
        discardPileImg.src = pickedUpCard.image;
        console.log(pickedUpCard)
      // })
  }
        pickedUpCard = null;
        if(endUserTurn) endUserTurn();
}

const playGame = async () => {
  await setupTable()
  let keepPlaying = true;
  let usersName = '';
  let i = 0;
  let count = 0;

  usersName = window.prompt('Please enter your name 👇🏽');
  if(usersName != null) {
    usersNameEl.textContent = usersName;
    usersNameScoreEl.textContent = usersName;
  }

  while(keepPlaying) {

  if(usersTurn) {
    console.log('user\'s turn')

    pickupPile.addEventListener('click', () => {
      count++
      pick()
    }, false);
    discardPile.addEventListener('click', () => {
      count++
      dis(count)
    }, false);
    player1Cards.forEach(card => card.addEventListener('click', event => addEventListenerToUsersCards(event), false));

    await waitForClick();

    pickupPile.removeEventListener('click', pick, false);
    discardPile.removeEventListener('click', dis, false);
    player1Cards.forEach(card => card.removeEventListener('click', event => addEventListenerToUsersCards(event), false));

    // checkForWinner(player1Hand, 'user')
    if(!checkForWinner(player1Hand, 'user')) {
      usersTurn = false;
    }
  }
  
  else {
    console.log('computer\'s turn')

    let cardValsArr = [];

    computersHand.forEach((card, index) => {
      cardValsArr.includes(card.value) ?
      cardValsArr[index][1] += 1
      :
      cardValsArr.push([card.value, 1]);
    });

    if(!shouldComputerTakeDiscard(cardValsArr)) {
      pickedUpCard = await drawCard(1);
      cardsLeftNum -= 1;
      cardsLeftEL.textContent = cardsLeftNum;
      console.log(pickedUpCard)
      computerPickUp(cardValsArr);
      await waitForClick();
    }
    
    if(!checkForWinner(computersHand, 'computer')) {
      usersTurn = true;
    }
  }
  i++; console.log({i})
  }
  console.log('outside while loop')
}
playGame();

// const test = async () => {
//   console.log(pickedUpCard, 'inside test')
//   pickedUpCard = await drawCard(1);
//   pickedUpCard = pickedUpCard[0]
//   console.log(pickedUpCard, 'right before end test')
//   return;
// }

// const afterBtnClick = () => {
//   checkForWinner(player1Hand, 'user');

//   if(!usersTurn) {
//     console.log('computer\'s turn')

//     let cardValsArr = [];

//     computersHand.forEach((card, index) => {
//       cardValsArr.includes(card.value) ?
//       cardValsArr[index][1] += 1
//       :
//       cardValsArr.push([card.value, 1]);
//     });

//     if(!shouldComputerTakeDiscard(cardValsArr)) {
//       drawCard(1)
//       .then(card => {
//         pickedUpCard = card;
//       console.log(pickedUpCard)
//       cardsLeftNum -= 1;
//       cardsLeftEL.textContent = cardsLeftNum;
//       computerPickUp(cardValsArr);
//       })
//     }
    
//     checkForWinner(computersHand, 'computer')
//   }
// }