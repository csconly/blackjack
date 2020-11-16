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
            //deck: this.buildGameDeck(parseInt(this.props.decks)),
            bet: 0,
            insureBet: 0,
            secondBet: "Insurance",
            //split: false,
            inHand: false,
            dealerMessage: "Place your bet!",
            dHand: [],
            pHand: [],
            playerTurn: false,
            dealerTurn: false,
            pTotal: 0,
            dTotal: 0,
            triggerEndDialogue: false,
            dBJ: false,
            dealerAction: false,
            insurance: false,
            iPlayerBJ: false     //this is used for even money when the dealer has an ace showing
        }
        //this.deck = this.buildGameDeck(parseInt(this.props.decks));
        this.deck = Constants.testDeck;
        this.contDealing = true;

        this.beginHand = this.beginHand.bind(this);
        this.deductBank = this.deductBank.bind(this);
        this.playerHit = this.playerHit.bind(this);
        this.playerStand = this.playerStand.bind(this);
        this.double = this.double.bind(this);
        this.split = this.split.bind(this);
        this.updatepTotal = this.updatepTotal.bind(this);
        this.updateDealTotal = this.updateDealTotal.bind(this);
        this.playerBJ = this.playerBJ.bind(this);
        this.dealerAction = this.dealerAction.bind(this);
        this.newHand = this.newHand.bind(this);
        this.dealerBJ = this.dealerBJ.bind(this);
        this.decision = this.decision.bind(this);
        this.askInsurance = this.askInsurance.bind(this);
    }

    // *************************************** //
    // player action functions
    playerHit() {
        this.hit("player");
    }

    playerStand() {
        let playerHand = this.state.pTotal;
        if (typeof(playerHand) === "string") {
            playerHand = parseInt(playerHand[0]) + 10;
        }
        this.setState({
            dealerTurn: true, playerTurn: false, pTotal: playerHand, insureBet: 0
        });
    }

    double() {

    }

    split() {

    }

    deductBank(bet) {
        let newBank = this.state.bankRoll - bet;
        this.setState({bankRoll: newBank});
    }

    continueGame() {
        
        console.log("continue game is firing");
        if (this.countHand("player") === 21 && this.countHand("dealer" !== 21)) {
            //this.playerStand();
            this.endHand("pWinBJ");
        } else if (this.countHand("dealer") !== 21) {
            this.setState({
                insurance: false
            });
        } else if(this.countHand("dealer") === 21) {
            this.sleep(1000);
            this.endHand("dWinBJ");
        }
    }

    decision(answer) {
        switch(answer) {
            case "even":
                this.endHand("pWin");
                break;
            case "insure":
                let insure =  this.state.bet * .5;
                console.log(insure);
                this.deductBank(insure);
                this.setState({
                    insureBet: insure
                }, function (){
                    //this.sleep(10000);
                    this.continueGame();
                });
                break;
            case "no":
                this.continueGame();
                break;
        }
    }

    // *************************************** //
    // dealer logic 

    declareWinner(dTotal) {
        if (dTotal > 21) {
            this.endHand("dBusted");
        } else if (dTotal > this.state.pTotal) {
            this.endHand("dWin")
        } else if (this.state.pTotal > dTotal) {
            this.endHand("pWin");
        } else if (this.state.pTotal === dTotal) {
            this.endHand("push");
        }
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
        // check to see if I need to shuffle.
        // if about a third of deck is left we shuffle

        // let originalDeck = 52 * this.props.decks;
        // let percent =  this.deck.length / originalDeck;
        
        // if (percent < .34) {
        //     this.deck = this.buildGameDeck(parseInt(this.props.decks));
        // }

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
                
                this.setState({playerTurn: true, dealerMessage: ""});
            });
        }
    }

    updatepTotal() {
        let total = this.countHand("player");
        if (total > 21) {
            this.endHand("pBusted");
        } else {
            this.setState({pTotal: total});
        }
    }

    updateDealTotal() {
        let total = this.countHand("dealer");
        
        this.setState({
            dTotal: total
        }, function(){
            if (typeof(total) === "string") {
                if (total[0] === '7') {
                    total = 7;
                } else {
                    total = parseInt(total[0]) + 10
                }
            }
            
            if (total < 17 && this.state.dealerAction) {
                this.hitDealerHand();
            } else if (this.state.dealerAction) {
                // decide winner
                this.declareWinner(total);
            }
        });
    }

    countHand(hand) {
        if (hand === "player") {
            
            let count = 0;
            for (const card of this.state.pHand) {
                count += card.value;
            }
            return this.getPlayerSoftHandCount(this.state.pHand, count);
        } else {
            let count = 0;
            for (const card of this.state.dHand) {
                count += card.value;
            }
            return this.getDealerSoftHandCount(this.state.dHand, count);
        }
    }

    getDealerSoftHandCount(cards, count) {
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

        if (check && count < 18 && isSoft) {
            let lowCount = count - 10;
            count = lowCount + " or " + count;
        }

        return count;
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
        let cards = this.deck;
        console.log(cards);
        let hitCard = this.deck.shift();
        if (destination === 'player') {
            this.setState(prevState => ({
                pHand: [...prevState.pHand, hitCard]
            }));
        } else {
            this.setState(prevState => ({
                dHand: [...prevState.dHand, hitCard]
            }));
        }
    }

    hitDealerHand() {
        this.hit("dealer");
    }

    askInsurance() {
        console.log("ask insurance");
        let total = this.countHand("player");
        console.log(total);
        if (total === 21) {
            this.setState({insurance: true, iPlayerBJ: true}, function(){console.log("settingstate")});
        } else {
            this.setState({insurance: true});
        }
    }

    dealerBJ(backdoor = false) {
        
        if (this.state.dHand[0].value + this.state.dHand[1].valueA === this.countHand("player")) {
            this.endHand("push")
        } else {
            this.endHand("dWinBJ");
        }
    }

    playerBJ() {
        console.log("playerBJ");
        let total = this.state.pTotal;
        if (this.state.dHand[0].value !== 1) {
            if (this.state.dHand[0].value + this.state.dHand[1].valueA !== 21) {
                if (total === 21) {
                    this.endHand("pWinBJ");
                }
            }
        }
    }

    endHand(outcome) {
        let total = 0;
        switch(outcome) {
            case "push":
                this.setEndHand(this.state.bet + this.state.bankRoll, "Pushed");
                break;
            case "dWinBJ":
                total = this.state.bankRoll;
                if (this.state.insureBet !== 0) {
                    total = total + (this.state.insureBet * 2);
                }
                this.setEndHand(total, "Dealer Blackjack. You lose");
                break;
            case "dWin":
                this.setEndHand(this.state.bankRoll, "You lose");
                break;
            case "pBusted":
                this.setEndHand(this.state.bankRoll, "Busted you lose.");
                break;
            case "dBusted":
                total = this.state.bet * 2;
                this.setEndHand(this.state.bankRoll + total, "Dealer busted! You win!");
                break;
            case "pWinBJ":
                total = (this.state.bet * 1.5) + this.state.bet;
                this.setEndHand(this.state.bankRoll + total, "You got a Blackjack. Congratulations!");
                break;
            case "pWin":
                total = this.state.bet * 2;
                this.setEndHand(this.state.bankRoll + total, "You win!");
                break;
        }
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    dealerAction() {
        console.log("Dealer Action called");
        if (this.contDealing) {
            this.contDealing = false;
            if (!this.state.dealerAction) {
                console.log("setting dealer action");
                this.setState({
                    dealerAction: true
                }, function(){
                    this.updateDealTotal();
                });
            }
        }
    }
    // *************************************** //
    // render related and reset GUI functions
    getCurrentScores() {
        let score = [];
        if (this.state.inHand) {
            if (this.state.insurance) {
                if (this.state.iPlayerBJ) {
                    score.push(<p key="showCard" className="score">The dealer is showing an Ace</p>); 
                    score.push(<p key="playerCount" className="score">Would you like to take even money?</p>);
                } else {
                    score.push(<p key="showCard" className="score">The dealer is showing an Ace</p>); 
                    score.push(<p key="playerCount" className="score">Player: {this.state.pTotal}</p>);
                }
            } else {
                if (this.state.dHand.length == 2 && !this.state.dealerTurn) {
                    let value = this.state.dHand[0].value;
                    if (value === 1) {
                        value = "an Ace";
                    }
                    score.push(<p key="showCard" className="score">The dealer is showing {value}</p>);   
                    score.push(<p key="playerCount" className="score">Player: {this.state.pTotal}</p>);
                } else {
                    score.push(<p key="dealerCount" className="score">Dealer: {this.state.dTotal}</p>);
                    score.push(<p key="playerCount" className="score">Player: {this.state.pTotal}</p>);
                }
            }
        }
        
        return score;
    }

    getSecondaryBet() {
        let secBet = [];
        let insure = this.state.insureBet;
        console.log(insure);

        if (this.state.insureBet !== 0) {
            console.log("adding to bank render!");
            secBet.push(
                <h1 style={{textAlign: 'left', marginLeft: '10px'}}>Insurance</h1>
            );
            secBet.push(
                <h2 style={{textAlign: 'left', marginLeft: '10px'}}>${this.state.insureBet.toFixed(2)}</h2>
            );
        } else {
            console.log("unrender to bank");
        }
        
        return secBet;
    }

    setEndHand(newBank, dialogue) {
        this.setState({
            bankRoll: newBank,
            bet: 0,
            insureBet: 0,
            inHand: false,
            dealerMessage: dialogue,
            playerTurn: false,
            dealerTurn: false,
            triggerEndDialogue: true,
            dBJ: false,
            dealerAction: false,
            insurance: false,
            iPlayerBJ: false
        });
    }
    // this will be onClick for a button after the hand ends
    newHand() {
        console.log("new hand should be made");
        this.contDealing = true;
        this.setState({
            triggerEndDialogue: false, 
            dealerMessage: "Place you Bet!",
            dHand: [],
            pHand: [],
            pTotal: 0,
            dTotal: 0,
        });
    }


    render() {
        console.log(this.deck);
        const scores = this.getCurrentScores();
        const secondaryBet = this.getSecondaryBet();
        return(
            <div className="appBackground">
                <div className="table">
                    <div className="dealerArea">
                        <DealerHand 
                            dHand={this.state.dHand} 
                            updateDealTotal={this.updateDealTotal}
                            dealerBJ={this.dealerBJ}
                            dealerTurn={this.state.dealerTurn}
                            checkPlayerBlackjack={this.playerBJ}
                            dealerAction={this.dealerAction}
                            go={this.state.dealerAction}
                            inHand={this.state.inHand}
                            askInsurance={this.askInsurance}
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
                        <div style={{float: 'left'}}>
                            {/* <h1 style={{textAlign: 'left', marginLeft: '10px'}}>{this.state.secondBet}</h1>
                            <h2 style={{textAlign: 'left', marginLeft: '10px'}}>${this.state.insureBet.toFixed(2)}</h2> */}
                            {secondaryBet}
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
                        endGameControl={this.state.triggerEndDialogue}
                        newHand={this.newHand}
                        insurance={this.state.insurance}
                        playerBJ={this.state.iPlayerBJ}
                        decision={this.decision}
                    />
                </div>
            </div>
        )
    }
}

export default Table