import chai from 'chai';
import spies from 'chai-spies';
import Game from '../src/Game';
import Round from '../src/Round';
import Player from '../src/Player';
import domUpdates from '../src/domUpdates';

const assert = chai.assert;
const expect = chai.expect;
chai.use(spies);

describe('Game', () => {

  beforeEach(function() {
    chai.spy.on(domUpdates, 'displayCurrentQuestion', () => true);
    chai.spy.on(domUpdates, 'startRound', () => true);
    chai.spy.on(domUpdates, 'switchPlayer', () => true);
  });

  afterEach(function() {
    chai.spy.restore(domUpdates);
  });

  it('should be able to instantiate a new game', () => {
    let game = new Game();
    assert.instanceOf(game, Game);
  });

  it('should start at round 0', () => {
    const game = new Game();
    assert.equal(game.round, 0);
  });

  it('should start with a currentPlayer value of null', () => {
    const game = new Game();
    assert.equal(game.currentPlayer, null);
  });


  it('should start with a currentRound value of null', () => {
    const game = new Game();
    assert.equal(game.currentRound, null);
  });

  it('should accept an array of players', () => {
    const player1 = new Player('Jarrett', 1);
    const player2 = new Player('Brennan', 2);
    const game = new Game(player1, player2);
    assert.equal(game.players[0].name, 'Jarrett');
    assert.equal(game.players[1].name, 'Brennan');
  }); 

  it('should set currentPlayer to first player on round 1', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    const game = new Game(player1, player2, [1, 2]);
    game.startGame();
    assert.equal(game.currentPlayer, player1);
  });

  it('should set currentPlayer to second player on round 2', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    const game = new Game(player1, player2, [1, 2]);
    game.startGame();
    game.startNextRound(); 
    assert.equal(game.currentPlayer, player2);
  });

  it('should accept an argument of an array', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    const game = new Game(player1, player2, [1, 2, 3]);
    assert.deepEqual(game.surveys, [1, 2, 3]);
  });


  it('should be able to shuffle surveys', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    let game = new Game(player1, player2);
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    game.shuffle(array);
    assert.notDeepEqual(array, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should start increment round upon initiation of game', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    const game = new Game(player1, player2, [1, 2]);
    game.startGame();
    assert.equal(game.round, 1);
  });

  it('should call domUpdates.start round once when game is started', () => {
    const game = new Game({}, {}, [1, 2]);
    game.startGame();
    expect(domUpdates.startRound).to.have.been.called(1);
  });

  it('should be able to switch players', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    const game = new Game(player1, player2, [1, 2]);
    game.startGame();
    assert.equal(game.currentPlayer, player1);
    game.switchPlayers();
    assert.equal(game.currentPlayer, player2);
    expect(domUpdates.switchPlayer).to.have.been.called(1);
  });

  it('setRoundPlayer should return first player in Players when round is equal to 1', () => {
    const player1 = new Player('Brennan');
    const player2 = new Player('Jarrett');
    let game = new Game(player1, player2, [1, 2]);
    game.round = 1;
    const currentPlayer = game.setRoundPlayer();
    assert.equal(currentPlayer, player1);
  });

  it('setRoundPlayer should return second player in Players when round is equal to 2', () => {
    const player1 = new Player();
    const player2 = new Player();
    let game = new Game(player1, player2, [1, 2]);
    game.round = 2;
    const currentPlayer = game.setRoundPlayer();
    assert.equal(currentPlayer, player2);
  });

  it('startNextLightningRound increment the round', () => {
    const game = new Game({}, {}, [1, 2]);
    game.startNextLightningRound();
    assert(game.round, 1);
    expect(domUpdates.startRound).to.have.been.called(1);
  });


  it('startNextLightningRound should set current player to player with lowest score for first lightning round', () => {
    let player1 = new Player();
    let player2 = new Player();
    const game = new Game(player1, player2, [1, 2, 3]);
    game.startGame();
    game.startNextRound();
    player1.score = 50;
    player2.score = 300;
    game.startNextLightningRound();
    assert(game.currentPlayer, player2);
    expect(domUpdates.startRound).to.have.been.called(3);
  });

  it('setLightningRoundPlayer should return player with lower score', () => {
    const player1 = new Player();
    const player2 = new Player();
    const game = new Game(player1, player2);
    player1.score = 50;
    player2.score = -25;
    const lightningRoundPlayer = game.setLightningRoundPlayer;
    assert(lightningRoundPlayer, player1);
  });

  it('setLightningRoundPlayer should return player with lower score', () => {
    const player1 = new Player();
    const player2 = new Player();
    const game = new Game(player1, player2);
    player1.score = 50;
    player2.score = 125;
    const lightningRoundPlayer = game.setLightningRoundPlayer;
    assert(lightningRoundPlayer, player2);
  });

  it('should be able to determine the winner', () => {
    let player1 = new Player();
    let player2 = new Player();
    player1.score = 50;
    player2.score = 51;
    const game = new Game(player1, player2);
    let winner = game.getWinner();
    assert(winner, player2);
  });

  it('should be able to determine the winner', () => {
    let player1 = new Player();
    let player2 = new Player();
    player1.score = 50;
    player2.score = 49;
    const game = new Game(player1, player2);
    let winner = game.getWinner();
    assert(winner, player1);
  });

  it('should be able to determine the winner', () => {
    let player1 = new Player();
    let player2 = new Player();
    player1.score = 50;
    player2.score = 50;
    const game = new Game(player1, player2);
    let winner = game.getWinner();
    assert(winner, 'Draw');
  });





  // should have round counter, nun, default 0 or 1
  // should have players, array, call createPlayers
  // should createPlayers, return [] of Players
  // should check guess 
  // should have startGame
  // should have nextRound
  // should have getWinner  

});