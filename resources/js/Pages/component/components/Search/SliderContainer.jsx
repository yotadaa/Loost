import { useContext, useRef } from "react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Context from "../../provider/context";


export default function SliderContainer({ children, style, title }) {

    const scrollContainerRef = useRef(null);
    const { setCurrentMenu, menuComponent, mainComponent } = useContext(Context);
    return (
        <section
            style={style}
        >
            <header className="text-xl font-medium drop-shadow-sm flex items-end justify-between">
                <p>{title}</p>
            </header>
            <section className="w-full relative ">
                <section className="w-full relative">
                    <div
                        className='w-full gap-2 relative '
                        style={{
                            zIndex: 1,
                        }}
                    >
                        <div className='h-full py-1 absolute top-0 left-0 w-full flex justify-between items-center z-[1] pointer-events-none'>
                            <div
                                onClick={() => {
                                    // Smooth scrolling left
                                    scrollContainerRef.current.scrollTo({
                                        left: scrollContainerRef.current.scrollLeft - scrollContainerRef.current.clientWidth / 2,
                                        behavior: 'smooth',
                                    });
                                }}
                                className='h-full px-4 flex items-center rounded-md relative bg-transparent overflow-hidden'
                            >
                                <ArrowBackIosNewIcon className='cursor-pointer scale-[2] z-[10] group pointer-events-auto ' />
                                <div className='w-full h-full bg-transparent absolute top-0 left-0 blur-xl'></div>
                            </div>
                            <div
                                onClick={() => {
                                    // Smooth scrolling right
                                    scrollContainerRef.current.scrollTo({
                                        left: scrollContainerRef.current.scrollLeft + scrollContainerRef.current.clientWidth / 2,
                                        behavior: 'smooth',
                                    });
                                }}
                            >
                                <ArrowForwardIosIcon className='cursor-pointer scale-[2] z-[10] h-full group pointer-events-auto' />
                            </div>

                            <div className='group-hover:opacity-100 opacity-0 absolute inset-0 bg-black rounded-full z-10 transition duration-300 ease-in-out'></div>
                        </div>
                        <div className={`flex items-center overflow-y-visible rounded-md pl-2 custom-scrollbar gap-2 py-1 z-[11] w-[${screen.width - menuComponent.width}px] overflow-hidden`}

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