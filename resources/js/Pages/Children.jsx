
import { Inertia } from "@inertiajs/inertia";
import { useContext } from "react";
import Context from "./component/provider/context";

export default function Children({ menu }) {
    const { setLoading, loading } = useContext(Context);
    return (
        <div className="flex flex-col items-center justify-center h-dvh gap-2 w-screen">
            {Object.keys(menu).map((m, i) => {
                return (
                    <div
                        key={i}
                        className="bg-gray-200 py-2 px-2 rounded-md shadow-md hover:bg-gray-300 cursor-pointer flex  max-w-[400px] w-full gap-2"
                        onClick={() => {
                            setLoading(p => ({ ...p, page: true }));
                            try {
                                Inertia.get(route(menu[m].route));
                            } catch (E) {
                                console.error(E);
                            }
                            console.log(loading)
                        }}
                    >
                        {menu[m].name}
                    </div>
                )
            }
            )}
        </div>
    )
}
