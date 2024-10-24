import React from 'react';
import { Window } from '@tauri-apps/api/window';

const Header: React.FC = () => {
    const appWindow = new Window('main')

    return (
        <div
            className="bg-white shadow-sm p-2 flex justify-between items-center cursor-move"
            data-tauri-drag-region
        >
            <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="StandUp Logo" className="h-5 w-5" />
                <span className="text-sm font-medium text-gray-700">StandUp</span>
            </div>
            <button
                onClick={() => appWindow.hide()}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Header;
