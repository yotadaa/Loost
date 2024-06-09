import { useContext, useState, useEffect } from "react"
import Context from "../component/provider/context";


export default function ListArtists({ props }) {

    const { setURI, URI } = useContext(Context);

    const [properties, setProperties] = useState({
        swell: null,
    });

    useEffect(() => {
        // URI.searchParams.set("foo", "bar");
        // history.pushState({}, "", URI);
    })

    return (
        <div className="h-full max-w-full w-full sp-10">
            <div
                className="flex flex-col justify-start items-start h-full gap-2 p-10"
            >
                {props.artists.map((artist, index) => (
                    <div key={index}
                        onClick={() => {
                            if (properties.swell !== index) {
                                setProperties(prevs => ({
                                    ...prevs,
                                    swell: index
                                }))
                            } else {
                                setProperties(prevs => ({
                                    ...prevs,
                                    swell: null
                                }))
                            }
                        }}
                        className=" py-2 bg-gray-100 w-full max-w-[500px] px-2 rounded-md hover:bg-gray-200 cursor-pointer"
                    >
                        <div>{artist.nama}</div>
                        <div
                            style={{
                                display: properties.swell === index ? "block" : "none"
                            }}
                            className="mt-2"
                        >
                            <img
                                className=" w-[300px] h-[300px] rounded-xl"
                                style={{ objectFit: 'cover' }}
                                src={"/storage/" + artist.profil} alt="Artist Profile" />
                            <div
                                className="mt-2">
                                {artist.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )

}
