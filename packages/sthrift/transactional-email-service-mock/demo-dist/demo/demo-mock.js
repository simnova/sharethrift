import { ServiceTransactionalEmailMock } from '../src/index.js';
/**
 * Demo script showing the Mock email service in action.
 * Demonstrates saving emails to local HTML files for verification.
 */
async function demo() {
    console.log('='.repeat(60));
    console.log('Mock Transactional Email Service Demo');
    console.log('='.repeat(60));
    console.log();
    const service = new ServiceTransactionalEmailMock();
    try {
        // Start the service
        console.log('🚀 Starting mock email service...');
        await service.startUp();
        console.log();
        // Send a sample email
        console.log('📧 Sending sample email...');
        await service.sendEmail({
            to: 'demo-user@example.com',
            from: 'noreply@sharethrift.com',
            subject: 'Welcome to ShareThrift - Demo Email',
            html: `
				<html>
				<head>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
						.content { padding: 20px; }
						.button { 
							display: inline-block; 
							padding: 10px 20px; 
							background-color: #4CAF50; 
							color: white; 
							text-decoration: none; 
							border-radius: 5px; 
						}
						.footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
					</style>
				</head>
				<body>
					<div class="header">
						<h1>Welcome to ShareThrift!</h1>
					</div>
					<div class="content">
						<p>Hello Demo User,</p>
						<p>Thank you for joining ShareThrift. We're excited to have you on board!</p>
						<p>This is a demonstration email showing how the mock service saves HTML emails locally.</p>
						<p style="text-align: center; margin: 30px 0;">
							<a href="https://example.com/verify" class="button">Get Started</a>
						</p>
						<p>If you have any questions, please don't hesitate to reach out.</p>
						<p>Best regards,<br>The ShareThrift Team</p>
					</div>
					<div class="footer">
						<p>&copy; 2025 ShareThrift. All rights reserved.</p>
						<p>This is a demonstration email from the mock service.</p>
					</div>
				</body>
				</html>
			`,
        });
        console.log();
        // Send another email with different styling
        console.log('📧 Sending another email with different content...');
        await service.sendEmail({
            to: 'admin@example.com',
            from: 'alerts@sharethrift.com',
            subject: 'System Alert - New User Registration',
            html: `
				<html>
				<head>
					<style>
						body { font-family: 'Courier New', monospace; background-color: #f9f9f9; padding: 20px; }
						.alert-box { 
							border-left: 4px solid #ff9800; 
							background-color: white; 
							padding: 15px; 
							margin: 20px 0; 
						}
					</style>
				</head>
				<body>
					<h2>🔔 New User Registration Alert</h2>
					<div class="alert-box">
						<p><strong>Email:</strong> demo-user@example.com</p>
						<p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
						<p><strong>Status:</strong> Pending verification</p>
					</div>
					<p>This is an automated alert from the ShareThrift system.</p>
				</body>
				</html>
			`,
        });
        console.log();
        // Shutdown
        console.log('🛑 Shutting down service...');
        await service.shutDown();
        console.log();
        console.log('✨ Demo completed!');
        console.log('📁 Check the tmp/emails/ folder to see the saved HTML files');
        console.log('   Each file includes complete styling and metadata');
        console.log('   Open them in a browser to verify the email appearance');
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
// Run demo
demo().catch(console.error);
