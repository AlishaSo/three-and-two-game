import axios from 'axios';
import dotenv from 'dotenv';

async function getCardDeck() {
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
getCardDeck();