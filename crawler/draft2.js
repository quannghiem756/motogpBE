require('../db/mongoose');
const mongoose = require('mongoose');
const Calendar = require('../models/Calendar');
const Session = require('../models/Session');
const Result = require('../models/Result');


async function main() {
    

    const calendarData1 = {
        sponsored_name: 'Pirelli',
        date_end: '2024-05-18T23:59:59.999Z',
        date_start: '2024-03-17T00:00:00.000Z',
        name: 'Italian Grand Prix',
        season_id: '650ab8d3f0a2134567890xyz',
        year: 2024,
        circuit_name: 'Monza',
        country_name: 'Italy',
        sessions: []
    };

    const calendar1 = new Calendar(calendarData1);
    await calendar1.save();

    const sessionData1 = {
        sessionName: 'SPR',
        sessionDate: '2024-03-17T00:00:00.000Z',
        category: 'MotoGP',
        results: []
    };

    const session1 = new Session(sessionData1);
    await session1.save();

    const resultData1 = {
        riderId: '650ab8d3f0a2134567890aaa',
        position: 1,
        time: '01:35.123',
        number: '94',
        fullname: 'Fabio Quartararo',
        flag: 'https://static-files.motogp.pulselive.com/assets/flags/fr.svg',
        team: 'Yamaha Factory Racing'
    };

    const result1 = new Result(resultData1);
    await result1.save();

    session1.results.push(result1._id);
    calendar1.sessions.push(session1._id);

    await session1.save();
    await calendar1.save();

    const calendarData2 = {
        sponsored_name: 'Ducati',
        date_end: '2024-05-31T23:59:59.999Z',
        date_start: '2024-04-01T00:00:00.000Z',
        name: 'Japanese Grand Prix',
        season_id: '650ab8d3f0a2134567890xyz',
        year: 2024,
        circuit_name: 'Honda Suzuka',
        country_name: 'Japan',
        sessions: []
    };

    const calendar2 = new Calendar(calendarData2);
    await calendar2.save();

    const sessionData2 = {
        sessionName: 'SPR',
        sessionDate: '2024-04-01T00:00:00.000Z',
        category: 'MotoGP',
        results: []
    };

    const session2 = new Session(sessionData2);
    await session2.save();

    const resultData2 = {
        riderId: '650ab8d3f0a2134567890bbb',
        position: 1,
        time: '01:36.123',
        number: '102',
        fullname: 'Dani Pedrosa',
        flag: 'https://static-files.motogp.pulselive.com/assets/flags/es.svg',
        team: 'Ducati'
    };

    const result2 = new Result(resultData2);
    await result2.save();

    session2.results.push(result2._id);
    calendar2.sessions.push(session2._id);

    await session2.save();
    await calendar2.save();

    console.log('Data inserted successfully');
}

// main()
//     .then(() => console.log('Data inserted successfully'))
//     .catch(err => console.error(err))
    
async function getResult() {

    const calendar = await Calendar.findOne({
        'name': 'Italian Grand Prix'
    }).populate({
        path: 'sessions',
        match: {sessionName : 'SPR', category : 'MotoGP'},
        populate: 'results'
    }).catch(err => console.error(err))
    console.log(calendar.sessions[0]?.results)
    if (!calendar) {
        console.log('Calendar not found');
        return;
    // }

    
}}

getResult().then(() => console.log('Data retrieved successfully')).catch(err => console.error(err))