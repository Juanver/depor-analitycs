'use client';

import React from 'react';
import { PassingNetworkNode, PassingConnection } from '@/types/teamAnalysis';

export interface TeamPitchPassingNetworkProps {
  nodes: PassingNetworkNode[];
  connections: PassingConnection[];
  shirtColor?: string;
  visible?: boolean;
}

export function TeamPitchPassingNetwork({
  nodes,
  connections,
  shirtColor = '#A3E635',
  visible = true,
}: TeamPitchPassingNetworkProps) {
  if (!visible || !nodes || nodes.length === 0) return null;

  // Map nodes by id for quick coordinate lookup
  const nodeMap = new Map<string, PassingNetworkNode>();
  nodes.forEach((n) => nodeMap.set(n.playerId, n));

  return (
    <g className="team-passing-network-layer transition-opacity duration-300">
      <defs>
        {/* Glow filter for passing lines */}
        <filter id="pass-line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Passing Connection Lines */}
      <g className="passing-connections" filter="url(#pass-line-glow)">
        {connections.map((conn, idx) => {
          const from = nodeMap.get(conn.fromPlayerId);
          const to = nodeMap.get(conn.toPlayerId);
          if (!from || !to) return null;

          // Line thickness mapped from weight (1 to 5) -> 0.35 to 1.4 in pitch units
          const strokeWidth = 0.3 + (conn.weight || 2) * 0.22;
          const opacity = Math.min(0.85, 0.35 + (conn.weight || 2) * 0.12);

          return (
            <g key={`conn-${idx}`}>
              <line
                x1={from.averageX}
                y1={from.averageY}
                x2={to.averageX}
                y2={to.averageY}
                stroke="var(--color-telemetry-cyan)"
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

      {/* Player Position Nodes (Centroids) */}
      <g className="passing-nodes">
        {nodes.map((node) => {
          // Node radius scaled by pass volume (between 2.8 and 4.2 pitch units)
          const radius = 2.4 + Math.min(1.6, (node.passCount / 40) * 1.4);

          return (
            <g
              key={node.playerId}
              className="cursor-pointer group"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.8))',
              }}
            >
              {/* Outer pulsing ring for key pivots */}
              {node.passCount >= 35 && (
                <circle
                  cx={node.averageX}
                  cy={node.averageY}
                  r={radius + 1.4}
                  fill="none"
                  stroke="var(--color-volt)"
                  strokeWidth="0.25"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={`${radius + 0.8};${radius + 2.4};${radius + 0.8}`}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0.1;0.7"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Node Outer Ring */}
              <circle
                cx={node.averageX}
                cy={node.averageY}
                r={radius}
                fill="#0E151B"
                stroke="var(--color-volt)"
                strokeWidth="0.45"
              />

              {/* Node Center Badge */}
              <circle
                cx={node.averageX}
                cy={node.averageY}
                r={radius - 0.7}
                fill={shirtColor || '#0F172A'}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="0.2"
              />

              {/* Player Jersey Number */}
              <text
                x={node.averageX}
                y={node.averageY + 0.7}
                fill="#FFFFFF"
                fontFamily="var(--font-display)"
                fontSize="2.1"
                fontWeight="900"
                textAnchor="middle"
              >
                {node.dorsal}
              </text>

              {/* Player Name Label Beneath Node */}
              <text
                x={node.averageX}
                y={node.averageY + radius + 1.8}
                fill="#E2E8F0"
                fontFamily="var(--font-display)"
                fontSize="1.6"
                fontWeight="800"
                textAnchor="middle"
                letterSpacing="0.04em"
              >
                {node.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
