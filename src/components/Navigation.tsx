import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface Props {
    notifCount? : number;
    onSearch? : Function;
    onLoggout? : Function;
    isSearching? : boolean;
}
const Navigation = ({notifCount = 0, onSearch = () => {}, isSearching = false, onLoggout = () => {}}: Props) => {
    const search = useRef('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(search.current !== '') {
            onSearch(search.current);
        }
    }

    const checkKeyword = (keyword : string) => {
        search.current = keyword;
        if(keyword === '') {
            onSearch(keyword);
        }
    }
    return (
        <nav className="navbar fixed-top col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
            <div className="container-search-bar w-100 d-flex justify-content-start align-items-center flex-row">
                <form onSubmit={handleSearch} id="form-search" className="container-search form-search w-100 d-flex justify-content-between align-items-center" style={{height: '56px'}}>
                    <div className="input-group-search bg-white h-100">
                        <i className="fi fi-rr-search color-black400 mr-2 headline5"></i>
                        <input type="search" maxLength={28} onChange={e => checkKeyword(e.target.value)} className="bodytext1" id="input-search" placeholder="Cari transaksi ..." disabled={isSearching ? true : false}/>
                        <Link to="notification" className="h-100 d-flex align-items-center justify-content-center ml-3 text-decoration-none" style={{width: '48px'}}>
                            <i className="fi fi-rr-bell color-black300 headline4"></i>
                            {notifCount > 0 && <span className="badge-cart badge badge-pill background-green500 caption semibold text-white text-center">{notifCount > 99 ? '99+' : notifCount}</span>}
                        </Link>
                        <a onClick={() => onLoggout()} title="keluar" href="#" className="h-100 d-flex align-items-center justify-content-center ml-3 text-decoration-none" style={{width: '48px'}}>
                            <i className="fi fi-rr-sign-out-alt color-black300 headline4"></i>
                        </a>
                        
                    </div>
                </form>
            </div>
        </nav>
    );
};

export default Navigation;