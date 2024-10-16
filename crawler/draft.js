const axios = require('axios');
const { MongoClient } = require('mongodb');

async function fetchAndStoreMotoGPEvents() {
    const apiUrl = 'https://api.micheleberardi.com/racing/v1.0/motogp-events?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9&year=2024';
    const mongoUri = 'mongodb+srv://quannghiem100:iAAimy99vLhoZuAH@cluster0.thfyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB Atlas connection string
    const dbName = 'test'; // Replace with your database name
    const collectionName = 'calendars'; // Replace with your collection name

    try {
        // Fetch the data from the API
        const response = await axios.get(apiUrl);
        const events = response.data;

        // Extract only the desired fields
        const filteredEvents = events.map(event => ({
            id: event.id,
            sponsored_name: event.sponsored_name,
            date_end: event.date_end,
            date_start: event.date_start,
            name: event.name,
            season_id: event.season_id,
            year: event.year,
            circuit_name: event.circuit_name,
            country_name: event.country_name,
            short_name: event.short_name
        }));

        // Connect to MongoDB Atlas
        const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the filtered events into the collection
        if (Array.isArray(filteredEvents)) {
            await collection.insertMany(filteredEvents);
            console.log(`Inserted ${filteredEvents.length} documents into the collection`);
        } else {
            console.error('Filtered data is not an array');
        }

        // Close the connection
        await client.close();
        console.log('Connection to MongoDB Atlas closed');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
async function fetchAndStoreMotoGPRiders() {
    const apiUrl = 'https://api.micheleberardi.com/racing/v1.0/motogp-world-standing-riders?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9&year=2024&categoryid=e8c110ad-64aa-4e8e-8a86-f2f152f6a942';
    const mongoUri = 'mongodb+srv://quannghiem100:iAAimy99vLhoZuAH@cluster0.thfyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB Atlas connection string
    const dbName = 'test'; // Replace with your database name
    const collectionName = 'riders'; // Change to 'riders'

    try {
        // Fetch the data from the API
        const response = await axios.get(apiUrl);
        const riders = response.data;

        // Extract only the desired fields
        const filteredRiders = riders.map(rider => ({
            md5: rider.md5,
            id: rider.classification_id,
            constructor_name: rider.constructor_name,
            rider_country_iso: rider.rider_country_iso,
            name: rider.rider_full_name,
            year: rider.year,
            points: rider.points,
            position: rider.position,
            team_color: rider.team_color,
            text_color: rider.text_color
        }));

        // Connect to MongoDB Atlas
        const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the filtered riders into the collection
        if (Array.isArray(filteredRiders)) {
            await collection.insertMany(filteredRiders);
            console.log(`Inserted ${filteredRiders.length} documents into the collection`);
        } else {
            console.error('Filtered data is not an array');
        }

        // Close the connection
        await client.close();
        console.log('Connection to MongoDB Atlas closed');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the function
fetchAndStoreMotoGPRiders();

// Call the function
// fetchAndStoreMotoGPEvents();
