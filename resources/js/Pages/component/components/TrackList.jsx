

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TrackList({
    ARTIST, active, handleChangeMusic, SONG, setArtistId, formatSeconds, getImageFilename, id, LIST, display
}) {
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
                                <div className="truncate max-w-[200px]">{o.judul}</div>
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
                                    className="w-[40px] h-[40px] bg-gray-400 absolute rounded-full opacity-0 hover:opacity-20"
                                ></div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
