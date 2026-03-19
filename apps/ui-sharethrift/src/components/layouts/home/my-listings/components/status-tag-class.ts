// Shared helper for mapping listing statuses to CSS tag class names.
// Extracted to eliminate duplication and potential circular imports between table and card components.

export type ListingStatus =
  | 'Active'
  | 'Paused'
  | 'Reserved'
  | 'Expired'
  | 'Draft'
  | 'Blocked'
  | 'Cancelled';

export function getStatusTagClass(status: string): string {
  switch (status) {
    case 'Active':
      return 'activeTag';
    case 'Paused':
      return 'pausedTag';
    case 'Reserved':
      return 'reservedTag';
    case 'Expired':
      return 'expiredTag';
    case 'Draft':
      return 'draftTag';
    case 'Blocked':
      return 'blockedTag';
    case 'Cancelled':
      return 'cancelledTag';
    default:
      return '';
  }
}
