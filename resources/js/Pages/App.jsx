import { useState } from "react";
import AddArtists from "./admin/AddArtists";
import AddAlbums from "./admin/AddAlbums";

const Children = () => {
    return (
        <div>
            Root
        </div>
    )
}

function App({ props }) {
    const [menu, setMenu] = useState({
        "1": AddArtists,
        "2": AddAlbums
    })

    console.log(props)

    const MenuComponent = menu[props.menu]; // Get the component dynamically

    return (
        <div className='flex flex-col items-center justify-center h-dvh'>
            {props.menu === null ? <Children /> : <MenuComponent props={props} />}
        </div>
    );
}

export default App;
