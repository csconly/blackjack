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

    render() {
        return(
            <div className="dealerHand">
                Hello There welcome to the game
            </div>
        )
    }
}

export default DealerHand