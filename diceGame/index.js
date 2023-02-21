import { useRef, useEffect, useState } from 'react'
import styles from '../../../styles/diceGame.module.css'
import Image from "next/image"

export default function DiceGame() {
    const diceList = ['/images_DiceGame/dice1.png', '/images_DiceGame/dice2.png', '/images_DiceGame/dice3.png', '/images_DiceGame/dice4.png', '/images_DiceGame/dice5.png', '/images_DiceGame/dice6.png']
    const dice1 = Math.floor(Math.random() * diceList.length)
    const dice2 = Math.floor(Math.random() * diceList.length)

  
    const heading = useRef()
    const [showButton, setShowButton] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [img1,setImg1] = useState('')
    const [img2,setImg2] = useState('')
    const [hide,setHide] = useState(true)

    function refreshHandler() {
        setImg1(diceList[dice1])
        setImg2(diceList[dice2])
        setHide(false)
        if (Number(diceList[dice1][21]) > Number(diceList[dice2][21])) heading.current.innerText = `Player 1 Wins`;

        else if (Number(diceList[dice1][21]) < Number(diceList[dice2][21])) heading.current.innerText = `Player 2 Wins`;

        else heading.current.innerText = `Draw`;
        setRefresh(true)
    }

    useEffect(() => {
        setShowButton(false)
        setShowButton(true)
        setRefresh(false)

    }, [refresh])


    return (
        <>
            <div className={` container text-center  `}>
                <h1 className={`${styles.h1} display-1 mb-5`} ref={heading} >Push Button To Play</h1>

                <div className={`${styles.dice} me-md-5`}>
                    <p className={`${styles.p}`}>Player 1</p>
                    <Image className={hide? `d-none`:``} src={img1} alt={'dice1'} width={300} height={300}/>
                </div>

                <div className={`${styles.dice}`}>
                    <p className={`${styles.p}`}>Player 2</p>
                    <Image className={hide? `d-none`:``} src={img2}  alt={'dice2'} width={300} height={300} />
                </div>


                <div className='text-center mt-5'>
                    <button onClick={refreshHandler} className={!showButton ? `btn btn-success w-50 ${styles.gameButton}` : `btn btn-success w-50`}>
                        Roll Dice</button>
                </div>
            </div>
        </>










    )
}