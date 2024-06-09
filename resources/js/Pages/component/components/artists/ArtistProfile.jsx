import { useRef, useState, useEffect, useContext } from "react";
import Context from "../../provider/context";

export default function ArtistProfile({
    getImageFilename, ARTIST, props
}) {



    const { screen } = useContext(Context);
    const [filename, setFilename] = useState(getImageFilename(props?.props?.artist ? props?.props?.artist[0]?.profil : ARTIST?.profil));
    const imageUrl = filename ? route("get-image", { category: "artists", filename: (filename || "src/undefined.jpg") }) : '';
    const [hover, setHover] = useState(false);
    const someRef = useRef(null);
    const [extraHeight, setExtraHeight] = useState(0);

    useEffect(() => {
        if (someRef.current) {
            setExtraHeight(600);
        }
    }, [someRef.current]);


    return (
        <div className={` transition-all duration-300 h-[300px] ease-in-out relative w-full rounded-md overflow-hidden ${hover ? `h-full` : "h-[300px]"}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <img src={imageUrl} className="absolute left-0 top-0 w-full h-full object-cover object-center rounded-xl" />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div> */}
            <div className="absolute inset-0 opacity-70 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div ref={someRef} className={`text-white absolute left-0 bottom-0 max-h-[60px] text-xs p-4 transition-all duration-300 ease-in-out ${hover ? (`bottom-[${40}px]`) : "bottom-[0px]"}`}>
                {ARTIST?.description}
            </div>
            <div className="absolute inset-0 opacity-10  bg-gradient-to-t from-black via-black/0 to-transparent"></div>
            <div className="absolute h-[50px] inset-0 bg-gradient-to-b from-black via-black/1 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full p-4 text-white">
                <div className="text-up text-lg font-semibold">
                    Detail Artist
                </div>
            </div>
            <div className="flex-shrink-0">
                <div className={`absolute flex items-center gap-3  left-0 p-4 text-white transition-all duration-300 ease-in-out ${hover ? "bottom-[70px]" : "bottom-[40px]"}`} >
                    <div className="w-[60px] h-[60px] min-w-[60px]">
                        <img
                            className="w-full h-full rounded-md shadow-md object-cover"
                            src={route("get-image", { category: "artists", filename: (filename || "src/undefined.jpg") })} />
                    </div>
                    <div className="text-bottom text-3xl font-bold text-nowrap truncate ">
                        <div>{ARTIST?.nama}</div>
                        <div className="font-thin text-sm">123,456,789 pendengar bulanan</div>
                    </div>
                </div>
            </div>
        </div >
    )
}
