import { useState } from "react"
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { Inertia } from "@inertiajs/inertia"

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

export default function LoginPage(props) {
    if (props.props.authenticated) {
        Inertia.get(route("home")); I
    }
    console.log(props.props)
    const [showError, setShowError] = useState({
        state: false,
        message: "",
    });
    const [value, setValue] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)

    async function attemptLogin(e) {
        e.preventDefault();

        setLoading(true);

        if (!value.email || !value.password) {
            setShowError(prevState => ({
                ...prevState,
                state: true,
                message: "Isi semua field" // Translate to "Fill in all fields" if needed
            }));
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(route("attempt-login"), {
                data: {
                    email: value.email,
                    password: value.password,
                },
            }, {
                withCredentials: true, // Ensure credentials are sent with the request
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Handle successful login state or redirection
                Inertia.get(route("home"))
                console.log(response.data);
                setShowError(p => ({
                    ...p,
                    state: false,
                    message: ""
                }));
                setLoading(false);

                // Potential addition: Store user data or trigger redirection here
            } else {
                setShowError(prevState => ({
                    ...prevState,
                    state: true,
                    message: "Terjadi kesalahan ketika login: " + response.data.message
                }));
                console.error(response.data);
            }
        } catch (error) {
            setShowError(prevState => ({
                ...prevState,
                state: true,
                message: "Galat: " + error.message // Translate to "Error: " if needed
            }));
            console.error(error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="w-screen ">
            <div className="z-[0]">
                <div className="fixed inset-0 opacity-70 bg-gradient-to-t from-black via-black/100 to-transparent"></div>
                <div className="fixed inset-0 opacity-70 bg-gradient-to-b from-black via-black/100 to-transparent"></div>
                {/* <div className="fixed h-1/2 inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div> */}
            </div>
            <div className="w-screen h-screen fixed flex items-start justify-center py-10">
                <div className="min-w-[300px] max-w-[400px] w-full p-4 bg-gray-50 min-h-[400px] shadow-md rounded-md">
                    <form onSubmit={attemptLogin} className="flex flex-col items-center">
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
                                label="Email"
                                type="email"
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
                                label="Password"
                                type="password"
                                placeholder="Password"
                                value={value.password}
                                onChange={function (e) {
                                    setValue(p => ({
                                        ...p,
                                        password: e.target.value
                                    }))
                                }}
                                isPassword={true}
                            />

                            <button type="submit" className={`flex items-center justify-center w-full max-w-[300px] text-xs  mt-3 py-2 font-semibold  rounded-md ${loading ? "bg-amber-200" : "bg-amber-400 hover:bg-amber-300"}`}
                                onClick={(e) => {
                                    if (!loading)
                                        attemptLogin(e)
                                }}
                            >
                                Log in <div
                                    style={{ display: loading ? "block" : "none" }}
                                    className=" scale-[0.5] p-0 m-0"><CircularProgress color="secondary" /></div>
                            </button>
                            <div className="max-w-[300px] w-full mt-5 border-b px-10 border-gray-500"></div>
                            <div
                                className="text-xs mt-4 font-thin"
                            >Belum punya akun? <span className="font-semibold hover:underline cursor-pointer">Mendaftar ke Loostify</span></div>
                        </main>
                    </form>
                </div>
            </div>
        </div >
    )

}