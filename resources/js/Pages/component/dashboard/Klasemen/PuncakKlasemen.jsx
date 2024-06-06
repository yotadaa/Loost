
import { useRef, useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SubjectIcon from '@mui/icons-material/Subject';
import SongCard from '../../components/SongCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TrendNow({
    screen,
    menuComponent,
    popularNow,
    title
}) {

    const scrollContainerRef = useRef(null);
    const [hover, setHover] = useState({
        tren: null,
    })
    return (
        <section>
            <header className="text-xl font-medium drop-shadow-sm flex items-end justify-between">
                <p>{title}</p>
                <p className='text-base hover:underline cursor-pointer flex items-center'><SubjectIcon />Tampilkan semua</p>
            </header>
            <section className="w-full relative ">
                <section className="w-full relative">
                    <div
                        className='w-full gap-2 relative '
                        style={{
                            zIndex: 1,
                        }}
                    >
                        <div
                            className={`flex flex-col overflow-y-visible rounded-md pl-2 custom-scrollbar gap-1 py-1 z-[11] w-[${screen.width - menuComponent.width}px] overflow-hidden`}
                            ref={scrollContainerRef}
                        >
                            <div className="grid-container">
                                {popularNow?.slice(0, (parseInt(screen.width / 200) > 10 ? parseInt(screen.width / 200) : 10)).map((o, i) => (
                                    <div className="grid-item border-t-[1px] gap-10 border-gray-300 w-full" key={i}>
                                        <div className='flex gap-[13px] justify-between w-full'>
                                            <div className='flex gap-[13px]'>
                                                <div className='relative flex items-center justify-center'>
                                                    <img
                                                        src={o.singe === "Y" ? "storage/" + o.artwork : "storage/" + o.foto}
                                                        width={40}
                                                        className="rounded-sm cursor-pointer hover:contrast-[30%]"
                                                    />
                                                    <div className='w-[40px] h-[40px] rounded-md hover:bg-black hover:bg-opacity-30 absolute flex items-center justify-center hover:opacity-100 opacity-0 cursor-pointer'><PlayArrowIcon className='text-gray-50' /></div>
                                                </div>
                                                <div className="font-semibold">
                                                    <h3>{o.judul}</h3>
                                                    <h3 className="text-xs">{o.artist_names}</h3>
                                                </div>
                                            </div>
                                            <div className=' bg-opacity-55 hover:bg-opacity-50 p-2 rounded-full transition-all duration-300 ease-in-out '>
                                                <MoreVertIcon className='scale-[0.9] cursor-pointer hover:bg-gray-200 rounded-full' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            </section>
        </section>
    )
}
