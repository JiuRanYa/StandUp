import { useEffect, useState } from "react";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

function App() {
  const [seconds, setSeconds] = useState(1800); // 默认30分钟 (1800秒)
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

  const progress = ((seconds - remainingTime) / seconds) * 100;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary justify-center">久坐提醒</h2>
          <div className="flex justify-center my-4">
            <div
              className="radial-progress text-primary"
              style={{
                "--value": progress,
                "--size": "8rem",
                "--thickness": "4px"
              } as React.CSSProperties}
            >
              {isRunning
                ? `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`
                : "准备就绪"}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">提醒间隔（秒）</span>
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
              className="range range-primary"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>1分钟</span>
              <span>30分钟</span>
              <span>60分钟</span>
              <span>90分钟</span>
              <span>120分钟</span>
            </div>
          </div>
          <div className="text-center my-2">
            当前设置：{seconds} 秒 （约 {Math.round(seconds / 60)} 分钟）
          </div>
          <div className="card-actions justify-end mt-4">
            <button
              className={`btn ${isRunning ? 'btn-error' : 'btn-primary'} btn-block`}
              onClick={() => {
                setIsRunning(!isRunning);
                if (!isRunning) setRemainingTime(seconds);
              }}
            >
              {isRunning ? '停止提醒' : '开始提醒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
