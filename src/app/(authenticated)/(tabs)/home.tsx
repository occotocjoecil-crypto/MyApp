import PostMedia from "@/src/components/post-media";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { Heart, MessageCircle, Plus, Send, X } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POSTS_URL =
  "https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items";

type FeedPost = {
  id: string;
  apiId?: string;
  username: string;
  avatar: number;
  text: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  likes: number;
  comments: number;
};

type ApiPost = {
  id?: string | number;
  createdAt?: string;
  name?: string;
  description?: string;
  image?: string;
  mediaUrl?: string;
  mediaType?: string;
};

type FeedComment = {
  id: string;
  text: string;
};

const POSTS: FeedPost[] = [
  {
    id: "1",
    username: "Mark niel pilo",
    avatar: 1,
    text: "ayh shitt sarap 🌅",
    mediaUrl: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t51.82787-15/862320647_18034762235856522_5050111073563954032_n.webp?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHQ4GsQLld61NqiskAeZ2gKlDsl-edOoFeUOyX5506gVypnoQ-TYrH3yU1_Gq53R1eH1d3lCzyGmBhOTTSvVCIw&_nc_ohc=dG0WcfqaIJcQ7kNvwF2IKdu&_nc_oc=Ado5Bz8x3UEmXglxwKtPiPY_O86yonJCn1JlX5O9SPC9OdXutVpNveR0T-PGuzlDN2Y&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=yc1tuBSnFPzS8AGnMtl6Qw&_nc_ss=7b2a8&oh=00_AQQqLVajQEckLiZPwUlowvkxrXcDHZ2I5MBm3nTTrDOSbg&oe=6AFF3019 ",
    mediaType: "image",
    likes: 120,
    comments: 18,
  },
  {
    id: "2",
    username: "Jules Vincent Oco",
    avatar: 2,
    text: "askyon ka hot ko!!",
    mediaUrl: "https://www.facebook.com/photo.php?fbid=2575878432850231&set=pb.100012842977059.-2207520000&type=3&theater",
    mediaType: "image",
    likes: 89,
    comments: 12,
  },
  {
    id: "3",
    username: "Venice Jaira Juanitas",
    avatar: 3,
    text: "VALO palag!",
    mediaUrl: "https://www.facebook.com/photo.php?fbid=1980735645332255&set=t.100001875162865&type=3",
    mediaType: "image",
    likes: 246,
    comments: 31,
  },
  {
    id: "4",
    username: "Daisy Samuel",
    avatar: 4,
    text: "Esmeringjoy ",
    mediaUrl: "https://picsum.photos/seed/44/600/400",
    mediaType: "image",
    likes: 154,
    comments: 24,
  },
  {
    id: "5",
    username: "Anica Ella Ebunia",
    avatar: 5,
    text: "have a bless day guys ",
    mediaUrl: "https://picsum.photos/seed/55/600/400",
    mediaType: "image",
    likes: 204,
    comments: 27,
  },
];

export default function Home() {
  const [apiPosts, setApiPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postComments, setPostComments] = useState<
    Record<string, FeedComment[]>
  >({});
  const [commentPost, setCommentPost] = useState<FeedPost | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get<ApiPost[]>(POSTS_URL, {
        params: { sortBy: "createdAt", order: "desc" },
      });
      setApiPosts(
        [...data]
          .sort((a, b) => {
            const dateA = Date.parse(a.createdAt ?? "");
            const dateB = Date.parse(b.createdAt ?? "");
            if (
              Number.isFinite(dateA) &&
              Number.isFinite(dateB) &&
              dateA !== dateB
            ) {
              return dateB - dateA;
            }

            const idA = Number(a.id);
            const idB = Number(b.id);
            if (Number.isFinite(idA) && Number.isFinite(idB)) {
              return idB - idA;
            }
            return 0;
          })
          .map((post, index) => {
            const mediaUrl =
              post.mediaUrl ||
              post.image ||
              `https://picsum.photos/seed/${encodeURIComponent(String(post.id ?? index))}/600/400`;

            return {
              id: `api-${post.id ?? index}`,
              apiId: post.id == null ? undefined : String(post.id),
              username: post.name || "New member",
              avatar: 12,
              text: post.description || "",
              mediaUrl,
              mediaType:
                post.mediaType === "video" && (post.mediaUrl || post.image)
                  ? "video"
                  : "image",
              likes: 0,
              comments: 0,
            };
          }),
      );
    } catch {
      setError("New posts could not be loaded. Pull down to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPosts();
    }, [loadPosts]),
  );

  const deletePost = (post: FeedPost) => {
    if (!post.apiId) return;
    const postId = post.apiId;

    Alert.alert("Delete post?", "This post will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${POSTS_URL}/${encodeURIComponent(postId)}`);
            await loadPosts();
          } catch {
            Alert.alert("Could not delete post", "Please try again.");
          }
        },
      },
    ]);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((current) => ({
      ...current,
      [postId]: !current[postId],
    }));
  };

  const addComment = () => {
    const text = commentDraft.trim();
    if (!commentPost || !text) return;

    setPostComments((current) => ({
      ...current,
      [commentPost.id]: [
        ...(current[commentPost.id] ?? []),
        { id: `${Date.now()}`, text },
      ],
    }));
    setCommentDraft("");
  };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 24,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 14 }}>
        <Image
          source={{ uri: `https://i.pravatar.cc/100?img=${item.avatar}` }}
          style={{ width: 42, height: 42, borderRadius: 21 }}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontWeight: "700", color: "#0f172a", fontSize: 15 }}>
            {item.username}
          </Text>
          <Text style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {item.id.startsWith("api-") ? "Just now" : "2 hours ago"}
          </Text>
        </View>
        {item.apiId ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.username}'s post`}
              onPress={() =>
                router.push({
                  pathname: "/posts/create",
                  params: { editId: item.apiId },
                })
              }
            >
              <Text style={{ color: "#4f46e5", fontWeight: "600" }}>Edit</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.username}'s post`}
              onPress={() => deletePost(item)}
            >
              <Text style={{ color: "#dc2626", fontWeight: "600" }}>Delete</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={{ fontSize: 20, color: "#94a3b8" }}>•••</Text>
        )}
      </View>

      {item.text ? (
        <Text
          style={{
            paddingHorizontal: 16,
            paddingBottom: 12,
            color: "#334155",
            fontSize: 15,
          }}
        >
          {item.text}
        </Text>
      ) : null}

      <PostMedia uri={item.mediaUrl} mediaType={item.mediaType} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              likedPosts[item.id] ? "Unlike post" : "Like post"
            }
            accessibilityState={{ selected: Boolean(likedPosts[item.id]) }}
            onPress={() => toggleLike(item.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Heart
              color={likedPosts[item.id] ? "#ef4444" : "#64748b"}
              size={18}
              fill={likedPosts[item.id] ? "#ef4444" : "transparent"}
            />
            <Text style={{ color: "#475569", fontWeight: "600" }}>
              {item.likes + (likedPosts[item.id] ? 1 : 0)}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View comments for ${item.username}'s post`}
            onPress={() => {
              setCommentDraft("");
              setCommentPost(item);
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <MessageCircle color="#475569" size={18} />
            <Text style={{ color: "#475569", fontWeight: "600" }}>
              {item.comments + (postComments[item.id]?.length ?? 0)}
            </Text>
          </Pressable>
        </View>
        <Send color="#4f46e5" size={18} />
      </View>
    </View>
  );

  const posts = [...apiPosts, ...POSTS];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }} edges={["top"]}>
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#4f46e5" }}>
          THREADS
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create a post"
          onPress={() => router.push("/posts/create")}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#4f46e5",
          }}
        >
          <Plus color="#fff" size={23} />
        </Pressable>
      </View>

      <FlatList<FeedPost>
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 28 }}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPosts} />
        }
        ListHeaderComponent={
          error ? (
            <Text style={{ color: "#dc2626", paddingBottom: 12 }}>{error}</Text>
          ) : undefined
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 32 }} />
          ) : undefined
        }
      />

      <Modal
        visible={commentPost !== null}
        animationType="slide"
        onRequestClose={() => setCommentPost(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#e2e8f0",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>
                Comments
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close comments"
                onPress={() => setCommentPost(null)}
                hitSlop={10}
              >
                <X color="#475569" size={24} />
              </Pressable>
            </View>

            <FlatList
              data={
                commentPost ? (postComments[commentPost.id] ?? []) : []
              }
              keyExtractor={(comment) => comment.id}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
                gap: 14,
              }}
              ListEmptyComponent={
                <Text
                  style={{
                    marginTop: 32,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No new comments yet. Be the first to comment.
                </Text>
              }
              renderItem={({ item: comment }) => (
                <View
                  style={{
                    borderRadius: 16,
                    backgroundColor: "#f1f5f9",
                    padding: 14,
                  }}
                >
                  <Text style={{ color: "#0f172a", fontWeight: "700" }}>
                    You
                  </Text>
                  <Text style={{ color: "#334155", marginTop: 4 }}>
                    {comment.text}
                  </Text>
                </View>
              )}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: "#e2e8f0",
              }}
            >
              <TextInput
                accessibilityLabel="Write a comment"
                value={commentDraft}
                onChangeText={setCommentDraft}
                onSubmitEditing={addComment}
                returnKeyType="send"
                placeholder="Write a comment..."
                style={{
                  minHeight: 46,
                  flex: 1,
                  borderRadius: 23,
                  backgroundColor: "#f1f5f9",
                  paddingHorizontal: 16,
                  color: "#0f172a",
                }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Post comment"
                accessibilityState={{ disabled: !commentDraft.trim() }}
                disabled={!commentDraft.trim()}
                onPress={addComment}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 22,
                  backgroundColor: commentDraft.trim() ? "#4f46e5" : "#cbd5e1",
                }}
              >
                <Send color="#fff" size={18} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}