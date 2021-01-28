import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
import FadeIn from "react-fade-in";
// waviii price data

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

// core components
import { waviiiChart } from "variables/charts.js";
const current = new Date();
const date = `${
  current.getMonth() + 1
}/${current.getDate()}/${current.getFullYear()}`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
    };
  }
  setBgChartData = (name) => {
    this.setState({
      bigChartData: name,
    });
  };
  render() {
    return (
      <>
        <div className="content">
          <FadeIn>
            <Row>
              <Col xs="12">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col className="text-left" sm="6">
                        <h5 className="card-category">{date}</h5>
                        <CardTitle tag="h2" className="waviii">
                          waviii price: <span className="price">$12.40</span>
                        </CardTitle>
                      </Col>
                      <Col sm="6">
                        <ButtonGroup
                          className="btn-group-toggle float-right"
                          data-toggle="buttons"
                        >
                          <Button
                            tag="label"
                            className={classNames("btn-simple", {
                              active: this.state.bigChartData === "data1",
                            })}
                            color="info"
                            id="0"
                            size="sm"
                            onClick={() => this.setBgChartData("data1")}
                          >
                            <input
                              defaultChecked
                              className="d-none"
                              name="options"
                              type="radio"
                            />
                            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                              USD ($)
                            </span>
                            <span className="d-block d-sm-none">
                              <i className="wav-icons icon-single-02" />
                            </span>
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                      <Line
                        data={waviiiChart[this.state.bigChartData]}
                        options={waviiiChart.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </FadeIn>
          <FadeIn>
            <Row>
              <Col lg="12" md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="waviii">
                      <span className="drop-item">waviii token</span>
                    </CardTitle>
                  </CardHeader>
                  <FadeIn>
                    <CardBody className="waviii-2">
                      waviii is an ERC-20 Ethereum token I built with
                      OpenZeppelin libraries and deployed with Remix IDE. The
                      total supply of waviii is one million tokens. The Mainnet
                      Token Contract can be viewed on{" "}
                      <a href="https://etherscan.io/token/0x9cc6754d16b98a32ec9137df6453ba84597b9965">
                        Etherscan
                      </a>
                      . I created waviii.io, the waviii ERC-20 Token, Wallet and
                      waviii to ETH Swap to showcase my Full Stack Blockchain
                      Development experience as portfolio projects for
                      prospective employers reference. The immediate goal of the
                      waviii Token is to be the main reference utility
                      crypto-currency used within the waviii.io decentralized
                      application ecosystem. The broader objective of the waviii
                      Token for example, could be to establish itself as the
                      crypto-currency of choice for anyone in the industry
                      fulfilling a task with a smart contract. Over time,
                      through adding new dApps to waviii.io, we intend to
                      capitalize on a trend that is growing exponentially in our
                      industry: the decentralisation of tasks around the world
                      and the use of smart contracts to fulfil them. If this
                      were more than my portfolio demo, we would see the waviii
                      Token as an opportunity for anyone - even the
                      under-banked, the underserved, or the next wave of 4
                      billion individuals who are getting access to the internet
                      – to find useful incentives for their work and improve
                      their financial condition through access to a new
                      decentralised financial system built upon the Ethereum
                      Network. I'm currently open to full-time and freelance
                      work as a Blockchain or related Frontend Developer,
                      Contact me with any inqueries: matt@brassey.io.
                    </CardBody>
                  </FadeIn>
                </Card>
              </Col>
            </Row>
          </FadeIn>

          <FadeIn>
            <Row>
              <Col lg="12" md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="waviii">
                      <span className="drop-item">waviii wallet</span>
                    </CardTitle>
                  </CardHeader>
                  <FadeIn>
                    <CardBody className="waviii-2">
                      waviii's Web3 ERC-20 token wallet interfaces directly with
                      the Mainnet waviii Token Contract mentioned above and uses
                      MetaMask integration to display token balance and send
                      waviii. I implemented the transaction history grid by
                      fetching the hashes from Etherscan. If MetaMask is not
                      detected, an alternate component is rendered to guide
                      users to install the browser extension. The user's
                      connected Ethereum address is rendered at the top left
                      corner of the wallet and redirects the user to their own
                      address on Etherscan where incoming transactions are also
                      visible.
                    </CardBody>
                  </FadeIn>
                </Card>
              </Col>
            </Row>
          </FadeIn>

          <FadeIn>
            <Row>
              <Col lg="12" md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="waviii">
                      <span className="drop-item">waviii swap</span>
                    </CardTitle>
                  </CardHeader>
                  <FadeIn>
                    <CardBody className="waviii-2">
                      waviii token has a fixed exchange rate of 1/100 with ETH.
                      Most of the one million waviii tokens reside within the
                      ERC-20 Token Swap Smartcontract I deployed at this
                      Ethereum Mainnet address:{" "}
                      <a href="https://etherscan.io/address/0x38abf018ea2f8066813c376a197b6df0349d86c5">
                        [0x38abF018eA2f8...]
                      </a>{" "}
                      . The swap contract allows waviii tokens to be bought and
                      sold (exchanged) for real ETH at any time. With the hard
                      coded exchange rate discussed earlier, waviii tokens match
                      and retain value pegged and in fixed proportion to the
                      current value of ETH and always will.
                    </CardBody>
                  </FadeIn>
                </Card>
              </Col>
            </Row>
          </FadeIn>

          <FadeIn>
            <Row>
              <Col lg="12" md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="waviii">
                      <span className="drop-item">decentralized</span>
                    </CardTitle>
                  </CardHeader>
                  <FadeIn>
                    <CardBody className="waviii-2">
                      The Smartcontracts powering this dApp reside on the
                      Ethereum blockchain, while all the application code and
                      images are deployed to the InterPlanetary FileSystem
                      (ipfs) - Making this a fully decentralized application
                      (dApp).
                    </CardBody>
                  </FadeIn>
                </Card>
              </Col>
            </Row>
          </FadeIn>
        </div>
      </>
    );
  }
}

export default Dashboard;
