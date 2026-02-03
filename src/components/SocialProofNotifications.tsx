import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, UserPlus, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "download" | "signup" | "consultation";
  name: string;
  location: string;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "download", name: "Sarah M.", location: "London, UK", time: "2 minutes ago" },
  { id: "2", type: "signup", name: "James T.", location: "Manchester, UK", time: "5 minutes ago" },
  { id: "3", type: "consultation", name: "Emma R.", location: "Edinburgh, UK", time: "8 minutes ago" },
  { id: "4", type: "download", name: "Michael P.", location: "Birmingham, UK", time: "12 minutes ago" },
  { id: "5", type: "signup", name: "Olivia K.", location: "Bristol, UK", time: "15 minutes ago" },
  { id: "6", type: "consultation", name: "David L.", location: "Leeds, UK", time: "18 minutes ago" },
  { id: "7", type: "download", name: "Sophie W.", location: "Glasgow, UK", time: "22 minutes ago" },
  { id: "8", type: "signup", name: "Thomas H.", location: "Liverpool, UK", time: "25 minutes ago" },
];

const getNotificationContent = (notification: Notification) => {
  switch (notification.type) {
    case "download":
      return {
        icon: Download,
        text: "downloaded the Leadership Guide",
        color: "text-secondary",
        bgColor: "bg-secondary/20",
      };
    case "signup":
      return {
        icon: UserPlus,
        text: "signed up for coaching",
        color: "text-primary",
        bgColor: "bg-primary/20",
      };
    case "consultation":
      return {
        icon: CheckCircle,
        text: "booked a consultation",
        color: "text-green-500",
        bgColor: "bg-green-500/20",
      };
  }
};

const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed
    const dismissed = sessionStorage.getItem("socialProofDismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 8000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (isDismissed || isPaused) return;

    // Show next notification every 25-35 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 25000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, [notificationIndex, isDismissed, isPaused]);

  const showNotification = () => {
    const notification = mockNotifications[notificationIndex % mockNotifications.length];
    setCurrentNotification(notification);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      setNotificationIndex((prev) => prev + 1);
    }, 5000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("socialProofDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-xs"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl p-4 relative">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors"
              aria-label="Dismiss notifications"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-3">
              {(() => {
                const content = getNotificationContent(currentNotification);
                const Icon = content.icon;
                return (
                  <>
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                        content.bgColor
                      )}
                    >
                      <Icon className={cn("h-5 w-5", content.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {currentNotification.name}{" "}
                        <span className="font-normal text-muted-foreground">
                          {content.text}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {currentNotification.location} • {currentNotification.time}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofNotifications;
