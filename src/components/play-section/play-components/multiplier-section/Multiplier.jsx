import React, { Component } from 'react';

import "./Multiplier.css";

// Components
import MultiplierButton from "./multiplier-components/multiplier-button/MultiplierButton";

class Multiplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiplierButtons: props.multiplierButtons
    }
  }

  renderMultiplierButtons = () => {
    const multiplierButtons = this.state.multiplierButtons;
    return multiplierButtons.map(button => {
      return (
        <MultiplierButton key={button.id} button={button} multiplierButtonClick={() => this.props.multiplierButtonClick(button)} />
      );
    })
  }

  render() {
    return (
      <div className="Multiplier">
        <div className="bar"></div>
        <div className="multiplier-sections">
          <div className="multiplier-buttons">
            {this.renderMultiplierButtons()}
          </div>
          <div className="multiplier-fields-section">
            <div className="multiplier-fields">
              <div className="MultiplierField">
                <div className="title">{this.props.strings.payoutMultipier}</div>
                <div className="value number">{this.props.payoutMultiplier}x</div>
              </div>
              <span className="separator"></span>
              <div className="MultiplierField">
                <div className="title">{this.props.strings.winChance}</div>
                <div className="value number">{this.props.winChance} %</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Multiplier;