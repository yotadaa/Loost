import { useContext, useEffect, useState } from "react";
import axios from "axios";

import React from 'react';
import Menu from "../Menu/Menu";
import Context from "../provider/context";
import Player from "./Player/Player";
import MenuVertical from "./MenuVertical";

export default function Container({ Element, ...props }) {
    const { menuComponent, setMenuComponent, screen, setScreen, SONG, audioRef, setAUDIO, AUDIO, setMainComponent, ARTIST, artistId, setARTIST, setCurrentMenu } = useContext(Context);

    useEffect(() => {
    }, [menuComponent.edgeHold])

    useEffect(() => {
        localStorage.setItem("menu-width", menuComponent.width)
    }, [menuComponent]);
    useEffect(() => {
        const changeWindowsWidth = () => {
            setScreen(p => ({
                ...p,
                width: window.innerWidth,
                height: window.innerHeight,
            }))
        }

        window.addEventListener("resize", changeWindowsWidth);
    }, []);

    useEffect(() => {
        setMainComponent(p => ({ ...p, width: screen.width - menuComponent.width }))
    }, [screen.width, menuComponent.width])



    const loadArtist = async (artist_id) => {
        // if (props?.props?.artist) return;
        console.log("Accessing artist: ", artist_id)
        try {
            const response = await axios.get(route('artist-only', { artist_id: artist_id }), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                console.log(response.data)
                setARTIST({
                    artist: response.data.artist[0],
                    albums: response.data.albums,
                    musics: response.data.musics,
                });
                setCurrentMenu("8");
                history.pushState({}, "", `artist/${artist_id}`)
            }

            console.log("Done")
        } catch (e) {
            console.error(e);
        }
    }

    const loadAudio = async (src = "/undefined.mp3") => {

        try {
            const parts = src.split('/'); //path.split("/").[path.split("/").length-1]
            const filename = parts[parts.length - 1];
            const audioURL = route("stream-audio", { filename: filename });
            audioRef.current.src = audioURL;

            try {
                const formData = new FormData();
                formData.append("id_musik", SONG?.current?.id_musik);

                const response = await axios.post(route('listen-to-music'), formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.success) {
                }
            } catch (e) {
                console.error('Error tracking music play:', e);
            }
            audioRef.currentTime = AUDIO.currentTime || 0;
            if (!AUDIO.init) {
                audioRef.current.play();
                setAUDIO(p => ({ ...p, init: false }))
            }

            audioRef.current.addEventListener('error', (e) => {
                console.error(e);
            });
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    };
    useEffect(() => {
        if (SONG.current?.id_musik) {
            loadAudio(SONG?.current?.source);
            localStorage.setItem("current", SONG.current.id_musik);
        } else {
        }
    }, [SONG.current]);

    useEffect(() => {
        setAUDIO(p => ({ ...p, currentTime: localStorage.getItem("current-time") || 1 }))
    }, [AUDIO.currentTime])

    useEffect(() => {
        loadArtist(artistId)
    }, [artistId])

    useEffect(() => {
        console.log(ARTIST);
    }, [ARTIST])


    return (
        <div className={`flex flex-col h-screen w-screen overflow-hidden bg-gray-50 ${menuComponent.edgeHold || menuComponent.edgeMoving ? "cursor-grabbing" : menuComponent.edgeHover ? "cursor-grab" : "cursor-default"}`}
            onMouseDown={() => setMenuComponent(p => ({ ...p, edgeHold: true && p.edgeHover }))}
            onMouseUp={() => setMenuComponent(p => ({ ...p, edgeHold: false }))}
            onMouseMove={(e) => {
                if (menuComponent.edgeHold) {
                    setMenuComponent(p => ({
                        ...p,
                        width: e.clientX > 70 ? (e.clientX < 500 ? e.clientX : 500) : 70
                    }))
                }
            }}
        >
            <div className={`flex w-full`}
                style={{
                    maxHeight: screen.height - (screen.width > 500 ? 80 : 80 * 2 - 25),
                    height: screen.height - (screen.width > 500 ? 80 : 80 * 2 - 25)
                }}
            >
                {screen.width > 500 ? <Menu /> : ""}
                <Element props={props} />
            </div>
            <div className="w-full relative flex flex-col"
                style={{
                    height: screen.width > 500 ? 80 : 500,
                }}
            >
                <Player />
                {screen.width > 500 ? "" : <MenuVertical />}
            </div>
        </div>
    );
}
