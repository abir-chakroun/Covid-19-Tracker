import React from "react";
import { Card, CardContent } from "@material-ui/core";

function InfoBox({ title, cases, total }) {
  return (
    <Card className="infoBox">
      <CardContent>
        <h5 className="infoBox__title"> {title} </h5>
        <h6 className="infoBox__cases"> {cases} </h6>
        <h6 className="infoBox__total"> {total} Total </h6>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
