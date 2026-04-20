import type { ListingPage } from '../listing.page.ts';

export type UiListingPage = Pick<
	ListingPage,
	'fillForm' | 'clickSaveDraft' | 'clickPublish'
>;

export type E2EListingPage = Pick<
	ListingPage,
	| 'titleInput'
	| 'homeCreateListingButton'
	| 'fillForm'
	| 'clickPublish'
	| 'saveDraftButton'
	| 'publishButton'
	| 'firstValidationError'
	| 'loadingButton'
	| 'modal'
	| 'viewDraftButton'
	| 'viewListingButton'
	| 'listingTitleCell'
	| 'statusTagInRow'
>;
