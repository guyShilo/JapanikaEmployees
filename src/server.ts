import * as express from "express";
import { connect } from "./database/database";
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5002;
connect();
app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`.toUpperCase());
});

const remove = require("./database/routes/remove");

const get = require("./database/routes/get");
app.use("/employees", get);

const create = require("./database/routes/create");
app.use("/employees", create);

const update = require("./database/routes/update");
app.use("/employees", update);

// app.use("/employees", update);
// app.use("/employees", remove);
