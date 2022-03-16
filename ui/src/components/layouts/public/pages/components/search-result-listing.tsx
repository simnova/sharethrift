import { SearchResultImages } from "./search-result-images";
export const SearchResultListing: React.FC<any> = (props) => { 
  //<SearchResultImages data={props.data.photos} />
  const firstImage = (props.data.photos.length > 0) ? 'https://sharethrift.blob.core.windows.net/public/' + props.data.photos[0].documentId  :  undefined ;
  return (
    <div className="bg-white">
      <img src={firstImage} className="w-230 height-full object-center object-cover" />
      <h3>{props.data.title}</h3>
      <div>{props.data.description}</div>
    </div>
  );  
}