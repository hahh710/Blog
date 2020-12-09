import React from "react";
import { Row, Col } from "reactstrap";
import logo from "../assets/Logo-467x108.png";

const Header = () => {
  //const logo= require(logo);
  return (
    <div id="page-header" className="mb-3">
      <Row>
        <Col md="6" sm="auto" className="text-center m-auto">
          <img
            className="logo"
            src={logo}
            alt="Hello"
            width="300px"
            height="80px"
          />
        </Col>
        <Col>
          {" "}
          <h1>Blog</h1>
          <p>my personal Blog</p>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
