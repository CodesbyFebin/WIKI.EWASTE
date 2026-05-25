'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { semanticGraph } from '@/lib/wiki/entity-graph'
import type { EntityType } from '@/lib/wiki/entity-graph'

// ── Types ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  name: string
  type: EntityType
  description: string
  x: number
  y: number
  vx: number
  vy: number
  articleCount: number
  authorityScore: number
}

interface GraphEdge {
  source: string
  target: string
  strength: number
}

// ── Colours ───────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<EntityType, string> = {
  organization: '#3b82f6',
  legislation:  '#ef4444',
  standard:     '#f59e0b',
  concept:      '#10b981',
  process:      '#8b5cf6',
  material:     '#f97316',
  location:     '#06b6d4',
}

const BG_COLOR = '#07120f'

// ── Force simulation (no dependencies) ───────────────────────────────────────

const TICK_SPEED = 0.016  // ~60fps
const REPULSION  = 3500
const ATTRACTION = 0.006
const DAMPING    = 0.88
const CENTER_X   = 0.5    // fraction of canvas width
const CENTER_Y   = 0.5

function distance(a: GraphNode, b: GraphNode) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) || 0.001
}

function tick(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const cx = width * CENTER_X
  const cy = height * CENTER_Y

  // Repulsion between all pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      const d = distance(a, b)
      const force = REPULSION / (d * d)
      const dx = (b.x - a.x) / d
      const dy = (b.y - a.y) / d
      a.vx -= dx * force * TICK_SPEED
      a.vy -= dy * force * TICK_SPEED
      b.vx += dx * force * TICK_SPEED
      b.vy += dy * force * TICK_SPEED
    }
  }

  // Attraction along edges
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  for (const edge of edges) {
    const a = nodeMap.get(edge.source)
    const b = nodeMap.get(edge.target)
    if (!a || !b) continue
    const d = distance(a, b)
    const target = 120 + (1 - edge.strength) * 80
    const force = (d - target) * ATTRACTION
    const dx = (b.x - a.x) / d
    const dy = (b.y - a.y) / d
    a.vx += dx * force
    a.vy += dy * force
    b.vx -= dx * force
    b.vy -= dy * force
  }

  // Gravity toward centre
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.0008
    n.vy += (cy - n.y) * 0.0008
  }

  // Integrate + damp
  for (const n of nodes) {
    n.vx *= DAMPING
    n.vy *= DAMPING
    n.x += n.vx
    n.y += n.vy
    // Boundary
    n.x = Math.max(30, Math.min(width - 30, n.x))
    n.y = Math.max(30, Math.min(height - 30, n.y))
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface EntityGraphExplorerProps {
  articleCounts: Record<string, number>
  authorityScores?: Record<string, number>
}

export function EntityGraphExplorer({
  articleCounts,
  authorityScores = {},
}: EntityGraphExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef  = useRef<GraphNode[]>([])
  const edgesRef  = useRef<GraphEdge[]>([])
  const rafRef    = useRef<number>(0)

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode]   = useState<GraphNode | null>(null)
  const [typeFilter, setTypeFilter]     = useState<EntityType | 'all'>('all')
  const [running, setRunning]           = useState(true)

  // Initialise graph from semantic graph
  useEffect(() => {
    const entities = Object.values(semanticGraph)
    const filtered =
      typeFilter === 'all' ? entities : entities.filter((e) => e.type === typeFilter)

    const canvas = canvasRef.current
    const w = canvas?.width ?? 800
    const h = canvas?.height ?? 500

    nodesRef.current = filtered.map((e) => ({
      id:           e.id,
      name:         e.name,
      type:         e.type,
      description:  e.description,
      x:            w * (0.1 + Math.random() * 0.8),
      y:            h * (0.1 + Math.random() * 0.8),
      vx:           0,
      vy:           0,
      articleCount: articleCounts[e.id] ?? 0,
      authorityScore: authorityScores[e.id] ?? 0,
    }))

    const nodeSet = new Set(filtered.map((e) => e.id))
    const edges: GraphEdge[] = []
    const seen = new Set<string>()

    for (const e of filtered) {
      for (const relId of e.relatedEntities) {
        if (!nodeSet.has(relId)) continue
        const key = [e.id, relId].sort().join('--')
        if (seen.has(key)) continue
        seen.add(key)
        edges.push({ source: e.id, target: relId, strength: 0.8 })
      }
    }

    edgesRef.current = edges
  }, [typeFilter, articleCounts, authorityScores])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0

    function draw() {
      if (!ctx || !canvas) return
      const w = canvas.width
      const h = canvas.height
      const nodes = nodesRef.current
      const edges = edgesRef.current

      // Simulate
      if (running) {
        tick(nodes, edges, w, h)
        frame++
        // Slow down after convergence
        if (frame > 300) {
          for (const n of nodes) { n.vx *= 0.95; n.vy *= 0.95 }
        }
      }

      // Clear
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, w, h)

      // Edges
      ctx.lineWidth = 1
      for (const edge of edges) {
        const src = nodes.find((n) => n.id === edge.source)
        const tgt = nodes.find((n) => n.id === edge.target)
        if (!src || !tgt) continue
        ctx.strokeStyle = `rgba(255,255,255,${0.06 + edge.strength * 0.06})`
        ctx.beginPath()
        ctx.moveTo(src.x, src.y)
        ctx.lineTo(tgt.x, tgt.y)
        ctx.stroke()
      }

      // Nodes
      const nodeMap = new Map(nodes.map((n) => [n.id, n]))

      for (const node of nodes) {
        const isHovered  = hoveredNode?.id === node.id
        const isSelected = selectedNode?.id === node.id
        const radius = 6 + node.articleCount * 1.2 + node.authorityScore * 8

        // Glow for selected/hovered
        if (isHovered || isSelected) {
          ctx.beginPath()
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3)
          grad.addColorStop(0, TYPE_COLOR[node.type] + '55')
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = isSelected ? '#fff' : TYPE_COLOR[node.type]
        ctx.fill()

        // Label (always show for selected/hovered, show for large nodes otherwise)
        if (isHovered || isSelected || radius > 11) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.font = `${isSelected ? 'bold ' : ''}${Math.max(10, Math.min(13, radius + 3))}px sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(node.name, node.x, node.y - radius - 4)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, hoveredNode, selectedNode])

  // Hit-testing on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    let hit: GraphNode | null = null
    for (const node of nodesRef.current) {
      const r = 6 + node.articleCount * 1.2 + node.authorityScore * 8
      if ((mx - node.x) ** 2 + (my - node.y) ** 2 <= r * r) {
        hit = node
        break
      }
    }
    setHoveredNode(hit)
    if (canvas) canvas.style.cursor = hit ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    for (const node of nodesRef.current) {
      const r = 6 + node.articleCount * 1.2 + node.authorityScore * 8
      if ((mx - node.x) ** 2 + (my - node.y) ** 2 <= r * r) {
        setSelectedNode((prev) => (prev?.id === node.id ? null : node))
        return
      }
    }
    setSelectedNode(null)
  }, [])

  const entityTypes: EntityType[] = [
    'organization', 'legislation', 'standard', 'concept', 'process', 'material', 'location',
  ]

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
            typeFilter === 'all'
              ? 'bg-white text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {entityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all capitalize`}
            style={{
              backgroundColor: typeFilter === type ? TYPE_COLOR[type] : TYPE_COLOR[type] + '33',
              color:           typeFilter === type ? '#fff' : TYPE_COLOR[type],
            }}
          >
            {type}
          </button>
        ))}
        <button
          onClick={() => setRunning((r) => !r)}
          className="ml-auto rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-gray-600"
        >
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-gray-700">
        <canvas
          ref={canvasRef}
          width={900}
          height={520}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />

        {/* Selected node panel */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-72 rounded-xl bg-gray-900/95 border border-gray-700 p-4 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{ background: TYPE_COLOR[selectedNode.type] + '33', color: TYPE_COLOR[selectedNode.type] }}
              >
                {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <h3 className="font-bold text-white text-sm">{selectedNode.name}</h3>
            <p className="text-xs text-gray-400">{selectedNode.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{selectedNode.articleCount} articles</span>
              <span>authority {(selectedNode.authorityScore * 100).toFixed(0)}%</span>
            </div>
            <Link
              href={`/wiki/glossary/${selectedNode.id}`}
              className="block text-xs font-semibold text-emerald-400 hover:underline"
            >
              View definition →
            </Link>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {entityTypes.map((type) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: TYPE_COLOR[type] }}
            />
            <span className="capitalize">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block h-2.5 w-4 rounded bg-gray-600" />
          <span>node size = article refs</span>
        </div>
      </div>
    </div>
  )
}
