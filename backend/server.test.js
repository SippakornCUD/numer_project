const req = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('./server');

let date = new Date().toISOString().split('T')[0];
let secretKey = date.replace(/-/g,'')

test('renders learn react link', async () => {
    const res = await req(server).get('/gentoken/folk').expect(200);
    console.log(res);
    const decode = jwt.verify(res.text,secretKey)
    console.log(decode);
    expect(decode.name).toBe('folk');
})