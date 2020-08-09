import { Document } from "mongoose";
import { IEmployeeDocument } from "./employees.types";
import { EmployeeModel } from "./employees.model";
import { calculateAge, table } from "../../scripts/FileReader";
import { calculateDateDiffrences } from "../helpers/updateMethods";
import {
  handlePansions,
  handleConvalescense,
  handleDirectedBy,
  handleLeavingEmployee,
} from "../helpers/createMethods";
const moment = require("moment");
/* 
  
  ##### ALL HELPER METHODS DOWN BELOW .
  ##### THIS CLASS HOLDS ALL THE METHODS
  
*/

class EmployeeResolver {
  /* 
  
  
  ##### Create new employee.
  
  
  
  */
  async createEmployee(
    options: IEmployeeDocument,
    multipleOptions?: IEmployeeDocument[]
  ) {
    await isAlreadyRegistered(options)
      .then(async (isExist) => {
        if (isExist && options!.PERSONAL_DETAILS.FULL_NAME !== null) {
          return `${
            options!.PERSONAL_DETAILS.FULL_NAME
          } is already registered.`;
        } else {
          const pansions = handlePansions(
            options.PERSONAL_DETAILS.GENDER,
            calculateDateDiffrences(options.PERSONAL_DETAILS.BIRTH_DATE),
            options.EMPLOYMENT_DETAILS.EMPLOYMENT_DATE
          );

          const convalescence = handleConvalescense(
            options.EMPLOYMENT_DETAILS.EMPLOYMENT_DATE
          );
          // console.log(options.EMPLOYMENT_DETAILS.DIRECTED_BY);
          const directed = handleDirectedBy(
            options.EMPLOYMENT_DETAILS.DIRECTED_BY.toString(),
            options.EMPLOYMENT_DETAILS.DIRECTED_BY.IS_PAYED,
            ""
          );

          options.PERSONAL_DETAILS.AGE = parseInt(
            calculateAge(
              options.PERSONAL_DETAILS.BIRTH_DATE.toLocaleString().split(
                ", "
              )[0]
            )
          );
          if (!options.TECHNICAL_DETAILS.IS_ACTIVE) {
            options.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT = await handleLeavingEmployee(
              options.TECHNICAL_DETAILS.IS_ACTIVE,
              ""
            );
            options.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT = {
              LEAVING_REASON:
                options.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT?.LEAVING_REASON,
              LEAVING_DATE: await moment(
                new Date().toLocaleDateString()
              ).format("DD/MM/YYYY"),
            };
          }
          options.EMPLOYMENT_DETAILS.SENIORITY = calculateDateDiffrences(
            options.EMPLOYMENT_DETAILS.EMPLOYMENT_DATE
          );
          console.log(
            `####### Pansions: ${Object.values(
              pansions
            )}\n ##### Convalescence: ${Object.values(
              convalescence
            )}\n ##### Directed By: ${Object.values(directed)}`
          );
          options.EMPLOYMENT_DETAILS.PANSION = await pansions;
          options.EMPLOYMENT_DETAILS.CONVALESCENCE = await convalescence;
          options.EMPLOYMENT_DETAILS.DIRECTED_BY = await directed;
          try {
            const employee = await EmployeeModel.create(options);
            return employee;
          } catch (error) {
            setTimeout(() => {
              console.log(`Creating employee error: ${error}`);
            }, 2000);
            throw new Error(error);
          }
        }
      })
      .catch((err) => console.warn(err));
  }
  /* 
  
  
  ##### Updating an employee.
  
  
  
  */
  async updateEmployee(_id: string, input: IEmployeeDocument) {
    console.log(_id);
    const toBeUpdated = await EmployeeModel.findOne({ _id });
    if (
      input.PERSONAL_DETAILS.BIRTH_DATE &&
      input.PERSONAL_DETAILS.BIRTH_DATE !==
        toBeUpdated?.PERSONAL_DETAILS.BIRTH_DATE
    ) {
      const newAge = calculateAge(
        input.PERSONAL_DETAILS.BIRTH_DATE.toLocaleString().split(", ")[0]
      );
      input.PERSONAL_DETAILS.AGE = parseInt(newAge);
    }
    if (input.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT) {
      input.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT.LEAVING_DATE = new Date().toLocaleDateString();
    } else if (
      input.TECHNICAL_DETAILS.IS_ACTIVE &&
      toBeUpdated.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT
    ) {
      input.EMPLOYMENT_DETAILS.EMPLOYEE_LEFT = null;
    }
    try {
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
        { _id },
        input
      );
      return updatedEmployee;
    } catch (error) {
      setTimeout(() => {
        console.log(`Update employee error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Removing an employee.
  
  
  
  */
  async deleteEmployee(id: string) {
    try {
      const deletedEmployee = await EmployeeModel.remove({ id });
      return deletedEmployee;
    } catch (error) {
      setTimeout(() => {
        console.log(`Delete Employee error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by team.
  
  
  
  */
  async getEmployeesByTeam(array: IEmployeeDocument[], team: string) {
    try {
      const employees = array;
      return employees.filter(
        (employee) => employee.TECHNICAL_DETAILS.TEAM === team
      );
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Team Name error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by address.
  
  
  
  */
  async getEmployeesByAddress(address: string[]) {
    try {
      const employees = await EmployeeModel.find();

      return employees.filter((employee) => {
        const employeeAddress = Object.values(
          employee.PERSONAL_DETAILS.ADDRESS
        );
        return (
          employeeAddress[0] === address[0] && employeeAddress[1] === address[1]
        );
      });
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Address error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by name.
  
  
  
  */
  async getEmployeesByName(name: string) {
    try {
      const employees = await EmployeeModel.find();
      return employees.filter((employee) =>
        employee.PERSONAL_DETAILS.FULL_NAME.includes(name)
      );
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Name error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by constraints.
  
  
  
  */
  async getEmployeesByConstraints(
    array: IEmployeeDocument[],
    empConstraints: string
  ) {
    try {
      const employees = array;
      console.log(empConstraints);
      return employees.filter(
        (employee) =>
          employee.TECHNICAL_DETAILS.CONSTRAINTS.indexOf(empConstraints) !== -1
      );
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Constraints error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by active state.
  
  
  
  */
  async getEmployeesByActiveState(isActive: boolean) {
    try {
      const employees = await EmployeeModel.find();
      return employees.filter(
        (employee) => employee.TECHNICAL_DETAILS.IS_ACTIVE === isActive
      );
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Active state error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /*

  
  ##### Filter employees by the name of the bank they are registered on.
  
  
  
  */
  async getEmployeesByBankName(bankName: string) {
    try {
      const employees = await EmployeeModel.find();
      return employees.filter(
        (employee) =>
          employee.EMPLOYMENT_DETAILS.BANK_ACCOUNT.BANK_NAME === bankName
      );
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Bank Name error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /*
  
  
  ##### Filter employees by the their employment date.
  
  
  
  */
  async getEmployeesByEmploymentDate(
    array: IEmployeeDocument[],
    empDate: string
  ) {
    try {
      const employees = array;
      return employees.filter((employee) => {
        const employmentMonth = employee.EMPLOYMENT_DETAILS.EMPLOYMENT_DATE.substring(
          3,
          5
        );
        return employmentMonth === empDate;
      });
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Employment Date error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /*
  
  
  ##### Filter employees by the their birth month.
  
  
  
  */
  async getEmployeesByBirthMonth(array: IEmployeeDocument[], month: string) {
    try {
      const employees = array;
      return employees.filter((employee) => {
        const birthMonth = employee.PERSONAL_DETAILS.BIRTH_DATE.substring(3, 5);
        return birthMonth === month;
      });
    } catch (error) {
      setTimeout(() => {
        console.log(`Filtering by Employment Date error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Filter employees by age.
  
  
  
  */
  async getEmployeesByAge(
    array: IEmployeeDocument[],
    startAge: string,
    endAge: string
  ) {
    try {
      const employees = array;
      const employeesByAge: IEmployeeDocument[] = employees.filter(
        (employee) =>
          employee.PERSONAL_DETAILS.AGE < parseInt(endAge) &&
          employee.PERSONAL_DETAILS.AGE > parseInt(startAge)
      );
      return employeesByAge;
    } catch (error) {
      throw new Error(error);
    }
  }
  /* 
  
  
  ##### Get all employees.
  
  
  
  */
  async getAllEmployees() {
    try {
      const employees = await EmployeeModel.find();
      return employees;
    } catch (error) {
      setTimeout(() => {
        console.log(`Get all employees error: ${error}`);
      }, 2000);
      throw new Error(error);
    }
  }
}

const isAlreadyRegistered: (
  employee: IEmployeeDocument
) => Promise<boolean> = async (employee: IEmployeeDocument) => {
  let isExist = false;
  try {
    const allEmployees = await EmployeeModel.find();
    allEmployees.filter((emp) => {
      if (
        emp.TECHNICAL_DETAILS.SERIAL_NUMBER ===
        employee.TECHNICAL_DETAILS.SERIAL_NUMBER
      ) {
        isExist = true;
        console.log(
          `${emp.TECHNICAL_DETAILS.SERIAL_NUMBER} is already a serial number taken by ${emp.PERSONAL_DETAILS.FULL_NAME}. \n${employee.PERSONAL_DETAILS.FULL_NAME} cannot be created`
        );
      }
    });
  } catch (error) {
    console.warn(error);
  }
  return isExist;
};

// (async () => {
//   const employees = table;
//   try {
//     for (const employee of employees) {
//       await EmployeeResolver.prototype.createEmployee(employee);
//     }
//   } catch (e) {
//     console.error(e);
//   }
// })();

export default EmployeeResolver;
