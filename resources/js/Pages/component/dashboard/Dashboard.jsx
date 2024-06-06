import { useContext, useEffect, useRef, useState } from 'react';
import Context from '../provider/context';
import TrendNow from './TrendNow';
import TrendArtist from './TrendArtist';
import PuncakKlasemen from './Klasemen/PuncakKlasemen';

export default function Dashboard({ props }) {

    const { screen, menuComponent } = useContext(Context);
    const [popularNow, setPopularNow] = useState(props.props.populer_now);
    const [artists, setArtists] = useState(props.props.artists);



    return (
        <div className="h-full flex flex-col gap-10 py-10 w-full p-3 overflow-x-hidden"
            style={{
                maxHeight: screen.height - 80
            }}
        >
            <TrendNow
                screen={screen}
                menuComponent={menuComponent}
                popularNow={popularNow}
                title={"Recently played"}
            />
            <TrendArtist
                screen={screen}
                menuComponent={menuComponent}
                popularNow={artists}
                title="Pendengar terbanyak"
            />
            <PuncakKlasemen
                screen={screen}
                menuComponent={menuComponent}
                popularNow={popularNow}
                title={"Puncak klasemen"}
            />
            <TrendNow
                screen={screen}
                menuComponent={menuComponent}
                popularNow={popularNow}
                title={"Tren sekarang"}
            />
            <TrendNow
                screen={screen}
                menuComponent={menuComponent}
                popularNow={popularNow}
                title="Album terpopuler"
            />

        </div >
    )
}
