import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { openClawService } from '../services/openclawService';
import { GatewayConfig, Message } from '../types';

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { config } = route.params as { config: GatewayConfig };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    openClawService.connect(config);
    
    openClawService.onStatusChange((status) => {
      setConnected(status.connected);
    });

    openClawService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      // Speak the response
      Speech.speak(message.content, {
        language: 'en',
        rate: 1.0,
      });
    });

    return () => {
      openClawService.disconnect();
    };
  }, [config]);

  const handleSend = async () => {
    if (!input.trim() || !connected) return;

    const content = input.trim();
    setInput('');

    try {
      const userMessage = await openClawService.sendMessage(content);
      setMessages((prev) => [...prev, userMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.agentBubble]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View style={[styles.statusDot, connected ? styles.statusConnected : styles.statusDisconnected]} />
        <Text style={styles.statusText}>
          {connected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Message your agent..."
          placeholderTextColor="#666"
          editable={connected}
        />
        <TouchableOpacity
          style={[styles.sendButton, !connected && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!connected}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusConnected: {
    backgroundColor: '#00ff00',
  },
  statusDisconnected: {
    backgroundColor: '#ff0000',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#e94560',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#16213e',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: '#888',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
