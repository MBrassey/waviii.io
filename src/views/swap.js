import React, { Component } from 'react'
import Web3 from 'web3'
import Token from './abis/waviii2.json'
import EthSwap from './abis/WavSwap.json'
import BuySell from './BuySell'
import { WaveTopBottomLoading } from 'react-loadingg'

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

class Swap extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    if(this.state.loading) {
      return false; 
    } else {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
      this.setState({ loading: true })
    }


    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
      this.setState({ loading: true })
    }

    this.setState({ loading: false })
  }}

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ loading: true })
      this.setState({ noEth: true })
    }
  }

  buyTokens = (etherAmount) => {
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: true })
      }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  sellTokens = (tokenAmount) => {
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: true })
      }).on('confirmation', (reciept) => {
      this.setState({ loading: false })
      window.location.reload()
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: undefined
    }
  }

  render() {
    let content
    if(this.state.loading) {
      if(this.state.noEth) {
        content = <div className="card mb-4" ><div className="card-body"><p id="loader" ><WaveTopBottomLoading color={"#2c91c7"} /><a href="https://metamask.io/"><h5><strong>Install MetaMask!</strong></h5><img alt="MetaMask" width="89.6%" height="auto" src={require("assets/img/mm.png")} /></a></p></div></div>
      } else {
      content = <p id="loader" className="text-center"><WaveTopBottomLoading color={"#2c91c7"} /></p>
      }
    } else {
      content = <BuySell
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>

                <a  
                    className="title right"
                    href={`https://etherscan.io/address/${this.state.account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                      <span>{this.state.account}</span>  
                  </a>
                </CardHeader>
                <CardBody className="all-icons">

                <div className="content mr-auto ml-auto" style={{ width: "90%" }}>
                {content}
                </div>     
                
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Swap;
