import { useState } from "react"


export default function ListArtists({ props }) {

    const [properties, setProperties] = useState({
        swell: null,
    })

    return (
        <div className="h-full p-10">
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
                        className=" py-2 bg-gray-100 w-[500px] px-2 rounded-md hover:bg-gray-200 cursor-pointer"
                    >
                        <div>{artist.nama}</div>
                        <div
                            style={{
                                display: properties.swell === index ? "block" : "none"
                            }}
                            className="mt-2"
                        >
                            <div className="w-full h-fit relative overflow-hidden"
                                style={{
                                    paddingTop: '70%',
                                }}
                            >
                                <img
                                    className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full"
                                    style={{ objectFit: 'cover' }}
                                    src={"/storage/" + artist.profil} alt="Artist Profile" />
                            </div>
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
