import { MockListingsPage } from '../components/mock-listings-page';

interface ListingsProps {
  readonly loggedIn?: boolean;
}

export default function Listings({ loggedIn = true }: ListingsProps) {
  return <MockListingsPage loggedIn={loggedIn} />;
}


// NOTE : ---------> Just for testing if you want to see connection (apollo) is fine
// import { useQuery, gql } from "@apollo/client";
// import { useEffect } from "react";

// const FAKE_LISTINGS_QUERY = gql`
//   query FakeListings {
//     listings {
//       id
//       title
//       price
//     }
//   }
// `;

// export default function Listings() {
//   const { data, loading, error } = useQuery(FAKE_LISTINGS_QUERY);
//   useEffect(() => {
//     if (data) {
//       console.log("Fetched listings:", data.listings);
//     }
//   }, [data]);
  

//   return (
//     <div>
//       <h2>Listings Page</h2>
//     </div>
//   );
// }
