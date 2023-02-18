import app from '@src/app';
import request from 'supertest';

describe('Root path', () => {
  test('should response the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
