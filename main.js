import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import img from './card-back-black.png';

const BASE_URL = process.env.BASE_URL;
let deckId;
let player1Cards = document.querySelectorAll('#player1-cards .card');
player1Cards = Array.from(player1Cards);
let computersCards = document.querySelectorAll('#player2-cards .card');
computersCards = Array.from(computersCards);
const pickupPile = document.querySelector('#pickup-pile');
const discardPile = document.querySelector('#discard-pile');
let discardList;
const pickupPileImg = document.querySelector('#pickup-pile-img');
let player1Pile;
let computersPile;
let discardCard;
let pickedUpCard = null;
let usersTurn = true;

 const getCardDeck = async () => {
  try {
    let info = await axios.get(`${BASE_URL}new/shuffle/?deck_count=1`);
    // console.log(info)
    deckId = await info.data.deck_id;
    // console.log(deckId)
    // return info.data.deck_id;
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
  // let player1Pile;
  // let computersPile;

  player1Pile = await drawCard(5);
  computersPile = await drawCard(5);
  discardCard = await drawCard(1);

  discardPile.innerHTML = `<img src='${discardCard[0].image}' alt=''/>`;
  for(let i = 0; i < 5; i++) {
    player1Cards[i].innerHTML = `<img src='${player1Pile[i].image}' alt=''/>`;
    
    computersCards[i].innerHTML = `<img src='${computersPile[i].image}' alt=''/>`;
  }
  // return [player1Pile, computersPile];
}
// setupTable();

pickupPile.onclick = async () => {
    pickedUpCard = await drawCard(1);
    // console.log(pickedUpCard)
    pickupPileImg.setAttribute('src', pickedUpCard[0].image);
}

const playGame = async () => {
  // let [ p1,  p2] = await setupTable();
  // player1Pile = p1;
  // computersPile = p2;
  await setupTable();
  let tempBool = true;

  let i = 0;
  while(tempBool) {
   i++; console.log({i, usersTurn})
  
  discardPile.addEventListener('click', async () => {
    await axios.get(`${BASE_URL}/${deckId}/pile/discard/add/?cards=${pickedUpCard[0].code}`);
    pickupPileImg.src = img;
  });

  if(usersTurn) {
    player1Cards.forEach((card,i) => {
      card.onclick = () => {
        if(usersTurn) {
          if(pickedUpCard != null){
            player1Pile[i] = pickedUpCard;
            card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
            pickupPileImg.src = img;
            pickedUpCard = null;
          }
        }
      };
    });
  }
  
  else {

  }
  usersTurn = !usersTurn;
  if(i == 2)
    tempBool = false;
  }
}
playGame()