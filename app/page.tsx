"use client";

import { ChatInterface } from "@/components/ChatInterface";
import { GraphView } from "@/components/GraphView";
import { Slideshow } from "@/components/Slideshow";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { currentView } = useAppStore();

  return (
    <main>
      {currentView === "chat" && <ChatInterface />}
      {currentView === "graph" && <GraphView />}
      {currentView === "slideshow" && <Slideshow />}
    </main>
  );
}
