// @ts-nocheck
/**
 * This file intentionally violates dependency boundaries.
 */

// VIOLATION: Importing mongoose directly
import mongoose from 'mongoose';

// VIOLATION: Importing concrete implementation instead of abstraction
import { ServicePaymentStripe } from '@cellix/service-payment-stripe';

// VIOLATION: Importing persistence layer
// biome-ignore lint/correctness/noUnusedImports: intentional violation for testing
import { MongoRepositoryBase } from '@cellix/mongoose-seedwork';

// biome-ignore lint/correctness/noUnusedImports: intentional violation for testing
// biome-ignore lint/suspicious/useAwait: intentional violation for testing
export async function processPaymentAction() {
	return new ServicePaymentStripe().charge();
}
