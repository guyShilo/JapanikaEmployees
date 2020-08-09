import { Request, Response, Router } from "express";
import { EmployeeModel } from "../employees/employees.model";
const router: Router = require("express").Router();

router.delete("/", async (req: Request, res: Response) => {
  return res.json("this is a remove request");
});

module.exports = router;
