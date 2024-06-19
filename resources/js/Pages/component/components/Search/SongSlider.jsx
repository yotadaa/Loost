import { useContext, useRef, useState } from "react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SubjectIcon from '@mui/icons-material/Subject';
import Context from "../../provider/context";


export default function SongSlider({ children, title, style }) {


    const scrollContainerRef = useRef(null);
    const [hover, setHover] = useState({
        tren: null,
    })
    const { setCurrentMenu, menuComponent, mainComponent } = useContext(Context);
    return (
        <section
            style={style}
        >
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
                        <div className='h-full py-1 absolute top-0 left-0 w-full flex justify-between items-center z-[1] pointer-events-none '>
                            <div className='bg-gradient-to-r h-full rounded-l-md flex items-center pl-4 from-black via-black/50 via-5% to-transparent'>
                                <div
                                    onClick={() => {
                                        // Smooth scrolling left
                                        scrollContainerRef.current.scrollTo({
                                            left: scrollContainerRef.current.scrollLeft - scrollContainerRef.current.clientWidth / 2,
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    <ArrowBackIosNewIcon className='scale-[2] text-gray-50 z-[10] h-full group pointer-events-auto' />
                                </div>
                            </div>
                            <div className='bg-gradient-to-l h-full rounded-r-md flex items-center pr-4 from-black via-black/50 via-5% to-transparent'>
                                <div
                                    onClick={() => {
                                        // Smooth scrolling right
                                        scrollContainerRef.current.scrollTo({
                                            left: scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth / 2,
                                            behavior: 'smooth',
                                        });
                                    }}
                                >
                                    <ArrowForwardIosIcon className='scale-[2] text-gray-50 z-[10] h-full group pointer-events-auto' />
                                </div>
                            </div>

                            <div className='group-hover:opacity-100 opacity-0 absolute inset-0 bg-black rounded-full z-10 transition duration-300 ease-in-out'></div>
                        </div>
                        <div className={`flex items-center overflow-y-visible rounded-md pl-2 custom-scrollbar gap-3 py-1 z-[11] w-[${screen.width - menuComponent.width}px] overflow-hidden`}

                            ref={scrollContainerRef}
                        >
                            {children}
                        </div>
                    </div>
                </section>
            </section>
        </section>
    )
}