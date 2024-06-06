import { useEffect, useRef, useState } from "react";
import Context from './component/provider/context';
import AddArtists from "./admin/AddArtists";
import AddAlbums from "./admin/AddAlbums";
import ListArtists from "./admin/ListArtists";
import { Inertia } from "@inertiajs/inertia";
import ListAlbums from "./admin/ListAlbums";
import AddMusics from "./admin/AddMusics";
import PlayMusics from "./admin/PlayMusics";
import Container from "./component/components/Container";
import Dashboard from "./component/dashboard/Dashboard";
import { usePage } from "@inertiajs/inertia-react";

const Children = ({ menu }) => {
    return (
        <div className="flex flex-col items-center justify-center h-dvh gap-2 w-screen">
            {Object.keys(menu).map((m, i) =>
                <div
                    key={i}
                    className="bg-gray-200 py-2 px-2 rounded-md shadow-md hover:bg-gray-300 cursor-pointer flex  max-w-[400px] w-full gap-2"
                    onClick={() => {
                        Inertia.get(route(menu[m].route));
                    }}
                >
                    {menu[m].name}
                </div>
            )}
        </div>
    )
}

function App({ props }) {
    const [menu, setMenu] = useState({
        "1": { element: AddArtists, name: "Tambah Artis", route: "add-artists" },
        "2": { element: AddAlbums, name: "Tambah Album", route: "add-albums" },
        "5": { element: AddMusics, name: "Tambah Musics", route: "add-musics" },
        "3": { element: ListArtists, name: "Lihat Daftar Artis", route: "list-artists" },
        "4": { element: ListAlbums, name: "Lihat Daftar Album", route: "list-albums" },
        "6": { element: PlayMusics, name: "Putar Musik", route: "play-musics" },
        "7": { element: Container, name: "Home", route: "home", child: Dashboard }
    })

    const MenuComponent = menu[props.menu]?.element;
    const [screen, setScreen] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    const [menuComponent, setMenuComponent] = useState({
        width: parseInt(localStorage.getItem("menu-width")) || 200,
        edgeHover: false,
        edgeMoving: false,
        edgeHold: false,
    });

    //URL
    const [URL, setURL] = useState(new URL(location));


    /// test for audio playing through page

    const contextValue = { menuComponent, setMenuComponent, screen, setScreen, };
    return (
        <Context.Provider value={contextValue}>
            {props.menu === null ? <Children menu={menu} /> : <MenuComponent props={props} Element={menu[props.menu]?.child || "div"} />}
        </Context.Provider >
    );
}

export default App;
