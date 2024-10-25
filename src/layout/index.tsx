import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTimerStore } from '../store/timer';

const Layout: React.FC = () => {
    const { startTimer, pauseTimer } = useTimerStore();

    useEffect(() => {
        const startListener = listen('start-timer', () => {
            startTimer();
        });

        const pauseListener = listen('pause-timer', () => {
            pauseTimer();
        });

        return () => {
            startListener.then(unlisten => unlisten());
            pauseListener.then(unlisten => unlisten());
        };
    }, [startTimer, pauseTimer]);
    return (
        <div className="flex flex-col min-h-[570px] h-full rounded-lg overflow-hidden border">
            <Header />
            <div className="flex-grow p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
