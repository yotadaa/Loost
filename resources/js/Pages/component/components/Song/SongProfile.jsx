
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LyricsIcon from '@mui/icons-material/Lyrics';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Tooltip } from "@mui/material";
import { Song } from '../song';

const PrettoSlider = styled(Slider)(({ theme }) => ({
    color: '#eeeeee',
    '&:hover': {
        color: '#f3f6f4'
    },
    height: 3,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 12,
        width: 12,
        backgroundColor: '#fff',
        display: 'none',
        '&:hover': {
            display: 'block',
            height: 12,
            width: 12,
            backgroundColor: '#fff',
        },
    },
    '&:hover .MuiSlider-thumb': {
        display: 'block',
    },
    '& .MuiSlider-rail': {
        color: '#eeeeee',
    },

    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&::before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
}));

export default function SongProfile({
    MUSIC, imageUrl, setArtistId, AUDIO, audioRef, formatDate, handleChangeMusic, SONG, setAUDIO
}) {

    return (
        <header className="">

            <div className={` transition-all duration-300 ease-in-out relative w-full rounded-md overflow-hidden `}
            >
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div> */}
                {/* <div className="absolute inset-0 opacity-70 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 opacity-10  bg-gradient-to-t from-black via-black/0 to-transparent"></div>
                    <div className="absolute h-[50px] inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div> */}
                <div className=" w-full p-4 text-white">
                    <div className="text-up text-lg font-semibold">
                        Detail Lagu
                    </div>
                </div>
                <div className="h-full p-4">
                    <div className={`flex items-center gap-3 h-full text-white transition-all duration-300 ease-in-out`} >
                        <div className="w-[60px] min-h-[60px] min-w-[60px]">
                            <img
                                className="w-full min-h-full rounded-md shadow-md object-cover"
                                src={imageUrl} />
                        </div>
                        <div className="text-bottom text-3xl font-bold text-nowrap truncate ">
                            <div>{MUSIC?.judul}</div>
                            <div className="font-thin text-sm hover:underline cursor-pointer w-fit"
                                onClick={() => setArtistId(MUSIC?.id_penyanyi)}
                            >{MUSIC?.artist_names}</div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-6 w-fit px-4 h-full py-1'>
                    <Tooltip title="Putar" placement="top-start">
                        <div className="relative flex items-center justify-center">
                            {MUSIC?.id_musik === SONG.current?.id_musik && !AUDIO.playing ? <PlayArrowIcon className="scale-[1.5] text-gray-50" /> : <PauseIcon className="scale-[1.5] text-gray-50" />}
                            <div className="w-[30px] h-[30px] absolute bg-opacity-[10%] bg-white scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "
                                onClick={() => {
                                    if (MUSIC?.id_musik !== SONG?.current?.id_musik) handleChangeMusic(MUSIC);
                                    else {
                                        setAUDIO(p => ({ ...p, playing: !p.playing }))
                                    }
                                }}
                            ></div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Favorite" placement="top-start">
                        <div className="relative flex items-center justify-center">
                            <FavoriteBorderIcon className="scale-[1.4] text-gray-50" />
                            <div className="w-[30px] h-[30px] absolute bg-opacity-[10%] bg-white scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                        </div>
                    </Tooltip>
                    <Tooltip title="Antrian" placement="top-start">
                        <div className="relative flex items-center justify-center">
                            <PlaylistAddIcon className="scale-[1.4] text-gray-50" />
                            <div className="w-[30px] h-[30px] absolute bg-opacity-[10%] bg-white scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                        </div>
                    </Tooltip>
                </div>
                <div className='text-md font-thin px-4 py-2 text-gray-50'>
                    Didengar {MUSIC?.total_views} kali - rilis pada {formatDate(MUSIC?.release_date)}
                </div>
            </div >
        </header >
    )
}
