import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Avatar from '@/components/Avatar'
import * as Icons from 'phosphor-react-native'
import { scale, verticalScale } from '@/utils/styling'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { useAuth } from '@/contexts/authContext'
import { UserDataProps } from '@/types'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { updateProfile } from '@/socket/socketEvents'
import { getSocket } from '@/socket/socket'
import * as ImagePicker from 'expo-image-picker'
import { uploadFileToCloudinary } from '@/services/imageService'


const ProfileModal = () => {

    const { user,signOut, updateToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const router=useRouter();

    const [userData, setUserData] = useState<UserDataProps>({
        name: "",
        email: "",
        avatar: null,
    });

    const processUpdateProfile=(res:any)=>{
        console.log("got res: ", res);
        setLoading(false);

        if(res.success){
            updateToken(res.data.token);
            router.back()
        }else{
            Alert.alert('User', res.msg)
        }
    }

    useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  if (socket.connected) {
    updateProfile(processUpdateProfile);
  } else {
    socket.once("connect", () => {
      updateProfile(processUpdateProfile);
    });
  }

  return () => updateProfile(processUpdateProfile, true);
}, [processUpdateProfile]);

    
    useEffect(() => {
        setUserData({
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || null,
        })
    }, [user]);

    const onPickImage =async()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setUserData({...userData,avatar:result.assets[0] });
    }
    };

    const handleLogout= async ()=>{
        router.back();
        await signOut();
    }

    const showLogoutAlert=()=>{
        Alert.alert("Confirm","Are you sure you want to logout?",[
            {
                text:"Cancel",
                onPress:()=>console.log("cancel logout"),
                style:"cancel"
            },
            {
                text:"Logout",
                onPress:()=>handleLogout(),
                style:"destructive",
            }
        ])
    }

    const onSubmit = async() => { 
        let{name,avatar}=userData;
        if(!name.trim()){
            Alert.alert("User","please enter your name");
            return;
        }

        let data={
            name,avatar
        };

        if(avatar && avatar?.uri){
            setLoading(true);
            const res=await uploadFileToCloudinary(avatar,"profiles");
            console.log("result: ",res);
            if(res.success){
                data.avatar=res.data;
            }else{
                Alert.alert("User", res.msg);
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        updateProfile(data);
    }

    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header title={"Update Profile"}
                    leftIcon={
                        Platform.OS == "android" && <BackButton color={colors.black} />
                    }
                    style={{ marginVertical: spacingY._15 }}
                />

                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Avatar uri={userData.avatar} size={170} />
                        <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
                            <Icons.PencilIcon size={verticalScale(20)} color={colors.neutral800} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ gap: spacingY._20 }}>
                        <View style={styles.inputContainer}>
                            <Typo style={{ paddingLeft: spacingX._10 }}> Email</Typo>
                            <Input value={userData.email} containerStyle={{
                                borderColor: colors.neutral350,
                                paddingLeft: spacingX._20,
                                backgroundColor: colors.neutral300,
                            }}
                                onChangeText={(value) => setUserData({ ...userData, email: value })}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Typo style={{ paddingLeft: spacingX._10 }}> Name</Typo>
                            <Input value={userData.name} containerStyle={{
                                borderColor: colors.neutral350,
                                paddingLeft: spacingX._20,
                                // backgroundColor:colors.neutral300,
                            }}
                                onChangeText={(value) => setUserData({ ...userData, name: value })}
                            // editable={false}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>

                {
                    !loading && (

                        <Button style={{
                            backgroundColor: colors.rose,
                            height: verticalScale(56),
                            width: verticalScale(56),
                        }}
                        onPress={showLogoutAlert}
                        >
                            <Icons.SignOutIcon
                                size={verticalScale(30)}
                                color={colors.white}
                                weight="bold" />
                        </Button>

                    )
                }



                <Button style={{ flex: 1 }} onPress={onSubmit} loading={loading}>
                    <Typo color={colors.black} fontWeight={"700"}>
                        Update
                    </Typo>
                </Button>
            </View>
        </ScreenWrapper>
    )
}

export default ProfileModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral200,
        marginBottom: spacingY._10,
        borderTopWidth: 1,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer:{
        gap: spacingY._7,
    }

})