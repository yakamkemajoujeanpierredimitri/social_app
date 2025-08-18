import React from 'react';
import { View, StyleSheet } from 'react-native';

const MessageSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.skeletonMessage, styles.myMessage]} />
      <View style={[styles.skeletonMessage, styles.theirMessage]} />
      <View style={[styles.skeletonMessage, styles.myMessage]} />
      <View style={[styles.skeletonMessage, styles.theirMessage]} />
      <View style={[styles.skeletonMessage, styles.myMessage]} />
      <View style={[styles.skeletonMessage, styles.theirMessage]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  skeletonMessage: {
    height: 40,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#333',
  },
  myMessage: {
    alignSelf: 'flex-end',
    width: '60%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    width: '60%',
  },
});

export default MessageSkeleton;