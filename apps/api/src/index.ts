import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { initializeFirebase } from "./config/firebase.js";

const env = loadEnv();
initializeFirebase();
const app = createApp();

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});
