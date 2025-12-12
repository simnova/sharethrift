import type { Models } from "@sthrift/data-sources-mongoose-models";
import { MongoDataSourceImpl, type MongoDataSource } from "../../mongo-data-source.ts";

interface ReservationRequestDataSource extends MongoDataSource<Models.ReservationRequest.ReservationRequest> {}

export class ReservationRequestDataSourceImpl extends MongoDataSourceImpl<Models.ReservationRequest.ReservationRequest> implements ReservationRequestDataSource {}