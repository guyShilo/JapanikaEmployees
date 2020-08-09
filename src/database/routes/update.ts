import { Request, Response, Router } from "express";
import { EmployeeModel } from "../employees/employees.model";
import EmployeeResolver from "../../database/employees/employees.methods";

const router: Router = require("express").Router();

router.put("/", async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await EmployeeResolver.prototype.updateEmployee(
      req.body._id,
      req.body
    );
    res.json(updatedEmployee);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
