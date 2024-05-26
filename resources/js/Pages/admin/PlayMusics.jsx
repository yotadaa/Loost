import { useRef, useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function PlayMusics({ props }) {
    const audioRef = useRef(null);
    const [media, setMedia] = useState({
        musics: props.musics,
        lyrics: props.lyrics,
        showing: null,
        src: null,
    });
    const [search, setSearch] = useState({
        music: "",
    });
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
            });
            audioRef.current.addEventListener("error", () => {
                setHasError(true); // Set error state
            });
        } catch (error) {
            console.error("Error loading audio:", error);
            setHasError(true);
        }
    };
    useEffect(() => {


        loadAudio("storage/assets/loost/musics/1716712966.mp3");
    }, []);


    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-10">
            <div className="w-[500px]">
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
                <div className="mt-2">
                    {media.musics.map((o, i) => (
                        <div
                            className="flex gap-2 items-center bg-emerald-300 p-1 rounded-md shadow-sm"
                            key={i}
                        >
                            <img
                                src={"storage/" + props.albums.find(obj => obj.id_album === o.id_album).foto}
                                className="w-10 h-10 rounded-md shadow-md"
                            />
                            <div className="flex flex-col gap-[-5px]">
                                <div>{o.judul}</div>
                                <div className="text-sm text-gray-700 ">{props.artists.find(obj => obj.id_penyanyi === o.id_artist).nama}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <AudioPlayer
                    audioRef={audioRef}
                    duration={duration}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                />
            </div>
        </div>
    );
}
