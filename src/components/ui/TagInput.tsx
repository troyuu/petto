import React, { useCallback, useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { X } from 'lucide-react-native';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Add tag...',
  label,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addTag = useCallback(
    (rawTag: string) => {
      const tag = rawTag.trim();
      if (tag.length > 0 && !tags.includes(tag)) {
        onTagsChange([...tags, tag]);
      }
      setInputValue('');
    },
    [tags, onTagsChange],
  );

  const removeTag = useCallback(
    (index: number) => {
      const updated = tags.filter((_, i) => i !== index);
      onTagsChange(updated);
    },
    [tags, onTagsChange],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      if (text.endsWith(',')) {
        addTag(text.slice(0, -1));
      } else {
        setInputValue(text);
      }
    },
    [addTag],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    },
    [inputValue, tags.length, removeTag],
  );

  const handleSubmitEditing = useCallback(() => {
    addTag(inputValue);
  }, [inputValue, addTag]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const borderClass = isFocused
    ? 'border-primary-500 dark:border-primary-400'
    : 'border-gray-200 dark:border-gray-600';

  return (
    <View className={className}>
      {label && (
        <Text className="text-sm font-medium text-text-primary dark:text-text-dark mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row flex-wrap items-center border-2 rounded-xl bg-white dark:bg-dark-surface px-2 py-1.5 gap-1.5 ${borderClass}`}
      >
        {tags.map((tag, index) => (
          <View
            key={`${tag}-${index}`}
            className="flex-row items-center bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1 gap-1"
          >
            <Text className="text-sm text-primary-700 dark:text-primary-200">
              {tag}
            </Text>
            <Pressable
              onPress={() => removeTag(index)}
              accessibilityLabel={`Remove ${tag}`}
              accessibilityRole="button"
              hitSlop={8}
            >
              <X size={14} color="#2D6A4F" />
            </Pressable>
          </View>
        ))}
        <TextInput
          value={inputValue}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
          blurOnSubmit={false}
          accessibilityLabel={label ?? 'Tag input'}
          accessibilityHint="Type and press enter or comma to add a tag"
          className="flex-1 min-w-[80px] text-base text-text-primary dark:text-text-dark py-1"
        />
      </View>
    </View>
  );
};

export default React.memo(TagInput);
