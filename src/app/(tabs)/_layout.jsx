import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
const AddBtn = ()=>{
    const router = useRouter();
    return(
        <TouchableOpacity  style={{margin:10, height:200 , width:200}} onPress={()=>router.navigate('/add')} >
        <Ionicons 
        name="add"
        color={"#ffd700"}
        size='large'
        /></TouchableOpacity>
    )
}
const Tablayout = React.memo(() => (
    <Tabs
    
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                switch (route.name) {
                    case "Home":
                        iconName = focused ? "home" : "home-outline";
                        break;
                    case "Search":
                        iconName = focused ? "search" : "search-outline";
                        break;
                    case "Camera":
                        iconName = focused ? "camera" : "camera-outline";
                        break;
                    case "Profile":
                        iconName = focused ? "person" : "person-outline";
                        break;
                    default:
                        iconName = "ellipse";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FFD700", // yellow
            tabBarInactiveTintColor: "#fff",  // white
            tabBarStyle: {
                backgroundColor: "#000",        // black
                borderTopColor: "#FFD700",      // yellow border
            },
            headerShown: false,
            headerLeft:()=><AddBtn/>
        })}
        
    >
        <Tabs.Screen name="Home"  />
        <Tabs.Screen name="Search" />
        <Tabs.Screen name="Camera" />
        <Tabs.Screen name="Profile"  />
    </Tabs>
));

export default Tablayout;