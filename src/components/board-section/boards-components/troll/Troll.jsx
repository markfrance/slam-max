import React, { Component } from 'react';

import './Troll.css';

// Data
import chat from '../../../../data/chat.json';

class Troll extends Component {
  state = {}

  // Render functions
  renderChat = () => {
    return chat.map(message => {
      return (
        <div className="message" key={message.id}>
          <div className="name">{message.name}</div>
          <div className="message-body">{message.message}</div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="Troll">
        <div id="chatbro"></div>
      </div>
    );
  }
}

export default Troll;