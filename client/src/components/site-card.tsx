import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type Site } from "@shared/schema";
import { Link } from "wouter";

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={site.imageUrl}
          alt={site.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{site.name}</span>
          <span className="text-sm text-muted-foreground">{site.era}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {site.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{site.location}</span>
          <Link href={`/sites/${site.id}`}>
            <Button variant="ghost" className="flex items-center gap-2">
              Explore
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
