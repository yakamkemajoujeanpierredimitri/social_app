import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { useFile } from '../../context/fileProvider';
import FileService from '../../service/fileService';

import { placeholder } from '../../assets/images';
import Fullmain from '../../component/Fullmain';



const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [post, setPost] = useState([]);
  const [currentpage, setCurrentpage] = useState(1);
  const flatListRef = useRef(null);
  const { state, dispatch} = useFile();
  const [currentId, setCurrentPostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [refre, setRefreshing] = useState(false);
  
 

  useEffect(() => {
    fetchData();
    Control();
  }, []);

  // Cleanup cache when component unmounts

useEffect(()=>{
if(!isScreenFocused){
  setN();
}
},[isScreenFocused])
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
      setPost(res.data);
      
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
      //console.log(currentpage); 
      const res = await FileService.getAlgoFiles(dispatch, currentpage);
      if (res.msg) {
        //Alert.alert('Error', res.msg);
        return;
      }
      setPost(res.data);
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
  const Control = async ()=>{
    const res = await FileService.getView(dispatch);
    if(res.msg){
      console.log(res.msg);
    }
  }

  const renderItem = useCallback(({ item, index }) => {
    const isActive = currentId === item._id && isScreenFocused;

    return (
      <Fullmain
        file={item}
        isActive={isActive}
        index={activeIndex}
        isFocused={isScreenFocused}
      />
    );
  }, [currentId, activeIndex, isScreenFocused]);

  const keyExtractor = useCallback((item) => item._id, []);

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
        <FlashList
          ref={flatListRef}
          data={post}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={600}
          
          // Optimization props
          snapToAlignment="start"
          snapToInterval={600}
          decelerationRate="fast"
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          
          // Memory and performance optimization
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={10}
          removeClippedSubviews={false}
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
            <Image
            style={styles.anim}
            source={placeholder}
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