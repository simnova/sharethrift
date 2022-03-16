import { SearchResultListing } from "./components/search-result-listing"

export const Listings: React.FC<any> = (props) => {
  const results = (data:any) => {
    return data.filter((x:any) => x !== null).map((listing:any, index:number) => {
      return(
        <div key={index} >
          <SearchResultListing data={listing} />
        </div>
      )
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {results(props.data)}
    </div>

  )
}