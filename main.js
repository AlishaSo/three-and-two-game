import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL;
let deckId;
let player1Cards = document.querySelectorAll('#player1-cards .card');
player1Cards = Array.from(player1Cards);
let player2Cards = document.querySelectorAll('#player2-cards .card');
player2Cards = Array.from(player2Cards);
const pickupPile = document.querySelector('#pickup-pile');
const discardPile = document.querySelector('#discard-btn');
let currentClickedCardIndex;

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
  let player1Pile;
  let player2Pile;
  let drawPile;

  player1Pile = await drawCard(5);
  player2Pile = await drawCard(5);
  // drawPile = await axios.get(`${BASE_URL}${deckId}/`);
  // console.log(drawPile)
  // console.log({player1Pile})
  // console.log({player2Pile})

  // drawPile.addEventListener('click', );
  for(let i = 0; i < 5; i++) {
    player1Cards[i].innerHTML = `<img src='${player1Pile[i].image}' alt=''/>`;
    
    player2Cards[i].innerHTML = `<img src='${player2Pile[i].image}' alt=''/>`;
  }
  return [player1Pile, player2Pile];
}
// setupTable();

const playGame = async () => {
  // await setupTable()
  // console.log(currentClickedCardIndex)
  let [player1Pile, player2Pile] = await setupTable();
  
  player1Cards.forEach((card,i) => {
   card.addEventListener('click', () => {currentClickedCardIndex = i; console.log(player1Pile[currentClickedCardIndex])})
  })
  player2Cards.forEach((card,i) => {
   card.addEventListener('click', () => {currentClickedCardIndex = i; console.log(currentClickedCardIndex)})
  })
   
  
}
playGame()