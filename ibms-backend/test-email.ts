import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { EmailService } from './src/email/email.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const emailService = app.get(EmailService);
  
  console.log('Sending test invite email...');
  try {
    await emailService.sendInvite(
      'test@example.com',
      'dummy-token',
      'http://localhost:3000',
      'Test Organization',
      'BROKER',
      'Your Administrator',
    );
    console.log('Test invite email executed successfully! Check logs above for HTML output.');
  } catch (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }
  
  await app.close();
}

bootstrap();
