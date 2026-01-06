import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

interface ReservationRequestDataSource
	extends MongoDataSource<Models.ReservationRequest.ReservationRequest> {}

export class ReservationRequestDataSourceImpl
	extends MongoDataSourceImpl<Models.ReservationRequest.ReservationRequest>
	implements ReservationRequestDataSource {}
