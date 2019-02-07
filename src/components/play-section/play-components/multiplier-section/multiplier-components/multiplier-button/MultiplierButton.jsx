import React, { Component } from 'react';

import './MultiplierButton.css';

class MultiplierButton extends Component {
  constructor(){
    super();
    this.state = {}
  }

  render() { 
    return ( 
      <div className= "MultiplierButton" onClick={() => this.props.multiplierButtonClick()}>
        <div className="number">
          {this.props.button.label}
        </div>
      </div>
    );
  }
}
 
export default MultiplierButton;
