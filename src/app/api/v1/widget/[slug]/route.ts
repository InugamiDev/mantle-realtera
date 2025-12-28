import { NextRequest, NextResponse } from "next/server";
import { developers } from "@/data/mockProjects";
import { TIERS } from "@/lib/tier";
import type { TierLevel } from "@/lib/types";

// Tier colors for widget rendering
const TIER_COLORS: Record<TierLevel, { color: string; bgColor: string }> = {
  SSS: { color: "#fbbf24", bgColor: "#b45309" },
  SS: { color: "#facc15", bgColor: "#a16207" },
  "S+": { color: "#22d3ee", bgColor: "#0e7490" },
  S: { color: "#34d399", bgColor: "#047857" },
  A: { color: "#60a5fa", bgColor: "#1d4ed8" },
  B: { color: "#a78bfa", bgColor: "#6d28d9" },
  C: { color: "#f472b6", bgColor: "#be185d" },
  D: { color: "#fb923c", bgColor: "#c2410c" },
  F: { color: "#f87171", bgColor: "#b91c1c" },
};

// Widget API - returns embeddable badge data for a project or developer
// GET /api/v1/widget/[slug]?type=developer|project&theme=light|dark&size=sm|md|lg

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") || "developer";
  const theme = searchParams.get("theme") || "dark";
  const size = searchParams.get("size") || "md";
  const format = searchParams.get("format") || "json"; // json, svg, html

  // Find the entity
  let entity: { name: string; tier: TierLevel; score?: number; slug: string } | null = null;

  if (type === "developer") {
    const developer = Object.values(developers).find((d) => d.slug === slug);
    if (developer) {
      entity = {
        name: developer.name,
        tier: developer.tier,
        score: developer.score,
        slug: developer.slug,
      };
    }
  }
  // TODO: Add project lookup when needed

  if (!entity) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const tierInfo = TIERS[entity.tier];
  const tierColors = TIER_COLORS[entity.tier];

  // Size configurations
  const sizes = {
    sm: { width: 120, height: 40, fontSize: 12, tierSize: 14 },
    md: { width: 180, height: 60, fontSize: 14, tierSize: 18 },
    lg: { width: 240, height: 80, fontSize: 16, tierSize: 24 },
  };
  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.md;

  // Theme colors
  const themes = {
    dark: {
      bg: "#0f0c19",
      border: "rgba(255,255,255,0.1)",
      text: "#ffffff",
      subtext: "rgba(255,255,255,0.6)",
    },
    light: {
      bg: "#ffffff",
      border: "rgba(0,0,0,0.1)",
      text: "#1a1a2e",
      subtext: "rgba(0,0,0,0.6)",
    },
  };
  const themeConfig = themes[theme as keyof typeof themes] || themes.dark;

  // Return based on format
  if (format === "svg") {
    const svg = generateSVG(entity, tierColors, sizeConfig, themeConfig);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (format === "html") {
    const html = generateHTML(entity, tierColors, sizeConfig, themeConfig, slug, type);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Default: JSON response with embed codes
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://realtera.app";

  return NextResponse.json({
    entity: {
      name: entity.name,
      tier: entity.tier,
      score: entity.score,
      tierLabel: tierInfo.label,
      tierDescription: tierInfo.description,
    },
    embedCodes: {
      iframe: `<iframe src="${baseUrl}/api/v1/widget/${slug}?type=${type}&theme=${theme}&size=${size}&format=html" width="${sizeConfig.width}" height="${sizeConfig.height}" frameborder="0" style="border-radius:8px;"></iframe>`,
      image: `<a href="${baseUrl}/${type === "developer" ? "developers" : "project"}/${slug}" target="_blank"><img src="${baseUrl}/api/v1/widget/${slug}?type=${type}&theme=${theme}&size=${size}&format=svg" alt="${entity.name} - RealTera ${entity.tier}" /></a>`,
      markdown: `[![${entity.name} - RealTera ${entity.tier}](${baseUrl}/api/v1/widget/${slug}?type=${type}&theme=${theme}&size=${size}&format=svg)](${baseUrl}/${type === "developer" ? "developers" : "project"}/${slug})`,
    },
    previewUrl: `${baseUrl}/api/v1/widget/${slug}?type=${type}&theme=${theme}&size=${size}&format=svg`,
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function generateSVG(
  entity: { name: string; tier: string; score?: number },
  tierInfo: { color: string; bgColor: string },
  size: { width: number; height: number; fontSize: number; tierSize: number },
  theme: { bg: string; border: string; text: string; subtext: string }
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <defs>
    <linearGradient id="tierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${tierInfo.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${tierInfo.bgColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size.width}" height="${size.height}" rx="8" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect x="8" y="${(size.height - size.tierSize - 8) / 2}" width="${size.tierSize + 16}" height="${size.tierSize + 8}" rx="4" fill="url(#tierGrad)"/>
  <text x="${16 + size.tierSize / 2}" y="${size.height / 2 + 1}" font-family="system-ui, -apple-system, sans-serif" font-size="${size.tierSize * 0.7}" font-weight="bold" fill="${theme.bg}" text-anchor="middle" dominant-baseline="middle">${entity.tier}</text>
  <text x="${size.tierSize + 32}" y="${size.height / 2 - size.fontSize / 2}" font-family="system-ui, -apple-system, sans-serif" font-size="${size.fontSize}" font-weight="600" fill="${theme.text}">${truncate(entity.name, 15)}</text>
  <text x="${size.tierSize + 32}" y="${size.height / 2 + size.fontSize}" font-family="system-ui, -apple-system, sans-serif" font-size="${size.fontSize * 0.75}" fill="${theme.subtext}">RealTera${entity.score ? ` • ${entity.score}/100` : ""}</text>
</svg>`;
}

function generateHTML(
  entity: { name: string; tier: string; score?: number },
  tierInfo: { color: string; bgColor: string },
  size: { width: number; height: number; fontSize: number; tierSize: number },
  theme: { bg: string; border: string; text: string; subtext: string },
  slug: string,
  type: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://realtera.app";
  const link = `${baseUrl}/${type === "developer" ? "developers" : "project"}/${slug}`;

  return `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    .widget {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: ${theme.bg};
      border: 1px solid ${theme.border};
      border-radius: 8px;
      text-decoration: none;
      width: ${size.width}px;
      height: ${size.height}px;
    }
    .tier {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: ${size.tierSize + 8}px;
      height: ${size.tierSize + 4}px;
      padding: 0 6px;
      background: linear-gradient(135deg, ${tierInfo.color}, ${tierInfo.bgColor});
      border-radius: 4px;
      font-size: ${size.tierSize * 0.6}px;
      font-weight: bold;
      color: ${theme.bg};
    }
    .info { flex: 1; overflow: hidden; }
    .name {
      font-size: ${size.fontSize}px;
      font-weight: 600;
      color: ${theme.text};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      font-size: ${size.fontSize * 0.75}px;
      color: ${theme.subtext};
    }
  </style>
</head>
<body>
  <a href="${link}" target="_blank" class="widget">
    <span class="tier">${entity.tier}</span>
    <span class="info">
      <div class="name">${entity.name}</div>
      <div class="meta">RealTera${entity.score ? ` • ${entity.score}/100` : ""}</div>
    </span>
  </a>
</body>
</html>`;
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
