import { useContext, useState } from "react";
import Context from "../provider/context";


export default function MenuVertical({ }) {
    const { menuComponent, setMenuComponent, screen, menu, setCurrentMenu } = useContext(Context);
    const [MENU, setMENU] = useState(Object.keys(menu).map(o => {
        return { ...menu[o], id: o }
    }).slice(6).filter(o => o.show));
    return (
        <div
            className="h-[65px] w-full"
        >
            <div
                className="h-full w-full bg-black"
            >
                <div className="flex justify-center w-full items-start  overflow-hidden z-[100]"
                    style={{
                    }}
                >
                    {MENU.map((o, i) => (
                        <div
                            key={i}
                            className={`p-3 bg-transparent text-gray-50 transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-gray-300 hover:via-gray-300/50 hover:via-20% hover:to-transparent cursor-pointer font-bold flex items-center gap-4 justify-center h-full min-h-[80px] w-[80px]`}
                            style={{
                            }}
                            onClick={() => {
                                setCurrentMenu("7");
                                history.pushState({}, "", "/home")
                            }}
                        >
                            <o.icon className={`scale-[1.3] h-full transition-all duration-300 ease-in-out `} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
