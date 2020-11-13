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
        }
    }

    buildHand() {
        let cards = [];
        const images = require.context('../../public/images/JPEG', true);

        // adding dynamic paths
        //let dynamicImage = images(`./${someVariable}.png`);

        for(let i = 0; i < this.state.pHand.length; i++) {
            let photoPath = images(`./${this.state.pHand[i].image}`);
            cards.push(
                <img className="cards" src={photoPath}></img>
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