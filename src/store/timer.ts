import { create } from 'zustand';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

interface TimerState {
    seconds: number;
    intervalId: number | null;
    isRunning: boolean;
    remainingTime: number;
    notificationCount: number;
    setSeconds: (seconds: number) => void;
    setIsRunning: (isRunning: boolean) => void;
    setRemainingTime: (remainingTime: number) => void;
    incrementNotificationCount: () => void;
    startTimer: () => Promise<void>;
    stopTimer: () => void;
    resetTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
    seconds: 1800,
    isRunning: false,
    intervalId: null,
    remainingTime: 1800,
    notificationCount: 0,
    setSeconds: (seconds) => set({ seconds, remainingTime: seconds }),
    setIsRunning: (isRunning) => set({ isRunning }),
    setRemainingTime: (remainingTime) => set({ remainingTime }),
    incrementNotificationCount: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
    startTimer: async () => {
        const { seconds, intervalId, isRunning } = get();
        if (intervalId) {
            clearInterval(intervalId);
        }
        if (isRunning) return;

        let permissionGranted = await isPermissionGranted();

        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }

        if (permissionGranted) {
            set({ isRunning: true, remainingTime: seconds });
            const newIntervalId = setInterval(() => {
                set((state) => {
                    if (state.remainingTime <= 1) {
                        sendNotification({
                            title: '久坐提醒',
                            body: `您已久坐${state.seconds}秒，请起身活动一下！这是第${state.notificationCount + 1}次提醒。`
                        });
                        return {
                            remainingTime: state.seconds,
                            notificationCount: state.notificationCount + 1
                        };
                    }
                    return { remainingTime: state.remainingTime - 1 };
                });
            }, 1000);
            set({ intervalId: newIntervalId });
        }
    },
    stopTimer: () => {
        const { intervalId } = get();
        if (intervalId) {
            clearInterval(intervalId);
        }
        set({ isRunning: false, intervalId: null });
    },
    resetTimer: () => {
        const { seconds, intervalId } = get();
        if (intervalId) {
            clearInterval(intervalId);
        }
        set({ isRunning: false, intervalId: null, remainingTime: seconds });
    },
}));
