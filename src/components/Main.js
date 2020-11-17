import React, { Component } from 'react';
import '../styles/blackjack.css';
import Table from './Table';
import StartScreen from './StartScreen';
//import * as Constants from '../js/constants';
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankRoll: 0,
            decks: 1,
            letsPlay: false,
            message: ""
        }
        this.gameSetup = this.gameSetup.bind(this);
        this.endGame = this.endGame.bind(this);
    }

    gameSetup(bank, d) {
        this.setState({bankRoll: bank, decks: d, letsPlay: true});
    }

    endGame() {
        this.setState({letsPlay: false, message: "Game Over. Play again?"})
    }

    render() {
        if (!this.state.letsPlay) {
            return(
                <StartScreen setup={this.gameSetup} message={this.state.message} />
            )
        } else {
            return(
                <Table bankRoll={this.state.bankRoll} decks={this.state.decks} gameOver={this.endGame} />
            )
        }
    }
}

export default Main
