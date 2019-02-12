import React, { Component } from 'react';
import Notifications, {notify} from 'react-notify-toast';

import './App.css';

// components
import Play from './components/play-section/Play';
import Logo from './components/logo/Logo';
import Boards from './components/board-section/Boards';
import TopNav from './components/top-nav/TopNav';
import Nav from './components/nav/Nav';

import Strings from './language.js';
import LanguageData from './data/languages.json';
import TokenData from './data/tokens.json';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scatterWallet: 1200,
      account: "Sign In",
      activeLanguage: LanguageData[0],
      strings: Strings,
      activeToken: TokenData[0]
    }

    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateToken = this.updateToken.bind(this);

  }

  updateLanguage(newLanguage) {
    this.state.strings.setLanguage(this.state.activeLanguage.code);
    this.setState({
      activeLanguage:newLanguage
    });
  }

  updateToken(newToken) {
    this.setState({
      activeToken: newToken
    });
  }

  render() {
    return (
      <div className="App">
        <img src={"assets/images/dark_background.png"} alt="background" className="background-image" />
        <div className="page-wrapper">
          <div className="page">
          <Notifications />
            <div className="top-nav-section">
              <TopNav strings={this.state.strings} 
              activeLanguage={this.state.activeLanguage}
              updateLanguage={this.updateLanguage} />
            </div>
            <div className="sidenav-section">
              <Nav strings={this.state.strings} 
              activeToken={this.state.activeToken}
              updateToken={this.updateToken} />
            </div>
            <div className="boards-section">
              <Boards strings={this.state.strings}  />
            </div>
            <div className="right-section">
              <div className="sapce"></div>
              <div className="logo-section">
                <Logo />
              </div>
              <div className="play">
                <Play strings={this.state.strings} 
                activeToken={this.state.activeToken}
                updateToken={this.updateToken}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
