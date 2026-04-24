import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { colors } from '@/utils/colors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center bg-cream px-6 dark:bg-dark-bg">
          <View className="w-full max-w-sm items-center rounded-2xl bg-white p-8 shadow-md dark:bg-dark-card">
            <AlertTriangle
              size={48}
              color={colors.accent[500]}
              strokeWidth={2}
            />
            <Text className="mt-4 text-center text-xl font-bold text-text dark:text-textDark">
              Something went wrong
            </Text>
            {this.state.error?.message ? (
              <Text className="mt-2 text-center text-sm text-muted dark:text-mutedDark">
                {this.state.error.message}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={this.handleReset}
              activeOpacity={0.8}
              className="mt-6 rounded-xl bg-primary-500 px-8 py-3"
            >
              <Text className="text-center text-base font-semibold text-white">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
