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
