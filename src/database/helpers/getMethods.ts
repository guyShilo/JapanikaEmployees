import { IEmployeeDocument } from "../employees/employees.types";
import { EmployeeModel } from "../employees/employees.model";
import e = require("express");

export const buildGeneralStatistics = async () => {
  const employees = await EmployeeModel.find();

  const employeesStatistics = {
    totalDBLength: employees.length,
    activeEmployees: employees.filter(
      (employee) => employee.TECHNICAL_DETAILS.IS_ACTIVE === true
    ).length,
    unActiveEmployees: employees.filter(
      (employee) => employee.TECHNICAL_DETAILS.IS_ACTIVE === false
    ).length,
  };

  const teamStatistics = {
    teamsCount: buildFilters(employees, "TECHNICAL_DETAILS", "TEAM")[1],
    teams: buildFilters(employees, "TECHNICAL_DETAILS", "TEAM")[0],
  };

  const ageStatistics = {
    agesCount: buildFilters(employees, "PERSONAL_DETAILS", "AGE")[1],
    ages: buildFilters(employees, "PERSONAL_DETAILS", "AGE")[0],
  };

  const constraintsStatistics = {
    constraintsCount: buildFilters(
      employees,
      "TECHNICAL_DETAILS",
      "CONSTRAINTS"
    )[1],
    constraints: buildFilters(employees, "TECHNICAL_DETAILS", "CONSTRAINTS")[0],
  };

  return {
    employeesStatistics,
    teamStatistics,
    ageStatistics,
    constraintsStatistics,
  };
};

/* 
  
  ##### This function is meant to build the array the way i like,
  in order to present it right at ClientSide.
  
  */
const buildFilters = (employeesArray, whereToSearch, searchParameter) => {
  let filters = employeesArray.map(
    (employee) => employee[whereToSearch][searchParameter]
  );
  // removing duplicated and converting back to array
  const convertToSet = new Set(filters);
  filters = [...convertToSet];
  // build an array of objects, sorted by each team
  const filtersAndCount = filters.map((age, index) => {
    return {
      [filters[index]]: employeesArray.filter(
        (employee) => employee[whereToSearch][searchParameter] == filters[index]
      ),
    };
  });
  // counting how many employees are the same age
  const buildCounter = () => {
    const stats = [];
    for (let index = 0; index < filtersAndCount.length; index++) {
      const element = filtersAndCount[index];
      stats.push({
        [Object.keys(element)[0]]: Object.keys(element)[0].length,
      });
    }
    return stats;
  };
  // returning all of the above || teams,
  return [filters, buildCounter()];
};
