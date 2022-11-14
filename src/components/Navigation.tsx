import React, { useRef } from "react";
import { Link } from "react-router-dom";

interface Props {
    cartCount: number;
    onSearch: Function;
    isSearching : boolean;
}
const Navigation = ({cartCount, onSearch, isSearching}: Props) => {
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
                        <input type="search" maxLength={28} onChange={e => checkKeyword(e.target.value)} className="bodytext1" id="input-search" placeholder="Cari menu ..." disabled={isSearching ? true : false}/>
                        <Link to="cart" className="h-100 d-flex align-items-center justify-content-center ml-3 text-decoration-none" style={{width: '48px'}}>
                            <i className="fi fi-rs-shopping-cart color-black300 headline4"></i>
                            {cartCount > 0 && <span className="badge-cart badge badge-pill background-green500 caption semibold text-white text-center">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>
                    </div>
                </form>
            </div>
        </nav>
    );
};

export default Navigation;