/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "@/components/motion/animated-toast-stack";

import { createContext, useContext } from "react";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useAnimatedToastStack({
    defaultDuration: 3500,
    limit: 5,
  });

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <AnimatedToastStack
        toasts={toast.toasts}
        onDismiss={toast.dismissToast}
        position="bottom-right"
        placement="fixed"
        maxVisible={4}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
