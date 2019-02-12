import React, { Component } from 'react';

import './Nav.css';

//Data
import navInfo from '../../data/sidenav.json';
import tokenInfo from '../../data/tokens.json';

class Nav extends Component {

  constructor(props){
    super(props);
    this.state = {
      navButtons: navInfo,
      tokenButtons: tokenInfo
    }
  }

renderTokenButtons = (tokenButtons) => {
    return tokenButtons.map(tokenButton => (
      <li key={tokenButton.id} class={tokenButton.id === this.props.activeToken.id ? "active" : ""}>
      <a>
        <div onClick={() => this.props.updateToken(tokenButton)}>
          <i><img src={"assets/images/sidenav/" + tokenButton.icon} alt={tokenButton.name}/></i>
          <p>{this.props.strings[tokenButton.nav]}</p>
        </div>
        </a>
      </li>
    ));
  }

  renderNavButtons = (navButtons) => {
    return navButtons.map(navButton => (
      <li key={navButton.id} class={navButton.active ? "active" : ""}>
        <a href={navButton.link}>
          <i><img src={"assets/images/sidenav/" + navButton.image + ".png"} alt={navButton.name}/></i>
          <p>{this.props.strings[navButton.name]}</p>
        </a>
      </li>
    ));
  }

  render() {
    return (
      <div className="Nav">
        <div className="sidebar-mini">
          <div className="wrapper">

            <div className="sidebar">
              <div className="sidebar-wrapper">
                <div className="logo">
                  <a href="/#" className="simple-text logo-mini">NAV</a>
                  <a href="/#" className="simple-text logo-normal">&nbsp;</a>
                </div>
                <ul className="nav">
                {this.renderTokenButtons(this.state.tokenButtons)}
                {this.renderNavButtons(this.state.navButtons)}
                
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Nav;
