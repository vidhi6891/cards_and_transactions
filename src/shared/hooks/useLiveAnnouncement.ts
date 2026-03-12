import { useEffect, useState } from "react";

export function useLiveAnnouncement(message: string, delayMs = 30): string {
  const [announcedMessage, setAnnouncedMessage] = useState("");

  useEffect(() => {
    if (!message.trim()) {
      setAnnouncedMessage("");
      return;
    }

    setAnnouncedMessage("");

    const timeoutId = setTimeout(() => {
      setAnnouncedMessage(message);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, delayMs]);

  return announcedMessage;
}
