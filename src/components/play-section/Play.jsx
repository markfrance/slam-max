import React, { Component } from 'react';
import './Play.css';

// components
import Scatter from "./play-components/scatter-balance/Scatter";
import WinningNumber from "./play-components/winning-number/WinningNumber";
import BetPayout from "./play-components/bet-payout/BetPayout";

import NumberRangeBar from "./play-components/number-range-bar/NumberRangeBar";
import MobileNumberRangeBar from "./play-components/number-range-bar/mobile/MobileNumberRangeBar";
import Multiplier from "./play-components/multiplier-section/Multiplier";
import Notifications, {notify} from 'react-notify-toast';

// Data
import InitialMultiplierButtons from "../../data/multiplier_buttons.json";
import payoutTable from "../../data/payout-table.json";
import Eos from 'eosjs';
import api from '../../eos';
import network from '../../network';
import createHash from 'create-hash';
import Promise from 'bluebird';
import randomNumber from 'random-number-csprng';
import crypto from 'crypto';

const DEFAULT_ROLL_UNDER = 50;
const DEFAULT_BET = 1;
const MIN_BET = 1;
const MAX_BET = 1000;
const DEFAULT_LUCKY_NUMBER = 8;

class Play extends Component {

  constructor(props){
    super(props);

    let defaultWinChance = DEFAULT_ROLL_UNDER-1,
        defaultPayoutMultiplier = payoutTable[DEFAULT_ROLL_UNDER-2],
        defaultPayout = DEFAULT_BET * defaultPayoutMultiplier;

    this.state = {
      multiplierButtons: InitialMultiplierButtons,
      rollUnder: DEFAULT_ROLL_UNDER,
      winChance: defaultWinChance,
      payoutMultiplier: defaultPayoutMultiplier,
      bet: props.activeToken.min,
      payout: defaultPayout,
      luckyNumber: DEFAULT_LUCKY_NUMBER,
      account : {}
    }

    this.handleMultiplierButtonClick = this.handleMultiplierButtonClick.bind(this);
    this.updateRollUnder = this.updateRollUnder.bind(this);
    this.handleSlamButtonClick = this.handleSlamButtonClick.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.updateBetAmount = this.updateBetAmount.bind(this);

    this.getEOS();
    this.getPool();
    this.getLuckyNumber();
  }

  // Handler functions
  handleMultiplierButtonClick(newButton){
    const multiplierButtons = this.state.multiplierButtons;

    let newBet = 0;
    let newButtonList = multiplierButtons.map(button => {
      if(button.id === newButton.id){
        button.active = true;
        if(button.id === 4) {
          newBet = this.props.activeToken.max;
        }
        else {

          newBet = this.state.bet * button.value;

          if(newBet < this.props.activeToken.min)
            newBet = this.props.activeToken.min;
          if(newBet > this.props.activeToken.max)
            newBet = this.props.activeToken.max; 
        }
      }else{
        button.active = false;
      }
      return button;
    });

    const payoutMultiplier = payoutTable[this.state.rollUnder-2];
    this.setState({
      multiplierButtons: newButtonList,
      payoutMultiplier,
      bet: newBet,
      payout: newBet * payoutMultiplier
      
    })
  }

  updateRollUnder(newRollUnder){
    const payoutMultiplier = payoutTable[newRollUnder-2];
    this.setState({
      rollUnder: newRollUnder,
      winChance: newRollUnder-1,
      payoutMultiplier,
      payout: this.state.bet * payoutMultiplier
    })
  }

  updateBetAmount(amount) {

    if(amount < this.props.activeToken.min)
      amount = this.props.activeToken.min;
    if(amount > this.props.activeToken.max)
      amount = this.props.activeToken.max; 

  const payoutMultiplier = payoutTable[this.state.rollUnder-2];
    this.setState({
      bet: amount,
      payout: amount * payoutMultiplier
    })
  }

  handleSlamButtonClick(){
    this.doAction();
  }

  data() {
    return {
      eos: 1,
      rollUnder: 50,
      currentEOS: 0,
      poolBalance: 0,
      timer: 0,
    };
  }

  getEOS() {
    if (!this.state.account.name) {
      this.currentEOS = 0;
      return;
    }
    return api.getAccount(this.state.account.name).then(({ core_liquid_balance }) => {
      this.currentEOS = Number(core_liquid_balance.replace(/\sEOS/, ''));
    });
  }

  getPool() {
    Promise.all([
      api.getTableRows({
        json: true,
        code: 'eosio.token',
        table: 'accounts',
        scope: 'slammaxxgame'
      }),
      api.getTableRows({
        json: true,
        code: 'slammaxxgame',
        table: 'fundpool',
        scope: 'slammaxxgame'
      })
    ]).then(([accountBalance, poolBalance]) => {
      this.poolBalance = accountBalance.rows[0].balance.slice(0, -4) 
        - poolBalance.rows[0].locked.slice(0, -4);
    });
  }

  floor(value, decimals) {
    return Number(Math.floor(value+'e'+decimals)+'e-'+decimals);
  }

  maxBetAmount() {
    var balance =  this.floor(this.poolBalance / 100 / (98 / this.winChance) * 0.9, 4);

    if(balance < this.props.activeToken.max)
      return balance
    else
      return this.props.activeToken.max;
  }

  setEOS(rate) {
    let eos = rate ? this.eos * rate : this.currentEOS;
    switch (true) {
      case (eos < 0.1): 
        eos = 0.1;
        break;
      case (eos > this.currentEOS):
        eos = this.currentEOS;
        break;
      case (eos > this.maxBetAmount()):
        eos = this.maxBetAmount();
        break;
      default:
        console.error("Invalid EOS amount")

    }
    this.eos = Number(eos).toFixed(4);
  }

  getClientSeed() {
    let randomNumber = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    return createHash('sha1').update(this.state.account.name + Date.now() + randomNumber).digest('hex');
  }

  doAction() {
    let maxAmount = this.maxBetAmount();
    if (this.eos > maxAmount) {
      notify.show('Bet Amount should not be more than ' + maxAmount.toFixed(4) + ' EOS', 'error',2000);
      return;
    }
    const minBetAmount = 0.1
    if (this.eos < minBetAmount) {
       notify.show('Bet Amount should be more than ' + minBetAmount.toFixed(4) + ' EOS', 'error',2000);
      return;
    }
    const body = new FormData();
    const eos = window.scatter.eos(network, Eos, {})
    const options = {
      authorization: `${this.state.account.name}@${this.state.account.authority}`,
      broadcast: true,
      sign: true
    };

    notify.show('Waiting for Scatter to confirm transfer...');
    let referrer = 'slammaxxgame';  
    body.append('lucky_number', this.luckyNumber);
    body.append('roll_under', this.rollUnder);
    body.append('referrer', referrer);
    
    fetch('//dice.dapp.pub/dice/', {
      method: 'POST',
      body 
    }).then(({ expiration_timestamp, seed, signature }) => {
      eos.transfer({
        from: this.state.account.name, 
        to: 'slammaxxgame',
        quantity: Number(this.eos).toFixed(4) + ' EOS',
        memo: `${this.rollUnder}-${seed}-${this.getClientSeed()}-${expiration_timestamp}-${referrer}-${signature}` 
      }).then(() => {
        this.getEOS(); 
        this.fetchResult(seed);

        notify.show('Bet success, waiting for result.',
        'success',2000)
        
      }).catch(e => {
        notify.show(e.message || JSON.parse(e).error.details[0].message, 'error', 2000)
 
      });
    });
  }

  fetchResult(hash) {
    api.getActions('slamdevelogs', -1, -20).then(({ actions }) => {
      const result = actions.find(action => action.action_trace
        && action.action_trace.act 
        && action.action_trace.act.account === 'slamdevelogs' 
        && action.action_trace.act.name === 'result'
        && action.action_trace.act.data
        && action.action_trace.act.data.result
        && action.action_trace.act.data.result.seed_hash === hash);  

      if (!result) return this.fetchResult(hash);

      const { action_trace: { act: { data: { result: { amount, payout } } } } } = result;

      this.getEOS();
    });
  }

  handleLoginButtonClick() {
    this.login();
  }

  login() {
    window.scatter.getIdentity({
      accounts: [network]
    }).then(() => {
      const account = window.scatter.identity.accounts.find(account => account.blockchain === 'eos');
      if (!account) return;
      this.state.account = account;
    }).catch(e => {
    notify.show(e.message, 'warning', 200);
      
    });
  }
      
  getLuckyNumber(){
    // API call for lucky number
    //https://www.random.org/integers/?num=3&min=2&max=98&col=1&base=10&format=plain&rnd=new


    var randbytes = parseInt(crypto.randomBytes(1).toString('hex'), 16);

    var result = Math.floor(randbytes/255*(96-3+1)+3);

    this.state.luckyNumber = result;
    
  }

  render() {
    return (
      <div className="Play">
     
        <div className="card">
          <div className="main-row">
            <div className="play-left">
              <div className="top-row">
                <div className="scatter-section">
                  <Scatter activeToken={this.props.activeToken}
                  updateToken={this.props.updateToken}/>
                </div>
                <div className="winning-number-section">
                  <div className="winning-number-container">
                    <WinningNumber title={this.props.strings.luckyNumber} wNumber={this.state.luckyNumber} />
                    <div style={{ flex: 0.15 }}></div>
                    <WinningNumber title={this.props.strings.rollUnderToWin} wNumber={this.state.rollUnder} />
                  </div>
                </div>
              </div>
              <div className="second-row">
                <div className="bet-payout-section">
                  <BetPayout bet={this.state.bet} 
                  payout={this.state.payout}
                  strings={this.props.strings}
                  activeToken={this.props.activeToken} 
                  updateBetAmount={this.updateBetAmount}/>
                </div>
                <div className="multiplier-buttons-section">
                  <Multiplier 
                    multiplierButtons={this.state.multiplierButtons} 
                    multiplierButtonClick={(newButton) => this.handleMultiplierButtonClick(newButton)} 
                    winChance={this.state.winChance}
                    payoutMultiplier={this.state.payoutMultiplier}
                    strings={this.props.strings}
                  />
                </div>
              </div>
              <div className="mobile-slider-section">
                <MobileNumberRangeBar rollUnder={this.state.rollUnder} updateRollUnder={(value) => this.updateRollUnder(value)} />
              </div>
              <div className="third-row">
                <div className="slam-button-section">
                  <div className="button slam-button">SLAM</div>
                </div>
                <div className="claim-slam-button-section">
                  <div className="button claim-slam-button" onClick={() => this.handleSlamButtonClick()}>{this.props.strings.claim} SLAM</div>
                </div>
                <div className="login-button-section">
                  <div className="button login-button"  onClick={() => this.handleLoginButtonClick()}>{this.props.strings.login}</div>
                </div>
              </div>
            </div>
            <div className="slider-section">
              <NumberRangeBar rollUnder={this.state.rollUnder} updateRollUnder={(value) => this.updateRollUnder(value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Play;