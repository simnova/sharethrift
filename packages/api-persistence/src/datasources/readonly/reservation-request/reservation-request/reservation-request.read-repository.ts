import type { Domain } from '@sthrift/api-domain';
import { Types } from 'mongoose';
import type { ModelsContext } from '../../../../index.ts';
import { ReservationRequestDataSourceImpl, type ReservationRequestDataSource } from './reservation-request.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';

export interface ReservationRequestReadRepository {
    getAll: (options?: FindOptions) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
    getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
    getByReserverId: (reserverId: string, options?: FindOptions) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]>;
}

export class ReservationRequestReadRepositoryImpl implements ReservationRequestReadRepository {
    private readonly mongoDataSource: ReservationRequestDataSource;
    private readonly converter: ReservationRequestConverter;
    private readonly passport: Domain.Passport;

    /**
     * Constructs a new ReservationRequestReadRepositoryImpl.
     * @param models - The models context containing the ReservationRequest model.
     * @param passport - The passport object for domain access.
     */
    constructor(models: ModelsContext, passport: Domain.Passport) {
        this.mongoDataSource = new ReservationRequestDataSourceImpl(models.ReservationRequest.ReservationRequest);
        this.converter = new ReservationRequestConverter();
        this.passport = passport;
    }

    /**
     * Retrieves all ReservationRequest entities.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to an array of ReservationRequestEntityReference objects.
     */
    async getAll(options?: FindOptions): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> {
        const result = await this.mongoDataSource.find({}, options);
        return result.map(doc => this.converter.toDomain(doc, this.passport));
    }

    /**
     * Retrieves a ReservationRequest entity by its ID.
     * @param id - The ID of the ReservationRequest entity.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to a ReservationRequestEntityReference object or null if not found.
     */
    async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
        const result = await this.mongoDataSource.findById(id, options);
        if (!result) { return null; }
        return this.converter.toDomain(result, this.passport);
    }

    async getByReserverId(reserverId: string, options?: FindOptions): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]> {
        const result = await this.mongoDataSource.find({ reserver:  new Types.ObjectId(reserverId) }, options); 
        return result.map(doc => this.converter.toDomain(doc, this.passport));
    }
}

export const getReservationRequestReadRepository = (
    models: ModelsContext,
    passport: Domain.Passport
) => {
    return new ReservationRequestReadRepositoryImpl(models, passport);
};