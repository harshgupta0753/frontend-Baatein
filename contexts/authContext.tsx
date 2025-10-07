import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, use, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { login, register } from "@/services/authService";
import { connectSocket, disconnectSocket } from "@/socket/socket";

export const AuthContext= createContext<AuthContextProps>({
    user: null,
    token: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async() => {},
    updateToken: async () => {},
});

export const AuthProvider=({children}: {children: ReactNode})=>{
    const [token,setToken]= useState<string | null>(null);
    const [user,setUser]= useState<UserProps | null>(null);
    const router =useRouter();

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken= async()=>{
        const storedToken= await AsyncStorage.getItem('token');
        if(storedToken){
            try{
                const decoded =jwtDecode<DecodedTokenProps>(storedToken);
                if(decoded.exp && decoded.exp < Date.now()/1000){
                    await AsyncStorage.removeItem('token');
                    gotoWelcomePage();
                    return;
                }
                  setToken(storedToken);
                  await connectSocket();
                  setUser(decoded.user);
                  
                  gotoHomePage();

            }catch(error){
                gotoWelcomePage();
                console.log("Error decode token",error);
            }
        }
        else{
            gotoWelcomePage();
        }
    }

    const gotoHomePage=()=>{
       setTimeout(() => {
        router.replace("/(main)/home");
       }, 1500);

    }
    const gotoWelcomePage=()=>{
        setTimeout(() => {
         router.replace("/(auth)/welcome");
        }, 1500);
    }


    const updateToken= async(token:string)=>{
        if(token){
            setToken(token);
            await AsyncStorage.setItem('token',token);

            const decoded =jwtDecode<DecodedTokenProps>(token);
            console.log('Decoded Token:',decoded);
            setUser(decoded.user);
        }
}
    const signIn= async(email:string,password:string)=>{
        const response= await login(email,password);
        await updateToken(response.token);
        await connectSocket();
        router.replace('/(main)/home' );
    };

    const signUp= async(
        email:string,
        password:string,
        name:string,
        avatar?:string | null
    )=>{
        const response= await register(email,password,name,avatar);
        await updateToken(response.token);
        await connectSocket();
        router.replace('/(main)/home');
    };
    //bad idea for signout 
    const signOut= async()=>{
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('token');
         disconnectSocket();
        router.replace('/(auth)/welcome');
    }


    return(
        <AuthContext.Provider value={{user,token,signIn,signUp,signOut,updateToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=> useContext(AuthContext);
