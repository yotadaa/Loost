import { useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { motion } from 'framer-motion'

export default function AudioPlayer({
    audioRef, duration, currentTime, setCurrentTime, playing, setPlaying
}) {


    const [hoveringPlayButton, setHoveringPlayButton] = useState(false);
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(parseFloat(audioRef.current.currentTime))
    }

    const handlePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };
    return (
        <div className="w-[500px] flex flex-col absolute bottom-0 rounded-md bg-gray-900 p-5 items-center">
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
                        height: 40, // Ensure the height is also set to match the width
                    }}
                /> : <PlayArrowIcon
                    sx={{
                        width: 40,
                        height: 40, // Ensure the height is also set to match the width
                    }}
                />
                }
            </div>
            <div className="w-full">
                <audio
                    ref={audioRef}
                    type="audio/mpeg"
                    onTimeUpdate={handleTimeUpdate}
                />
                <input
                    type="range"
                    className="w-full range-input"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                />
            </div>
        </div>
    )
}
