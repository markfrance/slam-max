import React, { Component } from 'react';

import './Boards.css';

// Components
import SlamBoards from './boards-components/slam-board/SlamBoard';
import Troll from './boards-components/troll/Troll';

// Data (Replace with API calls)
import allBets from '../../data/all_bets.json';
import myBets from '../../data/my_bets.json';

import api from '../../eos';

class Boards extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      allBets : allBets,
      myBets : myBets
    }
  }

  componentWillMount(){
    this._getBetHistory();
  }

  _getBetHistory() {
    api.getActions('slamdevelogs', -1, -20).then(({ actions }) => {
      this.state.allBets = actions.filter(action => {
        return action.action_trace
          && action.action_trace.act
          && action.action_trace.act.data
          && action.action_trace.act.data.result
          && action.action_trace.act.account == "slamdevelogs" 
          && action.action_trace.act.name == "result";
      }).reverse();

      this.state.myBets = this.state.allBets.filter(bet => {
    return bet.action_trace.act.data.result.player == 
    window.scatter.identity.accounts.find(account => account.blockchain === 'eos')}).reverse();

     console.log("ALL BETS:" + this.state.allBets);
    console.log("MY BETS:" + this.state.myBets);
    });   

  }

  render() {
    return (
      <div className="Boards">
        <div className="slam-boards-section">
          <SlamBoards myBets={this.state.myBets} allBets={this.state.allBets} 
          strings={this.props.strings} />
        </div>
        <div className="troll-boards-section">
          <Troll />
        </div>
      </div>
    );
  }
}

export default Boards;