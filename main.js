// import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();
// import img from './card_back.svg';
const img = 'card_back.svg'

const BASE_URL = 'http://deckofcardsapi.com/api/deck/'//process.env.BASE_URL;
let deckId;
let player1Cards = document.querySelectorAll('.card-btn');
player1Cards = Array.from(player1Cards);
let computersCards = document.querySelectorAll('#player2-cards .card');
computersCards = Array.from(computersCards);
const pickupPile = document.querySelector('#pickup-pile');
const discardPile = document.querySelector('#discard-pile');
const discardListName = 'discard';
const pickupPileImg = document.querySelector('#pickup-pile-img');
let player1Hand;
let computersHand;
let discardCardArr;
let pickedUpCard = null;
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
  discardCardArr = await drawCard(1);

  discardPile.innerHTML = `<img src='${discardCardArr[0].image}' alt=''/>`;

  for(let i = 0; i < 5; i++) {
    player1Cards[i].innerHTML = `<img src='${player1Hand[i].image}' alt=''/>`;
    player1Cards[i].setAttribute('id', player1Hand[i].code);
    
    computersCards[i].innerHTML = `<img src='${computersHand[i].image}' alt=''/>`;
  }
}
// setupTable();

const pick = async () => {
    pickedUpCard = await drawCard(1);
    pickedUpCard = pickedUpCard[0];
    // console.log(pickedUpCard)
    pickupPileImg.setAttribute('src', pickedUpCard.image);
}

const addCardToApiPile = async index => {
  await axios.get(`${BASE_URL}/${deckId}/pile/${discardListName}/add/?cards=${discardCardArr[index].code}`);
}

const dis = async () => {
  if(pickedUpCard != null) {
    let index = discardCardArr.length == 2 ? 1 : 0;
    discardCardArr.push(pickedUpCard);
    addCardToApiPile(0);
      // console.log(discardCardArr)
    discardCardArr.shift();
    discardPile.innerHTML = `<img src='${discardCardArr[index].image}' alt=''/>`;
    pickedUpCard = null;
    pickupPileImg.src = img;
  }
}

const waitForClick = () => {
  return new Promise(resolve => endUserTurn = resolve);
}

const addEventListenerToUsersCards = e => {
  let currentCardIndex = e.currentTarget.id;

  for(const c of player1Hand) {
    if(c.code == currentCardIndex) {
      currentCardIndex = player1Hand.indexOf(c);
      break;
    }
  }
  
  if(pickedUpCard != null) {
    addCardToApiPile(0);
    discardCardArr.shift();
    discardCardArr.push(player1Hand[currentCardIndex]);
    player1Hand[currentCardIndex] = pickedUpCard;
    e.currentTarget.innerHTML = `<img id='${pickedUpCard.value}' src='${pickedUpCard.image}' alt=''/>`;
    console.log(discardCardArr.length - 1)
    discardPile.innerHTML = `<img src='${discardCardArr[discardCardArr.length - 1].image}' alt=''/>`;
    pickupPileImg.src = img;
    pickedUpCard = null;
  }
  else {
    let index = discardCardArr.length == 2 ? 1 : 0;

    discardCardArr.push(player1Hand[currentCardIndex]);
    player1Hand[currentCardIndex] = discardCardArr[index];
    e.currentTarget.innerHTML = `<img id='${discardCardArr[index].code}' src='${discardCardArr[index].image}' alt=''/>`;
    addCardToApiPile(index);
    discardCardArr.splice(index, 1);
    discardPile.innerHTML = `<img src='${discardCardArr[discardCardArr.length - 1].image}' alt=''/>`;
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
    tempBool = false;
    return true;
  }
  return false;
}

const playGame = async () => {
  await setupTable();
  let tempBool = true;

  let i = 0;
  while(tempBool) {

  if(usersTurn) {
    console.log('inside usersTurn if')

    pickupPile.addEventListener('click', pick, false);
    discardPile.addEventListener('click', dis, false);
    player1Cards.forEach(card => card.addEventListener('click', event => addEventListenerToUsersCards(event), false));

    await waitForClick();

    if(!checkForWinner(player1Hand, 'user')) {
      pickupPile.removeEventListener('click', pick, false);
      discardPile.removeEventListener('click', dis, false);
      player1Cards.forEach(card => card.removeEventListener('click', event => addEventListenerToUsersCards(event), false));
      usersTurn = false;
    }
  }
  
  else {
    console.log('computer\'s turn')

    let index = discardCardArr.length == 2 ? 1 : 0;
    let cardValsArr = [];

    computersHand.forEach((card, index) => {
      cardValsArr.includes(card.value) ?
      cardValsArr[index][1] += 1
      :
      cardValsArr.push([card.value, 1]);
    });

    for(const c of computersHand) {
      if(c.value == discardCardArr[index].value) {
        let temp = discardCardArr[index];
        const foundIndex = cardValsArr.findIndex(card => {
          if(card[0] != temp.value && card[1] == 1) {
            return card;
          }
        });
        
        discardCardArr.push(computersHand[foundIndex]);
        discardCardArr.splice(index, 1);
        discardPile.innerHTML = `<img src='${discardCardArr[discardCardArr.length - 1].image}' alt=''/>`;
        computersHand[foundIndex] = temp;

        /****** FOR TESTING ONLY  ******/
        computersCards[foundIndex].innerHTML = `<img src='${temp.image}' alt=''/>`;
        /*************     ************/
        break;
      }
      else {
        pickedUpCard = await drawCard(1);
        pickedUpCard = pickedUpCard[0];

        if(c.value == pickedUpCard.value) {
          const foundIndex = cardValsArr.findIndex(card => {
            if(card[0] != pickedUpCard.value && card[1] == 1) {
              return card;
            }
          });
          computersHand[foundIndex] = pickedUpCard;
                  // let test2=discardCardArr.length - 1
          discardPile.innerHTML = `<img src='${discardCardArr[(discardCardArr.length - 1)].image}' alt=''/>`;

          /****** FOR TESTING ONLY  ******/
          computersCards[foundIndex].innerHTML = `<img src='${pickedUpCard.image}' alt=''/>`;
          /*************     ************/

          pickedUpCard = null;
          break;
        }
      }
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