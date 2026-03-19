// @ts-nocheck
/**
 * This file intentionally violates dependency boundaries.
 */

// VIOLATION: Importing mongoose directly
// NOSONAR: intentional unused import demonstrating dependency boundary violation
import mongoose from 'mongoose';

// VIOLATION: Importing concrete implementation instead of abstraction
import { ServicePaymentStripe } from '@cellix/service-payment-stripe';

// VIOLATION: Importing persistence layer
// NOSONAR: intentional unused import demonstrating dependency boundary violation
import { MongoRepositoryBase } from '@cellix/mongoose-seedwork';

// biome-ignore lint/correctness/noUnusedImports: intentional violation for testing
// biome-ignore lint/suspicious/useAwait: intentional violation for testing
export async function processPaymentAction() {
	return new ServicePaymentStripe().charge();
}
