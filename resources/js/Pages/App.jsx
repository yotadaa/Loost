import { useEffect, useRef, useState } from "react";
import Context from './component/provider/context';
import AddArtists from "./admin/AddArtists";
import AddAlbums from "./admin/AddAlbums";
import ListArtists from "./admin/ListArtists";
import ListAlbums from "./admin/ListAlbums";
import AddMusics from "./admin/AddMusics";
import PlayMusics from "./admin/PlayMusics";
import Container from "./component/components/Container";
import Dashboard from "./component/dashboard/Dashboard";
import { Song } from "./component/components/song";
import axios from "axios";

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArtistPage from "./component/components/artists/ArtistPage";
import AlbumPage from "./component/components/albums/AlbumPage";
import LinearProgress from '@mui/material/LinearProgress';
import Children from "./Children";
import SongPage from "./component/components/Song/SongPage";
import SearchPage from "./component/components/Search/SearchPage";
import LyricsPage from "./component/components/Lyrics/LyricsPage";



function App({ props }) {
    const [menu, setMenu] = useState({
        "1": { element: AddArtists, name: "Tambah Artis", route: "add-artists", show: false, url: "/" },
        "2": { element: AddAlbums, name: "Tambah Album", route: "add-albums", show: false, url: "/" },
        "5": { element: AddMusics, name: "Tambah Musics", route: "add-musics", show: false, url: "/" },
        "3": { element: ListArtists, name: "Lihat Daftar Artis", route: "list-artists", show: false, url: "/" },
        "4": { element: ListAlbums, name: "Lihat Daftar Album", route: "list-albums", show: false, url: "/" },
        "6": { element: PlayMusics, name: "Putar Musik", route: "play-musics", show: false, url: "/" },
        "7": { element: Container, name: "Home", route: "home", child: Dashboard, icon: HomeIcon, show: true },
        "8": { element: Container, name: "Halaman Artist", route: "search-page", child: ArtistPage, icon: SearchIcon, show: false, url: "/home" },
        "9": { element: Container, name: "Albums", route: "album-page", child: AlbumPage, icon: SearchIcon, show: false, url: "/" },
        "10": { element: Container, name: "Songs", route: "song-page", child: SongPage, icon: SearchIcon, show: false, url: "/" },
        "11": { element: Container, name: "Search", route: "search-page", child: SearchPage, icon: SearchIcon, show: true, url: "/search" },
        "12": { element: Container, name: "Search", route: "lyrics-page", child: LyricsPage, icon: SearchIcon, show: false, url: "/lyrics" },

    })

    const [currentMenu, setCurrentMenu] = useState(props.menu);
    const [loading, setLoading] = useState({
        page: false,
    })

    const MenuComponent = menu[currentMenu]?.element;
    const [screen, setScreen] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const [menuComponent, setMenuComponent] = useState({
        width: parseInt(localStorage.getItem("menu-width")) || 200,
        edgeHover: false,
        edgeMoving: false,
        edgeHold: false,
    });
    const [mainComponent, setMainComponent] = useState({
        width: window.innerWidth - parseInt(localStorage.getItem("menu-width")) || 200
    });

    const loadAudio = async (src = "/undefined.mp3") => {
        if (src === "/undefined.mp3") return;
        try {
            const parts = src.split('/');
            const filename = parts[parts.length - 1];
            const audioURL = route("stream-audio", { filename: filename });
            audioRef.current.src = audioURL;

            audioRef.current.addEventListener('loadeddata', async () => {
                try {
                    const formData = new FormData();
                    formData.append("id_musik", SONG?.current?.id_musik);

                    const response = await axios.post(route('listen-to-music'), formData, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.data.success) {
                        console.log('Music tracking recorded');
                    }
                } catch (e) {
                    console.error('Error tracking music play:', e);
                }
            });

            audioRef.current.addEventListener('error', (e) => {
                console.error(e);
            });
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    };

    //ARTIST
    const [ARTIST, setARTIST] = useState(null);
    const [MUSIC, setMUSIC] = useState(null);
    const [ALBUM, setALBUM] = useState(null);
    const [artistId, setArtistId] = useState(null);
    const [albumId, setAlbumId] = useState(null);
    const [musicId, setMusicId] = useState(null);

    //URL
    const URI = new URL(location);
    const [SONG, setSONG] = useState(Song(null));

    function getImageFilename(foto) {
        if (!foto) return null;
        const parts = foto.split('/');
        return parts[parts.length - 1];
    }

    const loadPlayedSong = async () => {
        const song_id = localStorage.getItem("current") || null;
        console.log("id_musik: ", song_id)
        if (!song_id) {
            console.log("No song ID found in localStorage.");
            return;
        }

        try {
            const response = await axios.get(route('get-complete-song', { song_id: song_id }), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.data.success) {
                setSONG(prevState => ({ ...prevState, current: { ...response.data.song[0], lyrics: response.data.lyrics } }));
                if (response.data.song[0]?.source) loadAudio(response.data.song[0]?.source || "/undefined.mp3")
            } else {
                console.log("Failed to load the song, success flag is false.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadPlayedSong();
    }, []);

    //Audio Components
    const audioRef = useRef();
    const [AUDIO, setAUDIO] = useState({
        volume: localStorage.getItem("volume") || 1,
        currentTime: localStorage.getItem("current-time") || 0,
        playing: false,
        muted: false,
        init: true,
        loading: false,
    });

    function handleChangeMusic(o) {
        setSONG(p => ({ ...p, current: o }));
        localStorage.setItem("current-time", 0);
        setAUDIO(p => ({
            ...p, playing: true, init: false, currentTime: 0
        }));
        audioRef.current.play();
    }

    function formatSeconds(seconds) {
        // Handle negative or non-numeric inputs (optional)
        if (seconds < 0 || typeof seconds !== 'number') {
            return 'Invalid input';
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Ensure two-digit format for minutes and seconds
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        // Extracting the day, month, and year
        const day = date.getDate();
        const year = date.getFullYear();

        // Defining an array of month names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[date.getMonth()];

        // Formatting the date
        return `${day} ${month} ${year}`;
    }

    const contextValue = { menuComponent, setMenuComponent, screen, setScreen, URI, SONG, audioRef, setSONG, setAUDIO, AUDIO, mainComponent, setMainComponent, menu, ARTIST, setARTIST, artistId, setArtistId, currentMenu, setCurrentMenu, handleChangeMusic, ALBUM, setALBUM, getImageFilename, formatSeconds, albumId, setAlbumId, setLoading, loading, MUSIC, setMUSIC, formatDate, musicId, setMusicId };
    return (
        <Context.Provider value={contextValue}>

            {currentMenu === null ? <Children menu={menu} /> : <MenuComponent props={props} Element={menu[currentMenu]?.child || "div"} />}
            <div className="fixed top-0 left-0 z-[100000] w-screen text-gray-600"
                style={{
                    display: loading.page ? "block" : "none",
                }}
            >
                <LinearProgress />
            </div>
        </Context.Provider >
    );
}

export default App;
