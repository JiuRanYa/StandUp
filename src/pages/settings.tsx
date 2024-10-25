import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { useTimerStore } from '../store/timer';
import { readTextFile, writeTextFile, BaseDirectory, exists, create } from '@tauri-apps/plugin-fs';
import { CONFIG_FILE } from "../config";

export default function Settings() {
  const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);
  const { notificationMethod, setNotificationMethod } = useTimerStore();

  useEffect(() => {
    checkAutoStartStatus();
    loadSettings();
  }, []);

  const checkAutoStartStatus = async () => {
    const enabled = await isEnabled();
    setIsAutoStartEnabled(enabled);
  };

  const loadSettings = async () => {
    const exist = await exists(CONFIG_FILE, { baseDir: BaseDirectory.Config });
    if (exist) {
      const settings = await readTextFile(CONFIG_FILE, { baseDir: BaseDirectory.Config });
      const parsedSettings = JSON.parse(settings);
      setNotificationMethod(parsedSettings.notificationMethod);
    }
  };

  const saveSettings = async () => {
    const settings = {
      notificationMethod,
    };
    await writeTextFile(CONFIG_FILE, JSON.stringify(settings), { baseDir: BaseDirectory.Config });
  };

  const toggleAutoStart = async () => {
    if (isAutoStartEnabled) {
      await disable();
    } else {
      await enable();
    }
    await checkAutoStartStatus();
    await saveSettings();
  };

  const handleNotificationMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationMethod(event.target.value as 'desktop' | 'sound' | 'screen_lock');
    saveSettings();
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
