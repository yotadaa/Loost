import { useContext, useEffect, useState } from "react";
import React from 'react';
import Menu from "../Menu/Menu";
import Context from "../provider/context";

export default function Container(props) {

    const { Element } = props;
    const { menuComponent, setMenuComponent } = useContext(Context);
    useEffect(() => {
        console.log(menuComponent.edgeHold)
    }, [menuComponent.edgeHold])

    useEffect(() => {
        localStorage.setItem("menu-width", menuComponent.width)
    }, [menuComponent])

    return (
        <div className={`flex h-screen w-screen bg-red-50 ${menuComponent.edgeHold || menuComponent.edgeMoving ? "cursor-grabbing" : menuComponent.edgeHover ? "cursor-grab" : "cursor-default"}`}
            onMouseDown={() => setMenuComponent(p => ({ ...p, edgeHold: true && p.edgeHover }))}
            onMouseUp={() => setMenuComponent(p => ({ ...p, edgeHold: false }))}
            onMouseMove={(e) => {
                if (menuComponent.edgeHold) {
                    console.log('')
                    setMenuComponent(p => ({
                        ...p,
                        width: e.clientX
                    }))
                }
            }}
        >
            <Menu />
            <Element props={props} />
        </div>
    );
}
