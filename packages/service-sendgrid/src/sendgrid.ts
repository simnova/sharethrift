import sendgrid from '@sendgrid/mail';
import { readHtmlFile } from './get-email-template.js';
import fs from 'fs';
import path from 'path';

export default class SendGrid {
  emailTemplateName: string;

  constructor(emailTemplateName: string) {
    const apiKey = process.env['SENDGRID_API_KEY'];
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is missing. Please set it to use SendGrid.');
    }
    sendgrid.setApiKey(apiKey);
    this.emailTemplateName = emailTemplateName;
  }

  sendEmailWithMagicLink = async (userEmail: string, magicLink: string) => {
    console.log('SendGrid.sendEmail() - email: ', userEmail);
    let template;
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
      // Save email to disk instead of sending
      const outDir = path.join(process.cwd(), 'tmp-emails');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

      // Comprehensive filename sanitization
      function sanitizeFilename(name: string): string {
        // Replace all invalid filename characters with underscores
        // Invalid chars: / \ : * ? " < > | and also @ for clarity
        return name.replace(/[@\/\\:\*\?"<>\|]/g, '_');
      }

      const sanitizedEmail = sanitizeFilename(userEmail);
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
      .then((response) => {
        console.log('Email sent successfully');
        console.log(response);
      })
      .catch((error) => {
        console.log('Error sending email');
        console.log(error);
      });
  }
}
