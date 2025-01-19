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
const date1 = `${moment().subtract(5, "month").format("DD-MM-YYYY")}`;
const date2 = `${moment().subtract(4, "month").format("DD-MM-YYYY")}`;
const date3 = `${moment().subtract(3, "month").format("DD-MM-YYYY")}`;
const date4 = `${moment().subtract(2, "month").format("DD-MM-YYYY")}`;
const date5 = `${moment().subtract(1, "month").format("DD-MM-YYYY")}`;

var axios = require("axios").default;

class Dashboard extends React.Component {
  static retryRequest = async (options, retries = 3, delay = 500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.request(options);
        return response;
      } catch (error) {
        if (attempt === retries) {
          console.error(`Failed after ${retries} attempts`, error);
          throw error;
        }
        console.warn(`Retrying... Attempt ${attempt} failed`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  async componentDidMount() {
    await this.loadPricesSequentially();
  }

  loadPricesSequentially = async () => {
    const priceDates = [
      { date: date1, priceKey: "price1", monthKey: "month1" },
      { date: date2, priceKey: "price2", monthKey: "month2" },
      { date: date3, priceKey: "price3", monthKey: "month3" },
      { date: date4, priceKey: "price4", monthKey: "month4" },
      { date: date5, priceKey: "price5", monthKey: "month5" },
    ];
  
    try {
      await this.getCurrentPrice();
      for (const { date, priceKey, monthKey } of priceDates) {
        await this.getPriceX(date, priceKey, monthKey);
      }
    } catch (error) {
      console.error("Error loading prices sequentially:", error);
    }
  };

  getCurrentPrice = async () => {
    const options = {
      method: "GET",
      url: "https://coingecko.p.rapidapi.com/simple/price",
      params: { ids: "ethereum", vs_currencies: "usd" },
      headers: {
        "x-rapidapi-key": "e450825ad3mshaa208fa97b50bb4p17c097jsn38f8f54e39a1",
        "x-rapidapi-host": "coingecko.p.rapidapi.com",
      },
    };

    try {
      const response = await Dashboard.retryRequest(options);
      const ETH = response.data.ethereum.usd;
      const raw = ETH / 100;
      const waviii = raw.toFixed(2);
      const max_num = waviii * 1.1;

      this.setState({
        price: waviii,
        max: max_num,
        month: moment().format("MMM").toUpperCase(),
        loading: false, 
      });
    } catch (error) {
      console.error("Error fetching current price:", error);
      this.setState({ price: "0.00" });
    }
  };

  getPriceX = async (date, priceKey, monthKey) => {
    const options = {
      method: "GET",
      url: "https://api.coingecko.com/api/v3/coins/ethereum/history",
      params: { date: moment(date, "DD-MM-YYYY").format("DD-MM-YYYY") },
    };
  
    try {
      const response = await Dashboard.retryRequest(options);
      const marketData = response.data?.market_data;
  
      if (marketData?.current_price?.usd) {
        const ETH = marketData.current_price.usd;
        const raw = ETH / 100;
        const waviii = raw.toFixed(2);
  
        this.setState((prevState) => ({
          ...prevState,
          [priceKey]: waviii,
          [monthKey]: moment(date, "DD-MM-YYYY").format("MMM").toUpperCase(),
        }));
      } else {
        console.error(`Historical price data unavailable for date: ${date}`);
        this.setState((prevState) => ({
          ...prevState,
          [priceKey]: "0.00",
        }));
      }
    } catch (error) {
      console.error(`Error fetching historical price for ${priceKey}:`, error);
      this.setState((prevState) => ({
        ...prevState,
        [priceKey]: "0.00",
      }));
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
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#2C2C2C",
        titleFontColor: "#a3de9e",
        bodyFontColor: "#2c91c7",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: this.state.max,
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
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

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

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
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
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
