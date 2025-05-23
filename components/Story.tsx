import { styles } from '@/styles/feed.styles';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type StoryProps = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

const Story = ({ story }: { story: StoryProps }) => {
  return (
    <TouchableOpacity style={styles.storyWrapper} className='pb-8'>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
        <Text style={styles.storyUsername} className='pt-2'>{story.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Story;
