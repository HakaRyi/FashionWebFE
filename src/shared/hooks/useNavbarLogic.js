import { useState, useEffect, useRef } from 'react';

export const useNavbarLogic = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    
    const menuRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        
        const handleClickOutside = (event) => {
            // Đóng Profile Menu nếu click ra ngoài
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            // Đóng Notification Menu nếu click ra ngoài
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifMenu(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return {
        isScrolled,
        showProfileMenu, setShowProfileMenu,
        showNotifMenu, setShowNotifMenu,
        menuRef, notifRef
    };
};