const frisby = require('frisby');
// Testing -- (Frisby)

it('GET questions test', function() {
  return frisby.get('http://localhost:8000/qa/questions?product_id=1')
    .expect('status', 200);
});

it('GET answers test', function() {
  return frisby.get('http://localhost:8000/qa/questions/1/answers')
    .expect('status', 200);
});

it('POST question test', function() {
  return frisby
    .post('http://localhost:8000/qa/questions', {
      body: JSON.stringify({
        body : 'jest body',
        name : 'jest name',
        email : 'jest@email.com',
        product_id : 1
      })
    })
    .expect('status', 201);
});



it('POST answer test', function() {
  return frisby
    .post('http://localhost:8000/qa/questions/1/answers', {
      body: JSON.stringify({
        body: 'jest body',
        name: 'jest name',
        email: 'jest@email.com',
        photos: ['jest-photo']
      })
    })
    .expect('status', 201);
});

it('PUT questions helpful test', function() {
  return frisby.put('http://localhost:8000/qa/questions/1/helpful')
    .expect('status', 204);
});

it('PUT answer helpful test', function() {
  return frisby.put('http://localhost:8000/qa/answers/1/helpful')
    .expect('status', 204);
});

it('PUT answer reported test', function() {
  return frisby.put('http://localhost:8000/qa/answers/1/report')
    .expect('status', 204);
});


