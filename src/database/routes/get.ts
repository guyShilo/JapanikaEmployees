import { Request, Response, query } from "express";
import { EmployeeModel } from "../employees/employees.model";
import EmployeeResolver from "../../database/employees/employees.methods";
import { buildGeneralStatistics } from "../helpers/getMethods";
import { IEmployeeDocument } from "../employees/employees.types";
import { Query } from "mongoose";

interface IEmployeeFilters {}

const router = require("express").Router();
const _ = require("loadsh");

router.get("/query", async (req: Request, res: Response) => {
  /* 
  
  ##### Extracting the methods, query, and query values for easy use.
  
  */
  const Methods = EmployeeResolver.prototype;
  const Query = req.query;
  const QueryValues = Object.values(req.query);

  // Re-assigment of the object, to parse it.
  const queryObject = Object.assign(Query);

  console.info(
    `### I got a new query:\nQuery: ${queryObject},\nValues:${QueryValues}`
  );

  /* 

  
  ##### Returns a boolean based on the text value.

  */
  const isItBool = (stringParam: string) => {
    // Convert the string query to boolean.
    return stringParam.toString() === "true"
      ? true
      : req.params.query === "false" && false;
  };
  /* 

  ##### The initial array already filtered by active state.

  */
  let ExtractBasedOnActivity = await Methods.getEmployeesByActiveState(
    isItBool(String(queryObject.IS_ACTIVE))
  );
  /* 

  */
  if (queryObject.hasOwnProperty("GET_STATISTICS")) {
    console.log(await buildGeneralStatistics());
    res.json(await buildGeneralStatistics());
  } else {
    res.json(
      await handleQueryChain(queryObject, ExtractBasedOnActivity, Methods)
    );
  }
});

router.get("", async (req: Request, res: Response) => {
  try {
    const emp = await EmployeeModel.find();
    res.json(emp);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    res.json({
      employee,
    });
  } catch (error) {
    console.log(error);
  }
});

const handleQueryChain = async (query, array, Methods) => {
  /* 
  <----> 
  The if chain below is made to get the initial array, and...
  ... to filter it based on each query, this is how i get generic query.
  <---->
  */
  if (query.TEAM) {
    /* 
##### Filters the initial array to get employees filtered by team.
*/
    array = await Methods.getEmployeesByTeam(array, query.TEAM);
  }
  if (query.EMPLOYMENT_DATE) {
    /* 
##### Filters the initial array to get employees filtered by employment date.
*/
    array = await Methods.getEmployeesByEmploymentDate(
      array,
      query.EMPLOYMENT_DATE
    );
  }
  if (query.AGE) {
    /* 
##### Splits the query, i want to search range of ages.
##### Filters the initial array to get employees filtered by two ages.
*/
    const age = query.AGE.split(",");
    const startAge = age[0];
    const endAge = age[1];
    array = await Methods.getEmployeesByAge(array, startAge, endAge);
  }
  if (query.CONSTRAINTS) {
    /* 
##### Filters the initial array to get employees filtered by constraints.
*/
    array = await Methods.getEmployeesByConstraints(array, query.CONSTRAINTS);
  }
  if (query.BIRTH_MONTH) {
    /* 
##### Filters the initial array to get employees filtered by constraints.
*/
    array = await Methods.getEmployeesByBirthMonth(array, query.BIRTH_MONTH);
  }

  return array;
};

module.exports = router;

// if (QueryLength > 1) {
//   switch (Query) {
//     case IS_ACTIVE:
//       // Convert the string query to boolean.
//       const idToBool =
//         QueryValues.toString() === "true"
//           ? true
//           : req.params.query === "false" && false;
//       res.json(await Methods.getEmployeesByActiveState(idToBool));
//       break;

//     case "TEAM":
//       res.json(await Methods.getEmployeesByTeam(QueryValues.toString()));
//       break;

//     case "ADDRESS":
//       // If the query is address, split it to array.
//       const Address =
//         Query === "ADDRESS" ? QueryValues.toString().split(", ") : [];

//       res.json(await Methods.getEmployeesByAddress(Address));
//       break;

//     case "AGE":
//       const ages = QueryValues.toString().split(",");
//       res.json(await Methods.getEmployeesByAge(ages[0], ages[1]));
//       break;

//     case "GET_STATISTICS":
//       res.json(await buildGeneralStatistics());
//       break;
//   }

//   //  if there is no query, return all employees.
// } else if (QueryLength < 2) {
//   console.log("many querys");
// } else {
// }

// version Two

// for (const key in Query) {
//     if (Query.hasOwnProperty(key)) {
//       const value = Query[key];
//       switch (key) {
//         case "IS_ACTIVE":
//           const byActiveState = Methods.getEmployeesByActiveState(
//             isItBool(value)
//           );
//           emptyArray.push(await byActiveState);
//           break;
//         case "TEAM":
//           const byTeam = Methods.getEmployeesByTeam(value.toString());
//           emptyArray.push(await byTeam);
//           break;
//         case "ADDRESS":
//           // If the query is address, split it to emptyArray.
//           const Address = key === "ADDRESS" ? value.toString().split(", ") : [];
//           const byAddress = Methods.getEmployeesByAddress(Address);
//           emptyArray.push(await byAddress);
//           break;
//         case "AGE":
//           const ages = value.toString().split(",");
//           const byAge = Methods.getEmployeesByTeam(value.toString());
//           emptyArray.push(await byAge);
//           break;
//         case "GET_STATISTICS":
//           res.json(await buildGeneralStatistics());
//           break;
//       }
//     }
//   }
//   const arraySorter = (arr: any[]) => {
//     console.log(Query.TEAM);
//     const arrayToClient = [];
//     _.filter(arr, (arr) => {
//       arr.map((val) => {
//         for (const key in Query) {
//           if (Query.hasOwnProperty(key)) {
//             const element = Query[key];
//             // key === "IS_ACTIVE" ? isItBool(Query.IS_ACTIVE) : false;
//             // key === "ADDRESS" ? isItBool(Query.IS_ACTIVE) : false;
//             console.log(element, key);
//             if (
//               val.key == Query.key &&
//               val.IS_ACTIVE == isItBool(Query.IS_ACTIVE) &&
//               val.ADDRESS.CITY == Query.ADDRESS.split(", ")[1]
//             ) {
//               arrayToClient.push(val);
//             }
//           }
//         }
//       });
//     });

//     return arrayToClient;
//   };
//   return _.uniq(arraySorter(emptyArray));

// export const ExecuteSwitch = async (
//   Query: any,
//   Methods: EmployeeResolver,
//   data: IEmployeeDocument[],
//   req: Request,
//   res: Response
// ) => {
//   const isItBool = (stringParam: string) => {
//     // Convert the string query to boolean.
//     return stringParam.toString() === "true"
//       ? true
//       : req.params.query === "false" && false;
//   };
//   const ExtractBasedOnActivity = await Methods.getEmployeesByActiveState(
//     isItBool(Query.IS_ACTIVE)
//   );
//   // const ExtractBasedOnActivity = async () =>
//   //   emptyArray.push(
//   //     await Methods.getEmployeesByActiveState(isItBool(Query.IS_ACTIVE))
//   //   );
//   const ExtractBasedOnTeam = async () =>
//     ExtractBasedOnActivity.filter(
//       (employee: IEmployeeDocument) =>
//         employee.TECHNICAL_DETAILS.TEAM.indexOf(Query.TEAM) !== -1
//     );
//   const ExtractBasedOnEmploymentDate = async () => {
//     ExtractBasedOnActivity.filter(
//       (employee: IEmployeeDocument) =>
//         employee.EMPLOYMENT_DETAILS.EMPLOYMENT_DATE == Query.EMPLOYMENT_DATE
//     );
//     // if (Query.IS_ACTIVE) {
//     //   ExtractBasedOnActivity();
//     // }
//     if (Query.TEAM) {
//       console.log("team if ");
//       await ExtractBasedOnTeam();
//     }
//     if (Query.EMPLOYMENT_DATE) {
//       console.log("team if ");
//       await ExtractBasedOnEmploymentDate();
//     }
//   };
//   console.log(Query.TEAM);
//   return _.uniq(ExtractBasedOnActivity);
// };
