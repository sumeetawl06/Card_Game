import {Constants} from "../../Constants";

export class GameDataSource {
    static dataCount = Constants.CARD_PAIRS_VALUE
    static randomNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    static dataSource = GameDataSource.randomNumber // Change this for random number generation

    static generateRandomNumber() {
        let arr = [];
        while(arr.length < 8){
            let r = Math.floor(Math.random() * 100) + 1;
            if(arr.indexOf(r) === -1) arr.push(String(r));
        }
        GameDataSource.randomNumber = arr
        return arr
    }
}
