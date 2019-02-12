import React, { Component } from 'react';

import './BetPayout.css';

class BetPayout extends Component {
   constructor(props){
    super(props);

    this.state = {
      image: "assets/images/sidenav/" + this.props.activeToken.icon
    }
  }

  renderBetInfoComponent = (title, amount) => {
  let iconImage = "assets/images/sidenav/" + this.props.activeToken.icon;
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
              <img src={iconImage} alt={this.props.activeToken.name} />
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
            {this.renderBetInfoComponent(this.props.strings.bet, this.props.bet)}
            <div className="separator"></div>
            {this.renderBetInfoComponent(this.props.strings.payout, this.props.payout)}
          </div>
        </div>
      </div>
    );
  }
}

export default BetPayout;