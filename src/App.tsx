import "./App.css";
import { Link } from 'react-router-dom';
import { useTimerStore } from './store/timer';

function App() {
  const { seconds, isRunning, remainingTime, setSeconds, setRemainingTime, startTimer, stopTimer } = useTimerStore();

  const progress = isRunning ? ((seconds - remainingTime) / seconds) * 100 : 100;

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
          <span className="text-xl font-semibold">
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
          max="10800"
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
          <span>90分钟</span>
          <span>180分钟</span>
        </div>
      </div>

      <div className="text-center mb-8 text-lg text-gray-600">
        当前设置：{Math.round(seconds / 60)} 分钟
      </div>

      <button
        className={`btn btn-primary btn-sm w-full text-xs`}
        onClick={() => {
          if (isRunning) {
            stopTimer();
          } else {
            setRemainingTime(seconds);
            startTimer();
          }
        }}
      >
        {isRunning ? '停止提醒' : '开始提醒'}
      </button>

      <Link to="/settings" className="block text-center mt-4 text-sm text-blue-500 hover:underline">
        设置
      </Link>
    </main>
  );
}

export default App;
