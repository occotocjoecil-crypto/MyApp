import { Stack } from "expo-router";

export const unauthenticatedColors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  accent: "#4F46E5",
  ratioLow: "#EF476F",
  ratioMid: "#FFD166",
  ratioHigh: "#06D6A0",
} as const;

export function getBorderColor(variant: "default" | "strong" | "subtle" = "default") {
  if (variant === "strong") return unauthenticatedColors.accent;
  if (variant === "subtle") return "#F1F5F9";
  return unauthenticatedColors.border;
}

export function getRatioColor(ratio: number) {
  const value = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  if (value < 0.5) return unauthenticatedColors.ratioLow;
  if (value < 0.8) return unauthenticatedColors.ratioMid;
  return unauthenticatedColors.ratioHigh;
}

export default function UnauthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: unauthenticatedColors.background },
        headerStyle: {
          backgroundColor: unauthenticatedColors.surface,
        },
        headerTintColor: unauthenticatedColors.foreground,
        statusBarStyle: "light",
      }}
    />
  );
}