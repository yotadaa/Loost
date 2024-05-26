import { useEffect, useState, useRef } from "react"
import axios from "axios";

export default function AddAlbums({ props }) {

    const [form, setForm] = useState({
        nama: "",
        image: null,
        release_date: "",
        id_artist: null,
    });

    const fileRef = useRef(null);
    const dateRef = useRef(null);
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState(props.artists);
    const [artistSearch, setArtistSearch] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith("image/")) {
                alert("Please select an image file (JPG, PNG, etc.)");
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

        if (form.nama.length === 0 || form.release_date === "" || form.image === null || form.id_artist === null) {
            alert("Nama dan Deskripsi harus diisi serta Foto");
            setLoading(false);
            return;
        }

        try {
            // Create a new FormData object
            const formData = new FormData();
            formData.append('nama', form.nama);
            formData.append('image', form.image);
            formData.append('release_date', form.release_date);
            formData.append('id_artist', form.id_artist);

            // Send the request using axios
            const response = await axios.post(route('store-albums'), formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Berhasil upload");
                setForm(prevs => ({
                    ...prevs,
                    nama: "",
                    image: null,
                    release_date: "",
                    id_artist: null,
                }));
                if (fileRef.current) {
                    fileRef.current.value = '';
                }
                setArtistSearch("");
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

    const handleDateChange = (event) => {
        setForm({ ...form, release_date: event.target.value });
    };

    return (
        <div className="w-full flex flex-col items-center h-full justify-start">
            <div>This is for add ALBUMS menu</div>

            <div className="flex flex-col justify-start gap-2 py-16 min-w-[500px]">
                <div className="flex gap-2">
                    <img
                        className="max-w-[300px] max-h-[300px] bg-cover"
                        src={image}
                    />
                </div>
                <input

                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    type="file"
                    onChange={handleImageChange}
                    ref={fileRef}
                />
                <input
                    placeholder="Nama Album"
                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    value={form.nama}
                    onChange={(event) => {
                        setForm(prevs => ({
                            ...prevs,
                            nama: event.target.value
                        }))
                    }}
                />
                <input
                    type='date'
                    placeholder="Nama Album"
                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    value={form.release_date}
                    onChange={handleDateChange}
                />
                <input
                    placeholder="Cari Artis"
                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    value={artistSearch}
                    onChange={(event) => {
                        setArtistSearch(event.target.value)
                    }}
                />

                <div>
                    Artis yang dipilih: {props.artists.find(o => o.id_penyanyi === parseInt(form.id_artist))?.nama || "Tidak ada"}
                </div>
                <div className="flex flex-col gap-1 relative w-full max-h-[300px] overflow-y-scroll">
                    {artists.map((artist, index) => {
                        if (artist.nama.toLowerCase().includes(artistSearch.toLowerCase()) && artistSearch !== "") {
                            return (
                                <div key={index} className={`${form.id_artist === artist.id_artist ? "bg-gray-200" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer`}
                                    onClick={() => {
                                        setForm(prevs => ({
                                            ...prevs,
                                            id_artist: artist.id_penyanyi
                                        }));
                                        setArtistSearch(artist.nama)
                                    }}
                                >
                                    {artist.nama}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
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
