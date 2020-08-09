import { Request, Response, Router } from "express";
import { EmployeeModel } from "../employees/employees.model";
import EmployeeResolver from "../../database/employees/employees.methods";

const router: Router = require("express").Router();

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newE = await EmployeeResolver.prototype.createEmployee(data);
    res.json(newE);
    switch (data) {
      case "":
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
