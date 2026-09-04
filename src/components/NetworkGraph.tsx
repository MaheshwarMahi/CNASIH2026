import { useRef, useEffect, useState, useCallback } from 'react';
import type { GraphNode, GraphEdge, Entity } from '@/types';
import { graphNodes as defaultNodes, graphEdges as defaultEdges, entities } from '@/data';
import { statusColors } from '@/lib/colors';

interface NetworkGraphProps {
  height?: number | string;
  filterEntityId?: string | null;
  showInferred?: boolean;
  onNodeClick?: (entity: Entity) => void;
  highlightId?: string | null;
  className?: string;
  mini?: boolean;
}

const typeRadius: Record<string, number> = {
  person: 18,
  phone: 10,
  account: 12,
  vehicle: 11,
  location: 13,
};

export function NetworkGraph({
  height = 400,
  filterEntityId = null,
  showInferred = true,
  onNodeClick,
  highlightId = null,
  className = '',
  mini = false,
}: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(() => defaultNodes.map((n) => ({ ...n })));
  const [edges] = useState<GraphEdge[]>(defaultEdges);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const dragNodeRef = useRef<string | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 400 });

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Force simulation
  useEffect(() => {
    let frame = 0;
    const k = 0.018;
    const repulsion = 1800;
    const linkDist = mini ? 40 : 80;
    const damping = 0.82;

    function simulate() {
      setNodes((prevNodes) => {
        const n = prevNodes.map((node) => ({ ...node }));
        const visibleEdges = edges.filter((e) => showInferred || !e.inferred);

        // Repulsion
        for (let i = 0; i < n.length; i++) {
          for (let j = i + 1; j < n.length; j++) {
            const dx = n[i].x - n[j].x;
            const dy = n[i].y - n[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
            const force = repulsion / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n[i].vx += fx;
            n[i].vy += fy;
            n[j].vx -= fx;
            n[j].vy -= fy;
          }
        }

        // Link attraction
        const nodeMap = new Map(n.map((node) => [node.id, node]));
        for (const edge of visibleEdges) {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) continue;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const force = (dist - linkDist) * k;
          const fx = (dx / dist) * force * 50;
          const fy = (dy / dist) * force * 50;
          s.vx += fx;
          s.vy += fy;
          t.vx -= fx;
          t.vy -= fy;
        }

        // Center gravity
        const cx = containerSize.w / 2;
        const cy = containerSize.h / 2;
        for (const node of n) {
          node.vx += (cx - node.x) * 0.002;
          node.vy += (cy - node.y) * 0.002;
        }

        // Apply velocity
        for (const node of n) {
          if (dragNodeRef.current === node.id) continue;
          node.vx *= damping;
          node.vy *= damping;
          node.x += node.vx;
          node.y += node.vy;

          // Bounds
          const margin = 30;
          node.x = Math.max(margin, Math.min(containerSize.w - margin, node.x));
          node.y = Math.max(margin, Math.min(containerSize.h - margin, node.y));
        }

        return n;
      });
      frame = requestAnimationFrame(simulate);
    }

    frame = requestAnimationFrame(simulate);
    animFrameRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, [edges, showInferred, containerSize.w, containerSize.h, mini]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerSize.w * dpr;
    canvas.height = containerSize.h * dpr;
    canvas.style.width = `${containerSize.w}px`;
    canvas.style.height = `${containerSize.h}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, containerSize.w, containerSize.h);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const visibleEdges = edges.filter((e) => showInferred || !e.inferred);
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Determine filtered nodes
    let visibleNodeIds: Set<string> | null = null;
    if (filterEntityId) {
      visibleNodeIds = new Set<string>([filterEntityId]);
      for (const edge of visibleEdges) {
        if (edge.source === filterEntityId) visibleNodeIds.add(edge.target);
        if (edge.target === filterEntityId) visibleNodeIds.add(edge.source);
      }
    }

    // Draw edges
    for (const edge of visibleEdges) {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) continue;
      if (visibleNodeIds && !visibleNodeIds.has(s.id) && !visibleNodeIds.has(t.id)) continue;

      const isHovered = hoveredEdge?.id === edge.id;
      const dim = filterEntityId && !visibleNodeIds?.has(s.id) && !visibleNodeIds?.has(t.id);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);

      if (edge.inferred) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }

      const edgeColor = edge.inferred
        ? dim
          ? 'rgba(255, 179, 0, 0.08)'
          : isHovered
            ? 'rgba(255, 179, 0, 0.8)'
            : 'rgba(255, 179, 0, 0.3)'
        : dim
          ? 'rgba(255, 255, 255, 0.04)'
          : isHovered
            ? 'rgba(0, 229, 255, 0.7)'
            : 'rgba(255, 255, 255, 0.12)';

      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = isHovered ? 2.5 : 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Edge label on hover
      if (isHovered && !mini) {
        const mx = (s.x + t.x) / 2;
        const my = (s.y + t.y) / 2;
        const label = edge.label + (edge.confidence ? ` (${edge.confidence}%)` : '');
        ctx.font = '11px Inter, sans-serif';
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.lineWidth = 1;
        const padX = 8;
        const padY = 4;
        ctx.beginPath();
        ctx.roundRect(mx - textWidth / 2 - padX, my - 10, textWidth + padX * 2, 20, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = edge.inferred ? '#FFB300' : '#00E5FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, mx, my);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      if (visibleNodeIds && !visibleNodeIds.has(node.id)) continue;

      const sc = statusColors[node.status];
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode === node.id;
      const isHighlighted = highlightId === node.id;
      const r = node.radius || typeRadius[node.type] || 12;

      // Glow for hovered/selected/highlighted
      if (isHovered || isSelected || isHighlighted) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = sc.border + '20';
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = sc.bg;
      ctx.fill();
      ctx.strokeStyle = sc.border;
      ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
      ctx.stroke();

      // AI inferred indicator
      if (node.aiInferred) {
        ctx.beginPath();
        ctx.arc(node.x + r * 0.7, node.y - r * 0.7, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF';
        ctx.fill();
        ctx.strokeStyle = '#0A0A0A';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Label
      if (!mini || isHovered) {
        ctx.font = `${node.type === 'person' ? '600' : '400'} 11px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labelColor = isHovered || isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
        ctx.fillStyle = labelColor;
        ctx.fillText(node.label, node.x, node.y + r + 5);
      }
    }

    ctx.restore();
  }, [nodes, edges, hoveredNode, hoveredEdge, selectedNode, transform, showInferred, filterEntityId, highlightId, mini, containerSize]);

  // Mouse handlers
  const getMousePos = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - transform.x) / transform.scale,
      y: (e.clientY - rect.top - transform.y) / transform.scale,
    };
  }, [transform]);

  function findNodeAt(x: number, y: number): GraphNode | null {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const r = n.radius || typeRadius[n.type] || 12;
      const dx = x - n.x;
      const dy = y - n.y;
      if (dx * dx + dy * dy < r * r) return n;
    }
    return null;
  }

  function findEdgeAt(x: number, y: number): GraphEdge | null {
    const visibleEdges = edges.filter((e) => showInferred || !e.inferred);
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const edge of visibleEdges) {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) continue;
      const dist = pointToLineDist(x, y, s.x, s.y, t.x, t.y);
      if (dist < 6) return edge;
    }
    return null;
  }

  function pointToLineDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleMouseDown(e: React.MouseEvent) {
    const pos = getMousePos(e);
    const node = findNodeAt(pos.x, pos.y);
    if (node) {
      dragNodeRef.current = node.id;
      setIsDragging(true);
      setSelectedNode(node.id);
    } else {
      setIsPanning(true);
      setSelectedNode(null);
    }
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    const pos = getMousePos(e);

    if (isDragging && dragNodeRef.current) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragNodeRef.current ? { ...n, x: pos.x, y: pos.y, vx: 0, vy: 0 } : n
        )
      );
    } else if (isPanning) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const node = findNodeAt(pos.x, pos.y);
      const edge = node ? null : findEdgeAt(pos.x, pos.y);
      setHoveredNode(node);
      setHoveredEdge(edge);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = node ? 'pointer' : edge ? 'help' : 'grab';
      }
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (isDragging && dragNodeRef.current) {
      const node = nodes.find((n) => n.id === dragNodeRef.current);
      if (node) {
        const entity = entities.find((en) => en.id === node.id);
        if (entity && onNodeClick) {
          // Only treat as click if minimal movement
          const pos = getMousePos(e);
          const dx = pos.x - node.x;
          const dy = pos.y - node.y;
          if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            onNodeClick(entity);
          }
        }
      }
    }
    dragNodeRef.current = null;
    setIsDragging(false);
    setIsPanning(false);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, prev.scale + delta)),
    }));
  }

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0"
        style={{ cursor: 'grab' }}
      />
      {!mini && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger" /> Criminal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" /> POI
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" /> Verified
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan" /> Asset
          </span>
        </div>
      )}
    </div>
  );
}
