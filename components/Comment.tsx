import { Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/feed.styles';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

interface Comment {
  _id: Id<'comments'>;
  _creationTime: number;
  userId: Id<'users'>;
  postId: Id<'posts'>;
  content: string;
  user: {
    fullname: string | undefined;
    image: string | undefined;
  };
}

const Comment = ({ comment }: { comment: Comment }) => {
  return (
    <SafeAreaView>
      <View style={styles.commentContainer}>
        <Image
          source={{ uri: comment.user.image }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
          <Text style={styles.commentText}>{comment.content} </Text>
          <Text style={styles.commentTime}>
            {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Comment;
