import axios from 'axios';
import dotenv from 'dotenv';

let deckId;
const player1Cards = document.querySelector('#player1-cards');
const player2Cards = document.querySelector('#player2-cards');

 const getCardDeck = async () => {
  try {
    let info = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
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
    let info = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    console.log(info)
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

  player1Pile = await drawCard(5);
  player2Pile = await drawCard(5);
  console.log({player1Pile})
  console.log({player2Pile})
  // const p2Card1Div = document.querySelector('#player2-cards .card1');
  // p2Card1Div.innerHTML = `<img src='${player2Pile.image}'/>`
}
// setupTable();