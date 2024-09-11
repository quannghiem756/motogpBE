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
app.use('/calendar', calendarRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.post('/calendar', (req, res) => {
    // res.send('This works!')
    // res.send(req.body)
    const newCalendar = new Calendar(req.body);
    newUser.save()
    .then(resp => {
        res.send(resp);
    })
    .catch(error => {
        res.send(error);
    })
})