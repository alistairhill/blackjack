var dealt = {
  cards: []
}

function Card (rank, suit, value) {
  this.rank = rank
  this.suit = suit
  this.val = value
  this.who = ""
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
  counter: 0,
  seedHands: function() {
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
  },
  bot: function(deck, whichPlayer) {
    if (deck.length != 0) {
      var card = deck.pop()
      card.who = whichPlayer
      dealt.cards.push(card)
    } else {
      console.log("deck is done!")
    }
  },
  playOneCard: function(whichPlayer) {
    var that = this
    if (this.counter < dealt.cards.length) {
      setTimeout(function(){
        display.card(dealt.cards[that.counter])
        that.counter += 1
      }, 500)
    }
    checkHand(whichPlayer)
  },
  playMultipleCards: function() {
    var that = this
    var go = setInterval(function(){
      display.card(dealt.cards[that.counter])
      that.counter +=1
      if (that.counter == dealt.cards.length) {
        clearInterval(go)
      }
    }, 500)
    // checkHand(whichPlayer)
  }
}

var display = {
  card: function(card) {
    var randDegree = Math.floor(Math.random() * 7),
    gamblerDiv = document.querySelector("." + card.who + "-area"),
    cardDiv = document.createElement('div')
    gamblerDiv.appendChild(cardDiv).className = "card"
    cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
    cardDiv.style.webkitTransform = "rotate(" + randDegree  + "deg)"
  }
}

function startGame() {
  deck1 = new Deck()
  deck1.makeDeck()
  deal.seedHands()
  deal.playMultipleCards()
}

function checkHand(whichPlayer) {
  var hand = dealt.cards,
  cardCount = 0
  for (var i = 0, x = hand.length; i < x; i++) {
    if (hand[i].who == whichPlayer) {
      cardCount += hand[i].val
    }
  }
  if ((whichPlayer == "dealer") && (cardCount >= 17)) {
    //dealer stops, player's choice
    console.log("Dealer got " + cardCount)
  } else if (cardCount >=22) {
    flashMessage("#FD4547", "#D71F20", whichPlayer + " Busted with " + cardCount + "!")
  } else if (dealt.cards[0].rank == "Ace" && dealt.cards[1].val == 10 || dealt.cards[1].rank == "Ace" && dealt.cards[0].val == 10) {
    flashMessage("#00CD64", "#138442", whichPlayer + " got a Blackjack!")
  } else {
    return console.log("epic fail")
  }
}

function flashMessage(col1, col2, msg) {
  var fade = 1.0,
  flash = document.querySelector('.flashes')
  flash.style.opacity = 1.0
  flash.style.backgroundImage = "linear-gradient(" + col1 +" ," + col2 +")"
  flash.style.border = "thin solid #AAA"
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

function endGame(whichPlayer) {
  flashMessage("#FDEFBC", "#EEE092", whichPlayer + " Wins!")
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
