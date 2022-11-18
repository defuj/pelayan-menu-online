import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../components/Loading";
import { formatMoney, slugify } from "../helper/others";
import CartModel from "../models/CartModel";
import TransactionModel from "../models/TransactionModel";
const TransactionDetail = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [trx, setTrx] = useState<TransactionModel>({
        code: '',
        status: false,
        chair: '',
        name: '',
        menu: []
    });
    const [lastFocus, setLastFocus] = useState(0);

    const total = useRef(0);

    const deleteCart = (id : number) => {
        Swal.fire({
            title: 'Hapus item?',
            text: "Anda akan menghapus item ini",
            icon: 'error',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, hapus',
        }).then((result) => {
            if (result.isConfirmed) {
                let newCart = trx.menu.filter((item : CartModel) => item.id !== id);
                setTrx({...trx, menu: newCart});
                calculateTotal(newCart);
            }
        })
    }

    const updateNoteCart = (e : FormEvent, id : number) => {
        const note = (e.target as HTMLInputElement).value;
        let newCart = trx.menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, note: note}
            }
            return item;
        });
        setTrx({...trx, menu: newCart});
    }

    const removeQtyCart = (id : number) => {
        let newCart = trx.menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: item.qty - 1}
            }
            return item;
        });
        setTrx({...trx, menu: newCart});
        calculateTotal(newCart);
    }

    const addQtyCart = (id : number) => {
        let newCart = trx.menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: item.qty + 1}
            }
            return item;
        });
        setTrx({...trx, menu: newCart});
        calculateTotal(newCart);
    }

    const updateQtyCart = (e : FormEvent, id : number) => {
        const qty = (e.target as HTMLInputElement).value;
        let newCart = trx.menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: parseInt(qty)}
            }
            return item;
        });
        setTrx({...trx, menu: newCart});
        calculateTotal(newCart);
    }

    const calculateTotal = (newCart : CartModel[] = []) => {
        let newTotal = 0;
        if(newCart.length === 0){
            trx.menu.forEach((item : CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(item.price.toString());
            });
        }else{
            newCart.forEach((item : CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(item.price.toString());
            });
        }
        
        total.current = newTotal;
    }

    const CartItem = ({cart} : {cart : CartModel}) => {
        return (
            <>
            {!trx.status && 
            <div title={slugify(cart.name).toString()} className="cart-items w-100 flex-column my-2" key={cart.name}>
                <div className="d-flex align-items-center flex-row w-100">
                    <div className="flex-column flex-fill">
                        <p className="bodytext1 color-green900 max-line-2 semibold m-0 pb-1">{cart.name}</p>
                        <p className="bodytext2 color-green900 semibold m-0">Rp {formatMoney(cart.price)}</p>
                        <div className="content-qty d-flex align-items-center flex-row mt-2">
                            <button onClick={() => cart.qty > 1 ? removeQtyCart(cart.id) : deleteCart(cart.id)} type="button" className="btn-qty btn-qty-minus bodytext2">-</button>
                            {cart.id === lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty} autoFocus/>}
                            {cart.id !== lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty}/>}
                            <button onClick={() => {addQtyCart(cart.id)}} type="button" className="btn-qty btn-qty-plus bodytext2">+</button>
                        </div>
                    </div>
                    <a href="#" className="navbar-brand" title="delete" onClick={() => deleteCart(cart.id)}>
                        <i className="fi fi-rr-trash color-black600 headline5"></i>
                    </a>
                </div>
                <textarea className="caption m-0 w-100 mt-3" rows={1} placeholder="Tulis Catatan" onChange={(e) => updateNoteCart(e, cart.id)} defaultValue={cart.note}></textarea>
            </div>}
            </>
        )
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            let trxData : TransactionModel = {
                code: id || '',
                status: false,
                chair: 'Meja 1',
                name: 'Otongsuke',
                menu: []
            };

            for (let i = 0; i < 10; i++) {
                trxData.menu.push({
                    id : i+1,
                    name : 'Menu ' + i,
                    price : 100000,
                    qty : 1,
                    note : i % 2 === 0 ? 'Catatan ' + i : ''
                });
            }

            setTrx(trxData);
            setLoading(false);
            calculateTotal(trxData.menu);
        }, 2000);
    }, []);

    return (
        <>
        <nav className="navbar fixed-top background-green500 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
            <div className="d-flex flex-row align-items-center py-0 w-100">
                <a href="#" onClick={() => history.back()} className="navbar-brand" title="back">
                    <i className="fi fi-sr-angle-left text-white headline6"></i>
                </a>
                <p className="mb-0 bodytext1 semibold text-white px-2 flex-fill">Detail Pesanan</p>
                <a href="#" onClick={() => {}} className="navbar-brand m-auto" title="add">
                    <i className="fi fi-br-plus text-white headline6"></i>
                </a>
            </div>
        </nav>
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0">
            <div className="section-product w-100" style={{marginTop: '80px', marginBottom: '80px'}}>
                <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-3 pt-4 pb-2">
                    <h1 className="headline6 color-green900 font-weight-bold p-0 m-0 w-100">
                        Pesanan {id}
                    </h1>
                    <p className="bodytext1 color-green900 px-0 m-0">
                        Segera konfirmasi, untuk melanjutkan pemesanan.
                    </p>
                </div>
                
                {loading && <Loading height={`${window.innerHeight-56}px`}/>}

                <div className="container-customer d-flex flex-column p-3 mx-3 mt-3">
                    <p className="bodytext1 color-green900 px-0 m-0 mb-2 semibold">
                        Nama Pemesan :
                    </p>
                    <div className="input-group-custom d-flex flex-row p-0">
                        <input onChange={(e) => setTrx({...trx, name: e.target.value})} defaultValue={trx.name} type="text" maxLength={50} name="customerName" id="inputCustomerName" className="bodytext2 form-input" placeholder="Nama Pemesan"/>
                    </div>
                    <p className="bodytext1 color-green900 px-0 m-0 mb-2 mt-2 semibold">
                        Pilih Meja :
                    </p>
                    <div className="input-group-custom d-flex flex-row p-0">
                        <select onChange={(e) => setTrx({...trx, chair: e.target.value})} value={trx.chair} className="custom-select bodytext2 form-input" title="customerChair">
                            {Array.from(Array(10).keys()).map((item, index) => (
                                <option key={index} value={`Meja ${item+1}`}>Meja {item+1}</option>
                            ))}
                        </select>                        
                    </div>
                </div>

                <div id="container-product" className="container-product d-flex flex-column px-3">
                    {!loading && trx.menu.length > 0 && 
                    <p className="bodytext1 color-green900 m-0 mb-2 mt-4 semibold">
                        Menu yang dipilih :
                    </p>}
                    
                    {!loading && trx.menu.length > 0 && trx.menu.map((cart : CartModel,index : number) => <CartItem cart={cart} key={`cart-${index}`}/>)}
                </div>

                {/* {!loading && cart.length > 0 &&
                    <div id="container-product" className="container-product d-flex flex-column px-3">
                        {!loading && data.length > 0 && data.map((data : NotificationModel,index : number) => <NotificationItem notification={data} key={`notification-${index}`}/>)}
                    </div>
                } */}
            </div>
        </main>

        <div style={{minHeight: '80px'}} className="container-checkout-cart py-3 px-3 d-flex fixed-bottom bg-white col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto flex-column">
            <div className="d-flex flex-row align-items-center w-100">
                <div className="d-flex flex-column w-50">
                    <p className="m-0 bodytext2 color-green900 semibold">
                        Total Bayar
                    </p>
                    <p className="m-0 headline6 color-green900 semibold">
                        Rp {formatMoney(total.current)}
                    </p>
                </div>
                <button onClick={() => {}} className="button-message w-50 flex-fill bodytext2 semibold text-white text-center background-green500" type="button">
                    Konfirmasi
                </button>
            </div>
        </div>
        </>
    );
}

export default TransactionDetail;