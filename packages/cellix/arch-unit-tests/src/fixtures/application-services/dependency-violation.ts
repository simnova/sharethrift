/**
 * This file intentionally violates dependency boundaries.
 */

// VIOLATION: Importing mongoose directly
import mongoose from 'mongoose';

// VIOLATION: Importing concrete implementation instead of abstraction
import { ServicePaymentStripe } from '@cellix/service-payment-stripe';

// VIOLATION: Importing persistence layer
import { MongoRepositoryBase } from '@cellix/mongoose-seedwork';

export async function processPaymentAction() {
	return new ServicePaymentStripe().charge();
}
