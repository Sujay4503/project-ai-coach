export type Task = {
  id: string;
  title: string;
  phase: string;
  done: boolean;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
};

const TASK_KEY = "aiguru.tasks";
const NOTE_KEY = "aiguru.notes";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const loadTasks = () => read<Task>(TASK_KEY);
export const saveTasks = (tasks: Task[]) => write(TASK_KEY, tasks);
export const loadNotes = () => read<Note>(NOTE_KEY);
export const saveNotes = (notes: Note[]) => write(NOTE_KEY, notes);

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
