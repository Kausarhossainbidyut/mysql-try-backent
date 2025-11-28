const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());
app.use(cors());

// MySQL Connection with better error handling
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "bidyut", 
    database: "crud_db"
    // port: process.env.DB_PORT,
  });

// CREATE
app.post("/students", async(req, res) => {
  const { name, email, department } = req.body;
  console.log("Received student data:", name, email, department);
  try {
    await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      department VARCHAR(255)
    )
    `)
  
  await db.query("INSERT INTO students (name,email, department) VALUES (?, ?, ?)", [name, email, department]);
    return res.status(200).json({ message: "Student Created" });
  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ error: "Failed to create student", details: err.message });
  }
});

// READ
app.get("/students", async(req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch students", details: err.message });
  }
  
});

// UPDATE
app.put("/students/:id", async(req, res) => {
  const { id } = req.params;
  const { name, email, department } = req.body;
  try {
    await db.query("UPDATE students SET name=?, email=?, department=? WHERE id=?", [name, email, department, id]);
    return res.status(200).json({ message: "Student Updated" });
  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ error: "Failed to update student", details: err.message });
  }
});

// DELETE
app.delete("/students/:id", async(req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM students WHERE id=?", [id]);
    return res.status(200).json({ message: "Student Deleted" });
  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ error: "Failed to delete student", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});