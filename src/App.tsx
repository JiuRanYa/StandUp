import { useEffect, useState } from "react";
import "./App.css";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

function App() {
  const [minutes, setMinutes] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    async function setupNotification() {
      let permissionGranted = await isPermissionGranted();

      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }

      if (permissionGranted && isRunning) {
        timer = setTimeout(() => {
          sendNotification({
            title: '久坐提醒',
            body: `您已久坐${minutes}分钟，请起身活动一下！`
          });
          setIsRunning(false);
        }, minutes * 60 * 1000);
      }
    }

    setupNotification();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [minutes, isRunning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <main className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">久坐提醒</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            提醒间隔
          </label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[minutes]}
            onValueChange={(value) => setMinutes(value[0])}
            max={120}
            step={1}
          >
            <Slider.Track className="bg-indigo-200 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-indigo-600 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-indigo-600 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label="Volume"
            />
          </Slider.Root>
          <div className="text-sm text-gray-500 text-center">{minutes} 分钟</div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">启用提醒</span>
          <Switch.Root
            checked={isRunning}
            onCheckedChange={setIsRunning}
            className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors duration-200 ease-in-out data-[state=checked]:bg-indigo-600"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ease-in-out ${isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isRunning ? '停止提醒' : '开始提醒'}
        </button>
      </main>
    </div>
  );
}

export default App;
