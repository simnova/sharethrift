export interface TransactionalEmailService {
	sendTemplatedEmail(
		templateName: string,
		recipientInfo: { email: string; name: string },
		templateData: Record<string, unknown>
	): Promise<void>;
}
