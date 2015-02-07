var playerCards = {
  dealer: [],
  player: []
}

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

var deal = {
  bot: function(deck, whichPlayer) {
    if (deck.length != 0) {
      playerCards[whichPlayer].push(deck.pop())
      playerCards[whichPlayer].push(deck.pop())
      return this.playCard(whichPlayer)
    } else {
      console.log("deck is done!")
    }
  },
  playCard: function(whichPlayer) {
    setTimeout(function(){
      display.card(playerCards[whichPlayer][playerCards[whichPlayer].length-1], whichPlayer)
    }, 700)
  }
}

var display = {
  card: function(card, gamblerArray) {
    randNum = Math.floor(Math.random() * 7)
    var gamblerDiv = document.querySelector("." + gamblerArray + "-area"),
    cardDiv = document.createElement('div')
    gamblerDiv.appendChild(cardDiv).className = "card"
    cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
    cardDiv.style.webkitTransform = "rotate(" + randNum  + "deg)"
  }
}

function startGame() {
  deck1 = new Deck()
  deck1.makeDeck()
  deal.bot(deck1.deckArray, "player")
}

function checkHand(whichPlayer) {
  var hand = playerCards[whichPlayer],
  cardCount = 0
  for (var i = 0, x = hand.length; i < x; i++) {
    hand[i] += cardCount
  }
  if ((whichPlayer == "dealer") && (cardCount >= 17)) {
    endGame()
  } else if (cardCount >=22) {
    flashMessage(whichPlayer, "Busted")
  }

}

function flashMessage(whichPlayer, msg) {
  var flash = document.querySelector('.flashes'),
  fade = 1.0
  setTimeout(function(){
    flash.innerHTML = msg
    flash.style.backgroundColor = "#ffa"
  }, 750)
  setTimeout(function(){
    setInterval(function fadeOut(){
      if (fade >= 0.1) {
        fade -= 0.1
        console.log(Math.round(fade * 10) / 10)
        flash.style.opacity = Math.round(fade * 10) / 10
      }
      if (fade == 0.1) {
        clearInterval(fadeOut)
      }
    }, 40)
  }, 2000)
}

function endGame() {
  flashMessage(whichPlayer, whichPlayer + " Wins!")
  //reset stuff
}



/*
1. deck is shuffled
2. player makes bet
3. player hits deal

3. a) push a card into player array
3. b) display card


4. initial deal; player, dealer, player, dealer
toggle button options: deal, split, double, surrender, hit, stand, rules/hide rules.
5. on hit, player gets cards until bust
6. on stand, dealer goes until he reaches >= 17
7. game end, flash message for who wins

notes: ace is 11 up until >= 21
*/
