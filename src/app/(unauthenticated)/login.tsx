import { Link, useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessagesSquare,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-10">
            <View className="mb-8 items-center">
              <View className="mb-5 h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                <MessagesSquare color="#FFFFFF" size={26} strokeWidth={2.2} />
              </View>
              <Text className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                THREAD
              </Text>
              <Text className="mt-4 text-center text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </Text>
              <Text className="mt-2 text-center text-base text-slate-500">
                Your conversations are waiting.
              </Text>
            </View>

            <View className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70">
              <Text className="mb-2 ml-1 text-sm font-semibold text-slate-700">
                Email address
              </Text>
              <View className="mb-5 h-14 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <Mail color="#94A3B8" size={19} />
                <TextInput
                  accessibilityLabel="Email address"
                  className="ml-3 flex-1 text-base text-slate-900"
                  placeholder="you@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                />
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="ml-1 text-sm font-semibold text-slate-700">
                  Password
                </Text>
              </View>
              <View className="mb-7 h-14 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <LockKeyhole color="#94A3B8" size={19} />
                <TextInput
                  accessibilityLabel="Password"
                  className="ml-3 flex-1 text-base text-slate-900"
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!passwordVisible}
                  autoComplete="current-password"
                  textContentType="password"
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  hitSlop={10}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff color="#94A3B8" size={19} />
                  ) : (
                    <Eye color="#94A3B8" size={19} />
                  )}
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 active:opacity-80"
                onPress={() => router.replace("/home")}
              >
                <Text className="text-base font-bold text-white">
                  Log in
                </Text>
              </Pressable>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-sm text-slate-500">
                  New around here?{" "}
                </Text>
                <Link
                  href="/register"
                  className="text-sm font-bold text-indigo-600"
                >
                  Register an account
                </Link>
              </View>
            </View>

            <Text className="mt-7 text-center text-xs text-slate-400">
              Stay close to every conversation.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
