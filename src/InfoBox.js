import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    padding: "8px",
  },
});
function InfoBox({ title, cases, total, type, selected }) {
  const classes = useStyles();
  return (
    <Card
      className={selected === type ? `infoBox infoBox__${type}` : "infoBox"}
      classes={{ root: classes.root }}
    >
      <CardContent classes={{ root: classes.root }}>
        <h5 className={`infoBox__title__${type}`}> {title} </h5>
        <p>
          {" "}
          <strong> + {numeral(cases).format("0a")} Today </strong>{" "}
        </p>
        <p> {numeral(total).format("0,0")} Total </p>
      </CardContent>
    </Card>
  );
}

InfoBox.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  cases: PropTypes.number,
  total: PropTypes.number,
  selected: PropTypes.string,
};

export default InfoBox;
