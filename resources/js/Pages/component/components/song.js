import { useContext } from "react";
import Context from "../provider/context";


export function Song(s) {
    const song = {
        current: s,
        next: null,
        prev: null,
    }

    return song;
}





