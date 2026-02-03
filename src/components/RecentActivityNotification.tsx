import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, MapPin } from "lucide-react";

const firstNames = [
  "Sarah", "James", "Emma", "Michael", "Sophie", "David", "Charlotte", "Oliver",
  "Jessica", "William", "Emily", "Thomas", "Hannah", "Daniel", "Lucy", "Andrew",
  "Rachel", "Christopher", "Megan", "Richard", "Katie", "Matthew", "Laura", "Ben"
];

const locations = [
  "London", "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Bristol",
  "Liverpool", "Leeds", "Sheffield", "Newcastle", "Cambridge", "Oxford",
  "Dublin", "Belfast", "Cardiff", "Brighton", "Reading", "Southampton"
];

const timeFrames = [
  { text: "just now", weight: 1 },
  { text: "2 minutes ago", weight: 2 },
  { text: "5 minutes ago", weight: 3 },
  { text: "12 minutes ago", weight: 4 },
  { text: "23 minutes ago", weight: 3 },
  { text: "45 minutes ago", weight: 2 },
  { text: "1 hour ago", weight: 4 },
  { text: "2 hours ago", weight: 5 },
  { text: "3 hours ago", weight: 3 },
  { text: "5 hours ago", weight: 2 },
  { text: "earlier today", weight: 4 },
];

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

const generateNotification = () => ({
  id: Math.random().toString(36).substring(7),
  name: getRandomItem(firstNames),
  location: getRandomItem(locations),
  time: getWeightedTime(),
});

interface RecentActivityNotificationProps {
  className?: string;
}

const RecentActivityNotification = ({ className = "" }: RecentActivityNotificationProps) => {
  const [notification, setNotification] = useState<ReturnType<typeof generateNotification> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNewNotification = useCallback(() => {
    setNotification(generateNotification());
    setIsVisible(true);
    
    // Hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    // Show first notification after 3-6 seconds
    const initialDelay = 3000 + Math.random() * 3000;
    const initialTimer = setTimeout(showNewNotification, initialDelay);

    // Then show new notifications every 12-20 seconds
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 8000;
      setTimeout(showNewNotification, randomDelay);
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNewNotification]);

  return (
    <div className={`fixed bottom-24 left-4 z-40 ${className}`}>
      <AnimatePresence mode="wait">
        {isVisible && notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-border/50 max-w-xs"
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {notification.name} downloaded the course overview
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{notification.location}</span>
                <span className="mx-1">•</span>
                <span>{notification.time}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentActivityNotification;
