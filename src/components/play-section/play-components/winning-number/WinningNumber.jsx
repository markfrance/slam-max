import React, { Component } from 'react';

import './WinningNumber.css';

class WinningNumber extends Component {

  constructor(props){
    super(props);
    this.state = {
      wNumber: props.wNumber
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      wNumber: nextProps.wNumber
    })
  }

  render() {
    const {wNumber} = this.state; 
    return (
      <div className="WinningNumber">
        <div className="number-card">
          <div className="title">
            {this.props.title}
          </div>
          <div className="number">
            {wNumber}
          </div>
          <div className="bottom-bar"></div>
        </div>
      </div>
    );
  }
}

export default WinningNumber;