import http from 'k6/http';
import { sleep } from 'k6';

// export default function () {
//   http.get('http://localhost:8000/qa/questions?product_id=1');
//   sleep(1);
// }

for (let id = 1; id <= 100; id++) {
  http.get(`http://localhost:8000/qa/questions?product_id=${id}`);
}

// export default function () {
//   const url = 'http://localhost:8000/qa/questions';
//   const payload = JSON.stringify({
//     body : 'jest body',
//     name : 'jest name',
//     email : 'jest@email.com',
//     product_id : 1,
//   });

//   const params = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   http.post(url, payload, params);
// }