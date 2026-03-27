import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GatewayConfig } from '../types';

export default function StatusScreen() {
  const route = useRoute();
  const { config } = route.params as { config: GatewayConfig };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gateway Status</Text>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Gateway URL</Text>
          <Text style={styles.value}>{config.url}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Token</Text>
          <Text style={styles.value}>••••••••</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Checking...</Text>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Pi Remote Control connects to your OpenClaw gateway to enable agent control from anywhere.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#0f3460',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00ff00',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#00ff00',
  },
  info: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});
