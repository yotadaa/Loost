import { useContext, useEffect, useState } from "react";
import React from 'react';
import Menu from "../Menu/Menu";
import Context from "../provider/context";
import Player from "./Player";

export default function Container({ Element, ...props }) {
    const { menuComponent, setMenuComponent, screen, setScreen } = useContext(Context);

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

    return (
        <div className={`flex flex-col h-screen w-screen bg-gray-50 ${menuComponent.edgeHold || menuComponent.edgeMoving ? "cursor-grabbing" : menuComponent.edgeHover ? "cursor-grab" : "cursor-default"}`}
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
            <div className={`flex w-full h-full ${screen.width > 500 ? "flex-row" : "flex-col-reverse"}`}>
                {screen.width > 500 ? <Menu /> : ""}
                <Element props={props} />
            </div>
            <Player />
            {screen.width > 500 ? "" : <Menu />}
        </div>
    );
}
