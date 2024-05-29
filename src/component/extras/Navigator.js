import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
// import {makeStyles} from "@mui/styles";

const Navigator = (props) => {
  const location = useLocation();
  // const useStyles = makeStyles(theme => ({
  //   customTooltip: {
  //     // I used the rgba color for the standard "secondary" color
  //     backgroundColor: 'rgba(220, 0, 78, 0.8)',
  //   },
  //   customArrow: {
  //     color: 'rgba(220, 0, 78, 0.8)',
  //   },
  // }));

  const { name, path, navIcon, onClick ,navSVG,navIconImg} = props;

  return (
    <li onClick={onClick} key={`navHade`}>
      <Tooltip title={name} placement="right" >
        <Link
          to={{ pathname: path }}
          className={`${location.pathname === path && "activeMenu"} betBox`}
        >
          <div>
            {/* {navIcon && <i className={`${navIcon}`}></i>} */}
            {navIconImg ? (
                <>
                  <img src={navIconImg} alt=""/>
                </>
              ) : navIcon ? (
                <>
                  <i className={navIcon}></i>
                </>
              ) : (
                <>{navSVG}</>
              )}
            <span className="text-capitalize">{name}</span>
          </div>
          {props?.children && <i className="ri-arrow-right-s-line fs-18"></i>}
        </Link>
      </Tooltip>
      {/* If Submenu */}
      <Tooltip title={name} placement="right">
        {props.children}
      </Tooltip>
    </li>
  );
};

export default Navigator;
