import React from "react";
import PropTypes from "prop-types";

import { Card, CardContent } from "@material-ui/core";

function InfoBox({ title, cases, total, type }) {
  return (
    <Card className={`infoBox infoBox__${type}`}>
      <CardContent>
        <h5 className={`infoBox__title__${type}`}> {title} </h5>
        <p> {cases} Today </p>
        <p> {total} Total </p>
      </CardContent>
    </Card>
  );
}

InfoBox.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  cases: PropTypes.number,
  total: PropTypes.number,
};

export default InfoBox;
