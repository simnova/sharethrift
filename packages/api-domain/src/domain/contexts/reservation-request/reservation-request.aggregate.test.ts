import { describe, it, expect } from 'vitest';
import { ReservationRequest, type ListingEntityReference, type ReserverEntityReference } from './reservation-request.aggregate.ts';
import { ReservationRequestStates, ReservationRequestStateValue, ReservationPeriod } from './reservation-request.value-objects.ts';
import type { Passport } from '../passport.ts';

describe('ReservationRequest', () => {
  const mockPassport: Passport = { 
    reservationRequest: {
      forReservationRequest: () => ({
        determineIf: () => true,
      }),
    }
  } as Passport;

  // Helper functions for creating mock entity references
  const createMockListing = (id = 'listing-1'): ListingEntityReference => ({
    id,
    title: 'Mock Listing',
    description: 'Mock listing description',
  });

  const createMockReserver = (id = 'user-1'): ReserverEntityReference => ({
    id,
    name: 'Mock User',
    email: 'mock@example.com',
  });

  // Helper function to create full props for testing
  const createMockProps = (overrides = {}) => ({
    id: 'test-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    schemaVersion: '1',
    state: ReservationRequestStateValue.requested(),
    listing: createMockListing(),
    reserver: createMockReserver(),
    reservationPeriod: new ReservationPeriod({
      start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }),
    closeRequested: false,
    ...overrides,
  });

  // Use future dates for testing
  const getFutureDates = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // next week
    return { startDate, endDate };
  };

  describe('getNewInstance', () => {
    it('should create a new reservation request with REQUESTED state', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      expect(reservation.state.valueOf()).toBe(ReservationRequestStates.REQUESTED);
      expect(reservation.listing.id).toBe('listing-1');
      expect(reservation.reserver.id).toBe('user-1');
      expect(reservation.closeRequested).toBe(false);
      expect(reservation.schemaVersion).toBe('1');
    });

    it('should throw error if start date is after end date', () => {
      const { startDate, endDate } = getFutureDates();

      expect(() => {
        new ReservationPeriod({
          start: endDate.toISOString(), // reversed
          end: startDate.toISOString(),
        });
      }).toThrow('Reservation start date must be before end date');
    });
  });

  describe('accept', () => {
    it('should change state from REQUESTED to ACCEPTED', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.accept();

      expect(reservation.state.valueOf()).toBe(ReservationRequestStates.ACCEPTED);
    });

    it('should throw error if not in REQUESTED state', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.accept();

      expect(() => {
        reservation.accept();
      }).toThrow('Can only accept requested reservations');
    });
  });

  describe('cancel', () => {
    it('should cancel a REQUESTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.cancel();

      expect(reservation.state.valueOf()).toBe(ReservationRequestStates.CANCELLED);
    });

    it('should cancel a REJECTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.reject();
      reservation.cancel();

      expect(reservation.state.valueOf()).toBe(ReservationRequestStates.CANCELLED);
    });
  });

  describe('close', () => {
    it('should close an ACCEPTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.accept();
      reservation.close();

      expect(reservation.state.valueOf()).toBe(ReservationRequestStates.RESERVATION_PERIOD);
    });

    it('should throw error if not in ACCEPTED state', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      expect(() => {
        reservation.close();
      }).toThrow('Can only close accepted reservations');
    });
  });

  describe('requestClose', () => {
    it('should set closeRequested to true for ACCEPTED reservation', () => {
      const { startDate, endDate } = getFutureDates();
      const listing = createMockListing();
      const reserver = createMockReserver();
      const state = ReservationRequestStateValue.requested();
      const reservationPeriod = new ReservationPeriod({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      const props = createMockProps({
        state,
        listing,
        reserver,
        reservationPeriod,
      });

      const reservation = ReservationRequest.getNewInstance(
        props,
        state,
        listing,
        reserver,
        reservationPeriod,
        mockPassport
      );

      reservation.accept();
      reservation.requestClose();

      expect(reservation.closeRequested).toBe(true);
    });
  });
});