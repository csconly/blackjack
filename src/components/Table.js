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
            bet: 0,
            sBet: 0,
            insureBet: 0,
            inHand: false,
            dealerMessage: "Place your bet!",
            dHand: [],
            pHand: [],
            split: false,
            pHand1: [],
            pHand2: [], 
            pTotal1: 0,
            pTotal2: 0,
            playerTurn: false,
            dealerTurn: false,
            onH1: false,
            onH2: false,
            pTotal: 0,
            dTotal: 0,
            triggerEndDialogue: false,
            dBJ: false,
            dealerAction: false,
            insurance: false,
            iPlayerBJ: false     //this is used for even money when the dealer has an ace showing
        }
        this.deck = this.buildGameDeck(parseInt(this.props.decks));
        //this.deck = Constants.testDeck;
        this.contDealing = true;
        this.beginHand = this.beginHand.bind(this);
        this.deductBank = this.deductBank.bind(this);
        this.playerHit = this.playerHit.bind(this);
        this.playerStand = this.playerStand.bind(this);
        this.double = this.double.bind(this);
        this.split = this.split.bind(this);
        this.updatepTotal = this.updatepTotal.bind(this);
        this.updateSPTotal = this.updateSPTotal.bind(this);
        this.updateDealTotal = this.updateDealTotal.bind(this);
        this.playerBJ = this.playerBJ.bind(this);
        this.dealerAction = this.dealerAction.bind(this);
        this.newHand = this.newHand.bind(this);
        this.dealerBJ = this.dealerBJ.bind(this);
        this.decision = this.decision.bind(this);
        this.askInsurance = this.askInsurance.bind(this);
        this.resetInsureBet = this.resetInsureBet.bind(this);
    }

    // *************************************** //
    // player action functions
    playerHit(split = 0) {
        switch (split) {
            case 0:
                this.hit("player");
                break;
            case 1:
                this.hit("player1");
                break;
            case 2: 
                this.hit("player2");
                break;
        }
        
    }

    playerStand() {
        let playerHand = this.state.pTotal;
        if (this.state.onH1) {
            this.setState({
                onH1: false, onH2: true
            }, function() {
                this.hit("player2");
            });
        } else {
            if (typeof(playerHand) === "string") {
                playerHand = parseInt(playerHand[0]) + 10;
            }
            this.setState({
                dealerTurn: true, playerTurn: false, pTotal: playerHand, insureBet: 0
            });
        } 
    }

    double() {
        this.setState({bet: this.state.bet * 2});
        this.deductBank(this.state.bet);
        this.hit("double");
    }

    split() {
        let firstCard = this.state.pHand[0];
        let secondCard = this.state.pHand[1];
        this.deductBank(this.state.bet);
        let sBet = this.state.bet;
        this.setState({
            split: true
        }, function() {
            this.setState(prevState => ({
                pHand1: [...prevState.pHand1, firstCard],
                pHand2: [...prevState.pHand2, secondCard],
                pHand: [],
                onH1: true,
                sBet: sBet
            }));
            
            this.hit("player1");
        });
    }

    deductBank(bet) {
        if (bet <= this.state.bankRoll) {
            let newBank = this.state.bankRoll - bet;
            this.setState({bankRoll: newBank});
        }  
    }

    resetInsureBet() {
            this.setState({insureBet: 0});
    }

    continueGame() {
        if (this.countHand("player") === 21 && this.countHand("dealer") !== 21) {
            this.endHand("pWinBJ");
        } else if (this.countHand("player") === 21 && this.countHand("dealer") === 21) {
            this.endHand("push");
        } else if (this.countHand("dealer") !== 21) {
            this.setState({
                insurance: false
            });

            setTimeout(this.resetInsureBet, 1000);
        } else if(this.countHand("dealer") === 21) {
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
        if (this.state.split) {
            let p1 = this.countHand("player1");
            let p2 = this.countHand("player2");
            if (typeof(p1) === "string") {
                p1 = parseInt(p1[0]) + 10
            }
            if (typeof(p2) === "string") {
                p2 = parseInt(p2[0]) + 10
            }
            this.endHand("split", dTotal, p1, p2);
        } else {
            
            let playerHand = this.countHand("player");
            if (typeof(playerHand) === "string") {
                playerHand = parseInt(playerHand[0]) + 10
            }
            
            if (dTotal > 21) {
                this.endHand("dBusted");
            } else if (dTotal > playerHand) {
                this.endHand("dWin")
            } else if (playerHand > dTotal) {
                this.endHand("pWin");
            } else if (playerHand === dTotal) {
                this.endHand("push");
            }
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

        let originalDeck = 52 * this.props.decks;
        let percent =  this.deck.length / originalDeck;
        
        if (percent < .34) {
            this.deck = this.buildGameDeck(parseInt(this.props.decks));
        }

        if (warning) {
            this.setState({dealerMessage: warning});
        } else if (newBet > this.state.bankRoll) {
            this.setState({dealerMessage: "Not enough funds"});
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

    updateSPTotal() {
        let total1 = this.countHand("player1");
        let total2 = this.countHand("player2");
        if (total1 > 21) {
            this.endHand("p1Bust");
        }

        if (total2 > 21) {
            this.endHand("p2Bust");
        }

        if (!this.state.dealerTurn) {
            this.setState({pTotal1: total1, pTotal2: total2});
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
        } else if (hand === "player1") {
            let count = 0;
            for (const card of this.state.pHand1) {
                count += card.value;
            }
            return this.getPlayerSoftHandCount(this.state.pHand1, count);
        } else if (hand === "player2") {
            let count = 0;
            for (const card of this.state.pHand2) {
                count += card.value;
            }
            return this.getPlayerSoftHandCount(this.state.pHand2, count);
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
        
        let hitCard = this.deck.shift();
        if (destination === 'player') {
            this.setState(prevState => ({
                pHand: [...prevState.pHand, hitCard]
            }));
        } else if (destination ==='player1') {
            this.setState(prevState => ({
                pHand1: [...prevState.pHand1, hitCard]
            }));
        } else if (destination === 'player2') {
            this.setState(prevState => ({
                pHand2: [...prevState.pHand2, hitCard]
            }));
        } else if (destination === "double") {
            this.setState(prevState => ({
                pHand: [...prevState.pHand, hitCard]
            }), function(){
                    this.toStay();
                    
            });
        } else {
            this.setState(prevState => ({
                dHand: [...prevState.dHand, hitCard]
            }));
        }
    }

    toStay() {
        if (this.countHand("player") > 21) {
            
        } else {
            this.playerStand();
        }
    }
 
    hitDealerHand() {
        this.hit("dealer");
    }

    askInsurance() {
        let total = this.countHand("player");
        
        if (total === 21) {
            this.setState({insurance: true, iPlayerBJ: true});
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
        let total = this.state.pTotal;
        if (this.state.dHand[0].value !== 1) {
            if (this.state.dHand[0].value + this.state.dHand[1].valueA !== 21) {
                if (total === 21) {
                    this.endHand("pWinBJ");
                }
            }
        }
    }

    endHand(outcome, dTotal = 0, p1 = 0, p2 = 0) {
        let total = 0;
        switch(outcome) {
            case "split":
                if (dTotal > 21) {
                    total = this.state.bet * 2;
                    total += this.state.sBet * 2;
                    this.setEndHand(this.state.bankRoll + total, "Dealer busted! You win! Collected $" + total.toFixed(2));
                } else {
                    let message = ""
                    
                    if (p1 > dTotal) {
                        total = this.state.bet * 2;
                        message += "Win hand 1 Collected $" + total.toFixed(2); 
                    } else if (p1 == dTotal) {
                        total = this.state.bet;
                        message += "Push hand 1 Collected $" + total.toFixed(2); 
                    } else {
                        message += "You lose hand 1";
                    }

                    if (p2 > dTotal) {
                        total += this.state.sBet * 2;
                        let sTotal = this.state.sBet * 2;
                        message += " Win hand 2 Collected $" + sTotal.toFixed(2); 
                    } else if (p2 == dTotal) {
                        total += this.state.sbet;
                        let sTotal = this.state.sBet;
                        message += " Push hand 2 Collected $" + sTotal.toFixed(2); 
                    } else {
                        message += " You lose hand 2";
                    }
                    this.setEndHand(this.state.bankRoll + total, message);
                }
                break;
            case "push":
                this.setEndHand(this.state.bet + this.state.bankRoll, "Pushed returning $" + this.state.bet.toFixed(2));
                break;
            case "dWinBJ":
                total = this.state.bankRoll;
                let message = "";
                if (this.state.insureBet !== 0) {
                    let insurePay = this.state.insureBet * 2;
                    total = total + insurePay + this.state.insureBet;
                    message = "Collected $" ;
                    let payout = insurePay + this.state.insureBet;
                    message += payout.toFixed(2);
                }
                
                this.setEndHand(total, "Dealer Blackjack. You lose. " + message);
                break;
            case "dWin":
                this.setEndHand(this.state.bankRoll, "You lose");
                break;
            case "p1Bust":
                this.setState({
                    pHand1: [],
                    onH1: false,
                    onH2: true,
                    bet: 0
                }, function() {
                    this.hit("player2");
                });
                break;
            case "p2Bust":
                if (this.state.pHand1.length > 0) {
                    this.playerStand();
                    break;
                } 
            case "pBusted":
                this.setEndHand(this.state.bankRoll, "Busted you lose.");
                break;
            case "dBusted":
                total = this.state.bet * 2;
                this.setEndHand(this.state.bankRoll + total, "Dealer busted! You win! Collected $" + total.toFixed(2));
                break;
            case "pWinBJ":
                total = (this.state.bet * 1.5) + this.state.bet;
                this.setEndHand(this.state.bankRoll + total, "You got a Blackjack. Congratulations! Collected $" + total.toFixed(2));
                break;
            case "pWin":
                total = this.state.bet * 2;
                this.setEndHand(this.state.bankRoll + total, "You win! Collected $" + total.toFixed(2));
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
        if (this.contDealing) {
            this.contDealing = false;
            if (!this.state.dealerAction) {
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
            } else if (this.state.split) {
                if (this.state.dHand.length == 2 && !this.state.dealerTurn) {
                    let value = this.state.dHand[0].value;
                    if (value === 1) {
                        value = "an Ace";
                    }
                    score.push(<p key="showCard" className="score">The dealer is showing {value}</p>);   
                    score.push(<p key="playerCount" className="score">Player: {this.state.pTotal1} Second Hand: {this.state.pTotal2}</p>);
                } else {
                    score.push(<p key="dealerCount" className="score">Dealer: {this.state.dTotal}</p>);
                    score.push(<p key="playerCount" className="score">Player: {this.state.pTotal1} Second Hand: {this.state.pTotal2}</p>);
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

        if (this.state.insureBet !== 0) {
            secBet.push(
                <h1 style={{textAlign: 'left', marginLeft: '10px'}}>Insurance</h1>
            );
            secBet.push(
                <h2 style={{textAlign: 'left', marginLeft: '10px'}}>${this.state.insureBet.toFixed(2)}</h2>
            );
        } else if (this.state.sBet !== 0) {
            secBet.push(
                <h1 style={{textAlign: 'left', marginLeft: '10px'}}>Split Bet</h1>
            );
            secBet.push(
                <h2 style={{textAlign: 'left', marginLeft: '10px'}}>${this.state.sBet.toFixed(2)}</h2>
            );
        }
        
        return secBet;
    }

    setEndHand(newBank, dialogue) {
        this.setState({
            bankRoll: newBank,
            bet: 0,
            sBet: 0,
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
    
    newHand() {
        this.contDealing = true;
        this.setState({
            triggerEndDialogue: false, 
            dealerMessage: "Place you Bet!",
            dHand: [],
            pHand: [],
            pTotal: 0,
            dTotal: 0,
            split: false,
            pHand1: [],
            pHand2: [],
            pTotal1: 0,
            pTotal2: 0,
            onH1: false,
            onH2: false 
        }, function(){
            if (this.state.bankRoll === 0) {
                this.props.gameOver();
            }
        });
    }


    render() {
        const scores = this.getCurrentScores();
        const secondaryBet = this.getSecondaryBet();
        //console.log(this.deck);
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
                            updateSPTotal={this.updateSPTotal}
                            split={this.state.split}
                            pHand1={this.state.pHand1}
                            pHand2={this.state.pHand2}
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
                        bank={this.state.bankRoll}
                        hit={this.playerHit}
                        stand={this.playerStand}
                        double={this.double}
                        split={this.split}
                        endGameControl={this.state.triggerEndDialogue}
                        newHand={this.newHand}
                        insurance={this.state.insurance}
                        playerBJ={this.state.iPlayerBJ}
                        decision={this.decision}
                        bank={this.state.bankRoll}
                        onH1={this.state.onH1}
                        onH2={this.state.onH2}
                    />
                </div>
            </div>
        )
    }
}

export default Table