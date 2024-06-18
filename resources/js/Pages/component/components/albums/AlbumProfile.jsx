import { useEffect } from "react"



export default function AlbumProfile({
    ALBUM, imageUrl, setArtistId, setCurrentMenu
}) {

    useEffect(() => setArtistId(null));

    return (
        <header className="">

            <div className={` transition-all duration-300ease-in-out relative w-full rounded-md overflow-hidden h-[120px] `}
            >
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div> */}
                {/* <div className="absolute inset-0 opacity-70 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 opacity-10  bg-gradient-to-t from-black via-black/0 to-transparent"></div>
                    <div className="absolute h-[50px] inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div> */}
                <div className="absolute top-0 left-0 w-full p-4 text-white">
                    <div className="text-up text-lg font-semibold">
                        Detail Album
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <div className={`absolute flex items-center gap-3  left-0 p-4 text-white transition-all duration-300 ease-in-out top-[40px]`} >
                        <div className="w-[60px] h-[60px] min-w-[60px]">
                            <img
                                className="w-full h-full rounded-md shadow-md object-cover"
                                src={imageUrl} />
                        </div>
                        <div className="text-bottom text-3xl font-bold text-nowrap truncate ">
                            <div>{ALBUM?.album?.nama}</div>
                            <div className="font-thin text-sm hover:underline cursor-pointer w-fit"
                                onClick={() => {
                                    setCurrentMenu("8");
                                    setArtistId(ALBUM?.artist.id_penyanyi);
                                }}
                            >{ALBUM?.artist?.nama}</div>
                        </div>
                    </div>
                </div>
            </div >
        </header>
    )
}
