import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import PropTypes from "prop-types";

function Map({ center, zoom }) {
  return (
    <div className="map">
      <LeafletMap zoom={zoom} center={center}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    </div>
  );
}

Map.propTypes = {
  zoom: PropTypes.string.isRequired,
  center: PropTypes.string.isRequired,
};
export default Map;
