import React, { Component } from 'react';
import '../styles/blackjack.css';
import * as Constants from '../js/constants';

class PlayerHand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pHand: [],
            pHand1: [],
            pHand2: [],
            split: false,
            onH1: false,
            onH2: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pHand.length !== this.props.pHand.length){
            this.setState({pHand: this.props.pHand, split: false});
            this.props.updatepTotal();
        }

        if (prevProps.pHand1 !== this.props.pHand1 || prevProps.pHand2 !== this.props.pHand2) {
            if (this.state.pHand.length === 2) {
                this.setState({split: this.props.split, pHand: [], pHand1: this.props.pHand1, pHand2: this.props.pHand2});
                this.props.updateSPTotal();
            } else {
                
                this.setState({pHand1: this.props.pHand1, pHand2: this.props.pHand2});
                this.props.updateSPTotal();
            }   
        }
    }

    buildHand() {
        let cards = [];
        const images = require.context('../../public/images/JPEG', true);
        if (!this.state.split) {
            for(let i = 0; i < this.state.pHand.length; i++) {
                let keyName = "card"+i;
                let photoPath = images(`./${this.state.pHand[i].image}`);
                cards.push(
                    <img key={keyName} className="cards" src={photoPath}></img>
                )
            }
        }
        
        return cards;
    }

    buildFirst() {
        let cards = [];
        const images = require.context('../../public/images/JPEG', true);
        
        for(let i = 0; i < this.state.pHand1.length; i++) {
            let keyName = "card"+i;
            let photoPath = images(`./${this.state.pHand1[i].image}`);
            cards.push(
                <img key={keyName} className="cards" src={photoPath}></img>
            )
        }
        return cards;
    }

    buildSecond() {
        let cards = [];
        const images = require.context('../../public/images/JPEG', true);
        for(let i = 0; i < this.state.pHand2.length; i++) {
            let keyName = "card"+i;
            let photoPath = images(`./${this.state.pHand2[i].image}`);
            cards.push(
                <img key={keyName} className="cards" src={photoPath}></img>
            )
        }
        return cards;
    }

    getHands() {
        if (this.state.split) {
            let firstHand = this.buildFirst();
            let secondHand = this.buildSecond();
            return (
                <div>
                    <div className="splitH">
                        { firstHand }
                    </div>
                    <div className="splitH">
                        { secondHand }
                    </div>
                </div> 
            )
        } else {
            let cards = this.buildHand();
            return(
                <div className="playerHand">
                    { cards } 
                </div>
            )
        }
    }

    render() {
        
        let hands = this.getHands();
        
        return(
            hands
        )
    }
}

export default PlayerHand