const fs = require('fs');
const event = {
    sponsored_name: 'Test Event',
    date_end: new Date('2023-03-01T00:00:00.000Z'),
    date_start: new Date('2023-02-28T00:00:00.000Z'),
    name: 'Test Event',
    season_id: '2023',
    year: 2023,
    circuit_name: 'Test Circuit',
    country_name: 'Test Country',
  };
  
  const jsonData = JSON.stringify(event);
  
  fs.writeFileSync('data.json', jsonData);