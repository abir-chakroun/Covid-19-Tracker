/* eslint-disable no-console */
import { Card, CardContent } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import sortData from "./util";
import Graph from "./Graph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [countryDetails, setCountryDetails] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryDetails(data);
          setCountry("Worldwide");
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const contries = data.map((item) => ({
            id: item.countryInfo.id,
            name: item.country,
            value: item.countryInfo.iso2,
          }));
          setCountries(contries);
          const sortedData = sortData(data);
          setTableData(sortedData);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);

  const handleChange = async (event) => {
    setCountry(event.target.value);
    const endpoint =
      event.target.value === "Worldwide"
        ? "v3/covid-19/all"
        : `v3/covid-19/countries/${event.target.value}`;
    await fetch(`https://disease.sh/${endpoint}`)
      .then((data) => data.json())
      .then((countryData) => {
        setCountryDetails(countryData);
        setMapCenter([
          countryData.countryInfo.lat,
          countryData.countryInfo.long,
        ]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__leftContainer">
        <div className="header">
          <h1 className="header__title"> COVID-19 Tracker</h1>
          <FormControl className="header__dropdown">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              variant="outlined"
              onChange={handleChange}
            >
              <MenuItem value="Worldwide"> Worldwide </MenuItem>
              {countries.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_statsInfo">
          <InfoBox
            title="Coronavirus cases"
            cases={countryDetails.todayCases}
            total={countryDetails.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryDetails.todayrecovered}
            total={countryDetails.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryDetails.todayDeaths}
            total={countryDetails.deaths}
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__rightContainer">
        <CardContent>
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          <h3>Live cases worldwide</h3>
          <Graph casesType="cases" />
        </CardContent>
      </Card>

      {/* graph */}
    </div>
  );
}

export default App;
