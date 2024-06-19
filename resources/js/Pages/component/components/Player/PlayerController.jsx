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
import CircularProgress from '@mui/material/CircularProgress';

export default function PlayerController({ currentMenu, setCurrentMenu, prevMenu, setPrevMenu }) {

    const { screen, audioRef, AUDIO, setAUDIO, SONG } = useContext(Context);

    const handlePlayPause = async () => {
        if (!audioRef.current || !audioRef.current.src) {
            console.error('No valid audio source.');
            return;
        }

        if (!AUDIO.playing) {
            audioRef.current.pause();
            // setAUDIO({ ...AUDIO, playing: false });
        } else {
            try {
                audioRef.current.play();
                // setAUDIO({ ...AUDIO, playing: true });
                audioRef.current.currentTime = AUDIO.currentTime || 0;
            } catch (e) {
                console.error('Error playing audio:', e);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                event.preventDefault();
                setAUDIO(p => ({ ...p, playing: !p.playing }))
            }
        };

        window.addEventListener("keydown", handleKeyDown);

    }, []); // Ensure useEffect re-runs when AUDIO state changes

    useEffect(() => {
        handlePlayPause();
    }, [AUDIO.playing])

    return (
        <div>
            <div className="flex h-full items-center justify-start px-3 gap-2">
                <Tooltip title="Lirik" placement="top-start" className={`${screen.width > 500 ? "hidden" : "block"}`}>
                    <div className="relative flex items-center justify-center">
                        <LyricsIcon className="scale-[0.9] text-gray-800" />
                        <div className="w-[24px] h-[24px] absolute bg-opacity-[10%] bg-black scale-[1.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-all duration-300 ease-in-out "
                            onClick={() => {
                                setPrevMenu(currentMenu);
                                if (currentMenu !== "12") {
                                    setCurrentMenu("12")
                                } else {
                                    setCurrentMenu(prevMenu)
                                }
                            }}
                        ></div>
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
                        onClick={() => setAUDIO(p => ({ ...p, playing: !p.playing }))}
                    >

                    </div>
                    <div className="w-[24px] h-[24px] -top-2 -left-2 absolute pointer-events-none text-gray-600"
                        style={{ opacity: AUDIO.loading ? 1 : 0 }}
                    ><CircularProgress sx={{ color: 'black' }} /></div>
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
