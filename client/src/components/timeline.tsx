import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimelineProps {
  stories: { title: string; content: string }[];
}

export function Timeline({ stories }: TimelineProps) {
  return (
    <div className="relative">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {stories.map((story, index) => (
            <Card key={index} className="flex-none w-[300px]">
              <CardContent className="pt-6">
                <div className="absolute top-0 -translate-y-1/2 left-4 w-4 h-4 rounded-full bg-primary" />
                <h3 className="font-semibold mb-2">{story.title}</h3>
                <p className="text-sm text-muted-foreground">{story.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="absolute top-0 left-0 right-0 h-px bg-border" />
    </div>
  );
}
