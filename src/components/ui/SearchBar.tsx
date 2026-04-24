import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const DEBOUNCE_MS = 300;

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    if (value !== localValue) {
      isExternalUpdate.current = true;
      setLocalValue(value);
    }
    // Only react to external value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChangeText(text);
      }, DEBOUNCE_MS);
    },
    [onChangeText],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onChangeText('');
  }, [onChangeText]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <View
      className={`flex-row items-center h-12 rounded-xl bg-gray-100 dark:bg-dark-surface px-3 ${className}`}
    >
      <View className="mr-2">
        <Search size={20} color="#9CA3AF" />
      </View>
      <TextInput
        value={localValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search"
        accessibilityHint="Type to search"
        className="flex-1 text-base text-text-primary dark:text-text-dark py-0"
      />
      {localValue.length > 0 && (
        <Pressable
          onPress={handleClear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          hitSlop={8}
          className="ml-2"
        >
          <X size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
};

export default React.memo(SearchBar);
