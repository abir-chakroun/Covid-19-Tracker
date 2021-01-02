import React, { useEffect } from "react";
import { Popup, CircleMarker, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import "./Map.css";
function Map({ center, zoom, countries, type }) {
  const map = useMap();

  useEffect(() => {
    map.setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    map.panTo(center);
  }, [center, map]);

  const multiplier = type === "recovered" ? 50 : type === "deaths" ? 10 : 60;
  const colorType =
    type === "recovered"
      ? "#50c964"
      : type === "deaths"
      ? " #e20808"
      : "#5957c9";

  return (
    <div>
      {countries.map((country) => {
        const variableType =
          type === "recovered"
            ? country.recovered
            : type === "deaths"
            ? country.deaths
            : country.cases;
        return (
          <CircleMarker
            center={[country.countryInfo.lat, country.countryInfo.long]}
            pathOptions={{ color: colorType }}
            radius={Math.sqrt(variableType) * (1 / multiplier)}
          >
            <Popup>
              <div className="map__popup__row">
                <img
                  src={country.countryInfo.flag}
                  alt="flag"
                  height="25px"
                  width="40px"
                />
              </div>
              <div className="map__popup__row">
                <h6> Country: </h6>
                <p style={{ margin: "5px 0" }}> {country.country} </p>
              </div>

              <div className="map__popup__row">
                <h6> {`Total ${type}`} </h6>
                <p style={{ margin: "5px 0" }}> {variableType}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </div>
  );
}

Map.propTypes = {
  zoom: PropTypes.number.isRequired,
  center: PropTypes.array.isRequired,
  countries: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};
export default Map;
