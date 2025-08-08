import { describe, it, expect } from 'vitest';
import { ReservationRequest } from './reservation-request.aggregate.ts';
import { ReservationRequestState } from './reservation-request.value-objects.ts';
import type { ReservationPassport } from '../reservation.passport.ts';
import type { ReservationVisa } from '../reservation.visa.ts';

describe('ReservationRequest', () => {
  // Create a mock passport that implements the ReservationPassport interface
  const mockPassport: ReservationPassport = {
    forReservationRequest: (): ReservationVisa => ({
      determineIf: () => true // Allow all operations for testing
    })
  };

  // Use future dates for testing
  const getFutureDates = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // next week
    return { startDate, endDate };
  };

  describe('create', () => {
    it('should create a new reservation request with REQUESTED state', () => {
      const { startDate, endDate } = getFutureDates();

      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      expect(reservation.state.value).toBe(ReservationRequestState.REQUESTED);
      expect(reservation.listingId).toBe('listing-1');
      expect(reservation.reserverId).toBe('user-1');
      expect(reservation.reservationPeriod.start).toEqual(startDate);
      expect(reservation.reservationPeriod.end).toEqual(endDate);
      expect(reservation.closeRequested).toBe(false);
      expect(reservation.schemaVersion).toBe(1);
    });

    it('should throw error if start date is after end date', () => {
      const { startDate, endDate } = getFutureDates();

      expect(() => {
        ReservationRequest.create({
          listingId: 'listing-1',
          reserverId: 'user-1',
          reservationPeriodStart: endDate, // reversed
          reservationPeriodEnd: startDate,
        }, mockPassport);
      }).toThrow('Reservation start date must be before end date');
    });
  });

  describe('accept', () => {
    it('should change state from REQUESTED to ACCEPTED', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.accept();

      expect(reservation.state.value).toBe(ReservationRequestState.ACCEPTED);
    });

    it('should throw error if not in REQUESTED state', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.accept();

      expect(() => {
        reservation.accept();
      }).toThrow('Can only accept requested reservations');
    });
  });

  describe('cancel', () => {
    it('should cancel a REQUESTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.cancel();

      expect(reservation.state.value).toBe(ReservationRequestState.CANCELLED);
    });

    it('should cancel a REJECTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.reject();
      reservation.cancel();

      expect(reservation.state.value).toBe(ReservationRequestState.CANCELLED);
    });
  });

  describe('close', () => {
    it('should close an ACCEPTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.accept();
      reservation.close();

      expect(reservation.state.value).toBe(ReservationRequestState.RESERVATION_PERIOD);
    });

    it('should throw error if not in ACCEPTED state', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      expect(() => {
        reservation.close();
      }).toThrow('Can only close accepted reservations');
    });
  });

  describe('requestClose', () => {
    it('should set closeRequested to true for ACCEPTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const reservation = ReservationRequest.create({
        listingId: 'listing-1',
        reserverId: 'user-1',
        reservationPeriodStart: startDate,
        reservationPeriodEnd: endDate,
      }, mockPassport);

      reservation.accept();
      reservation.requestClose();

      expect(reservation.closeRequested).toBe(true);
    });
  });
});