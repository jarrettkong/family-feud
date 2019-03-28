import chai from 'chai';
import spies from 'chai-spies';
import Game from '../src/Game';
import Round from '../src/Round';
import Player from '../src/Player';
import domUpdates from '../src/domUpdates';
import LightningRound from '../src/LightningRound';


chai.use(spies);
const assert = chai.assert;

describe('LightningRound', () => {

  beforeEach(function() {
    chai.spy.on(domUpdates, 'updateScores', () => true);
    chai.spy.on(domUpdates, 'revealResponse', () => true);
  });

  afterEach(function() {
    chai.spy.restore(domUpdates);
  });

  it('should be able to instantiate a new round', () => {
    let lightningRound = new LightningRound({});
    assert.instanceOf(lightningRound, LightningRound);
  });


  it('should have a question', () => {
    let lightningRound = new LightningRound({ question: 'this is a question' });
    assert.equal(lightningRound.question, 'this is a question');
  });


  it('should have a property of isFinished that starts off false', () => {
    let lightningRound = new LightningRound({});
    assert.equal(lightningRound.isFinished, false);
  });

  it('if guess is correct that response should be filtered from the array', () => {
    let lightningRound = new LightningRound({});
    let player = new Player();
    lightningRound.responses = [{answer:'Watch'}];
    lightningRound.submitGuess(player, 'watch');
    assert.equal(lightningRound.responses.length, 0);
  });

  it('should change isFinished to true when entire response array is filtered', () => {
    let lightningRound = new LightningRound({});
    let player = new Player();
    lightningRound.responses = [{answer:'Watch'}];
    lightningRound.submitGuess(player, 'watch');
    assert.equal(lightningRound.isFinished, true);
  });
});