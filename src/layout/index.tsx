import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex-grow p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
