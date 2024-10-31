import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditModal({ 
  visible, 
  onClose, 
  title: initialTitle, 
  description: initialDescription, 
  dueDate: initialDueDate, 
  imageUri: initialImageUri,
  onSave, 
  onDelete 
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ? new Date(initialDueDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState(initialImageUri);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(new Date(initialDueDate));
    setImageUri(initialImageUri);
  }, [initialTitle, initialDescription, initialDueDate, initialImageUri]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Title Required', 'Please enter a title for the task.');
      return;
    }
    onSave(title, description, dueDate.toISOString(), imageUri);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', style: 'destructive', 
          onPress: () => {
            onDelete();
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent={true}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center items-center bg-black/80 bg-opacity-50'>
        <View className='w-5/6 p-6 bg-zinc-800 rounded-xl gap-4'>

          <Text className='text-2xl text-white font-space-bold pb-3'>Edit Task</Text>

          <TextInput 
            placeholder='Title' 
            value={title} 
            onChangeText={setTitle} 
            className='rounded-xl p-3 px-5 bg-zinc-700 font-space-bold text-white'
            placeholderTextColor='gray'
          />

          <TextInput 
            placeholder='Description' 
            value={description} 
            onChangeText={setDescription} 
            className='rounded-xl p-3 px-5 bg-zinc-700 font-space-bold text-white'
            placeholderTextColor='gray'
          />
          
          <View className='flex flex-row gap-3'>
            <TouchableOpacity 
              onPress={pickImage} 
              className="flex-1 items-center rounded-xl p-4 bg-zinc-700" 
            >
              <Text className="text-white font-space-bold">
                {imageUri ? "Change Image" : "Choose Image"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="flex-1 items-center rounded-xl p-4 bg-zinc-700"
            >
              <Text className="text-white font-space-bold">
                {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )}

          <View className='gap-3 pt-3'>

            <TouchableOpacity 
              className="bg-white justify-center items-center rounded-full p-4"
              onPress={handleSave}
            >
              <Text className="text-zinc-900 font-space-bold">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-red-500 justify-center items-center rounded-full p-4"
              onPress={handleDelete}
            >
              <Text className="text-white font-space-bold">Delete</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  );
}
