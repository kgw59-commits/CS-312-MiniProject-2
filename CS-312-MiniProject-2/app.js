const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Set EJS as our view engine
app.set("view engine", "ejs");

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// Serve CSS and other static files
app.use(express.static("public"));


// Home page
app.get("/", (req, res) => {
    res.render("index");
});


// Search for exercises
app.get("/exercises", async (req, res) => {
    try {
        const { muscle, equipment, level } = req.query;

        // External API Request - returns exercise info and filters
        const response = await axios.get(
            "https://api.kinetic.place/v1/exercises",
            {
                params: {
                    muscle: muscle,
                    equipment: equipment,
                    level: level,
                    limit: 20
                }
            }
        );

        res.render("results", {
            exercises: response.data.data,
            error: null
        });

    } catch (error) {
        console.error(error.message);

        res.render("results", {
            exercises: [],
            error: "Unable to retrieve exercises. Please try again."
        });
    }
});


// View one specific exercise
app.get("/exercise/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Request information for one specific exercise
        const response = await axios.get(
            `https://api.kinetic.place/v1/exercises/${id}`
        );

        res.render("exercise", {
            exercise: response.data
        });

    } catch (error) {
        console.error(error.message);

        res.status(404).send("Exercise not found.");
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});