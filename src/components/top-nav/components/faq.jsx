import React from 'react';

import './faq.css';

// Data
import faqs from '../../../data/faqs.json';

const renderQuestions = (props) => {
  return faqs.map(faq => (
    <div className="faq">
      <div className="question">{props.strings[faq.key + "Q"]}</div>
      <div className="answer">{props.strings[faq.key + "A"]}</div>
    </div>
  ))
}

const FAQ = (props) => {
  return (
    <div className="FAQ">
      <div className="page-container">
        <div className="close" onClick={()=> {props.handleFAQToggle()}}>x</div>
        <div className="title">
          {props.strings.faq}
        </div>
        <div className="questions">
          {renderQuestions(props)}
        </div>
      </div>
    </div>
  );
}

export default FAQ;