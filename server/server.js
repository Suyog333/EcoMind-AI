const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

app.get("/", (req, res) => {
    res.send("EcoMind Backend Running");
});

app.post("/save-activity", (req, res) => {
    const { transport, distance, electricity, food, plastic, totalCarbon } = req.body;

    const sql = `
        INSERT INTO activities 
        (transport, distance, electricity, food, plastic, totalCarbon)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [transport, distance, electricity, food, plastic, totalCarbon],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send("Error saving data");
            } else {
                res.send("Activity saved successfully");
            }
        }
    );
});

app.get("/get-latest-activity", (req, res) => {
    const sql = `
        SELECT * FROM activities
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error fetching data");
        } else {
            res.json(result[0]);
        }
    });
});

app.get("/ai-suggestion", (req, res) => {
    const sql = `
        SELECT * FROM activities
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        } else {
            let activity = result[0];
            let suggestions = [];

            if (activity.transport === "Car") {
                suggestions.push("Use public transport or carpool.");
            }

            if (activity.electricity > 4) {
                suggestions.push("Reduce electricity usage.");
            }

            if (activity.food === "Non-Veg") {
                suggestions.push("Try plant-based meals.");
            }

            if (activity.plastic > 1) {
                suggestions.push("Avoid single-use plastic.");
            }

            res.json(suggestions);
        }
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});