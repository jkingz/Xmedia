import { Loader } from '@/components/Loader';
import NotificationItem from '@/components/NotificationItem';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/notifications.styles';
import { useQuery } from 'convex/react';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const Notifications = () => {
  const notifications = useQuery(api.notifications.getNotifications);
  if (notifications === undefined) {
    return <Loader />;
  }
  if (notifications.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="color-green-500 text-3xl">No notifications yet</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
      />
    </View>
  );
};

export default Notifications;
