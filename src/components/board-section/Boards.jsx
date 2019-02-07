import React, { Component } from 'react';

import './Boards.css';

// Components
import SlamBoards from './boards-components/slam-board/SlamBoard';
import Troll from './boards-components/troll/Troll';

// Data (Replace with API calls)
import allBets from '../../data/all_bets.json';
import myBets from '../../data/my_bets.json';

class Boards extends Component {
  state = {}

  componentWillMount(){
    // Make API Call here for data bets lists.
  }

  render() {
    return (
      <div className="Boards">
        <div className="slam-boards-section">
          <SlamBoards myBets={myBets} allBets={allBets} />
        </div>
        <div className="troll-boards-section">
          <Troll />
        </div>
      </div>
    );
  }
}

export default Boards;