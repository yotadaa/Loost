import { useRef, useState } from "react"


export default function AddLyrics({
    showAddLyrics, setShowAddLyrics, music, setMusic, src
}) {

    const audioRef = useRef(null);
    const [lyrics, setLyrics] = useState({
        second: 0,
        sentence: "",
    })

    return (
        <div
            className="w-full h-full absolute top-0 left-0 bg-gray-100 z-[20] flex-col"
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
                <div className="flex gap-1 w-[500px] items-center">

                    <input
                        placeholder="detik"
                        className="w-20 p-2 rounded-md border border-black text-sm"
                        type='number'
                        min="0"
                        value={lyrics.second}
                        onChange={(e) => {
                            setLyrics(prevs => ({
                                ...prevs,
                                second: e.target.value,
                            }))
                        }}
                    />
                    <input
                        placeholder="detik"
                        className="w-full p-2 rounded-md border border-black text-sm"
                        type='text'
                        value={lyrics.sentence}
                        onChange={(e) => {
                            setLyrics(prevs => ({
                                ...prevs,
                                sentence: e.target.value,
                            }))
                        }}
                    />
                    <div
                        className="text-sm p-2 bg-gray-200 rounded-md border border-gray-500 cursor-pointer hover:bg-gray-300 select-none"
                        onClick={() => {
                            if (lyrics.second && lyrics.sentence) {
                                if (music.lyrics.find(o => o.timestamp === lyrics.second)) {
                                    setMusic(prevs => ({
                                        ...prevs,
                                        lyrics: prevs.lyrics.map(o =>
                                            o.timestamp === lyrics.second
                                                ? { timestamp: lyrics.second, sentence: lyrics.sentence }
                                                : o
                                        )
                                    }));
                                } else {
                                    setMusic(prevs => {
                                        const updatedLyrics = [
                                            ...prevs.lyrics,
                                            { timestamp: lyrics.second, sentence: lyrics.sentence }
                                        ].sort((a, b) => a.timestamp - b.timestamp);

                                        return {
                                            ...prevs,
                                            lyrics: updatedLyrics
                                        };
                                    });
                                }

                                setLyrics(prevs => ({
                                    ...prevs,
                                    second: 0,
                                    sentence: "",
                                }))
                            }
                        }}
                    >
                        Tambah
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <div>Lyrics</div>
                    <div>
                        {music.lyrics.map((o, i) => (
                            <div
                                key={i}
                                className="flex py-1 font-semibold"
                            >
                                <div
                                    className="w-10 text-center bg-purple-300 rounded-l-md"
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
