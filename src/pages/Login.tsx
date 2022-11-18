import React,{useState, useRef, FormEvent} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

const Login = () => {
    const [onProgress, setOnProgress] = useState(false);
    const username = useRef<string>('');
    const password = useRef<string>('');
    const navigate = useNavigate();

    const login = (e : FormEvent) => {
        e.preventDefault();
        if(username.current === '' || password.current === ''){
            Swal.fire({
                title: 'Perhatian',
                text: "Nama Pengguna atau Kata Sandi tidak boleh kosong",
                icon: 'error',
                confirmButtonText: 'Mengerti',
            })
        }else{
            setOnProgress(true);
            setTimeout(() => {
                setOnProgress(false);
                Swal.fire({
                    title: 'Berhasil',
                    text: "Anda berhasil masuk",
                    icon: 'success',
                    confirmButtonText: 'Lanjutkan',
                }).then(() => {
                    navigate('/');
                })
            }, 2000);
        }
    }

    return (
        <main className="container-fluid" role="main">
            <div className="container-login text-center d-flex">
                <form onSubmit={(e) => login(e)} className="container-form d-flex flex-column p-3 m-auto">
                    <img className="mb-4 mx-auto" src={require('../assets/images/daftarmenu_logo.svg')} alt="" style={{width: '120px'}}/>
                    <div className="input-group-custom d-flex flex-row pl-3">
                        <i className="fi fi-rr-at"></i>
                        <input readOnly={onProgress ? true : false} onChange={(e) => username.current = e.target.value} pattern="[A-Za-z0-9]+" name="username" id="inputUsername" className="bodytext2 form-input" placeholder="Nama Pengguna"/>
                    </div>
            
                    <div className="input-group-custom mt-3 flex-row pl-3">
                        <i className="fi fi-rr-lock"></i>
                        <input readOnly={onProgress ? true : false} onChange={(e) => password.current = e.target.value} type="password" name="password" id="inputPassword" className="bodytext2 form-input" placeholder="Kata Sandi"/>
                    </div>

                    <button disabled={onProgress ? true : false} className="btn button-primary btn-lg btn-block btn-red mt-3 background-green500 text-white bodytext2" type="submit" id="buttonLogin">
                        {onProgress ? <Spinner/> : 'Masuk'}
                    </button>
                </form>
                
            </div>
        </main>
    )
}

export default Login;