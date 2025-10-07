import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { MessageProps } from '@/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Avatar from './Avatar'
import Typo from './Typo'
import moment from 'moment'
import { Image } from 'expo-image'
import { verticalScale } from '@/utils/styling'

const MessageItem = ({ item, isDirect }: { item: MessageProps, isDirect: boolean }) => {


    const { user: currentUser } = useAuth();
    const isMe = currentUser?.id == item?.sender?.id;

    const formattedDate=moment(item.createdAt).isSame(moment(),"day")?
    moment(item.createdAt).format("h:mm A"):
    moment(item.createdAt).format("MMM D, h:mm A");

    // console.log("message items: ",item);

    return (
        <View style={[styles.messageContainer,
        isMe ? styles.myMessage : styles.theirMessage,]
        }>
            {!isMe && !isDirect && (
                <Avatar size={30} uri={item?.sender?.avatar} style={styles.messageAvatar} />
            )}
            <View style={[styles.messsageBubble,
            isMe ? styles.myBubble : styles.theirBubble,
            ]}>
                {
                    !isMe && !isDirect &&
                    (<Typo color={colors.primary} fontWeight={"900"} size={15}>
                        {item.sender.name}
                    </Typo>
                    )}

                    {
                        item.attachement && (
                            <Image
                            source={item.attachement}
                            contentFit='cover'
                            style={styles.attachment}
                            transition={100}
                            />
                        )

                    }

                    {
                        item.content && <Typo size={15} fontWeight={"400"} color={colors.white}> {item.content}</Typo>
                    }
                    <Typo
                    style={{alignSelf:"flex-end"}}
                    size={11}
                    fontWeight={"500"}
                    color={colors.white}>
                        {formattedDate}
                    </Typo>
            </View>
        </View>
    )
}

export default MessageItem

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        gap: spacingX._7,
        maxWidth: "80%",
    },
    myMessage: {
        alignSelf: "flex-end",
    },
    theirMessage: {
        alignSelf: "flex-start",
    },
    messageAvatar: {
        alignSelf: "flex-end",
    },
    messsageBubble: {
        padding: spacingX._10,
        borderRadius: radius._15,
        gap: spacingY._5,
    },
    myBubble: {
        backgroundColor: colors.myBubble,
    },
    theirBubble: {
        backgroundColor: colors.otherBubble,
    },
    attachment:{
        height:verticalScale(180),
        width:verticalScale(180),
        borderRadius:radius._10,
    }

})