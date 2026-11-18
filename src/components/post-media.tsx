import { Image } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

type Props = {
  uri: string;
  mediaType: "image" | "video";
  height?: number;
};

export default function PostMedia({ uri, mediaType, height = 260 }: Props) {
  if (mediaType === "video") {
    return <PostVideo uri={uri} height={height} />;
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: "100%", height }}
      resizeMode="cover"
    />
  );
}

function PostVideo({ uri, height }: { uri: string; height: number }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", height, backgroundColor: "#0f172a" }}
      contentFit="cover"
      nativeControls
    />
  );
}
