import dotenv from "dotenv";
import app from "./app.js";
import localIP from "./api/utils/getIp.js";

dotenv.config();

console.log("IP: ", localIP);
const PORT = process.env.PORT;
const HOSTNAME = localIP || "localhost";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at: http://${HOSTNAME}:${PORT}`);
});
