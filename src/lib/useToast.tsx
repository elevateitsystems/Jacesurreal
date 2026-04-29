"use client";

import { useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'error';
}

export default function useToast() {
    const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'error' = 'info') => {
        const content = (
            <div className="flex flex-col gap-1">
                <div className="font-bold text-sm tracking-wider uppercase">{title}</div>
                <div className="text-xs opacity-70 font-mono tracking-tight">{message}</div>
            </div>
        );

        const style = {
            background: 'rgba(20, 20, 20, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '4px',
            padding: '12px 16px',
        };

        if (type === 'success') {
            toast.success(content, { style });
        } else if (type === 'error') {
            toast.error(content, { style });
        } else {
            toast(content, { style });
        }
    }, []);

    const ToastContainer = () => (
        <Toaster position="bottom-right" />
    );

    return { showToast, ToastContainer };
}
