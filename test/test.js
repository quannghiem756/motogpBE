const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Make sure this is the correct path to your server file
const Rider = require('../models/Rider');

beforeAll(async () => {
  // Database connection
  const username = 'quannghiem100';
  const password = 'iAAimy99vLhoZuAH';
  const database = 'motogp';
  const connectionString = `mongodb+srv://${username}:${password}@cluster0.thfyy.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;

  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe('Rider API', () => {
  //let riderId;
//   afterAll(async () => {
//     // Dọn dẹp cơ sở dữ liệu và đóng kết nối
//     await mongoose.connection.db.dropDatabase();
//     await mongoose.connection.close();
//   });

    // test('POST /rider should create a new rider', async () => {
    //     const newRider = {
    //         name: 'Jane Smith',
    //         team: 'Team B',
    //         championships: 2,
    //         raceWins: 5,
    //         podiums: 8,
    //         totalPoints: 150,
    //         dateOfBirth: '1990-06-15',
    //         nationality: 'British',
    //         imageUrl: 'http://example.com/jane-smith.jpg',
    //         story: 'Jane Smith is an exceptional rider with a bright future.'
    //     };

    //     const response = await request(app)
    //         .post('/rider')
    //         .send(newRider);

    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.name).toBe(newRider.name);
    //     expect(response.body.team).toBe(newRider.team);
    //     expect(response.body.championships).toBe(newRider.championships);
    //     expect(response.body.raceWins).toBe(newRider.raceWins);
    //     expect(response.body.podiums).toBe(newRider.podiums);
    //     expect(response.body.totalPoints).toBe(newRider.totalPoints);
    //     expect(new Date(response.body.dateOfBirth).toISOString()).toBe(new Date(newRider.dateOfBirth).toISOString());
    //     expect(response.body.nationality).toBe(newRider.nationality);
    //     expect(response.body.imageUrl).toBe(newRider.imageUrl);
    //     expect(response.body.story).toBe(newRider.story);

    //     riderId = response.body.id;
    // });

    test('DELETE /rider/:id should delete a rider', async () => {
      const riderId = '66e33246b168e9b9b4180556';
    
      // Đảm bảo rằng tài liệu tồn tại
      const responseGetBeforeDelete = await request(app).get(`/rider/${riderId}`);
      expect(responseGetBeforeDelete.statusCode).toBe(200);
    
      // Gửi yêu cầu DELETE để xóa tài liệu
      const responseDelete = await request(app).delete(`/rider/${riderId}`);
      expect(responseDelete.statusCode).toBe(200);
    
      // Kiểm tra xem tài liệu đã bị xóa hay chưa
      const responseGetAfterDelete = await request(app).get(`/rider/${riderId}`);
      expect(responseGetAfterDelete.statusCode).toBe(404);
    });
});
