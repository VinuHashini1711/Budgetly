import axios from 'axios';

// Axios instance - in this mock app we still use axios for signature but
// the fakeApi module will be used directly for responses.
const instance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export default instance;
