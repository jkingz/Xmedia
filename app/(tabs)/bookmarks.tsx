import { Loader } from '@/components/Loader';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const Bookmarks = () => {
  const bookmarks = useQuery(api.bookmarks.getBookmarks);
  if (bookmarks === undefined) {
    return <Loader />;
  }
  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="color-green-500 text-3xl">No bookmarks yet</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ width: '33.33%', padding: 1 }}>
            <Image
              source={{ uri: item.post?.imageUrl }}
              style={{ width: '100%', aspectRatio: 1 }}
              contentFit="cover"
              transition={200}
              cachePolicy={'memory-disk'}
            />
            <Text className='color-green-500' style={styles.post}>{item.post?.caption}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Bookmarks;
