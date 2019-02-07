import React, { Component } from 'react';

import './Nav.css';

//Data
import navInfo from '../../data/sidenav.json';

class Nav extends Component {

  constructor(props){
    super(props);
    this.state = {
      navButtons: navInfo
    }
  }

  renderNavButtons = (navButtons) => {
    return navButtons.map(navButton => (
      <li key={navButton.id} class={navButton.active ? "active" : ""}>
        <a href={navButton.link}>
          <i><img src={"assets/images/sidenav/" + navButton.image + ".png"} alt={navButton.name}/></i>
          <p>{navButton.name}</p>
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
