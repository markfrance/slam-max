import React, { Component } from 'react';

import './TopNav.css';

// Component
import FAQ from './components/faq';
import LanguageData from '../../data/languages.json';

class TopNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showFAQ: false,
      scatterUser: "User_name",
      wallet: 1200,
      showLanguagePopup: false,
      activeLanguage: this.props.activeLanguage

    }

    this.handleFAQToggle = this.handleFAQToggle.bind(this);
    this.toggleLanguagePopup = this.toggleLanguagePopup.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  // Life Cycle

  componentWillMount() {
    // Make calls for scatterUser
  }

  componentWillReceiveProps({activeLanguage}) {
    this.setState({activeLanguage:activeLanguage})
  }

  // Handler functions
  handleFAQToggle() {
    let showFAQ = this.state.showFAQ;
    this.setState({
      showFAQ: !showFAQ
    })
  }

  toggleLanguagePopup() {
    const showLanguagePopup = this.state.showLanguagePopup;
    this.setState({
      showLanguagePopup: !showLanguagePopup
    });
  }

  changeLanguage(newLanguage) {

    this.props.updateLanguage(newLanguage);
    
    this.toggleLanguagePopup();
  }


  // Render functions
  renderFAQ() {
    if (this.state.showFAQ) {
      return (
        <FAQ handleFAQToggle={() => this.handleFAQToggle()} 
        strings={this.props.strings}
        activeLanguage={this.props.activeLanguage}/>
      )
    }
    return;
  }

  renderScatterUser() {
    if (this.state.scatterUser) {
      return (
        <div className="scatter">
          <span className="label">
            Scatter:
        </span>
          <span className="value">
            {this.state.scatterUser}
          </span>
        </div>
      )
    }
  }

  renderLanguagePopup() {
  console.log(LanguageData);
    if (this.state.showLanguagePopup) {
      const flags = LanguageData.map(language => {
        if (language.id !== this.props.activeLanguage.id) {
          return (
            <div className="language-flag" key={language.id} onClick={() => this.changeLanguage(language)}>
              <img src={"/assets/images/flags/" + language.flag + ".png"} alt={language.name} />
            </div>
          );
        }
        return null;
      })
      return (
        <div className="languagePopup">
          {flags}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="TopNav">
        <div className="minning-img">
          <img src="/assets/images/mining_cart_icon.png" alt="minecart" />
        </div>
        <div className="slam-minning">
          <span className="label">
            {this.props.strings.slamMining}
          </span>
          <span className="value">
            {this.state.wallet}
          </span>
        </div>
        {this.renderScatterUser()}
        <div className="faqs-section" onClick={() => this.handleFAQToggle()}>
          <div className="faq-btn">
            FAQs
          </div>
        </div>
        <div className="languages" onClick={() => this.toggleLanguagePopup()}>
          <img src={"/assets/images/flags/" + this.props.activeLanguage.flag + ".png"} alt={this.props.activeLanguage.name} />
        </div>
        {this.renderLanguagePopup()}
        {this.renderFAQ()}
      </div>
    );
  }
}

export default TopNav;