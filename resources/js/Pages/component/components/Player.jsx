import { useContext, useEffect, useState } from "react";
import Context from "../provider/context";
import { m } from "framer-motion";
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';


const PrettoSlider = styled(Slider)(({ theme }) => ({
    color: '#000',
    '&:hover': {
        color: '#52af77'
    },
    height: 3,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 12,
        width: 12,
        backgroundColor: '#fff',
        display: 'none',
        '&:hover': {
            display: 'block',
            height: 12,
            width: 12,
            backgroundColor: '#fff',
        },
    },
    '&:hover .MuiSlider-thumb': {
        display: 'block',
    },
    '& .MuiSlider-rail': {
        color: 'rgba(0,0,0,0.6)',
    },

    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&::before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
}));

export default function Player({ }) {

    const { menuComponent, screen } = useContext(Context);
    const [playerProperties, setPlayerProperties] = useState({
        width: window.innerWidth - (menuComponent.width + 30),
    })

    useEffect(() => {
        const changeWindowsWidth = () => {
            setPlayerProperties(p => ({
                ...p,
                width: window.innerWidth - (menuComponent.width + 30)
            }))
        }

        window.addEventListener("resize", changeWindowsWidth);
    }, []);

    return (
        <div className={`${screen.width > 500 ? "h-[80px]" : "h-[80px]"} w-full py-1 px-1`}>
            <div className="relative w-full h-full rounded-md rounded-t-none  bg-gray-50 shadow-xl border-[1px] border-gray-400">
                <div
                    className="absolute flex w-full -top-4"
                >
                    <PrettoSlider
                        min={0}
                        max={300}
                        value={100}
                    />
                </div>
            </div>
        </div>

    )
}
