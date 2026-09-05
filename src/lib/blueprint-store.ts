import type { IdeaResult } from "./ideas.functions";

const KEY = "aiguru.blueprints";

export type StoredBlueprints = {
  profile: {
    interests: string;
    skills: string;
    domain: string;
    difficulty: string;
    duration: string;
  };
  result: IdeaResult;
  createdAt: string;
};

export function saveBlueprints(data: StoredBlueprints) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function loadBlueprints(): StoredBlueprints | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredBlueprints;
  } catch {
    return null;
  }
}
