import React from "react";
import FadeIn from "react-fade-in";
import { WaveTopBottomLoading } from "react-loadingg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import moment from "moment";
import sContractLogo from "../assets/img/sContract.png";
import { fetchMarketChart, deriveStats } from "../utils/prices";
import { ETHERSCAN_TOKEN_URL, ETHERSCAN_SWAP_URL } from "../utils/wallet";
import PriceChart from "../components/Chart/PriceChart";
import Stat from "../components/Stat/Stat";

const dateLong = moment().format("MMMM DD YYYY");

export default class Dashboard extends React.Component {
  state = { loading: true, prices: [], stats: null };

  async componentDidMount() {
    try {
      const data = await fetchMarketChart();
      this.setState({
        prices: data.prices || [],
        stats: deriveStats(data.prices),
        loading: false,
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, prices, stats } = this.state;

    return (
      <div className="content">
        <FadeIn>
          <Card className="card-chart dex-card">
            <CardHeader className="dex-card-head">
              <div className="dex-head-row">
                <div>
                  <div className="dex-head-eyebrow">{dateLong}</div>
                  <CardTitle tag="h2" className="waviii dex-head-title">
                    {loading ? (
                      <WaveTopBottomLoading color="#2c91c7" />
                    ) : (
                      <>
                        <span className="dex-head-ticker">waviii</span>
                        <span className="dex-head-price">
                          ${stats ? stats.current.toFixed(4) : "—"}
                        </span>
                      </>
                    )}
                  </CardTitle>
                </div>
              </div>

              <div className="dex-stat-row">
                <Stat
                  label="Price"
                  prefix="$"
                  decimals={4}
                  value={stats ? stats.current : 0}
                  loading={loading}
                />
                <Stat
                  label="24h"
                  decimals={2}
                  value={stats ? Math.abs(stats.pctChange24h) : 0}
                  change={stats ? stats.pctChange24h : null}
                  loading={loading}
                />
                <Stat
                  label="30d High"
                  prefix="$"
                  decimals={4}
                  value={stats ? stats.high30 : 0}
                  loading={loading}
                />
                <Stat
                  label="30d Low"
                  prefix="$"
                  decimals={4}
                  value={stats ? stats.low30 : 0}
                  loading={loading}
                />
              </div>
            </CardHeader>
            <CardBody className="dex-card-body">
              {loading ? (
                <div className="dex-chart-placeholder">
                  <WaveTopBottomLoading color="#2c91c7" />
                </div>
              ) : (
                <PriceChart prices={prices} />
              )}
            </CardBody>
          </Card>
        </FadeIn>

        <FadeIn>
          <Row>
            <Col lg="12">
              <Card className="dex-card">
                <CardHeader>
                  <CardTitle tag="h4" className="waviii dex-section-title">
                    <span className="drop-item">waviii token</span>
                    <a href={ETHERSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer">
                      <LazyLoadImage
                        src={sContractLogo}
                        alt="waviii Smart Contract"
                        className="sContractLogo"
                      />
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardBody className="waviii-2">
                  waviii is an ERC-20 Ethereum token I built with OpenZeppelin libraries
                  and deployed with Remix IDE. The total supply of waviii is one million
                  tokens. The Mainnet Token Contract can be viewed on{" "}
                  <a href={ETHERSCAN_TOKEN_URL} target="_blank" rel="noopener noreferrer">
                    Etherscan
                  </a>
                  . I created waviii.io, the waviii ERC-20 Token, Wallet and waviii to
                  ETH Swap to showcase my Full Stack Blockchain Development experience to
                  prospective employers. The immediate goal of the waviii Token is to be
                  the main reference utility crypto-currency used within the waviii.io
                  decentralized application ecosystem. The broader objective of the
                  waviii Token for example, could be to establish itself as the
                  crypto-currency of choice for anyone in the industry fulfilling a task
                  with a smart contract. Over time, by adding new waviii dApps, like
                  token staking, betting games, storage systems, social networks and
                  automated trading, we intend to capitalize on a trend that is growing
                  exponentially in our industry: the decentralisation of tasks around the
                  world and the use of smart contracts to fulfil them. If this were more
                  than my portfolio demo, we would see the waviii Token as an
                  opportunity for anyone - even the under-banked, the underserved, or the
                  next wave of 4 billion individuals who are getting access to the
                  internet – to find useful incentives for their work and improve their
                  financial condition through access to a new decentralised financial
                  system built upon the Ethereum Network. I'm currently open to full-time
                  and freelance work as a Blockchain or related Frontend Developer,
                  Contact me with any inqueries: matt@brassey.io.
                </CardBody>
              </Card>
            </Col>
          </Row>
        </FadeIn>

        <FadeIn>
          <Row>
            <Col lg="12">
              <Card className="dex-card">
                <CardHeader>
                  <CardTitle tag="h4" className="waviii dex-section-title">
                    <span className="drop-item">waviii wallet</span>
                  </CardTitle>
                </CardHeader>
                <CardBody className="waviii-2">
                  waviii's Web3 ERC-20 token wallet interfaces directly with the Mainnet
                  waviii Token Contract mentioned above and uses MetaMask integration to
                  display token balance and send waviii. I implemented the transaction
                  history grid by fetching the hashes from Etherscan. If MetaMask is not
                  detected, an alternate component is rendered to guide users to install
                  the browser extension. The user's connected Ethereum address is
                  rendered at the top left corner of the wallet and redirects the user to
                  their own address on Etherscan where incoming transactions are also
                  visible.
                </CardBody>
              </Card>
            </Col>
          </Row>
        </FadeIn>

        <FadeIn>
          <Row>
            <Col lg="12">
              <Card className="dex-card">
                <CardHeader>
                  <CardTitle tag="h4" className="waviii dex-section-title">
                    <span className="drop-item">waviii swap</span>
                    <a href={ETHERSCAN_SWAP_URL} target="_blank" rel="noopener noreferrer">
                      <LazyLoadImage
                        src={sContractLogo}
                        alt="waviii Smart Contract"
                        className="sContractLogo"
                      />
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardBody className="waviii-2">
                  waviii token has a fixed exchange rate of 1/100 with ETH. Most of the
                  one million waviii tokens reside within the ERC-20 Token Swap
                  Smartcontract I deployed at this Ethereum Mainnet address:{" "}
                  <a href={ETHERSCAN_SWAP_URL} target="_blank" rel="noopener noreferrer">
                    [0x38abF018eA2f8…]
                  </a>
                  . The swap contract allows waviii tokens to be bought and sold
                  (exchanged) for real ETH at any time. With the hard coded exchange rate
                  discussed earlier, waviii tokens match and retain value pegged and in
                  fixed proportion to the current value of ETH and always will.
                </CardBody>
              </Card>
            </Col>
          </Row>
        </FadeIn>

        <FadeIn>
          <Row>
            <Col lg="12">
              <Card className="dex-card">
                <CardHeader>
                  <CardTitle tag="h4" className="waviii dex-section-title">
                    <span className="drop-item">decentralized</span>
                  </CardTitle>
                </CardHeader>
                <CardBody className="waviii-2">
                  The Smartcontracts powering this dApp reside on the Ethereum
                  blockchain, while all the application code and images are deployed to
                  the InterPlanetary FileSystem (IPFS) - Making this a fully decentralized
                  application (dApp).
                </CardBody>
              </Card>
            </Col>
          </Row>
        </FadeIn>
      </div>
    );
  }
}
