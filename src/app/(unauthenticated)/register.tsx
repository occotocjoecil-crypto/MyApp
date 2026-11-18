import { Link, useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessagesSquare,
  UserRound,
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

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
          <View className="px-6 py-5">
            <View className="mb-5 items-center">
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                <MessagesSquare color="#FFFFFF" size={21} strokeWidth={2.2} />
              </View>
              <Text className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                THREAD
              </Text>
              <Text className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900">
                Find your people
              </Text>
              <Text className="mt-2 text-center text-sm text-slate-500">
                Start a conversation with your community.
              </Text>
            </View>

            <View className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70">
              <Text className="mb-1 ml-1 text-sm font-semibold text-slate-700">
                Your name
              </Text>
              <View className="mb-3 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <UserRound color="#94A3B8" size={19} />
                <TextInput
                  accessibilityLabel="Your name"
                  className="ml-3 flex-1 text-base text-slate-900"
                  placeholder="Full name"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>

              <Text className="mb-1 ml-1 text-sm font-semibold text-slate-700">
                Email address
              </Text>
              <View className="mb-3 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
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

              <Text className="mb-1 ml-1 text-sm font-semibold text-slate-700">
                Password
              </Text>
              <View className="mb-3 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <LockKeyhole color="#94A3B8" size={19} />
                <TextInput
                  accessibilityLabel="Password"
                  className="ml-3 flex-1 text-base text-slate-900"
                  placeholder="Create a password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!passwordVisible}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="next"
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

              <Text className="mb-1 ml-1 text-sm font-semibold text-slate-700">
                Confirm password
              </Text>
              <View className="mb-5 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <LockKeyhole color="#94A3B8" size={19} />
                <TextInput
                  accessibilityLabel="Confirm password"
                  className="ml-3 flex-1 text-base text-slate-900"
                  placeholder="Enter your password again"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  returnKeyType="done"
                />
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 active:opacity-80"
                onPress={() => router.replace("/home")}
              >
                <Text className="text-base font-bold text-white">
                  Register Account
                </Text>
              </Pressable>

              <View className="mt-5 flex-row justify-center">
                <Text className="text-sm text-slate-500">
                  Already part of the community?{" "}
                </Text>
                <Link
                  href="/login"
                  className="text-sm font-bold text-indigo-600"
                >
                  Log in
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
