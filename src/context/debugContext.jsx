// context/debugProvider.jsx
import { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import CacheDebugPanel from '../component/DebugPanel';

const DebugContext = createContext();

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

export const DebugProvider = ({ children }) => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(__DEV__);

  const toggleDebugPanel = () => {
    setShowDebugPanel(!showDebugPanel);
  };

  const openDebugPanel = () => {
    setShowDebugPanel(true);
  };

  const closeDebugPanel = () => {
    setShowDebugPanel(false);
  };

  return (
    <DebugContext.Provider value={{
      showDebugPanel,
      debugEnabled,
      toggleDebugPanel,
      openDebugPanel,
      closeDebugPanel,
      setDebugEnabled,
    }}>
      {children}
      
      {/* Debug Panel */}
      <CacheDebugPanel
        visible={showDebugPanel}
        onClose={closeDebugPanel}
      />
    </DebugContext.Provider>
  );
};

// Debug Button Component
export const DebugButton = ({ show = true, style }) => {
  const { debugEnabled, openDebugPanel } = useDebug();

  if (!debugEnabled || !show) return null;

  return (
    <TouchableOpacity
      style={[styles.debugButton, style]}
      onPress={openDebugPanel}
      activeOpacity={0.7}
    >
      <Text style={styles.debugButtonText}>🔧</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  debugButtonText: {
    fontSize: 20,
  },
});