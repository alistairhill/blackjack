window.onload = function() {
  var view = new View(),
  shoe = new Shoe(),
  player = new User(),
  dealer = new User(),
  controller = new Controller(view, shoe, player, dealer)
  controller.intializeStart()
}

function View() {
  this.pScore = ".player-score"
  this.dScore = ".dealer-score"
  this.deal = ".deal-but"
  this.hit = ".hit-but"
  this.stand = ".stand-but"
  this.flipped = ".flipped-card"
  this.card = ".card"
  this.flashes = ".flashes"
  this.newCard = "card"
  this.cardBlank = "card-middle"
  this.cardJack = "card-jack"
  this.cardQueen = "card-queen"
  this.cardKing = "card-king"
  this.money = ".player-money"
  this.bet = ".player-bet"
  this.dBet = ".dbet-but"
  this.iBet = ".ibet-but"
  this.cardSound = new Audio("sounds/card.mp3")
}

View.prototype = {
  playerScore: function() {
    return document.querySelector(this.pScore)
  },
  dealerScore: function() {
    return document.querySelector(this.dScore)
  },
  updatePlayerBet: function(){
    return document.querySelector(this.bet)
  },
  getPlayerBet: function() {
    return Number(this.updatePlayerBet().innerHTML)
  },
  playerMoney: function() {
    return document.querySelector(this.money)
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
  getdBetButton: function() {
    return document.querySelector(this.dBet)
  },
  getiBetButton: function() {
    return document.querySelector(this.iBet)
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
      this.flashMessage("#00CD64", "#138442", "player won!")
    } else {
      this.flashMessage("#FD4547", "#D71F20", "player lost!")
    }
  },
  pushMsg: function() {
    this.flashMessage("#FDEFBC", "#EEE092", "push...")
  },
  blackJackMsg: function(user) {
    this.flashMessage("#00CD64", "#138442", user + " got Blackjack!")
  },
  resetScore: function() {
    // this.dealerScore().innerHTML = 0
    this.playerScore().innerHTML = 0
  },
  resetBet: function() {
    this.updatePlayerBet().innerHTML = "100"
  },
  updateMoney: function(amount) {
    this.playerMoney().innerHTML = "$" + amount
  },
  getCardSound: function() {
    this.cardSound.oncanplaythrough
    return this.cardSound.play()
  }
}

function Controller(view, shoe, player, dealer) {
  this.view = view
  this.shoe = shoe
  this.player = player
  this.dealer = dealer
  this.playerStood = 0
}
Controller.prototype = {
  intializeStart: function() {
    this.bindListeners()
    this.shoe.makeSixDecks()
  },
  bindListeners: function() {
    var dealBut = this.view.getDealButton(),
    hitBut = this.view.getHitButton(),
    standBut = this.view.getStandButton(),
    decBetBut = this.view.getdBetButton(),
    incBetBut = this.view.getiBetButton()
    dealBut.addEventListener('click', this.dealButton.bind(this))
    hitBut.addEventListener('click', this.hitButton.bind(this))
    standBut.addEventListener('click', this.standButton.bind(this))
    decBetBut.addEventListener('click', this.decBetButton.bind(this))
    incBetBut.addEventListener('click', this.incBetButton.bind(this))
  },
  startRound: function() {
    //wedge check
    var that = this
    if (this.shoe.checkWedge() == true) {
      this.seedHands()
      this.playCards("player")
      setTimeout(function(){
        that.seedHands()
        that.playCards("dealer")
        setTimeout(function(){that.playCards("player")},1400)
      }, 700)
    } else {
      this.reshuffle()
      setTimeout(function(){that.dealButton()}, 2800)
    }
  },
  reshuffle: function() {
    var that = this
    this.shoe.empty()
    this.shoe.makeSixDecks()
  },
  dealButton: function(button) {
    var that = this
    this.endRound()
    this.startRound()
    this.toggleInitialButtons("off")
    setTimeout(function(){
      that.toggleDecisionButtons("on")
    }, 2800)
  },
  hitButton: function() {
    this.deal("player")
    this.playCards("player")
  },
  standButton: function(button) {
    this.toggleDecisionButtons("off")
    this.flipCardBack(this.dealer.hand[0])
    this.playerStood = 1
    this.dealerHand()
  },
  decBetButton: function() {
    var debit = 100
    if (this.player.bet >0) {
      this.player.bet -= debit
      this.view.updatePlayerBet().innerHTML = this.player.bet
    }
  },
  incBetButton: function() {
    var debit = 100
    if (this.player.bet < this.player.money) {
      this.player.bet += debit
      this.view.updatePlayerBet().innerHTML = this.player.bet
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
    this.deal("player"); this.deal("dealer");
  },
  dealerHand: function() {
    var that = this
    if (this.gotBlackJack("dealer") == true) {
      setTimeout(function(){that.whoWon()}, 1000)
    } else {
      //added != 0 to prevent timeout
      while (this["dealer"].roundCardCount < 17 && this["dealer"].roundCardCount != 0) {
        this.deal("dealer")
      }
      //if player stood and dealer added no cards
      if (this.playerStood == 1 && this["dealer"].hand.length == 2) {
        setTimeout(function(){that.whoWon()}, 1000)
      } else if (this["dealer"].hand.length > 2) {
        this.playCards("dealer")
      }
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
      dealEm = setInterval(function(){
        that.addCardToDOM(user, that[user].hand[that[user].counter])
        that[user].counter +=1
        //clear interval
        if (that[user].counter >= that[user].hand.length) {
          // that.view[user + "Score"]().innerHTML = that[user].roundCardCount
          if (user == "player") that.view.playerScore().innerHTML = that.player.roundCardCount
          clearInterval(dealEm)
          if (that.dealer.counter > 2) {
            setTimeout(function(){that.whoWon()}, 1000)
          }
        }
      }, 700)
    }
    if (this.dealer.hand.length >=2) that.checkHand(user)
  },
  checkHand: function(user) {
    var that = this,
    amount = this.view.getPlayerBet()
    if (this[user].roundCardCount > 21) {
      if (this.checkForAce(user) == true) {
        this[user].roundCardCount -= 10
        //trigger more cards for auto dealer
        if (user === "dealer") this.dealerHand()
      } else {
        //if no recovery, decide who won
        this.toggleDecisionButtons("off")
        setTimeout(function(){
          if (user == "dealer") {
            that.view.playerWinMsg(true)
            that.player.increaseBet(amount)
          } else {
            that.view.playerWinMsg(false)
            that.player.decreaseBet(amount)
          }
          that.view.updateMoney(that.player.money)
          //game over if player has no more money
          if (that.player.money <= 0) {
            that.gameOver()
          } else {
            that.toggleInitialButtons("on")
          }
        }, 1000)
      }
    } else if (user == "player" && this.gotBlackJack(user) == true) {
      setTimeout(function(){
        that.view.blackJackMsg(user)
        //payout x1.5 bet if dealer does not have bj
        if (that.gotBlackJack("dealer") != true) {
          var blackJackBet = amount * 1.5
          that.player.increaseBet(blackJackBet)
          that.view.updateMoney(that.player.money)
        }
      }, 1000)
    }
  },
  whoWon: function() {
    var dealerHand = this["dealer"].roundCardCount,
    playerHand = this["player"].roundCardCount,
    amount = this.view.getPlayerBet()
    if (playerHand <=21 && dealerHand <=21) {
      if ((playerHand == dealerHand && this.gotBlackJack("player") != true && this.gotBlackJack("dealer") != true) || (this.gotBlackJack("player") == true && this.gotBlackJack("dealer") == true)) {
        this.view.pushMsg()
      } else if (dealerHand > playerHand ||  dealerHand == playerHand && this.gotBlackJack("dealer") == true) {
        this.view.playerWinMsg(false)
        this.player.decreaseBet(amount)
      } else {
        this.view.playerWinMsg(true)
        this.player.increaseBet(amount)
      }
      this.view.updateMoney(this.player.money)
    }
    //game over if player has no more money
    if (this.player.money <= 0) {
      this.gameOver()
    } else {
      this.toggleInitialButtons("on")
    }
  },
  gotBlackJack: function(user) {
    if (this[user].hand.length == 2) {
      if (this[user].hand[0].rank == "A" && this[user].hand[1].val == 10 || this[user].hand[1].rank == "A" && this[user].hand[0].val == 10 && this[user].hand.length == 2) {
        return true
      }
    }
  },
  rand: function() {
    return Math.floor(Math.random() * 7)
  },
  addCardToDOM: function(user, card) {
    if (card != null) {
      var userDiv = this.view.getUserDiv(user),
      cardDiv = this.view.createDiv(),
      cardMiddle = this.view.createDiv(),
      cardRight = this.view.createDiv()
      if (user === "dealer" && this[user].counter == 0) {
        userDiv.appendChild(cardDiv).className = "flipped-card"
      } else {
        userDiv.appendChild(cardDiv).className = this.view.newCard
        if (card.suit == "\u2666" || card.suit == "\u2665") {
          cardDiv.style.color = "red"
        }
        cardDiv.innerHTML = card.rank + "<br>" + card.suit
        cardDiv.appendChild(cardMiddle).className = this.getSuitFace(card)
        cardDiv.appendChild(cardRight).className = "card-right"
        cardRight.innerHTML = card.rank + "<br>" + card.suit
      }
      cardDiv.style.webkitTransform = "rotate(" + this.rand()  + "deg)"
      this.view.getCardSound()
    }
  },
  flipCardBack: function(card) {
    var flippedCard = this.view.getFlippedCard(),
    cardMiddle = this.view.createDiv(),
    cardRight = this.view.createDiv()
    flippedCard.className = "card"
    if (card.suit == "\u2666" || card.suit == "\u2665") {
      flippedCard.style.color = "red"
    }
    flippedCard.innerHTML = card.rank + "<br>" + card.suit
    flippedCard.appendChild(cardMiddle).className = this.getSuitFace(card)
    flippedCard.appendChild(cardRight).className = "card-right"
    cardRight.innerHTML = card.rank + "<br>" + card.suit
  },
  getSuitFace: function(card) {
    if (card.rank == "J") {
      return this.view.cardJack
    } else if (card.rank == "Q") {
      return this.view.cardQueen
    } else if (card.rank == "K") {
      return this.view.cardKing
    } else {
      return this.view.cardBlank
    }
  },
  checkForAce: function(user) {
    var hand = this[user].hand
    for (var i = 0, x = hand.length; i < x; i++) {
      if (hand[i].rank == "A" && hand[i].val == 11) {
        hand[i].val = 1
        return true
      }
    }
  },
  toggleDecisionButtons: function(status){
    this.toggleBut(this.view.getHitButton(), status)
    this.toggleBut(this.view.getStandButton(), status)
  },
  toggleInitialButtons: function(status) {
    this.toggleBut(this.view.getdBetButton(), status)
    this.toggleBut(this.view.getiBetButton(), status)
    this.toggleBut(this.view.getDealButton(), status)
  },
  endRound: function() {
    this["player"].resetHand()
    this["dealer"].resetHand()
    this.view.removeCards()
    this.toggleDecisionButtons("off")
    this.view.resetScore()
    this.playerStood = 0
  },
  gameOver: function() {
    var that = this
    this.toggleInitialButtons("off")
    this.toggleDecisionButtons("off")
    setTimeout(function(){
      that.endRound()
      that.view.flashMessage("#222", "#000", "GAME OVER!")
      that.reshuffle()
      that.player.money = 5000
      that.view.updateMoney(5000)
      that.player.bet = 100
      that.view.resetBet()
      that.toggleInitialButtons("on")
    }, 2400)
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
    console.log("adding " + i + " new decks: " + this.cards.length + " cards" )
    this.shuffle()
  },
  shuffle: function() {
    console.log("shuffling cards")
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
  empty: function() {
    this.cards = []
    console.log("emptied shoe " + this.cards)
  }
}

function User(name) {
  this.name = name
  this.hand = []
  this.roundCardCount = 0
  this.counter = 0
  this.money = 5000
  this.bet = 100
}
User.prototype = {
  increaseBet: function(bet) {
    this.money += bet
  },
  decreaseBet: function(bet) {
    this.money -= bet
  },
  resetHand: function() {
    this.hand = []
    this.roundCardCount = 0
    this.counter = 0
  }
}