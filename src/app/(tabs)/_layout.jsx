import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/authProvider";
const AddBtn = ()=>{
    const router = useRouter();
    return(
        <TouchableOpacity  style={{marginRight: 10}} onPress={()=>router.push('/add')} >
        <AntDesign
        name="plus"
        color={"#ffd700"}
        size={24}
        /></TouchableOpacity>
    )
}
const Tablayout = React.memo(() => {
    const router = useRouter();
    const netInfo = useNetInfo();
    const { state , dispatch} = useAuth();
    useEffect(() => {
        if (netInfo.isConnected === false) {
            Alert.alert("No Internet Connection", "Please check your network settings.");
            router.navigate('/offline');
            return ;
        }
    }, [netInfo.isConnected]);
    return (
        <Tabs

            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                switch (route.name) {
                    case "Home":
                        iconName = focused ? "home" : "home";
                        break;
                    case "Search":
                        iconName = focused ? "search1" : "search1";
                        break;
                    case "Camera":
                        iconName = focused ? "camera" : "camerao";
                        break;
                    case "Profile":
                        iconName = focused ? "user" : "user";
                        break;
                    case "Message":
                        return <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={size} color={color} />;
                    default:
                        iconName = "ellipse";
                }
                return <AntDesign name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FFD700", // yellow
            tabBarInactiveTintColor: "#fff",  // white
            tabBarStyle: {
                backgroundColor: "#000",        // black
                borderTopColor: "#FFD700",      // yellow border
            },
            headerShown: true,
            headerRight:()=><AddBtn/>,
            headerStyle: {
                backgroundColor: '#000',
            },
            headerTintColor: '#FFD700',
        })}
        
    >
        <Tabs.Screen name="Home"  />
        <Tabs.Screen name="Search" />
        <Tabs.Screen name="Camera" />
        <Tabs.Screen name="Profile"  />
        <Tabs.Screen name="Message" options={{ headerShown: true }} />
    </Tabs>)
});

export default Tablayout;