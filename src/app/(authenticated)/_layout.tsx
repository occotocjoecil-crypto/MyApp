import { Stack } from "expo-router";
import React from "react";

export default function AuthenticatedLayout() {
  return React.createElement(Stack, { screenOptions: { headerShown: false } });
}