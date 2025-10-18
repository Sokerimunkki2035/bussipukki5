import serverless from "serverless-http";
import app from "../../api/index";

// Wrap Express app with serverless-http for Netlify Functions
export const handler = serverless(app);
