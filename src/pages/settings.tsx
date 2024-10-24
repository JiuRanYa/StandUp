import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

export default function Settings() {
    const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);

    useEffect(() => {
        checkAutoStartStatus();
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

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-4 left-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">设置</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">通知方式</span>
                        </label>
                        <select
                            className="select select-bordered w-full max-w-xs"
                            value={notificationMethod}
                            onChange={handleNotificationMethodChange}
                        >
                            <option value="window">窗口</option>
                            <option value="notification">通知</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">开机自启动</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={isAutoStartEnabled}
                                onChange={toggleAutoStart}
                            />
                        </label>
                    </div>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">保存设置</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
