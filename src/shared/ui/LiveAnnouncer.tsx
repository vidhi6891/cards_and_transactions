import type { CSSProperties } from "react";
import { useLiveAnnouncement } from "../hooks/useLiveAnnouncement";

interface LiveAnnouncerProps {
  message: string;
  politeness?: "polite" | "assertive";
  atomic?: boolean;
}

const srOnlyStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function LiveAnnouncer({
  message,
  politeness = "polite",
  atomic = true,
}: LiveAnnouncerProps) {
  const announcedMessage = useLiveAnnouncement(message);

  return (
    <div aria-live={politeness} aria-atomic={atomic} style={srOnlyStyle}>
      {announcedMessage}
    </div>
  );
}
