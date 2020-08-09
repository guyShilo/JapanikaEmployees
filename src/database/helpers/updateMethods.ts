var moment = require("moment"); // require
moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};
// export const calculateSeniority: (employmentDate: string) => string = (
//   employmentDate: string
// ) => {
//   let today = new Date().toLocaleDateString();
//   let date = new Date(employmentDate);
//   console.log(date);
//   const convertDates = (date: string) => {
//     if (date.substr(4, 8).indexOf("/") !== -1 && employmentDate) {
//       return Number.parseInt(date.substr(5, 8).replace("/", ""));
//     } else {
//       return Number.parseInt(date.substr(5, 8));
//     }
//   };

//   const handleDateCheck = (date: string) => {
//     return date[0] === "0" ? null : "0" + date.substr(0, 1);
//   };

//   let todaysMonth = handleDateCheck(today);
//   let employmentMonth = handleDateCheck(employmentDate);

//   let dateToInteger = convertDates(today);
//   let employmentDateToInteger = convertDates(employmentDate);
//   console.log(
//     parseFloat(
//       String(
//         dateToInteger -
//           employmentDateToInteger +
//           (parseFloat(todaysMonth) - parseFloat(employmentMonth))
//       )
//     )
//   );
//   return String(
//     dateToInteger -
//       employmentDateToInteger +
//       (parseInt(todaysMonth) - parseInt(employmentMonth))
//   );
// };

export const calculateDateDiffrences = (
  numberToCheck: string,
  secondDate?: string
) => {
  // param 1 : EMP_DATE
  // param 2 : today
  let tempDate: string;
  if (secondDate) {
    tempDate = moment(secondDate, "DD/MM/YYYY");
  } else {
    tempDate = new Date().toLocaleDateString();
  }

  const todaysDate = moment(tempDate);
  const checkedDate = moment(numberToCheck, "DD/MM/YYYY");

  const years = todaysDate.diff(checkedDate, "years");
  todaysDate.add(-years, "years");

  const months = todaysDate.diff(checkedDate, "months");
  todaysDate.add(-months, "months");

  //   const days = checkedDate.diff(todaysDate, "days");
  var result = String(years) + "." + String(months);
  // console.log(todaysDate, checkedDate);
  return String(parseFloat(result));
};
// console.log(
//   calculateDateDiffrences(
//     moment(new Date().setFullYear(new Date().getFullYear() + 1)).format(
//       "DD/MM/YYYY"
//     )
//   )
// );

// console.log();
