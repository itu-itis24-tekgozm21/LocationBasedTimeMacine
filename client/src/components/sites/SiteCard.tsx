import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { HistoricalSite } from "@shared/schema";
import { motion } from "framer-motion";

interface SiteCardProps {
  site: HistoricalSite;
  onClick?: () => void;
}

export function SiteCard({ site, onClick }: SiteCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <AspectRatio ratio={16/9}>
          <img
            src={site.imageUrls[0]}
            alt={site.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <CardHeader>
          <CardTitle className="text-xl">{site.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {site.location} • Built in {site.yearBuilt}
            </p>
            <p className="text-sm line-clamp-2">
              {site.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
