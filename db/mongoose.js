// Database connection
const username = 'quannghiem100';
const password = 'iAAimy99vLhoZuAH';
const database = 'test';
const connectionString = `mongodb+srv://${username}:${password}@cluster0.thfyy.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;

const mongoose = require('mongoose');

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  });
  
  const db = mongoose.connection;
  db.on('error', (error) => console.error(error));
  db.once('open', () => console.log('Connected to Database ' + database));

module.exports = db
