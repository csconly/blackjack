import React, { Component } from 'react';
import '../styles/blackjack.css';
import * as Constants from '../js/constants';

class DealerHand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dHand: [],
            dBJ: false,
            dealerTurn: false,
            inHand: this.props.inHand
        }
        //this.checkForBlackJack = this.checkForBlackJack.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dHand.length !== this.props.dHand.length) {
            this.setState({
                dHand: this.props.dHand
            }, function() {
                if (this.props.dHand.length === 2) {
                    this.checkForBlackJack();
                } 
            });
            if (this.props.dealerTurn) {
                this.props.updateDealTotal();
            }
            
        }
        
        if (prevProps.dealerTurn !== this.props.dealerTurn) {
            this.setState({dealerTurn: this.props.dealerTurn});
        } 
        if (prevProps.inHand !== this.props.inHand) {
            this.setState({inHand: this.props.inHand});
            
        }
    }

    checkForBlackJack() {
        //let checkPlayer = false;
        if (this.state.dHand[0].value === 1) {
            console.log("Insurance");
            this.props.askInsurance();
        } else if (this.state.dHand[0].value === 10) {          // peak if ten
            if (this.state.dHand[1].valueA) {                   // if not falsey
                //console.log(this.state);
                if(this.state.dHand[0].value + this.state.dHand[1].valueA === 21) {     // if backdoor blackjack
                    this.setState({dBJ: true})
                    this.props.dealerBJ(this.state.dHand, true);
                }
            }
        } 
        this.props.checkPlayerBlackjack();
    }

    turnHiddenCard() {
        let cards = [];
        if (this.state.dHand.length > 1) {
            const images = require.context('../../public/images/JPEG', true);
            if (!this.props.go && this.state.inHand) {
                this.props.dealerAction();
            }
            
            for(let i = 1; i >= 0; i--) {
                let keyName = "card"+i;
                let photoPath = images(`./${this.state.dHand[i].image}`);
                cards.push(
                    <img key={keyName} className="cards" src={photoPath}></img>
                )
            }
        } 
        return cards;
    }

    buildHand() {
        let cards = [];
        if (this.state.dHand.length === 2) {
            const images = require.context('../../public/images/JPEG', true);

            let downCard = require.context('../../public/images', true);
            let backOfCard = downCard(`./card-back-black.png`);
            let photoPath = images(`./${this.state.dHand[0].image}`);
            cards.push(
                <img key="downCard" className="cards" src={backOfCard}></img>
            );
            cards.push(
                <img key="upCard" className="cards" src={photoPath}></img>
            );
        }
        
        return cards;
    }

    buildHitCards() {
        let hitCards = [];
        const images = require.context('../../public/images/JPEG', true);
    
        for(let i = 2; i < this.state.dHand.length; i++) {
            let keyName = "card"+i;
            let photoPath = images(`./${this.state.dHand[i].image}`);
            hitCards.push(
                <img key={keyName} className="cards" src={photoPath}></img>
            )
        }
        return hitCards;
    }

    render() {
        let cards = []
        let hitCards = [];
        if (this.state.dBJ) {
            cards = this.turnHiddenCard();
        } else if (this.state.dealerTurn) {
            cards = this.turnHiddenCard();
            hitCards = this.buildHitCards();
        } else if (!this.state.inHand) {
            cards = this.turnHiddenCard();
            hitCards = this.buildHitCards();
        } else {
            cards = this.buildHand();
        }
        
        return(
            <div className="dealerHand">
                { cards }
                <div className="hitCards">
                { hitCards }
                </div>
            </div>
        )
    }
}

export default DealerHand