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
  this.deal = ".deal-but"
  this.hit = ".hit-but"
  this.stand = ".stand-but"
  this.flipped = ".flipped-card"
  this.card = ".card"
  this.flashes = ".flashes"
  this.newCard = "card"
}

View.prototype = {
  playerScore: function() {
    return document.querySelector(this.pscore)
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
  createDiv: function() {
    return document.createElement('div')
  },
  getUserDiv: function(user) {
    return document.querySelector("." + user + "-area")
  },
  getFlashes: function() {
    return document.querySelector(this.flashes)
  },
  getFlippedCard: function() {
    return document.querySelector(this.flipped)
  },
  removeCards: function() {
    var cards = document.querySelectorAll(this.card )
    for (var i = 0, x = cards.length; i < x; i++) {
      cards[i].remove()
    }
    if (this.getFlippedCard() != null) this.getFlippedCard().remove()
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
  playerWinMsg: function(won){
    if (won == true) {
      this.view.flashMessage("#00CD64", "#138442", "player won!")
    } else {
      this.view.flashMessage("#FD4547", "#D71F20", "player lost!")
    }
  },
  resetScore: function() {
    this.playerScore().innerHTML = 0
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
    this.shoe.makeSixDecks()
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
    //wedge check
    var that = this
    if (this.shoe.checkWedge() == true) {
      this.seedHands()
      this.playCards("player")
      this.playCards("dealer")
      this.toggleBut(this.view.getHitButton(), "on")
      this.toggleBut(this.view.getStandButton(), "on")
    } else {
      this.view.flashMessage("#FDEFBC", "#EEE092", "Adding and shuffling new decks.")
      this.shoe.emptyShoe()
      this.shoe.makeSixDecks()
      setTimeout(function(){that.dealButton()}, 2000)
    }
  },
  dealButton: function(button) {
    var that = this
    this.endRound()
    this.startRound()
    this.toggleBut(this.view.getDealButton(), "off")
    setTimeout(function(){that.toggleBut(that.view.getDealButton(), "on")}, 1400)
  },
  standButton: function(button) {
    this.buttonsOff()
    this.dealerHand()
  },
  hitButton: function() {
    this.deal("player")
    this.playCards("player")
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
    this.flipCardBack(this["dealer"].hand[0])
    //added != 0 to prevent timeout
    while (this["dealer"].roundCardCount < 17 && this["dealer"].roundCardCount != 0) {
      this.deal("dealer")
    }
    if (this["dealer"].hand.length > 2) {
      this.playCards("dealer")
    }
  },
  wedgeCheck: function() {
    var deck = this.shoe.cards
    if (deck.length > 12) return true
  },
  deal: function(user) {
    var deck = this.shoe.cards
    if (deck.length !=0) {
      var card = deck.pop()
      this[user].hand.push(card)
      this[user].roundCardCount += card.val
    } else {
      console.log("no more cards!")
    }
  },
  playCards: function(user) {
    if (this[user].counter < this[user].hand.length) {
      var that = this,
      go = setInterval(function(){
        that.addCard(user, that[user].hand[that[user].counter])
        that[user].counter +=1
        if (that[user].counter >= that[user].hand.length) {
          if (user == "player") that.view.playerScore().innerHTML = that.player.roundCardCount
          clearInterval(go)
        }
      }, 700)
      //check if busted
      if (this[user].roundCardCount > 21) {
        if (this.checkForAce(user) == true) {
          this[user].roundCardCount -= 10
          //trigger more cards for auto dealer
          if (user == "dealer") this.dealerHand()
        } else {
          this.buttonsOff()
          setTimeout(function(){that.userBusted(user)},1500)
        }
      } else {
        // console.log(user + " did not bust")
      }
    }
  },
  addCard: function(user, card) {
    if (card != null) {
      var userDiv = this.view.getUserDiv(user),
      cardDiv = this.view.createDiv()
      if (user === "dealer" && this[user].counter == 0) {
        userDiv.appendChild(cardDiv).className = "flipped-card"
        cardDiv.innerHTML = "<br>Hill's<br>Casino"
      } else {
        userDiv.appendChild(cardDiv).className = this.view.newCard
        if (card.suit == "\u2666" || card.suit == "\u2665") {
          cardDiv.style.color = "red"
        }
          cardDiv.innerHTML = card.rank + "<br>" + card.suit
      }
    }
  },
  checkForAce: function(user) {
    var hand = this[user].hand
    for (var i = 0, x = hand.length; i < x; i++) {
      if (hand[i].rank == "Ace" && hand[i].val == 11) {
        console.log("changing Ace Value")
        hand[i].val = 1
        return true
      }
    }
  },
  flipCardBack: function(card) {
    var cardDiv = this.view.getFlippedCard()
    if (cardDiv != null) {
      cardDiv.className = this.view.newCard
      cardDiv.innerHTML = card.rank + "<br>" + card.suit
    }
  },
  userBusted: function(user) {
    var that = this
    this.view.flashMessage("#FD4547", "#D71F20", user + " Busted with " + this[user].roundCardCount + "!")
    this.toggleBut(this.view.getHitButton(), "off")
    this.toggleBut(this.view.getStandButton(), "off")
    if (user === "player") {
      //not sure about bj rules on this
      setTimeout(function(){that.dealerHand()}, 1500)
    } else {
      setTimeout(function() {that.endRound()}, 2000)
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
    this.view.resetScore()
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
    var rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
    suit = ["\u2663", "\u2666", "\u2665", "\u2660"],
    value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]
    for (var i = 0, x = suit.length; i < x; i++) {
      for (var y = 0, z = rank.length; y < z; y++) {
        this.cards.push(new Card(rank[y], suit[i], value[y]))
      }
    }
  },
  makeSixDecks: function() {
    for (var i = 0; i <6; i++) this.makeDeck();
    this.shuffle()
  },
  shuffle: function() {
    var deck = this.cards
    for (var i = deck.length-1, x = 0, randNum, tempPlace; i >= x; i--) {
      randNum = Math.floor(Math.random() * i)
      tempPlace = deck[i]
      deck[i] = deck[randNum]
      deck[randNum] = tempPlace
    }
  },
  checkWedge: function() {
    var deck = this.cards
    if (deck.length > 12) return true
  },
  emptyShoe: function() {
    this.cards = []
    console.log("emptied shoe " + this.cards)
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