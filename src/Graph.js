import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { Alert } from "@material-ui/lab";
import numeral from "numeral";
import "./Graph.css";
import Card from "@material-ui/core/Card";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem) {
        return numeral(tooltipItem.value).format("0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        distribution: "series",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            if (value % 1000000 === 0) return numeral(value).format("0a");
            else return numeral(value).format("0.0a");
          },
        },
      },
    ],
  },
};
const buildChartData = (data, casesType) => {
  /* extract the difference to display in tooltips */
  let chartData = [];
  const filteredData =
    casesType === "cases"
      ? data.cases
      : casesType === "recovered"
      ? data.recovered
      : data.deaths;
  for (let date in filteredData) {
    const newDataPoint = {
      x: date,
      y: filteredData[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

function Graph({ country, casesType }) {
  const [lineData, setlineData] = useState([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    setAlert("");
    async function fetchData() {
      const endpoint =
        country === "Worldwide"
          ? "v3/covid-19/historical/all?lastdays=62"
          : `v3/covid-19/historical/${country}`;
      await fetch(`https://disease.sh/${endpoint}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setAlert(data.message);
          } else {
            const timelineData =
              country === "Worldwide" ? data : data?.timeline;

            const chartData = buildChartData(timelineData, casesType);
            setlineData(chartData);
          }
        });
    }
    fetchData();
  }, [casesType, country]);

  return (
    <div>
      {lineData?.length > 0 && (
        <Card className="linegraph">
          <h2>
            Coronavirus cases{" "}
            {country === "Worldwide" ? "Worldwide" : `in ${country}`} in the
            last {"2 months"}
          </h2>
          {alert.length > 0 ? (
            <Alert severity="info">{alert}</Alert>
          ) : (
            <Line
              options={options}
              data={{
                datasets: [
                  {
                    backgroundColor:
                      casesType === "deaths"
                        ? "rgba(226, 8, 8, 0.5)"
                        : casesType === "recovered"
                        ? "rgba(80, 201, 100, 0.5)"
                        : "rgba(89, 87, 201, 0.5)",
                    borderColor:
                      casesType === "deaths"
                        ? "rgba(226, 8, 8)"
                        : casesType === "recovered"
                        ? "rgba(80, 201, 100)"
                        : "rgba(89, 87, 201)",
                    data: lineData,
                  },
                ],
              }}
            />
          )}
        </Card>
      )}
    </div>
  );
}

Graph.propTypes = {
  casesType: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
};

export default Graph;
