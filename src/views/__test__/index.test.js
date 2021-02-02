import { LazyLoadImage } from "react-lazy-load-image-component";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FadeIn from "react-fade-in";
import React from "react";

import Dashboard from "../Dashboard";
import 'jest-canvas-mock';
import Wallet from "../wallet";
import Swap from "../swap";
// import BuySell from "../BuySell";

afterEach(cleanup);

describe("Dashboard View", () => {
  it("Component Renders", () => {
    render(<Dashboard />);
  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Components FadeIn", () => {
    render(<FadeIn />);
  });
});

describe("Wallet View", () => {
  it("Component Renders", () => {
    render(<Wallet />);
  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Compnents FadeIn", () => {
    render(<FadeIn />);
  });
});

describe("Swap View", () => {
  it("Component Renders", () => {
    render(<Swap />);
  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Components FadeIn", () => {
    render(<FadeIn />);
  });
});

describe("BuySell View", () => {
//  it("Component Renders", () => {
//    render(<BuySell />);
//  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Components FadeIn", () => {
    render(<FadeIn />);
  });
});
