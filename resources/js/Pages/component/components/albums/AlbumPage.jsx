import { useContext, useEffect, useState } from "react";
import Context from "../../provider/context";
import AlbumProfile from "./AlbumProfile";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function AlbumPage({ props }) {


    const { ALBUM, formatDate, formatSeconds, setALBUM, screen, getImageFilename, SONG, handleChangeMusic, setArtistId, setCurrentMenu, albumId, setMusicId, musicId, setLoading } = useContext(Context);
    const [filename, setFilename] = useState(getImageFilename(ALBUM?.album?.foto));
    const [imageUrl, setImageUrl] = useState(filename ? route("get-image", { category: "albums", filename }) : '');
    useEffect(() => {
        if (props.props.albumId) {
            history.pushState({}, "", `/album/${props?.props?.albumId}`)
        } else {
            history.pushState({}, "", `/album/${albumId}`)
        }
        setArtistId(null);
    }, []);

    useEffect(() => {
        setFilename(getImageFilename(ALBUM?.album?.foto));
    }, [ALBUM]);

    useEffect(() => {
        setImageUrl(filename ? route("get-image", { category: "albums", filename }) : '');
    }, [filename]);

    return (
        <div
            className="w-full"
            style={{
                height: screen.height - 0
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

                <div className="absolute w-full ">
                    <AlbumProfile
                        setArtistId={setArtistId}
                        ALBUM={ALBUM}
                        imageUrl={imageUrl}
                        setCurrentMenu={setCurrentMenu}
                    />
                    <div>
                        <div className="p-4">
                            <div className="text-gray-50 font-thin text-xl">{ALBUM?.musics?.length} lagu di album ini - rilis pada {formatDate(ALBUM?.album?.release_date)}</div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-500 h-[50px] bg-opacity-20"></div>
                    <div className="flex flex-col gap-3 p-4 w-full overflow-auto custom-scrollbar"
                        style={{
                            height: screen.height - 120 - 190
                        }}
                    >
                        {ALBUM?.musics?.map((o, i) => {
                            return (
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
                                                    handleChangeMusic({ ...o, artist_names: ALBUM?.artist?.nama });
                                                }}
                                            >{SONG.current?.id_musik === o?.id_musik ? <PauseIcon /> : <PlayArrowIcon className='text-gray-50' />}

                                            </div></div>
                                        <div className="flex font-thin text-lg flex-col">
                                            <div className="truncate max-w-[200px] hover:underline cursor-pointer"
                                                onClick={() => {
                                                    setMusicId(o?.id_musik)
                                                    console.log(musicId)
                                                }}
                                            >{o.judul}</div>
                                            <div className="text-xs text-gray-50 hover:underline cursor-pointer truncate max-w-[200px] w-fit"
                                                onClick={() => setArtistId(ALBUM?.artist.id_penyanyi)}
                                            >{ALBUM?.artist?.nama}</div>
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
        </div >
    );
}
