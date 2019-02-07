import React, { Component } from 'react';

import './Scatter.css';

class Scatter extends Component {
  state = {}
  render() {
    return (
      <div className="Scatter">
        <div className="small-card">
          <div className="small-card-inner">
            <div className="scatter-top">
              <div className="scatter-img-container">
                <img src="assets/images/scatter.png" alt="Scatter" />
              </div>
              {/* <div className="cpu-net">
                <span className="cpu">
                  <div className="label">
                    CPU
                  </div>
                  <div className="value">
                    <span className="number">10</span> <span>ms</span>
                  </div>
                </span>
                <span className="separator"> </span>
                <span className="net">
                  <div className="label">
                    NET
                  </div>
                  <div className="value">
                    <span className="number">15</span> <span>KB</span>
                  </div>
                </span>
              </div> */}
            </div>
            <div className="scatter-bottom">
              <div className="amount-box">
                <span className="amount number">310.83</span>
                <span><img src="assets/images/white_eos_icon.png" alt="EOS" /></span>
              </div>
              <div className="bottom-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Scatter;