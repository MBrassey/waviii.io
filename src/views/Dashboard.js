import React from "react";
import { Line } from "react-chartjs-2";
import FadeIn from "react-fade-in";
import { WaveTopBottomLoading } from "react-loadingg";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
import sContractLogo from "../../src/assets/img/sContract.png";
import moment from "moment";

const dateLong = `${moment().format("MMMM DD YYYY")}`;

var axios = require("axios").default;

const toWaviii = (ethUsd) => (ethUsd / 100).toFixed(2);
const monthOf = (ts) => moment(ts).format("MMM").toUpperCase();

class Dashboard extends React.Component {
  async componentDidMount() {
    await this.fetchPrices();
  }

  fetchPrices = async () => {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart",
        { params: { vs_currency: "usd", days: 150, interval: "daily" } }
      );
      const prices = data && data.prices;
      if (!prices || prices.length < 6) throw new Error("insufficient price data");

      const last = prices.length - 1;
      const pick = (monthsAgo) =>
        prices[Math.max(0, last - monthsAgo * 30)];

      const p5 = pick(5);
      const p4 = pick(4);
      const p3 = pick(3);
      const p2 = pick(2);
      const p1 = pick(1);
      const current = prices[last];
      const currentPrice = toWaviii(current[1]);

      this.setState({
        price: currentPrice,
        max: currentPrice * 1.1,
        month: monthOf(current[0]),
        price1: toWaviii(p5[1]),
        price2: toWaviii(p4[1]),
        price3: toWaviii(p3[1]),
        price4: toWaviii(p2[1]),
        price5: toWaviii(p1[1]),
        month1: monthOf(p5[0]),
        month2: monthOf(p4[0]),
        month3: monthOf(p3[0]),
        month4: monthOf(p2[0]),
        month5: monthOf(p1[0]),
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching prices:", error);
      this.setState({ price: "0.00", loading: false });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      price: "",
      price1: "",
      price2: "",
      price3: "",
      price4: "",
      price5: "",
      month: "",
      month1: "",
      month2: "",
      month3: "",
      month4: "",
      month5: "",
      max: "",
      bigChartData: "chart_data",
      loading: true,
    };
  }

  render() {
    let chart_options = {
      maintainAspectRatio: false,
      legend: { display: false },
      tooltips: {
        backgroundColor: "#2C2C2C",
        titleFontColor: "#a3de9e",
        bodyFontColor: "#2c91c7",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: false,
        position: "nearest",
        callbacks: {
          label: (item) => ` $${item.yLabel}`,
        },
      },
      responsive: true,
      hover: { mode: "nearest", intersect: false },
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(255,255,255,0.06)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: this.state.max,
              padding: 12,
              fontColor: "#9a9a9a",
              callback: (v) => `$${v}`,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(255,255,255,0.04)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 12,
              fontColor: "#9a9a9a",
            },
          },
        ],
      },
    };

    let waviiiChart = {
      chart_data: (canvas) => {
        let ctx = canvas.getContext("2d");
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
        gradientStroke.addColorStop(1, "rgba(29,140,248,0.25)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.05)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)");

        return {
          labels: [
            this.state.month1,
            this.state.month2,
            this.state.month3,
            this.state.month4,
            this.state.month5,
            this.state.month,
          ],
          datasets: [
            {
              label: " $",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "#1f8ef1",
              pointHoverBackgroundColor: "#ffffff",
              pointHoverBorderColor: "#1f8ef1",
              pointRadius: 3,
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBorderWidth: 2,
              lineTension: 0.4,
              data: [
                this.state.price1,
                this.state.price2,
                this.state.price3,
                this.state.price4,
                this.state.price5,
                this.state.price,
              ],
            },
          ],
        };
      },
      options: chart_options,
    };

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
                        <h5 className="card-category">{dateLong}</h5>
                        <CardTitle tag="h2" className="waviii">
                          waviii:{" "}
                          {this.state.loading ? (
                            <span className="price right">
                              {" "}
                              <WaveTopBottomLoading color="#2c91c7" />
                            </span>
                          ) : (
                            <span className="price">${this.state.price}</span>
                          )}
                        </CardTitle>
                      </Col>
                      <Col sm="6">
                        <ButtonGroup
                          className="btn-group-toggle float-right"
                          data-toggle="buttons"
                        >
                          <Button
                            tag="label"
                            className="chart_data"
                            color="info"
                            id="0"
                            size="sm"
            
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
                              USD ($)
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
                      <a href="https://etherscan.io/token/0x9cc6754d16b98a32ec9137df6453ba84597b9965">
                        <LazyLoadImage
                          src={sContractLogo}
                          alt="wavii Smart Contract"
                          className="sContractLogo"
                        />
                      </a>
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
                      Development experience to prospective employers. The
                      immediate goal of the waviii Token is to be the main
                      reference utility crypto-currency used within the
                      waviii.io decentralized application ecosystem. The broader
                      objective of the waviii Token for example, could be to
                      establish itself as the crypto-currency of choice for
                      anyone in the industry fulfilling a task with a smart
                      contract. Over time, by adding new waviii dApps, like
                      token staking, betting games, storage systems, social
                      networks and automated trading, we intend to capitalize on
                      a trend that is growing exponentially in our industry: the
                      decentralisation of tasks around the world and the use of
                      smart contracts to fulfil them. If this were more than my
                      portfolio demo, we would see the waviii Token as an
                      opportunity for anyone - even the under-banked, the
                      underserved, or the next wave of 4 billion individuals who
                      are getting access to the internet – to find useful
                      incentives for their work and improve their financial
                      condition through access to a new decentralised financial
                      system built upon the Ethereum Network. I'm currently open
                      to full-time and freelance work as a Blockchain or related
                      Frontend Developer, Contact me with any inqueries:
                      matt@brassey.io.
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
                      <a href="https://etherscan.io/address/0x38abf018ea2f8066813c376a197b6df0349d86c5">
                        <LazyLoadImage
                          src={sContractLogo}
                          alt="wavii Smart Contract"
                          className="sContractLogo"
                        />
                      </a>
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
                      (IPFS) - Making this a fully decentralized application
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
