import { Image, Text, View } from "react-native";

type Props = {
  name: string;
  description: string;
  image: string;
  accent?: string;
};

export default function Card({
  name,
  description,
  image,
  accent = "#4f46e5",
}: Props) {
  return (
    <View className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <Image
        source={{ uri: image }}
        className="h-44 w-full"
        resizeMode="cover"
      />
      <View className="px-4 pb-4 pt-3">
        <View
          className="mb-2 w-16 rounded-full px-2 py-1"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <Text
            className="text-center text-[10px] font-bold uppercase tracking-[1.2px]"
            style={{ color: accent }}
          >
            Featured
          </Text>
        </View>
        <Text className="text-xl font-bold text-slate-900">{name}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-600">
          {description}
        </Text>
      </View>
    </View>
  );
}