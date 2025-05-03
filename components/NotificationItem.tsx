import COLORS from '@/constants/theme';
import { Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/notifications.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type NotificationProps = {
  notification: {
    receiverId: string;
    message: string;
  };
  sender: {
    _id: Id<'users'>;
    username: string;
    image: string;
  };
  post?: {
    imageUrl?: string;
    caption?: string;
  };
};

const NotificationItem = (notification: any) => {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        {/* Todo route to user profile */}
        <Link href={`/notifications`} asChild>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{ uri: notification.sender.image }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
              cachePolicy={'memory-disk'}
            />
            <View style={styles.iconBadge}>
              {notification.type === 'like' ? (
                <Ionicons name="heart" size={18} color={COLORS.primary} />
              ) : notification.type === 'follow' ? (
                <Ionicons name="person-add" size={18} color={COLORS.white} />
              ) : (
                <Ionicons name="chatbubble" size={18} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.notificationInfo}>
          {/* Fix later */}
          <Link href={`/notifications`} asChild>
            <TouchableOpacity>
              <Text style={styles.username}>
                {notification.sender.username}
              </Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.action}>
            {notification.type === 'follow'
              ? 'started following you'
              : notification.type === 'like'
                ? 'liked your post'
                : `commented: ${notification.comments}`}
          </Text>
          <Text style={styles.timeAgo}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
      {notification && (
        <Image
          source={notification.post.imageUrl}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
          cachePolicy={'memory-disk'}
        />
      )}
    </View>
  );
};

export default NotificationItem;
