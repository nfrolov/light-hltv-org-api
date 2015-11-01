'use strict';

const Code = require('code');
const Sinon = require('sinon');

const expect = Code.expect;
const stub = Sinon.stub;


const Team = require('../models/team');
const server = require('..');

describe('GET /teams', () => {

  const request = {method: 'GET', url: '/teams'};
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
      findStub = stub(Team, 'find')
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
      findStub = stub(Team, 'find')
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
      findStub = stub(Team, 'find')
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

describe('POST /teams', () => {

  const payload = {};
  const request = {method: 'POST', url: '/teams', payload};
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
      createStub = stub(Team, 'create')
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
      createStub = stub(Team, 'create')
        .callsArgWithAsync(1, null, {_id: 'dummy'});
    });

    after(() => {
      createStub.restore();
    });

    it('should return 201 code', () => {
      expect(res.statusCode).to.equal(201);
    });

    it('should return new location', () => {
      expect(res.headers['location']).to.equal('/teams/dummy');
    });

    it('should return new document', () => {
      expect(res.result).to.be.object();
      expect(res.result._id).to.exist().and.to.equal('dummy');
    });

  });

});

describe('GET /teams/{id}', () => {

  const request = {method: 'GET', url: '/teams/dummy'};
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
      findStub = stub(Team, 'findById')
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
      findStub = stub(Team, 'findById')
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

    let doc = {};
    let findStub;

    before(() => {
      findStub = stub(Team, 'findById')
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

describe('PUT /teams/{id}', () => {

  const payload = {_id: 'dummy'};
  const request = {method: 'PUT', url: '/teams/dummy', payload};
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
      updateStub = stub(Team, 'findByIdAndUpdate')
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
      updateStub = stub(Team, 'findByIdAndUpdate')
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

describe('DELETE /teams/{id}', () => {

  const request = {method: 'DELETE', url: '/teams/dummy'};
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
      removeStub = stub(Team, 'remove')
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
      removeStub = stub(Team, 'remove')
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

describe('GET /teams/{id}/matches', () => {

  const request = {method: 'GET', url: '/teams/dummy/matches'};
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
      findStub = stub(Team, 'findMatches')
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
      findStub = stub(Team, 'findMatches')
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

    let docs = [{}, {}];
    let findStub;

    before(() => {
      findStub = stub(Team, 'findMatches')
        .callsArgWithAsync(1, null, docs);
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

    it('should return found documents', () => {
      expect(res.result).to.equal(docs);
    });

  });

});
