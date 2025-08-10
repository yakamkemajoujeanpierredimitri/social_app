import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
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
const SCREEN_HEIGHT = height;
const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [post,setPost] = useState([]);
  const [currentpage , setCurrentpage ] = useState(1)
  const flatListRef = useRef(null);
  const { state ,dispatch} = useFile();
  const [currentId ,setCurrentPostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
    useEffect(()=>{
        if (!isScreenFocused) {
            setCurrentPostId(null);
            setN();
        }
    },[isScreenFocused]);
    useEffect(()=>{
      fetchData();
    },[]);
   
    useFocusEffect(
        useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
                setCurrentPostId(null); // Pause all videos when leaving
            };
        }, [])
    );
     const setN = async ()=>{
      await AsyncStorage.setItem('currentpage',JSON.stringify(currentpage));
    }
   const fetchData = async ()=>{
      const res = await FileService.getAllFiles(dispatch);
      if (!state.currentPage) {
      let n = await AsyncStorage.getItem('currentpage');
      n = JSON.parse(n)|| 1;
      setCurrentpage(n);
      }
      setCurrentpage(state.currentPage);
      if (state.error) {
        Alert.alert('error',state.error);
        return;
      }
      setPost(res.data);
      console.log(res.data);
      console.log(currentpage);
    };
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
      dispatch({
        type:'SET_Page',
        payload:{n:viewableItems[0].index+1}
      });
      const currentId = viewableItems[0].item._id;
      setCurrentPostId(currentId);
    }else{
        setCurrentPostId(null);
    }
  
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
     const res =  await FileService.getAlgoFiles(dispatch);
     if(state.error){
        Alert.alert('Error',state.error);
        return;
     }
     setPost(res.data);
    } finally {
      setRefreshing(false);
    }
  };

 

  return (
    <View style={styles.container}>
      {state.isLoading ? <LottieView
      source={require('../../assets/animation/load2.json')}
      autoPlay
      loop
      resizeMode='cover'
      style={styles.anim}
      /> :
      <FlatList
        ref={flatListRef}
        data={post}
        renderItem={({item , index} )=>(<Fullmain
                file={item}
                isActive={currentId === item._id}
                index={activeIndex}
            />
         )}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
         initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl refreshing={state.refreshing} onRefresh={handleRefresh} />
        }
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        ListEmptyComponent={()=>(<LottieView
      source={require('../../assets/animation/load2.json')}
      autoPlay
      loop
      resizeMode='cover'
      style={styles.anim}
      />)}
      />}
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