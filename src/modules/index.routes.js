import { globalError } from "../middleware/globalError.js";
import accountRouter from "./account/account.routes.js";
import labelRouter from "./label/label.routes.js";
import transactionRouter from "./transaction/transaction.routes.js";

import userRouter from "./user/user.routes.js";

export const bootstrap = (app) => {


  app.use("/api/v1/users",userRouter);
  app.use("/api/v1/labels",labelRouter);
  app.use("/api/v1/accounts",accountRouter);
  app.use("/api/v1/transactions",transactionRouter);


  app.get('/',(req,res)=>res.send("Welcome to Expenses Tracker Server please select any of available Endpoints"))

  app.use(globalError);
};
  