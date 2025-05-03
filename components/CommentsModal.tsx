import COLORS from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/feed.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from 'convex/react';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Comment from './Comment';
import { Loader } from './Loader';

type CommentsModalProps = {
  visible: boolean;
  postId: Id<'posts'>;
  onClose: () => void;
  onCommentAdded: () => void;
};

const CommentsModal = ({
  visible,
  postId,
  onClose,
  onCommentAdded,
}: CommentsModalProps) => {
  const [newComments, setNewComments] = React.useState('');
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  // handle add comment
  const handleAddComment = async () => {
    if (newComments.trim() === '') {
      return;
    }
    await addComment({
      postId,
      content: newComments,
    });
    setNewComments('');
    onCommentAdded();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }}></View>
        </View>
        {/* Comments */}
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
          />
        )}
        <View style={styles.commentInput}>
          <TextInput
            value={newComments}
            onChangeText={setNewComments}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComments.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !newComments.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentsModal;
