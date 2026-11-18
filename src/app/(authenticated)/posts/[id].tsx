import PostMedia from "@/src/components/post-media";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  image?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

export default function PostById() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const [product, setProduct] = useState<ProductProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProductById = useCallback(async () => {
    if (!postId) {
      setError("This post could not be found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get<ProductProps>(
        `https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items/${postId}`,
      );
      setProduct(data);
    } catch {
      setError("Could not load this post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      void getProductById();
    }, [getProductById]),
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-center text-slate-600">
          {error || "This post could not be found."}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <PostMedia
        uri={
          product.mediaUrl ||
          product.image ||
          `https://picsum.photos/seed/${encodeURIComponent(product.id)}/600/400`
        }
        mediaType={product.mediaType === "video" ? "video" : "image"}
        height={320}
      />
      <View className="gap-2 p-2">
        <Text className="text-xl font-bold">{product.name}</Text>
        <Text className="text-sm text-gray-700">{product.description}</Text>
      </View>
    </View>
  );
}