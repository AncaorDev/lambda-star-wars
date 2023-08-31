const request = require('supertest');
const app = require('../src/index');

describe('POST /star-wars', () => {
  test('should return data', async () => {
    const response = await app.create({ body : '{ "path" : "vehicles" , "item" : "4" }'});
    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(201);
    expect(body.message).toBe('Element created successfully');
    expect(body.item.nombre).toBeDefined();
    expect(body.item.modelo).toBeDefined();
  });

  test('should return 500 if an error occurs', async () => {
    const response = await app.create({ body : '{ "path" : "vehicles" }'});
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body)
    expect(body.message).toBeDefined();
  });
});