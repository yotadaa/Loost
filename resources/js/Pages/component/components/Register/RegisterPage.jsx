import { useState } from "react"
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Inertia } from "@inertiajs/inertia"
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";


function Input({ label, placeholder, value, onChange, type, isPassword }) {
    const [showPassword, setShowPassword] = useState(type);
    return (
        <div className="flex flex-col w-full max-w-[300px]">
            <label className="text-xs py-1 px-1 font-semibold">{label}</label>
            <div className="flex items-center gap-1">
                <input
                    type={showPassword}
                    className="w-full max-w-[400px] bg-gray-300 p-2 py-2 text-xs rounded-md outline-none     border-gray-900 placeholder:text-gray-500"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword ?
                    (showPassword === "password" ?
                        <VisibilityOffOutlinedIcon
                            className="scale-[0.9] cursor-pointer"
                            onClick={() => setShowPassword("text")}
                        /> :
                        <VisibilityOutlinedIcon
                            className="scale-[0.9] cursor-pointer"
                            onClick={() => setShowPassword("password")}
                        />) : <div></div>
                }
            </div>
        </div>
    )
}

export default function RegisterPage(props) {
    if (props.props.authenticated) {
        Inertia.get(route("home")); I
    }
    const [showError, setShowError] = useState({
        state: false,
        message: "",
    });
    const [value, setValue] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: null,
        number: "",
    });

    const [loading, setLoading] = useState(false);

    const handleInput = (event) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/[^0-9+]/g, ''); // Remove non-numeric characters
        setValue(p => ({
            ...p,
            number: numericValue
        }))
    };


    async function attemptRegister(e) {
        e.preventDefault();
        setLoading(true)
        if (value.password != value.confirmPassword) {
            setShowError(p => ({
                ...p,
                state: true,
                message: "Periksa password"
            }))
            setLoading(false);
            return;
        } else if (!value.username || !value.email || !value.password || !value.confirmPassword || !value.number) {
            setShowError(p => ({
                ...p,
                state: true,
                message: "Isi semua field"
            }))
            setLoading(false);
            return;
        }

        setShowError(p => ({
            ...p,
            state: false,
            message: "Isi semua field"
        }));

        try {
            const response = await axios.post(route("attempt-register"), {
                data: {
                    "nama": value.username,
                    "email": value.email,
                    "password": value.password,
                    "number": "+62" + value.nomor,
                    "country": 77
                },
            }, {
                withCredentials: true,
                header: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                Inertia.get(route("login-page"));
            } else {
                setShowError(p => ({
                    ...p,
                    state: true,
                    message: "Terjadi kesalahan ketika register: " + response.data.message
                }));
                setLoading(false);
            }
        } catch (e) {
            setShowError(p => ({
                ...p,
                state: true,
                message: "Galat: " + e
            }));
            console.error(e);
            setLoading(false);
        }


    }

    return (
        <div className="w-screen hoverflow-y-auto">
            <div className="z-[0]">
                <div className="fixed inset-0 opacity-70 bg-gradient-to-t from-black via-black/100 to-transparent"></div>
                <div className="fixed inset-0 opacity-70 bg-gradient-to-b from-black via-black/100 to-transparent"></div>
                {/* <div className="fixed h-1/2 inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div> */}
            </div>
            <div className="w-screen h-screen custom-scrollbar overflow-auto fixed flex items-start justify-center py-10">
                <div className="min-w-[300px] max-w-[400px] w-full p-4 bg-gray-50 min-h-[400px] shadow-md rounded-md">
                    <form onSubmit={attemptRegister} className="flex flex-col items-center">
                        <img
                            src={route("get-image", { category: "misc", filename: "logo-big.png" })}
                            className="object-cover w-[100px] h-[75px]"
                        />
                        <header className="text-center mb-5 text-xl font-bold">Loostify Log in</header>
                        <div
                            style={{
                                display: showError.state ? "block" : "none"
                            }}
                            className="hidden text-red-600 text-xs">
                            {showError.message}
                        </div>
                        <main className="w-full max-w-[400px] flex flex-col items-center">
                            <Input
                                type="text"
                                label="Username"
                                placeholder="Username"
                                value={value.username}
                                onChange={function (e) {
                                    setValue(p => ({
                                        ...p,
                                        username: e.target.value
                                    }))
                                }}
                            />
                            <Input
                                type="text"
                                label="Email"
                                placeholder="Email"
                                value={value.email}
                                onChange={function (e) {
                                    setValue(p => ({
                                        ...p,
                                        email: e.target.value
                                    }))
                                }}
                            />

                            <Input
                                type="password"
                                isPassword={true}
                                label="Password"
                                placeholder="Password"
                                value={value.password}
                                onChange={function (e) {
                                    setValue(p => ({
                                        ...p,
                                        password: e.target.value
                                    }))
                                }}
                            />

                            <Input
                                type="password"
                                isPassword={true}
                                label="Konfirmasi Password"
                                placeholder="Konfirmasi Password"
                                value={value.confirmPassword}
                                onChange={function (e) {
                                    setValue(p => ({
                                        ...p,
                                        confirmPassword: e.target.value
                                    }))
                                }}
                            />

                            <div
                                className="w-full flex bg-gray-200 text-xs max-w-[300px] my-3 rounded-md"
                            >
                                <div className="bg-gray-50 border border-gray-500 rounded-l-md text-center cursor-pointer hover:bg-gray-200 p-2">
                                    +62
                                </div>
                                <input
                                    className="py-2 w-full bg-gray-300 rounded-r-md outline-none px-2 text-xs"
                                    value={value.number}
                                    onChange={handleInput}
                                    placeholder="812345xxx"
                                />
                            </div>
                            <div
                                className="w-full flex bg-gray-200 text-xs max-w-[300px] my-3 rounded-md"
                            >
                                <div className="bg-gray-50 border border-gray-500 rounded-md  cursor-pointer hover:bg-gray-200 p-2 w-full">
                                    Indonesia
                                </div>
                            </div>
                            <button type="submit" className={`flex items-center justify-center w-full max-w-[300px] text-xs  mt-3 py-2 font-semibold  rounded-md ${loading ? "bg-amber-200" : "bg-amber-400 hover:bg-amber-300"}`}
                                onClick={(e) => {
                                    if (!loading)
                                        attemptRegister(e)
                                }}
                            >
                                Register <div
                                    style={{ display: loading ? "block" : "none" }}
                                    className=" scale-[0.5] p-0 m-0"><CircularProgress color="secondary" /></div>
                            </button>
                            <div className="max-w-[300px] w-full mt-5 border-b px-10 border-gray-500"></div>
                            <div
                                className="text-xs mt-4 font-thin"
                            >Sudah punya akun? <span className="font-semibold hover:underline cursor-pointer">Login ke Loostify</span></div>
                        </main>
                    </form>
                </div>
            </div>
        </div >
    )

}