

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useContext } from 'react';
import Context from '../provider/context';

export default function ArtistCard({
    o, hover, setHover, index
}) {

    const { screen, menuComponent, mainComponent, setCurrentMenu, setARTIST, setArtistId } = useContext(Context);

    return (
        <div className={` relative flex-shrink-0 overflow-hidden cursor-pointer rounded-md transform transition-transform duration-300 ease-in-out ${hover.tren === index ? "bg-gray-200 shadow-sm " : "bg-transparent shadow-none"}`}
            style={{
                height: mainComponent.width / 4 + 50,
                width: mainComponent.width / 4,
                maxWidth: 200,
                maxHeight: 240,
                minWidth: 120,
                minHeight: 190
            }}
            onMouseEnter={() => {
                setHover(p => ({
                    ...p,
                    tren: index
                }))
            }}
            onMouseLeave={() => {
                setHover(p => ({
                    ...p,
                    tren: null
                }))
            }}
            onClick={() => {
                setArtistId(o?.id_penyanyi);
            }}
        >


            <div className='rounded-full p-3  flex justify-center items-center'>
                <img
                    className={` shadow-md rounded-full  object-cover transform transition-transform duration-300 ease-in-out ${hover.tren === index ? "shadow-xl" : "shadow-none"} `}
                    src={`storage/` + o?.profil}
                    alt={`popular-${index}`}
                    draggable={false}
                    style={{
                        height: mainComponent.width / 4 - 30,
                        width: mainComponent.width / 4 - 30,
                        maxWidth: 150,
                        maxHeight: 150,
                        minWidth: 100,
                        minHeight: 100
                    }}
                />
            </div>
            <div className={` h-full w-full rounded-md rounded-t-full`}>
                <div className={` bottom-0 left-0 right-0 p-2 text-black `}>
                    <p className="text-lg font-medium w-full overflow-hidden whitespace-nowrap text-ellipsis ">{o.nama}</p>
                    <p className="text-xs font-medium">Artis</p>

                </div>
            </div>
            <div
                className={`w-[50px] h-[50px] rounded-full shadow-xl  right-2 absolute bg-gray-800 transition-all duration-300 ease-in-out  ${hover.tren === index ? "bottom-10" : "-bottom-16"} hover:bg-gray-500 flex items-center justify-center`}
            >
                <PlayArrowIcon
                    className='scale-[1.5] text-gray-50'
                />
            </div>
            <div className='absolute text-gray-800 right-1 top-2 hover:bg-gray-500 bg-opacity-55 hover:bg-opacity-50 p-2 rounded-full transition-all duration-300 ease-in-out'>
                <MoreVertIcon className='scale-[1.3]' />
            </div>
            <div className={`left-2 flex gap-2 absolute transition-all duration-300 ease-in-out  ${hover.tren === index ? "bottom-2" : "-bottom-10"}  text-gray-50 scale-[0.9]`}>
            </div>
        </div >
    )
}
