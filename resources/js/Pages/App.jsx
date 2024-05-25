import { useState } from "react";
import AddArtists from "./admin/AddArtists";
import AddAlbums from "./admin/AddAlbums";
import ListArtists from "./admin/ListArtists";
import { Inertia } from "@inertiajs/inertia";
import ListAlbums from "./admin/ListAlbums";
import AddMusics from "./admin/AddMusics";

const Children = ({ menu }) => {
    return (
        <div className="flex flex-col gap-2 h-full justify-center">
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
    })

    console.log(props)

    const MenuComponent = menu[props.menu]?.element; // Get the component dynamically

    return (
        <div className='flex flex-col items-center justify-center h-dvh'>
            {props.menu === null ? <Children menu={menu} /> : <MenuComponent props={props} />}
        </div>
    );
}

export default App;
