import React from 'react';
import { useSelector } from 'react-redux';
import { isLoading } from './allSelector';


const Loader = () => {


  const roleLoader = useSelector(isLoading)

  return (
    <>
      {roleLoader && (
        <div className='loader'>
          <div className='loaderShow'>
            <div class="three-body">
              <div class="three-body__dot"></div>
              <div class="three-body__dot"></div>
              <div class="three-body__dot"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Loader;
