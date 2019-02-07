import React, { Component } from 'react';
import './App.css';

// components
import Play from './components/play-section/Play';
import Logo from './components/logo/Logo';
import Boards from './components/board-section/Boards';
import TopNav from './components/top-nav/TopNav';
import Nav from './components/nav/Nav';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scatterWallet: 1200
    }

  }

  render() {
    return (
      <div className="App">
        <img src={"assets/images/dark_background.png"} alt="background" className="background-image" />
        <div className="page-wrapper">
          <div className="page">
            <div className="top-nav-section">
              <TopNav />
            </div>
            <div className="sidenav-section">
              <Nav />
            </div>
            <div className="boards-section">
              <Boards />
            </div>
            <div className="right-section">
              <div className="sapce"></div>
              <div className="logo-section">
                <Logo />
              </div>
              <div className="play">
                <Play />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
