import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scroll, Map, Book, MessageSquare, Camera, MapPin } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Scroll className="h-6 w-6" />
            <span className="font-bold text-xl">HistoryLens</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4 ml-auto">
          <Link href="/sites">
            <Button variant="ghost" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Explore Sites
            </Button>
          </Link>
          <Link href="/stories">
            <Button variant="ghost" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Stories
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Guide
            </Button>
          </Link>
          <Link href="/camera">
            <Button variant="ghost" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="ghost" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
