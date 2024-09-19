const express = require("express")
const path = require("path")
const calendarRouter  = require("./routes/calendarController");
const riderRouter  = require("./routes/riderController");
const teamRouter  = require("./routes/teamController");
const imageRouter = require("./routes/imageController");
require('./db/mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use(riderRouter);
app.use(calendarRouter);
app.use(teamRouter);
app.use(imageRouter);

// Start server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;

