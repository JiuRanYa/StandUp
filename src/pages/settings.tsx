import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { useTimerStore } from '../store/timer';
import { invoke } from '@tauri-apps/api/core';

export default function Settings() {
  const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);
  const {
    notificationMethod,
    setNotificationMethod,
    showTrayTime,
    setShowTrayTime
  } = useTimerStore();

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

  const handleNotificationMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationMethod(event.target.value as 'desktop' | 'sound' | 'screen_lock');
  };

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">设置</h1>

      <div className="mb-8">
        <label className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">开机自启动</span>
          <input
            type="checkbox"
            checked={isAutoStartEnabled}
            onChange={toggleAutoStart}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </label>
      </div>

      <div className="mb-8">
        <label className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">在系统托盘显示剩余时间</span>
          <input
            type="checkbox"
            checked={showTrayTime}
            onChange={(e) => {
              setShowTrayTime(e.target.checked);
              if (!e.target.checked) {
                invoke('update_tray_title', { timeLeft: '' }).catch(console.error);
              }
            }}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
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

      <footer className="mt-12 text-center">
        <Link to="/" className="text-blue-500 hover:underline">
          返回主页
        </Link>
      </footer>
    </main>
  );
}
