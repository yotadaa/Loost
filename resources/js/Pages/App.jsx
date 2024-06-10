import { useEffect, useRef, useState } from "react";
import Context from './component/provider/context';
import AddArtists from "./admin/AddArtists";
import AddAlbums from "./admin/AddAlbums";
import ListArtists from "./admin/ListArtists";
import { Inertia } from "@inertiajs/inertia";
import ListAlbums from "./admin/ListAlbums";
import AddMusics from "./admin/AddMusics";
import PlayMusics from "./admin/PlayMusics";
import Container from "./component/components/Container";
import Dashboard from "./component/dashboard/Dashboard";
import { usePage } from "@inertiajs/inertia-react";
import { Song } from "./component/components/song";
import axios from "axios";

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArtistPage from "./component/components/artists/ArtistPage";
import AlbumPage from "./component/components/albums/AlbumPage";

const Children = ({ menu }) => {
    return (
        <div className="flex flex-col items-center justify-center h-dvh gap-2 w-screen">
            {Object.keys(menu).map((m, i) =>
                <div
                    key={i}
                    className="bg-gray-200 py-2 px-2 rounded-md shadow-md hover:bg-gray-300 cursor-pointer flex  max-w-[400px] w-full gap-2"
                    onClick={() => {
                        Inertia.get(route(menu[m].route));
                    }}
                >
                    {menu[m].name}
                </div>
            )}
        </div>
    )
}

function App({ props }) {
    const [menu, setMenu] = useState({
        "1": { element: AddArtists, name: "Tambah Artis", route: "add-artists", show: false },
        "2": { element: AddAlbums, name: "Tambah Album", route: "add-albums", show: false },
        "5": { element: AddMusics, name: "Tambah Musics", route: "add-musics", show: false },
        "3": { element: ListArtists, name: "Lihat Daftar Artis", route: "list-artists", show: false },
        "4": { element: ListAlbums, name: "Lihat Daftar Album", route: "list-albums", show: false },
        "6": { element: PlayMusics, name: "Putar Musik", route: "play-musics", show: false },
        "7": { element: Container, name: "Home", route: "home", child: Dashboard, icon: HomeIcon, show: true },
        "8": { element: Container, name: "Cari lagu", route: "home", child: ArtistPage, icon: SearchIcon, show: true },
        "9": { element: Container, name: "Albums", route: "album-page", child: AlbumPage, icon: SearchIcon, show: false },
    })

    const [currentMenu, setCurrentMenu] = useState(props.menu);

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
    const [ALBUMS, setALBUM] = useState(null);
    const [artistId, setArtistId] = useState(null);

    //URL
    const URI = new URL(location);
    const [SONG, setSONG] = useState(Song(null));

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
                setSONG(prevState => ({ ...prevState, current: response.data.song[0] }));
                loadAudio(response.data.song[0].source)
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

    const contextValue = { menuComponent, setMenuComponent, screen, setScreen, URI, SONG, audioRef, setSONG, setAUDIO, AUDIO, mainComponent, setMainComponent, menu, ARTIST, setARTIST, artistId, setArtistId, currentMenu, setCurrentMenu, handleChangeMusic, ALBUMS, setALBUM };
    return (
        <Context.Provider value={contextValue}>
            {currentMenu === null ? <Children menu={menu} /> : <MenuComponent props={props} Element={menu[currentMenu]?.child || "div"} />}
        </Context.Provider >
    );
}

export default App;
