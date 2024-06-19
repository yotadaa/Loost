import { useState } from "react"



function Input({ label, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col w-full max-w-[300px]">
            <label className="text-xs py-1 px-1 font-semibold">{label}</label>
            <input
                className="w-full max-w-[400px] bg-gray-300 p-2 py-2 text-xs rounded-md outline-none     border-gray-900 placeholder:text-gray-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default function LoginPage(props) {

    const [value, setValue] = useState({
        email: "",
        password: "",
    })

    return (
        <div className="w-screen ">
            <div className="z-[0]">
                <div className="fixed inset-0 opacity-70 bg-gradient-to-t from-black via-black/100 to-transparent"></div>
                <div className="fixed inset-0 opacity-70 bg-gradient-to-b from-black via-black/100 to-transparent"></div>
                {/* <div className="fixed h-1/2 inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div> */}
            </div>
            <div className="w-screen h-screen fixed flex items-start justify-center py-10">
                <div className="min-w-[300px] max-w-[400px] w-full p-4 bg-gray-50 min-h-[400px] shadow-md rounded-md">
                    <div className="flex flex-col items-center">
                        <img
                            src={route("get-image", { category: "misc", filename: "logo-big.png" })}
                            className="object-cover w-[100px] h-[75px]"
                        />
                        <header className="text-center mb-5 text-xl font-bold">Loostify Log in</header>
                        <div
                            className="hidden text-red-600 text-xs">
                            Terjadi kesalahan!
                        </div>
                        <main className="w-full max-w-[400px] flex flex-col items-center">
                            <Input
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

                            <button className="w-full max-w-[300px] text-xs bg-amber-400 mt-3 py-1 font-semibold hover:bg-amber-300 rounded-md">
                                Log in
                            </button>
                            <div className="max-w-[300px] w-full mt-5 border-b px-10 border-gray-500"></div>
                            <div
                                className="text-xs mt-4 font-thin"
                            >Belum punya akun? <span className="font-semibold hover:underline cursor-pointer">Mendaftar ke Loostify</span></div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )

}