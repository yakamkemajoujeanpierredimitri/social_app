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
import Fullmain from '../../component/Fullmain';
import { useFile } from '../../context/fileProvider';
import FileService from '../../service/fileService';

const {height} = Dimensions.get('screen');

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [post, setPost] = useState([]);
  const [currentpage, setCurrentpage] = useState(1);
  const flatListRef = useRef(null);
  const { state, dispatch} = useFile();
  const [currentId, setCurrentPostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [refre, setRefreshing] = useState(false);

  // Video streaming optimization states
  const [preloadRange, setPreloadRange] = useState(2); // Preload 2 videos before/after current
  const lastActiveIndex = useRef(0);

  useEffect(() => {
    if (!isScreenFocused) {
      setCurrentPostId(null);
      setN();
    }
  }, [isScreenFocused]);

  useEffect(() => {
    fetchData();
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
    setPost(res.data);
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
      
      lastActiveIndex.current = newActiveIndex;
    } else {
      setCurrentPostId(null);
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 70, // Increased threshold for better performance
    minimumViewTime: 100, // Minimum time to consider an item viewable
  }), []);

  const handleRefresh = async () => {
    dispatch({
      type: 'SET_REFRESHING',
      payload: true
    });
    setRefreshing(true);
    try {
      const res = await FileService.getAlgoFiles(dispatch, currentpage);
      if (res.msg) {
        Alert.alert('Error', res.msg);
        return;
      }
      setPost(res.data);
    } finally {
      setRefreshing(false);
      dispatch({
        type: 'SET_REFRESHING',
        payload: false
      });
    }
  };

  // Optimize render item with memoization
  const renderItem = useCallback(({ item, index }) => {
    const isActive = currentId === item._id;
    const shouldPreload = Math.abs(index - activeIndex) <= preloadRange;
    
    return (
      <Fullmain
        file={item}
        isActive={isActive}
        index={activeIndex}
        shouldPreload={shouldPreload}
      />
    );
  }, [currentId, activeIndex, preloadRange]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item._id, []);

  // Get item layout for better scrolling performance
  const getItemLayout = useCallback((data, index) => ({
    length: height,
    offset: height * index,
    index,
  }), [height]);

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