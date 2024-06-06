import { useContext, useState } from "react"
import Context from "../provider/context"



export default function Menu({ props }) {

    const { menuComponent, setMenuComponent, screen } = useContext(Context);


    return (
        <div className={`${screen.width > 500 ? "h-full p-3" : "h-[80px] "} bg-transparent`}>
            <div className={`${screen.width > 500 ? "min-w-[70px] w-[200px] max-w-[500px] h-full" : "rounded-none min-w-full h-full"} relative  shadow-xl rounded-xl bg-gray-50  select-none border-r-[2px] ${menuComponent.edgeHover || menuComponent.edgeHold ? "border-gray-500" : "border-none"}`}
                style={{
                    width: screen.width > 500 ? menuComponent.width : screen.width - 12 * 2
                }}
            >
                <div className="px-1 absolute right-0 h-full"
                    onMouseEnter={() => {
                        setMenuComponent(p => ({ ...p, edgeHover: true }))
                    }}
                    onMouseLeave={() => {
                        setMenuComponent(p => ({ ...p, edgeHover: false }))
                    }}
                    onMouseUp={(e) => {
                        setMenuComponent(p => ({ ...p, edgeHold: false }))
                        console.log("Release...")
                    }}

                >
                </div>
            </div>
        </div >
    )
}
