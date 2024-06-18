import { useContext, useEffect, useState } from "react";
import Context from "../../provider/context";
import SongProfile from "./SongProfile";
import TrackList from "../TrackList";
import axios from "axios";


import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function SongPage({ props }) {

    const { MUSIC, formatSeconds, setMUSIC, screen, getImageFilename, handleChangeMusic, setArtistId, AUDIO, audioRef, formatDate, SONG, setAUDIO, musicId, setMusicId, setAlbumId, setLoading } = useContext(Context);
    if (musicId) {
        history.pushState({}, "", `/music/${musicId}`);
    }
    const [filename, setFilename] = useState(getImageFilename(MUSIC && MUSIC.single === "T" ? MUSIC?.artwork : MUSIC?.foto));
    const [imageUrl, setImageUrl] = useState(filename ? route("get-image", { category: "albums", filename }) : '');
    const [relatedSong, setRelatedSong] = useState([]);



    async function loadRelatedSong(album_id) {
        console.log(album_id)
        if (!album_id) return;
        const res = await axios.get(route("album-only", { album_id: album_id }))
        if (res.data.success) {
            setRelatedSong(res.data.musics)
        }
    }

    const loadPlayedSong = async (music_id) => {
        if (!music_id) return;
        console.log("music id: ", music_id)
        try {
            const response = await axios.get(route('get-complete-song', { song_id: music_id }), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.data.success) {
                setMUSIC(response.data.song[0]);
                loadRelatedSong(response.data.song[0]?.id_album);
                setLoading(p => ({ ...p, page: false }))
                console.log("success: ", response.data)
            } else {
                console.log("Failed to load the song, success flag is false.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        setLoading(p => ({ ...p, page: false }))
        setMusicId(musicId ? musicId : props.props.musicId);
        setAlbumId(null);
        setMusicId(null);
    }, [])
    useEffect(() => {
        loadPlayedSong(musicId ? musicId : props.props.musicId);
        console.log("id: ", musicId)
    }, [musicId])

    useEffect(() => {
        setFilename(getImageFilename(MUSIC && MUSIC.single === "T" ? MUSIC?.artwork : MUSIC?.foto));
    }, [MUSIC]);

    useEffect(() => {
        setImageUrl(filename ? route("get-image", { category: MUSIC?.single === "T" ? "single" : "albums", filename }) : '');
    }, [filename]);

    useEffect(() => {
    }, [relatedSong])

    return (
        <div
            className="w-full h-full"
            style={{
                maxHeight: screen.height - 0
            }}
        >
            <div className="relative w-full h-full">
                <img
                    src={imageUrl}
                    className="fixed top-0 left-0 w-full h-full object-cover "
                />
                {/* <div className="fixed h-full w-1/2 inset-0 bg-gradient-to-r from-white via-white/10 to-transparent"></div> */}
                <div className="fixed inset-0 opacity-70 bg-gradient-to-t from-black via-black/100 to-transparent"></div>
                <div className="fixed h-full inset-0 opacity-10  bg-gradient-to-t from-black via-black/0 to-transparent"></div>
                <div className="fixed h-1/2 inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div>

                <div className="absolute w-full custom-scrollbar overflow-y-scroll pb-[100px] "
                    style={{
                        maxHeight: screen.height
                    }}>
                    <SongProfile
                        setArtistId={setArtistId}
                        MUSIC={MUSIC}
                        imageUrl={imageUrl}
                        AUDIO={AUDIO}
                        audioRef={audioRef}
                        formatDate={formatDate}
                        handleChangeMusic={handleChangeMusic}
                        SONG={SONG}
                        setAUDIO={setAUDIO}
                    />
                    <div className="p-4 text-xl font-thin text-gray-50">
                        <div>Album</div>
                        <div className="flex justify-start items-center gap-5">
                            <img src={imageUrl}
                                className="rounded-md"
                                width={60}
                                height={60}
                            />
                            <div className="font-semibold hover:underline cursor-pointer"
                                onClick={() => {
                                    setAlbumId(MUSIC?.id_album);
                                }}
                            >{MUSIC?.nama}</div>
                        </div>
                    </div>
                    <div className="p-4 text-xl font-thin text-gray-50">
                        <div>Lagu lain di album ini</div>
                        {relatedSong?.map((o, i) => {
                            if (o?.id_musik !== MUSIC?.id_musik) return (
                                <div
                                    className="flex gap-2 items-center justify-between px-2 p-1 rounded-md hover:bg-gray-50 py-2 hover:bg-opacity-20 text-gray-50 w-full"
                                    key={i}
                                >
                                    <div className="flex gap-3 items-center max-w-[300px] w-full whitespace-nowrap overflow-hidden">

                                        <div className="relative flex items-center shadow-md justify-center">
                                            <img
                                                src={imageUrl}
                                                className="w-10 h-10 rounded-md shadow-md object-cover min-w-10"
                                            />
                                            <div className='w-[40px] h-[40px] rounded-md hover:bg-black hover:bg-opacity-30 absolute flex items-center justify-center hover:opacity-100 opacity-0 cursor-pointer'
                                                onClick={() => {
                                                    handleChangeMusic({ ...o, artist_names: MUSIC?.artist_names });
                                                }}
                                            >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                            </div></div>
                                        <div className="flex font-thin text-lg flex-col">
                                            <div className="truncate max-w-[200px] hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setMusicId(o?.id_musik)
                                                }}>{o.judul}</div>
                                            <div className="text-xs text-gray-50 hover:underline cursor-pointer truncate max-w-[200px] w-fit"
                                                onClick={() => setArtistId(MUSIC?.id_penyanyi)}
                                            >{MUSIC?.artist_names}</div>
                                        </div>
                                    </div>

                                    <div className="relative flex w-full justify-between"
                                    >
                                        <div className="text-sm ">
                                            {o.total_views}
                                        </div>
                                        <div>
                                            {formatSeconds(parseInt(o.duration))}
                                        </div>
                                        <div className='flex relative items-center justify-center'>
                                            <MoreVertIcon className='scale-[1]' />
                                            <div
                                                className="w-[40px] h-[40px] bg-gray-400 absolute rounded-full opacity-0 hover:opacity-20"
                                            ></div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
