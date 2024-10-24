import { useEffect, useState } from "react";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { Link } from 'react-router-dom';

function App() {
  const [seconds, setSeconds] = useState(1800);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(seconds);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let countdownTimer: number | undefined;

    async function setupNotification() {
      let permissionGranted = await isPermissionGranted();

      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }

      if (permissionGranted && isRunning) {
        setRemainingTime(seconds);
        countdownTimer = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              sendNotification({
                title: '久坐提醒',
                body: `您已久坐${seconds}秒，请起身活动一下！这是第${notificationCount + 1}次提醒。`
              });
              setNotificationCount(prev => prev + 1);
              return seconds; // 重新开始倒计时
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }

    setupNotification();

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [seconds, isRunning, notificationCount]);

  const progress = isRunning ? ((seconds - remainingTime) / seconds) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <main className="max-w-2xl mx-auto">
        <div className="mb-12 flex justify-center">
          <div
            className={`radial-progress ${isRunning ? 'text-blue-500' : 'text-green-500'}`}
            style={{
              "--value": progress,
              "--size": "16rem",
              "--thickness": "2px"
            } as React.CSSProperties}
          >
            <span className="text-3xl font-semibold">
              {isRunning
                ? `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`
                : "准备就绪"}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            提醒间隔
          </label>
          <input
            type="range"
            min="60"
            max="7200"
            value={seconds}
            onChange={(e) => {
              setSeconds(Number(e.target.value));
              if (!isRunning) setRemainingTime(Number(e.target.value));
            }}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>1分钟</span>
            <span>60分钟</span>
            <span>120分钟</span>
          </div>
        </div>

        <div className="text-center mb-8 text-lg text-gray-600">
          当前设置：{Math.round(seconds / 60)} 分钟
        </div>

        <button
          className={`btn btn-primary btn-sm w-full text-xs`}
          onClick={() => {
            setIsRunning(!isRunning);
            if (!isRunning) setRemainingTime(seconds);
          }}
        >
          {isRunning ? '停止提醒' : '开始提醒'}
        </button>

        <Link to="/settings" className="block text-center mt-4 text-sm text-blue-500 hover:underline">
          设置
        </Link>
      </main>
    </div>
  );
}

export default App;
