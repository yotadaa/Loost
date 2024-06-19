import { useContext, useEffect, useState } from "react";
import axios from "axios";

import React from 'react';
import Menu from "../Menu/Menu";
import Context from "../provider/context";
import Player from "./Player/Player";
import MenuVertical from "./MenuVertical";

export default function Container({ Element, ...props }) {
    const { menuComponent, setMenuComponent, screen, setScreen, SONG, audioRef, setAUDIO, AUDIO, setMainComponent, ARTIST, musicId, artistId, setARTIST, setCurrentMenu, albumId, setALBUM, setLoading, setArtistId } = useContext(Context);

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


    const loadAlbum = async (album_id) => {
        setLoading(p => ({ ...p, page: true }));
        if (!album_id) {
            setLoading(p => ({ ...p, page: false }));
            return;
        }
        try {
            const response = await axios.get(route('album-only', { album_id: album_id }), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                console.log(response.data)
                setALBUM({
                    artist: response.data.artist[0],
                    album: response.data.album[0],
                    musics: response.data.musics,
                });
                console.log("Data: ", response.data)
                setCurrentMenu("9");
                setLoading(p => ({ ...p, page: false }));
                // history.pushState({}, "", `album/${album_id}`)
            }

            console.log("Done")
            history.pushState({}, "", `/album/${album_id}`)
            setLoading(p => ({ ...p, page: false }));
        } catch (e) {
            console.error(e);
            setLoading(p => ({ ...p, page: false }));
        }
    }

    const loadAudio = async (src = "/undefined.mp3") => {
        setAUDIO(p => ({ ...p, loading: true }))
        try {
            const parts = src.split('/'); //path.split("/").[path.split("/").length-1]
            const filename = parts[parts.length - 1];
            const audioURL = route("stream-audio", { filename: filename });
            audioRef.current.src = audioURL;

            const formData = new FormData();
            formData.append("id_musik", SONG?.current?.id_musik);

            const response = await axios.post(route('listen-to-music'), formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                setAUDIO(p => ({ ...p, loading: false }))
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
            setAUDIO(p => ({ ...p, loading: false }))
        }
        setAUDIO(p => ({ ...p, loading: false }))
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
        loadAlbum(albumId ? albumId : props.props.albumId)
    }, [albumId]);


    useEffect(() => {
        if (artistId) {
            setLoading(p => ({ ...p, page: true }));
            if (artistId) setCurrentMenu("8");
        }
    }, [artistId]);
    useEffect(() => {
        // setArtistId(null);
    }, [])
    useEffect(() => {
        if (musicId) {
            setLoading(p => ({ ...p, page: true }))
            setCurrentMenu("10");
        }
    }, [musicId])


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
                    height: screen.height // - (screen.width > 500 ? 80 : 80 * 2 - 25)
                }}
            >
                {screen.width > 500 ? <Menu /> : ""}
                <Element props={props} />
            </div>
            <div className="w-full fixed h-screen flex flex-col justify-end pointer-events-none"
                style={{
                    // height: screen.width > 500 ? 80 : 500,
                }}
            >
                <Player />
                {screen.width > 500 ? "" : <MenuVertical />}
            </div>
        </div>
    );
}
