import { useState } from "react"


export default function ListAlbums({ props }) {

    const [properties, setProperties] = useState({
        swell: null,
    })

    // const [albums, setAlbums] = useState()

    return (
        <div className="h-full p-10">
            <div
                className="flex flex-col justify-start items-start h-full gap-2 p-10"
            >
                {props.albums.map((album, index) => (
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
                        <div>{album.nama}</div>
                        <div
                            style={{
                                display: properties.swell === index ? "block" : "none"
                            }}
                            className="mt-2"
                        >
                            <div className="w-full h-fit relative overflow-hidden"
                                style={{
                                    // paddingTop: '60%',
                                }}
                            >
                                <img
                                    // className="absolute top-0 left-0 w-[300px] h-[300px]"
                                    style={{ objectFit: 'cover' }}
                                    src={"/storage/" + album.foto} alt="Artist Profile" />
                            </div>
                            <div className="font-bold">
                                Album oleh {props.artists.find(o => o.id_penyanyi === album.id_artist).nama}
                            </div>
                            <div className="">
                                Dibuat pada tanggal: {album.release_date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )

}
