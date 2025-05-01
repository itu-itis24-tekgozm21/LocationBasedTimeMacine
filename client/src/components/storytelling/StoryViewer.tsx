import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { Story } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StoryViewerProps {
  siteId: number;
  stories: Story[];
}

export function StoryViewer({ siteId, stories }: StoryViewerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateStory = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/sites/${siteId}/stories`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sites/${siteId}/stories`] });
      toast({
        title: "Success",
        description: "Generated a new historical story",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate story",
        variant: "destructive",
      });
    },
  });

  if (generateStory.isPending) {
    return <StoryViewerSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historical Stories</h2>
        <Button
          onClick={() => generateStory.mutate()}
          disabled={generateStory.isPending}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New Story
        </Button>
      </div>

      <div className="grid gap-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="prose max-w-none">
                  {story.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StoryViewerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
