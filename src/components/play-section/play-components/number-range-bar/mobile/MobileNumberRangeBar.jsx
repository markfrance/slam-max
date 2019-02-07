import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import './MobileNumberRangeBar.css';

class MobileNumberRangeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rollUnder: props.rollUnder
    }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnChangeComplete = this.handleOnChangeComplete.bind(this);

  }


  // Handler functions
  handleOnChange = (value) => {
    this.setState({
      rollUnder: value
    })
  }

  handleOnChangeComplete = () => {
    this.props.updateRollUnder(this.state.rollUnder);
  }

  render() {
    let { rollUnder } = this.state;
    return (
      <div className="MobileNumberRangeBar">
        <div className="slider-container">
          <Slider
            value={rollUnder}
            min={3}
            max={96}
            onChange={this.handleOnChange}
            onChangeComplete={this.handleOnChangeComplete}
          />
        </div>
        <div className="range">
          <div className="range-number min-range-number number">1</div>
          <div className="range-number max-range-number number">100</div>        
        </div>
      </div>
    );
  }
}

export default MobileNumberRangeBar;