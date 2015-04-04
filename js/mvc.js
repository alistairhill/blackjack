window.onload = function() {
  var view = new View(),
  game = new Game(),
  contoller = new Controller(view, game)
  contoller.intializeStart()
}

function View() {

}

function Controller(view, game) {
  this.view = view
  this.game = game
}

Controller.prototype = {
  intializeStart: function() {
    console.log("hi")
  }
}


function Game() {

}