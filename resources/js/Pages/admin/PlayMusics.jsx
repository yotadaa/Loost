import { useRef, useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from "framer-motion";
import LyricDisplay from "./LyricDisplay";

export default function PlayMusics({ props }) {
    const audioRef = useRef(null);
    const [media, setMedia] = useState({
        musics: props.musics,
        lyrics: props.lyrics,
        showing: null,
        src: null,
        next: null,
        changing: false,
        current: 0,
    });
    const [search, setSearch] = useState({
        music: "",
    });

    const [audioHover, SetAudioHover] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveringPlayButton, setHoveringPlayButton] = useState(null);
    const [currentSource, setCurrentSource] = useState("");
    const [hasError, setHasError] = useState(null);
    const [playing, setPlaying] = useState(false);

    const [showLyrics, setShowLyrics] = useState({
        show: false,
        id: null
    })

    const loadAudio = async (src) => {
        setIsLoading(true);
        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`Audio failed to load: ${response.statusText}`);
            }
            const audioBlob = await response.blob();
            const audioURL = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioURL;
            audioRef.current.addEventListener("loadeddata", () => {
                setIsLoading(false);
                setDuration(audioRef.current.duration);
                audioRef.current.play();
                setPlaying(true);
            });
            audioRef.current.addEventListener("error", () => {
                setHasError(true); // Set error state
            });
        } catch (error) {
            console.error("Error loading audio:", error);
            setHasError(true);
        }
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

    function handleChangeMusic(src, id, next, curr) {
        setMedia(p => ({ ...p, current: curr }))
        if (media.musics[media.next]?.source) {
            setMedia(p => ({ ...p, next: next }))
        }
        setShowLyrics(p => ({
            ...p,
            id: id,
        }))
        setCurrentSource(src);
        // if (audioRef.current) audioRef.current.pause();

        // try {
        //     loadAudio(src);
        //     if (audioRef.current) audioRef.current.play();
        // } catch (e) {
        //     console.error(e)
        // } finally {
        //     if (audioRef.current) audioRef.current.play();

        // }
        // if (audioRef.current) audioRef.current.play();
    }

    useEffect(() => {

        loadAudio(currentSource);
        // loadAudio("storage/assets/loost/musics/1716712966.mp3");
    }, [currentSource]);

    useEffect(() => {
        if (media.musics[media.next]?.source) {
            loadAudio(media.musics[media.next]?.source);
            setShowLyrics(p => ({ ...p, id: media.musics[media.next]?.id_musik }))
        } else {

        }
        console.log(media.musics[media.next]);
    }, [media.changing]);

    useEffect(() => {
        if (currentTime >= audioRef.current?.duration && !audioHover) {
            if (media.musics[media.current + 1]?.source) {
                loadAudio(media.musics[media.current + 1]?.source);
                setShowLyrics(p => ({ ...p, id: media.musics[media.current + 1]?.id_musik }));
                setMedia(p => ({ ...p, current: p.current + 1 }))
            }
        }
    }, [currentTime]);


    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-3 pt-8 overflow-hidden">

            <div className="relative h-full w-[500px] overflow-x-hidden">
                <LyricDisplay
                    showLyrics={showLyrics}
                    setShowLyrics={setShowLyrics}
                    lyrics={props.lyrics}
                    artists={props.artists}
                    musics={props.musics}
                    audioRef={audioRef}
                    currentTime={currentTime}
                />
                <motion.div className="absolute bottom-[200px] rotate-180 rounded-full bg-emerald-400 w-[40px] h-[30px] flex items-center justify-center cursor-pointer hover:bg-emerald-500 pl-2 z-[21]"
                    onClick={() => {
                        setShowLyrics(p => ({
                            ...p,
                            show: !p.show,
                        }))
                    }}
                    style={{
                        right: showLyrics.show ? 460 : -15
                    }}
                    animate={{
                        right: showLyrics.show ? 460 : -15
                    }}
                >


                    <PlayArrowIcon />
                </motion.div>
                <div className=" px-5">
                    <div className="w-full">
                        <input
                            placeholder="Cari musik"
                            className="bg-gray-700 text-gray-200 placeholder:text-gray-200 w-full p-2 rounded-xl"
                            value={search.music}
                            onChange={(e) => {
                                setSearch((prev) => ({
                                    ...prev,
                                    music: e.target.value,
                                }));
                            }}
                        />
                    </div>

                    <div className="mt-2 gap-1 flex flex-col">
                        {media.musics.map((o, i) => (
                            <div
                                className="flex gap-2 items-center justify-between pr-3 bg-emerald-300 p-1 rounded-md shadow-sm"
                                key={i}
                            >
                                <div className="flex gap-2 items-center">
                                    <img
                                        src={"storage/" + props.albums.find(obj => obj.id_album === o.id_album).foto}
                                        className="w-10 h-10 rounded-md shadow-md"
                                    />
                                    <div className="flex flex-col gap-[-5px]">
                                        <div>{o.judul}</div>
                                        <div className="text-sm text-gray-700 ">{props.artists.find(obj => obj.id_penyanyi === o.id_artist)?.nama}</div>
                                    </div>
                                </div>
                                <div className="relative "
                                >
                                    <div className="flex items-center gap-5">
                                        <div>
                                            {formatSeconds(parseInt(o.duration))}
                                        </div>

                                        <div className="relative cursor-pointer"
                                            onMouseEnter={() => setHoveringPlayButton(o.id_musik)}
                                            onMouseLeave={() => setHoveringPlayButton(null)}
                                            onClick={() => handleChangeMusic(o.source, o.id_musik, i + 1, i)}
                                        >
                                            <motion.div
                                                className="z-[1] absolute top-0 left-0 w-full h-full bg-gray-50 opacity-50 rounded-full "
                                                style={{
                                                    scale: 0,
                                                }}
                                                animate={{
                                                    scale: hoveringPlayButton === o.id_musik ? 1 : 0,
                                                }}
                                            >

                                            </motion.div>
                                            <PlayArrowIcon
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                }}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <AudioPlayer
                    audioRef={audioRef}
                    duration={duration}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    playing={playing}
                    setPlaying={setPlaying}
                    media={media}
                    setMedia={setMedia}
                    audioHover={audioHover}
                    SetAudioHover={SetAudioHover}
                />
            </div>
        </div>
    );
}
