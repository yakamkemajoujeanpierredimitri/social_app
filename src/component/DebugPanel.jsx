// components/CacheDebugPanel.jsx
import { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useVideoCache } from './PerformanceHook';

const CacheDebugPanel = ({ visible, onClose }) => {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const { getCacheStats, getPerformanceMetrics, clearCache, getNetworkQuality } = useVideoCache();

  useEffect(() => {
    if (visible) {
      // Update stats every 2 seconds while panel is visible
      const interval = setInterval(() => {
        setStats(getCacheStats());
        setPerformance(getPerformanceMetrics());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [visible, getCacheStats, getPerformanceMetrics]);

  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Video Cache Debug</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Cache Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cache Statistics</Text>
              {stats && (
                <>
                  <Text style={styles.stat}>Size: {stats.size}/{stats.maxSize}</Text>
                  <Text style={styles.stat}>Cached Videos: {stats.keys.length}</Text>
                  <Text style={styles.stat}>Network Quality: {getNetworkQuality()}</Text>
                </>
              )}
            </View>

            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance</Text>
              {performance && (
                <>
                  <Text style={styles.stat}>
                    Avg Load Time: {performance.averageLoadTime.toFixed(0)}ms
                  </Text>
                  <Text style={styles.stat}>Buffer Events: {performance.bufferEvents}</Text>
                  <Text style={styles.stat}>Errors: {performance.errors}</Text>
                  <Text style={styles.stat}>Total Videos Loaded: {performance.loadTimes.length}</Text>
                </>
              )}
            </View>

            {/* Cached Video URIs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cached Videos</Text>
              {stats?.keys.map((uri, index) => (
                <Text key={index} style={styles.uri} numberOfLines={1}>
                  {index + 1}. {uri.split('/').pop()}
                </Text>
              ))}
            </View>

            <TouchableOpacity onPress={handleClearCache} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear Cache</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  stat: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  uri: {
    fontSize: 12,
    marginBottom: 3,
    color: '#999',
    fontFamily: 'monospace',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CacheDebugPanel;