import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateModal({ visible, onClose, onAddTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleAddTodo = () => {
    if (title.trim() === '') {
      Alert.alert('Title Required', 'Please enter a title for the task.');
      return;
    }
    onAddTodo(imageUri, title, description, dueDate.toISOString());
    resetFields();
    onClose();
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setImageUri(null);
  };

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent={true}
      onRequestClose={() => {
        resetFields();
        onClose();
      }}
    >
      <View className='flex-1 justify-center items-center bg-black/80 bg-opacity-50'>
        <View className='w-5/6 p-6 bg-zinc-800 rounded-xl gap-4'>

          <Text className='text-2xl text-white font-space-bold pb-3'>Create New Task</Text>

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
              <Text className="text-white font-space-bold">Choose Image</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="flex-1 items-center rounded-xl p-4 bg-zinc-700"
            >
              <Text className="text-white font-space-bold">
                {dueDate ? dueDate.toLocaleDateString() : 'Select Date'}
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
              onPress={handleAddTodo} 
            >
              <Text className="text-zinc-900 font-space-bold">Create Task</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-transparent justify-center items-center rounded-full p-4 border border-white"
              onPress={() => {
                resetFields();
                onClose();
              }} 
            >
              <Text className="text-white font-space-bold">Close</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  );
}
