import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import type { HistoricalSite, Story } from "@shared/schema";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { StoryViewer } from "@/components/storytelling/StoryViewer";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Site() {
  const [match, params] = useRoute("/site/:id");
  const siteId = match ? parseInt(params.id) : null;

  const { data: site, isLoading: siteLoading } = useQuery<HistoricalSite>({
    queryKey: [`/api/sites/${siteId}`],
    enabled: !!siteId,
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: [`/api/sites/${siteId}/stories`],
    enabled: !!siteId,
  });

  if (siteLoading) {
    return <SiteSkeleton />;
  }

  if (!site) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Site not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <AspectRatio ratio={21/9}>
            <img
              src={site.imageUrls[0]}
              alt={site.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{site.name}</h1>
                <p className="text-muted-foreground">
                  {site.location} • {site.period} Period • Built in {site.yearBuilt}
                </p>
              </div>
              <p className="text-lg">{site.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {site.imageUrls.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AspectRatio ratio={1}>
                    <img
                      src={url}
                      alt={`${site.name} view ${index + 1}`}
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <StoryViewer
            siteId={site.id}
            stories={stories}
          />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ChatInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SiteSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="overflow-hidden">
        <Skeleton className="h-[400px]" />
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
