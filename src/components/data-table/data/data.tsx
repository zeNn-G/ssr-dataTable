import { ArrowDown, ArrowUp, ArrowRight, Flame, X } from "lucide-react";

export const statuses = [
  {
    value: "Yeni",
    label: "Yeni",
    icon: Flame,
  },
  {
    value: "Kapalı",
    label: "Kapalı",
    icon: X,
  },
  {
    value: "Redmine Yeni",
    label: "Redmine Yeni",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
