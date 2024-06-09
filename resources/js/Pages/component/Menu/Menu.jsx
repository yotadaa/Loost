import { useContext, useState } from "react"
import Context from "../provider/context"



export default function Menu({ props }) {

    const { menuComponent, setArtistId, setMenuComponent, screen, menu, setCurrentMenu } = useContext(Context);
    const [MENU, setMENU] = useState(Object.keys(menu).map(o => {
        return { ...menu[o], id: o }
    }).slice(6).filter(o => o.show));

    return (
        <div className={`bg-black relative ${screen.width > 500 ? "h-full p-3" : "h-full w-full"} bg-transparent`}>
            <div className={`bg-gray-200 relative  ${screen.width > 500 ? "min-w-[70px] w-[200px] max-w-[500px] h-full" : "rounded-none min-w-full h-full"} relative border-[1px] border-black shadow-xl rounded-xl  select-none border-r-[2px] ${menuComponent.edgeHover || menuComponent.edgeHold ? "border-gray-500" : "border-none"} overflow-hidden`}
                style={{
                    width: screen.width > 500 ? menuComponent.width : screen.width - 12 * 2
                }}
            >
                <div className="flex flex-col justify-start items-start  overflow-hidden z-[100]"
                    style={{
                        width: menuComponent.width - 10
                    }}
                >
                    {MENU.map((o, i) => (
                        <div
                            key={i}
                            className={`p-3 bg-gray-200 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-300/50 hover:via-20% hover:to-transparent cursor-pointer font-bold flex items-center gap-4 `}
                            style={{
                                width: menuComponent.width - 10
                            }}
                            onClick={() => {
                                setArtistId(null);
                                setCurrentMenu("7");
                                history.pushState({}, "", "/home")
                            }}
                        >
                            <o.icon className={`scale-[1.3] transition-all duration-300 ease-in-out ${menuComponent.width > 100 ? "ml-0 " : "ml-[10px]"}`} /> <span className={`transition-all duration-300 ease-in-out ${menuComponent.width > 100 ? "opacity-100" : "opacity-0"} whitespace-nowrap`}>{o.name}</span>
                        </div>
                    ))}
                </div>

                <div className="px-1 absolute right-0 h-full z-[1000]"
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
