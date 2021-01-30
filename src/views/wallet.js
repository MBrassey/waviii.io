import React from "react";
import Web3 from "web3";
import waviiiLogo from "../assets/img/i3.png";
import waviii from "./abis/waviii2.json";
import CountUp from "react-countup";
import { WaveTopBottomLoading } from "react-loadingg";
import FadeIn from "react-fade-in";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

class Wallet extends React.Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      this.setState({ loading: true });
      this.setState({ noEth: true });
    }
  }

  async loadBlockchainData() {
    if (this.state.loading) {
      return false;
    } else {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const TokenAddress = "0x9cc6754d16b98a32ec9137df6453ba84597b9965"; // mainnet waviii Token Contract Address
      // const TokenAddress = "0x37465edc8d70e4b16033fae23088b1c703924a80" // Kovan
      const waviiiToken = new web3.eth.Contract(waviii.abi, TokenAddress);
      this.setState({ waviiiToken: waviiiToken });
      const balance = await waviiiToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({
        balance: web3.utils.fromWei(balance.toString(), "Ether"),
      });
      const transactions = (
        await Promise.all([
          waviiiToken.getPastEvents("Transfer", {
            fromBlock: 0,
            toBlock: "latest",
            filter: { from: this.state.account },
          }),
          waviiiToken.getPastEvents("Transfer", {
            fromBlock: 0,
            toBlock: "latest",
            filter: { to: this.state.account },
          }),
        ])
      ).flat();
      this.setState({ transactions: transactions });
      // console.log(transactions);
    }
  }

  transfer(recipient, amount) {
    this.state.waviiiToken.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: true });
      })
      .on("confirmation", (reciept) => {
        this.setState({ loading: false });
        window.location.reload();
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      waviiiToken: null,
      balance: 0,
      transactions: [],
      loading: undefined,
    };

    this.transfer = this.transfer.bind(this);
  }

  render() {
    let content;
    if (this.state.loading) {
      if (this.state.noEth) {
        content = (
          <div className="content mr-auto ml-auto" style={{ width: "90%" }}>
            <div className="card mb-4">
              <div className="card-body" style={{ width: "90%" }}>
                <p id="loader">
                  <WaveTopBottomLoading color={"#2c91c7"} />
                  <FadeIn>
                    <a href="https://metamask.io/">
                      <h5>
                        <strong>Install MetaMask!</strong>
                      </h5>
                      <img
                        alt="MetaMask"
                        width="100%"
                        height="auto"
                        src={require("assets/img/mm.png")}
                      />
                    </a>
                  </FadeIn>
                </p>
              </div>
            </div>
          </div>
        );
      } else {
        content = (
          <p id="loader" className="text-center">
            <WaveTopBottomLoading />
          </p>
        );
      }
    } else {
      content = (
        <div className="mt-3">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "90%" }}>
                <FadeIn>
                  <img src={waviiiLogo} width="150" alt="waviii Logo" />
                </FadeIn>
                <br />
                <br />
                <FadeIn>
                  <h1 className="waviii">
                    <strong>
                      <CountUp
                        duration={1.7}
                        start={0}
                        separator=""
                        decimals="2"
                        decimal="."
                        end={this.state.balance}
                      />{" "}
                      waviii
                    </strong>
                  </h1>
                </FadeIn>
                <div className="card mb-4">
                  <div className="card-body">
                    <form
                      className="mb-3"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const recipient = this.recipient.value;
                        const amount = window.web3.utils.toWei(
                          this.amount.value,
                          "Ether"
                        );
                        this.transfer(recipient, amount);
                      }}
                    >
                      <div className="form-group">
                        <input
                          id="recipient"
                          type="text"
                          ref={(input) => {
                            this.recipient = input;
                          }}
                          className="form-control form-control-lg"
                          placeholder="Recipient Address"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          id="amount"
                          type="text"
                          ref={(input) => {
                            this.amount = input;
                          }}
                          className="form-control form-control-lg"
                          placeholder="Amount"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg waviii"
                      >
                        <strong>Send</strong>
                      </button>
                    </form>

                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Recipient</th>
                          <th scope="col">value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.transactions
                          .sort((a, b) => a.blockNumber < b.blockNumber)
                          .map((tx, key) => {
                            return (
                              <tr key={key}>
                                <td>
                                  <a
                                    className="title right"
                                    href={`https://etherscan.io/address/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="waviii text-muted">
                                      {tx.returnValues.to}
                                    </span>
                                  </a>
                                </td>
                                {tx.returnValues.to !== this.state.account && (
                                  <td>
                                    <span className="waviii">
                                      -
                                      <CountUp
                                        duration={2.7}
                                        start={0}
                                        separator=""
                                        decimals="2"
                                        decimal="."
                                        end={window.web3.utils.fromWei(
                                          tx.returnValues.value.toString(),
                                          "Ether"
                                        )}
                                      />
                                    </span>
                                  </td>
                                )}
                                {tx.returnValues.to === this.state.account && (
                                  <td>
                                    <span className="waviii2">
                                      +
                                      <CountUp
                                        duration={2.7}
                                        start={0}
                                        separator=""
                                        decimals="2"
                                        decimal="."
                                        end={window.web3.utils.fromWei(
                                          tx.returnValues.value.toString(),
                                          "Ether"
                                        )}
                                      />
                                    </span>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="content">
          <FadeIn>
            <Row>
              <Col md="12">
                <Card>
                  <FadeIn>
                    <CardHeader>
                      <a
                        className="title right waviii"
                        href={`https://etherscan.io/address/${this.state.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{this.state.account}</span>
                      </a>
                    </CardHeader>
                  </FadeIn>
                  <CardBody className="all-icons">
                    <FadeIn>
                      <div>{content}</div>
                    </FadeIn>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </FadeIn>
        </div>
      </>
    );
  }
}

export default Wallet;
