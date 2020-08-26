
import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {useEffect, useState} from "react";
import {Constants} from "../../Constants";
import { StyleSheet } from "react-native";

export function CardButton(props: {onTapCallback, cardItem, height, width}) {

    const [item, setItem] = useState(props.cardItem)

    useEffect(() => {
        setItem(props.cardItem)
    }, [props.cardItem])

    return(
        <TouchableOpacity
            onPress={() => {
                props.onTapCallback(item)
            }}
        >
        <View style = {{
            backgroundColor: item.isMatched
                ? "white"
                : item.isFaceUp
                    ? "white"
                    : Constants.cardBlueColor,

            height: props.height,
            width: props.width,
            marginRight:Constants.cardGap,
            marginBottom: Constants.cardGap,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "white",
            borderWidth: 5
        }}>
            {item.isFaceUp && !item.isMatched && (
                <Text style={[style.textStyle]}>
                    {item.identifier}
                </Text>
            )}
            {!item.isFaceUp && !item.isMatched && (
                <Text style={[style.textStyle, {color: 'white'}]}>?</Text>
            )}
            {item.isMatched && (
                <Text style={style.textStyle}>{item.identifier}</Text>
            )}
        </View>
        </TouchableOpacity>
    )
}

export const style = StyleSheet.create({
    textStyle: {
        fontSize: 25,
        color: "black",
        fontWeight: 'bold'
    }
})
