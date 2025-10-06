import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Avatar from '@/components/Avatar'
import * as Icons from "phosphor-react-native"
import MessageItem from '@/components/MessageItem'
import { scale, verticalScale } from '@/utils/styling'
import Input from '@/components/Input'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import Loading from '@/components/Loading'
import { uploadFileToCloudinary } from '@/services/imageService'
import { getMessages, newMessage } from '@/socket/socketEvents'
import { MessageProps, ResponseProps } from '@/types'

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type
  } = useLocalSearchParams();

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([])

  const participants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;
  let isDirect = type == "direct";
  const otherParticipant = isDirect ? participants.find((p: any) => p._id != currentUser?.id) : null;

  if (isDirect && otherParticipant)
    conversationAvatar = otherParticipant.avatar;

  let conversationName = isDirect ? otherParticipant.name : name;

  useEffect(()=>{
    newMessage(newMessageHandler);
    getMessages(messagesHandler);

    getMessages({conversationId})

    return ()=>{
    newMessage(newMessageHandler,true);
    getMessages(messagesHandler,true);
    
    }
  },[]);

  const newMessageHandler =(res:ResponseProps)=>{
    setLoading(false);
    if(res.success){
      if(res.data.conversationId == conversationId){
        setMessages((prev)=>[res.data as MessageProps, ...prev]);
      }
      else{
        Alert.alert("Error", res.msg);
      }
    }
  };

  const messagesHandler=(res: ResponseProps)=>{
    if(res.success) setMessages(res.data);
  };

  const dummyMessages = [
    {
      id: "msg_1",
      sender: {
        id: "user_1",
        name: "John Doe",
        avatar: null,
      },
      content: "Hey Jane, how’s it going?",
      createdAt: "10:30 AM",
      isMe: true,
    },
    {
      id: "msg_2",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Hi John! I'm doing great, how about you?",
      createdAt: "10:31 AM",
      isMe: false,
    },
    {
      id: "msg_3",
      sender: {
        id: "user_1",
        name: "John Doe",
        avatar: null,
      },
      content: "Pretty good! Working on that new project.",
      createdAt: "10:33 AM",
      isMe: true,
    },
    {
      id: "msg_4",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Oh nice! How’s it going so far?",
      createdAt: "10:35 AM",
      isMe: false,
    },
    {
      id: "msg_5",
      sender: {
        id: "user_1",
        name: "John Doe",
        avatar: null,
      },
      content: "It’s coming along, but there are still a few bugs.",
      createdAt: "10:37 AM",
      isMe: true,
    },
    {
      id: "msg_6",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Yeah, debugging always takes time. Need any help?",
      createdAt: "10:38 AM",
      isMe: false,
    },
    {
      id: "msg_7",
      sender: {
        id: "user_1",
        name: "John Doe",
        avatar: null,
      },
      content: "That’d be awesome! Maybe tomorrow afternoon?",
      createdAt: "10:40 AM",
      isMe: true,
    },
    {
      id: "msg_8",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Sure, I can make some time after lunch.",
      createdAt: "10:41 AM",
      isMe: false,
    },
    {
      id: "msg_9",
      sender: {
        id: "user_1",
        name: "John Doe",
        avatar: null,
      },
      content: "Perfect! I’ll send you the repo link.",
      createdAt: "10:42 AM",
      isMe: true,
    },
    {
      id: "msg_10",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "That would be really useful!",
      createdAt: "10:43 AM",
      isMe: false,
    },
  ];

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;

    if (!currentUser) return;

    setLoading(true);
    try {
      let attachement = null;
      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachements"
        );

        if (uploadResult.success) {
          attachement = uploadResult.data;
        } else {
          setLoading(false);
          Alert.alert("Error", "Could not send the image");

        }
      }
     
      
      newMessage({
        conversationId,
        sender:{
          id:currentUser?.id,
          name:currentUser.name,
          avatar:currentUser.avatar,
        },
        content:message.trim(),
        attachement,
      });

      setMessage("");
      setSelectedFile(null);

    } catch (error: any) {
      console.log("Error sending message: ", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setLoading(false);
    }

  }


  // console.log("got conversation data: ", data);
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}>
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar size={40}
                uri={conversationAvatar as string}
                isGroup={type == "group"}
              />
              <Typo color={colors.white} fontWeight={"500"} size={22}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
              <Icons.DotsThreeOutlineVerticalIcon weight="fill" color={colors.white} />

            </TouchableOpacity>
          }
        />

        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageContent}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 0,
              }}
              placeholder='Type Message'
              icon={
                <TouchableOpacity
                  style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.PlusIcon
                    color={colors.black}
                    weight='bold'
                    size={verticalScale(22)} />

                  {
                    selectedFile && selectedFile.uri && (
                      <Image
                        source={selectedFile.uri}
                        style={styles.selectedFile}
                      />
                    )}
                </TouchableOpacity>
              }
            />


            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {
                  loading ? (
                    <Loading size="small" color={colors.black} />
                  ) : (
                    <Icons.PaperPlaneTiltIcon
                      color={colors.black}
                      weight="fill"
                      size={verticalScale(22)} />
                  )
                }

              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Conversation

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  messageContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  }
})