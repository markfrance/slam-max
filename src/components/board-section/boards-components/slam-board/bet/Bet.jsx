import React from 'react';

import './Bet.css';

const Bet = (props) => {
  return (
    <div className="BoardBet">
      <div className="img-container">
        <img src="/assets/images/money_icon.png" alt="Money"/>
      </div>
      <div className="text-container">
        <div className="text">
          <span className="label">{props.strings.username} </span>
          <span className="value">{props.bet.username}</span>
        </div>
        <div className="text">
          <span className="label">{props.strings.timeStamp}</span>
          <span className="value">{props.bet.timestamp}</span>
        </div>
        <div className="text">
          <span className="label">{props.strings.bet} </span>
          <span className="value">{props.bet.betAmount} EOS</span>
        </div>
        <div className="text">
          <span className="label">{props.strings.rollUnder} </span>
          <span className="value">{props.bet.roll_under}</span>
        </div>
      </div>
    </div>
  );
}

export default Bet;