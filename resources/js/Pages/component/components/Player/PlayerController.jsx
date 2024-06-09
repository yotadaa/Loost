import { useContext, useEffect } from "react"
import Context from "../../provider/context"

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LyricsIcon from '@mui/icons-material/Lyrics';
import { Tooltip } from "@mui/material";

export default function PlayerController() {

    const { screen, audioRef, AUDIO, setAUDIO } = useContext(Context);

    const handlePlayPause = () => {
        if (!audioRef.current || !audioRef.current.src) {
            console.error('No valid audio source.');
            return;
        }

        if (AUDIO.playing) {
            audioRef.current.pause();
            setAUDIO(p => ({ ...p, playing: false }))
        } else {
            try {
                audioRef.current.play().then(() => {
                    setAUDIO(p => ({ ...p, playing: true }))
                    audioRef.current.currentTime = AUDIO.currentTime || 0;
                }).catch((e) => {
                    console.error('Error playing audio:', e);
                });
            } catch (e) {
                console.error('Play attempt failed:', e);
            }
        }
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                event.preventDefault();
                handlePlayPause(event);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
    }, []);
    // useEffect(() => { if (AUDIO.playing) audioRef.current.play() }, [AUDIO.playing]);

    return (
        <div>
            <div className="flex h-full items-center justify-start px-3 gap-2">
                <Tooltip title="Lirik" placement="top-start" className={`${screen.width > 500 ? "hidden" : "block"}`}>
                    <div className="relative flex items-center justify-center">
                        <LyricsIcon className="scale-[0.9] text-gray-800" />
                        <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                    </div>
                </Tooltip>
                <div className="relative flex items-center justify-center">

                    <FavoriteBorderIcon className="scale-[1]" />
                    <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                </div>
                <div className="relative flex items-center justify-center"
                    style={{
                        display: screen.width > 500 ? "flex" : "none",
                    }}
                >
                    <SkipPreviousIcon className="scale-[1.1]" />
                    <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "></div>
                </div>
                <div className="relative flex items-center justify-center">

                    {AUDIO.playing ? <PauseIcon className="scale-[1.1]" /> : <PlayArrowIcon className="scale-[1.1]" />}
                    <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "
                        onClick={handlePlayPause}
                    ></div>
                </div>
                <div className="relative flex items-center justify-center">
                    <SkipNextIcon className="scale-[1.1]" />
                    <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out"
                        onClick={() => {
                            if (SONG.next) setSONG(p => ({ ...p, current: p.next }));
                            else console.log("No more tracks")
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )
}
