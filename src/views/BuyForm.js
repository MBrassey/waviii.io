import React, { Component } from 'react'
import tokenLogo from '../assets/img/token-logo.png'
import ethLogo from '../assets/img/eth-logo.png'
import CountUp from 'react-countup'
import FadeIn from "react-fade-in";

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }

  render() {
    return (
      <FadeIn>
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: <CountUp duration={2.7} start={0} separator="" decimals={2} decimal="." end={window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} />
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * 100
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <strong>&nbsp;&nbsp;</strong>
              <img src={ethLogo} height='29' alt=""/>
              <strong>&nbsp;&nbsp; ETH &nbsp;</strong>
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: <CountUp duration={2.7} start={0} separator="" decimals={2} decimal="." end={window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')} />
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text waviii">
            <strong>&nbsp;&nbsp;</strong>
              <img src={tokenLogo} height='29' alt=""/>
              <strong>&nbsp;  waviii</strong>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted waviii responsive3">1 ETH = 100 waviii</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg waviii">Buy waviii</button>
      </form>
      </FadeIn>
    );
  }
}

export default BuyForm;
