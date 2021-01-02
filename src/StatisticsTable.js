import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import numeral from "numeral";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import SearchIcon from "@material-ui/icons/Search";
import sortData from "./util";
import { Popover } from "react-tiny-popover";
import ClearIcon from "@material-ui/icons/Clear";
import "./StatisticsTable.css";
import axios from "axios";
const useStyles = makeStyles({
  root: {
    marginTop: "30px",
  },
  centerText: {
    textAlign: "center",
    zIndex: 0,
  },
  indexText: {
    zIndex: 0,
  },
  whiteIcon: {
    color: "#fff",
  },
  clearButton: {
    fontSize: "14px",
    color: "#797979",
  },
  tableContainer: {
    marginBottom: "40px",
  },
});

const continentsList = [
  { _id: 0, continent: "North America" },
  { _id: 1, continent: "Asia" },
  { _id: 2, continent: "Europe" },
  { _id: 3, continent: "Africa" },
  { _id: 4, continent: "Australia/Oceania" },
];

function StatisticsTable({ countries }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortUp, setsortUp] = useState(true);
  const [sortedData, setSortedData] = useState([]);
  const [search, setSearch] = useState("");
  const [continents, setContinents] = useState(continentsList);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const sortedData = sortData(countries, sortUp);
    setSortedData(sortedData);
  }, [countries, sortUp]);

  const handleSearch = async (event) => {
    setSearch(event.target.value);
    setPopoverOpen(true);
  };

  const handleSelectContinent = async (continent) => {
    let updatedSearchList = [...searchList];
    if (searchList.indexOf(continent) === -1) {
      updatedSearchList.push(continent);
      setSearchList(updatedSearchList);
    }
  };

  useEffect(() => {
    //render all searched items upon select or delete item from search box
    if (searchList.length === 0) {
      const finalCountries = sortData(countries, sortUp);
      setSortedData(finalCountries);
    } else {
      let updatedSortedData = [];
      searchList.forEach(async (elem, i) => {
        let sortedDataCountry = countries.find((item) => item.country === elem);
        if (!sortedDataCountry) {
          // in case it's a continent
          let continentName =
            elem === "Australia/Oceania"
              ? "Australia%2FOceania?strict=true"
              : elem;
          await fetch(
            `https://disease.sh/v3/covid-19/continents/${continentName}`
          )
            .then((data) => data.json())
            .then(async (continentData) => {
              //fetch every country's data
              Promise.all(
                continentData.countries.map(async (item) => {
                  await axios
                    .get(`https://disease.sh/v3/covid-19/countries/${item}`)
                    .then((countryData) => {
                      item = countryData.data;
                    });
                  return item;
                })
              ).then((list) => {
                if (searchList.length > 1) {
                  updatedSortedData = updatedSortedData.concat(
                    list.filter((item) => sortedData.indexOf(item) === -1)
                  );
                  const finalCountries = sortData(updatedSortedData, sortUp);
                  setSortedData(finalCountries);
                } else {
                  const finalCountries = sortData(list, sortUp);
                  setSortedData(finalCountries);
                }
              });
            });
        } else {
          updatedSortedData.push(sortedDataCountry);
          const finalCountries = sortData(updatedSortedData, sortUp);
          setSortedData(
            finalCountries.filter((item, i) => {
              return finalCountries.indexOf(item) === i;
            })
          );
        }
      });
    }
  }, [searchList]);

  const handleDeleteSearchItem = async (selectedItem) => {
    let updatedSearchList = searchList.filter((item) => {
      return item !== selectedItem;
    });
    setSearchList(updatedSearchList);
  };

  const handleSelectCountry = (country) => {
    let updatedSearchList = [...searchList];
    if (searchList.indexOf(country) === -1) {
      updatedSearchList.push(country);
      setSearchList(updatedSearchList);
    }
  };

  useEffect(() => {
    const filteredContinents = continentsList.filter((item) => {
      return item.continent.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    setContinents(filteredContinents);

    const filteredCountries = countries.filter((item) => {
      return item.country.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    const finalCountries = sortData(filteredCountries, sortUp);
    setSortedData(finalCountries);
  }, [search, countries, sortUp]);

  const formatData = (value) => {
    return numeral(value).format("0,0");
  };

  const classes = useStyles();
  const countriesSearchList = search.length > 0 ? sortedData : countries;
  const currentPage = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Paper className={classes.root}>
      <div className="table__header">
        <h3>Live cases per Country</h3>
        <div className="table__header__right">
          <div className="table__header__searchbox">
            <Popover
              isOpen={popoverOpen}
              positions={["bottom"]}
              align="center"
              padding={5}
              onClickOutside={() => setPopoverOpen(false)}
              content={
                <div className="select__search">
                  <h3> Regions</h3>
                  {continents.map((row, index) => {
                    return (
                      <MenuItem
                        key={index}
                        onClick={() => handleSelectContinent(row.continent)}
                      >
                        {row.continent}{" "}
                      </MenuItem>
                    );
                  })}
                  <h3> Countries </h3>
                  {countriesSearchList.map((row, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleSelectCountry(row.country)}
                    >
                      {row.country}{" "}
                    </MenuItem>
                  ))}
                </div>
              }
            >
              <form autoComplete="off">
                <input
                  list="select"
                  name="select"
                  placeholder="Search by Country or Region"
                  maxLength="200"
                  onChange={handleSearch}
                  onClick={() => setPopoverOpen(true)}
                  value={search}
                  autoComplete="off"
                />
                <div></div>
              </form>
            </Popover>
            <button>
              <SearchIcon className={classes.whiteIcon} />
            </button>
          </div>

          {sortUp ? (
            <button
              className="table__header__sort"
              onClick={() => setsortUp(!sortUp)}
            >
              {" "}
              <ArrowDownwardIcon className={classes.whiteIcon} />{" "}
            </button>
          ) : (
            <button
              className="table__header__sort"
              onClick={() => setsortUp(!sortUp)}
            >
              {" "}
              <ArrowUpwardIcon className={classes.whiteIcon} />{" "}
            </button>
          )}
        </div>
      </div>
      <div className="table__header__searchbox__filterBox">
        {searchList.map((selected, index) => (
          <div className="table__header__searchbox__filter" key={index}>
            {selected}
            <button onClick={() => handleDeleteSearchItem(selected)}>
              <ClearIcon className={classes.clearButton} />
            </button>
          </div>
        ))}
      </div>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.indexText}>Country </TableCell>
              <TableCell className={classes.indexText}> Population </TableCell>
              <TableCell className={classes.centerText}>
                {" "}
                Cases - total
              </TableCell>
              <TableCell className={classes.centerText}>
                Cases - newly reported today
              </TableCell>
              <TableCell className={classes.centerText}>
                {" "}
                Deaths - total
              </TableCell>
              <TableCell className={classes.centerText}>
                Deaths - newly reported today
              </TableCell>
              <TableCell className={classes.centerText}>
                Recovered - total
              </TableCell>
              <TableCell className={classes.centerText}>
                Recovered - newly reported today
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPage.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <img
                    src={row.countryInfo?.flag}
                    alt="flag"
                    height="20px"
                    width="30px"
                    style={{ marginRight: "5px" }}
                  />
                  {row.country}
                </TableCell>
                <TableCell>{numeral(row.population).format("0.0a")}</TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.cases)}
                </TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.todayCases)}
                </TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.deaths)}
                </TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.todayDeaths)}
                </TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.recovered)}
                </TableCell>
                <TableCell className={classes.centerText}>
                  {formatData(row.todayRecovered)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPagelis={[10, 25, 50]}
                colSpan={3}
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}

StatisticsTable.propTypes = {
  countries: PropTypes.array.isRequired,
};

export default StatisticsTable;
