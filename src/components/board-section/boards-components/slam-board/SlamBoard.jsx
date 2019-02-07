import React, { Component } from 'react';

import './SlamBoard.css';

// Components
import Bet from './bet/Bet';

class SlamBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeView: 'all-bets',
      myBets: props.myBets,
      allBets: props.allBets
    }

    this.handleViewUpdate = this.handleViewUpdate.bind(this);  
  }

  // Handler functions
  handleViewUpdate = (newView) => {
    this.setState({
      activeView: newView
    });
  }

  // Render functions
  renderBets = () => {
    if(this.state.activeView === 'all-bets'){
      return this.state.allBets.map(bet => {
        return (
          <Bet key={bet.id} bet={bet} />
        )
      });
    }else{
      return this.state.myBets.map(bet => {
        return (
          <Bet key={bet.id} bet={bet} />
        )
      });      
    }
  }

  render() {
    return (
      <div className="SlamBoard">
        <div className="title">
          <div className="text">
            SLAM BOARD
          </div>
          <div className="img">
            <img src="/assets/images/eos_icon_purple.png" alt="EOS" />
          </div>
        </div>
        <div className="buttons">
          <div 
            className={this.state.activeView === "all-bets" ? "button all-bets active-button" : "button all-bets "}
            onClick={() => this.handleViewUpdate('all-bets')}
          >
            All Bets
          </div>
          <div 
            className={this.state.activeView === "my-bets" ? "button my-bets active-button" : "button my-bets "}
            onClick={() => this.handleViewUpdate('my-bets')}
          >
            My Bets
          </div>
        </div>

        <div className="bets">
          <div className="all-bets-section">
            {this.renderBets()}
          </div>
        </div>

      </div>
    );
  }
}

export default SlamBoard;