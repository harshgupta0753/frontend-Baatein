import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router'
import { verticalScale } from '@/utils/styling'
import {CaretLeftIcon} from 'phosphor-react-native';

const BackButton = ({
    style,
    iconSize=26,
    color=colors.white,
}:BackButtonProps) => {
    const router = useRouter();
  return (
    <TouchableOpacity onPress={()=>router.back()} style={[styles.button,style]}>
        <CaretLeftIcon color={color} size={verticalScale(iconSize)} weight='bold'/>
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button:{},
})