import { useContext, useEffect, useRef, useState } from 'react';
import Context from '../provider/context';
import TrendNow from './TrendNow';
import TrendArtist from './TrendArtist';
import PuncakKlasemen from './Klasemen/PuncakKlasemen';
import axios from 'axios';

export default function Dashboard({ props }) {

    const { screen, menuComponent } = useContext(Context);
    const [popularNow, setPopularNow] = useState(props.props.populer_now);
    const [artists, setArtists] = useState(props.props.artists);

    const getDashboardProperties = async () => {
        console.log("Loading Dashboard");
        if (props.props.populer_now || props.props.artists) return;

        try {
            const response = await axios.get(route('dashboard-only'), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                setArtists(response.data.artists);
                setPopularNow(response.data.populer_now);
                history.pushState({}, "", `home`)
                console.log("Done Dashboard");
            }

            console.log("Done")
        } catch (e) {
            console.error(e);
        }
    }

    getDashboardProperties();




    return (
        <div className="h-full flex flex-col gap-10 py-10 w-full p-3 overflow-x-hidden custom-scrollbar"
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
