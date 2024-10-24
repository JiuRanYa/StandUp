import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export default function Settings() {
    const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);
    const [notificationMethod, setNotificationMethod] = useState('desktop');

    useEffect(() => {
        checkAutoStartStatus();
        // 这里可以添加加载通知方式设置的逻辑
    }, []);

    const checkAutoStartStatus = async () => {
        const enabled = await isEnabled();
        setIsAutoStartEnabled(enabled);
    };

    const toggleAutoStart = async () => {
        if (isAutoStartEnabled) {
            await disable();
        } else {
            await enable();
        }
        await checkAutoStartStatus();
    };

    const handleNotificationMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNotificationMethod(event.target.value);
        // 这里可以添加保存通知方式设置的逻辑
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center text-gray-800">设置</h1>
            </header>

            <main className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <label className="flex items-center space-x-3 mb-3">
                        <input
                            type="checkbox"
                            checked={isAutoStartEnabled}
                            onChange={toggleAutoStart}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700 font-medium">开机自启动</span>
                    </label>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">
                        提醒方式
                    </label>
                    <select
                        value={notificationMethod}
                        onChange={handleNotificationMethodChange}
                        className="select select-sm select-bordered w-full"
                    >
                        <option value="desktop">桌面通知</option>
                        <option value="sound">声音提醒</option>
                        <option value="screen_lock">短暂锁屏</option>
                    </select>
                </div>
            </main>

            <footer className="mt-12 text-center">
                <Link to="/" className="text-blue-500 hover:underline">
                    返回主页
                </Link>
            </footer>
        </div>
    );
}
