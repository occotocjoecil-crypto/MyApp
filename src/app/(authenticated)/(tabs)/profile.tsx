import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROFILE_STORAGE_KEY = "thread-profile";
const DEFAULT_AVATAR = "https://i.pravatar.cc/200?img=12";

type ProfileData = {
  name: string;
  username: string;
  email: string;
  course: string;
  location: string;
  phone: string;
  avatarUri: string;
};

const DEFAULT_PROFILE: ProfileData = {
  name: "Joecil Otoc",
  username: "Joe_Brain",
  email: "occ.otoc.joecil@gmail.com",
  course: "BSIT - 3A",
  location: "Zone 5, Patag, Opol, Mis.Or",
  phone: "+63 9773576115",
  avatarUri: "",
};

const PROFILE_FIELDS: {
  key: keyof Omit<ProfileData, "avatarUri">;
  label: string;
  icon: typeof Mail;
  keyboardType?: "default" | "email-address" | "phone-pad";
}[] = [
  { key: "name", label: "Name", icon: Pencil },
  { key: "username", label: "Username", icon: Pencil },
  { key: "email", label: "Email", icon: Mail, keyboardType: "email-address" },
  { key: "course", label: "Course", icon: GraduationCap },
  { key: "location", label: "Location", icon: MapPin },
  { key: "phone", label: "Phone", icon: Phone, keyboardType: "phone-pad" },
];

function isProfileData(value: unknown): value is ProfileData {
  if (!value || typeof value !== "object") return false;
  return Object.keys(DEFAULT_PROFILE).every(
    (key) => typeof (value as Record<string, unknown>)[key] === "string",
  );
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draft, setDraft] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = useState<0 | 1 | 2>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (!active || !storedProfile) return;

        const parsed: unknown = JSON.parse(storedProfile);
        if (isProfileData(parsed)) {
          setProfile(parsed);
          setDraft(parsed);
        }
      } catch {
        if (active) setError("Could not load your saved profile.");
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const openEditor = () => {
    setDraft(profile);
    setError("");
    setEditing(true);
  };

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setDraft((current) => ({ ...current, avatarUri: result.assets[0].uri }));
      }
    } catch {
      setError("Could not open your photo library. Please try again.");
    }
  };

  const saveProfile = async () => {
    if (!draft.name.trim() || !draft.username.trim()) {
      setError("Name and username are required.");
      return;
    }

    const updatedProfile = {
      ...draft,
      name: draft.name.trim(),
      username: draft.username.trim().replace(/^@/, ""),
      email: draft.email.trim(),
      course: draft.course.trim(),
      location: draft.location.trim(),
      phone: draft.phone.trim(),
    };

    try {
      setSaving(true);
      setError("");
      await AsyncStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile),
      );
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setEditing(false);
    } catch {
      setError("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    if (logoutConfirmation === 1) {
      setLogoutConfirmation(2);
      return;
    }

    setLogoutConfirmation(0);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "#5a1394",
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: 30,
            paddingBottom: 30,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: profile.avatarUri || DEFAULT_AVATAR }}
            style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#fff" }}
          />
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 18 }}>
            {profile.name}
          </Text>
          <Text style={{ color: "#c7d2fe", fontSize: 15, marginTop: 4 }}>
            @{profile.username}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={openEditor}
            style={{
              backgroundColor: "#fff",
              borderRadius: 999,
              paddingHorizontal: 28,
              paddingVertical: 12,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#4f46e5", fontWeight: "800", fontSize: 14 }}>
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {error && !editing ? (
          <Text style={{ color: "#dc2626", marginHorizontal: 20, marginTop: 16 }}>
            {error}
          </Text>
        ) : null}

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            marginHorizontal: 18,
            marginTop: 22,
            marginBottom: 24,
            padding: 18,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 8 }}>
            Personal Details
          </Text>

          {PROFILE_FIELDS.slice(2).map(({ key, label, icon: Icon }) => (
            <View
              key={label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: key === "phone" ? 0 : 1,
                borderBottomColor: "#e2e8f0",
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: "#eef2ff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} color="#4f46e5" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 15, color: "#1e293b", marginTop: 2 }}>
                  {profile[key]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={() => setLogoutConfirmation(1)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginHorizontal: 18,
          marginBottom: 20,
          minHeight: 52,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#fecaca",
          backgroundColor: "#fff",
        }}
      >
        <LogOut color="#2641dc" size={20} />
        <Text style={{ color: "#264edc", fontSize: 15, fontWeight: "700" }}>
          Log Out
        </Text>
      </Pressable>

      <Modal
        visible={editing}
        animationType="slide"
        onRequestClose={() => setEditing(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: "#0f172a", fontSize: 22, fontWeight: "800" }}>
                Edit Profile
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close profile editor"
                onPress={() => setEditing(false)}
                hitSlop={10}
              >
                <X color="#475569" size={24} />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={{ gap: 16, paddingHorizontal: 20, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
            >
              <Pressable
                accessibilityRole="button"
                onPress={pickAvatar}
                style={{ alignSelf: "center", alignItems: "center", gap: 8 }}
              >
                <Image
                  source={{ uri: draft.avatarUri || DEFAULT_AVATAR }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
                <Text style={{ color: "#4f46e5", fontWeight: "700" }}>
                  Change photo
                </Text>
              </Pressable>

              {PROFILE_FIELDS.map(({ key, label, keyboardType }) => (
                <View key={key} style={{ gap: 6 }}>
                  <Text style={{ color: "#334155", fontWeight: "600" }}>
                    {label}
                  </Text>
                  <TextInput
                    accessibilityLabel={label}
                    value={draft[key]}
                    onChangeText={(value) =>
                      setDraft((current) => ({ ...current, [key]: value }))
                    }
                    autoCapitalize={key === "email" ? "none" : "words"}
                    keyboardType={keyboardType || "default"}
                    style={{
                      minHeight: 48,
                      borderWidth: 1,
                      borderColor: "#cbd5e1",
                      borderRadius: 12,
                      backgroundColor: "#fff",
                      paddingHorizontal: 14,
                      color: "#0f172a",
                    }}
                  />
                </View>
              ))}

              {error ? <Text style={{ color: "#dc2626" }}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={saveProfile}
                style={{
                  minHeight: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  backgroundColor: saving ? "#818cf8" : "#4f46e5",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                  {saving ? "Saving..." : "Save Profile"}
                </Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={logoutConfirmation > 0}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutConfirmation(0)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
          }}
        >
          <View
            accessibilityRole="alert"
            style={{
              gap: 14,
              borderRadius: 24,
              backgroundColor: "#fff",
              padding: 24,
            }}
          >
            <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "800" }}>
              {logoutConfirmation === 1 ? "Log out?" : "Confirm logout"}
            </Text>
            <Text style={{ color: "#475569", fontSize: 15, lineHeight: 22 }}>
              {logoutConfirmation === 1
                ? "You’re about to leave your profile."
                : "Are you sure? You’ll be returned to the login screen."}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={confirmLogout}
              style={{
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                backgroundColor: "#ce1c1c",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                {logoutConfirmation === 1 ? "Continue" : "Yes, log out"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setLogoutConfirmation(0)}
              style={{
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Text style={{ color: "#334155", fontSize: 15, fontWeight: "600" }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
