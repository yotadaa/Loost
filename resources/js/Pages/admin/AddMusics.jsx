import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AddLyrics from "./AddLyrics";



export default function AddMusics({ props }) {

    const [music, setMusic] = useState({
        judul: "",
        id_genre: null,
        id_language: null,
        id_country: null,
        source: null,
        release_date: "",
        composer: "",
        id_album: null,
        duration: 0,
        single: true,
        lyrics: [],
        id_artist: null,
        artist: [],
        genre: [],
    });
    const [showAddLyrics, setShowAddLyrics] = useState(false)
    const lyricRef = useRef(null);
    const fileRef = useRef(null);
    const audioRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [audio, setAudio] = useState(null);
    const [artistSearch, setArtistSearch] = useState("");
    const [artists, setArtists] = useState(props.artists);
    const [countrySearch, setCountrySearch] = useState("");
    const [countries, setCountries] = useState(props.countries);
    const [genreSearch, setGenreSearch] = useState("");
    const [genres, setGenres] = useState(props.genres);
    const [languageSearch, setLanguageSearch] = useState("");
    const [languages, setLanguages] = useState(props.languages);
    const [albumSearch, setAlbumSearch] = useState("");
    const [albums, setAlbums] = useState(props.albums);
    const [showSearch, setShowSearch] = useState({
        genre: false,
        album: false,
        bahasa: false,
        negara: false,
    })

    const handleMusicInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // if (!file.type.startsWith("audio/")) {
            //     alert("Please select a music file (MP3, WAV, etc.)");
            //     if (fileRef.current) fileRef.current.value = '';
            //     return;
            // }

            setMusic(prevs => ({
                ...prevs,
                source: e.target.files[0]
            }));

            setAudio(URL.createObjectURL(e.target.files[0]));

            const duration = new Audio(URL.createObjectURL(e.target.files[0]));
            duration.onloadedmetadata = () => {
                setMusic(prevs => ({
                    ...prevs,
                    duration: duration.duration.toFixed(0)
                }))
            }
        }
    };


    const handleSubmit = async () => {

        setLoading(true);

        if (
            !music.judul || !music.id_genre || !music.id_language || !music.id_country || !music.source || !music.release_date || (!music.single && !music.id_album) || (!music.composer)
        ) {
            alert("Isi seluruh fields");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            formData.append("judul", music.judul);
            formData.append("id_genre", music.id_genre);
            formData.append("id_language", music.id_language);
            formData.append("id_country", music.id_country);
            formData.append("source", music.source);
            formData.append("release_date", music.release_date);
            formData.append("id_album", music.id_album);
            formData.append("id_artist", music.id_artist);
            formData.append("duration", music.duration);
            formData.append("composer", music.composer);
            formData.append("lyrics", JSON.stringify(music.lyrics));
            formData.append("single", music.single);
            formData.append("genre", JSON.stringify(music.genre));
            formData.append("artist", JSON.stringify(music.artist));


            const response = await axios.post(route('store-musics'), formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Berhasil upload");
                console.log(response.data);
                setMusic(prevs => ({
                    ...prevs,
                    judul: "",
                    source: null,
                    release_date: "",
                    duration: 0,
                    single: true,
                    lyrics: []
                }));

                if (fileRef.current) {
                    fileRef.current.value = '';
                }
            } else {
                alert("Terjadi kesalahan");
                console.log(response.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleDateChange = (event) => {
        setMusic(prevs => ({ ...prevs, release_date: event.target.value }));
    };

    const handleLyricInput = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const parsedLyrics = parseLyrics(content);
                setMusic(p => ({
                    ...p,
                    lyrics: parsedLyrics,
                }))
            };
            reader.readAsText(file);
        }
    };

    const parseLyrics = (lyricsText) => {
        const lyricsArray = lyricsText.trim().split('\n');
        const lyricsObjects = lyricsArray.map((line) => {
            const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                const timestamp = (minutes * 60 + seconds).toFixed(2);
                const sentence = match[3].trim();
                return { timestamp: timestamp, sentence: sentence };
            }
            return null;
        }).filter(item => item !== null); // Filter out any null results

        return lyricsObjects;
    };

    useEffect(() => console.log(music), [music])


    return (
        <div className="w-full flex flex-col items-center h-full justify-start ">
            <AddLyrics
                showAddLyrics={showAddLyrics}
                setShowAddLyrics={setShowAddLyrics}
                music={music}
                setMusic={setMusic}
                src={audio}
            />
            <div>This is for add musics menu</div>

            <div className="flex flex-col justify-start gap-2 py-16 min-w-[500px]">
                <input

                    className="py-2 bg-gray-100 px-2 border border-gray-600"
                    type="file"
                    onChange={handleMusicInput}
                    ref={fileRef}
                    accept="audio/*"
                />
                <div>
                    <audio
                        src={audio ? audio : ""} type="audio/mpeg" controls
                        ref={audioRef}
                        className="w-full"
                        style={{
                            zIndex: showAddLyrics ? "200" : "10"
                        }}
                    />
                </div>
                <div className="flex gap-2 items-center w-full">
                    <div className="w-fit text-right">
                        Upload Lirik
                    </div>
                    <input

                        className="py-2 bg-gray-100 px-2 border border-gray-600 w-full"
                        type="file"
                        onChange={handleLyricInput}
                        ref={fileRef}
                        accept="audio/*"
                        value=''
                    />
                </div>
                <div className="flex gap-2 items-center">

                    <div className="p-2 bg-gray-200 border border-gray-500 rounded-md hover:bg-gray-300 cursor-pointer select-none"
                        onClick={() => {
                            setShowAddLyrics(true);
                            if (audioRef.current) audioRef.current.pause();
                        }}
                    >
                        Lihat Lirik
                    </div>
                </div>
                <div>
                    <input
                        placeholder="Judul"
                        className="py-2 bg-gray-100 px-2 border border-gray-600 w-full rounded-md"
                        value={music.judul}
                        onChange={(event) => {
                            setMusic(prevs => ({
                                ...prevs,
                                judul: event.target.value
                            }))
                        }}
                    />
                </div>
                <div className="flex  items-center gap-3">
                    Tanggal Rilis:
                    <input
                        type='date'
                        placeholder="Nama Album"
                        className="py-2 bg-gray-100 px-2 border border-gray-600"
                        value={music.release_date}
                        onChange={handleDateChange}
                    />
                </div>
                <input
                    placeholder="Cari Artis"
                    className="py-2 bg-gray-100 px-2 border border-gray-600 rounded-md"
                    value={artistSearch}
                    onChange={(event) => {
                        setArtistSearch(event.target.value)
                    }}
                />


                <div className={`flex-col gap-1 relative w-full max-h-[300px] overflow-y-scroll ${artistSearch ? "flex" : "hidden"}`}>
                    {artists.map((artist, index) => {
                        if (artist.nama.toLowerCase().includes(artistSearch.toLowerCase()) && artistSearch !== "") {
                            return (
                                <div key={index}
                                    className={`${music.id_artist === artist.id_artist ? "bg-gray-200" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer`}
                                    onClick={() => {
                                        setMusic(prevs => ({
                                            ...prevs,
                                            artist: [...prevs.artist, artist.id_penyanyi],
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

                <div>
                    Artist yang dipilih:<br></br>
                    {music.artist.map((o, i) =>
                        <div key={i}>
                            {i + 1}. {artists.find(obj => obj.id_penyanyi === o).nama} <span
                                className="font-extrabold text-red-500 cursor-pointer hover:underline"
                                onClick={() => {
                                    setMusic(p => ({
                                        ...p,
                                        artist: [...p.artist].filter((_, index) => index !== i)
                                    }))
                                }}
                            > X</span>
                        </div>
                    )}
                </div>
                <div>
                    <input
                        placeholder="Penulis atau Composer"
                        className="py-2 bg-gray-100 px-2 border border-gray-600 w-full rounded-md"
                        value={music.composer}
                        onChange={(event) => {
                            setMusic(prevs => ({
                                ...prevs,
                                composer: event.target.value
                            }))
                        }}
                    />
                </div>
                <div className="flex w-full relative">
                    <input
                        placeholder="Cari Negara"
                        className="py-2 bg-gray-100 px-2 border w-full border-gray-600 rounded-md"
                        value={countrySearch}
                        onChange={(event) => {
                            setCountrySearch(event.target.value);

                            setShowSearch(prevs => ({
                                ...prevs,
                                negara: true,
                                bahasa: false,
                                genre: false,
                                album: false
                            }))
                        }}
                    />

                    <div className={`flex-col absolute gap-1 top-[50px] w-full max-h-[300px] overflow-y-scroll ${countrySearch && showSearch.negara ? "flex" : "hidden"}`}>
                        {countries.map((country, index) => {
                            if (country.nama.toLowerCase().includes(countrySearch.toLowerCase()) && countrySearch !== "" && showSearch.negara) {
                                return (
                                    <div key={index}
                                        className={`${music.id_country === country.id_country ? "bg-gray-200" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer z-[10] border border-black shadow-xl`}
                                        onClick={() => {
                                            setMusic(prevs => ({
                                                ...prevs,
                                                id_country: country.id_country
                                            }));
                                            setCountrySearch(country.nama);
                                            setShowSearch(prevs => ({
                                                ...prevs,
                                                negara: false
                                            }))
                                        }}
                                    >
                                        {country.nama}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="flex w-full relative">
                    <input
                        placeholder="Cari Bahasa"
                        className="py-2 bg-gray-100 px-2 border w-full border-gray-600 rounded-md"
                        value={languageSearch}
                        onChange={(event) => {
                            setLanguageSearch(event.target.value);
                            setShowSearch(prevs => ({
                                ...prevs,
                                negara: false,
                                bahasa: true,
                                genre: false,
                                album: false
                            }))
                        }}
                    />

                    <div className={`flex-col gap-1 absolute top-[50px] w-full max-h-[300px] overflow-y-scroll ${languageSearch && showSearch.bahasa ? "flex" : "hidden"}`}>
                        {languages.map((language, index) => {
                            if (language.nama.toLowerCase().includes(languageSearch.toLowerCase()) && languageSearch !== "" && showSearch.bahasa) {
                                return (
                                    <div key={index}
                                        className={`${music.id_language === language.id_language ? "bg-gray-200" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer z-[10] border border-black shadow-md`}
                                        onClick={() => {
                                            setMusic(prevs => ({
                                                ...prevs,
                                                id_language: language.id_language
                                            }));
                                            setLanguageSearch(language.nama);
                                            setShowSearch(prevs => ({ ...prevs, bahasa: false }))
                                        }}
                                    >
                                        {language.nama}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="relative w-full">
                    <input
                        placeholder="Cari Genre"
                        className="py-2 bg-gray-100 px-2 border w-full border-gray-600 rounded-md"
                        value={genreSearch}
                        onChange={(event) => {
                            setGenreSearch(event.target.value);
                            setShowSearch(prevs => ({
                                ...prevs,
                                negara: false,
                                bahasa: false,
                                genre: true,
                                album: false

                            }))
                        }}
                    />

                    <div className={`absolute flex-col gap-1  w-full max-h-[300px] overflow-y-scroll ${genreSearch && showSearch.genre ? "flex" : "hidden"}`}>
                        {genres.map((genre, index) => {
                            if (genre.nama.toLowerCase().includes(genreSearch.toLowerCase()) && genreSearch !== "" && showSearch.genre) {
                                return (
                                    <div key={index}
                                        className={`${music.id_genre === genre.id_genre ? "bg-gray-300" : "bg-gray-100"} py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer border border-gray-500 z-10`}
                                        onClick={() => {
                                            setMusic(prevs => ({
                                                ...prevs,
                                                id_genre: genre.id_genre,
                                                genre: [...prevs.genre, genre.id_genre]
                                            }));
                                            setGenreSearch(genre.nama);
                                            setShowSearch(prevs => ({ ...prevs, genre: false }))
                                        }}
                                    >
                                        {genre.nama}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div>
                    Genre yang dipilih:<br></br>
                    {music.genre.map((o, i) =>
                        <div key={i}>
                            {i + 1}. {genres.find(obj => obj.id_genre === o).nama} <span
                                onClick={() => {
                                    setMusic(p => ({
                                        ...p,
                                        genre: [...p.genre].filter((_, index) => index !== i)
                                    }))
                                }}
                                className="font-extrabold text-red-500 cursor-pointer underline hover:contrast-200">X</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`py-2 px-5 ${music.single ? "bg-gray-300 border-blue-500 border-4" : "bg-gray-100"} w-fit border border-gray-600 rounded-md select-none cursor-pointer `}
                        onClick={() => {
                            setMusic(prevs => ({
                                ...prevs,
                                single: true,
                                id_album: null,
                            }));
                            setAlbumSearch("")
                        }}
                    >Single</div>
                    <div className={`py-2 px-5 ${music.single ? "bg-gray-100" : "bg-gray-300 border-blue-500 border-4"} w-fit border border-gray-600 rounded-md select-none cursor-pointer `}
                        onClick={() => {
                            setMusic(prevs => ({
                                ...prevs,
                                single: false
                            }))
                        }}
                    >
                        Album
                    </div>
                    <div className="relative w-full">
                        <input
                            placeholder="Cari Album"
                            disabled={music.single}
                            className="px-2 py-2 border border-gray-500 rounded-md"
                            value={albumSearch}
                            onChange={(e) => {
                                setAlbumSearch(e.target.value);
                                setShowSearch(prevs => ({ ...prevs, album: true }))
                            }}

                        />
                        <div className={`absolute w-full top-[-305px] h-[300px] overflow-y-scroll ${albumSearch.length && showSearch.album !== 0 ? "block" : "hidden"}`}>
                            <div className={`relative w-full h-full ${albumSearch.length && showSearch.album !== 0 ? "flex flex-col gap-1 justify-end items-end" : "hidden"}`}>
                                {albums.map((o, i) => (
                                    <div key={i}
                                        className={`hover:bg-gray-300 cursor-pointer shadow-xl bg-gray-100 px-2 py-2 border border-gray-500 rounded-md w-full ${showSearch.album && albumSearch.length !== 0 && o.nama.toLowerCase().includes(albumSearch.toLowerCase()) ? "block" : "hidden"}`}
                                        style={{
                                        }}
                                        onClick={() => {
                                            setAlbumSearch(o.nama);
                                            setMusic(prevs => ({
                                                ...prevs,
                                                id_album: o.id_album
                                            }))
                                            setShowSearch(prevs => ({ ...prevs, album: false }))
                                        }}
                                    >
                                        {o.nama}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={`rounded-md py-2 shadow-md hover:bg-blue-400 ${loading ? "cursor-not-allowed bg-blue-400" : "cursor-pointer bg-blue-600"} text-gray-50 font-bold`}
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    {loading ? "Uploading" : "Upload"}
                </button>
            </div>


        </div >
    )

}
