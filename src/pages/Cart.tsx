import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios, {restaurant} from '../helper/axios';
import { formatMoney, getNumber, slugify } from "../helper/others";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import CartModel from "../models/CartModel";
import Swal from "sweetalert2";
import { getCart, updateCart } from "../helper/session";

const Cart = React.memo(() => {
    const {restoSlug} = useParams();
    const [minHeight, setMinHeight] = useState('400px');
    const [starting, setStarting] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartModel[]>([]);
    const [notFoundEditing, setNotFoundEditing] = useState(true);
    const [customer, setCustomer] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [lastFocus, setLastFocus] = useState(0);
    const total = useRef(0);

    interface CartProps {
        cart : CartModel
    }

    const updateNoteCart = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const newCart = cart.map((item) => {
            if(item.id === id){
                const note = (e.target as HTMLInputElement).value;
                item.note = note;
            }
            return item;
        });

        let item = e.target as HTMLInputElement;
        //item.setAttribute("style", "height:" + (item.scrollHeight) + "px;overflow-y:hidden;");
        item.addEventListener('input', () => {
            item.style.height = "auto";
            item.style.height = (item.scrollHeight) + "px";
        });
        updateCart(restoSlug,newCart);
    }

    const addQtyCart = (id: number) => {
        const newCart = getCart(restoSlug).map((item: CartModel) => {
            if(item.id === id){
                item.qty += 1;
            }
            return item;
        });
        setCart(newCart);
        updateCart(restoSlug,newCart);
        calculateTotal();
    }

    const removeQtyCart = (id: number) => {
        const newCart = getCart(restoSlug).map((item: CartModel) => {
            if(item.id === id){
                item.qty -= 1;
            }
            return item;
        });
        setCart(newCart);
        updateCart(restoSlug,newCart);
        calculateTotal();
    }

    const updateQtyCart = (e: React.FormEvent, id: number) => {
        setLastFocus(id);
        let qty = (e.target as HTMLInputElement).value;
        const lastQty = cart.filter((item) => item.id === id)[0].qty;
        (e.target as HTMLInputElement).placeholder = `${lastQty}`;
        if(qty === ''){
            return;
        }

        if(qty === '0'){
            (e.target as HTMLInputElement).value = '1';
            return;
        }

        if(qty.length > 3){
            (e.target as HTMLInputElement).value = '999';
            return;
        }

        const newCart = getCart(restoSlug).map((item : CartModel) => {
            if(item.id === id){
                item.qty = parseInt(qty);
                console.log(`qty : ${parseInt(qty)}`);
            }
            return item;
        });

        updateCart(restoSlug,newCart);
        setCart(newCart);
        calculateTotal();
    }

    const deleteCart = (id: number) => {
        Swal.fire({
            title: 'Hapus menu ini?',
            text: "Apakah kamu ingin menghapus menu ini dari keranjang?",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, hapus',
        }).then((result) => {
            if (result.isConfirmed) {
                const newCart = cart.filter((item) => item.id !== id);
                setCart(newCart);
                updateCart(restoSlug,newCart);
                calculateTotal();
                changseSizeNotFound();
            }
        })
    }


    const calculateTotal = (newCart : CartModel[] = []) => {
        let newTotal = 0;
        if(newCart.length === 0){
            getCart(restoSlug).forEach((item : CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(getNumber(item.harga).toString());
            });
        }else{
            newCart.forEach((item : CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(getNumber(item.harga).toString());
            });
        }
        
        total.current = newTotal;
    }

    const CartContent = React.memo(({cart} : CartProps) => {
        return (
            <div title={slugify(cart.nama).toString()} className="cart-items w-100 flex-column my-2" key={cart.nama}>
                <div className="d-flex align-items-center flex-row w-100">
                    <img src={`${cart.cover[0]}`} alt=""  className="product-cover mr-3"/>
                    <div className="flex-column flex-fill">
                        <p className="bodytext1 color-green900 max-line-2 semibold m-0 pb-1">{cart.nama}</p>
                        <p className="bodytext2 color-green900 font-weight-bold m-0">{cart.harga}</p>
                        <div className="content-qty d-flex align-items-center flex-row mt-2">
                            <button onClick={() => cart.qty > 1 ? removeQtyCart(cart.id) : deleteCart(cart.id)} type="button" className="btn-qty btn-qty-minus bodytext2">-</button>
                            {cart.id === lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty} autoFocus/>}
                            {cart.id !== lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty}/>}
                            <button onClick={() => addQtyCart(cart.id)} type="button" className="btn-qty btn-qty-plus bodytext2">+</button>
                        </div>
                    </div>
                    <a href="#" className="navbar-brand" title="delete" onClick={() => deleteCart(cart.id)}>
                        <i className="fi fi-rr-trash color-black600 headline5"></i>
                    </a>
                </div>
                <textarea className="caption m-0 w-100 mt-3" rows={1} placeholder="Tulis Catatan" onChange={(e) => updateNoteCart(e, cart.id)} defaultValue={cart.note}></textarea>
            </div>
        );
    });

    const changseSize = () => {
        let height = window.innerHeight;
        let productContainer = document.querySelector('.section-product');
        if(productContainer !== null){
            productContainer.setAttribute('style', `min-height: ${height-232}px`);
        }
        setMinHeight(`${height-56}px`);
    }

    const getInformationData = () => {
        setLoading(true);
        axios.get(`${restaurant}/${restoSlug}`)
        .then(response => {
            let result = response.data;
            if(result.status){
                // setProduct(data.data_menu_all);
                setWhatsapp(result.data.wa);
                console.log(result.data.wa);
                setCart(getCart(restoSlug));
                setNotFound(false);
                setLoading(false);
                calculateTotal();
            }else{
                setCart([]);
                setNotFound(true);
                setLoading(false);
                changseSizeNotFound();

                window.location.href = 'https://daftarmenu.com/resto';
            }
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }

    const changseSizeNotFound = () => {
        let height = window.innerHeight;
        let emptyContainer = document.querySelector('.container-empty');
        if(notFound && emptyContainer !== null){
            emptyContainer.setAttribute('style', `min-height: ${height-110}px`);
            setNotFoundEditing(false);
        }
    }

    const sendCart = () => {
        if(getCart(restoSlug).length > 0){
            if(customer !== ''){
                
                let message = `Pesanan A.N : ${customer}%0a%0a`;
                // foraeach with index
                getCart(restoSlug).forEach((item : CartModel, index : number) => {
                    message += `${index+1}. ${item.nama} (${item.qty}x)%0a`;
                    if(item.note !== ''){
                        message += `*Catatan* : ${item.note}%0a%0a`;
                    }
                });

                // replace first number in whatsapp number with +62
                let whatsappNumber = whatsapp.replace(/^0/, '+62');
                // window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
                
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }else{
                Swal.fire({
                    title: 'Perhatian',
                    text: "Masukkan nama pelanggan terlebih dahulu",
                    icon: 'warning',
                    confirmButtonText: 'Mengerti',
                });
            }
        }else{
            Swal.fire({
                title: 'Perhatian',
                text: "Keranjang masih kosong",
                icon: 'warning',
                confirmButtonText: 'Mengerti',
            });
        }
    }

    const resetCart = () => {
        Swal.fire({
            title: 'Perhatian',
            text: "Apakah anda yakin ingin menghapus semua pesanan?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        }).then((result) => {
            if (result.isConfirmed) {
                updateCart(restoSlug,[]);
                setCart([]);
                calculateTotal();
            }
        });
    }

    useEffect(() => {
        changseSize();
        if(restoSlug === undefined){
            setNotFound(true);
            setLoading(false);
            changseSizeNotFound();
        }else{
            getInformationData();
        }
        setStarting(false);
    }, []);

    return (
        <>
        <nav className="navbar fixed-top background-green500 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
            <div className="d-flex flex-row align-items-center py-0 w-100">
                <Link to={`/${restoSlug}`} className="navbar-brand" title="back">
                    <i className="fi fi-sr-angle-left text-white headline6"></i>
                </Link>
                <p className="mb-0 bodytext1 semibold text-white px-2 flex-fill">Keranjang</p>
                <a href="#" onClick={resetCart} className="navbar-brand m-auto" title="clear">
                    <i className="fi fi-br-rotate-right text-white headline6"></i>
                </a>
            </div>
        </nav>
        {loading && <Loading height={minHeight}/>}
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0" style={{marginTop:'60px', marginBottom:cart.length > 0 ? '175px' : '0px'}}>
            {!starting && !notFound && 
            <>
                <div className="section-product w-100">

                    {!loading && cart.length === 0 && 
                    <EmptyState minHeight={`${minHeight}`} desc={'Belum memilih menu,</br>Silahkan pilih menu terlebih dahulu!'}/>}

                    {!loading && cart.length > 0 &&
                        <div id="container-product" className="container-product d-flex justify-content-start d-flex w-100 flex-column px-3">
                            {!loading && cart.length > 0 && cart.map((cart : CartModel,index : number) => <CartContent cart={cart} key={`cart-${index}`}/>)}
                        </div>
                    }
                    
                </div>
            </>
            }

            {notFound && <EmptyState minHeight={`${minHeight}`} title={'Halaman yang kamu tuju tidak ditemukan.'} desc={'Mau pake linknya? <u><a href="https://daftarmenu.com" class="color-green800" target="_blank" rel="noopener noreferrer">Buat daftarmenu sekarang.</a></u>'} icon={require('../assets/icons/not-found.svg')}/>}
            
        </main>
        {cart.length > 0 && 
        <div className="container-checkout-cart py-3 px-4 d-flex fixed-bottom bg-white col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto flex-column">
            <p className="m-0 bodytext2 color-green900 semibold pb-2">
                Nama Pemesan:
            </p>
            <div className="input-group-search h-100 w-100 input-name">
                <input type="text" className="w-100 bodytext2 color-green900" onChange={(e) => setCustomer(e.target.value)} placeholder="Masukan nama"/>
            </div>
            <div className="d-flex flex-row align-items-center w-100 mt-3">
                <div className="d-flex flex-column w-50">
                    <p className="m-0 bodytext2 color-green900 semibold pb-1">
                        Total Bayar
                    </p>
                    <p className="m-0 headline6 color-green900 semibold">
                        Rp {formatMoney(total.current)}
                    </p>
                </div>
                <button onClick={sendCart} className="button-message w-50 flex-fill bodytext1 semibold text-white d-flex flex-row justify-content-center align-items-center background-green500" type="button">
                    <p className="mb-0 py-1">Pesan</p>
                </button>
            </div>
        </div>
        }
        
        </>
    )
})

export default Cart;