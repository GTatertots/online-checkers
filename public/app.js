const SERVER_URL = ""

var app = Vue.createApp({
  data: function () {
    return {
      socket: null,
      playersAvailable: 2,
      player: 0, //player will be assigned to 1 or 2, depending on when they sign in
      winner: -1,
      messageToSend: "",
      squares: [1,-1,1,-1,1,-1,1,-1,
	      -1,1,-1,1,-1,1,-1,1,
	      1,-1,1,-1,1,-1,1,-1,
	      -1,0,-1,0,-1,0,-1,0,
	      0,-1,0,-1,0,-1,0,-1,
	      -1,2,-1,2,-1,2,-1,2,
	      2,-1,2,-1,2,-1,2,-1,
      	      -1,2,-1,2,-1,2,-1,2],
      currentPiece: "",
      turn: 0
    };
  },
  
  methods: {
    connectSocket: function () {
      this.socket = new WebSocket("wss://s23-websocket-gtatertots-production.up.railway.app/")
      this.socket.onmessage = (event) => {
	this.handleMessageFromSocket(JSON.parse(event.data));
      };
    },
    handleMessageFromSocket: function (data) {
      console.log("message recieved from socket:", data);
      if(data.board) {
        this.squares = data.board;
      } 
      if(data.turn) {
        this.turn = data.turn;
      }
      if(data.winner) {
        this.winner = data.winner;
      }
      if(data.playersAvailable != null) {
        this.playersAvailable = data.playersAvailable;
      }
      console.log("playersAvailable after player joined:", this.playersAvailable);
    },
    sendMessageToSocket: function () {
      var message = {
        playersAvailable: this.playersAvailable
      }
      this.socket.send(JSON.stringify(message));
    },
    updateBoardOnSocket: function () {
      var message = {
        board: this.squares,
	turn: this.turn
      }
      this.socket.send(JSON.stringify(message));
    },
    startGame: function () {
      var message = {
        turn: this.turn
      }
      this.socket.send(JSON.stringify(message));
    },
    joinGame: function () {
      if(this.playersAvailable == 2) {
        this.player = 1;
	this.playersAvailable -= 1;
      } else if(this.playersAvailable == 1) {
        this.player = 2;
	this.playersAvailable -= 1;
	this.turn = 1;
	this.startGame();
      } else {
        console.log("cannot join full game, please spectate.")
      }
      this.sendMessageToSocket();
      console.log("players available:", this.playersAvailable);
    },
    validMove: function (i) {
      console.log("validMove() called successfully")
      var validMoves = [];
      if((this.squares[this.currentPiece] == 1) || (this.squares[this.currentPiece] == 3) || (this.squares[this.currentPiece] == 4)) { 
        if(this.squares[this.currentPiece + 9] == 0 && this.currentPiece % 8 != 7) {
          validMoves.push(this.currentPiece + 9);
	}
	if(this.squares[this.currentPiece + 7] == 0 && this.currentPiece % 8 != 0) {
          validMoves.push(this.currentPiece + 7);
	}
	if(((this.squares[this.currentPiece] == 1) || (this.squares[this.currentPiece] == 3)) && ((this.squares[this.currentPiece + 9] == 2) || (this.squares[this.currentPiece + 9] == 4)) && (this.currentPiece + 9) % 8 != 7) {
          if(this.squares[this.currentPiece + 18] == 0) {
            validMoves.push(this.currentPiece + 18);
	  }
	}
	if(this.squares[this.currentPiece] == 4 && ((this.squares[this.currentPiece + 9] == 1) || (this.squares[this.currentPiece + 9] == 3)) && (this.currentPiece + 9) % 8 != 7) {
	  if(this.squares[this.currentPiece + 18] == 0) {
            validMoves.push(this.currentPiece + 18);
          }
	}
	if(((this.squares[this.currentPiece] == 1) || (this.squares[this.currentPiece] == 3)) && ((this.squares[this.currentPiece + 7] == 2) || (this.squares[this.currentPiece + 7] == 4)) && (this.currentPiece + 7) % 8 != 0) {
          if(this.squares[this.currentPiece + 14] == 0) {
            validMoves.push(this.currentPiece + 14);
	  }
	}
	if(this.squares[this.currentPiece] == 4 && ((this.squares[this.currentPiece + 7] == 1) || (this.squares[this.currentPiece + 7] == 3)) && (this.currentPiece + 7) % 8 != 0) {
          if(this.squares[this.currentPiece + 14] == 0) {
            validMoves.push(this.currentPiece + 14);
          }
        }
      }
      if((this.squares[this.currentPiece] == 2) || (this.squares[this.currentPiece] == 3) || (this.squares[this.currentPiece] == 4)) {
        if(this.squares[this.currentPiece - 9] == 0 && this.currentPiece % 8 != 0) {
          validMoves.push(this.currentPiece - 9);
        }
	if(this.squares[this.currentPiece - 7] == 0 && this.currentPiece % 8 != 7) {
          validMoves.push(this.currentPiece - 7);
        }
	if(((this.squares[this.currentPiece] == 2) || (this.squares[this.currentPiece == 4])) && ((this.squares[this.currentPiece - 9] == 1) || (this.squares[this.currentPiece - 9] == 3)) && (this.currentPiece - 9) % 8 != 0) {
          if(this.squares[this.currentPiece - 18] == 0) {
            validMoves.push(this.currentPiece - 18);
          }
        }
	if(this.squares[this.currentPiece] == 3 && ((this.squares[this.currentPiece - 9] == 2) || (this.squares[this.currentPiece - 9] == 4)) && (this.currentPiece - 9) % 8 != 0) {
          if(this.squares[this.currentPiece - 18] == 0) {
            validMoves.push(this.currentPiece - 18);
          }
	}
	if(((this.squares[this.currentPiece] == 2) || (this.squares[this.currentPiece == 4]) ) && ((this.squares[this.currentPiece - 7] == 1) || (this.squares[this.currentPiece - 7] == 3)) && (this.currentPiece - 7) % 8 != 7) {
          if(this.squares[this.currentPiece - 14] == 0) {
            validMoves.push(this.currentPiece - 14);
          }
	}
	if(this.squares[this.currentPiece] == 3 && ((this.squares[this.currentPiece - 7] == 2) || (this.squares[this.currentPiece - 7] == 4)) && (this.currentPiece - 7) % 8 != 7) {
	  if(this.squares[this.currentPiece - 14] == 0) {
            validMoves.push(this.currentPiece - 14);
          }
        }
      }
      console.log( validMoves );
      return validMoves.includes(i);
    },
    endgame: function (i) {
      if(i == 1) {
        this.winner = 1;
      }
      if(i == 2) {
        this.winner = 2;
      }
      this.turn = -1;
      var message = {
        winner: this.winner,
	turn: this.turn
      }
      this.socket.send(JSON.stringify(message));
    },
    redSelectSquare: function (i) {
      if(this.squares[i] < 0) {
        console.log("Not a playable square");
      } else {
        if(this.currentPiece !== "") {
	  if(i == this.currentPiece) {
            this.currentPiece = "";
	  } else if(this.validMove(i) == true) {
            if(this.squares[this.currentPiece] == 3) {
              if(this.currentPiece - 18 == i) {
                this.squares[this.currentPiece - 9] = 0;
	      }
	      if(this.currentPiece - 14 == i) {
                this.squares[this.currentPiece - 7] = 0;
	      }
            } 
	    if(i > 56) {
              this.squares[this.currentPiece] = 3;
	    }
	    if(this.currentPiece + 18 == i) {
              this.squares[this.currentPiece + 9] = 0;
	    }
            if(this.currentPiece + 14 == i) {
              this.squares[this.currentPiece + 7] = 0;
	    }
            this.squares[i] = this.squares[this.currentPiece];
            this.squares[this.currentPiece] = 0;
            this.currentPiece = "";
	    this.turn = 2;
	    if(!this.squares.includes(1) && !this.squares.includes(3)) {
              this.endgame(2);
            }
            if(!this.squares.includes(2) && !this.squares.includes(4)) {
              this.endgame(1);
            }
            this.updateBoardOnSocket();
          } else {
            console.log("Invalid move");
          }
        }
        if((this.squares[i] == 1) || (this.squares[i] == 3)) {
          this.currentPiece = i;
        } else {
          console.log("please move one of your own pieces");
        }
      }
      console.log(this.currentPiece);
    },
    blackSelectSquare: function (i) {
     if(this.squares[i] < 0) {
        console.log("Not a playable square");
      } else {
        if(this.currentPiece) {
	  if(this.currentPiece == i) {
            this.currentPiece = "";
	  } else if(this.validMove(i) == true) {
	    if(this.squares[this.currentPiece] == 4) {
	      if(this.currentPiece + 18 == i) {
                this.squares[this.currentPiece + 9] = 0;
              }
              if(this.currentPiece + 14 == i) {
                this.squares[this.currentPiece + 7] = 0;
              }
	    }
	    if(i < 8) {
              this.squares[this.currentPiece] = 4;
	    }
	    if(this.currentPiece - 18 == i) {
              this.squares[this.currentPiece - 9] = 0;
	    }
	    if(this.currentPiece - 14 == i) {
              this.squares[this.currentPiece - 7] = 0;
	    }
            this.squares[i] = this.squares[this.currentPiece];
            this.squares[this.currentPiece] = 0;
            this.currentPiece = "";
	    this.turn = 1
	    if(!this.squares.includes(1) && !this.squares.includes(3)) {
              this.endgame(2);
	    }
	    if(!this.squares.includes(2) && !this.squares.includes(4)) {
              this.endgame(1);
	    }
            this.updateBoardOnSocket();
          } else {
            console.log("Invalid move");
          }
        } 
        if((this.squares[i] == 2) || (this.squares[i] == 4)) {
          this.currentPiece = i;
        } else {
          console.log("please select one of your pieces");
	}
      }
      console.log(this.currentPiece);
    },
    selectSquare: function (i) {
      if(this.player == 1 && this.turn == 1) {
        this.redSelectSquare(i);
      } else if(this.player == 2 && this.turn == 2) {
        this.blackSelectSquare(i);
      }
    }
  },

  created: function () {
    this.connectSocket(); 
    console.log("Player", this.player);
  }
}).mount("#app");


