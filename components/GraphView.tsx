"use client";

import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeProps,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SlideEditor } from "./SlideEditor";
import { MapView } from "./MapView";
import { useAppStore, SlideData } from "@/lib/store";
import { terms } from "@/lib/terms";
import { ImageIcon, Edit3 } from "lucide-react";

function SlideNode({ data }: NodeProps) {
  const { slide, onUpdate, onImageEdit } = data;
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Debounced auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate({ title: value });
    }, 500);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    // Debounced auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate({ content: value });
    }, 500);
  };

  const handleTitleBlur = () => {
    onUpdate({ title });
    setIsEditingTitle(false);
  };

  const handleContentBlur = () => {
    onUpdate({ content });
    setIsEditingContent(false);
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  return (
    <div className="w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden relative group">
      <Handle type="target" position={Position.Top} />
      
      {/* Slide Content - matching Slideshow layout */}
      <div className="p-12 h-full flex flex-col">
        {/* Title Section */}
        <div className="relative mb-8 border-b-4 border-blue-600 pb-4">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              onClick={(e) => e.stopPropagation()}
              className="text-4xl font-bold text-slate-900 border-none shadow-none p-0 focus-visible:ring-0 bg-transparent"
              autoFocus
            />
          ) : (
            <div 
              className="text-4xl font-bold text-slate-900 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {title}
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onImageEdit(slide);
            }}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Area - Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Text Content */}
          <div className="space-y-4">
            {isEditingContent ? (
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={handleContentBlur}
                onClick={(e) => e.stopPropagation()}
                className="text-lg text-slate-700 leading-relaxed border-none shadow-none p-0 focus-visible:ring-0 resize-none h-full"
                autoFocus
              />
            ) : (
              <div 
                className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingContent(true);
                }}
              >
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Image or Map */}
          <div className="space-y-4">
            {slide.imageUrl && !imageErrors.has(slide.imageUrl) && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-64 object-cover"
                  onError={() => handleImageError(slide.imageUrl!)}
                />
              </div>
            )}

            {slide.location && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {slide.location.name}
                </h3>
                <div className="h-48 rounded-lg overflow-hidden">
                  <MapView
                    lat={slide.location.lat}
                    lng={slide.location.lng}
                    locationName={slide.location.name}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Overlay Icons */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  slideNode: SlideNode,
};

export function GraphView() {
  const { slides, setCurrentView, updateSlide } = useAppStore();
  const [selectedSlide, setSelectedSlide] = useState<SlideData | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Handle node updates
  const handleNodeUpdate = useCallback((slideId: string, updates: Partial<SlideData>) => {
    updateSlide(slideId, updates);
  }, [updateSlide]);

  // Handle image editing
  const handleImageEdit = useCallback((slide: SlideData) => {
    setSelectedSlide(slide);
    setIsEditorOpen(true);
  }, []);

  // Create nodes from slides - horizontal layout
  const initialNodes: Node[] = slides.map((slide, index) => ({
    id: String(slide.id),
    type: "slideNode",
    position: { x: index * 900, y: 100 },
    data: { 
      slide, 
      index,
      onUpdate: (updates: Partial<SlideData>) => handleNodeUpdate(slide.id, updates),
      onImageEdit: handleImageEdit
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  // Create edges between sequential slides - horizontal flow
  const initialEdges: Edge[] = slides.slice(0, -1).map((slide, index) => ({
    id: `e${slide.id}-${slides[index + 1].id}`,
    source: String(slide.id),
    target: String(slides[index + 1].id),
    animated: true,
    type: 'smoothstep',
    style: { stroke: "#3b82f6", strokeWidth: 3 },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (event: any, node: Node) => {
      // Only handle image editing on node click, but not on input/textarea elements
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      const slide = slides.find((s) => s.id === node.id);
      if (slide) {
        handleImageEdit(slide);
      }
    },
    [slides, handleImageEdit]
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
          fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
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

      {/* Slide Editor Dialog - Image Selection Only */}
      {selectedSlide && (
        <SlideEditor
          slide={selectedSlide}
          isOpen={isEditorOpen}
          imageOnly={true}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedSlide(null);
          }}
        />
      )}
    </div>
  );
}
