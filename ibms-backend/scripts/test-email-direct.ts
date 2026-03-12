import axios from 'axios';

const TESTMAIL_API_KEY = 'ea46a1ec-54a8-4232-ad35-1d688cc45ce8';
const TESTMAIL_NAMESPACE = 't3t75';

async function testEmailDirect() {
  console.log('🧪 Testing Testmail.app API directly...\n');

  const tag = 'test';
  const testmailAddress = `${tag}.${TESTMAIL_NAMESPACE}@inbox.testmail.app`;

  try {
    const response = await axios.post(
      'https://api.testmail.app/api/send',
      {
        apikey: TESTMAIL_API_KEY,
        namespace: TESTMAIL_NAMESPACE,
        tag,
        from: 'noreply@ibms.test',
        to: testmailAddress,
        subject: 'IBMS Test Email',
        html: '<h1>Test Email</h1><p>This is a test email from IBMS.</p>',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Email sent successfully!');
    console.log('Response:', response.data);
    console.log('\n📬 View at: https://testmail.app/inbox/t3t75/test');
  } catch (error: any) {
    console.error('❌ Failed to send email');
    console.error('Error:', error.response?.data || error.message);
  }
}

testEmailDirect();
