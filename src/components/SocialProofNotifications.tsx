import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, UserPlus, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "download" | "signup" | "consultation";

interface Notification {
  id: string;
  type: NotificationType;
  name: string;
  location: string;
  time: string;
}

const firstNames = [
  "Sarah", "James", "Emma", "Michael", "Sophie", "David", "Charlotte", "Oliver",
  "Jessica", "William", "Emily", "Thomas", "Hannah", "Daniel", "Lucy", "Andrew",
  "Rachel", "Christopher", "Megan", "Richard", "Katie", "Matthew", "Laura", "Ben",
  "Olivia", "George", "Grace", "Harry", "Alice", "Jack", "Eleanor", "Samuel"
];

const lastInitials = ["M", "T", "R", "P", "K", "L", "W", "H", "S", "B", "C", "D", "F", "G", "J", "N"];

const locations = [
  "London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol",
  "Liverpool", "Leeds", "Sheffield", "Newcastle", "Cambridge", "Oxford",
  "Dublin", "Belfast", "Cardiff", "Brighton", "Reading", "Southampton",
  "Nottingham", "Leicester", "Aberdeen", "York", "Bath", "Canterbury"
];

const timeFrames = [
  { text: "just now", weight: 1 },
  { text: "2 minutes ago", weight: 2 },
  { text: "5 minutes ago", weight: 3 },
  { text: "8 minutes ago", weight: 3 },
  { text: "12 minutes ago", weight: 4 },
  { text: "18 minutes ago", weight: 3 },
  { text: "25 minutes ago", weight: 2 },
  { text: "45 minutes ago", weight: 2 },
  { text: "1 hour ago", weight: 4 },
  { text: "2 hours ago", weight: 5 },
  { text: "3 hours ago", weight: 3 },
  { text: "earlier today", weight: 4 },
];

const notificationTypes: NotificationType[] = ["download", "signup", "consultation"];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getWeightedTime = () => {
  const totalWeight = timeFrames.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const timeFrame of timeFrames) {
    random -= timeFrame.weight;
    if (random <= 0) return timeFrame.text;
  }
  return timeFrames[0].text;
};

const generateNotification = (): Notification => ({
  id: Math.random().toString(36).substring(7),
  type: getRandomItem(notificationTypes),
  name: `${getRandomItem(firstNames)} ${getRandomItem(lastInitials)}.`,
  location: `${getRandomItem(locations)}, UK`,
  time: getWeightedTime(),
});

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
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const showNotification = useCallback(() => {
    const notification = generateNotification();
    setCurrentNotification(notification);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, []);

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
  }, [showNotification]);

  useEffect(() => {
    if (isDismissed || isPaused) return;

    // Show next notification every 25-35 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 25000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, [isDismissed, isPaused, showNotification]);

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
