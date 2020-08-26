import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Alert, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {CardButton} from "./CardButton";
import {GameContainerPresenter} from "../Presenter/GameContainerPresenter";
import {Constants} from "../../Constants";
import {GameDataSource} from "../DataSource/GameDataSource";

export function GameContainerScreen(props) {

    const presenter = useRef(new GameContainerPresenter())
    const [cards, setCards] = useState([])
    const [refreshTimer, setRefreshTimer] = useState(Date())

    useEffect(()=>{
        initializeData()
    }, [refreshTimer])

    useEffect(() => {
        if (isAllMatched()) {
            Alert.alert(
                'Yeay',
                'Congratulations you have completed the game in '+presenter.current.stepsTaken+' steps',
                [
                    { text: "Restart", onPress: () => restartButtonTapped() }
                ],
                { cancelable: false }
            );
        }
    },[cards])

    const initializeData = () => {
        presenter.current.calculateWidthAndHeightOfCard(GameDataSource.randomNumber.length*2)
        setCards(presenter.current.getCardModelsArray())
    }

    const replaceCardModelInArray = (cardModel, dataArray) => {
        let oldList = [...dataArray]
        let oldObject = presenter.current.cardsDataArray.find (item => item.id === cardModel.id)
        oldObject.isFaceUp = cardModel.isFaceUp
        oldObject.isMatched = cardModel.isMatched
        let index = oldList.indexOf(oldObject)
        oldList.splice(index, 1, oldObject)
        return oldList
    }

    const resetCurrentTurn = () => {
        presenter.current.currentCard = undefined
        presenter.current.previousCard = undefined
        presenter.current.animationActive = false;
    }

    const checkForMatch = () => {
        if (presenter.current.currentCard.identifier === presenter.current.previousCard.identifier) {
            matchFound();
        } else {
            matchNotFound();
        }

        resetCurrentTurn();
        setCards([...presenter.current.cardsDataArray])
    }

    const isAllMatched = () => {
        if (cards.length > 0) {
            return cards.map ( item => item.isMatched).flat().every( item => item === true)
        }else {
            return false
        }
    }

    const matchFound = () =>  {
        presenter.current.currentCard.isMatched = true
        presenter.current.cardsDataArray = replaceCardModelInArray(presenter.current.currentCard, presenter.current.cardsDataArray)

        presenter.current.previousCard.isMatched = true
        presenter.current.cardsDataArray = replaceCardModelInArray(presenter.current.previousCard, presenter.current.cardsDataArray)

    }
    const matchNotFound = () =>  {

        presenter.current.currentCard.isFaceUp = false
        presenter.current.cardsDataArray = replaceCardModelInArray(presenter.current.currentCard, presenter.current.cardsDataArray)

        presenter.current.previousCard.isFaceUp = false
        presenter.current.cardsDataArray = replaceCardModelInArray(presenter.current.previousCard, presenter.current.cardsDataArray)
    }

    const cardTapped = (cardModel) => {
        presenter.current.stepsTaken += 1
        cardModel.isFaceUp = true
        presenter.current.cardsDataArray = replaceCardModelInArray(cardModel, presenter.current.cardsDataArray)
        setCards([...presenter.current.cardsDataArray])

        if (presenter.current.currentCard === undefined) {
            presenter.current.currentCard = cardModel;
        }else if (presenter.current.previousCard === undefined) {
            presenter.current.previousCard = cardModel
        }
        if (presenter.current.currentCard !== undefined && presenter.current.previousCard !== undefined) {
            presenter.current.animationActive = true;
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (presenter.current.currentCard !== undefined && presenter.current.previousCard !== undefined) {
                checkForMatch();
            }
        }, presenter.current.animationDuration);
        return () => clearTimeout(timer);
    }, [presenter.current.animationActive]);

    const createCards = () => {
        let arr = []
        for(let i = 0; i < cards.length ; i++ ){
            arr.push(
                <CardButton
                    cardItem={cards[i]}
                    onTapCallback={(cardModel) => {
                        // replaceCardModelInArray(cardModel)
                        !cardModel.opened && !cardModel.matched && !presenter.current.animationActive
                            ? cardTapped(cardModel)
                            : null
                    }}
                    height={presenter.current.cardHeight}
                    width={presenter.current.cardWidth}
                >
                </CardButton>
            )
        }
        return arr
    }
    const restartButtonTapped = () => {
        presenter.current.stepsTaken = 0
        setRefreshTimer(Date())
    }
    return (
        <SafeAreaView style={{flex:0, backgroundColor:'black', opacity:0.8}}>
            <View style={{backgroundColor:'black', marginLeft: 20,}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                            restartButtonTapped()
                        }}>
                        <View style={{height: 35, width: 100, backgroundColor: Constants.cardBlueColor, padding:5, borderRadius: 10}}>
                            <Text style={{
                                color:'black',
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>Restart</Text>
                        </View>
                    </TouchableOpacity>
                   <Text style={{marginRight: 20}}>
                       <Text style={{
                           color:'white',
                           fontSize: 20,
                           textAlign: 'center'
                       }}>{'Steps  '}
                       </Text> <Text style={{
                       color:Constants.cardBlueColor,
                       fontSize: 25,
                       fontWeight: 'bold',
                       textAlign: 'center',
                   }}>{presenter.current.stepsTaken}</Text>
                   </Text>
                </View>
                <View style={{
                    marginTop: 10,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: this.screenHeight,
                    width: this.screenWidth,

                }}>
                    {createCards()}
                </View>
            </View>
        </SafeAreaView>
    )
}
