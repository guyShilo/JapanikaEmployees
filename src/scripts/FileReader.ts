const parser = require("node-xlsx");
const file = parser.parse("src/scripts/format.xlsx");
const sheets = file[0];
const moment = require("moment");
import { calculateDateDiffrences } from "../database/helpers/updateMethods";

const rows = [];
for (const cell of sheets.data) {
  //   const stringCell = cell.toString();
  if (cell !== null) {
    rows.push(cell);
  }
}

export const table: any = [];

const createPhoneNumber = (phone: string) => {
  if (!phone) {
    return phone;
  }
  if (phone.indexOf("-") !== -1) {
    return phone;
  } else {
    const oneToThree = phone.substring(0, 3);
    const ThreeToSeven = phone.substring(3, 6);
    const SevenToTen = phone.substring(6, 11);
    return `${oneToThree}-${ThreeToSeven}-${SevenToTen}`;
  }
};

function getJsDateFromExcel(excelDate: number) {
  // JavaScript dates can be constructed by passing milliseconds
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1  (Google "excel leap year bug")
  // 2. Convert to milliseconds.

  const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000)
    .toLocaleDateString()
    .split("/");
  const modifiedDate = `${date[1].length < 2 ? "0" + date[1] : date[1]}/${
    date[0].length < 2 ? "0" + date[0] : date[0]
  }/${date[2]}`;
  return modifiedDate;
}

export const calculateAge: (birthDate: string) => string = (
  birthDate: string
) => {
  let today = new Date();
  const convertDates = (date: string) => {
    if (date.substr(4, 8).indexOf("/") !== -1 && birthDate) {
      return Number.parseInt(date.substr(5, 8).replace("/", ""));
    } else {
      return Number.parseInt(date.substr(5, 8));
    }
  };

  let dateToInteger = convertDates(today.toLocaleDateString());
  let birthDateToInteger = convertDates(birthDate);
  const finalDate = calculateDateDiffrences(birthDate);

  return finalDate;
};

rows.forEach((row, index) => {
  if (row[0] !== "FULL_NAME" && row[0]) {
    table.push({
      PERSONAL_DETAILS: {
        FULL_NAME: row[0].trim("") || "",
        PHONE_NUMBER: createPhoneNumber(row[1]) || "",
        BIRTH_DATE:
          getJsDateFromExcel(row[2]).toLocaleString().split(", ")[0] || "",
        AGE:
          calculateDateDiffrences(
            getJsDateFromExcel(row[2]).toLocaleString().split(", ")[0]
          ) || "",
        LIFE_STATUS: row[8] || "",
        ADDRESS: {
          STREET: row[9].split(", ")[0] || "",
          CITY: row[9].split(", ")[1] || "",
        },
        GENDER: row[19] || "",
      },
      TECHNICAL_DETAILS: {
        EXTENSION: row[3] || 0,
        SERIAL_NUMBER: row[4] || "",
        PASSWORD: row[5] || "",
        TEAM: row[6] || "",
        CONSTRAINTS: row[7] || "",
        ROLE: 0,
        IS_ACTIVE: row[11] || false,
      },
      EMPLOYMENT_DETAILS: {
        EMPLOYMENT_DATE:
          getJsDateFromExcel(row[10]).toLocaleString().split(", ")[0] || "",
        SENIORITY: calculateDateDiffrences(
          getJsDateFromExcel(row[10]).toLocaleString().split(", ")[0]
        ),
        ISRAELI_ID: row[12] || "",
        BANK_ACCOUNT: {
          BANK_ACC_NUMBER: row[13] || "",
          BANK_ACC_BRANCH: row[14] || "",
          BANK_NAME: row[15] || "",
        },
        DIRECTED_BY: row[16],
        INTERVIEWER: row[17],
        CONVALESCENCE: row[18],
        PANSION: row[19],
        SALARY: row[21] || "",
      },
      EMPLOYEE_COMMENT: "",
    });
  }
});
// gender,
// PERSONAL_DETAILS: {
//   FULL_NAME: {  },
//   PHONE_NUMBER: {  },
//   BIRTH_DATE: {  },
//   AGE: { type: Number },
//   LIFE_STATUS: {  },
//   ADDRESS: {
//     STREET: {  },
//     CITY: {  },
//   },
// },
// TECHNICAL_DETAILS: {
//   EXTENSION: { type: Number },
//   SERIAL_NUMBER: {  },
//   PASSWORD: {  },
//   TEAM: {  },
//   CONSTRAINTS: {  },
//   IS_ACTIVE: { type: Boolean },
// },
// EMPLOYMENT_DETAILS: {
//   EMPLOYMENT_DATE: {  },
//   EMPLOYEE_LEFT: {
//     required: false,
//     type: {
//       LEAVING_REASON: {  },
//       LEAVING_DATE: { default: new Date().toLocaleDateString() },
//     },
//   },
//   SENIORITY: {  },
//   ISRAELI_ID: {  },
//   BANK_ACCOUNT: {
//     type: {
//       BANK_ACC_NUMBER: {  },
//       BANK_ACC_BRANCH: {  },
//       BANK_NAME: {  },
//     },
//   },
//   DIRECTED_BY: {
//     ,
//   },
//   INTERVIEWER: {  },
//   CONVALESCENCE: {  },
//   PANSION: {
//     PANSION_DATE: {  },
//     PANSION_COMMENT: {  },
//   },
//   SALARY: {  },
// },
// EMPLOYEE_COMMENT: {  },
// ROLE: { type: ROLE },

import { EmployeeModel } from "../database/employees/employees.model";
import { connect, disconnect } from "../database/database";
import EmployeeResolver from "../database/employees/employees.methods";

// (async () => {
//   connect();
//   const employees = table;
//   try {
//     // for (const employee of employees) {
//     //   await EmployeeModel.create(employee);
//     //   console.log(
//     //     `Created employee ${employee.firstName} ${employee.lastName}`
//     //   );
//     // }
//     console.log(EmployeeResolver);
//     disconnect();
//   } catch (e) {
//     console.error(e);
//   }
// })();

// const trimAddress: (
//   address: string
// ) => string | { street: string; city: string } = (address: string) => {
//   if (address) {
//     let addressArray = address.split(", ");
//     return JSON.stringify({
//       street: addressArray[0],
//       city: addressArray[1],
//     });
//   }
//   return "";
// };

// {
//   FULL_NAME: row[0].trim("") || "",
//   PHONE_NUMBER: createPhoneNumber(row[1]) || "",
//   BIRTH_DATE:
//     getJsDateFromExcel(row[2]).toLocaleString().split(", ")[0] || "",
//   AGE:
//     calculateDateDiffrences(
//       getJsDateFromExcel(row[2]).toLocaleString().split(", ")[0]
//     ) || "",
//   EXTENSION: row[3] || 0,
//   SERIAL_NUMBER: row[4] || "",
//   PASSWORD: row[5] || "",
//   TEAM: row[6] || "",
//   CONSTRAINTS: row[7] || "",
//   LIFE_STATUS: row[8] || "",
//   ADDRESS: {
//     STREET: row[9].split(", ")[0] || "",
//     CITY: row[9].split(", ")[1] || "",
//   },
//   EMPLOYMENT_DATE:
//     getJsDateFromExcel(row[10]).toLocaleString().split(", ")[0] || "",
//   IS_ACTIVE: row[11] || false,
//   ISRAELI_ID: row[12] || "",
//   BANK_ACCOUNT: {
//     [headers[13]]: row[13] || "",
//     [headers[14]]: row[14] || "",
//     [headers[15]]: row[15] || "",
//   },
//   DIRECTED_BY: row[16] || "",
//   CONVALESCENCE: row[17] || "",
//   PANSION: {
//     PANSION_DATE: "",
//     COMMENT: "",
//   },
// },

// 0FULL_NAME
// 1PHONE_NUMBER
// 2BIRTH_DATE
// 3AGE
// 4 || real 3 EXTENSION
// 4SERIAL_NUMBER
// 5PASSWORD
// 6TEAM
// 7CONSTRAINTS
// 8LIFE_STATUS
// 9ADDRESS
// 10EMPLOYMENT_DATE
// 11IS_ACTIVE
// 12ISRAELI_ID
// 13BANK_ACC_NUMBER
// 14BANK_ACC_BRANCH
// 15BANK_NAME
