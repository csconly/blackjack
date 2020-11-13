import React, { Component } from 'react';
import PlayerCommands from './PlayerCommands'
import '../styles/blackjack.css';
import * as Constants from '../js/constants';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankRoll: parseInt(this.props.bankRoll),
            deckCount: parseInt(this.props.decks),
            deck: this.buildGameDeck(parseInt(this.props.decks)),
            bet: 0,
            inHand: false,
            dealerMessage: "Place your bet!",
            dHand: [],
            pHand: [],
            playerTurn: false
        }
        this.beginHand = this.beginHand.bind(this);
        console.log(this.state.deck);
    }
    // I am using the Fisher-Yates algorithm 
    // While reading online I discovered this algorithm is best for shuffling an array
    shuffle(deck) {
        let currentIndex = deck.length;
        let temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = deck[currentIndex];
          deck[currentIndex] = deck[randomIndex];
          deck[randomIndex] = temporaryValue;
        }
      
        return deck;
      }

    buildGameDeck(count) {
        let gameDeck = [];

        for (let i = 0; i < Constants.deck.length; i++) {
            for (let j = 1; j <= count; j++) {
                gameDeck.push(Constants.deck[i]);
            }
        }

        return this.shuffle(gameDeck);
    }

    beginHand(newBet, warning = null) {
        if (warning) {
            this.setState({dealerMessage: warning});
        } else {
            this.setState({
                inHand: true, 
                bet: parseInt(newBet)
            }, function() {
                for (let i = 1; i <= 4; i++) {
                    if (i == 1 || i == 3) {
                        this.hit("player");
                    } else {
                        this.hit("dealer");
                    }
                }
            });
        }
    }

    hit(destination) {
        let cards = [...this.state.deck];
        console.log(cards[0]);
        if (destination === 'player') {
            this.setState(prevState => ({
                pHand: [...prevState.pHand, cards[0]]
            }));
            this.setState({deck: this.state.deck.splice(0, 1)});
        } else {
            this.setState(prevState => ({
                dHand: [...prevState.dHand, cards[0]]
            }));
            this.setState({deck: this.state.deck.splice(0, 1)});
        }
        console.log(this.state.deck)
    }

    render() {
        return(
            <div className="appBackground">
                <div className="table">
                    <div className="dealerArea">
                        <DealerHand 
                            dHand={this.state.dHand} 
                        />
                        <div className="dialogue">
                            <h1 style={{textAlign: 'center'}}>Dealer Dialogue:</h1>
                            <p>{this.state.dealerMessage}</p>
                        </div>
                    </div>
                    <div className="gamePrint">
                        <p>Blackjack pays 3 to 2</p>
                        <p>Insurance Pays 2 to 1</p>
                        <p>Dealer Must Hit Soft 17</p>
                    </div>
                    <div>
                        <PlayerHand 
                            pHand={this.state.pHand} 
                        />
                    </div>
                </div>
                <div className="bank">
                    <div style={{float: 'left'}}> 
                        <h1 style={{textAlign: 'left', marginLeft: '10px'}}>Bank</h1>
                        <h2 style={{textAlign: 'left', marginLeft: '10px'}}>${this.state.bankRoll.toFixed(2)}</h2>
                    </div>
                    <div style={{float: 'right'}}> 
                        <h1 style={{textAlign: 'left', marginRight: '10px'}}>Bet</h1>
                        <h2 style={{textAlign: 'left', marginRight: '10px'}}>${this.state.bet.toFixed(2)}</h2>
                    </div>
                </div>
                <PlayerCommands 
                    beginHand={this.beginHand}
                    inHand={this.state.inHand}
                    playerTurn={this.state.playerTurn}
                    pHand={this.state.pHand}
                />
            </div>
        )
    }
}

export default Table