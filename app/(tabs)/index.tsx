import { Loader } from '@/components/Loader';
import Posts from '@/components/Posts';
import Story from '@/components/Story';
import STORIES from '@/constants/stories';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { useAuth } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const App = () => {
  const { signOut } = useAuth();

  const posts = useQuery(api.posts.feedPosts);
  console.log(posts);
  if (posts === undefined) return <Loader />;
  if (posts.length === 0)
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="color-green-500 text-3xl">No posts yet</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xmedia</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* STORIES SECTION */}
      <FlatList
        style={styles.storiesContainer}
        data={STORIES}
        renderItem={({ item }) => <Story key={item.id} story={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* POST SECTION */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <Posts key={item._id} post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
};
export default App;
