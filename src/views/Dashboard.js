import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import FadeIn from "react-fade-in";

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
import { fade } from "@material-ui/core";

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
                      <h5 className="card-category">2020 - 2021</h5>
                      <CardTitle tag="h2" className="waviii">waviii price</CardTitle>
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
            <Col lg="6" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="waviii">waviii token</CardTitle>
                </CardHeader>
                <FadeIn>
                <CardBody>
                  <p className="waviii2">waviii has a fixed exchange rate of 1/100 with ETH. </p>
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
