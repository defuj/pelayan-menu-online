import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import axios, {restaurant, products} from '../helper/axios';
import { slugify } from "../helper/others";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";
import iconSalad from '../assets/icons/salad.svg';
import iconAll from '../assets/icons/all.svg';
import iconAppetizer from '../assets/icons/appetizer.svg';
import iconCoffee from '../assets/icons/coffee.svg';
import iconDessert from '../assets/icons/dessert.svg';
import iconDrink from '../assets/icons/drink.svg';
import iconMainCourse from '../assets/icons/main-course.svg';
import iconSoup from '../assets/icons/soup.svg';
import iconJuice from '../assets/icons/juice.svg';
import iconMilkshake from '../assets/icons/milkshake.svg';
import iconSnack from '../assets/icons/snack.svg';
import Loading from "../components/Loading";
import defaultImageProfile from '../assets/icons/default-image-profile.svg';
import EmptyState from "../components/EmptyState";
import ProductDetailModel from "../models/ProductDetailModel";
import ImageSliderNav from "../components/ImageSliderNav";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import CartModel from "../models/CartModel";
import Swal from "sweetalert2";
import { getCart, updateCart } from "../helper/session";
import { ToastBody } from "react-bootstrap";

const Home = React.memo(() => {
    const {restoSlug} = useParams();
    const categories : Array<CategoryModel> = [
        {id: 0, kategori:'Semua', icon: iconAll},
        {id: 1, kategori:'Appetizer', icon: iconAppetizer},
        {id: 9, kategori:'Coffee',icon: iconCoffee},
        {id: 4, kategori:'Dessert', icon: iconDessert},
        {id: 5, kategori:'Drink', icon: iconDrink},
        {id: 2, kategori:'Main Course', icon: iconMainCourse},
        {id: 10, kategori:'Salad', icon: iconSalad},
        {id: 3, kategori:'Soup', icon: iconSoup},
        {id: 7, kategori:'Juice', icon: iconJuice},
        {id: 8, kategori:'Milk Shake',icon: iconMilkshake},
        {id: 6, kategori:'Snack', icon: iconSnack},
    ]

    const productSample : ProductDetailModel = {
        id: 1,
        cover : [
            require('../assets/icons/product-placeholder.svg'),
            require('../assets/icons/product-placeholder.svg'),
            require('../assets/icons/product-placeholder.svg')
        ],
        nama : 'Memuat nama produk ...',
        harga : 'Memuat harga produk ...',
        deskripsi : 'Memuat deskripsi produk ...',
        badge : 'Memuat badge produk ...',
    }

    const [minHeight, setMinHeight] = useState('400px');
    const [starting, setStarting] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [progress, setProgress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categoryIdSelected, setCategoryIdSelected] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState<CategoryModel[]>([]);
    const [product, setProduct] = useState<ProductModel[]>([]);
    const [productDetail, setProductDetail] = useState(productSample);
    const [productDetailFound, setProductDetailFound] = useState(false);
    const [notFoundEditing, setNotFoundEditing] = useState(true);
    const [cart, setCart] = useState<CartModel[]>(getCart);
    const [cartCount, setCartCount] = useState(0);
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState('');
    const [search, setSearch] = useState('');
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPage = useRef(1);
    const page = useRef(1);
    const masterProduct = useRef<ProductModel[]>([]);

    const filterProduct = (categoryId : number = 0) => {
        if(categoryIdSelected === categoryId){
            return;
        }

        manageProduct([]);
        setLoading(true);

        if(categoryId === 0){
            getInformationData();
        }else{
            axios.get(`${products}?resto=${restoSlug}&kategori=${categoryId}`)
            .then(response => {
                let result = response.data;
                if(result.status){
                    manageProduct(result.data);
                }
                // console.log(result);
                setLoading(false);
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
        }
    }

    const selectCategory = (slug: number) => {
        setCategoryIdSelected(slug)
        filterProduct(slug)
    };

    interface CategoryProps {
        category : CategoryModel
    }

    const CategoryItem = ({category}: CategoryProps) => {
        let icon = categories.filter((item) => item.id === category.id)[0].icon;
        return (
            <a onClick={() => selectCategory(category.id)} className={`bodytext1 text-decoration-none brand-slide ${categoryIdSelected === category.id && 'active'}`} title="daftar-produk">
                <div className="brand-icon float-left mr-1" style={{backgroundImage : `url(${icon})`}}></div> {category.kategori}
            </a>
        )
    }

    const Category = () => {
        return (
            <div className="container-brand-text mt-3">
                {category.length > 0 && <CategoryItem category={
                    {id: 0, kategori:'Semua', icon: iconAll}
                } key={`all-category`}/>}
                {category.map((category, index) => <CategoryItem category={category} key={index}/>)}
            </div>
        )
    }

    interface ProductProps {
        product : ProductModel
    }

    const ProductContent = (data : ProductProps) => {
        return (
            <a onClick={() => getProductDetail(data.product.id)} data-toggle="modal" data-target="#ModalSlide" href="#" title={slugify(data.product.nama).toString()} className="product-items w-50 flex-column" key={data.product.nama}>
                {data.product.badge !== '' && data.product.badge !== undefined && data.product.badge !== null && <p className={data.product.badge === 'New' ? 'caption m-0 text-product-badge-new' : 'caption m-0 text-product-badge'}>{data.product.badge}</p>}
                <div className="product-cover mb-2" style={{backgroundImage: `url(${data.product.cover})`}}></div>
                <p className="bodytext1 color-green900 max-line-2 semibold m-0">{data.product.nama}</p>
                <p className="caption color-green800 max-line-2 mx-0 my-1">{data.product.deskripsi}</p>
                <p className="bodytext2 color-green900 font-weight-bold m-0">{data.product.harga}</p>
            </a>
        );
    };

    const getInformationData = () => {
        setLoading(true);
        axios.get(`${restaurant}/${restoSlug}`)
        .then(response => {
            let result = response.data;
            // console.log(result);
            if(result.status){
                const data = result.data;
                setImage(data.cover_resto);
                setName(data.nama_resto);
                setAddress(data.alamat);
                manageProduct(data.data_menu_all);
                changseSize();

                let category : CategoryModel[] = data.data_kategori;
                let newCategory : CategoryModel[] = [];
                category.map((item : CategoryModel) => {
                    let categoryItem = item;
                    const ref = {icon : categories.filter((category) => category.id === item.id)[0].icon};
                    // push object ref to categoryItem
                    Object.assign(categoryItem, ref);
                    newCategory.push(categoryItem);
                });
                newCategory.length > 0 && newCategory.unshift({id: 0, kategori:'Semua', icon: iconAll})
                
                setCategory(newCategory);
                setNotFound(false);
                setLoading(false);
                reCountCart();
            }else{
                setImage('');
                setName('Tidak ditemukan');
                setAddress('Tidak ditemukan');
                setCategory([]);
                manageProduct([]);
                setNotFound(true);
                setLoading(false);
                changseSizeNotFound();

                window.location.href = 'https://daftarmenu.com/resto';
            }
            setStarting(false);
            setIsSearching(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
            setStarting(false);
            setIsSearching(false);
        });
    }

    const getProductDetail = (id : number) => {
        setProductDetailFound(false);
        setProgress(true);
        axios.get(`${products}/detail?resto=${restoSlug}&id=${id}`)
        .then(response => {
            let result = response.data;
            if(result.status){
                setQty(1);
                setNote('');
                cart.map((item) => {
                    if(item.id === result.data.id){
                        setQty(item.qty);
                        setNote(item.note);
                    }
                });
                setProductDetail(result.data);
                setProductDetailFound(true);
            }else{
                setProductDetail(productSample);
                setProductDetailFound(false);
            }
            setProgress(false);
        }).catch(error => {
            setProductDetail(productSample);
            setProgress(false);
            setProductDetailFound(false);
        });
    }

    const reCountCart = () => {
        let total = 0;
        // total qty from cart
        total = getCart(restoSlug).reduce((total: number, item : CartModel) => total + item.qty, 0);
        setCartCount(total);
    }

    const addToCart = () => {
        let cartItem : CartModel = {
            id: productDetail.id,
            nama: productDetail.nama,
            harga: productDetail.harga,
            qty: qty,
            cover: productDetail.cover,
            deskripsi: productDetail.deskripsi,
            badge: productDetail.badge,
            note: note
        }
        let newCart : CartModel[] = getCart(restoSlug);
        // if(localStorage.getItem('cart') !== null){
        //     cart = JSON.parse(localStorage.getItem('cart') || '{}');
        // }
        let index = newCart.findIndex((item) => item.id === cartItem.id);
        if(index !== -1){
            newCart[index].note = cartItem.note;
            // newCart[index].qty = newCart[index].qty + cartItem.qty;
            newCart[index].qty = cartItem.qty;
        }else{
            newCart.push(cartItem);
        }
        if(qty > 0){
            setCart(newCart);
            updateCart(restoSlug,newCart);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
              
            Toast.fire({
                icon: 'success',
                title: 'Menu Berhasil ditambahkan'
            })   
            // console.log(cart);
        }
        reCountCart();
    }

    const changseSize = () => {
        let height = window.innerHeight;
        let productContainer = document.querySelector('.section-product');
        if(productContainer !== null){
            productContainer.setAttribute('style', `min-height: ${height-304}px`);
            setMinHeight(`${height-344}px`);
        }
    }

    const changseSizeNotFound = () => {
        let height = window.innerHeight;
        let emptyContainer = document.querySelector('.container-empty');
        if(notFound && emptyContainer !== null){
            emptyContainer.setAttribute('style', `min-height: ${height-110}px`);
            setMinHeight(`${height-110}px`);
            setNotFoundEditing(false);
        }
    }

    const searchMenu = (keyword : string) => {
        setSearch(keyword);
        setIsSearching(true);

        if(keyword !== ''){
            setLoading(true);
            axios.get(`${restaurant}/${restoSlug}`)
            .then(response => {
                let result = response.data;
                // console.log(result);
                if(result.status){
                    const data = result.data;
                    setImage(data.cover_resto);
                    setName(data.nama_resto);
                    setAddress(data.alamat);
                    let ref = data.data_menu_all.filter((item : ProductModel) => item.nama.toLowerCase().includes(keyword.toLowerCase()));
                    manageProduct(ref);
                    changseSize();
                    setNotFound(false);
                    setLoading(false);
                }else{
                    window.location.href = 'https://daftarmenu.com/resto';
                }
                setIsSearching(false);
            }).catch(error => {
                console.log(error);
                setLoading(false);
                setIsSearching(false);
            });
        }else{
            getInformationData();
        }
    }

    const updateQtyCart = (e: React.FormEvent) => {
        // setLastFocus(id);
        let qty = (e.target as HTMLInputElement).value;
        const lastQty = qty;
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

        setQty(parseInt(qty));
    }

    const showProduct = (newPage : number) => {
        page.current = newPage;
        
        if(masterProduct.current.length > 0){
            let productData = masterProduct.current;
            let productDataChunk= [];
            let chunkSize = 8;
            for (let i = 0; i < productData.length; i += chunkSize) {
                productDataChunk.push(productData.slice(i, i + chunkSize));
            }

            try {
                if(newPage === 1){
                    setProduct(productDataChunk[0]);
                }else{
                    setProduct([...product, ...productDataChunk[newPage - 1]]);
                }
            } catch (error) {}
            setIsLoadingProduct(false);
        }else{
            setProduct([]);
            setIsLoadingProduct(false);
        }
    }

    const manageProduct = (data : ProductModel[]) => {
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
        
        masterProduct.current = data;
        page.current = 1;
        setCurrentPage(1);
        showProduct(1); 
    }

    const loadOnScroll = () => {
        if ((window.innerHeight + document.documentElement.scrollTop) >= (document.documentElement.scrollHeight - 100)) {
            if(page.current <= totalPage.current) {
                setCurrentPage(page.current + 1);
                setIsLoadingProduct(true);
            }
        }
    }

    window.onscroll = () => loadOnScroll();

    useEffect(() => {
        // console.log(restoSlug);
        if(starting){
            if(restoSlug === undefined){
                setNotFound(true);
                setLoading(false);
                changseSizeNotFound();
                setStarting(false);
            }else{
                getInformationData();
            }
            changseSize();
        }
        
        if(currentPage > page.current){
            setTimeout(() => {
                setIsLoadingProduct(false);
                showProduct(currentPage);
            },2000);
        }
    }, [notFound && notFoundEditing && changseSizeNotFound, currentPage]);

    return (
        <>
        {!notFound && !starting && <Navigation cartCount={cartCount} onSearch={searchMenu} isSearching={isSearching}/>}
        {!starting &&
        <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0">
            {!starting && !notFound && 
            <>
                <div style={{backgroundImage: `url(${require('../assets/images/hero.png')})`,backgroundRepeat: 'repeat', backgroundSize: '200px'}} className="container-user d-flex flex-row justify-content-between align-items-center px-3 py-3 background-green500">
                    <Link className="content-image-profile flex-shrink" to="#" title="profile">
                        <div className="frame-image">
                            <img src={image !== '' ? image : defaultImageProfile} alt="profile" id="dataImage" title="image-profile"/>
                        </div>
                    </Link>

                    <div className="content-text flex-column w-100">
                        <h1 className="headline5 text-white font-weight-bold p-0 m-0 max-line-2">
                            {name !== '' ? name : ''}
                        </h1>
                        <p className="bodytext2 text-white p-0 m-0 max-line-2 pr-3" id="dataName">
                            {address !== '' ? address : ''}
                        </p>
                    </div>
                </div>

                <div className="section-product w-100">
                    <div className="product-divider w-100">
                        <div className="product-divider-content w-100"></div>
                    </div>
                    {category.length > 0 && search === '' && 
                        <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-4 pt-4 pb-2">
                            <h1 className="headline5 color-green900 font-weight-bold p-0 m-0 w-100">
                                Kategori Menu
                            </h1>
                            <p className="headline6 color-green900 px-0 m-0">Temukan menu favorit kamu di sini!</p>
                            <div className="container-brand-text mt-3">
                                {category.map((category, index) => <CategoryItem category={category} key={index}/>)}
                            </div>
                        </div>
                    }

                    {!loading && search !== '' && product.length > 0 && 
                        <div className="container-category d-flex justify-content-start d-flex w-100 flex-wrap px-4 pt-4 pb-2">
                            <h1 className="headline5 color-green900 font-weight-bold p-0 m-0 w-100">
                                Hasil Pencarian
                            </h1>
                            <p className="headline6 color-green900 px-0 m-0">{product.length} hasil untuk kata kunci “<span className="color-green500 semibold px-0 m-0">{search}</span>”</p>
                        </div>
                    }
                    
                    {loading && <Loading height={search !== '' ? minHeight : '300px'}/>}

                    {!loading && product.length === 0 && 
                    <EmptyState minHeight={minHeight} desc={search !== '' ? 
                        `Maaf “<span class="color-green500 semibold px-0 m-0">${search}</span>” tidak ditemukan coba gunakan kata kunci lain.` : 
                        'Belum ada menunya nih,</br>Silahkan tambahkan terlebih dahulu!'}/>}

                    {!loading && product.length > 0 &&
                        <>
                        <div id="container-product" className="container-product d-flex justify-content-start d-flex w-100 flex-wrap px-3">
                            {!loading && product.length > 0 && product.map((product : ProductModel,index : number) => <ProductContent product={product} key={`product-${index}`}/>)}
                        </div>
                        {isLoadingProduct && <Loading height="100px"/>}
                        </>
                    }
                    
                </div>
            </>
            }

            {notFound && <EmptyState minHeight={minHeight} title={'Halaman yang kamu tuju tidak ditemukan.'} desc={'Mau pake linknya? <a href="https://daftarmenu.com" class="color-green800" target="_blank" rel="noopener noreferrer"><u>Buat daftarmenu sekarang.</u></a>'} icon={require('../assets/icons/not-found.svg')}/>}
            
            {/* modal */}
            <div className="modal fade" id="ModalSlide" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-slideout col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" role="document">
                    <div className="modal-content" style={{maxHeight: `${window.innerHeight-80}px`}}>
                        <div className="modal-header d-flex flex-wrap">
                            <h6 className="modal-title semibold headline6 color-black500" id="exampleModalLabel">Detail Menu</h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <i className="color-black500 fi fi-br-cross headline6"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            {progress && <Loading/>}
                            {!progress && !productDetailFound && <EmptyState title="Menu tidak ditemukan" desc="Menu yang kamu cari tidak ada"/>}
                            {!progress && productDetailFound && <>
                                {productDetail.cover.length > 0 && <ImageSliderNav cover={productDetail.cover}/>}
                                <p className="m-0 bodytext2 color-green500 mx-0 mt-4 pt-3 mb-0">
                                    {productDetail.badge}
                                </p>
                                <p className="m-0 headline5-5 color-green900 font-weight-bold m-0">
                                    {productDetail.nama}
                                </p>
                                <p className="m-0 bodytext1 color-green900 semibold m-0">
                                    {productDetail.harga}
                                </p>
                                <p className="m-0 bodytext1 color-green900 semibold m-0 pt-3">
                                    Deskripsi
                                </p>
                                <p className="m-0 caption color-green900 m-0 py-1">
                                    {productDetail.deskripsi}
                                </p>
                                <p className="m-0 bodytext1 color-green900 semibold m-0 pt-3">
                                    Catatan:
                                </p>
                                <form id="form-search" className="container-note form-search mt-2">
                                    <div className="input-group-search bg-white h-100 w-100 input-note">
                                        <textarea name="" id="" rows={3}  className="w-100 bodytext2 mt-2" onChange={(e) => setNote(e.target.value)} defaultValue={note} placeholder="Masukan catatan"></textarea>
                                    </div>

                                    <div className="container-qty d-flex justify-content-between flex-row align-items-center my-3">
                                        <p className="m-0 bodytext1 color-green900 semibold m-0">
                                            Jumlah
                                        </p>
                                        <div className="content-qty d-flex align-items-center flex-row">
                                            <button onClick={() => qty > 1 && setQty(qty-1)} type="button" className="btn-qty btn-qty-minus bodytext2">-</button>
                                            <input type="number" maxLength={3} max={999} min={1} onChange={(e) => updateQtyCart(e)} className="text-center input-qty bodytext2 mx-2" value={qty}/>
                                            <button onClick={() => setQty(qty+1)} type="button" className="btn-qty btn-qty-plus bodytext2">+</button>
                                        </div>
                                    </div>
                                   
                                    <button onClick={addToCart} className="mb-2 button-message w-100 flex-fill bodytext2 semibold text-white d-flex flex-row justify-content-center align-items-center background-green500" type="button">
                                        <p className="mb-0 py-1">
                                            Masukan ke Keranjang
                                        </p>
                                    </button>
                                </form>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
            {/* modal */}
        </main>
        }
        {!starting && <Footer/>}
        </>
    )
})

export default Home;