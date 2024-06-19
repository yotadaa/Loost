import { useContext, useEffect, useState } from "react"
import Context from "../../provider/context"


export default function LyricsPage({ props }) {

    const { SONG, audioRef, getImageFilename } = useContext(Context);
    console.log(SONG?.current?.lyrics)
    const [filename, setFilename] = useState(SONG.current?.single === "T" ? getImageFilename(SONG.current?.artwork) : getImageFilename(SONG.current?.foto))
    const [imageUrl, setImageUrl] = useState(route("get-image", { category: SONG.current?.single === "T" ? "single" : "albums", filename: filename || "undefined.jpg" }))
    useEffect(() => {
        setFilename(SONG.current?.single === "T" ? getImageFilename(SONG.current?.artwork) : getImageFilename(SONG.current?.foto))
    }, [filename])
    useEffect(() => {
        setImageUrl(route("get-image", { category: SONG.current?.single === "T" ? "single" : "albums", filename: filename || "undefined.jpg" }));
    }, [filename])
    return (
        <div className="w-full h-full p-2 flex gap-2">
            {imageUrl}
            <img
                src={imageUrl}
                width={300}
            />
            <div className="">
                {SONG.current?.lyrics?.map((o, i) => (
                    <div
                        key={i}
                    >{o?.sentences}</div>
                ))}
            </div>
            <div></div>
        </div>
    )
}
