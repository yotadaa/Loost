import { useRef, useState } from "react"


export default function AddLyrics({
    showAddLyrics, setShowAddLyrics, music, src
}) {

    const audioRef = useRef(null);

    return (
        <div
            className="w-full min-h-full overflow-y-scroll fixed top-0 left-0 bg-gray-100 z-[20] flex-col"
            style={{
                display: showAddLyrics ? "flex" : "none"
            }}
        >
            <div className="p-2">
                <div
                    className="px-3 py-2 bg-gray-200 border border-black w-fit rounded-md hover:bg-gray-300 cursor-pointer select-none"
                    onClick={() => {
                        setShowAddLyrics(false);
                        if (audioRef.current) audioRef.current.pause();
                    }}
                >Kembali</div>
            </div>
            <div className="flex flex-col h-full items-center w-full">
                <audio
                    src={src ? src : ""} type="audio/mpeg" controls
                    className="w-96"
                    ref={audioRef}
                />
                <div>Detik adalah kunci, jika ada detik yang sama, lirik sebelumnya akan ditimpa.</div>
                <div className="flex flex-col items-center max-h-[500px] overflow-y-auto">
                    <div>Lyrics</div>
                    <div>
                        {music.lyrics.map((o, i) => (
                            <div
                                key={i}
                                className="flex py-1 font-semibold hover:contrast-150 cursor-pointer drop-shadow-md"
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = parseFloat(o.timestamp);
                                    }
                                }}
                            >
                                <div
                                    className="min-w-20 px-4 text-center bg-purple-300 rounded-l-md"
                                >{o.timestamp}</div>
                                <div
                                    className="px-3 text-center bg-emerald-300 rounded-r-md"
                                >{o.sentence}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
