import { useContext, useEffect, useState } from "react";
import Context from "../../provider/context";
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';



import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayerController from "./PlayerController";
import { Tooltip } from "@mui/material";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
// import LyricsIcon from "./LyricsIcon";
import LyricsIcon from '@mui/icons-material/Lyrics';

const PrettoSlider = styled(Slider)(({ theme }) => ({
    color: '#000',
    '&:hover': {
        color: '#52af77'
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
        color: 'rgba(0,0,0,0.6)',
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

export default function Player({ }) {

    const { menuComponent, screen, audioRef, SONG, setAUDIO, AUDIO } = useContext(Context);
    const [playerProperties, setPlayerProperties] = useState({
        width: window.innerWidth - (menuComponent.width + 30),
    })

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

    const handleTimeUpdate = (e) => {
        setAUDIO(p => ({
            ...p,
            currentTime: parseFloat(audioRef.current.currentTime),
        }))
    }

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setAUDIO(p => ({
            ...p,
            currentTime: newTime,
        }))
        audioRef.current.currentTime = newTime;
    };

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setAUDIO(p => ({
            ...p,
            volume: newVolume,
        }))
        audioRef.current.volume = newVolume;
        localStorage.setItem("volume", newVolume);
    };

    function getImageFilename(foto) {
        if (!foto) return null;
        const parts = foto.split('/');
        return parts[parts.length - 1];
    }

    const filename = getImageFilename(SONG.current?.single === "T" ? SONG.current?.artwork : SONG.current?.foto);
    const imageUrl = filename ? route("get-image", { category: "albums", filename }) : '';

    useEffect(() => {
        const changeWindowsWidth = () => {
            setPlayerProperties(p => ({
                ...p,
                width: window.innerWidth - (menuComponent.width + 30)
            }))
        }

        window.addEventListener("resize", changeWindowsWidth);
    }, []);

    useEffect(() => {
        if (AUDIO.muted) {
            audioRef.current.volume = 0;
        } else {
            audioRef.current.volume = AUDIO.volume;
        }
    }, [AUDIO.muted])


    useEffect(() => {
        if (AUDIO.playing) localStorage.setItem("current-time", AUDIO.currentTime);
    }, [AUDIO.currentTime])

    return (
        <div className={`${screen.width > 500 ? "h-[80px]" : "h-[70px]"} w-full py-1 px-1`}>
            <audio ref={audioRef}
                onTimeUpdate={handleTimeUpdate}

            />
            <div className="relative w-full h-full rounded-md rounded-t-none bg-gray-50 shadow-xl border-[1px] border-gray-400 flex justify-between gap-2 ">
                <div
                    className="absolute flex w-full -top-4"
                >
                    <PrettoSlider
                        min={0}
                        max={audioRef?.current?.duration || 0}
                        value={AUDIO.currentTime}
                        onChange={handleSeek}
                    />
                </div>
                <div
                    className="bg-gradient-to-l from-white via-white/50 via-20% to-gray-300 w-full flex items-center justify-start h-full px-1 gap-2 max-w-[300px] min-w-[100px] "
                >
                    <div className="rounded-md bg-transparent relative w-[50px] h-[50px] min-w-[50px]">
                        <Skeleton className="absolute rounded-md left-0 top-0" variant="rectangular" width={50} height={50} />
                        <img
                            src={imageUrl}
                            className="bg-red-500 w-full h-full min-w-[50px] rounded-md shadow-xl shadow-gray-500 "
                            style={{
                                opacity: SONG.current?.foto || SONG.current?.artwork ? 1 : 0,
                            }}
                        />
                    </div>
                    <div className="flex flex-col px-1 overflow-hidden">
                        <p className="text-base font-semibold whitespace-nowrap text-nowrap text-ellipsis">{SONG.current?.judul || "Song title"}</p>
                        <p className="text-xs font-semibold">{SONG.current?.artist_names || "Song artists"}</p>
                    </div>
                </div>
                <PlayerController />
                <div
                    className="bg-gradient-to-r from-white via-white/50 via-20% to-gray-300 w-full flex items-center justify-end h-full gap-2 max-w-[300px] px-5"
                    style={{
                        display: screen.width > 500 ? "flex" : "none",
                    }}
                >
                    <div className="flex w-full justify-end gap-2 items-center">
                        <Tooltip title="Antrian" placement="top-start">
                            <div className="relative flex items-center justify-center">
                                <SubscriptionsIcon className="scale-[0.8] text-gray-800" />
                                <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                            </div>
                        </Tooltip>
                        <Tooltip title="Lirik" placement="top-start">
                            <div className="relative flex items-center justify-center">
                                <LyricsIcon className="scale-[0.9] text-gray-800" />
                                <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                            </div>
                        </Tooltip>

                        <div className="flex gap-1 items-center"

                        >
                            <div className="text-gray-700 scale-75 cursor-pointer hover:contrast-150"
                                onClick={() => {
                                    setAUDIO(p => ({
                                        ...p,
                                        muted: !p.muted
                                    }))
                                }}
                            >
                                {

                                    (AUDIO.muted || parseInt(AUDIO.volume * 100) === 0 ? <VolumeOffIcon /> :
                                        (parseInt(AUDIO.volume * 100) > 0 && parseInt(AUDIO.volume * 100) <= 15 ? <VolumeMuteIcon /> : (
                                            (AUDIO.volume * 100 > 15 && parseInt(AUDIO.volume * 100) <= 40 ? <VolumeDownIcon /> : <VolumeUpIcon />
                                            )
                                        ))
                                    )
                                }
                            </div>
                            <div className="w-[100px] flex items-center h-fit">
                                <PrettoSlider
                                    min={0}
                                    className="range-input w-fit"
                                    max={1}
                                    step={0.01}
                                    value={(parseFloat(AUDIO?.volume) || 0.01)}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                            <div className="text-gray-800 pl-1 text-xs w-7 text-right">
                                {parseInt(AUDIO?.volume * 100)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
