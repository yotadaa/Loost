import { useContext, useEffect, useState, useRef } from "react"
import Context from "../../provider/context"

export default function LyricsPage({ props }) {
    const { SONG, setAUDIO, audioRef, getImageFilename, AUDIO } = useContext(Context);
    const [filename, setFilename] = useState(SONG.current?.single === "T" ? getImageFilename(SONG.current?.artwork) : getImageFilename(SONG.current?.foto));
    const [imageUrl, setImageUrl] = useState(route("get-image", { category: SONG.current?.single === "T" ? "single" : "albums", filename: filename || "undefined.jpg" }));
    const lyricsRef = useRef(null);  // Create a ref for the lyrics container

    useEffect(() => {
        setFilename(SONG.current?.single === "T" ? getImageFilename(SONG.current?.artwork) : getImageFilename(SONG.current?.foto));
        setImageUrl(route("get-image", { category: SONG.current?.single === "T" ? "single" : "albums", filename: filename || "undefined.jpg" }));
    }, [filename]);

    useEffect(() => {
        if (lyricsRef.current) {
            const activeLyric = lyricsRef.current.querySelector('.active');
            if (activeLyric) {
                activeLyric.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [AUDIO.currentTime]);  // Scroll to the active lyric whenever the audio currentTime updates

    return (
        <div className="w-full h-full p-2 flex gap-2 overflow-y-auto ">
            <div className="z-[0]">
                <img
                    src={imageUrl}
                    className="fixed top-0 left-0 w-full h-full object-cover "
                />
                <div className="fixed inset-0 opacity-70 bg-gradient-to-t from-black via-black/100 to-transparent"></div>
                <div className="fixed h-1/2 inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div>
            </div>
            <div className="z-[1] text-gray-100 font-thin flex flex-col gap-3 overflow-y-auto w-full custom-scrollbar" ref={lyricsRef}>
                {SONG.current?.lyrics?.map((o, i) => {
                    const endTime = SONG?.current?.lyrics[i + 1] ? SONG?.current?.lyrics[i + 1].seconds : SONG?.current?.lyrics[i].seconds;
                    return (
                        <div
                            key={i}
                            className={`${parseFloat(AUDIO.currentTime) >= o?.seconds && parseFloat(AUDIO.currentTime) <= endTime ? "font-bold active" : "font-thin"}`}
                            onClick={() => {
                                setAUDIO(p => ({
                                    ...p,
                                    currentTime: o?.seconds
                                }));
                                audioRef.current.currentTime = o?.seconds

                            }}
                        >{o?.sentences}</div>
                    );
                })}
            </div>
        </div>
    )
}
