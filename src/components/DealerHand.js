import React, { Component } from 'react';
import '../styles/blackjack.css';
import * as Constants from '../js/constants';

class DealerHand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dHand: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dHand.length !== this.props.dHand.length){
            this.setState({dHand: this.props.dHand});
        }
    }

    buildHand() {
        let cards = [];
        if (this.state.dHand.length === 2) {
            const images = require.context('../../public/images/JPEG', true);

            let downCard = require.context('../../public/images', true);
            let backOfCard = downCard(`./card-back-black.png`);
            let photoPath = images(`./${this.state.dHand[1].image}`);
            
            cards.push(
                <img key="upCard" className="cards" src={photoPath}></img>
            );
            cards.push(
                <img key="downCard" className="cards" src={backOfCard}></img>
            );
        }
        
        return cards;
    }

    render() {
        let cards = this.buildHand();
        return(
            <div className="dealerHand">
                { cards }
            </div>
        )
    }
}

export default DealerHand