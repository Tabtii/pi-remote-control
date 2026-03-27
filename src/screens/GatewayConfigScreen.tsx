import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GatewayConfig } from '../types';

const STORAGE_KEY = '@pi_remote_gateway';

export default function GatewayConfigScreen() {
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!url.trim() || !token.trim()) {
      Alert.alert('Error', 'Please enter Gateway URL and Token');
      return;
    }

    setLoading(true);
    try {
      const config: GatewayConfig = { url: url.trim(), token: token.trim() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      (navigation as any).navigate('Chat', { config });
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pi Remote Control</Text>
      <Text style={styles.subtitle}>Connect to your Gateway</Text>

      <TextInput
        style={styles.input}
        placeholder="Gateway URL (e.g., 192.168.1.100:18789)"
        placeholderTextColor="#666"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Gateway Token"
        placeholderTextColor="#666"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Connecting...' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
