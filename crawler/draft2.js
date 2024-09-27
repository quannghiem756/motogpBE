const Calendar = require('../models/Calendar');
const Session = require('../models/Session');
require('../db/mongoose');
const sampleSessions = [
    {
        name: "Spanish Grand Prix",
        location: "Circuito de Jerez",
        date: new Date("2024-05-01T00:00:00.000Z"),
        sessions: [
            {
                sessionName: "RAC",
                sessionDate: new Date("2024-05-01T10:00:00.000Z"),
                category: "MotoGP",
                results: [
                    {
                        riderId: new mongoose.Types.ObjectId(), // Replace with actual rider ObjectId if available
                        position: 1,
                        time: "01:32.456",
                        number: "93",
                        fullname: "Marc Marquez",
                        flag: "https://static-files.motogp.pulselive.com/assets/flags/es.svg",
                        team: "Repsol Honda Team"
                    },
                    {
                        riderId: new mongoose.Types.ObjectId(), // Replace with actual rider ObjectId if available
                        position: 2,
                        time: "01:33.789",
                        number: "46",
                        fullname: "Valentino Rossi",
                        flag: "https://static-files.motogp.pulselive.com/assets/flags/it.svg",
                        team: "Petronas Yamaha SRT"
                    }
                ]
            },
            {
                sessionName: "WUP",
                sessionDate: new Date("2024-05-02T14:00:00.000Z"),
                category: "MotoGP",
                results: [
                    {
                        riderId: new mongoose.Types.ObjectId(), // Replace with actual rider ObjectId if available
                        position: 1,
                        time: "01:31.123",
                        number: "36",
                        fullname: "Francesco Bagnaia",
                        flag: "https://static-files.motogp.pulselive.com/assets/flags/it.svg",
                        team: "Ducati Lenovo Team"
                    },
                    {
                        riderId: new mongoose.Types.ObjectId(), // Replace with actual rider ObjectId if available
                        position: 2,
                        time: "01:31.789",
                        number: "42",
                        fullname: "Alex Marquez",
                        flag: "https://static-files.motogp.pulselive.com/assets/flags/es.svg",
                        team: "LCR Honda"
                    }
                ]
            }
        ]
    },
];

const sampleCalendars = [
    {
        sponsored_name: "MotoGP 2024",
        date_end: "2024-12-31",
        date_start: "2024-01-01",
        name: "2024 MotoGP Calendar",
        season_id: "2024",
        year: 2024,
        circuit_name: "Circuito de Jerez",
        country_name: "Spain",
        sessions: [] // To be filled later with actual session ObjectIds
    },
];