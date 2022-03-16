import { PublicLayout } from './public-layout';
import { Routes, Route, useParams } from "react-router-dom";
import { Home } from './pages/home';
import { Search  } from './pages/search';


export const Public: React.FC<any> = (props) => {
  return (
    <>
      <Routes>
        <Route path="" element={<PublicLayout /> } >
          <Route path="/" element={<Home />} />
          <Route path="listings" element={<Search/>} />
        </Route>
      </Routes>
    </>
  );

}