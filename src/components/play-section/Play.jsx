import React, { Component } from 'react';
import './Play.css';

// components
import Scatter from "./play-components/scatter-balance/Scatter";
import WinningNumber from "./play-components/winning-number/WinningNumber";
import BetPayout from "./play-components/bet-payout/BetPayout";

import NumberRangeBar from "./play-components/number-range-bar/NumberRangeBar";
import MobileNumberRangeBar from "./play-components/number-range-bar/mobile/MobileNumberRangeBar";
import Multiplier from "./play-components/multiplier-section/Multiplier";

// Data
import InitialMultiplierButtons from "../../data/multiplier_buttons.json";
import payoutTable from "../../data/payout-table.json";

const DEFAULT_ROLL_UNDER = 50;
const DEFAULT_BET = 1;
const MAX_BET = 1000;
const DEFAULT_LUCKY_NUMBER = 8;

class Play extends Component {

  constructor(props){
    super(props);

    let defaultWinChance = DEFAULT_ROLL_UNDER-1,
        defaultPayoutMultiplier = payoutTable[DEFAULT_ROLL_UNDER-2],
        defaultPayout = DEFAULT_BET * defaultPayoutMultiplier;

    this.state = {
      multiplierButtons: InitialMultiplierButtons,
      rollUnder: DEFAULT_ROLL_UNDER,
      winChance: defaultWinChance,
      payoutMultiplier: defaultPayoutMultiplier,
      bet: DEFAULT_BET,
      payout: defaultPayout,
      luckyNumber: DEFAULT_LUCKY_NUMBER
    }

    this.handleMultiplierButtonClick = this.handleMultiplierButtonClick.bind(this);
    this.updateRollUnder = this.updateRollUnder.bind(this);
    this.handleSlamButtonClick = this.handleSlamButtonClick.bind(this);
  }

  // Handler functions
  handleMultiplierButtonClick(newButton){
    const multiplierButtons = this.state.multiplierButtons;

    let newBet = 0;
    let newButtonList = multiplierButtons.map(button => {
      if(button.id === newButton.id){
        button.active = true;
        if(button.id === 4) {
          newBet = MAX_BET;
        }
        else {
          newBet = this.state.bet * button.value;
        }

      }else{
        button.active = false;
      }
      return button;
    });

    const payoutMultiplier = payoutTable[this.state.rollUnder-2];
    this.setState({
      multiplierButtons: newButtonList,
      payoutMultiplier,
      bet: newBet,
      payout: newBet * payoutMultiplier
      
    })
  }

  updateRollUnder(newRollUnder){
    const payoutMultiplier = payoutTable[newRollUnder-2];
    this.setState({
      rollUnder: newRollUnder,
      winChance: newRollUnder-1,
      payoutMultiplier,
      payout: this.state.bet * payoutMultiplier
    })
  }

  handleSlamButtonClick(){

  }

  getLuckyNumber(){
    // API call for lucky number

  }

  render() {
    return (
      <div className="Play">
        <div className="card">
          <div className="main-row">
            <div className="play-left">
              <div className="top-row">
                <div className="scatter-section">
                  <Scatter />
                </div>
                <div className="winning-number-section">
                  <div className="winning-number-container">
                    <WinningNumber title="Lucky Number" wNumber={this.state.luckyNumber} />
                    <div style={{ flex: 0.15 }}></div>
                    <WinningNumber title="Roll Under To Win" wNumber={this.state.rollUnder} />
                  </div>
                </div>
              </div>
              <div className="second-row">
                <div className="bet-payout-section">
                  <BetPayout bet={this.state.bet} payout={this.state.payout} />
                </div>
                <div className="multiplier-buttons-section">
                  <Multiplier 
                    multiplierButtons={this.state.multiplierButtons} 
                    multiplierButtonClick={(newButton) => this.handleMultiplierButtonClick(newButton)} 
                    winChance={this.state.winChance}
                    payoutMultiplier={this.state.payoutMultiplier}
                  />
                </div>
              </div>
              <div className="mobile-slider-section">
                <MobileNumberRangeBar rollUnder={this.state.rollUnder} updateRollUnder={(value) => this.updateRollUnder(value)} />
              </div>
              <div className="third-row">
                <div className="slam-button-section">
                  <div className="button slam-button">SLAM</div>
                </div>
                <div className="claim-slam-button-section">
                  <div className="button claim-slam-button">Claim SLAM</div>
                </div>
                <div className="login-button-section">
                  <div className="button login-button">Login</div>
                </div>
              </div>
            </div>
            <div className="slider-section">
              <NumberRangeBar rollUnder={this.state.rollUnder} updateRollUnder={(value) => this.updateRollUnder(value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Play;