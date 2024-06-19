import { useEffect, useState } from "react"
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import axios from "axios";

export default function PlaylistPage({ props }) {
    history.pushState({}, "", `/playlist/${props.props.auth.user.id_users}`)

    const [user, setUser] = useState(props.props.auth.user);
    const [playlist, setPlaylist] = useState([]);
    async function getPlaylist() {
        try {
            const response = await axios.post(route("get-playlist", { email: user.email }))
            if (response.data.success) {
                setPlaylist(response.data.playlist);
                console.log(response.data);
            }
        } catch (e) {
            console.error(e)
        }
    }
    // console.log(props.props.auth)
    useEffect(() => {
        getPlaylist();
    }, [])

    return (
        <div className="h-screen w-screen overflow-y-auto p-2">
            <header className="text-3xl font-thin flex gap-2 items-center">
                <PlaylistPlayIcon className="scale-[2] mr-2" /> Playlist<span className="font-bold"> {user.nama}</span>
            </header>
            <main className="flex flex-col gap-3 mt-10">
                {playlist.map((o, i) => {
                    return (
                        <div className="flex gap-4 items-center">
                            <div
                                className="w-[70px] h-[70px] shadow-md bg-gray-300 rounded-md"
                            ></div>
                            <div className="text-3xl font-thin">
                                <div className="hover:underline cursor-pointer">{o.nama}</div>
                                <div className="text-sm">Playlist • {user.nama}</div>
                            </div>
                        </div>
                    )
                })}
            </main>
        </div>
    )
}