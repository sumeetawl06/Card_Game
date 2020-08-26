import {CardModel} from "../Model/CardModel";
import {GameDataSource} from "../DataSource/GameDataSource";
import {Constants} from "../../Constants";
import {Dimensions} from "react-native";

export class GameContainerPresenter {

    currentCard = undefined
    previousCard = undefined
    screenWidth = Dimensions.get("window").width - 30;
    screenHeight = Dimensions.get("window").height - 80;
    cardsDataArray = []
    cardWidth = 20
    cardHeight = 20
    animationActive = false;
    animationDuration = 1000
    safeArea = 24
    stepsTaken = 0

    calculateWidthAndHeightOfCard(cardsCount) {

        let totalHorizontalGap = Constants.cardGap * Constants.numberOfColumns;
        let boardWidth = this.screenWidth - totalHorizontalGap;
        this.cardWidth = boardWidth / Constants.numberOfColumns;

        let numberOfRows = Math.ceil(cardsCount / Constants.numberOfColumns);
        let totalVerticalGap = Constants.cardGap * numberOfRows;
        let boardHeight = this.screenHeight - totalVerticalGap - this.safeArea - Constants.cardGap;
        this.cardHeight = boardHeight / numberOfRows;
    }

    getCardModelsArray() {
        let cardCount = GameDataSource.generateRandomNumber()
        let arrayOfModels = []
        cardCount.forEach((value, index, array) => {
            const cardModel = new CardModel()
            cardModel.identifier = value
            cardModel.id = index
            const anotherCardModel = new CardModel()
            anotherCardModel.identifier = value
            anotherCardModel.id = cardCount.length + index
            arrayOfModels.push(cardModel)
            arrayOfModels.push(anotherCardModel)
        })
        arrayOfModels.sort(() => Math.random() - 0.5);
        let shuffleAr = this.shuffle(arrayOfModels)
        this.cardsDataArray = shuffleAr
        return shuffleAr
    }

    shuffle(array) {
       return [...Array(array.length)]
            .map((...args) => Math.floor(Math.random() * (args[1] + 1)))
            .reduce( (a, rv, i) => ([a[i], a[rv]] = [a[rv], a[i]]) && a, array);
    }
}
