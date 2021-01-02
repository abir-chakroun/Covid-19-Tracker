const sortData = (data, sort) => {
  const sortedData = [...data];
  if (sort) return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  else return sortedData.sort((a, b) => (a.cases < b.cases ? -1 : 1));
};

export default sortData;
