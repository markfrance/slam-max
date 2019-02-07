import React, { Component } from 'react';

import './BetPayout.css';

class BetPayout extends Component {
  state = {}

  renderBetInfoComponent = (title, amount) => {
    return (
      <div className="bet-info-component">
        <div className="title-container">
          <div className="title">
            {title}
          </div>
        </div>
        <div className="amount-container">
          <div className="amount">
            <span className="img-container">
              <img src="assets/images/white_eos_icon.png" alt="EOS" />
            </span>
            <span className="text number">
              {amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="BetPayout">
        <div className="small-card">
          <div className="small-card-inner">
            {this.renderBetInfoComponent("Bet", this.props.bet)}
            <div className="separator"></div>
            {this.renderBetInfoComponent("Payout", this.props.payout)}
          </div>
        </div>
      </div>
    );
  }
}

export default BetPayout;