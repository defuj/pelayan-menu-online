import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import defaultImageProfile from '../assets/icons/default-image-profile.svg';
import EmptyState from "../components/EmptyState";
import ImageSliderNav from "../components/ImageSliderNav";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Swal from "sweetalert2";
import HistoryModel from "../models/HistoryModel";

const TransactionHistory = React.memo(() => {
    const [starting, setStarting] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [notifCount, setNotifCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [onLoadMore, setOnLoadMore] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [minHeight, setMinHeight] = useState('400px');
    const [history, setHistory] = useState<HistoryModel[]>([]);
    const totalPage = useRef(1);
    const page = useRef(1);
    const [currentPage, setCurrentPage] = useState(1);
    const masterData = useRef<HistoryModel[]>([]);

    const logout = () => {
        Swal.fire({
            title: 'Keluar dari akun?',
            text: "Anda akan keluar dari akun ini",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, keluar',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        })
    }

    interface HistoryProps {
        history : HistoryModel
    }

    const searchMenu = (keyword : string) => {
        setKeyword(keyword);
        setIsSearching(true);

        if(keyword !== ''){
            // create 100 sample data history
            let historyData : HistoryModel[] = [];
            for (let i = 0; i < 100; i++) {
                historyData.push({
                    code: 'TRX-000' + i,
                    status: i % 2 === 0 ? true : false,
                    chair: 'Kursi ' + i,
                    name: 'Nama ' + i
                });
            }

            const result = historyData.filter((item) => {
                return item.code.toLowerCase().includes(keyword.toLowerCase()) || item.chair.toLowerCase().includes(keyword.toLowerCase()) || item.name.toLowerCase().includes(keyword.toLowerCase());
            });

            manageData(result);
            setLoading(false);
            setIsSearching(false);
        }else{
            getHistory();
            setLoading(true);
            setIsSearching(false);
        }
    }

    const HistoryItem = ({history} : HistoryProps) => {
        return (
            <Link to={`trx/${history.code}`} className="product-items d-flex flex-row" key={history.code}>
                <p className={history.status === false ? 'caption m-0 text-product-badge-new' : 'caption m-0 text-product-badge'}>{history.status === false ? 'Belum Selesai' : 'Selesai'}</p>
                <span className="my-auto mr-3 pt-3">
                    <i className="fi fi-sr-receipt headline4 color-green500"></i>
                </span>
                <div className="d-flex flex-fill flex-column my-auto">
                    <p className="bodytext1 color-green900 max-line-2 semibold m-0">{history.code}</p>
                    <p className="caption color-green800 max-line-2 mx-0 my-0">{history.chair}</p>
                </div>
                <i className="fi fi-sr-angle-right bodytext2 color-green900 my-auto"></i>
            </Link>
        );
    };

    const getHistory = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // create 100 sample data history
            let historyData : HistoryModel[] = [];
            for (let i = 0; i < 100; i++) {
                historyData.push({
                    code: 'TRX-000' + i,
                    status: i % 2 === 0 ? true : false,
                    chair: 'Kursi ' + i,
                    name: 'Nama ' + i
                });
            }
            manageData(historyData);
        }, 2000);
    };

    const showData = (newPage : number) => {
        page.current = newPage;

        if(masterData.current.length > 0){
            let productData = masterData.current;
            let productDataChunk= [];
            let chunkSize = 8;
            for (let i = 0; i < productData.length; i += chunkSize) {
                productDataChunk.push(productData.slice(i, i + chunkSize));
            }

            try {
                if(newPage === 1){
                    setHistory(productDataChunk[0]);
                }else{
                    setHistory([...history, ...productDataChunk[newPage - 1]]);
                }
            } catch (error) {}
            setOnLoadMore(false);
        }else{
            setHistory([]);
            setOnLoadMore(false);
        }
    }

    const manageData = (data : HistoryModel[]) => {
        if(data.length > 0){
            // split data to every 8 item/page
            let productData = data;
            let productDataChunk = [];
            let chunkSize = 8;
            for (let i = 0; i < productData.length; i += chunkSize) {
                productDataChunk.push(productData.slice(i, i + chunkSize));
            }
            totalPage.current = productDataChunk.length;
        }else{
            totalPage.current = 1;
        }
        
        masterData.current = data;
        page.current = 1;
        setCurrentPage(1);
        showData(1); 
    }

    const loadOnScroll = () => {
        if ((window.innerHeight + document.documentElement.scrollTop) >= (document.documentElement.scrollHeight - 100)) {
            if(page.current <= totalPage.current) {
                setCurrentPage(page.current + 1);
                setOnLoadMore(true);
            }
        }
    }

    window.onscroll = () => loadOnScroll();
    
    useEffect(() => {
        if(starting){
            setTimeout(() => {
                setStarting(false);
                getHistory();
            }
            , 2000);   
        }

        if(currentPage > page.current){
            setTimeout(() => {
                setOnLoadMore(false);
                showData(currentPage);
            },1000);
        }
    }, [currentPage]);

    return (
        <>
        {!starting && <Navigation notifCount={notifCount} onSearch={searchMenu} isSearching={isSearching} onLoggout={logout}/>}
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0">
            {!starting && 
            <div className="section-product w-100">
                <div className="product-divider w-100">
                </div>

                <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-4 pt-4 pb-2">
                    <h1 className="headline5 color-green900 font-weight-bold p-0 m-0 w-100">
                        {keyword === '' ? 'Riwayat Pesanan' : 'Hasil Pencarian'}
                    </h1>
                    {keyword === '' && 
                    <p className="headline6 color-green900 px-0 m-0">
                        {/* Menampilkan riwayat pesanan hari ini */}
                        {masterData.current.length === 0 ? '_' : masterData.current.length} Riwayat transaksi ditemukan
                    </p>
                    }
                    {keyword !== '' &&
                    <p className="headline6 color-green900 px-0 m-0">
                        {masterData.current.length} hasil untuk kata kunci “<span className="color-green500 semibold px-0 m-0">{keyword}</span>”
                    </p>
                    }
                    
                </div>
                
                {loading && <Loading height={`${window.innerHeight-161}px`}/>}

                {!loading && history.length === 0 && 
                <EmptyState minHeight={minHeight} desc={keyword !== '' ? 
                    `Maaf “<span class="color-green500 semibold px-0 m-0">${keyword}</span>” tidak ditemukan coba gunakan kata kunci lain.` : 
                    'Belum ada pesanan hari ini'}/>}

                {!loading && history.length > 0 &&
                    <>
                    <div id="container-product" className="container-product d-flex flex-column px-3">
                        {!loading && history.length > 0 && history.map((history : HistoryModel,index : number) => <HistoryItem history={history} key={`history-${index}`}/>)}
                    </div>
                    {onLoadMore && <Loading height="100px"/>}
                    </>
                }
                
            </div>
            }

            {starting && <Loading height={`${window.innerHeight}px`}/>}
        </main>
        </>
    )
})

export default TransactionHistory;