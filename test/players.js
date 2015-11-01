'use strict';

const Code = require('code');
const Sinon = require('sinon');

const expect = Code.expect;
const stub = Sinon.stub;


const Player = require('../models/player');
const server = require('..');

describe('GET /players', () => {

  const request = {method: 'GET', url: '/players'};
  let res;

  beforeEach((done) => {
    server.inject(request, r => {
      res = r;
      done();
    });
  });

  context('if failed', () => {

    let findStub;

    before(() => {
      findStub = stub(Player, 'find')
        .callsArgWithAsync(0, new Error());
    });

    after(() => {
      findStub.restore();
    });

    it('should return 500 code', () => {
      expect(res.statusCode).to.equal(500);
    });

  });

  context('if no entries', () => {

    let findStub;

    before(() => {
      findStub = stub(Player, 'find')
        .callsArgWithAsync(0, null, []);
    });

    after(() => {
      findStub.restore();
    });

    it('should return 200 code', () => {
      expect(res.statusCode).to.equal(200);
    });

    it('should return json', () => {
      expect(res.headers['content-type']).to.startWith('application/json');
    });

    it('should return empty document', () => {
      expect(res.result).to.be.array().and.empty();
    });

  });

  context('if many entries', () => {

    let findStub;

    before(() => {
      findStub = stub(Player, 'find')
        .callsArgWithAsync(0, null, [{}, {}]);
    });

    after(() => {
      findStub.restore();
    });

    it('should return 200 code', () => {
      expect(res.statusCode).to.equal(200);
    });

    it('should return json', () => {
      expect(res.headers['content-type']).to.startWith('application/json');
    });

    it('should return non-empty document', () => {
      expect(res.result).to.be.array().and.not.empty();
    });

  });

});

describe('POST /players', () => {

  const payload = {nick: 'a'};
  const request = {method: 'POST', url: '/players', payload};
  let res;

  beforeEach((done) => {
    server.inject(request, r => {
      res = r;
      done();
    });
  });

  context('if failed', () => {

    let createStub;

    before(() => {
      createStub = stub(Player, 'create')
        .callsArgWithAsync(1, new Error());
    });

    after(() => {
      createStub.restore();
    });

    it('should return 500 code', () => {
      expect(res.statusCode).to.equal(500);
    });

  });

  context('if successfully saved', () => {

    let createStub;

    before(() => {
      createStub = stub(Player, 'create')
        .callsArgWithAsync(1, null, {_id: 'dummy'});
    });

    after(() => {
      createStub.restore();
    });

    it('should return 201 code', () => {
      expect(res.statusCode).to.equal(201);
    });

    it('should return new location', () => {
      expect(res.headers['location']).to.equal('/players/dummy');
    });

    it('should return new document', () => {
      expect(res.result).to.be.object();
      expect(res.result._id).to.exist().and.to.equal('dummy');
    });

  });

});

describe('GET /players/{id}', () => {

  const request = {method: 'GET', url: '/players/dummy'};
  let res;

  beforeEach((done) => {
    server.inject(request, r => {
      res = r;
      done();
    });
  });

  context('if failed', () => {

    let findStub;

    before(() => {
      findStub = stub(Player, 'findById')
        .callsArgWithAsync(1, new Error());
    });

    after(() => {
      findStub.restore();
    });

    it('should return 500 code', () => {
      expect(res.statusCode).to.equal(500);
    });

  });

  context('if not found', () => {

    let findStub;

    before(() => {
      findStub = stub(Player, 'findById')
        .callsArgWithAsync(1, null, null);
    });

    after(() => {
      findStub.restore();
    });

    it('should return 404 code', () => {
      expect(res.statusCode).to.equal(404);
    });

    it('should return error object', () => {
      expect(res.headers['content-type']).to.startWith('application/json');
      expect(res.result).to.be.object();
    });

  });

  context('if found', () => {

    let doc = {_id: 'dummy'};
    let findStub;

    before(() => {
      findStub = stub(Player, 'findById')
        .callsArgWithAsync(1, null, doc);
    });

    after(() => {
      findStub.restore();
    });

    it('should return 200 code', () => {
      expect(res.statusCode).to.equal(200);
    });

    it('should return json', () => {
      expect(res.headers['content-type']).to.startWith('application/json');
    });

    it('should return found document', () => {
      expect(res.result).to.equal(doc);
    });

  });

});
describe('PUT /players/{id}', () => {

  const payload = {_id: 'dummy'};
  const request = {method: 'PUT', url: '/players/dummy', payload};
  let res;

  beforeEach((done) => {
    server.inject(request, r => {
      res = r;
      done();
    });
  });

  context('if failed', () => {

    let updateStub;

    before(() => {
      updateStub = stub(Player, 'findByIdAndUpdate')
        .callsArgWithAsync(3, new Error());
    });

    after(() => {
      updateStub.restore();
    });

    it('should return 500 code', () => {
      expect(res.statusCode).to.equal(500);
    });

  });

  context('if successfully saved', () => {

    let updateStub;

    before(() => {
      updateStub = stub(Player, 'findByIdAndUpdate')
        .callsArgWithAsync(3, null, payload);
    });

    after(() => {
      updateStub.restore();
    });

    it('should return 200 code', () => {
      expect(res.statusCode).to.equal(200);
    });

    it('should return updated document', () => {
      expect(res.result).to.be.object().and.deep.equal(payload);
    });

  });

});

describe('DELETE /players/{id}', () => {

  const request = {method: 'DELETE', url: '/players/dummy'};
  let res;

  beforeEach((done) => {
    server.inject(request, r => {
      res = r;
      done();
    });
  });

  context('if failed', () => {

    let removeStub;

    before(() => {
      removeStub = stub(Player, 'remove')
        .callsArgWithAsync(1, new Error());
    });

    after(() => {
      removeStub.restore();
    });

    it('should return 500 code', () => {
      expect(res.statusCode).to.equal(500);
    });

  });

  context('if successfully removed', () => {

    let removeStub;

    before(() => {
      removeStub = stub(Player, 'remove')
        .callsArgWithAsync(1, null);
    });

    after(() => {
      removeStub.restore();
    });

    it('should return 204 code', () => {
      expect(res.statusCode).to.equal(204);
    });

    it('should return empty document', () => {
      expect(res.result).to.not.exist();
    });

  });

});
