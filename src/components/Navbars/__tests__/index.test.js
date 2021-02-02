import { LazyLoadImage } from "react-lazy-load-image-component";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FadeIn from "react-fade-in";
import React from "react";

import AdminNavbar from "../AdminNavbar";


afterEach(cleanup);

describe("AdminNavbar View", () => {
  it("Component Renders", () => {
    render(<AdminNavbar />);
  });

  it("Images Lazy Load", () => {
    render(<LazyLoadImage />);
  });

  it("Components FadeIn", () => {
    render(<FadeIn />);
  });
});
