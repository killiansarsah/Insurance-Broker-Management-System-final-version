const axios = require('axios');

async function test() {
  try {
    // 1. login
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'killiansarsah100@gmail.com',
      password: 'Pa$$w0rd!'
    });
    
    const token = loginRes.data.accessToken;
    console.log('Logged in, got token');

    // 2. create invite
    const inviteRes = await axios.post('http://localhost:3001/api/v1/invitations', {
      email: 'test_invitation_999@example.com',
      role: 'BROKER'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Invite success:', inviteRes.data);
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}
test();
