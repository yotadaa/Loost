import { useContext } from "react"
import Context from "../../provider/context"


export default function LyricsPage({ props }) {

    const { SONG, MUSIC } = useContext(Context);

    return (
        <div className="w-full h-full p-2 flex gap-2">
            <div className="">
                {Object.keys(SONG.current).map((o, i) => (
                    <div
                        key={i}
                    ><span className="font-bold">{o?.toString()}</span>: {SONG.current[o]?.toString}</div>
                ))}
            </div>
            <div></div>
        </div>
    )
}
