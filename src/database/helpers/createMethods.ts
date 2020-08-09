import { IEmployeeDocument } from "../employees/employees.types";
import { EmployeeModel } from "../employees/employees.model";
import { calculateDateDiffrences } from "./updateMethods";
const moment = require("moment");

export const handleDirectedBy = async (
  directedBy: string,
  isPayed: string,
  refree: string
) => {
  console.log(`Directed By: ${directedBy}`);
  if (directedBy == "חבר מביא חבר") {
    return {
      DIRECTED_BY: refree,
      IS_PAYED: "",
    };
  }
};

export const handleConvalescense = async (employmentDate: string) => {
  const CONVALESCENCE = {
    CONVALESCENCE_DATE: calculateDateDiffrences(
      employmentDate,
      await moment(new Date().setFullYear(new Date().getFullYear() + 1)).format(
        "DD/MM/YYYY"
      )
    ),
    IS_PAYED: false,
  };
  console.log(`employmentDate: ${Object.values(CONVALESCENCE)}`);

  if (CONVALESCENCE.IS_PAYED) {
    return { ...CONVALESCENCE, HOW_MUCH: "", DATE_OF_PAYMENT: "" };
  } else return CONVALESCENCE;
};

export const handlePansions = async (
  gender: string,
  age: string,
  employmentDate: string
) => {
  const momentInstance = moment(employmentDate, "DD/MM/YYYY");

  console.log(momentInstance.add(1, "year"));
  if (gender === "זכר" && parseInt(age) >= 21) {
    return {
      PANSION_DATE: "",
      PANSION_COMMENT: "",
    };
  } else if (gender === "נקבה" && parseInt(age) >= 20) {
    return {
      PANSION_DATE: "",
      PANSION_COMMENT: "",
    };
  }
};

export const handleLeavingEmployee = async (
  isActive: boolean,
  leavingReason: string
) => {
  console.log(`leaving: ${isActive} + ${leavingReason} `);

  if (!isActive) {
    return {
      LEAVING_REASON: leavingReason,
      LEAVING_DATE: await moment(new Date().toLocaleDateString()).format(
        "DD/MM/YYYY"
      ),
    };
  }
};
