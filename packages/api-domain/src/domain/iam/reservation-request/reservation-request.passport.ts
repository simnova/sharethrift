import type { Passport } from '../../contexts/passport.ts';
import { ReservationRequestPassportBase } from './reservation-request.passport-base.ts';

export class ReservationRequestPassport extends ReservationRequestPassportBase implements Passport {}