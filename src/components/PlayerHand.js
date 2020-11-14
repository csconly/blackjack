import React, { Component } from 'react';
import '../styles/blackjack.css';
import * as Constants from '../js/constants';

class PlayerHand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pHand: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pHand.length !== this.props.pHand.length){
            this.setState({pHand: this.props.pHand});
            this.props.updatepTotal();
        }
    }

    buildHand() {
        let cards = [];
        const images = require.context('../../public/images/JPEG', true);

        for(let i = 0; i < this.state.pHand.length; i++) {
            let keyName = "card"+i;
            let photoPath = images(`./${this.state.pHand[i].image}`);
            cards.push(
                <img key={keyName} className="cards" src={photoPath}></img>
            )
        }
        return cards;
    }

    render() {
        let cards = this.buildHand();
        return(
            <div className="playerHand">
                { cards } 
            </div>
        )
    }
}

export default PlayerHand