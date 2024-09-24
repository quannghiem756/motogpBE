const express = require("express")
const path = require("path")
const calendarRouter  = require("./routes/calendarController");
const riderRouter  = require("./routes/riderController");
const teamRouter  = require("./routes/teamController");
const imageRouter = require("./routes/imageController");
require('./db/mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(riderRouter);
app.use(calendarRouter);
app.use(teamRouter);
app.use(imageRouter);

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '/build')));

// Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/build', 'index.html'));
// });

// Start server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;

