

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';

export default function TrackList({
    ARTIST, active, handleChangeMusic, SONG, setArtistId, formatSeconds, getImageFilename, id, LIST, display
}) {

    const [more, setMore] = useState({
        show: false,
        hovered: false,
        id: null,
        playlist: false,
    })
    useEffect(() => {
        const handleMoreClick = (e) => {
            if (!more.hovered) {
                setMore(p => ({ ...p, show: false, id: null }));
            }
        };

        window.addEventListener("click", handleMoreClick);

        return () => {
            window.removeEventListener("click", handleMoreClick);
        };
    }, [more.hovered]);
    return (
        <div id={id}
            style={{
                display: active === display ? "block" : "none"
            }}
        >
            {LIST?.map((o, i) => {
                const filename = getImageFilename(o.single === "T" ? o?.artwork : o?.foto);
                const imageUrl = filename ? route("get-image", { category: o.single === "T" ? "single" : "albums", filename }) : ''
                if (o) return (
                    <div
                        className="flex gap-2 items-center justify-between pr-3 p-1 rounded-md hover:bg-gray-100 py-2 "
                        key={i}
                    >
                        <div className="flex gap-3 items-center max-w-[300px] w-full whitespace-nowrap overflow-hidden" >

                            <div className="relative flex items-center shadow-md justify-center">
                                <img
                                    src={imageUrl}
                                    className="w-10 h-10 rounded-md shadow-md object-cover min-w-10"
                                />
                                <div className='w-[40px] h-[40px] rounded-md hover:bg-black hover:bg-opacity-30 absolute flex items-center justify-center hover:opacity-100 opacity-0 cursor-pointer'
                                    onClick={() => {
                                        handleChangeMusic({ ...o, artist_names: ARTIST?.artist.nama });
                                    }}
                                >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                </div></div>
                            <div className="flex font-semibold flex-col">
                                <div className="truncate max-w-[200px]">{o.judul} </div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]"
                                    onClick={() => setArtistId(SONG.current?.id_artist)}
                                >{ARTIST?.artist.nama}</div>
                            </div>
                        </div>

                        <div className="relative flex w-1/2 items-center justify-between"
                        >
                            <div className="text-sm text-gray-700">
                                {o.total_views}
                            </div>
                            <div>
                                {formatSeconds(parseInt(o.duration))}
                            </div>
                            <div className='flex relative items-center justify-center'>
                                <MoreVertIcon className='scale-[1]' />
                                <div
                                    className="w-[40px] h-[40px] bg-gray-400 absolute rounded-full opacity-0 hover:opacity-20 cursor-pointer"
                                    onClick={() => {
                                        setMore(p => ({
                                            ...p,
                                            show: p.id === i ? false : true,
                                            id: p.id === i ? null : i
                                        }));
                                    }}
                                    onMouseEnter={() => setMore(p => ({ ...p, hovered: true }))}
                                    onMouseLeave={() => setMore(p => ({ ...p, hovered: false }))}
                                ></div>
                                <div
                                    style={{
                                        display: more.show && more.id === i ? "flex" : "none"
                                    }}
                                    className='mt-20 right-2 absolute flex-col w-[200px] bg-gray-700 text-gray-100 rounded-md z-[999]'
                                >
                                    <div className='px-3 py-2 rounded-md hover:contrast-50 hover:bg-gray-600'
                                        onClick={() => console.log("Queued")}
                                    >Tambah ke antrian</div>
                                    <div
                                        className='px-3 py-2 rounded-md hover:contrast-50 hover:bg-gray-600'
                                        onClick={() => console.log("Faved")}
                                    >
                                        Tambah ke favorit
                                    </div>
                                    <div
                                        className='px-3 py-2 rounded-md hover:contrast-50 hover:bg-gray-600 relative'
                                        onClick={() => console.log("Faved")}
                                        onMouseEnter={() => setMore(p => ({ ...p, playlist: true }))}
                                        onMouseLeave={() => setMore(p => ({ ...p, playlist: false }))}
                                    >
                                        <div>Tambah ke Playlist</div>
                                        <div
                                            className='absolute top-0 left-[-100%] bg-gray-200 w-full rounded-md text-black flex-col'
                                            style={{
                                                display: more.playlist && more.id === i ? "flex" : "none",
                                            }}
                                        >
                                            <div className='px-3 py-2 rounded-md hover:contrast-50 hover:bg-gray-300 relative'>Playlist 1</div>
                                            <div className='px-3 py-2 rounded-md hover:contrast-50 hover:bg-gray-300 relative'>Playlist 2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
