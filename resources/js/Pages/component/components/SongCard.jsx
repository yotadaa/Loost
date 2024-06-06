

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export default function SongCard({
    o, hover, setHover, index
}) {


    return (
        <div className="relative h-[180px] w-[180px] shadow-md  flex-shrink-0 overflow-hidden cursor-pointer rounded-md "
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
        >


            <img
                className={`rounded-md shadow-md h-full w-full object-cover transform transition-transform duration-300 ease-in-out ${hover.tren === index ? "scale-110" : "scale-100"} `}
                src={`storage/` + o?.foto}
                alt={`popular-${index}`}
                draggable={false}
            />
            <div className={`absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-black via-black/50 via-10% to-transparent rounded-md transition-all duration-300 ease-in-out  ${hover.tren === index ? "pb-20" : "pb-10"}`}>
                <div className={`absolute bottom-0 left-0 right-0 p-2 text-white transition-all duration-300 ease-in-out  ${hover.tren === index ? "pb-10" : "pb-3"}`}>
                    <p className="text-lg font-medium w-full overflow-hidden whitespace-nowrap text-ellipsis hover:underline">{o.judul}</p>
                    <p className="text-xs font-medium hover:underline">{o.artist_names}</p>

                </div>
            </div>
            <div
                className={`w-[50px] h-[50px] rounded-full shadow-xl  right-2 absolute bg-gray-50 transition-all duration-300 ease-in-out  ${hover.tren === index ? "bottom-2" : "-bottom-16"} hover:bg-gray-300 flex items-center justify-center`}
            >
                <PlayArrowIcon
                    className='scale-[1.5] text-gray-800'
                />
            </div>
            <div className='absolute text-gray-50 right-1 top-2 hover:bg-gray-50 bg-opacity-55 hover:bg-opacity-50 p-2 rounded-full transition-all duration-300 ease-in-out'>
                <MoreVertIcon className='scale-[1.3]' />
            </div>
            <div className={`left-2 flex gap-2 absolute transition-all duration-300 ease-in-out  ${hover.tren === index ? "bottom-2" : "-bottom-10"}  text-gray-50 scale-[0.9]`}>
                <Tooltip title="Favorite" placement="top-start">
                    <FavoriteBorderIcon />
                </Tooltip>
                <Tooltip title="Queue" placement="top-start">
                    <PlaylistAddIcon />
                </Tooltip>
            </div>
        </div >
    )
}
