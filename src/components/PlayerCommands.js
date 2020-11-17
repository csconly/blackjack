import React, { Component } from 'react';
import '../styles/blackjack.css';

class PlayerCommands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bet: 0,
            hideBet: this.props.inHand,
            playerTurn: false,
            pHand: [],
            handOver: false,
            insurance: false,
            playerBJ: false,
            onH1: false,
            onH2: false
        }

        this.beginHand = this.beginHand.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.hit = this.hit.bind(this);
        this.stand = this.stand.bind(this);
        this.double = this.double.bind(this);
        this.split = this.split.bind(this);
        this.newHand = this.newHand.bind(this);
        this.iDecision = this.iDecision.bind(this);
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

        if (prevProps.endGameControl !== this.props.endGameControl) {
            this.setState({handOver: this.props.endGameControl});
        }

        if(prevProps.insurance !== this.props.insurance) {
            if (prevProps.playerBJ !== this.props.playerBJ) {
                this.setState({playerBJ: this.props.playerBJ, insurance: this.props.insurance});
            } else {
                this.setState({insurance: this.props.insurance})
            }
        }

        if (prevProps.onH1 !== this.props.onH1) {
            this.setState({onH1: this.props.onH1});
        }

        if (prevProps.onH2 !== this.props.onH2) {
            this.setState({onH2: this.props.onH2});
        }

    }

    beginHand() {
        if (this.state.bet > 0) {
            this.props.deductBank(this.state.bet);
            this.props.beginHand(this.state.bet);
        } else {
            this.props.beginHand(0, 'Your bet must be greater than 0!');
        }
    }

    newHand() {
        this.setState({
            handOver: false
        }, function(){
            this.props.newHand();
        });
        
    }

    hit() {
        if (this.state.onH1) {
            this.props.hit(1);
        } else if (this.state.onH2) {
            this.props.hit(2);
        } else {
            this.props.hit();
        } 
    }

    stand() {
        this.props.stand();
    }

    double() {
        this.props.double();
    }

    split() {
        this.props.split();
    }

    // for changing bet
    // this function can be used on any onchange even if the name = the state var
    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        }); 
    }



    playerButtons() {
        let buttons = [];
        if (this.state.playerTurn && !this.state.insurance) {
            buttons.push(
                <button key="hitB" onClick={this.hit}>Hit</button>
            );
            buttons.push(
                <button key="standB" onClick={this.stand}>Stand</button>
            );
            if (this.state.pHand.length === 2 && parseInt(this.state.bet) <= this.props.bank && !this.state.onH1 && !this.state.onH2) {       //no double after split due to time constraints
                buttons.push(
                    <button key="doubleB" onClick={this.double}>Double Down</button>
                );
                if (this.state.pHand[0].value === this.state.pHand[1].value && this.props.bank >= this.state.bet) {
                    buttons.push(
                        <button key="splitB" onClick={this.split}>Split</button>
                    );
                }
            }
        } else {
            if (this.state.insurance) {
                if (this.state.playerBJ) {
                    buttons.push(
                        <button key="insureB" name="even" onClick={this.iDecision}>Even Money</button>
                        
                    );
        
                    buttons.push(
                        <button key="noI" name="no" onClick={this.iDecision}>No</button>
                    );
                } else {
                    if (this.state.bet * .5 >= this.props.bank) {
                        buttons.push(
                            <button key="noI" name="no" onClick={this.iDecision}>Continue without Insurance</button>
                        );
                    } else {
                        buttons.push(
                            <button key="insureB" name="insure" onClick={this.iDecision}>Insurance</button>
                            
                        );
            
                        buttons.push(
                            <button key="noI" name="no" onClick={this.iDecision}>No</button>
                        );
                    }
                }      
            }
        }

        return buttons;
    }

    iDecision(e) {
        e.preventDefault();
        this.props.decision(e.target.name);
    }

    render() {
        let bStyles = {display: 'block'};

        if (this.state.hideBet) {
            bStyles = bStyles = {display: 'none'};
        }
        
        let pButtons = this.playerButtons();

        if (this.state.handOver) {
            return(
                <div className="commands">
                    <button onClick={this.newHand}>Next Hand</button>
                </div>
            )
        } else {
            return(
                <div className="commands">
                    <div className="gameOpButtons">
                        { pButtons }
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
}

export default PlayerCommands 