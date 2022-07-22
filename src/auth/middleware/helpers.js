module.exports = {
  isObjectEmpty,
  sortAsc,
  sortDesc,
};

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function sortAsc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return a[columnName] - b[columnName];
    } else {
      return a[columnName].localeCompare(b[columnName]);
    }
  });
}

function sortDesc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return b[columnName] - a[columnName];
    } else {
      return b[columnName].localeCompare(a[columnName]);
    }
  });
}
