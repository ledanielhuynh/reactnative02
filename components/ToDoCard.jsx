import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function ToDoCard({ image, title, description, dueDate, onEdit }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [urgency, setUrgency] = useState(3);

  const urgencyColour = urgency === 1 ? '#E95A4A' : urgency === 2 ? '#E6C15A' : '#7ADEA0';

  const formatDateToReadable = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const suffix = 
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";

    return `${day}${suffix} ${month}`;
  };

  const formattedDueDate = useMemo(() => formatDateToReadable(dueDate), [dueDate]);

  useEffect(() => {
    const calculateUrgency = () => {
      const now = new Date();
      const differenceInMilliseconds = new Date(dueDate) - now;
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      if (differenceInDays < 1) {
        setUrgency(1);
      } else if (differenceInDays < 7) {
        setUrgency(2);
      } else {
        setUrgency(3);
      }
    };

    calculateUrgency();
  }, [dueDate]);

  const toggleCompletion = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <View className="flex flex-row gap-2 items-center">
      <View className="w-12 h-12 items-center justify-center">
        <TouchableOpacity onPress={toggleCompletion}>
          <Feather 
            name={isCompleted ? "check-square" : "square"} 
            size={24} 
            color={isCompleted ? "gray" : "white"} 
          />
        </TouchableOpacity>
      </View>
      
      <View 
        className="flex-1 flex-row gap-3 bg-zinc-700 rounded-xl shadow-md p-4 items-center"
        style={{ opacity: isCompleted ? 0.3 : 1 }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 80, height: 80, borderRadius: 10 }}
          />
        ) : (
          <View className="w-20 h-20 rounded-lg bg-zinc-100"></View>
        )}
        <View className="flex-1">
          <Text className={`text-white font-space-bold text-lg ${isCompleted ? "line-through" : ""}`}>
            {title}
          </Text>
          <Text className={`text-zinc-400 font-space ${isCompleted ? "line-through" : ""}`}>
            {description}
          </Text>
          <View className="flex flex-row items-center gap-1 pt-1">
            <Feather name="clock" size={15} color={urgencyColour} />
            <Text style={{ color: urgencyColour }} className="font-space">
              {formattedDueDate}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onEdit}>
          <Feather 
            name="edit" 
            size={24} 
            color="gray"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
