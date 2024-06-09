import { useContext, useEffect, useState } from "react"
import Context from "../../provider/context"
import ArtistProfile from "./ArtistProfile";


import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useCustomBackButton } from "../CustomBackward";


export default function ArtistPage({ props }) {

    const { ARTIST, setARTIST, setSONG, SONG, audioRef, setAUDIO, AUDIO } = useContext(Context);
    const [active, setActive] = useState(0);


    function getImageFilename(foto) {
        if (!foto) return null;
        const parts = foto.split('/');
        return parts[parts.length - 1];
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

    const handleChangeMusic = (o) => {
        setSONG(p => ({ ...p, current: o }));
        localStorage.setItem("current-time", 0);
        setAUDIO(p => ({
            ...p, playing: true, init: false, currentTime: 0
        }));
        audioRef.current.play();
    }

    useEffect(() => {
        setARTIST(ARTIST ? ARTIST : {
            artist: props.props.artist[0],
            albums: props.props.albums,
            musics: props.props.musics,

        })
    }, [])

    useCustomBackButton(() => {
        // window.history.pushState(null, '', "/home");
        console.log("Backward")
    })

    return (
        <div className="h-full flex flex-col gap-10 w-full p-3 overflow-x-hidden custom-scrollbar">
            <div className="w-full h-full">
                <ArtistProfile
                    props={props}
                    ARTIST={ARTIST?.artist}
                    getImageFilename={getImageFilename}
                />
                <div className="flex flex-col">
                    <div className="flex font-bold text-xl gap-3 p-2 py-4">
                        <div className={`cursor-pointer ${active === 0 ? "text-gray-700" : "text-gray-400 hover:text-gray-500"}`}
                            onClick={() => {
                                setActive(0)
                            }}
                        >Populer</div>
                        <div className={`cursor-pointer ${active === 1 ? "text-gray-700" : "text-gray-400 hover:text-gray-500"}`}
                            onClick={() => {
                                setActive(1)
                            }}
                        >Album</div>
                        <div className={`cursor-pointer ${active === 2 ? "text-gray-700" : "text-gray-400 hover:text-gray-500"}`}
                            onClick={() => {
                                setActive(2)
                            }}
                        >Single</div>
                    </div>
                    <div id="populer"
                        style={{
                            display: active === 0 ? "block" : "none"
                        }}
                    >
                        {ARTIST?.musics.slice(0, 10).map((o, i) => {
                            const filename = getImageFilename(o.single === "T" ? o?.artwork : o?.foto);
                            const imageUrl = filename ? route("get-image", { category: o.single === "T" ? "single" : "albums", filename }) : ''
                            return (
                                <div
                                    className="flex gap-2 items-center justify-between pr-3 p-1 rounded-md hover:bg-gray-100 py-2"
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
                                                    handleChangeMusic(o);
                                                }}
                                            >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                            </div></div>
                                        <div className="flex font-semibold flex-col">
                                            <div className="truncate max-w-[200px]">{o.judul}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{ARTIST?.artist.nama}</div>
                                        </div>
                                    </div>

                                    <div className="relative flex w-full justify-around"
                                    >
                                        <div className="text-sm text-gray-700">
                                            {o.total_views}
                                        </div>
                                        <div>
                                            {formatSeconds(parseInt(o.duration))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div id="album"
                        style={{
                            display: active === 1 ? "block" : "none"
                        }}
                    >
                        {ARTIST?.albums.map((o, i) => {
                            const filename = getImageFilename(o.single === "T" ? o?.artwork : o?.foto);
                            const imageUrl = filename ? route("get-image", { category: "albums", filename }) : ''
                            return (
                                <div
                                    className="flex gap-2 items-center justify-between pr-3 p-1 rounded-md hover:bg-gray-100 py-2 cursor-pointer"
                                    key={i}
                                >
                                    <div className="flex gap-3 items-center max-w-[300px] w-full whitespace-nowrap overflow-hidden">

                                        <div className="relative flex items-center shadow-md justify-center">
                                            <img
                                                src={imageUrl}
                                                className="w-10 h-10 rounded-md shadow-md object-cover min-w-10"
                                            />
                                            <div className='w-[40px] h-[40px] rounded-md hover:bg-black hover:bg-opacity-30 absolute flex items-center justify-center hover:opacity-100 opacity-0 cursor-pointer'
                                            >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                            </div>
                                        </div>
                                        <div className="flex font-semibold flex-col">
                                            <div className="truncate max-w-[200px] hover:underline">{o?.nama}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{ARTIST?.artist.nama}</div>
                                        </div>
                                    </div>

                                    <div className="relative flex w-full justify-around"
                                    >
                                        <div className="text-sm text-gray-700">
                                            {ARTIST?.albums?.length} lagu
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div id="single"
                        style={{
                            display: active === 2 ? "block" : "none"
                        }}
                    >
                        {ARTIST?.musics.map((o, i) => {
                            const filename = getImageFilename(o.single === "T" ? o?.artwork : o?.foto);
                            const imageUrl = filename ? route("get-image", { category: "single", filename }) : ''
                            if (o.single === "T") return (
                                <div
                                    className="flex gap-2 items-center justify-between pr-3 p-1 rounded-md hover:bg-gray-100 py-2"
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
                                                    handleChangeMusic(o);
                                                }}
                                            >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                            </div></div>
                                        <div className="flex font-semibold flex-col">
                                            <div className="truncate max-w-[200px]">{o.judul}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{ARTIST?.artist.nama}</div>
                                        </div>
                                    </div>

                                    <div className="relative flex w-full justify-around"
                                    >
                                        <div className="text-sm text-gray-700">
                                            {o.total_views}
                                        </div>
                                        <div>
                                            {formatSeconds(parseInt(o.duration))}
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
