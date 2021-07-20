import {useEffect, useState } from "react";
import styles from './Player.module.css';
import { db } from "../services/Firebase";
import { BsFillPersonFill } from 'react-icons/bs'
import { FaArrowUp, FaArrowsAltH } from 'react-icons/fa';
import Card from './Card.js';

/* Prop: 
playerNo = Determines where the player will be showned locally on screen, client should always be Player1
*/
export default function Player(props){
    const [inputText, setInputText] = useState('')
    const [playerCards, setPlayerCards] = useState([])

    var gridRowNumber = 0
    var gridColumnNumber = 0
    var gridTemplateRows = 0
    var gridTemplateColumns = 0

    useEffect(() => {
        if(props.playerData['cards']){
            var cardObjectArray = Object.values(props.playerData['cards'])
            setPlayerCards(cardObjectArray.map(obj => obj['cardType']))
        }
    }, [props.playerData])

    // Update gridRowNumber and gridColumnNumber based on local player number
    switch(props.playerNo.toString()){
        case '1':
            gridRowNumber = 3
            gridColumnNumber = 3
            gridTemplateRows = '75% 25%' 
            gridTemplateColumns = `100%` 
            break;
        case '2':
            gridRowNumber = 1
            gridColumnNumber = 3
            gridTemplateRows = '20% 80%' 
            gridTemplateColumns = `100%` 
            break;
        case '3':
            gridRowNumber = 2
            gridColumnNumber = 5
            gridTemplateRows = '100%'
            gridTemplateColumns = `80% 20%`
            break;
        case '4':
            gridRowNumber = 2
            gridColumnNumber = 1
            gridTemplateRows = '100%'
            gridTemplateColumns = `20% 80%`
            break;
        default:
            throw new Error("Invalid Player Number")
    }

    var playerContainer = {
        gridRowStart: `${gridRowNumber}`,
        gridColumnStart: `${gridColumnNumber}`,
        width: '100%',
        height: '100%',

        display: 'grid',
        gridTemplateRows: `${gridTemplateRows}`,
        gridTemplateColumns: `${gridTemplateColumns}`,
        justifyContent: 'center'
    }

    var userNameContainer = {
        gridRowStart: `${props.playerNo === 1 ? 2 : 1}`,
        gridColumnStart: `${props.playerNo === 3 ? 2 : 1}`,
        display: 'flex',
        flexDirection: `${props.playerNo < 3 ? 'row' : 'column-reverse'}`,
        justifyContent: 'center',
        alignItems: 'center'
    }

    var cardContainer = {
        gridRowStart: `${props.playerNo === 2 ? 2 : 1}`,
        gridColumnStart: `${props.playerNo === 4 ? 2 : 1}`,
        position: 'relative',
    }

    var personImageStyle = {
        color: 'var(--secondary-color)',
        height: 'fit-content',
        transform: `${props.playerNo < 3 ? '' : `rotate(${props.playerNo === 3 ? -90 : 90}deg)`}`,
        marginTop: '0.5%'
    }

    const onArrangeButtonClicked = (e) => {
        
    }

    const submitHandler = (e) => {
        e.preventDefault()

        // TODO: Send text to the deck
        const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        deckRef.push({
            sender: props.playerData['name'],
            timestamp: Date.now(),
            content: inputText
        })
        setInputText('')
    }

    const cardClickedHandler = (cardType) => {
        console.log(cardType)
    }

    return(
        <div style={playerContainer}>
            <div style={userNameContainer}>  
                    <BsFillPersonFill style={personImageStyle}/>
                    <p className={props.playerNo < 3 ? styles.userName : (props.playerNo === 4 ? styles.userNameLeft : styles.userNameRight)}>{props.children}</p>
                    {props.playerNo === 1 && 
                    <button className={styles.submitButton}>
                        <FaArrowUp className={styles.utilityIcon}/>
                    </button>}
                    {props.playerNo === 1 && 
                    <button className={styles.arrangeButton} onClick={onArrangeButtonClicked}>
                        <FaArrowsAltH className={styles.utilityIcon}/>
                    </button>}
            </div>
            <div style={cardContainer}>
                {playerCards.map((cardType, index) => {
                    cardType = props.playerNo < 3 ? (props.playerNo === 1 ? cardType : 'back') : 'back-right'
                    var left = 0
                    var top = 0
                    var width = 'auto'
                    var height = 'auto'

                    if(props.playerNo === 1){
                        left = 90 / (playerCards.length - 1) * index
                        width = 10
                        if(playerCards.length < 10)
                            left = ((10 - playerCards.length) * 10) / 2 + index * 10
                    }else if(props.playerNo === 2){
                        width = 10
                        height = width * 7.5
                        top = height * 0.333

                        left = 90 / (playerCards.length - 1) * index
                        if(playerCards.length < 10)
                            left = ((10 - playerCards.length) * 10) / 2 + index * 10

                    }else if(props.playerNo === 3){
                        height = 14.25
                        width = height * 2.25

                        // on the 14th card, put it to second row 
                        if(index >= 13){
                            left = width
                            // 12 because 13 is the max length - 1
                            top = (85.5 / 12) * (index % 13)
                        }else{
                            if(playerCards.length - 1 > 13)
                                top = (85.5 / (playerCards.length - 14)) * index
                            else
                                top = (85.5 / (playerCards.length - 1)) * index
                        }   

                        if(playerCards.length < 13 && index > 13)
                            top = ((height * 7) - (playerCards.length * height)) / 2 + index * height
                    }else if(props.playerNo === 4){
                        height = 14.25
                        width = height * 2.25
                        left = 67.5

                        // on the 14th card, put it to second row 
                        if(index >= 13){
                            left = left - width
                            // 12 because 13 is the max length - 1
                            top = (85.5 / 12) * (index % 13)
                        }else{
                            if(playerCards.length - 1 > 13)
                                top = (85.5 / (playerCards.length - 14)) * index
                            else
                                top = (85.5 / (playerCards.length - 1)) * index
                        }   

                        if(playerCards.length < 13 && index >= 13)
                            top = ((height * 7) - (playerCards.length * height)) / 2 + index * height
                    }
                    console.log(playerCards.length)
                    return <Card key={index} left={left} top={top} width={width} height={height} cardClickedHandler={cardClickedHandler} cardType={cardType}/>    
                })}
            </div>
        </div>
    );
}