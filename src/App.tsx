import "./App.css";
import { Link } from 'react-router-dom';
import { useTimerStore } from './store/timer';
import { useEffect, useRef, useState } from 'react';


function App() {
  const { seconds, isRunning, remainingTime, setSeconds, setRemainingTime, startTimer, pauseTimer, resetTimer } = useTimerStore();
  const hourRef = useRef<HTMLSpanElement>(null);
  const minuteRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(100);
  const [isReset, setIsReset] = useState(true);

  useEffect(() => {
    if (hourRef.current && minuteRef.current && secondRef.current) {
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = remainingTime % 60;

      hourRef.current.style.setProperty('--value', hours.toString());
      minuteRef.current.style.setProperty('--value', minutes.toString());
      secondRef.current.style.setProperty('--value', seconds.toString());
    }

    setTimeout(() => {
      if (isRunning) {
        setProgress(((seconds - remainingTime) / seconds) * 100);
        setIsReset(false);
      } else if (isReset) {
        setProgress(100);
      }
    }, 200)
  }, [remainingTime, isRunning, seconds, isReset]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const roundedValue = Math.round(value / 60) * 60;

    // 如果正在运行，先停止计时
    if (isRunning) {
      pauseTimer();
    }

    // 设置新的时间并重置
    setSeconds(roundedValue);
    setRemainingTime(roundedValue);
    setProgress(100);
    setIsReset(true);
  };

  const handleReset = () => {
    resetTimer();
    setIsReset(true);
  };

  return (
    <main className="max-w-2xl mx-auto">
      <div className="mb-12 flex justify-center">
        <div
          className={`radial-progress ${isRunning ? 'text-blue-500' : 'text-green-500'}`}
          style={{
            "--value": progress,
            "--size": "10rem",
            "--thickness": "2px"
          } as React.CSSProperties}
        >
          <span className="text-xl font-semibold flex items-center">
            {isReset ? (
              "准备就绪"
            ) : (
              <div className="grid grid-flow-col gap-1 text-center auto-cols-max items-center">
                <span className="countdown font-mono text-xl">
                  <span ref={hourRef} style={{ "--value": 0 } as React.CSSProperties}></span>
                </span>
                :
                <span className="countdown font-mono text-xl">
                  <span ref={minuteRef} style={{ "--value": 0 } as React.CSSProperties}></span>
                </span>
                :
                <span className="countdown font-mono text-xl">
                  <span ref={secondRef} style={{ "--value": 0 } as React.CSSProperties}></span>
                </span>
              </div>
            )}
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
          max="10800"
          step="60"
          value={seconds}
          onChange={handleRangeChange}
          className="w-full range range-xs range-primary"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>1分钟</span>
          <span>60分钟</span>
          <span>90分钟</span>
          <span>180分钟</span>
        </div>
      </div>

      <div className="text-center mb-8 text-lg text-gray-600">
        当前设置：{Math.round(seconds / 60)} 分钟
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className={`btn btn-primary btn-sm flex-1 text-xs`}
          onClick={() => {
            if (isRunning) {
              pauseTimer();
            } else {
              startTimer();
              setIsReset(false);
            }
          }}
        >
          {isRunning ? '暂停计时' : '开始计时'}
        </button>
        <button
          className={`btn btn-light btn-sm flex-1 text-xs`}
          onClick={handleReset}
        >
          重置时间
        </button>
      </div>

      <Link to="/settings" className="block text-center mt-4 text-sm text-blue-500 hover:underline">
        设置
      </Link>
    </main>
  );
}

export default App;
