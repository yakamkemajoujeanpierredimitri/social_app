import { AntDesign } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
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
const Tablayout = React.memo(() => (
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
        <Tabs.Screen name="Home" options={{headerShown:false}} />
        <Tabs.Screen name="Search" />
        <Tabs.Screen name="Camera" />
        <Tabs.Screen name="Profile"  />
    </Tabs>
));

export default Tablayout;