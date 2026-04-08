import { getBrokeriumTemplate } from './src/email/brokerium-email.template';

try {
  const html = getBrokeriumTemplate('<h1>Test Body</h1>', 'blue', 'Test Title', 'Test Subtitle');
  if (html && html.includes('Test Body')) {
    console.log('Template renderer works correctly! No runtime errors.');
  } else {
    console.error('Template rendering failed.');
    process.exit(1);
  }
} catch (e) {
  console.error('Error rendering template: ', e);
  process.exit(1);
}
