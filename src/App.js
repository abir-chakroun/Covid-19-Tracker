import React, { useState, useEffect } from "react";
import { TileLayer, MapContainer, Marker } from "react-leaflet";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import StatisticsTable from "./StatisticsTable";
import Graph from "./Graph";
import "leaflet/dist/leaflet.css";
/* display marker on Map */
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryDetails, setCountryDetails] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [type, setType] = useState("cases");

  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryDetails(data);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const structredCountries = data.map((item) => ({
            id: item.countryInfo.id,
            name: item.country,
            value: item.countryInfo.iso2,
          }));
          setCountries(structredCountries);
          setMapCountries(data);
          setTableData(data);
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
        if (event.target.value === "Worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
        } else {
          setMapCenter([
            countryData.countryInfo.lat,
            countryData.countryInfo.long,
          ]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div>
      <div className="app">
        <div className="header">
          <h1 className="header__title"> COVID-19 Tracker</h1>
          <div className="header__dropdown">
            <select value={country} onChange={handleChange}>
              <option value="Worldwide"> Worldwide </option>
              {countries.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="app__content__container">
          <div className="app__leftContainer">
            {mapCountries?.length > 0 && (
              <div className="map">
                <MapContainer
                  zoom={mapZoom}
                  center={mapCenter}
                  scrollWheelZoom={false}
                  minZoom={1}
                  maxZoom={7}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                    type={type}
                  />
                  {country !== "Worldwide" && (
                    <Marker position={mapCenter}> </Marker>
                  )}
                </MapContainer>
              </div>
            )}
          </div>
          <div className="app__rightContainer">
            <div className="app_statsInfo">
              <div
                onClick={() => {
                  setType("cases");
                }}
              >
                <InfoBox
                  title="Coronavirus cases"
                  cases={countryDetails.todayCases}
                  total={countryDetails.cases}
                  type="cases"
                />
              </div>
              <div
                onClick={() => {
                  setType("recovered");
                }}
              >
                {" "}
                <InfoBox
                  title="Recovered"
                  cases={countryDetails.todayRecovered}
                  total={countryDetails.recovered}
                  type="recovered"
                />
              </div>
              <div
                onClick={() => {
                  setType("deaths");
                }}
              >
                <InfoBox
                  title="Deaths"
                  cases={countryDetails.todayDeaths}
                  total={countryDetails.deaths}
                  type="deaths"
                />
              </div>
            </div>
            <Graph country={country} casesType={type} />
          </div>
        </div>

        <StatisticsTable countries={tableData} />
      </div>
      <div className="footer">
        <p>&copy;{new Date().getFullYear()} Abir Chakroun</p>
      </div>
    </div>
  );
}

export default App;
