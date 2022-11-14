import React from "react";
import logo from '../assets/icons/sadigit.svg';
const BottomNavigation = () => {

    return (
        <nav className="navbar bottom-nav fixed-bottom navbar-expand col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 text-center m-auto">
            <img src={logo} alt="sadigit" style={{maxWidth: '116px'}} className="m-auto"/>
        </nav>
    )
}

export default BottomNavigation;