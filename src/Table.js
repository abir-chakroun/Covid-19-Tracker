import React from "react";
import PropTypes from "prop-types";

import "./Table.css";

function Table({ countries }) {
  return (
    <div className="table">
      {countries?.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

Table.propTypes = {
  countries: PropTypes.string.isRequired,
};

export default Table;
