import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { SiteCard } from "@/components/sites/SiteCard";
import { Timeline } from "@/components/ui/timeline";
import type { HistoricalSite } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();

  const { data: sites, isLoading } = useQuery<HistoricalSite[]>({
    queryKey: ["/api/sites"],
  });

  const timelineEvents = [
    {
      date: "3000 BCE",
      title: "Ancient Civilizations",
      description: "Early human settlements and the rise of ancient civilizations",
    },
    {
      date: "500 BCE",
      title: "Classical Period",
      description: "Greek and Roman civilizations flourish",
    },
    {
      date: "500 CE",
      title: "Medieval Period",
      description: "Middle Ages and feudal society",
    },
    {
      date: "1500 CE",
      title: "Renaissance",
      description: "Revival of art, culture and learning",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-12">
      <section className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore Historical Sites
        </motion.h1>
        <motion.p
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover the rich history of ancient landmarks and learn about their stories through our interactive platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={() => setLocation("/chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Historical Guide
          </Button>
        </motion.div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Featured Sites</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites?.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onClick={() => setLocation(`/site/${site.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Historical Timeline</h2>
        <Timeline events={timelineEvents} />
      </section>
    </div>
  );
}
