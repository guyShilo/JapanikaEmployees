import { model } from "mongoose";
import { IEmployeeDocument } from "./employees.types";
import EmployeeSchema from "./employees.schema";
export const EmployeeModel = model<IEmployeeDocument>(
  "employee",
  EmployeeSchema
);
