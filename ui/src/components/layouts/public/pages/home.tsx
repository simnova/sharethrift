import React from 'react';
import Login from '../../../../components/login';
import { ListingsContainer } from './listings-container';
import { SearchBox } from '../components/search-box';

export const Home: React.FC<any> = (props) => {

  return (
    <div>
      <div className="bg-cover h-[300px] sm:h-64 md:h-96 lg:h-[400px] p-1 md:p-5 bg-right-bottom relative" style={{backgroundImage: 'url(/images/cyclist.jpg)'}}>
        <div className="bg-black bg-opacity-50 p-2 m-1 sm:m-5 max-w-[400px] "  >
        <h1 className="text-lg md:text-2xl" style={{color:"var(--color-background-default)"}}>Wherever you are, 
borrow what you need.</h1>
        </div>

        <div className="bg-black bg-opacity-50 p-2 m-1 sm:m-5 absolute bottom-0 right-0 text-white text-sm md:text-base">
            <div className="inline-block sm:block align-middle mr-5 mb-5 sm:m-0">Jama Karmo</div>
            <div className="inline-block sm:block align-bottom "> 
            borrowing bike for 3 days<br/>
reconnecting with nature

            </div>

        </div>
        
      </div>
      <div className="pt-8 pb-8">
      <SearchBox />
      <ListingsContainer />

      </div>

    </div>
     
  
  )
}