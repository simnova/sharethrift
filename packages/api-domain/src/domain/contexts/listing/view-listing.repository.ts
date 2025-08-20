import { ViewListing } from '@sthrift/api-data-sources-mongoose-models/src/models/listing/view-listing.model';

export class ViewListingRepository {
  async findById(id: string) {
    return ViewListing.findById(id).populate('owner');
  }
}
