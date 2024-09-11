// Database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quannghiem100:iAAimy99vLhoZuAH@cluster0.thfyy.mongodb.net/motogp?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  });
  
  const db = mongoose.connection;
  db.on('error', (error) => console.error(error));
  db.once('open', () => console.log('Connected to Database'));

