

import { useEffect, useState } from 'react';
import Context from './context';
import Loading from '../components/other/Loading';
import RegisterPage from '../components/AuthPage/Index';
import { getLocalStorage, setLocalStorage } from '../assets/variables';
import { menu, elements } from '../assets/nav/identity';
import Main from '../components/main/Main';
import ItemsOverlay from '../components/items/ItemsOverlay';
import NotificationModal from '../components/other/NotificationModal';
import InteractiveModal from '../components/other/InteractiveModal';

const Root = ({ isAuth, mode, failed, message, props, url }) => {


    const [notificationModal, setNotificationModal] = useState({
        show: false,
        message: {
            title: "",
            body: "",
        }
    });

    const [interactiveModal, setInteractiveModal] = useState({
        show: false,
        message: {
            title: "",
            body: "",
        },
        function: () => { },
        confirm: "Konfirmasi",
        args: null,
    });

    const [currentMenu, setCurrentMenu] = useState(parseInt(props?.menu || "0"));
    const [elementIndex, setElementIndex] = useState(parseInt(props?.element || "0"));
    const [navHover, setNavHover] = useState(false)
    const [isShrunk, setIsShrunk] = useState(false);
    const [wideWindow, setWideWindow] = useState(true);
    const [windowSize, setWindowSize] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    });
    const [rightNav, setRightNav] = useState(false);

    const [properties, setProperties] = useState({
        title: 'Plinplan',
        theme: 0,
    })

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowSize(prev => ({
                ...prev,
                w: window.innerWidth,
            }))
        })
    }, [])

    useEffect(() => {
        if (windowSize.w < 400) {
            setWideWindow(false);
        } else {
            setWideWindow(true);
        }
    }, [windowSize])

    const [loginFailed, setLoginFailed] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [authFailedMessage, setAuthFailedMessage] = useState({
        title: '',
        body: '',
    })

    const [itemDetail, setItemDetail] = useState(null);
    const [viewDetail, setViewDetail] = useState(false);

    const [navStatus, setNavStatus] = useState({
        pinned: getLocalStorage('nav-pinned') === null ? true : (getLocalStorage('nav-pinned')),
        shrunk: getLocalStorage('nav-shrunk') === null ? false : (getLocalStorage('nav-pinned')),
        right: getLocalStorage('nav-right') === null ? false : (getLocalStorage('nav-pinned')),
    })

    useEffect(() => {
        setLocalStorage('nav-pinned', navStatus.pinned);
        setLocalStorage('nav-shrunk', navStatus.shrunk);
    }, [navStatus])

    useEffect(() => {
        setLocalStorage("last-url", window.location.href);
    }, [])

    const contextValue = {
        isShrunk, setIsShrunk, wideWindow, setWideWindow, windowSize, setNavHover, navHover,
        rightNav, setRightNav, properties, setProperties, loginFailed, setLoginFailed,
        processing, setProcessing, authFailedMessage, setAuthFailedMessage, navStatus, setNavStatus, currentMenu, setCurrentMenu, itemDetail, setItemDetail, viewDetail, setViewDetail,
        notificationModal, setNotificationModal, interactiveModal, setInteractiveModal
    }

    return (
        <Context.Provider value={contextValue}>
            <NotificationModal />
            <InteractiveModal />
            <Loading />
            <ItemsOverlay />
            {isAuth ? <Main props={props} Element={elements[elementIndex].element} isAuth={isAuth} /> : <RegisterPage failed={failed} url={url} message={message} mode={mode} />}
        </Context.Provider>
    )
};

export default Root;
