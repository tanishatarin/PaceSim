export type Module = {
  id: number;
  title: string;
  description?: string;
};

export type Session = {
  name: string;
  date: string;
  status: "Completed" | "In Progress";
};

export type PacemakerInfo = {
  rate: string;
  aOutput: string;
  vOutput: string;
  vSensitivity: string;
};
