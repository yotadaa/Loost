import { useContext, useEffect } from "react"
import Context from "../../provider/context"



export default function AlbumPage({ props }) {

    const { ALBUM, setALBUM } = useContext(Context);

    useEffect(() => {
        setALBUM(props.props.album);
        console.log(props.props.album);
    }, [])

    return (
        <div>
        </div>
    )
}
