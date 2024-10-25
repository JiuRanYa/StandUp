import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTimerStore } from '../store/timer';

const Layout: React.FC = () => {
    const { startTimer, stopTimer } = useTimerStore();

    useEffect(() => {
        const startListener = listen('start-timer', () => {
            startTimer();
        });

        const pauseListener = listen('pause-timer', () => {
            stopTimer();
        });

        return () => {
            startListener.then(unlisten => unlisten());
            pauseListener.then(unlisten => unlisten());
        };
    }, [startTimer, stopTimer]);
    return (
        <div className="flex flex-col min-h-screen rounded-lg overflow-hidden shadow-lg border">
            <Header />
            <div className="flex-grow p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
