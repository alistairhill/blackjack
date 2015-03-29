window.onload = function() {
  game.activate()
}

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
}

var deal = {
  counter: 0,
  seedHands: function() {
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
    this.bot(deck1.deckArray, "player")
    this.bot(deck1.deckArray, "dealer")
  },
  dealer: function() {
    check.hand("dealer")
    // this.bot(deck1.deckArray, "dealer")
    // deal.playOneCard("dealer")

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
    check.hand(whichPlayer)
  },
  playMultipleCards: function(whichPlayer) {
    clearInterval(go)
    var that = this,
    go = setInterval(function(){
      display.card(dealt.cards[that.counter])
      that.counter +=1
      if (that.counter >= dealt.cards.length) {
        clearInterval(go)
        check.hand(whichPlayer)
      }
    }, 500)
  }
}


game = {
  start: function() {
    this.end()
    deck1 = new Deck()
    deck1.makeDeck()
    deal.seedHands()
    deal.playMultipleCards("player")
  },
  end: function() {
    deal.counter = 0
    deck1 = {}
    dealt.cards = []
    display.remove()
  },
  activate: function (){
    controls.deal()
  },
}

controls = {
  toggleButton: function(button) {
    var but = button
    if (but.disabled == true) {
      but.disabled = false
      but.classList.remove("grayed-out")
    } else {
      but.disabled = true
      but.classList.add("grayed-out")
    }
  },
  button: {
    deal: function() {
      return document.querySelector(".deal-but")
    },
    hit: function() {
      return document.querySelector(".hit-but")
    },
    stand: function() {
      return document.querySelector(".stand-but")
    }
  },
  deal: function() {
    var that = this,
    dealButton = this.button.deal()
    dealButton.onclick = function() {
      game.start()
      that.toggleButton(this)
      setTimeout(function() {
        that.hit()
        that.stand()
        that.toggleButton(dealButton)
      }, 2000)
    }
  },
  hit: function() {
    var that = this,
    hitButton = this.button.hit()
    that.toggleButton(hitButton)
    hitButton.onclick = function() {
      deal.bot(deck1.deckArray, "player")
      deal.playOneCard("player")
      that.toggleButton(this)
      setTimeout(function(){
        that.toggleButton(hitButton)
      }, 1800)
    }
  },
  stand: function(){
    var that = this,
    dealButton = this.button.deal()
    hitButton = this.button.hit(),
    standButton = this.button.stand(),
    this.toggleButton(standButton)
    standButton.onclick = function() {
      display.flipCard(dealt.cards[1])
      that.toggleButton(this)
      that.toggleButton(hitButton)
      deal.dealer()
    }
  }
}

check = {
  cardCount: function(whichPlayer) {
    var hand = dealt.cards,
    who = whichPlayer,
    score = 0
    for (var i = 0, x = hand.length; i < x; i++) {
      if (hand[i].who == who) {
        score += hand[i].val
      }
    }
    return score
  },
  whoWon: function() {
    var player = this.cardCount("player"),
    dealer = this.cardCount("dealer")
    console.log("dealer = " +dealer)
    console.log("player = " +player)
    if (player == dealer) {
      return flashMessage("#00CD64", "#138442", "Push")
    } else if (player < dealer) {
      return flashMessage("#00CD64", "#138442", "House Wins!")
    } else {
      return flashMessage("#00CD64", "#138442", "Player Wins!")
    }
  },
  hand: function(whichPlayer) {
    var score = this.cardCount(whichPlayer),
     who = whichPlayer
    if ((who == "dealer") && (score >= 17)) {
      this.whoWon()
      console.log("Dealer got " + score)
    } else if (score >=22) {
      flashMessage("#FD4547", "#D71F20", who + " Busted with " + score + "!")
    } else if (dealt.cards[0].rank == "Ace" && dealt.cards[1].val == 10 || dealt.cards[1].rank == "Ace" && dealt.cards[0].val == 10) {
      //blackjack
      flashMessage("#00CD64", "#138442", who + " got a Blackjack!")
    } else {
      flashMessage("#FDEFBC", "#EEE092", who + " has " + score + ".")
    }
  }
}

var display = {
  rand: function() {
    return Math.floor(Math.random() * 7)
  },
  card: function(card) {
    // var randDegree = Math.floor(Math.random() * 7),
    var gamblerDiv = document.querySelector("." + card.who + "-area"),
    cardDiv = document.createElement('div')
    if (deal.counter == 1) {
      gamblerDiv.appendChild(cardDiv).className = "flipped-card"
    } else {
      gamblerDiv.appendChild(cardDiv).className = "card"
      cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
    }
    cardDiv.style.webkitTransform = "rotate(" + this.rand()  + "deg)"
  },
  flipCard: function(card) {
    var cardDiv = document.querySelector(".flipped-card")
    cardDiv.className = "card"
    cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
  },
  remove: function() {
    var cards = document.querySelectorAll(".card")
    for (var i = 0, x = cards.length; i < x; i++) {
      cards[i].remove()
    }
    if (document.querySelector(".flipped-card") != null) {
      document.querySelector(".flipped-card").remove()
    }
  }
}

function flashMessage(col1, col2, msg) {
  var fade = 1.0,
  flash = document.querySelector('.flashes')
  flash.style.opacity = 1.0
  flash.style.backgroundImage = "linear-gradient(" + col1 +" ," + col2 +")"
  // flash.style.border = "thin solid #AAA"
  flash.innerHTML = msg
  setTimeout(function(){
    var fadeOut = setInterval(function(){
      if (fade >= 0.1) {
        fade -= 0.1
        flash.style.opacity = Math.round(fade * 10) / 10
      }
      if (fade == 0.1) clearInterval(fadeOut)
    }, 40)
  }, 1800)
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
