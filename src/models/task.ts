export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
let nextId = 3;
export function getNextId(): number {
  return nextId++;
}
export const tasks: Task[] = [
  {
    id: 1,
    title: "Nauczyć się TypeScript",
    description: "Przejść tutorial TS",
    completed: false,
  },
  {
    id: 2,
    title: "Nauczyć się pisać kod",
    description: "Przejść tutorial TS",
    completed: false,
  },
];
