import { MockListingsPage } from '../components/mock-listings-page';

interface ListingsProps {
  readonly loggedIn?: boolean;
}

export default function Listings({ loggedIn = true }: ListingsProps) {
  return <MockListingsPage loggedIn={loggedIn} />;
}