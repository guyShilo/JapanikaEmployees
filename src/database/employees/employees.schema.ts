import { Schema } from "mongoose";
import { EmployeeModel } from "./employees.model";
import { calculateDateDiffrences } from "../helpers/updateMethods";
var uuid = require("node-uuid");

export enum eROLE {
  levelOne,
  levelTwo,
  levelThree,
  levelFour,
}

export enum eGENDER {
  male = "זכר",
  female = "נקבה",
}

enum PANSION {}

const EmployeeSchema = new Schema({
  PERSONAL_DETAILS: {
    FULL_NAME: { type: String },
    PHONE_NUMBER: { type: String },
    BIRTH_DATE: { type: String },
    AGE: { type: Number },
    LIFE_STATUS: { type: String },
    ADDRESS: {
      STREET: { type: String },
      CITY: { type: String },
    },
    GENDER: { type: eGENDER },
  },
  TECHNICAL_DETAILS: {
    EXTENSION: { type: Number },
    SERIAL_NUMBER: { type: String },
    PASSWORD: { type: String },
    TEAM: { type: String },
    CONSTRAINTS: { type: String },
    ROLE: { type: eROLE },
    IS_ACTIVE: { type: Boolean },
  },
  EMPLOYMENT_DETAILS: {
    EMPLOYMENT_DATE: { type: String },
    EMPLOYEE_LEFT: {
      required: false,
      type: {
        LEAVING_REASON: { type: String },
        LEAVING_DATE: { default: new Date().toLocaleDateString() },
      },
    },
    SENIORITY: { type: String },
    ISRAELI_ID: { type: String },
    BANK_ACCOUNT: {
      type: {
        BANK_ACC_NUMBER: { type: String },
        BANK_ACC_BRANCH: { type: String },
        BANK_NAME: { type: String },
      },
    },
    DIRECTED_BY: {
      type: {
        DIRECTED_BY: { type: String },
        IS_PAYED: { type: String },
      },
    },
    INTERVIEWER: { type: String },
    CONVALESCENCE: {
      HOW_MUCH: { type: String },
      DATE_OF_PAYMENT: { type: String },
      CONVALESCENCE_DATE: { type: String },
      IS_PAYED: { type: Boolean },
    },
    PANSION: {
      PANSION_DATE: { type: String },
      PANSION_COMMENT: { type: String },
    },
    SALARY: { type: String },
  },
  EMPLOYEE_COMMENT: { type: String },
});

export default EmployeeSchema;

// {
//   FULL_NAME: { type: String },
//   PHONE_NUMBER: { type: String },
//   BIRTH_DATE: { type: String },
//   AGE: { type: Number },
//   EXTENSION: { type: Number },
//   SERIAL_NUMBER: { type: String },
//   PASSWORD: { type: String },
//   TEAM: { type: String },
//   CONSTRAINTS: { type: String },
//   LIFE_STATUS: { type: String },
//   ADDRESS: {
//     type: {
//       STREET: { type: String },
//       CITY: { type: String },
//     },
//   },
//   EMPLOYMENT_DATE: { type: String },
//   IS_ACTIVE: { type: Boolean },
//   EMPLOYEE_LEFT: {
//     required: false,
//     type: {
//       LEAVING_REASON: { type: String },
//       LEAVING_DATE: { default: new Date().toLocaleDateString() },
//     },
//   },
//   SENIORITY: { type: String },
//   ISRAELI_ID: { type: String },
//   BANK_ACCOUNT: {
//     type: {
//       BANK_ACC_NUMBER: { type: String },
//       BANK_ACC_BRANCH: { type: String },
//       BANK_NAME: { type: String },
//     },
//   },
//   DIRECTED_BY: {
//     type: String,
//   },
//   CONVALESCENCE: { type: String },
//   PANSION: {
//     type: {
//       PANSION_DATE: { type: String },
//       PANSION_COMMENT: { type: String },
//     },
//   },
//   EMPLOYEE_COMMENT: { type: String },
//   SALARY: {type: String},
//   ROLE: {type: String},
//   INTERVIEWER: {type: String},
// }
