"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SlideEditor } from "./SlideEditor";
import { useAppStore, SlideData } from "@/lib/store";
import { terms } from "@/lib/terms";

function SlideNode({ data }: NodeProps) {
  return (
    <div className="px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-blue-500 min-w-[200px] cursor-pointer hover:shadow-xl transition-shadow">
      <div className="font-bold text-sm text-blue-600 mb-2">
        {terms.slideNode} {data.index + 1}
      </div>
      <div className="text-base font-semibold">{data.label}</div>
    </div>
  );
}

const nodeTypes = {
  slideNode: SlideNode,
};

export function GraphView() {
  const { slides, setCurrentView } = useAppStore();
  const [selectedSlide, setSelectedSlide] = useState<SlideData | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Create nodes from slides
  const initialNodes: Node[] = slides.map((slide, index) => ({
    id: slide.id,
    type: "slideNode",
    position: { x: 250, y: index * 150 },
    data: { label: slide.title, index },
  }));

  // Create edges between sequential slides
  const initialEdges: Edge[] = slides.slice(0, -1).map((slide, index) => ({
    id: `e${slide.id}-${slides[index + 1].id}`,
    source: slide.id,
    target: slides[index + 1].id,
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_event: any, node: Node) => {
      const slide = slides.find((s) => s.id === node.id);
      if (slide) {
        setSelectedSlide(slide);
        setIsEditorOpen(true);
      }
    },
    [slides]
  );

  const handleContinue = () => {
    setCurrentView("slideshow");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md p-6 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {terms.graphTitle}
            </h1>
            <p className="text-slate-600 mt-1">{terms.graphSubtitle}</p>
          </div>
          <Button onClick={handleContinue} size="lg" className="px-8">
            {terms.continueToSlideshow}
          </Button>
        </div>
      </div>

      {/* ReactFlow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls />
          <MiniMap
            nodeColor="#3b82f6"
            maskColor="rgba(0, 0, 0, 0.1)"
            className="bg-white"
          />
        </ReactFlow>
      </div>

      {/* Slide Editor Dialog */}
      {selectedSlide && (
        <SlideEditor
          slide={selectedSlide}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedSlide(null);
          }}
        />
      )}
    </div>
  );
}
