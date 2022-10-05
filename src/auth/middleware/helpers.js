module.exports = {
  isObjectEmpty,
  sortAsc,
  sortDesc,
  // filterSearch,
};

function isValidDate(date) {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function sortAsc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return a[columnName] - b[columnName];
    }

    if (isValidDate(a[columnName])) {
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
    }
    if (isValidDate(a[columnName])) {
      return b[columnName] - a[columnName];
    } else {
      return b[columnName].localeCompare(a[columnName]);
    }
  });
}
// http://localhost:5000/api/jobs?filter={"job_title":"job 3"}&range=[0,9]&sort=["id","ASC"]
// async function filterSearch(search, result) {
//   search = await JSON.parse(search);

//   // console.log("search ", search);
//   if (search.job_title) {
//     return result.filter((t) => {
//       search = search.job_title.toLowerCase().trim();
//       console.log("search ", search);
//       t = t.job_title.toLowerCase().trim();
//       console.log("result  ", t);
//       return search.job_title.includes(t.job_title);
//     });
//   }
// }
