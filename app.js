const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

let db = null;
let client = null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder

// Connect to MongoDB
const connectDB = async () => {
  try {
    client = new MongoClient(
      "mongodb+srv://Sriman:sriman@cluster0.6n2b38d.mongodb.net/employees?retryWrites=true&w=majority&appName=Cluster0", 
      { tlsAllowInvalidCertificates: true }
    );
    
    await client.connect();
    db = client.db("employees");
    console.log("Connected to MongoDB Atlas successfully!");

  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    process.exit(1);
  }
};

// Route to serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "in.html"));
});

// Route to add an employee
app.post("/add-employee", async (req, res) => {
  const { name, position } = req.body;

  if (!name || !position) {
    return res.status(400).send("Name and position are required.");
  }

  try {
    await db.collection("employees").insertOne({ name, position });
    res.status(200).send("Employee added successfully");
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).send("Failed to add employee.");
  }
});

// Route to get the list of employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await db.collection("employees").find({}).toArray();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Failed to fetch employees.");
  }
});

// Start the server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
