import Button from "@/src/components/button";
import Input from "@/src/components/input";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ImagePlus, X } from "lucide-react-native";

const POSTS_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

export default function Create() {
  const params = useLocalSearchParams<{ editId?: string | string[] }>();
  const editId = Array.isArray(params.editId) ? params.editId[0] : params.editId;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [loadingPost, setLoadingPost] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editId) return;

    let active = true;
    const loadPost = async () => {
      try {
        const { data } = await axios.get<{
          name?: string;
          description?: string;
          image?: string;
          mediaUrl?: string;
          mediaType?: string;
        }>(`${POSTS_URL}/${encodeURIComponent(editId)}`);
        if (!active) return;

        const url = data.mediaUrl || data.image || "";
        setName(data.name || "");
        setDescription(data.description || "");
        setMediaType(data.mediaType === "video" ? "video" : "image");
        if (url.startsWith("file://")) {
          setSelectedImageUri(url);
          setMediaUrl("");
        } else {
          setMediaUrl(url);
        }
      } catch {
        if (active) setError("Could not load this post for editing. Please try again.");
      } finally {
        if (active) setLoadingPost(false);
      }
    };

    void loadPost();
    return () => {
      active = false;
    };
  }, [editId]);

  const pickImage = async () => {
    try {
      setError("");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
        setMediaUrl("");
      }
    } catch {
      setError("Could not open your photo library. Please try again.");
    }
  };

  const createPost = async () => {
    const url = mediaUrl.trim();
    const imageUri = mediaType === "image" ? selectedImageUri : null;
    const selectedMedia = imageUri || url;

    if (!name.trim() || !description.trim() || !selectedMedia) {
      setError("Add a name, caption, and photo or media URL before posting.");
      return;
    }
    if (!imageUri && !/^https?:\/\/\S+$/i.test(url)) {
      setError("Enter a valid public URL for your picture or video.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const postData = {
        name: name.trim(),
        description: description.trim(),
        image: selectedMedia,
        mediaUrl: selectedMedia,
        mediaType,
      };
      if (editId) {
        await axios.put(
          `${POSTS_URL}/${encodeURIComponent(editId)}`,
          postData,
        );
      } else {
        await axios.post(POSTS_URL, postData);
      }
      router.back();
    } catch {
      setError(
        editId
          ? "Could not update your post. Please try again."
          : "Could not publish your post. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, gap: 16, padding: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold text-slate-900">
        {editId ? "Edit post" : "Create a post"}
      </Text>
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />
      <Input
        label="Caption"
        value={description}
        onChangeText={setDescription}
        placeholder="Write something..."
        multiline
      />
      <View>
        <Text className="mb-2 text-slate-900">Media type</Text>
        <View className="flex-row gap-3">
          {(["image", "video"] as const).map((type) => (
            <Pressable
              key={type}
              accessibilityRole="button"
              accessibilityState={{ selected: mediaType === type }}
              onPress={() => {
                setMediaType(type);
                if (type === "video") setSelectedImageUri(null);
              }}
              className={`rounded-full border px-5 py-2 ${
                mediaType === type
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              <Text
                className={`font-semibold capitalize ${
                  mediaType === type ? "text-white" : "text-slate-700"
                }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {mediaType === "image" && (
        <View className="gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose a photo from your phone"
            onPress={pickImage}
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-50"
          >
            <ImagePlus color="#4f46e5" size={20} />
            <Text className="font-semibold text-indigo-700">
              {selectedImageUri ? "Choose a different photo" : "Choose from phone"}
            </Text>
          </Pressable>
          {selectedImageUri ? (
            <View>
              <Image
                source={{ uri: selectedImageUri }}
                accessibilityLabel="Selected post photo"
                resizeMode="cover"
                className="h-56 w-full rounded-xl"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove selected photo"
                onPress={() => setSelectedImageUri(null)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-2"
              >
                <X color="#fff" size={18} />
              </Pressable>
            </View>
          ) : null}
          <Text className="text-center text-sm text-slate-500">
            Or use a public photo URL instead.
          </Text>
        </View>
      )}
      <Input
        label={mediaType === "image" ? "Picture URL" : "Video URL"}
        value={mediaUrl}
        onChangeText={(value) => {
          setMediaUrl(value);
          if (value) setSelectedImageUri(null);
        }}
        placeholder={
          mediaType === "image"
            ? "https://example.com/photo.jpg"
            : "https://example.com/video.mp4"
        }
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text className="text-sm text-slate-500">
        Phone photos are selected locally and aren’t uploaded by the current
        post service. Use a public URL if the image needs to be visible on
        other devices.
      </Text>
      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
      <Button
        label={
          saving
            ? editId
              ? "Saving..."
              : "Posting..."
            : editId
              ? "Save Changes"
              : "Create Post"
        }
        onPress={createPost}
        disabled={saving || loadingPost}
      />
    </ScrollView>
  );
}