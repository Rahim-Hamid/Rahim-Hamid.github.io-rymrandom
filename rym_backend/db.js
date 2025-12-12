import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./rym.db", (err) => {
  if (err) console.error("Failed to connect to SQLite:", err);
  else console.log("Connected to rym.db");
});

export default db;