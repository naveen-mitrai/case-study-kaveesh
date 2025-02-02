import serverless from "serverless-http";
import express from "express";
import router from "./presentation/routes";

const app = express();
app.use(express.json());
app.use("/api", router);

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
};
