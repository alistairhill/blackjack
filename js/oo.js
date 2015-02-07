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
  value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
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
  initial: function() {
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
  },
  bot: function(deck, whichPlayer) {
    if (deck.length != 0) {
      playerCards[whichPlayer].push(deck.pop())
      return this.playOneCard(whichPlayer)
    } else {
      console.log("deck is done!")
    }
  },
  playOneCard: function(whichPlayer) {
    setTimeout(function(){
      display.card(playerCards[whichPlayer][playerCards[whichPlayer].length-1], whichPlayer)
    }, 500)
  },
  playMultipleCards: function(whichPlayer) {
    //add multiple cards using setInterval
  }
}

var display = {
  card: function(card, whichPlayer) {
    var randDegree = Math.floor(Math.random() * 7),
    gamblerDiv = document.querySelector("." + whichPlayer + "-area"),
    cardDiv = document.createElement('div')
    gamblerDiv.appendChild(cardDiv).className = "card"
    cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
    cardDiv.style.webkitTransform = "rotate(" + randDegree  + "deg)"
  }
}

function startGame() {
  deck1 = new Deck()
  deck1.makeDeck()
  deal.initial()
}

function checkHand(whichPlayer) {
  var hand = playerCards[whichPlayer],
  cardCount = 0
  for (var i = 0, x = hand.length; i < x; i++) {
    cardCount += hand[i].val
  }
  if ((whichPlayer == "dealer") && (cardCount >= 17)) {
    //dealer stops, player's choice
  } else if (cardCount >=22) {
    flashMessage("#FD4547", "#D71F20", whichPlayer + " BUSTED!")
  } else if (playerCards[whichPlayer][0].rank == "Ace" && playerCards[whichPlayer][1].val == 10 || playerCards[whichPlayer][1].rank == "Ace" && playerCards[whichPlayer][0].val == 10) {
    flashMessage("#00CD64", "#138442", whichPlayer + " got a Blackjack!")
  }
}

function flashMessage(col1, col2, msg) {
  var fade = 1.0,
  flash = document.querySelector('.flashes')
  flash.style.opacity = 1.0
  flash.style.backgroundImage = "linear-gradient(" + col1 +" ," + col2 +")"
  flash.style.border = "thin solid #BBB"
  flash.innerHTML = msg
  setTimeout(function(){
    setInterval(function fadeOut(){
      if (fade >= 0.1) {
        fade -= 0.1
        flash.style.opacity = Math.round(fade * 10) / 10
      }
      if (fade == 0.1) clearInterval(fadeOut)
    }, 40)
  }, 1700)
}

function endGame() {
  flashMessage("#00CD64", "#138442", whichPlayer + " Wins!")
  //reset stuff
}


/*
1. deck is shuffled
2. player makes bet
3. player hits deal
4. initial deal; player, dealer, player, dealer
toggle button options: deal, split, double, surrender, hit, stand, rules/hide rules.
5. on hit, player gets cards until bust
6. on stand, dealer goes until he reaches >= 17
7. game end, flash message for who wins

notes:
ace is 11 up until >= 21
a) pop card from deck and push into player || dealer array
b) add card to display from player || dealer array
*/
