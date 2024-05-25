import { useEffect, useState, useRef } from "react"
import axios from "axios";

export default function AddArtists({ props }) {

    const [form, setForm] = useState({
        nama: "",
        image: null,
        description: "",
        country: null,
    });

    const fileRef = useRef(null);
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState(props.countries);
    const [countrySearch, setCountrySearch] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith("image/")) {
                alert("Please select an image file (JPG, PNG, etc.)");
                if (fileRef.current) {
                    fileRef.current.value = '';
                }
                return;
            }

            setForm(prevs => ({
                ...prevs,
                image: e.target.files[0]
            }))

            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleSubmit = async (e) => {
        setLoading(true);

        if (form.nama.length === 0 || form.description.length === 0 || form.image === null || form.country === null) {
            alert("Nama dan Deskripsi harus diisi serta Foto");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nama', form.nama);
            formData.append('description', form.description);
            formData.append('image', form.image);
            formData.append('country', form.country);

            const response = await axios.post(route('store-artists'), formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Berhasil upload");
                console.log(response.data);
                setForm(prevs => ({
                    ...prevs,
                    nama: '',
                    description: '',
                    image: null,
                    country: null
                }));
                if (fileRef.current) {
                    fileRef.current.value = '';
                }
                setImage(null)
            } else {
                alert("Terjadi kesalahan");
                console.log(response.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => console.log(props.countries.slice(0, 10)), []);
    useEffect(() => console.log(form), [form])

    return (
        <div className="w-full flex flex-col items-center h-full justify-start">
            <div>This is for add artists menu</div>

            <div className="flex flex-col justify -start gap-2 py-16 min-w-[500px]">
                <div className="flex gap-2">
                    <img
                        className="max-w-[300px] max-h-[300px] bg-cover"
                        src={image}
                    />
                    <div className="flex flex-col gap-1 relative w-full max-h-[300px] overflow-y-scroll">
                        {countries.map((country, index) => {
                            if (country.nama.toLowerCase().includes(countrySearch.toLowerCase()) || countrySearch === "") {
                                return (
                                    <div key={index} className={`${form.country === country.id_country ? "bg-gray-200" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer`}
                                        onClick={() =>
                                            setForm(prevs => ({
                                                ...prevs,
                                                country: country.id_country
                                            }))
                                        }
                                    >
                                        {country.nama}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <input
                    placeholder="Cari Negara"
                    className={`py-2 bg-gray-100 px-2 border border-gray-600`}
                    value={countrySearch}
                    onChange={(event) => {
                        setCountrySearch(event.target.value)
                    }}
                />
                <div>
                    Negara yang dipilih: {props.countries.find(o => o.id_country === parseInt(form.country))?.nama || "Tidak ada"}
                </div>
                <input

                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    type="file"
                    onChange={handleImageChange}
                    ref={fileRef}
                />
                <input
                    placeholder="Nama Penyanyi"
                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    value={form.nama}
                    onChange={(event) => {
                        setForm(prevs => ({
                            ...prevs,
                            nama: event.target.value
                        }))
                    }}
                />
                <textarea
                    placeholder="Deskripsi"
                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    value={form.description}
                    onChange={(event) => {
                        setForm(prevs => ({
                            ...prevs,
                            description: event.target.value
                        }))
                    }}
                />
                <button
                    className={`rounded-md py-2 shadow-md hover:bg-blue-400 ${loading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-600"} text-gray-50 font-bold`}
                    onClick={() => {
                        handleSubmit()
                    }}
                >
                    {loading ? "Uploading" : "Upload"}
                </button>
            </div>
        </div >
    )
}
