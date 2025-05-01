import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineProps {
  events: {
    date: string;
    title: string;
    description: string;
  }[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {events.map((event, index) => (
        <motion.div
          key={index}
          className="relative flex items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <div className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow">
            <span className="h-3 w-3 rounded-full bg-white" />
          </div>
          
          <div className="ml-16 w-full">
            <div className="flex flex-col space-y-3 rounded-lg bg-white p-4 shadow-lg">
              <time className="text-sm font-semibold text-primary">
                {event.date}
              </time>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
