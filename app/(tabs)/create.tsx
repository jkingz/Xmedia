import COLORS from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/create.styles';
import { useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation } from 'convex/react';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const createScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isSharing, setIsSharing] = React.useState(false);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const pickImage = async () => {
    console.log('Image picker initiated');
    // Implement image picker logic here
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: true,
      base64: true,
    });
    // check if user cancelled
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={COLORS.primary}
            ></Ionicons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }}></View>
        </View>
        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons
            name="image-outline"
            size={48}
            color={COLORS.grey}
          ></Ionicons>
          <Text style={styles.emptyImageText}>Select an image to share</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    console.log('Share button pressed');
    // check if selectedImage is null
    if (!selectedImage) return;

    try {
      setIsSharing(true);
      // Implement share logic here
      const uploadUrl = await generateUploadUrl();
      console.log('Upload URL:', uploadUrl);
      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: 'POST',
          mimeType: 'image/jpeg',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        },
      );
      // check updload result
      if (uploadResult.status !== 200) throw new Error('Upload failed');

      const { storageId } = JSON.parse(uploadResult.body);

      // call create post mutation
      const post = await createPost({ storageId, caption });
      console.log('Post created:', post);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption('');
            }}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            ></Ionicons>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isSharing && styles.shareButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={() => handleShare()}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={COLORS.white}
                ></Ionicons>
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl || ''}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  value={caption}
                  onChangeText={(text) => setCaption(text)}
                  multiline
                  maxLength={100}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default createScreen;
