import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(join(__dirname, "../../../serviceAccountKey.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://sdn-motel-imageupload.appspot.com",
});

export default admin;
