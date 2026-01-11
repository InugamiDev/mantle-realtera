/**
 * Script to generate 500 real Vietnamese real estate projects
 * Run with: npx tsx scripts/generateMockData.ts
 */

import { generateProjects, developers } from "../src/data/generateRealProjects";
import * as fs from "fs";
import * as path from "path";

console.log("Generating 500 real Vietnamese real estate projects...\n");

const projects = generateProjects(500);

// Count by tier
const tierCounts: Record<string, number> = {};
for (const project of projects) {
  tierCounts[project.tier] = (tierCounts[project.tier] || 0) + 1;
}

console.log("Project distribution by tier:");
console.log("-----------------------------");
for (const tier of ["SSS", "S+", "S", "A", "B", "C", "D", "F"]) {
  console.log(`${tier}: ${tierCounts[tier] || 0} projects`);
}
console.log(`\nTotal: ${projects.length} projects`);
console.log(`Total developers: ${Object.keys(developers).length}`);

// Generate the mockProjects.ts content
const output = `import type { Project, Developer } from "@/lib/types";

// =====================================
// DEVELOPERS DATABASE (${Object.keys(developers).length} developers)
// =====================================
export const developers: Record<string, Developer> = ${JSON.stringify(developers, null, 2)};

// =====================================
// PROJECTS DATABASE (${projects.length} projects)
// =====================================
export const mockProjects: Project[] = ${JSON.stringify(projects, null, 2)};

// =====================================
// HELPER FUNCTIONS
// =====================================

// Get all developers as array
export function getAllDevelopers(): Developer[] {
  return Object.values(developers);
}

// Get developer by slug
export function getDeveloperBySlug(slug: string): Developer | undefined {
  return developers[slug] || Object.values(developers).find(d => d.slug === slug);
}

// Get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find(p => p.slug === slug);
}

// Get projects by developer slug
export function getProjectsByDeveloper(developerSlug: string): Project[] {
  return mockProjects.filter(p => p.developer.slug === developerSlug);
}

// Get all unique districts
export function getAllDistricts(): string[] {
  const districts = new Set<string>();
  for (const project of mockProjects) {
    districts.add(project.district);
  }
  return Array.from(districts).sort();
}

// Get all unique cities
export function getAllCities(): string[] {
  const cities = new Set<string>();
  for (const project of mockProjects) {
    cities.add(project.city);
  }
  return Array.from(cities).sort();
}

// Get projects by city
export function getProjectsByCity(city: string): Project[] {
  return mockProjects.filter(p => p.city === city || p.city_en === city);
}

// Get projects by district
export function getProjectsByDistrict(district: string): Project[] {
  return mockProjects.filter(p => p.district === district || p.district_en === district);
}

// Get projects by tier
export function getProjectsByTier(tier: string): Project[] {
  return mockProjects.filter(p => p.tier === tier);
}

// Search projects by query
export function searchProjects(query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return mockProjects.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    (p.name_en && p.name_en.toLowerCase().includes(lowerQuery)) ||
    p.district.toLowerCase().includes(lowerQuery) ||
    p.city.toLowerCase().includes(lowerQuery) ||
    p.developer.name.toLowerCase().includes(lowerQuery)
  );
}
`;

const outputPath = path.join(__dirname, "../src/data/mockProjects.ts");
fs.writeFileSync(outputPath, output, "utf-8");

console.log(`\nGenerated mockProjects.ts with ${projects.length} projects!`);
console.log(`Output: ${outputPath}`);

// Show some sample projects
console.log("\n=== Sample Projects ===\n");

const sampleProjects = projects.slice(0, 5);
for (const project of sampleProjects) {
  console.log(`[${project.tier}] ${project.name}`);
  console.log(`     English: ${project.name_en}`);
  console.log(`     Location: ${project.district}, ${project.city}`);
  console.log(`     Developer: ${project.developer.name}`);
  console.log(`     Score: ${project.score}`);
  console.log(`     Legal: ${project.legalStage}`);
  console.log("");
}
