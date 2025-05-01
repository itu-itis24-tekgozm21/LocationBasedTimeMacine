import { ChatInterface } from "@/components/chat/ChatInterface";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Chat() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          asChild
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Sites
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Historical Guide Chat
          </h1>
          <p className="text-muted-foreground">
            Ask questions about historical sites, artifacts, and events. Our AI guide will help you explore history.
          </p>
        </div>

        <ChatInterface />
      </motion.div>
    </div>
  );
}
