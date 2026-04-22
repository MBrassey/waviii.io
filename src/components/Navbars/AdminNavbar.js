import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
} from "reactstrap";
import logo from "../../assets/img/MBrassey-Logo.png";
import { useWallet } from "../../providers/WalletProvider";
import { shortAddress, chainName, MAINNET_CHAIN_ID } from "../../utils/wallet";

export default function AdminNavbar(props) {
  const w = useWallet();
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [color, setColor] = useState("navbar-transparent");

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 993 && collapseOpen) setColor("bg-white");
      else setColor("navbar-transparent");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [collapseOpen]);

  const toggleCollapse = () => {
    setColor(collapseOpen ? "navbar-transparent" : "bg-white");
    setCollapseOpen(!collapseOpen);
  };

  const renderWalletControls = () => {
    if (!w || !w.hasProvider) {
      return (
        <a
          className="dex-btn dex-btn-primary dex-nav-btn"
          href="https://metamask.io/download.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Wallet
        </a>
      );
    }
    if (!w.account) {
      return (
        <button
          className="dex-btn dex-btn-primary dex-nav-btn"
          onClick={w.connect}
          disabled={w.status === "connecting"}
        >
          {w.status === "connecting" ? "Connecting…" : "Connect Wallet"}
        </button>
      );
    }
    const wrong = w.chainId && w.chainId !== MAINNET_CHAIN_ID;
    return (
      <>
        <button
          type="button"
          className={`dex-net-pill ${wrong ? "is-wrong" : ""}`}
          onClick={wrong ? w.switchMainnet : undefined}
          title={wrong ? "Switch to Ethereum" : "Ethereum Mainnet"}
        >
          <span className="dex-net-dot" />
          <span>{chainName(w.chainId)}</span>
        </button>
        <a
          className="dex-account-chip dex-mono"
          href={`https://etherscan.io/address/${w.account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {shortAddress(w.account)}
        </a>
      </>
    );
  };

  return (
    <Navbar className={classNames("navbar-absolute", color)} expand="lg">
      <Container fluid>
        <div className="navbar-wrapper">
          <div
            className={classNames("navbar-toggle d-inline", {
              toggled: props.sidebarOpened,
            })}
          >
            <button
              className="navbar-toggler"
              type="button"
              onClick={props.toggleSidebar}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href="#" onClick={(e) => e.preventDefault()}>
            {props.brandText}
          </NavbarBrand>
        </div>

        <button
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-target="#navigation"
          data-toggle="collapse"
          id="navigation"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button>

        <Collapse navbar isOpen={collapseOpen}>
          <Nav className="ml-auto dex-nav-controls" navbar>
            <div className="dex-nav-wallet">{renderWalletControls()}</div>

            <UncontrolledDropdown nav className="d-none d-lg-flex">
              <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <div className="photo dex-nav-photo">
                  <img alt="MBrassey" src={logo} />
                </div>
                <b className="caret d-none d-lg-block d-xl-block" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-navbar" right tag="ul">
                <NavLink tag="li">
                  <a href="https://www.linkedin.com/in/MBrassey">
                    <DropdownItem className="nav-item">
                      <span className="waviii drop-item">LinkedIn</span>
                    </DropdownItem>
                  </a>
                </NavLink>
                <NavLink tag="li">
                  <a href="https://github.com/MBrassey">
                    <DropdownItem className="nav-item">
                      <span className="waviii drop-item">GitHub</span>
                    </DropdownItem>
                  </a>
                </NavLink>
                <DropdownItem divider tag="li" />
                <NavLink tag="li">
                  <a href="https://brassey.io">
                    <DropdownItem className="nav-item">
                      <span className="waviii drop-item">Portfolio</span>
                    </DropdownItem>
                  </a>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>

            <li className="dex-mobile-menu d-lg-none">
              <div className="dex-profile">
                <div className="dex-profile-photo">
                  <img src={logo} alt="MBrassey" />
                </div>
                <div className="dex-profile-name waviii">MBrassey</div>
              </div>
              <a
                href="https://www.linkedin.com/in/MBrassey"
                className="dex-mobile-link"
              >
                <span className="waviii">LinkedIn</span>
              </a>
              <a
                href="https://github.com/MBrassey"
                className="dex-mobile-link"
              >
                <span className="waviii">GitHub</span>
              </a>
              <a href="https://brassey.io" className="dex-mobile-link">
                <span className="waviii">Portfolio</span>
              </a>
            </li>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
