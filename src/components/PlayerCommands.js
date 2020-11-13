import React, { Component } from 'react';
import '../styles/blackjack.css';

class PlayerCommands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bet: 0,
            hideBet: this.props.inHand,
            playerTurn: false,
            pHand: []
        }

        this.beginHand = this.beginHand.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.inHand !== this.props.inHand) {
            this.setState({hideBet: this.props.inHand});
        }

        if (prevProps.playerTurn !== this.props.playerTurn) {
            this.setState({playerTurn: this.props.playerTurn});
        }

        if (prevProps.pHand.length !== this.props.pHand.length) {
            this.setState({pHand: this.props.pHand});
        }
    }

    beginHand() {
        if (this.state.bet > 0) {
            this.props.beginHand(this.state.bet);
        } else {
            this.props.beginHand(0, 'Your bet must be greater than 0!');
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value}); 
    }

    render() {
        let bStyles = {display: 'block'};

        if (this.state.hideBet) {
            bStyles = bStyles = {display: 'none'};
        }



        return(
            <div className="commands">
                <div className="gameOpButtons">
                    <button>Hit</button>
                    <button>Stand</button>
                    <button>Double Down</button>
                    <button>Split</button>
                </div>
                <div style={bStyles} className="betting">
                    <label style={{color: 'whitesmoke', fontSize: '24px'}} htmlFor="bet">Bet</label>
                    <input name="bet" type="number" value={this.state.bet} onChange={this.handleChange}></input>
                    <button onClick={this.beginHand}>Deal</button>
                </div>
            </div>
        )
    }
}

export default PlayerCommands 