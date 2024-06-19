import { useContext, useEffect, useRef, useState } from 'react';
import Context from '../provider/context';
import TrendNow from './TrendNow';
import TrendArtist from './TrendArtist';
import PuncakKlasemen from './Klasemen/PuncakKlasemen';
import axios from 'axios';
import { usePage } from '@inertiajs/inertia-react';

export default function Dashboard({ props }) {

    history.pushState({}, "", "/home");

    const { screen, menuComponentm, setSONG, setARTIST, setArtistId, setALBUM, menuComponent, setLoading } = useContext(Context);
    const [popularNow, setPopularNow] = useState([]);
    const [artists, setArtists] = useState([]);

    const getDashboardProperties = async () => {

        const response = await axios.get(route('dashboard-only'), {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.success) {
            setArtists(response.data.artists);
            setPopularNow(response.data.populer_now);
        }
    }


    useEffect(() => {

        console.log("props: ", props)
        getDashboardProperties();
        setLoading(p => ({ ...p, page: false }));
        setARTIST(null);
        setALBUM(null);
    }, [])




    return (
        <div className="h-full flex flex-col gap-10 py-10 w-full p-3 overflow-x-hidden custom-scrollbar"
        >
            {props.props.login ? <TrendNow
                screen={screen}
                menuComponent={menuComponent}
                popularNow={popularNow}
                title={"Recently played"}
            /> : ""}
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
