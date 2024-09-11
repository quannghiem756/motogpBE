const express = require("express")
const path = require("path")
const calendarRouter  = require("./routes/calendarController");
const Calendar = require('./models/Calendar');
require('./db/mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use(calendarRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

