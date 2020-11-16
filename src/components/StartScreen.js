import React, { Component } from 'react';
import '../styles/blackjack.css';

class StartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyin: 100,
            decks: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.playGame = this.playGame.bind(this);
    }

    generateDeckOptions() {
        let options = [];
        let key = "";
        for(let i = 1; i <= 6; i++) {
            key = "option"+i;
            options.push(
                <option key={key} value={i}>{i}</option>
            );
        }
        return options;
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value}); 
    }
    

    playGame() {
        if (this.state.buyin || this.state.buyin > 0) {
            this.props.setup(this.state.buyin, this.state.decks);
        } 
    }

    render() {
        let mStyle = {color: 'black', fontSize: '64px'};
        let message = 'Blackjack';
        if (!this.state.buyin || (this.state.buyin <= 0)) {
            mStyle = {color: 'red', fontSize: '64px'};
            message = 'You must select a buy in';
        }

        return(
            <div className="appBackground">
                <div className="start">
                    <p style={mStyle}>{message}</p>
                    <label>Select number of decks: </label>
                    <select onChange={this.handleChange} name="decks" value={this.state.decks}>
                        {this.generateDeckOptions()}
                    </select>
                    <br />
                    <br />
                    <label>How much would you like to buy in? </label>
                    <input value={this.state.buyin} name="buyin" type="number" onChange={this.handleChange}></input>
                    <br />
                    <br />
                    <button onClick={this.playGame}>Let's Play!</button>
                </div>
            </div>
        )
    }
}

export default StartScreen 