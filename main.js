import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import img from './card-back-black.png';

const BASE_URL = process.env.BASE_URL;
let deckId;
let player1Cards = document.querySelectorAll('#player1-cards .card');
player1Cards = Array.from(player1Cards);
let player2Cards = document.querySelectorAll('#player2-cards .card');
player2Cards = Array.from(player2Cards);
const pickupPile = document.querySelector('#pickup-pile');
const discardPile = document.querySelector('#discard-btn');
let discardList;
const pickupPileImg = document.querySelector('#pickup-pile-img');
let player1Pile;
let player2Pile;
let pickedUpCard;
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
  let player1Pile;
  let player2Pile;

  player1Pile = await drawCard(5);
  player2Pile = await drawCard(5);
  // console.log({player1Pile})
  // console.log({player2Pile})

  for(let i = 0; i < 5; i++) {
    player1Cards[i].innerHTML = `<img src='${player1Pile[i].image}' alt=''/>`;
    
    player2Cards[i].innerHTML = `<img src='${player2Pile[i].image}' alt=''/>`;
  }
  return [player1Pile, player2Pile];
}
// setupTable();

// const do1 = (card, i) => {
//   if(usersTurn) {
//     player1Pile[i] = pickedUpCard;
//     card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
//     pickupPileImg.src = img;
//   pickedUpCard = '';
//   }
// }

// function do2(card, i, pickedUpCard) {
//   if(!usersTurn) {
//     player2Pile[i] = pickedUpCard;
//     card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
//     pickupPileImg.src = img;
//   }
// }

pickupPile.onclick = async () => {
    pickedUpCard = await drawCard(1);
    // console.log(pickedUpCard)
    pickupPileImg.setAttribute('src', pickedUpCard[0].image);
}

const playGame = async () => {
  let [ p1,  p2] = await setupTable();
  player1Pile = p1;
  player2Pile = p2;
  let tempBool = true;

  let i = 0;
  while(tempBool) {
   i++; console.log({i, usersTurn})
  // pickupPile.addEventListener('click', async () => {
  //   pickedUpCard = await drawCard(1);
  //   // console.log(pickedUpCard)
  //   pickupPileImg.setAttribute('src', pickedUpCard[0].image);
  // });
  
  discardPile.addEventListener('click', async () => {
    await axios.get(`${BASE_URL}/${deckId}/pile/discard/add/?cards=${pickedUpCard[0].code}`);
    pickupPileImg.src = img;
  });

  // if(usersTurn) {
    // player2Cards.forEach((card,i) => {
    //   card.removeEventListener('click', () => {
    //    player2Pile[i] = pickedUpCard;
    //    card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
    //    pickupPileImg.src = img;
    //   });
    //  });

  player1Cards.forEach((card,i) => {
   card.onclick = () => {
    if(usersTurn) {
      player1Pile[i] = pickedUpCard;
      card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
      pickupPileImg.src = img;
    pickedUpCard = undefined;
    }
  };
  });
  // }
  
  // else {
    // player1Cards.forEach((card,i) => {
    //   card.removeEventListener('click', () => {
    //    player1Pile[i] = pickedUpCard;
    //    card.innerHTML = `<img src='${pickedUpCard[0].image}' alt=''/>`;
    //    pickupPileImg.src = img;
    //    });
    //  });

  // player2Cards.forEach((card,i) => {
  //  card.addEventListener('click', () => do2(player2Pile, card, i, pickedUpCard));
  // });
  // }
  usersTurn = !usersTurn;
  if(i == 2)
    tempBool = false;
  }
}
playGame()