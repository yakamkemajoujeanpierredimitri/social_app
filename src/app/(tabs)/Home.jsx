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
const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [post,setPost] = useState([]);
  const [currentpage , setCurrentpage ] = useState(1)
  const flatListRef = useRef(null);
  const { state ,dispatch} = useFile();
  const [currentId ,setCurrentPostId] = useState(null);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [refre,setRefreshing] = useState(false);
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
      //console.log('setcurrentpage when uploading file and state.current does not exist:', n);
      }else{
         setCurrentpage(state.currentPage);
      //console.log('setcurrentpage when uploading file and state.current  exist:', state.currentPage);
      }
      
      //console.log(res.data);
     
      if (state.error) {
        Alert.alert('error',state.error);
        return;
      }
      setPost(res.data);
     // console.log(res.data);
      ///console.log(currentpage);
    };
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
      dispatch({
        type:'SET_Page',
        payload:{n:viewableItems[0].index+1}
      });
      //console.log('setcurrentpage when on scrolling :', viewableItems[0].index);
      setCurrentpage(viewableItems[0].index + 1);
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
    dispatch({
      type:'SET_REFRESHING',
      payload:true
    });
    setRefreshing(true);
    try {
     const res =  await FileService.getAlgoFiles(dispatch , currentpage);
     if(res.msg){
        Alert.alert('Error',res.msg);
        return;
     }
     
      //console.log(res.data);
      setPost(res.data);
     
    } finally {
      setRefreshing(false);
         dispatch({
      type:'SET_REFRESHING',
      payload:false
    });
    }
  };

 

  return (
    <View style={styles.container}>
      {state.isLoading || refre ? <LottieView
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
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl refreshing={state.refreshing} onRefresh={handleRefresh} />
        }
      ListEmptyComponent={()=>(<LottieView
      source={require('../../assets/animation/load2.json')}
      autoPlay
      loop
      resizeMode='cover'
      style={styles.anim}
      />)}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
        windowSize={3}
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