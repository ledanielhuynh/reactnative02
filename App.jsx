import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import ToDoCard from './components/ToDoCard';

import "./global.css";

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk: require('./assets/SpaceGrotesk/SpaceGrotesk-Regular.ttf'),
    SpaceGroteskBold: require('./assets/SpaceGrotesk/SpaceGrotesk-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [originalList, setOriginalList] = useState([]);

  useEffect(() => {
    setTodoList([]);
    setOriginalList([]);
  }, []);

  const addTodoItem = (image, title, description, dueDate) => {
    const newTodo = {
      id: Date.now().toString(),
      image,
      title,
      description,
      dueDate: new Date(dueDate),
    };
    setTodoList((prevList) => {
      const updatedList = [...prevList, newTodo];
      setOriginalList(updatedList);
      return updatedList;
    });
  };

  const openEditModal = (todo) => {
    setCurrentTodo(todo);
    setEditModalVisible(true);
  };

  const saveEditedTodo = (id, updatedTitle, updatedDescription, updatedDueDate) => {
    setTodoList((prevList) => {
      const updatedList = prevList.map(todo => 
        todo.id === id 
        ? { ...todo, title: updatedTitle, description: updatedDescription, dueDate: new Date(updatedDueDate) }
        : todo
      );
      setOriginalList(updatedList);
      return filterActive 
        ? [...updatedList].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) 
        : updatedList;
    });
    setEditModalVisible(false);
  };

  const onDelete = (id) => {
    setTodoList((prevList) => {
      const updatedList = prevList.filter(todo => todo.id !== id);
      setOriginalList(updatedList);
      return updatedList;
    });
    setEditModalVisible(false);
  };

  const toggleFilter = () => {
    setFilterActive((prev) => !prev);
    setTodoList((prevList) => {
      return !filterActive
        ? [...prevList].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        : [...originalList];
    });
  };

  return (
    <View className="flex-1 px-6 pt-20 pb-10 bg-zinc-900 font-space justify-between gap-5">
      <StatusBar backgroundColor="black" style="light" />
      <View className="flex flex-col gap-5">
        <Text className="text-white text-3xl font-space-bold">To-Do List</Text>
      </View>

      <View className='flex flex-row items-center gap-4'>
        <Text className='text-white font-space-bold'>Sort by</Text>
        <TouchableOpacity 
          onPress={toggleFilter}
          className={`justify-center items-center rounded-full px-6 py-2 ${
            filterActive 
              ? 'bg-white'
              : 'bg-transparent border border-white'
          }`}
        >
          <Text className={`font-space-bold ${
            filterActive ? 'text-zinc-900' : 'text-white'
          }`}>
            Date
          </Text>
        </TouchableOpacity>
      </View>

      {todoList.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <Text className="text-white font-space">No tasks yet. Start by adding one!</Text>
        </View>
      ) : (
        <FlatList
          data={todoList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ToDoCard
              image={item.image}
              title={item.title}
              description={item.description}
              dueDate={item.dueDate}
              onEdit={() => openEditModal(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <TouchableOpacity 
        className="bg-white justify-center items-center rounded-full p-6"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-zinc-900 font-space-bold">+ Create new task</Text>
      </TouchableOpacity>

      <CreateModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAddTodo={addTodoItem} 
      />

      <EditModal
        visible={editModalVisible && currentTodo !== null}
        onClose={() => setEditModalVisible(false)}
        title={currentTodo?.title || ""}
        description={currentTodo?.description || ""}
        dueDate={currentTodo?.dueDate || new Date().toISOString()}
        imageUri={currentTodo?.image || ""}
        onSave={(updatedTitle, updatedDescription, updatedDueDate) => 
          saveEditedTodo(currentTodo.id, updatedTitle, updatedDescription, updatedDueDate)
        }
        onDelete={() => onDelete(currentTodo.id)}
      />
    </View>
  );
}
