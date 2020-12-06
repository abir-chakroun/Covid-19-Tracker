/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

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
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
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
          // Include a dollar sign in the ticks
          callback: function (value) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint = 0;
  const appendItem =
    casesType === "cases"
      ? data.cases
      : casesType === "recovered"
      ? data.recovered
      : data.deaths;

  // eslint-disable-next-line guard-for-in
  // eslint-disable-next-line no-restricted-syntax
  for (let date in appendItem) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: appendItem[date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = appendItem[date] - lastDataPoint;
  }
  return chartData;
};

function Graph({ casesType }) {
  const [lineData, setlineData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setlineData(chartData);
        });
    }
    fetchData();
  }, [casesType]);
  return (
    <div>
      {lineData?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5",
                borderColor: "#CC1034",
                data: lineData,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

Graph.propTypes = {
  casesType: PropTypes.string.isRequired,
};

export default Graph;
