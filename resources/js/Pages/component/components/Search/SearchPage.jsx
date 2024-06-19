
import React, { useContext, useEffect, useState } from 'react';
import Context from '../../provider/context';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchPage({ props }) {

    const { setCurrentMenu, menuComponent } = useContext(Context);
    useEffect(() => {
    }, []);

    const [query, setQuery] = useState({
        search: "",
    })

    const handleSearchChange = (e) => {
        setQuery(p => ({ ...p, search: e.target.value }))
    }

    return (
        <div
            className="h-screen w-full pb-[150px] fixed"
            style={{
            }}
        >
            <div className='bg-gray-300 w-full  py-5 pb-0'
                style={{
                    paddingLeft: menuComponent.width + 30,
                }}
            >
                <div className='border-2 border-gray-500  rounded-3xl px-3 w-[400px] flex items-center justify-between'>
                    <input
                        className='bg-transparent p-2 rounded-full w-full outline-none placeholder:text-gray-500 text-sm border-none font-medium'
                        placeholder='cari sesuatu'
                        value={query.search}
                        onChange={handleSearchChange}
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
                <div className='flex text-sm font-medium gap-3 py-2'>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-100 border-2 border-gray-800 hover:text-gray-100 text-gray-800'>Semua</section>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-800 text-gray-100'>Lagu</section>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-800 text-gray-100'>Album</section>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-800 text-gray-100'>Penyanyi</section>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-800 text-gray-100'>Playlist</section>
                    <section className='p-1 px-3 rounded-full hover:bg-gray-600 cursor-pointer bg-gray-800 text-gray-100'>Genre</section>
                </div>
            </div>

        </div>
    )
}
