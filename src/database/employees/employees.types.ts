import { Document, Model } from "mongoose";
import { eROLE, eGENDER } from "./employees.schema";
export interface IEmployee {
  PERSONAL_DETAILS: {
    FULL_NAME: string;
    PHONE_NUMBER: string;
    BIRTH_DATE: string;
    AGE: number;
    LIFE_STATUS: string;
    ADDRESS: {
      STREET: string;
      CITY: string;
    };
    GENDER: eGENDER;
  };
  TECHNICAL_DETAILS: {
    EXTENSION: number;
    SERIAL_NUMBER: string;
    PASSWORD: string;
    TEAM: string;
    CONSTRAINTS: string;
    ROLE: eROLE;
    IS_ACTIVE: boolean;
  };

  EMPLOYMENT_DETAILS: {
    EMPLOYMENT_DATE: string;
    EMPLOYEE_LEFT?: {
      LEAVING_REASON: string;
      LEAVING_DATE: string;
    };
    SENIORITY: string;
    ISRAELI_ID: string;
    BANK_ACCOUNT: {
      BANK_ACC_NUMBER: string;
      BANK_ACC_BRANCH: string;
      BANK_NAME: string;
    };
    DIRECTED_BY?: {
      DIRECTED_BY: string;
      IS_PAYED: string;
    };
    INTERVIEWER: string;
    CONVALESCENCE: {
      HOW_MUCH?: string;
      DATE_OF_PAYMENT?: string;
      CONVALESCENCE_DATE: string;
      IS_PAYED: boolean;
    };
    PANSION: {
      PANSION_DATE: string;
      PANSION_COMMENT: string;
    };
    SALARY: string;
  };
  EMPLOYEE_COMMENT: string;
}
export interface IEmployeeDocument extends IEmployee, Document {
  whereToSearch: any;
}
export interface IEmployeeModel extends Model<IEmployeeDocument> {}
