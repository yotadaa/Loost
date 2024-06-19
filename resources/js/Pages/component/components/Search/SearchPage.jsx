
import React, { useContext, useEffect, useState, useRef } from 'react';
import Context from '../../provider/context';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

import SliderContainer from './SliderContainer';
import SongSlider from './SongSlider';
import SongCard from '../SongCard';
import ArtistCard from '../ArtistCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function SearchPage({ props }) {

    const [division, setDivision] = useState(0);
    const { setCurrentMenu, menuComponent, mainComponent, setAlbumId, screen, searchFocus, setSearchFocus } = useContext(Context);
    const [properties, setProperties] = useState({
        musics: null,
        albums: null,
        artists: null,
        playlists: null,
        genres: null,
    })
    useEffect(() => {
    }, []);

    const [query, setQuery] = useState({
        search: "",
    })
    const handleSearchChange = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setQuery(prev => ({ ...prev, search: e.target.value }));
    };

    const [hover, setHover] = useState({
        tren: null,
    })
    async function doSearch(queries) {
        const response = await axios.get(route("search-query", { query: queries }));
        if (response.data.success) {
            setProperties({
                musics: response.data.musics,
                albums: response.data.albums,
                artists: response.data.artists,
                playlists: response.data.playlists,
                genres: response.data.genres,
            })
            console.log(response.data);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            doSearch(query.search);
        }, 1000);

        // Cleanup timer on unmount or if query changes
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        console.log("State: ", searchFocus)
    }, [searchFocus])

    return (
        <div
            className="h-screen w-full pb-[150px] fixed overflow-y-auto custom-scrollbar"
            style={{
            }}
        >
            <div className='bg-gray-300 w-full  py-5 pb-0 px-[5px]'
                style={{
                    paddingLeft: screen.width < 500 ? 5 : menuComponent.width + 30,
                }}
            >
                <div className='border-2 border-gray-500  rounded-3xl px-3 w-full max-w-[400px] flex items-center justify-between'>
                    <input
                        className='bg-transparent p-2 rounded-full w-full outline-none placeholder:text-gray-500 text-sm border-none font-medium'
                        placeholder='cari sesuatu'
                        value={query.search}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            // if (e.key === " ") {
                            //     setQuery(p => ({ ...p, search: p.search + e.key }))
                            // }
                            e.stopPropagation();
                        }}
                        onFocus={() => {
                            setSearchFocus(true);
                        }}
                        onBlur={() => {
                            setSearchFocus(false);
                        }}
                    />

                    <div
                        style={{
                            display: query.search.length > 0 ? "block" : 'none'
                        }}
                        onClick={() => setQuery(p => ({ ...p, search: "" }))}>
                        <ClearIcon className='scale-[0.8] bg-transparent hover:bg-gray-400 bg-opacity-80 rounded-full'
                        />
                    </div>
                </div>
                <div className='flex text-sm font-medium gap-3 py-2 flex-wrap'>
                    <section onClick={() => setDivision(0)} className={`p-1 px-3 rounded-full  cursor-pointer bg-gray-100 border-2  ${division === 0 ? "bg-gray-100 text-gray-800" : "bg-gray-800 text-gray-100 hover:text-gray-100"}`}>Semua</section>
                    <section onClick={() => setDivision(1)} className={`p-1 px-3 rounded-full  cursor-pointer ${division === 1 ? "bg-gray-100 text-gray-800" : "bg-gray-800 hover:bg-gray-600 text-gray-100 hover:text-gray-100"}`}>Lagu</section>
                    <section onClick={() => setDivision(2)} className={`p-1 px-3 rounded-full  cursor-pointer ${division === 2 ? "bg-gray-100 text-gray-800" : "bg-gray-800 hover:bg-gray-600 text-gray-100 hover:text-gray-100"}`}>Album</section>
                    <section onClick={() => setDivision(3)} className={`p-1 px-3 rounded-full  cursor-pointer ${division === 3 ? "bg-gray-100 text-gray-800" : "bg-gray-800 hover:bg-gray-600 text-gray-100 hover:text-gray-100"}`}>Penyanyi</section>
                    <section onClick={() => setDivision(4)} className={`p-1 px-3 rounded-full  cursor-pointer ${division === 4 ? "bg-gray-100 text-gray-800" : "bg-gray-800 hover:bg-gray-600 text-gray-100 hover:text-gray-100"}`}>Playlist</section>
                    <section onClick={() => setDivision(5)} className={`p-1 px-3 rounded-full  cursor-pointer ${division === 5 ? "bg-gray-100 text-gray-800" : "bg-gray-800 hover:bg-gray-600 text-gray-100 hover:text-gray-100"}`}>Genre</section>
                </div>
                <div className='flex flex-col gap-5'>

                    <SliderContainer

                        title={"Browse Categories"}
                        style={{
                            display: division === 5 || division === 0 ? "block" : "none"
                        }}
                    >
                        {properties.genres?.map((o, i) => (// (parseInt(screen.width / 200) > 5 ? parseInt(screen.width / 200) : 5)).map((o, i) => (
                            <div key={i} className="relative shadow-md w-fit  overflow-hidden cursor-pointer rounded-md bg-rose-500"
                                style={{
                                    minWidth: mainComponent.width / 6 < 120 ? 120 : mainComponent.width / 6 > 180 ? 180 : mainComponent.width / 6,
                                    minHeight: mainComponent.width / 6 < 120 ? 120 : mainComponent.width / 6 > 180 ? 180 : mainComponent.width / 6,

                                }}
                            >
                                <div className='absolute bottom-0 text-2xl font-semibold px-3 py-2'>{o.nama}</div>
                            </div >
                        ))}
                    </SliderContainer>
                    <SongSlider
                        title="Musik"
                        style={{
                            display: (division === 1 || division === 0) && properties.musics !== null && properties.musics?.length > 0 ? "block" : "none"
                        }}
                    >
                        {properties.musics?.map((o, i) => (
                            <SongCard
                                key={i}
                                index={i}
                                o={o}
                                hover={hover}
                                setHover={setHover}
                            />
                        ))}
                    </SongSlider>
                    <SongSlider
                        title="Artist"
                        style={{
                            display: (division === 3 || division === 0) && properties.artists !== null && properties.artists?.length > 0 ? "block" : "none"
                        }}
                    >
                        {properties.artists?.map((o, i) => (
                            <ArtistCard
                                key={i}
                                index={i}
                                o={o}
                                setHover={setHover}
                                hover={hover}
                            />
                        ))}
                    </SongSlider>
                    <SongSlider
                        title="Albums"
                        style={{
                            display: (division === 2 || division === 0) && properties.albums !== null && properties.albums?.length > 0 ? "block" : "none"
                        }}
                    >
                        {properties.albums?.map((o, i) => (
                            <div className={` relative flex-shrink-0 overflow-hidden cursor-pointer rounded-md transform transition-transform duration-300 ease-in-out ${hover.tren === i ? "bg-gray-200 shadow-sm " : "bg-transparent shadow-none"}`}
                                style={{
                                    height: mainComponent.width / 4 + 50,
                                    width: mainComponent.width / 4,
                                    maxWidth: 200,
                                    maxHeight: 240,
                                    minWidth: 120,
                                    minHeight: 190
                                }}
                                onMouseEnter={() => {
                                    setHover(p => ({
                                        ...p,
                                        tren: i
                                    }))
                                }}
                                onMouseLeave={() => {
                                    setHover(p => ({
                                        ...p,
                                        tren: null
                                    }))
                                }}
                                onClick={() => {
                                    setAlbumId(o.id_album)
                                    setCurrentMenu("9");
                                }}
                            >


                                <div className='rounded-full p-3  flex justify-center items-center'>
                                    <img
                                        className={` shadow-md rounded-full  object-cover transform transition-transform duration-300 ease-in-out ${hover.tren === i ? "shadow-xl" : "shadow-none"} `}
                                        src={`storage/` + o?.foto}
                                        alt={`popular-${i}`}
                                        draggable={false}
                                        style={{
                                            height: mainComponent.width / 4 - 30,
                                            width: mainComponent.width / 4 - 30,
                                            maxWidth: 150,
                                            maxHeight: 150,
                                            minWidth: 100,
                                            minHeight: 100
                                        }}
                                    />
                                </div>
                                <div className={` h-full w-full rounded-md rounded-t-full`}>
                                    <div className={` bottom-0 left-0 right-0 p-2 text-black `}>
                                        <p className="text-lg font-medium w-full overflow-hidden whitespace-nowrap text-ellipsis ">{o.nama}</p>
                                        <p className="text-xs font-medium">Artis</p>

                                    </div>
                                </div>
                                <div
                                    className={`w-[50px] h-[50px] rounded-full shadow-xl  right-2 absolute bg-gray-800 transition-all duration-300 ease-in-out  ${hover.tren === i ? "bottom-10" : "-bottom-16"} hover:bg-gray-500 flex items-center justify-center`}
                                >
                                    <PlayArrowIcon
                                        className='scale-[1.5] text-gray-50'
                                    />
                                </div>
                                <div className='absolute text-gray-800 right-1 top-2 hover:bg-gray-500 bg-opacity-55 hover:bg-opacity-50 p-2 rounded-full transition-all duration-300 ease-in-out'>
                                    <MoreVertIcon className='scale-[1.3]' />
                                </div>
                                <div className={`left-2 flex gap-2 absolute transition-all duration-300 ease-in-out  ${hover.tren === i ? "bottom-2" : "-bottom-10"}  text-gray-50 scale-[0.9]`}>
                                </div>
                            </div >
                        ))}
                    </SongSlider>
                </div>
            </div>

        </div>
    )
}
