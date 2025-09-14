// src/app/(tabs)/Home.jsx - Improved Version
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { useVideoPreloader, videoCacheManager } from '../../../lib/VideoCache';
import Fullmain from '../../component/Fullmain';
import { useFile } from '../../context/fileProvider';
import FileService from '../../service/fileService';

const {height} = Dimensions.get('screen');

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [post, setPost] = useState([]);
  const [videoPost , setVideos] = useState([]);
  const [currentpage, setCurrentpage] = useState(1);
  const flatListRef = useRef(null);
  const { state, dispatch} = useFile();
  const [currentId, setCurrentPostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [refre, setRefreshing] = useState(false);
  const [preloadRange] = useState(2); // Made this constant

  // Use the video preloader hook
  useVideoPreloader(videoPost, activeIndex, preloadRange);

  useEffect(() => {
    if (!isScreenFocused) {
      setCurrentPostId(null);
      setN();
      // Pause all videos when screen is not focused
      videoCacheManager.cache.forEach((player) => {
        try {
          player.pause();
        } catch (error) {
          console.warn('Error pausing video:', error);
        }
      });
    }
  }, [isScreenFocused]);

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup cache when component unmounts
  useEffect(() => {
    return () => {
      videoCacheManager.clearCache();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
        setCurrentPostId(null);
      };
    }, [])
  );

  const setN = async () => {
    await AsyncStorage.setItem('currentpage', JSON.stringify(currentpage));
  };

  const fetchData = async () => {
    try {
      const res = await FileService.getAllFiles(dispatch);
      
      if (!state.currentPage) {
        let n = await AsyncStorage.getItem('currentpage');
        n = JSON.parse(n) || 1;
        setCurrentpage(n);
      } else {
        setCurrentpage(state.currentPage);
      }

      if (state.error) {
        Alert.alert('error', state.error);
        return;
      }
      
      // Filter out posts without valid video paths
      const validPosts = res.data.filter(item => item.path && typeof item.path === 'string');
      setPost(res.data);
      setVideos(validPosts);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load videos');
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newActiveIndex = viewableItems[0].index;
      setActiveIndex(newActiveIndex);
      
      dispatch({
        type: 'SET_Page',
        payload: { n: newActiveIndex + 1 }
      });
      
      setCurrentpage(newActiveIndex + 1);
      const currentId = viewableItems[0].item._id;
      setCurrentPostId(currentId);
    } else {
      setCurrentPostId(null);
    }
  }, [dispatch]);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 70,
    minimumViewTime: 100,
  }), []);

  const handleRefresh = async () => {
    dispatch({
      type: 'SET_REFRESHING',
      payload: true
    });
    setRefreshing(true);
    
    try {
      // Clear cache before refreshing
      videoCacheManager.clearCache();
      
      const res = await FileService.getAlgoFiles(dispatch, currentpage);
      if (res.msg) {
        Alert.alert('Error', res.msg);
        return;
      }
      
      const validPosts = res.data.filter(item => item.path && typeof item.path === 'string');
      setPost(res.data);
      setVideos(validPosts);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh videos');
    } finally {
      setRefreshing(false);
      dispatch({
        type: 'SET_REFRESHING',
        payload: false
      });
    }
  };

  const renderItem = useCallback(({ item, index }) => {
    const isActive = currentId === item._id && isScreenFocused;
    const shouldPreload = Math.abs(index - activeIndex) <= preloadRange;
    
    return (
      <Fullmain
        file={item}
        isActive={isActive}
        index={activeIndex}
        shouldPreload={shouldPreload}
        isFocused={isScreenFocused}
      />
    );
  }, [currentId, activeIndex, preloadRange, isScreenFocused]);

  const keyExtractor = useCallback((item) => item._id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: height,
    offset: height * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      {state.isLoading || refre ? (
        <LottieView
          source={require('../../assets/animation/load2.json')}
          autoPlay
          loop
          resizeMode='cover'
          style={styles.anim}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={post}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          
          // Optimization props
          snapToAlignment="start"
          snapToInterval={height}
          decelerationRate="fast"
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          
          // Memory and performance optimization
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          
          // Viewability
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          
          refreshControl={
            <RefreshControl 
              refreshing={state.refreshing} 
              onRefresh={handleRefresh} 
              tintColor="#fff"
            />
          }
          
          ListEmptyComponent={() => (
            <LottieView
              source={require('../../assets/animation/load2.json')}
              autoPlay
              loop
              resizeMode='cover'
              style={styles.anim}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  anim: {
    width: 400,
    height: 400,
  },
});

export default HomePage;