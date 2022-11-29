import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { formatMoney, slugify } from "../helper/others";
import CartModel from "../models/CartModel";
import ProductModel from "../models/ProductModel";
import TransactionModel from "../models/TransactionModel";

const TransactionCreate = () => {
    const [loading, setLoading] = useState(false);
    const [trx, setTrx] = useState<TransactionModel>({
        code: '',
        status: true,
        chair: '',
        name: '',
        accepted: true
    });
    const [lastFocus, setLastFocus] = useState(0);
    const total = useRef(0);
    const [onSearch, setOnSearch] = useState(false);
    const keyword = useRef<string>('');
    const [menu, setMenu] = useState<ProductModel[]>([]);

    const searchMenu = (e : FormEvent) => {
        e.preventDefault();
        if(keyword.current === ''){
            Swal.fire({
                title: 'Perhatian',
                text: "Kata kunci tidak boleh kosong",
                icon: 'error',
                confirmButtonText: 'Mengerti',
            })
        }else{
            // merge menu and trx.menu
            // for (let i = 0; i < menu.length; i++) {
            //     for (let j = 0; j < trx.menu.length; j++) {
            //         if(menu[i].id === trx.menu[j].id){
            //             menu[i].qty = trx.menu[j].qty;
            //             menu[i].note = trx.menu[j].note;
            //         }
            //     }
            // }

            menu.filter((item) => {
                return item.name.toLowerCase().includes(keyword.current.toLowerCase());
            });
            setMenu(menu);

            setOnSearch(true);
            setTimeout(() => {
                setOnSearch(false);
            }, 2000);
        }
    }

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
                // update menu
                let newMenu = menu.map((item : ProductModel) => {
                    if(item.id === id){
                        item.qty = 0;
                        item.note = '';
                    }
                    return item;
                });
                setMenu(newMenu);
                calculateTotal(newMenu);
            }
        })
    }

    const updateNoteCart = (e : FormEvent, id : number) => {
        const note = (e.target as HTMLInputElement).value;
        let newCart = menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, note: note}
            }
            return item;
        });
        setMenu(newCart);
    }

    const removeQtyCart = (id : number) => {
        let newCart = menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: item.qty - 1}
            }
            return item;
        });
        setMenu(newCart);
        calculateTotal(newCart);
    }

    const addQtyCart = (id : number) => {
        let newCart = menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: item.qty + 1}
            }
            return item;
        });
        setMenu(newCart);
        calculateTotal(newCart);
    }

    const updateQtyCart = (e : FormEvent, id : number) => {
        const qty = (e.target as HTMLInputElement).value;
        let newCart = menu.map((item : CartModel) => {
            if(item.id === id){
                return {...item, qty: parseInt(qty)}
            }
            return item;
        });
        setMenu(newCart);
        calculateTotal(newCart);
    }

    const calculateTotal = (newCart : CartModel[] = []) => {
        let newTotal = 0;
        if(newCart.length === 0){
            // filter qty from menu
            menu.filter((item) => item.qty > 0).forEach((item : CartModel) => {
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
            </div>
            </>
        )
    }

    const confirmTransaction = () => {
        Swal.fire({
            title: 'Konfirmasi Transaksi',
            text: "Apakah anda yakin ingin menkonfirmasi transaksi ini?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, lanjutkan',
        }).then((result) => {
            if (result.isConfirmed) {
                setTrx({...trx, status: true});
            }
        })
    }

    const addMenuQty = (id : number) => {
        let newMenu = menu.map((item : ProductModel) => {
            if(item.id === id){
                return {...item, qty: item.qty + 1}
            }
            return item;
        });
        setMenu(newMenu);

        let count = 0;
        let newCart = menu.map((item : CartModel) => {
            if(item.id === id){
                count++;
                return {...item, qty: item.qty + 1}
            }
            return item;
        });

        if(count === 0){
            let newMenu = menu.filter((item : ProductModel) => item.id === id);
            newCart.push({
                id: newMenu[0].id,
                name: newMenu[0].name,
                price: newMenu[0].price,
                qty: 1,
                note: ''
            });
        }
        setMenu(newCart);
        calculateTotal(newCart);
    }

    const minMenuQty = (id : number) => {
        if(menu.filter((item : CartModel) => item.id === id)[0].qty === 1){
            deleteCart(id);
        }else{
            let newMenu = menu.map((item : ProductModel) => {
                if(item.id === id){
                    return {...item, qty: item.qty - 1}
                }
                return item;
            });
            setMenu(newMenu);
            calculateTotal(newMenu);
        }
        
    }

    const MenuItem = ({menu} : {menu : ProductModel}) => {
        return (
            <div className="menu-item my-2 p-3 d-flex flex-column w-100">
                <div className="d-flex flex-row w-100">
                    <div className="flex-column flex-fill">
                        <p className="bodytext1 color-green900 max-line-2 semibold m-0 pb-1">{menu.name}</p>
                        <p className="bodytext2 color-green900 semibold m-0">Rp {formatMoney(menu.price)}</p>
                    </div>
                    <div className="content-qty d-flex align-items-center flex-row">
                        {menu.qty > 0 && 
                        <button onClick={() => minMenuQty(menu.id)} type="button" className="btn-qty btn-qty-minus bodytext2">-</button>}
                        {menu.qty > 0 && 
                        <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => {}} className={`textarea-${menu.id} text-center input-qty bodytext2 mx-2`} defaultValue={menu.qty}/>}
                        <button onClick={() => addMenuQty(menu.id)} type="button" className="btn-qty btn-qty-plus bodytext2">+</button>
                    </div>
                </div>
                {menu.qty > 0 && 
                <textarea className="caption m-0 w-100 mt-1 p-0" rows={1} placeholder="Tulis Catatan" onChange={(e) => {}} defaultValue={menu.note}></textarea>}
            </div>
        )
    }

    useEffect(() => {
        setLoading(false);
        let menu : ProductModel[] = [];
        for (let i = 0; i < 100; i++) {
            menu.push({
                id : i+1,
                name : 'Menu ' + i,
                price : 100000,
                qty : 0,
                note : ''
            });
        }
        setMenu(menu);
    }, []);

    return (
        <>
        <nav className="navbar fixed-top background-green500 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
            <div className="d-flex flex-row align-items-center py-0 w-100">
                <a href="#" onClick={() => history.back()} className="navbar-brand" title="back">
                    <i className="fi fi-sr-angle-left text-white headline6"></i>
                </a>
                <p className="mb-0 bodytext1 semibold text-white px-2 flex-fill">Tambah Pesanan</p>
                <a href="#" onClick={() => {}} data-toggle="modal" data-target="#ModalAddMenu" className="navbar-brand m-auto" title="add">
                    <i className="fi fi-br-plus text-white headline6"></i>
                </a>
            </div>
        </nav>
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0">
            <div className="section-product w-100" style={{marginTop: '80px', marginBottom: '120px'}}>
                {loading && <Loading height={`${window.innerHeight-56}px`}/>}

                {!loading && 
                <>
                <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-3 pt-4 pb-2">
                    <h1 className="headline6 color-green900 font-weight-bold p-0 m-0 w-100">
                        Informasi Pemesan: 
                    </h1>
                </div>

                <div className="container-customer d-flex flex-column p-3 mx-3 mt-3">
                    <p className="bodytext1 color-green900 px-0 m-0 mb-2 semibold">
                        Nama Pemesan :
                    </p>
                    <div className="input-group-custom d-flex flex-row p-0">
                        <input onChange={(e) => !trx.status && setTrx({...trx, name: e.target.value})} defaultValue={trx.name} type="text" maxLength={50} name="customerName" id="inputCustomerName" className="bodytext2 form-input" placeholder="Nama Pemesan"/>
                    </div>
                    <p className="bodytext1 color-green900 px-0 m-0 mb-2 mt-2 semibold">
                        Pilih Meja :
                    </p>
                    <div className="input-group-custom d-flex flex-row p-0">
                        <select onChange={(e) => !trx.status && setTrx({...trx, chair: e.target.value})} value={trx.chair} className="custom-select bodytext2 form-input" title="customerChair">
                            {Array.from(Array(100).keys()).map((item, index) => (
                                <option key={index} value={`Meja ${item+1}`}>Meja {item+1}</option>
                            ))}
                        </select>                        
                    </div>
                </div>

                <div id="container-product" className="container-product d-flex flex-column px-3">
                    {!loading && menu.filter((item : ProductModel) => item.qty > 0).length > 0 && 
                    <p className="bodytext1 color-green900 m-0 mb-2 mt-4 semibold">
                        Menu yang dipilih :
                    </p>}

                    {!loading && menu.filter((item : ProductModel) => item.qty > 0).length === 0 && 
                    <EmptyState desc="Silahkan tambahkan menu melalui tombol + di atas."/>}
                    
                    {!onSearch && menu.filter((item : ProductModel) => item.qty > 0).length > 0 && menu.filter((item : ProductModel) => item.qty > 0).map((item : ProductModel, index : number) => (
                        <CartItem cart={item} key={`cart-${index}`}/>
                    ))}
                </div>
                </>}

                

            </div>
        </main>

        {!loading && 
        <div style={{minHeight: '80px'}} className="container-checkout-cart justify-content-center py-3 px-3 d-flex fixed-bottom bg-white col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto flex-column">
            <div className="d-flex flex-column align-items-center w-100">
                <div className="d-flex flex-row w-100">
                    <p className="m-0 bodytext2 color-green900 semibold flex-fill">
                        Total Bayar
                    </p>
                    <p className="m-0 headline6 color-green900 semibold">
                        Rp {formatMoney(total.current)}
                    </p>
                </div>
                <button disabled={menu.filter((item : ProductModel) => item.qty > 0).length > 0 ? false : true} onClick={() => confirmTransaction()} className="mt-2 button-message w-100 bodytext2 semibold text-white text-center background-green500" type="button">
                    Konfirmasi
                </button>
            </div>
            
        </div>
        }
        

        {/* modal */}
        <div className="modal fade" id="ModalAddMenu" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-slideout col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" role="document">
                <div className="modal-content" style={{maxHeight: `${window.innerHeight-80}px`}}>
                    <div className="modal-header">
                        <div className="d-flex flex-wrap">
                            <h6 className="modal-title semibold headline6 color-black500" id="exampleModalLabel">Tambah Menu</h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <i className="color-black500 fi fi-br-cross headline6"></i>
                            </button>
                        </div>

                        <form onSubmit={(e) => searchMenu(e)} className="d-flex flex-column mt-3">
                            <div className="input-group-search d-flex flex-row pl-3" style={{height: '50px', backgroundColor : '#F1F1F1'}}>
                                <i className="fi fi-rr-search"></i>
                                <input type="search" readOnly={onSearch ? true : false} onChange={(e) => keyword.current = e.target.value} name="keyword" id="inputKeyword" className="bodytext2 form-input" placeholder="Cari menu ..."/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-body pt-0">
                        {onSearch && <Loading height="260px"/>}

                        {menu.length === 0 && !onSearch &&
                        <EmptyState 
                            maxWidth="400px"
                            title={keyword.current === '' ? 'Cari Menu' : 'Menu tidak ditemukan'}
                            desc={keyword.current === '' ? 'Ketikkan kata kunci untuk menampilkan menu' : 'Silahkan gunakan kata kunci lain'} />}

                        {!onSearch && 
                            <>
                            {menu.length > 0 && <p className="m-0 p-0 semibold bodytext2 mb-2">Daftar Menu</p>}
                            {menu.map((item : ProductModel, index : number) => <MenuItem menu={item} key={`menu-${index}`}/>)}
                            </>}
                    </div>
                </div>
            </div>
        </div>
        {/* modal */}
        </>
    );
}

export default TransactionCreate;