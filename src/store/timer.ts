import { create } from 'zustand';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { invoke } from '@tauri-apps/api/core';

interface TimerState {
    seconds: number;
    intervalId: number | null;
    isRunning: boolean;
    remainingTime: number;
    notificationCount: number;
    notificationMethod: 'desktop' | 'sound' | 'screen_lock';
    setSeconds: (seconds: number) => void;
    setIsRunning: (isRunning: boolean) => void;
    setRemainingTime: (remainingTime: number) => void;
    incrementNotificationCount: () => void;
    setNotificationMethod: (method: 'desktop' | 'sound' | 'screen_lock') => void;
    startTimer: () => Promise<void>;
    pauseTimer: () => void;
    resetTimer: () => void;
}

async function sendUserNotification(minite: number, notificationCount: number) {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }

    if (permissionGranted) {
        sendNotification({
            title: '久坐提醒',
            body: `您已经久坐了${minite}分钟了，请站起来休息一下，这是第${notificationCount}次提醒`,
            icon: 'public/logo.png'
        });
    }
}

export const useTimerStore = create<TimerState>((set, get) => ({
    seconds: 1800,
    isRunning: false,
    intervalId: null,
    remainingTime: 1800,
    notificationCount: 0,
    notificationMethod: 'desktop',
    setSeconds: (seconds) => set({ seconds, remainingTime: seconds }),
    setIsRunning: (isRunning) => set({ isRunning }),
    setRemainingTime: (remainingTime) => set({ remainingTime }),
    incrementNotificationCount: () => set((state) => ({ notificationCount: state.notificationCount + 1 })),
    setNotificationMethod: (method) => set({ notificationMethod: method }),
    startTimer: async () => {
        const { intervalId, isRunning } = get();

        if (isRunning) return;

        if (intervalId) {
            clearInterval(intervalId);
        }

        set({ isRunning: true });
        const newIntervalId = setInterval(() => {
            set((state) => {
                if (state.remainingTime <= 1) {
                    switch (state.notificationMethod) {
                        case 'desktop':
                            sendUserNotification(state.seconds / 60, state.notificationCount + 1)
                            break
                        case 'screen_lock':
                            invoke('lock_screen').catch(console.error);
                            break
                        case 'sound':
                            console.log('sound')
                            break
                    }
                    return {
                        remainingTime: state.seconds,
                        notificationCount: state.notificationCount + 1
                    };
                }
                const newRemainingTime = state.remainingTime - 1;

                // 更新托盘标题
                const minutes = Math.floor(newRemainingTime / 60);
                const seconds = newRemainingTime % 60;
                const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                invoke('update_tray_title', { timeLeft: timeString }).catch(console.error);

                return { remainingTime: newRemainingTime };
            });
        }, 1000);
        set({ intervalId: newIntervalId });
    },
    pauseTimer: () => {
        const { intervalId } = get();
        if (intervalId) {
            clearInterval(intervalId);
        }
        // 清除托盘标题
        invoke('update_tray_title', { timeLeft: '' }).catch(console.error);
        set({ isRunning: false, intervalId: null });
    },
    resetTimer: () => {
        const { seconds, intervalId } = get();
        if (intervalId) {
            clearInterval(intervalId);
        }
        // 清除托盘标题
        invoke('update_tray_title', { timeLeft: '' }).catch(console.error);
        set({ isRunning: false, intervalId: null, remainingTime: seconds });
    },
}));
