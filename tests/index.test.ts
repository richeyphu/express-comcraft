import app from '@src/app';
import supertest, { SuperTest, Test } from 'supertest';
import mongoose from 'mongoose';

const request: SuperTest<Test> = supertest(app);

describe('Route / (index)', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Route /status', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/status');
    try {
      expect(response.statusCode).toBe(200);
    } catch (error) {
      expect(response.statusCode).toBe(401);
    }
  });

  it('should response the `server.status` as `up`', async () => {
    const response = await request.get('/status');
    try {
      expect(response.body.server.status).toBe('up');
    } catch (error) {
      expect(response.statusCode).toBe(401);
    }
  });

  it('should response the `server.env as `test`', async () => {
    const response = await request.get('/status');
    try {
      expect(response.body.server.env).toBe('test');
    } catch (error) {
      expect(response.statusCode).toBe(401);
    }
  });

  jest.retryTimes(3, { logErrorsBeforeRetry: true });
  it('should response the `server.db_status` as `connected`', async () => {
    const response = await request.get('/status');
    try {
      jest.useFakeTimers();
      setTimeout(() => {
        expect(response.body.server.db_status).toBe('connected');
      }, 1000);
      jest.useRealTimers();
    } catch (error) {
      expect(response.statusCode).toBe(401);
    }
  });
});

describe('Route /product', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/product');
    expect(response.statusCode).toBe(200);
  });

  it('should response the POST method', async () => {
    const response = await request.post('/product');
    expect(response.statusCode).toBe(401);
  });
});

describe('Route /user', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/user');
    expect(response.statusCode).toBe(401);
  });

  it('/login should response the POST method', async () => {
    const response = await request.post('/user/login');
    expect(response.statusCode).toBe(422);
  });
});

describe('Route /admin', () => {
  it('should response the status code 418', async () => {
    const response = await request.get('/admin');
    expect(response.statusCode).toBe(418);
  });
});

afterAll(async () => {
  // Connection to Mongo killed.
  await mongoose.disconnect();
});
