import { useEffect, useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { motion } from 'framer-motion'
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PropTypes from 'prop-types';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const PrettoSlider = styled(Slider)(({ theme }) => ({
    color: '#fff',
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

export default function AudioPlayer({
    audioRef, duration, currentTime, setCurrentTime, playing, setPlaying, setMedia
}) {


    const [volume, setVolume] = useState({
        value: localStorage.getItem("volume") || 1,
        muted: false,
        backup: localStorage.getItem("volume") || 1,
    });
    const [hoveringPlayButton, setHoveringPlayButton] = useState(false);
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    };

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
        setCurrentTime(parseFloat(audioRef.current.currentTime))
    }

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(p => ({
            ...p,
            value: newVolume,
        }))
        audioRef.current.volume = newVolume;
    };

    const handlePlayPause = () => {
        if (!audioRef.current || !audioRef.current.src) {
            console.error('No valid audio source.');
            return;
        }

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            try {
                audioRef.current.play().then(() => {
                    setPlaying(true);
                }).catch((e) => {
                    console.error('Error playing audio:', e);
                });
            } catch (e) {
                console.error('Play attempt failed:', e);
            }
        }
    };


    useEffect(() => {
        localStorage.setItem("volume", volume.value);
        if (volume.muted) {

            setVolume(p => ({ ...p, muted: true }));
        }

        if (!volume.muted) {
            setVolume(p => ({ ...p, backup: p.value }));
        }


    }, [volume.value]);


    useEffect(() => {
        // console.log(volume)
    }, [volume])

    useEffect(() => {
        if (audioRef?.current) {
            audioRef.current.volume = volume.muted ? 0 : (volume.value);
        }
    }, [volume.muted, audioRef]);

    return (
        <div className="w-[500px] flex flex-col absolute bottom-0 rounded-md bg-gray-900 p-5 items-center">
            <div className="w-full flex justify-center items-center">
                <div className="text-gray-300 hover:text-gray-50 cursor-pointer"
                    onClick={() => {
                        setMedia(p => ({
                            ...p,
                            next: p.next - 1,
                            changing: !p.changing
                        }))
                    }}
                >
                    <SkipPreviousIcon sx={{
                        width: 40,
                        height: 40,
                    }} />
                </div>
                <div className="relative w-[40px] h-[40px] text-gray-200 cursor-pointer"
                    onClick={handlePlayPause}
                    onMouseEnter={() => setHoveringPlayButton(true)}
                    onMouseLeave={() => setHoveringPlayButton(false)}
                > {/* Adjusted the container size */}

                    <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-gray-50 opacity-50 rounded-full "
                        style={{
                            scale: 0,
                        }}
                        animate={{
                            scale: hoveringPlayButton ? 1 : 0,
                        }}
                    >
                    </motion.div>

                    {playing ? <PauseIcon
                        sx={{
                            width: 40,
                            height: 40,
                        }}
                    /> : <PlayArrowIcon
                        sx={{
                            width: 40,
                            height: 40, // Ensure the height is also set to match the width
                        }}
                    />
                    }
                </div>
                <div className="text-gray-300 hover:text-gray-50 cursor-pointer"
                    onClick={() => {
                        setMedia(p => ({
                            ...p,
                            next: p.next + 1,
                            changing: !p.changing
                        }))
                    }}
                >
                    <SkipNextIcon sx={{
                        width: 40,
                        height: 40,
                    }} />
                </div>
            </div>
            <div className="w-full">
                <audio
                    ref={audioRef}
                    type="audio/mpeg"
                    onTimeUpdate={handleTimeUpdate}
                />
                <div className="flex w-full justify-end gap-1 items-center">
                    <div className="text-gray-300 scale-75 cursor-pointer hover:contrast-150"
                        onClick={() => {
                            setVolume(p => ({
                                ...p,
                                muted: !p.muted
                            }))
                        }}
                    >
                        {
                            (volume.value && !volume.muted * 100 < 50 && volume.value && !volume.muted * 100 >= 25 ? <VolumeDownIcon /> : volume.value && !volume.muted * 100 < 25 && volume.value && !volume.muted * 100 > 0 ? <VolumeMuteIcon /> : volume.value && !volume.muted * 100 === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />)
                        }
                    </div>
                    {/* <input
                        type="range"
                        min="0"
                        className="range-input"
                        max="1"
                        step="0.01"
                        value={volume.value}
                        onChange={handleVolumeChange}
                    /> */}
                    <div className="w-[100px] flex items-center h-fit">
                        <PrettoSlider
                            min={0}
                            className="range-input w-fit"
                            max={1}
                            step={0.01}
                            value={volume.value}
                            onChange={handleVolumeChange}
                        />
                    </div>
                    <div className="text-gray-400 pl-1 text-xs w-7 text-right">
                        {parseInt(volume.value * 100)}%
                    </div>
                </div>
                <div
                    className="flex w-full justify-between gap-2 items-center"
                >
                    <div className="text-gray-200 text-xs w-7">
                        {formatSeconds(parseInt(currentTime))}
                    </div>
                    <PrettoSlider
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                    />
                    <div className="text-gray-200 text-xs w-7">
                        {formatSeconds(parseInt(audioRef.current?.duration) || 0)}
                    </div>
                </div>
            </div>
        </div>
    )
}
