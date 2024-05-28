
import { useEffect, useState } from "react";
import { motion } from "framer-motion"

export default function LyricDisplay({
    showLyrics, setShowLyrics, lyrics, artists, musics, audioRef, currentTime
}) {

    const id_artist = musics?.find(o => o?.id_musik === showLyrics?.id)?.id_artist;
    const [musicLyric, setMusicLyric] = useState(lyrics);

    useEffect(() => {
        console.log(currentTime.toFixed(2))
    }, [currentTime])

    return (
        <motion.div className="absolute top-[50px] shadow-xl w-full h-[480px] bg-emerald-400 z-[10] rounded-md"
            style={{
                right: !showLyrics.show ? -500 : -20
            }}
            animate={{
                right: !showLyrics.show ? -500 : -20
            }}

        >
            {!showLyrics.id ? <div className="w-full h-[480px] flex items-center justify-center">
                <div className="mr-5 font-medium drop-shadow-lg">Belum memilih lagu</div>
            </div> : <></>}
            <div className="flex flex-col p-2">

                <header className="font-medium">
                    <div>
                        {musics.find(o => o.id_musik === showLyrics?.id)?.judul}
                    </div>
                    <div>
                        {artists.find(o => o.id_penyanyi === id_artist)?.nama}
                    </div>
                </header>
                <main className="max-h-[400px] overflow-y-scroll flex flex-col gap-2 mt-2 pl-2 select-none">
                    {musicLyric.map((o, i) => {
                        if (o.id_musik === showLyrics?.id) {
                            const next = i + 1 < musicLyric.length - 1 ? i + 1 : i;
                            const isActive = currentTime.toFixed(2) > parseFloat(o.seconds) && currentTime.toFixed(2) <= musicLyric[next].seconds;
                            return (
                                <div
                                    key={i}
                                    className={`font-medium hover:text-gray-50 hover:contrast-150 cursor-pointer drop-shadow-xl ${isActive ? "text-gray-50" : "text-black"}`}
                                    onClick={() => {
                                        audioRef.current.currentTime = parseInt(o.seconds);
                                    }}
                                >
                                    {parseFloat(o.seconds).toFixed(2)} {o.sentences}
                                </div>
                            );
                        }
                        return null; // Return null if the condition is not met
                    })}
                </main>
            </div>

        </motion.div>
    )
}
