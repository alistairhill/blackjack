function Card (rank, suit, value) {
  this.rank = rank
  this.suit = suit
  this.val = value
}

function Deck() {
  this.deckArray = []
  this.makeDeck = makeDeck
}

function makeDeck() {
  var rank = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"],
  suit = ["Clubs", "Diamonds", "Hearts", "Spades"],
  value = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "10", "10", "10", "11"]
  for (var i = 0, x = suit.length; i < x; i++) {
    for (var y = 0, z = rank.length; y < z; y++) {
      this.deckArray.push(new Card(rank[y], suit[i], value[y]))
    }
  }
}

function printDeck(deck) {
  for (var i = 0, x = deck.length; i < x; i++) {
    console.log(deck[i])
  }
}
// Fisher–Yates shuffle
function shuffle(deck) {
  for (var i = deck.length-1, x = 0, randNum, tempPlace; i >= x; i--) {
    randNum = Math.floor(Math.random() * i)
    tempPlace = deck[i]
    deck[i] = deck[randNum]
    deck[randNum] = tempPlace
  }
  return printDeck(deck)
}

function deal(deck) {
  if (deck.length != 0) {
    createCard(deck.pop(), ".dealer-area")
  } else {
    console.log("deck is done!")
  }
}

var deck1 = new Deck()
deck1.makeDeck()

function createCard(card, gambler) {
  randNum = Math.floor(Math.random() * 7)
  var gamblerDiv = document.querySelector(gambler),
  cardDiv = document.createElement('div')
  gamblerDiv.appendChild(cardDiv).className = "card"
  cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
  cardDiv.style.webkitTransform = "rotate(" + randNum  + "deg)"
}

