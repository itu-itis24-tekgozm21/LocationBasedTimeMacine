import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Site from "@/pages/site";
import Chat from "@/pages/chat";
import Camera from "@/pages/camera";
import Map from "@/pages/map";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/site/:id" component={Site} />
      <Route path="/chat" component={Chat} />
      <Route path="/camera" component={Camera} />
      <Route path="/map" component={Map} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <div className="pt-16 min-h-screen">
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
