import sendgrid from '@sendgrid/mail';
import { readHtmlFile } from './get-email-template.js';
import fs from 'fs';
import path from 'path';

// TransactionalEmailService interface definition
interface TransactionalEmailService {
	sendReservationNotification(
		recipientEmail: string,
		reserverName: string,
		listingTitle: string,
		reservationStart: string,
		reservationEnd: string,
	): Promise<void>;
}

export default class SendGrid implements TransactionalEmailService {
  emailTemplateName: string;

  constructor(emailTemplateName: string) {
    const apiKey = process.env['SENDGRID_API_KEY'];
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is missing. Please set it to use SendGrid.');
    }
    sendgrid.setApiKey(apiKey);
    this.emailTemplateName = emailTemplateName;
  }

  async sendReservationNotification(
    recipientEmail: string,
    reserverName: string,
    listingTitle: string,
    reservationStart: string,
    reservationEnd: string,
  ): Promise<void> {
    console.log('SendGrid.sendReservationNotification()');
    console.log(`  To: ${recipientEmail}`);
    console.log(`  Reserver: ${reserverName}`);
    console.log(`  Listing: ${listingTitle}`);
    console.log(`  Period: ${reservationStart} - ${reservationEnd}`);

    if (process.env["NODE_ENV"] === 'development') {
      const outDir = path.join(process.cwd(), 'tmp-emails');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

      const sanitizedEmail = recipientEmail.replace(/[@/\\:*?"<>|]/g, '_');
      const outFile = path.join(outDir, `reservation_${sanitizedEmail}_${Date.now()}.txt`);
      const content = `
Reservation Notification
========================
To: ${recipientEmail}
Reserver: ${reserverName}
Listing: ${listingTitle}
Start Date: ${reservationStart}
End Date: ${reservationEnd}
`;
      fs.writeFileSync(outFile, content, 'utf-8');
      console.log(`Email saved to ${outFile}`);
      return;
    }

    // TODO: Implement actual email sending with template
    // For production, this should use a proper email template
    try {
      await sendgrid.send({
        to: recipientEmail,
        from: process.env['SENDGRID_FROM_EMAIL'] || 'noreply@sharethrift.com',
        subject: `New reservation request for ${listingTitle}`,
        text: `${reserverName} has requested to reserve ${listingTitle} from ${reservationStart} to ${reservationEnd}.`,
        html: `<p><strong>${reserverName}</strong> has requested to reserve <strong>${listingTitle}</strong> from ${reservationStart} to ${reservationEnd}.</p>`,
      });
      console.log('Reservation notification email sent successfully');
    } catch (error) {
      console.error('Error sending reservation notification email:', error);
      throw error;
    }
  }

  sendEmailWithMagicLink = async (userEmail: string, magicLink: string) => {
    console.log('SendGrid.sendEmail() - email: ', userEmail);
    let template: { fromEmail: string; subject: string; body: string };
    try {
      template = JSON.parse(readHtmlFile(this.emailTemplateName));
    } catch (err) {
      console.error(`Failed to parse email template JSON for "${this.emailTemplateName}":`, err);
      throw new Error(`Invalid email template JSON: ${this.emailTemplateName}`);
    }
    const templateBodyWithMagicLink = this.replaceMagicLink(template.body, magicLink);
    const subject = `${template.subject} ${process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX']}`;
    await this.sendEmail(userEmail, template, templateBodyWithMagicLink, subject);
  };

  private replaceMagicLink = (html: string, link: string): string => {
    const magicLinkPlaceholder = /\{\{magicLink\}\}/g;
    return html.replace(magicLinkPlaceholder, link);
  };

  private async sendEmail(
    userEmail: string,
    template: { fromEmail: string; subject: string; body: string },
    htmlContent: string,
    subject: string
  ) {
    if (process.env["NODE_ENV"] === 'development') {
      const outDir = path.join(process.cwd(), 'tmp-emails');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

      const sanitizedEmail = userEmail.replace(/[@/\\:*?"<>|]/g, '_')
      const outFile = path.join(outDir, `${sanitizedEmail}_${Date.now()}.html`);
      fs.writeFileSync(outFile, htmlContent, 'utf-8');
      console.log(`Email saved to ${outFile}`);
      return;
    }
    try {
      const response = await sendgrid.send({
        to: userEmail,
        from: template.fromEmail,
        subject: subject,
        html: htmlContent,
      });
      console.log('Email sent successfully');
      console.log(response);
    } catch (error) {
      console.log('Error sending email');
      console.log(error);
    }
  }
}
