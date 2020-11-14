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
            playerTurn: false,
            dealerTurn: false,
            pTotal: 0,
            dTotal: 0
        }

        this.beginHand = this.beginHand.bind(this);
        this.deductBank = this.deductBank.bind(this);
        this.playerHit = this.playerHit.bind(this);
        this.playerStand = this.playerStand.bind(this);
        this.double = this.double.bind(this);
        this.split = this.split.bind(this);
        this.countHand = this.countHand.bind(this);
        this.updatepTotal = this.updatepTotal.bind(this);
        this.updatedTotal = this.updatedTotal.bind(this);

        console.log(this.state.deck);
    }

    playerHit() {
        this.hit("player");
    }

    playerStand() {
        this.dealerActions();
    }

    double() {

    }

    split() {

    }

    dealerActions() {

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
                    // setTimeout(function(){console.log("dealing...")}, 2500);
                }
                
                // dealer peak 
                // if no dealer blackjack
                
                this.setState({playerTurn: true, dealerMessage: ""});
            });
        }
    }

    updatepTotal() {
        this.setState({pTotal: this.countHand("player")});
    }

    updatedTotal() {

    }

    countHand(hand) {
        if (hand === "player") {
            // check for ace/soft-hand
            // 
            let count = 0;
            for (const card of this.state.pHand) {
                count += card.value;
            }
            return this.getPlayerSoftHandCount(this.state.pHand, count);
        } else {

        }
    }

    getPlayerSoftHandCount(cards, count) {
        let check = false;
        let lowCount = "";
        let isSoft = false;
        for (const card of cards) {
            if (card.value === 1) {
                check = true;
            }
        }

        if (check) {
            count = count + 10;
            isSoft = true;
            if (count > 21) {
                isSoft = false;
                count = count - 10;
            } 
        }

        if (check && count < 19 && isSoft) {
            let lowCount = count - 10;
            count = lowCount + " or " + count;
        }

        return count;
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

    deductBank(bet) {
        let newBank = this.state.bankRoll - bet;
        this.setState({bankRoll: newBank});
    }

    getCurrentScores() {
        let score = [];
        if (this.state.inHand) {
            if (this.state.dHand.length == 2) {
                score.push(<p key="showCard" className="score">The dealer is showing {this.state.dHand[1].value}</p>);   
                score.push(<p key="playerCount" className="score">Player: {this.state.pTotal}</p>);
            } else {
                score.push(<p key="dealerCount" className="score">Dealer: {this.state.dTotal}</p>);
                score.push(<p key="playerCount" className="score">Player: {this.state.pTotal}</p>);
            }
        }
        
        return score;
    }

    render() {
        const scores = this.getCurrentScores();

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
                            { scores }
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
                            updatepTotal={this.updatepTotal}
                        />
                    </div>
                </div>
                <div className="playerControls">
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
                        deductBank={this.deductBank}
                        hit={this.playerHit}
                        stand={this.playerStand}
                        double={this.double}
                        split={this.split}
                    />
                </div>
            </div>
        )
    }
}

export default Table