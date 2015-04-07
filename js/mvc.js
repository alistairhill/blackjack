window.onload = function() {
  var view = new View(),
  shoe = new Shoe(),
  player = new User(),
  dealer = new User(),
  controller = new Controller(view, shoe, player, dealer)
  controller.intializeStart()
}

function View() {
  this.pscore = ".player-score"
  this.dscore = ".dealer-score"
  this.deal = ".deal-but"
  this.hit = ".hit-but"
  this.stand = ".stand-but"
  this.flipped = ".flipped-card"
  this.card = ".card"
  this.flashes = '.flashes'
}

View.prototype = {
  playerScore: function() {
    return document.querySelector(this.pscore)
  },
  dealerScore: function() {
    return document.querySelector(this.dscore)
  },
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
  getFlashes: function() {
    return document.querySelector(this.flashes)
  },
  addCard: function(user, card) {
    if (card != null) {
      var userDiv = document.querySelector("." + user + "-area"),
      cardDiv = document.createElement('div')
      userDiv.appendChild(cardDiv).className = "card"
      cardDiv.innerHTML = card.rank + "<p>" + card.suit + "<p>" + card.val
    }
  },
  removeCards: function() {
    var cards = document.querySelectorAll(".card")
    for (var i = 0, x = cards.length; i < x; i++) {
      cards[i].remove()
    }
    if (document.querySelector(".flipped-card") != null) {
      document.querySelector(".flipped-card").remove()
    }
  },
  flashMessage: function(col1, col2, msg) {
    var fade = 1.0,
    flash = this.getFlashes()
    flash.style.opacity = 1.0
    flash.style.backgroundImage = "linear-gradient(" + col1 +" ," + col2 +")"
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
  },
  updateScore: function(user) {

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
    this.bindListeners()
    this.shoe.makeDeck()
    this.shoe.makeDeck()
    this.shoe.makeDeck()
    this.shoe.makeDeck()
    this.shoe.makeDeck()
    this.shoe.makeDeck()
    // this.shoe.shuffle()
  },
  bindListeners: function() {
    var dealBut = this.view.getDealButton(),
    hitBut = this.view.getHitButton(),
    standBut = this.view.getStandButton()
    dealBut.addEventListener('click', this.dealButton.bind(this))
    hitBut.addEventListener('click', this.hitButton.bind(this))
    standBut.addEventListener('click', this.standButton.bind(this))
  },
  makeMultipleDecks(){

  },
  startRound: function() {
    this.seedHands()
    this.playCards("player")
    this.playCards("dealer")
    this.toggleBut(this.view.getHitButton(), "on")
    this.toggleBut(this.view.getStandButton(), "on")
  },
  dealButton: function(button) {
    this.endRound()
    this.startRound()
  },
  standButton: function(button) {
    this.buttonsOff()
    this.dealerHand()
  },
  hitButton: function() {
    this.deal("player")
    this.playCards("player")
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
  toggleBut: function(button, status) {
    var but = button
    if (status === "on") {
      but.disabled = false
      but.classList.remove("grayed-out")
    } else if (status === "off") {
      but.disabled = true
      but.classList.add("grayed-out")
    }
  },
  seedHands: function() {
    this.deal("player"); this.deal("dealer"); this.deal("player"); this.deal("dealer")
  },
  dealerHand: function() {
    //added != 0 to prevent timeout
    while (this["dealer"].roundCardCount < 17 && this["dealer"].roundCardCount != 0) {
      this.deal("dealer")
    }
    if (this["dealer"].hand.length > 2) {
      this.playCards("dealer")
    }
  },
  deal: function(user) {
    var deck = this.shoe.cards
    //12 cards or less will be where the wedge is placed
    if (deck.length < 12) {
      var card = deck.pop()
      this[user].hand.push(card)
      this[user].roundCardCount += card.val
    } else {
      console.log("got to shoe wedge, no more cards")
      //run make multiple decks function
    }
  },
  playCards: function(user) {
    if (this[user].counter < this[user].hand.length) {
      var that = this,
      go = setInterval(function(){
        that.view.addCard(user, that[user].hand[that[user].counter])
        that[user].counter +=1
        if (that[user].counter >= that[user].hand.length) {
          clearInterval(go)
        }
      }, 500)
      //check if busted
      if (this[user].roundCardCount > 21) {
        if (this.checkForAce(user) == true) {
          this[user].roundCardCount -= 10
          //trigger more cards for auto dealer
          if (user == "dealer") this.dealerHand()
        } else {
          this.buttonsOff()
          setTimeout(function(){that.userBusted(user)},1400)
        }
      } else {
        // console.log(user + " did not bust")
      }
    }
    this.view[user + "Score"]().innerHTML = this[user].roundCardCount
  },
  checkForAce: function(user) {
    var hand = this[user].hand
    for (var i = 0, x = hand.length; i < x; i++) {
      if (hand[i].rank == "Ace" && hand[i].val === 11) {
        hand[i].val = 1
        return true
      }
    }
  },
  userBusted: function(user) {
    var that = this
    this.view.flashMessage("#FD4547", "#D71F20", user + " Busted with " + this[user].roundCardCount + "!")
    this.toggleBut(this.view.getHitButton(), "off")
    this.toggleBut(this.view.getStandButton(), "off")
    if (user === "player") {
      setTimeout(function(){that.dealerHand()}, 1300)
    } else {
      setTimeout(function() {that.endRound()}, 1300)
    }
  },
  buttonsOff: function(){
    this.toggleBut(this.view.getHitButton(), "off")
    this.toggleBut(this.view.getStandButton(), "off")
  },
  endRound: function() {
    this["player"].resetHand()
    this["dealer"].resetHand()
    this.view.removeCards()
    this.buttonsOff()
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
User.prototype.resetHand = function() {
  this.hand = []
  this.roundCardCount = 0
  this.counter = 0
}