import React from 'react';
import { useNavigate } from 'react-router-dom';

const Title = (props) => {
  const navigate = useNavigate()
  const { name, total, totalShow } = props;

  const handleDashboardClick = () => {
    navigate("/admin/adminDashboard");
  };
  return (
    <div className='mainTitle d-flex align-items-center justify-content-between cursor-pointer'>
      <div className="title">{name}</div>
      {
        totalShow === true && (
          <div className="total"><h6>Total:<span>{total}</span></h6></div>
        )
      }

      {/* <div className="titlePath">
        <span  onClick={handleDashboardClick}>Dashboard  <i className="ri-arrow-right-s-line"></i></span>
        <span className='text-second'> {name}</span>
      </div> */}
    </div>
  );
}

export default Title;
