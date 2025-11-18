import { ServiceSendGrid } from '../src/service-sendgrid-facade.js';

/**
 * Demo script showing the ServiceSendGrid facade in action.
 * 
 * This demonstrates how the facade automatically selects between SendGrid and Mock
 * implementations based on the SENDGRID_API_KEY environment variable.
 */

async function demo() {
	console.log('='.repeat(60));
	console.log('ServiceSendGrid Facade Demo');
	console.log('='.repeat(60));
	console.log();

	// Check environment
	// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
	const apiKey = process.env['SENDGRID_API_KEY'];
	if (!apiKey || apiKey === 'mock') {
		console.log('📧 Mode: MOCK (no API key set or set to "mock")');
		console.log('   Emails will be saved to tmp/emails/ folder');
	} else {
		console.log('📧 Mode: SENDGRID (API key detected)');
		console.log('   Emails will be sent via SendGrid');
	}
	console.log();

	// Initialize service with a dummy email template
	const service = new ServiceSendGrid('example-template');
	
	try {
		// Start the service
		console.log('🚀 Starting service...');
		await service.startUp();
		console.log('✅ Service started successfully');
		console.log();

		// Note: sendEmailWithMagicLink requires a valid email template file
		// For this demo, we're just showing the facade working
		console.log('📝 Service is ready to send emails with magic links');
		console.log('   Use: service.sendEmailWithMagicLink(email, magicLink)');
		console.log();

		// Shutdown
		console.log('🛑 Shutting down service...');
		await service.shutDown();
		console.log('✅ Service stopped successfully');
		console.log();

		console.log('✨ Demo completed!');
		if (!apiKey || apiKey === 'mock') {
			console.log('   Check tmp/emails/ folder for saved emails (if any were sent)');
		}
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
}

// Run demo
try {
	await demo();
} catch (error) {
	console.error(error);
}
