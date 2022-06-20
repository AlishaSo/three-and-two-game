import axios from 'axios';
import dotenv from 'dotenv';

 const getCardDeck = async () => {
  try {
    let info = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    // console.log(info)
    const deckId = info.data.deck_id;
    // console.log(deckId)
    return deckId;
  } catch(e) {
    console.error(e);
  }
}
// getCardDeck();

const drawCard = async () => {
  const deckId = await getCardDeck();
  // console.log(deckId)
  try {
    let card = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    console.log(card)
  } catch (e) {
    console.error(e);
  }
}
// drawCard()