import React from 'react';

import './faq.css';

// Data
import faqs from '../../../data/faqs.json';

const renderQuestions = () => {
  return faqs.map(faq => (
    <div className="faq">
      <div className="question">{faq.question}</div>
      <div className="answer">{faq.answer}</div>
    </div>
  ))
}

const FAQ = (props) => {
  return (
    <div className="FAQ">
      <div className="page-container">
        <div className="close" onClick={()=> {props.handleFAQToggle()}}>x</div>
        <div className="title">
          Frequently Asked Questions
        </div>
        <div className="questions">
          {renderQuestions()}
        </div>
      </div>
    </div>
  );
}

export default FAQ;