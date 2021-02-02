import React, { Component } from "react";
import Web3 from "web3";
import Token from "./abis/waviii2.json";
import EthSwap from "./abis/WavSwap.json";
import BuySell from "./BuySell";
import { WaveTopBottomLoading } from "react-loadingg";
import FadeIn from "react-fade-in";
import tokenLogo from "../assets/img/token-logo.png";
import ethLogo from "../assets/img/eth-logo.png";
import swapLogo from "../assets/img/swap_logo.gif";
import CountUp from "react-countup";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap";

class Swap extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    if (this.state.loading) {
      return false;
    } else {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const ethBalance = await web3.eth.getBalance(this.state.account);
      this.setState({ ethBalance });

      // Load Token
      const networkId = await web3.eth.net.getId();
      const tokenData = Token.networks[networkId];
      if (tokenData) {
        const token = new web3.eth.Contract(Token.abi, tokenData.address);
        this.setState({ token });
        let tokenBalance = await token.methods
          .balanceOf(this.state.account)
          .call();
        this.setState({ tokenBalance: tokenBalance.toString() });
      } else {
        window.alert("Token contract not deployed to detected network.");
        this.setState({ loading: true });
      }

      // Load EthSwap
      const ethSwapData = EthSwap.networks[networkId];
      if (ethSwapData) {
        const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
        this.setState({ ethSwap });
      } else {
        window.alert("EthSwap contract not deployed to detected network.");
        this.setState({ loading: true });
      }

      this.setState({ loading: false });
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ loading: true });
      this.setState({ noEth: true });
    }
  }

  buyTokens = (etherAmount) => {
    this.state.ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: true });
      })
      .on("confirmation", (reciept) => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  sellTokens = (tokenAmount) => {
    this.state.token.methods
      .approve(this.state.ethSwap.address, tokenAmount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: true });
          })
          .on("confirmation", (reciept) => {
            this.setState({ loading: false });
            window.location.reload();
          });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      ethBalance: "0",
      tokenBalance: "0",
      loading: undefined,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      if (this.state.noEth) {
        content = (
          <FadeIn>
            <FadeIn>
              <CardBody className="waviii-2">
                <FadeIn>
                  <div id="content" className="mt-3">
                    <div className="d-flex justify-content-between mb-3">
                      <button
                        className="btn btn-light waviii"
                        disabled
                        onClick={(event) => {
                          this.setState({ currentForm: "buy" });
                        }}
                      >
                        Buy
                      </button>
                      <img src={swapLogo} className="swapLogo" alt="waviii Swap Logo" />
                      <button
                        className="btn btn-light waviii"
                        disabled
                        onClick={(event) => {
                          this.setState({ currentForm: "sell" });
                        }}
                      >
                        Sell
                      </button>
                    </div>
                    <br />

                    <div className="card mb-4">
                      <div className="card-body">
                        <FadeIn>
                          <form
                            className="mb-3"
                            onSubmit={(event) => {
                              event.preventDefault();
                              let etherAmount;
                              etherAmount = this.input.value.toString();
                              etherAmount = window.web3.utils.toWei(
                                etherAmount,
                                "Ether"
                              );
                              this.props.buyTokens(etherAmount);
                            }}
                          >
                            <div>
                              <label className="float-left">
                                <b>Input</b>
                              </label>
                              <span className="float-right text-muted">
                                Balance:{" "}
                                <CountUp
                                  duration={2.7}
                                  start={-10}
                                  separator=""
                                  decimals={2}
                                  decimal="."
                                  end={0}
                                />
                              </span>
                            </div>
                            <div className="input-group mb-4">
                              <input
                                type="text"
                                onChange={(event) => {
                                  const etherAmount = this.input.value.toString();
                                  this.setState({
                                    output: etherAmount * 100,
                                  });
                                }}
                                ref={(input) => {
                                  this.input = input;
                                }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                disabled
                              />
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <strong>&nbsp;&nbsp;</strong>
                                  <img src={ethLogo} height="29" alt="" />
                                  <strong>&nbsp;&nbsp; ETH &nbsp;</strong>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="float-left">
                                <b>Output</b>
                              </label>
                              <span className="float-right text-muted">
                                Balance:{" "}
                                <CountUp
                                  duration={2.7}
                                  start={-10}
                                  separator=""
                                  decimals={2}
                                  decimal="."
                                  end={0}
                                />
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
                                  <img src={tokenLogo} height="29" alt="" />
                                  <strong>&nbsp; waviii</strong>
                                </div>
                              </div>
                            </div>
                            <div className="mb-5">
                              <span className="float-left text-muted">
                                Exchange Rate
                              </span>
                              <span className="float-right text-muted waviii responsive3">
                                1 ETH = 100 waviii
                              </span>
                            </div>
                            <button
                              type="submit"
                              disabled
                              className="btn btn-primary btn-block btn-lg waviii"
                            >
                              locked
                            </button>
                          </form>
                        </FadeIn>
                      </div>
                    </div>
                    <br />
                  <FadeIn>
                    <a
                      href="https://metamask.io/download.html"
                      className="noEth"
                    >
                      <center>Blockchain browser not detected! Install MetaMask to use
                      waviii.</center>
                    </a>
                  </FadeIn>
                  </div>
                </FadeIn>
              </CardBody>
            </FadeIn>
          </FadeIn>
        );
      } else {
        content = (
          <p id="loader" className="text-center">
            <WaveTopBottomLoading color={"#2c91c7"} />
          </p>
        );
      }
    } else {
      content = (
        <BuySell
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );
    }

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <FadeIn>
                  <CardHeader className="responsive2">
                    <a
                      className="waviii3 responsive2"
                      href={`https://etherscan.io/address/${this.state.account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{this.state.account}</span>
                    </a>
                  </CardHeader>
                </FadeIn>
                <CardBody className="all-icons">
                  <div
                    className="content mr-auto ml-auto"
                    style={{ width: "90%" }}
                  >
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
