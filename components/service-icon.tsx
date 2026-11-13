import {
  CircleDot,
  ShieldPlus,
  Smile,
  Sparkles,
  Sun,
  WandSparkles
} from "lucide-react";

const icons = { CircleDot, ShieldPlus, Smile, Sparkles, Sun, WandSparkles };

export function ServiceIcon({ name, size = 25 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] || Sparkles;
  return <Icon size={size} strokeWidth={1.7} />;
}
