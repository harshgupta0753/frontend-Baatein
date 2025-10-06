import {
    Dimensions,
    ImageBackground,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height, width } = Dimensions.get("window");

const ScreenWrapper = ({
    style,
    children,
    showPattern = false,
    isModal = false,
    bgOpacity = 1,
}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS === "ios" ? 0.06 * height : 40;
    let paddingBottom = 0;

    if (isModal) {
        paddingTop = Platform.OS === "ios" ? 0.02 * height : 45;
        paddingBottom = 0.02 * height;
    }
    return (
        <ImageBackground
            style={{
                flex: 1,
                backgroundColor: isModal ? colors.white : colors.neutral900,
            }}
            imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
            source={require("../assets/images/bgPattern.png")}
        >
            <View
                style={[
                    {
                        flex: 1,
                        paddingTop,
                        paddingBottom,
                    },
                    style,
                ]}
            >
                <StatusBar barStyle={"light-content"} backgroundColor={"transparent"} />
                {children}
            </View>
        </ImageBackground>
    );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
