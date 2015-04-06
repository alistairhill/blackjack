window.onload = function() {
  var view = new View(),
  shoe = new Shoe(),
  player = new User(),
  dealer = new User(),
  controller = new Controller(view, shoe, player, dealer)
  controller.intializeStart()
}

function View() {
  this.deal = ".deal-but"
  this.hit = ".hit-but"
  this.stand = ".stand-but"
  this.flipped = ".flipped-card"
  this.card = ".card"
}

View.prototype = {
  getDealButton: function() {
    return document.querySelector(this.deal)
  },
  getHitButton: function() {
    return document.querySelector(this.hit)
  },
  getStandButton: function() {
    return document.querySelector(this.stand)
  },
  getUserDiv: function(user) {
    return document.querySelector("." + user + "-area")
  },
  addCard: function(user, card) {
    var userDiv = document.querySelector("." + user + "-area"),
    cardDiv = document.createElement('div')
    userDiv.appendChild(cardDiv).className = "card"
    cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
  }
}

function Controller(view, shoe, player, dealer) {
  this.view = view
  this.shoe = shoe
  this.player = player
  this.dealer = dealer
}
Controller.prototype = {
  intializeStart: function() {
    console.log("starting")
    this.shoe.makeDeck()
    this.bindListeners()
    this.seedHands()
  },
  bindListeners: function() {
    var dealBut = this.view.getDealButton(),
    hitBut = this.view.getHitButton(),
    standBut = this.view.getStandButton()
    dealBut.addEventListener('click', this.dealButton.bind(this))
    hitBut.addEventListener('click', this.hitButton.bind(this))
    standBut.addEventListener('click', this.standButton.bind(this))
  },
  startRound: function() {
    this.playMultipleCards("player")
    this.playMultipleCards("dealer")
  },
  dealButton: function(button) {
    this.startRound()
    this.toggleButton(this.view.getHitButton())
    this.toggleButton(this.view.getStandButton())
  },
  standButton: function(button) {
    // this.deal("dealer")
    // this.playMultipleCards("dealer")
  },
  hitButton: function() {
    this.deal("player")
    this.playMultipleCards("player")
  },
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
  seedHands: function() {
    this.deal("player"); this.deal("dealer"); this.deal("player"); this.deal("dealer")
  },
  deal: function(user) {
    var deck = this.shoe.cards
    if (deck.length != 0) {
      var card = deck.pop()
      this[user].hand.push(card)
    } else {
      console.log("deck is done!")
    }
  },
  playMultipleCards: function(user) {
    var that = this,
    go = setInterval(function(){
      that.view.addCard(user, that[user].hand[that[user].counter])
      that[user].counter +=1
      if (that[user].counter >= that[user].hand.length) {
        clearInterval(go)
      }
    }, 500)
    console.log(that[user].counter)
  }
}

function Card (rank, suit, value) {
  this.rank = rank
  this.suit = suit
  this.val = value
}

function Shoe() {
  this.cards = []
}
Shoe.prototype = {
  makeDeck: function() {
    var rank = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"],
    suit = ["Clubs", "Diamonds", "Hearts", "Spades"],
    value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
    for (var i = 0, x = suit.length; i < x; i++) {
      for (var y = 0, z = rank.length; y < z; y++) {
        this.cards.push(new Card(rank[y], suit[i], value[y]))
      }
    }
  },
  shuffle: function() {
    var deck = this.cards
    for (var i = deck.length-1, x = 0, randNum, tempPlace; i >= x; i--) {
      randNum = Math.floor(Math.random() * i)
      tempPlace = deck[i]
      deck[i] = deck[randNum]
      deck[randNum] = tempPlace
    }
  }
}

function User(name) {
  this.name = name
  this.hand = []
  this.roundCardCount = 0
  this.counter = 0
  this.money = 0
}