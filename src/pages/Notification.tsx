import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import NotificationModel from "../models/NotificationModel";

const Notification = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<NotificationModel[]>([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // setData([
            //     {
            //         id: 1,
            //         status: true,
            //         chair: 'Kursi 1',
            //         name: 'Nama 1',
            //         code: 'TRX-0001'
            //     },
            //     {
            //         id: 2,
            //         status: false,
            //         chair: 'Kursi 2',
            //         name: 'Nama 2',
            //         code: 'TRX-0002'
            //     },
            //     {
            //         id: 3,
            //         status: true,
            //         chair: 'Kursi 3',
            //         name: 'Nama 3',
            //         code: 'TRX-0003'
            //     },
            //     {
            //         id: 4,
            //         status: false,
            //         chair: 'Kursi 4',
            //         name: 'Nama 4',
            //         code: 'TRX-0004'
            //     },
            //     {
            //         id: 5,
            //         status: true,
            //         chair: 'Kursi 5',
            //         name: 'Nama 5',
            //         code: 'TRX-0005'
            //     }]);
        }, 3000);
    }, []);

    interface NotificationProps {
        notification : NotificationModel
    }
    const NotificationItem = ({notification} : NotificationProps) => {
        return (
            <Link to={`/trx/${notification.code}`} className="product-items d-flex flex-row" key={notification.code}>
                <span className="my-auto mr-3 pt-2">
                    <i className="fi fi-sr-receipt headline4 color-green500"></i>
                </span>
                <div className="d-flex flex-fill flex-column my-auto">
                    <p className="bodytext1 color-green900 max-line-2 semibold m-0">{notification.code}</p>
                    <p className="caption color-green800 max-line-2 mx-0 my-0">{notification.chair}</p>
                </div>
                <i className="fi fi-sr-angle-right bodytext2 color-green900 my-auto"></i>
            </Link>
        );
    };
    
    return (
        <>
        <nav className="navbar fixed-top background-green500 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
            <div className="d-flex flex-row align-items-center py-0 w-100">
                <a href="#" onClick={() => history.back()} className="navbar-brand" title="back">
                    <i className="fi fi-sr-angle-left text-white headline6"></i>
                </a>
                <p className="mb-0 bodytext1 semibold text-white px-2 flex-fill">Notifikasi</p>
            </div>
        </nav>
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0">
            <div className="section-product w-100" style={{marginTop: '80px'}}>
                {data.length !== 0 && 
                <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-4 pt-4 pb-2">
                    <h1 className="headline5 color-green900 font-weight-bold p-0 m-0 w-100">
                        Pesanan Masuk
                    </h1>
                    <p className="headline6 color-green900 px-0 m-0">
                        Segera konfirmasi, untuk melanjutkan pemesanan.
                    </p>
                </div>}
                
                
                {loading && <Loading height={`${window.innerHeight-56}px`}/>}

                {!loading && data.length === 0 && 
                <EmptyState minHeight={`${window.innerHeight-56}px`} desc="Belum ada pesanan lagi"/>}

                {!loading && data.length > 0 &&
                    <div id="container-product" className="container-product d-flex flex-column px-3">
                        {!loading && data.length > 0 && data.map((data : NotificationModel,index : number) => <NotificationItem notification={data} key={`notification-${index}`}/>)}
                    </div>
                }
            </div>
        </main>
        </>
    );
}

export default Notification;