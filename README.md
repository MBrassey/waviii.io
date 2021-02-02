## waviii.io

Fully Decentralized ERC-20 Token, Wallet, Exchange & Price Chart. React frontend deployed to IPFS, Solidity Smartcontracts deployed to Ethereum Mainnet & Price Chart with CoinGecko RESTful API integration. I set out to build my own real-world cryptocurrency, wallet and exchange and **so it is**.

[![licensebadge](https://img.shields.io/badge/license-CC0_1.0_Universal-blue)](https://github.com/MBrassey/waviii.io/blob/main/LICENSE)
[![time tracker](https://wakatime.com/badge/github/MBrassey/waviii.io.svg)](https://wakatime.com/@532855a8-3081-4600-a53d-4262beb65d14/projects/vnkbpbfjis?start=2021-01-24&end=2021-02-02)

#### Issues

- [x] [Setup Initial App](https://github.com/MBrassey/waviii.io/issues/1)
- [x] [Style, React Animations & Update Text Data](https://github.com/MBrassey/waviii.io/issues/2)
- [x] [Fetch & Display waviii Price / Minify SCSS](https://github.com/MBrassey/waviii.io/issues/3)
- [x] [Re-factor & Fetch waviii Price and Chart Data Directly](https://github.com/MBrassey/waviii.io/issues/4)
- [x] [Stylize, IPFS Routing & Handle Errors](https://github.com/MBrassey/waviii.io/issues/5)
- [x] [Media Queries / Locked Views](https://github.com/MBrassey/waviii.io/issues/6)
- [x] [Unit Test, Create Readme & Deploy](https://github.com/MBrassey/waviii.io/issues/7)

#### Table of Contents

- [SmartContracts](#SmartContracts)
- [IPFS](#IPFS)
- [CoinGeko](#CoinGeko)
- [Requirements](#Requirements)
- [Installation](#Installation)
- [Usage](#Usage)
- [Demo](#Demo)
- [Questions](#Questions)
- [License](#License)

> Application Preview
> [<img src="src/assets/img/Preview.png">](https://waviii.io/)

#### SmartContracts

waviii.io is powered by two smartcontracts,

#### IPFS

waviii.io's codebase is setup with continuous deployment to three platforms: Heroku, GitHub Pages and Fleek (IPFS). On Fleek, the images, text, styles and javascript are all hosted on the InterPlanetary FileSystem (IPFS) in a fully decentralized way. In connjunction with the Ethereum SmartContract backend, waviii.io is a dApp (Decentralized Application). As there is no central point of failure or central point of management, the dApp is highly redundant as well as highly censorship resistant. I have plans to deploy waviii.io as waviii.crypto to decentralize it's DNS as well thgough unstoppable domains. 

- [x] [waviii on Heroku]()
- [x] [waviii on GitHub Pages]()
- [x] [waviii on Fleek (IPFS)](https://waviii.on.fleek.co/)

#### CoinGeko

I decided to use the CoinGecko's cryptocurrency API through RapidAPI for my chart data and current waviii price. Since waviii has a 100/1 fixed exchange rate with ETH, I simply performed this calculation inline while defining the datapoints as shown below.

    getCurrentPrice = () => {
    var options = {
      method: "GET",
      url: "https://coingecko.p.rapidapi.com/simple/price",
      params: { ids: "ethereum", vs_currencies: "usd" },
      headers: {
        "x-rapidapi-key": "e450825ad3mshaa208fa97b50bb4p17c097jsn38f8f54e39a1", // MBrassey
        "x-rapidapi-host": "coingecko.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        this.setState({ loading: true });
        const ETH = response.data.ethereum.usd;
        const raw = ETH / 100;
        const waviii = raw.toFixed(2);
        const max_num = waviii * 1.1 ;
        this.setState({ max: max_num });
        this.setState({ price: waviii });
        const month = `${moment().format("MMM")}`;
        this.setState({ month: month.toUpperCase() });
        this.setState({ loading: false });
      })
      .catch(function (error) {
        console.error(error);
      });
    };

#### Requirements

    node
    npm

#### Installation

    npm i

#### Usage

    npm run start
    npm run test (optional)
    browse: localhost:3001/

<h6><p align="right">:cyclone: Click the image(s) below to view the live <a id="Demo" href="https://waviii.io/">wabapplication</a></p></h6>

> Video
> [<img src="src/assets/img/Video.png">](https://waviii.io/)

> Demo
> [<img src="src/assets/img/Demo.gif">](https://waviii.io/)

> Setup
> [<img src="src/assets/img/Setup.gif">](https://waviii.io/)

> Test
> [<img src="src/assets/img/Test.gif">](https://waviii.io/)

> Project Development Statistics
> [<img src="src/assets/img/Workload.svg">](https://wakatime.com/@532855a8-3081-4600-a53d-4262beb65d14/projects/vnkbpbfjis?start=2021-01-24&end=2021-02-02)

#### Questions

Contact me at [matt@brassey.io](mailto:matt@brassey.io) with any questions or comments.

#### License

`waviii.io` is published under the **CC0_1.0_Universal** license.

> The Creative Commons CC0 Public Domain Dedication waives copyright interest in a work you've created and dedicates it to the world-wide public domain. Use CC0 to opt out of copyright entirely and ensure your work has the widest reach. As with the Unlicense and typical software licenses, CC0 disclaims warranties. CC0 is very similar to the Unlicense.
