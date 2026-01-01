const { spawn } = require("child_process");

const child = spawn(
  "node",
  ["node_modules/next/dist/bin/next", "start"],
  { stdio: "inherit" }
);

child.on("close", (code) => process.exit(code));
