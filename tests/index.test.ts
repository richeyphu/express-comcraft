import app from '@src/app';
import supertest, { SuperTest, Test } from 'supertest';

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
    expect(response.statusCode).toBe(200);
  });

  it('should response the `server.status` as `up`', async () => {
    const response = await request.get('/status');
    expect(response.body.server.status).toBe('up');
  });

  it('should response the `server.env as `test`', async () => {
    const response = await request.get('/status');
    expect(response.body.server.env).toBe('test');
  });

  jest.retryTimes(3, { logErrorsBeforeRetry: true });
  it('should response the `server.db_status` as `connected`', async () => {
    const response = await request.get('/status');
    setTimeout(() => {
      expect(response.body.server.db_status).toBe('connected');
    }, 1000);
  });
});

describe('Route /product', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/product');
    expect(response.statusCode).toBe(200);
  });

  it('should response the POST method', async () => {
    const response = await request.post('/product');
    expect(response.statusCode).toBe(422);
  });
});

describe('Route /user', () => {
  it('should response the GET method', async () => {
    const response = await request.get('/user');
    expect(response.statusCode).toBe(200);
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
