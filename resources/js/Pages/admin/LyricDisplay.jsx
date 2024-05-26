import { motion } from "framer-motion"

export default function LyricDisplay({
    showLyrics, setShowLyrics, lyrics, artists, musics, audioRef
}) {

    const id_artist = musics?.find(o => o?.id_musik === showLyrics?.id)?.id_artist;

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
                    {lyrics.map((o, i) => {
                        if (o.id_musik === showLyrics?.id) return (
                            <div
                                key={i}
                                className="font-medium hover:text-orange-700 drop-shadow-xl"
                                onClick={() => {
                                    audioRef.current.currentTime = parseInt(o.seconds);
                                }}
                            >
                                {o.sentences}
                            </div>
                        )
                    })}
                </main>
            </div>

        </motion.div>
    )
}
