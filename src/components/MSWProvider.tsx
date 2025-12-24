"use client";

import { useEffect, useState } from "react";

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        // localhost以外（Vercelなど）では動かさないガード
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        
        if (isLocal && process.env.NODE_ENV === "development") {
          try {
            const { worker } = await import("@/src/mocks/browser");
            // すでに起動している場合は何もしない
            await worker.start({
              onUnhandledRequest: "bypass",
            });
            console.log("[MSW] Mocking enabled.");
          } catch (error) {
            console.error("[MSW] Failed to start:", error);
          }
        }
      }
      setMswReady(true);
    };
    init();
  }, []);

  // 🔴 ここがポイント：
  // MSWが「準備完了」と言うまで children をマウントしない。
  // これにより、すべてのAPI通信が必ずMSWを通るようになります。
  if (!mswReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading Mock Environment...
      </div>
    );
  }

  return <>{children}</>;
};