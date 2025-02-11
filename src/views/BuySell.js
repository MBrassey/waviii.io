import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'
import swapLogo from '../assets/img/swap_logo.gif'
import FadeIn from "react-fade-in";

class BuySell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy'
    }
  }

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
      />
    }

    return (
      <FadeIn>
      <div id="content" className="mt-3"> 
        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light waviii"
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
            >
            Buy
          </button>
          <img src={swapLogo} className="swapLogo" alt="waviii Swap Logo" />
          <button
              className="btn btn-light waviii"
              onClick={(event) => {
                this.setState({ currentForm: 'sell' })
              }}
            >
            Sell
          </button>
        </div><br />

        <div className="card mb-4" >

          <div className="card-body">

            {content}

          </div>

        </div>

      </div>
      </FadeIn>
    );
  }
}

export default BuySell;
