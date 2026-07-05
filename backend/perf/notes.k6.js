import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'health is 200': (r) => r.status === 200 });

  const created = http.post(
    `${BASE_URL}/api/notes`,
    JSON.stringify({ content: 'perf test note', passphrase: 'k6-passphrase' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(created, { 'note created (201)': (r) => r.status === 201 });

  const { id } = JSON.parse(created.body);
  const revealed = http.post(
    `${BASE_URL}/api/notes/${id}/reveal`,
    JSON.stringify({ passphrase: 'k6-passphrase' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(revealed, { 'note revealed (200)': (r) => r.status === 200 });

  sleep(1);
}
