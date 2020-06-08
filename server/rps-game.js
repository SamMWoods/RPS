
class RpsGame {

  constructor(p1, p2) {
    this._players = [p1, p2]; //storing the two sockets in array
    this._turns = [null, null]; //initializing each players turn

    this._sendToPlayers('Rock Paper Scissors Starts!'); //passing message to function

    //getting the turn from the player
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => { //recieving turn for client.js
        this._onTurn(idx, turn); //passing turn to the _onTurn function
      });
    });
  }

  //send private message to the client
  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg); 
  }

  //send global message to the client
  _sendToPlayers(msg) {
    this._players.forEach(player => player.emit('message', msg));
  }

  //handling turns
  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn; //passed in turns array
    this._sendToPlayer(playerIndex, `You selected ${turn}`); //sends private message

    this._checkGameOver(); 
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {  //checks in both turns have be selected
      this._sendToPlayers('Game over ' + turns.join(' : '));
      this._getGameResult();
      this._turns = [null, null]; //resetting the game
      this._sendToPlayers('Next Round!!!');
    }
  }

  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0]); //get P1 turn in INT
    const p1 = this._decodeTurn(this._turns[1]); //get P2 turn in INT

    const distance = (p1 - p0 + 3) % 3; //RPS algorithm 

    switch (distance) {
      case 0:
        this._sendToPlayers('Draw!');
        break;

      case 1:
        this._sendWinMessage(this._players[0], this._players[1]);
        break;

      case 2:
        this._sendWinMessage(this._players[1], this._players[0]);
        break;
    }
  }

  //emit to the user who won and lost 
  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.'); 

    
  }

  //changing string to int
  _decodeTurn(turn) {
    switch (turn) {
      case 'rock':
        return 0;
      case 'scissors':
        return 1;
      case 'paper':
        return 2;
      default:
        throw new Error(`Could not decode turn ${turn}`);
    }
  }


}

module.exports = RpsGame;
