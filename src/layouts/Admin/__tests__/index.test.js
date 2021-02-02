import { LazyLoadImage } from "react-lazy-load-image-component";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FadeIn from "react-fade-in";
import React from "react";

// import Admin from "../Admin";


afterEach(cleanup);

describe("Admin View", () => {
//  it("Component Renders", () => {
//    render(<Admin />);
//  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Components FadeIn", () => {
    render(<FadeIn />);
  });
});
