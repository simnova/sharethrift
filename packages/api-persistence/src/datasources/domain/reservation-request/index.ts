// import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../index.ts';
import * as ReservationRequest from './reservation-request/index.ts';

export const ReservationRequestContextPersistence = (models: ModelsContext, /* passport: Domain.Passport */) => ({
  ReservationRequest: ReservationRequest.ReservationRequestPersistence(models, /* passport */),
});
