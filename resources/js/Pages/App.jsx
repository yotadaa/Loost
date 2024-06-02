import { useState } from "react";
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

const Children = ({ menu }) => {
    return (
        <div className="flex flex-col items-center justify-center h-dvh gap-2">
            {Object.keys(menu).map((m, i) =>
                <div
                    key={i}
                    className="bg-gray-200 py-2 w-[200px] px-2 rounded-md shadow-md hover:bg-gray-300 cursor-pointer"
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

    const [Element, setElement] = useState(menu[props?.menu]?.child || "div")

    const MenuComponent = menu[props.menu]?.element;
    const [menuComponent, setMenuComponent] = useState({
        width: parseInt(localStorage.getItem("menu-width")) || 200,
        edgeHover: false,
        edgeMoving: false,
        edgeHold: false,

    });

    const contextValue = { menuComponent, setMenuComponent };
    return (
        <Context.Provider value={contextValue}
        >
            <div className=''

            >
                {props.menu === null ? <Children menu={menu} /> : <MenuComponent props={props} Element={menu[props?.menu]?.child || "div"} />}
            </div>
        </Context.Provider>
    );
}

export default App;
