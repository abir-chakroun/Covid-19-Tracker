import { Card, CardContent } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [contryDetails, setCountryDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const contries = data.map((country) => ({
            id: country.countryInfo.id,
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          console.log(contries);
          setCountries(contries);
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
        console.log(countryData);
        setCountryDetails(countryData);
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
              <MenuItem value={"Worldwide"}>{"Worldwide"}</MenuItem>
              {countries.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_statsInfo">
          <InfoBox title="Coronavirus cases" cases="1200" total="1.2M" />
          <InfoBox title="Recovered" cases="1500" total="1M" />
          <InfoBox title="Deaths" cases="3000" total="0.2M" />
        </div>
        <Map />
      </div>

      <Card className="app__rightContainer">
        <CardContent>
          <h3>Live cases by Country</h3>
          <h3>Live cases worldwide</h3>
        </CardContent>
      </Card>

      {/* graph */}
    </div>
  );
}

export default App;
