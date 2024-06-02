import { useContext, useState } from "react"
import Context from "../provider/context"



export default function Menu({ props }) {

    const { menuComponent, setMenuComponent } = useContext(Context);


    return (
        <div className="h-full p-3 bg-transparent">
            <div className={`relative h-full shadow-xl rounded-xl bg-gray-50 min-w-[70px] w-[200px] max-w-[500px] select-none border-r-[2px] ${menuComponent.edgeHover || menuComponent.edgeHold ? "border-gray-500" : "border-none"}`}
                style={{
                    width: menuComponent.width
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
                    {/* <div className={`rounded-xl select-none border-r-2 absolute right-0 top-0  h-full ${menuComponent.edgeHover || menuComponent.edgeHold ? "border-black" : ""} `}
                    ></div> */}
                </div>
            </div>
        </div >
    )
}
