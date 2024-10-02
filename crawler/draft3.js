const mongoose = require('mongoose');
const Calendar = require('../models/Calendar');
const Session = require('../models/Session');
const Result = require('../models/Result');
require('../db/mongoose')


const generateMockData = async () => {
    try {
        // Clear existing data
        await Calendar.deleteMany({});
        await Session.deleteMany({});
        await Result.deleteMany({});

        // Example raw calendar data
        const calendars = [
            {
                sponsored_name: 'MotoGP 2023',
                date_end: '2023-10-15',
                date_start: '2023-10-01',
                name: 'Italian Grand Prix',
                season_id: 'season-2023',
                year: 2023,
                circuit_name: 'Mugello Circuit',
                country_name: 'Italy',
                circuit_img: 'https://example.com/mugello.jpg',
                sponsored_img: 'https://example.com/motogp_sponsor.jpg',
                circuit_track_img: 'https://example.com/mugello_track.jpg',
                flag_img: 'https://example.com/italy_flag.jpg'
            },
            {
                sponsored_name: 'MotoGP 2023',
                date_end: '2023-09-10',
                date_start: '2023-09-02',
                name: 'Catalan Grand Prix',
                season_id: 'season-2023',
                year: 2023,
                circuit_name: 'Circuit de Barcelona-Catalunya',
                country_name: 'Spain',
                circuit_img: 'https://example.com/catalunya.jpg',
                sponsored_img: 'https://example.com/motogp_sponsor.jpg',
                circuit_track_img: 'https://example.com/catalunya_track.jpg',
                flag_img: 'https://example.com/spain_flag.jpg'
            }
        ];

        const calendarDocs = await Calendar.insertMany(calendars);
        console.log('Calendars inserted:', calendarDocs.length);

        // Example raw session data
        const sessions = [
            {
                sessionName: 'Qualifying',
                sessionDate: new Date('2023-10-01T15:00:00Z'),
                category: 'Qualifying',
                eventId: calendarDocs[0].id // Link to the first calendar
            },
            {
                sessionName: 'Race',
                sessionDate: new Date('2023-10-02T14:00:00Z'),
                category: 'Race',
                eventId: calendarDocs[0].id // Link to the first calendar
            },
            {
                sessionName: 'Free Practice',
                sessionDate: new Date('2023-09-02T15:00:00Z'),
                category: 'Free Practice',
                eventId: calendarDocs[1].id // Link to the second calendar
            },
            {
                sessionName: 'Race',
                sessionDate: new Date('2023-09-04T14:00:00Z'),
                category: 'Race',
                eventId: calendarDocs[1].id // Link to the second calendar
            }
        ];

        const sessionDocs = await Session.insertMany(sessions);
        console.log('Sessions inserted:', sessionDocs.length);

        // Example raw result data
        const results = [
            {
                riderId: new mongoose.Types.ObjectId(), // Replace with actual Rider IDs
                position: 1,
                time: '1:30:45.123',
                number: '46',
                fullname: 'Valentino Rossi',
                flag: 'https://example.com/italy_flag.jpg',
                team: 'Yamaha',
                sessionId: sessionDocs[0].id // Link to the first session
            },
            {
                riderId: new mongoose.Types.ObjectId(), // Replace with actual Rider IDs
                position: 2,
                time: '1:30:50.456',
                number: '93',
                fullname: 'Marc Márquez',
                flag: 'https://example.com/spain_flag.jpg',
                team: 'Honda',
                sessionId: sessionDocs[1].id // Link to the second session
            },
            {
                riderId: new mongoose.Types.ObjectId(), // Replace with actual Rider IDs
                position: 3,
                time: '1:31:10.789',
                number: '99',
                fullname: 'Jorge Lorenzo',
                flag: 'https://example.com/spain_flag.jpg',
                team: 'Ducati',
                sessionId: sessionDocs[2].id // Link to the third session
            },
            {
                riderId: new mongoose.Types.ObjectId(), // Replace with actual Rider IDs
                position: 1,
                time: '1:32:30.123',
                number: '47',
                fullname: 'Andrea Dovizioso',
                flag: 'https://example.com/italy_flag.jpg',
                team: 'Yamaha',
                sessionId: sessionDocs[3].id // Link to the fourth session
            },
            {
                riderId: new mongoose.Types.ObjectId(), // Replace with actual Rider IDs
                position: 2,
                time: '1:32:40.456',
                number: '26',
                fullname: 'Danilo Petrucci',
                flag: 'https://example.com/italy_flag.jpg',
                team: 'Ducati',
                sessionId: sessionDocs[3].id // Link to the fourth session
            }
        ];

        const resultDocs = await Result.insertMany(results);
        console.log('Results inserted:', resultDocs.length);

        // Close mongoose connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error generating mock data:', error);
        mongoose.connection.close();
    }
};
const getSessionsByEventName = async (eventName) => {
    try {
        // Find the calendar with the specified event name
        const calendar = await Calendar.findOne({ name: eventName });

        if (!calendar) {
            console.log(`Event "${eventName}" not found.`);
            return [];
        }

        // Find sessions linked to the calendar's ID
        const sessions = await Session.find({ eventId: calendar.id });

        if (sessions.length === 0) {
            console.log(`No sessions found for event "${eventName}".`);
            return [];
        }

        return sessions;
    } catch (error) {
        console.error('Error retrieving sessions:', error);
    } finally {
        // Close mongoose connection if needed
        // mongoose.connection.close(); // Uncomment this if you wish to close after every query
    }
};

// Usage
// getSessionsByEventName('Italian Grand Prix').then(sessions => {
//     console.log('Sessions for Italian Grand Prix:', sessions);
// });
//Example of an async function
const deleteEvent = async () => {
    try {
        const calendarIdToDelete = '66fadf049795a4a91779f482'; // Replace with the actual calendar ID to delete
        
        // Find the calendar to get its sessions
        const calendar = await Calendar.findById(calendarIdToDelete);
        if (!calendar) {
            console.log('Calendar not found.');
            return;
        }

        // Delete sessions associated with the calendar
        await Session.deleteMany({ eventId: calendar._id });
        console.log(`Deleted sessions associated with calendar ${calendar.name}`);

        // Delete results associated with the sessions
        await Result.deleteMany({ sessionId: { $in: calendar.sessionIds } }); // If results reference sessions
        console.log(`Deleted results associated with the sessions of calendar ${calendar.name}`);

        // Finally, delete the calendar
        const deletedCalendar = await Calendar.findByIdAndDelete(calendarIdToDelete);
        console.log('Deleted calendar:', deletedCalendar);
    } catch (error) {
        console.error('Error deleting calendar and associated data:', error);
    }
};

// Call deleteEvent
// deleteEvent();


// deleteEvent()

generateMockData();


