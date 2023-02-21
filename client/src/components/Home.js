import React, { useState, useEffect } from 'react'
import axios from "axios"
import { TwitterTweetEmbed } from 'react-twitter-embed';
import '../CSS/Home.css'

let newArray = []
// var data = [{}]
function Home() {

    const [userInput, setUserInput] = useState()
    const [userQuestion, setUserQuestion] = useState()

    const [userStartDate, setUserStartDate] = useState()
    const [userEndDate, setUserEndDate] = useState()

    const [data, setData] = useState([{}])
    const [testIds, setTestIds] = useState([])
    const [isTrue, setIsTrue] = useState(false)
    // const [responseFromOpenAI, serResponseFromOpenAI] = useState("")
    const [responseFromOpenAI, serResponseFromOpenAI] = useState()


        useEffect(() => {
            if(isTrue){
                displayPolls()
            }            
        }, [isTrue])
    
    const callServer = async() => {
        // fetch("/members").then(res => res.json()).then(data => {
        let z = await fetch("/members2").then(res => res.json()).then(data => {
            // setData(data)
            setData(data)
            console.log(data)
        })
        // await z.wait()
        console.log("Inside fetch get")
        displayPolls()
        // setIsTrue(true)

    }

    const getInput = (e) =>{
        setUserInput(e.target.value)
    }

    const getQuestion = (e) =>{
        setUserQuestion(e.target.value)
    }


    const sendData = async() => {
        const response = await fetch("/add_todo", {
            method: "POST",
            headers: {
               'Content-Type':"application/json" 
            },
            body:JSON.stringify({"userInput":userInput,"userQuestion":userQuestion, "userStartDate":userStartDate, "userEndDate":userEndDate})
            // body:({"useInput":userInput,"userQuestion":userQuestion})

        })
        if (response.ok){
            console.log("Works!")

            callServer()
        }
    }

    const displayPolls = async() => {
        // data.tweets 
        // data.cl
        console.log("data:- ",data)
        console.log("data.tweets:- ",data[0])
        newArray.push(data[0].tweets)
        serResponseFromOpenAI(` Response From OpneAI: \n ${data[3].opneAifuncall}`)
        console.log("Data of 2 ", data[3].opneAifuncall)
        setTestIds([])
        setTestIds(data[0].tweets)
        console.log("data:- [0] ",data[0].tweets)
        // for(let i = 0; i < (data.tweets).length; i ++){
        //     console.log(data.tweets[i])
        //     newArray.push(toString(data.tweets[i]))
        // }
    }

    const startDateInput = (e) =>{
        setUserStartDate(e.target.value)
    }

    const endDateInput = (e) =>{
        setUserEndDate(e.target.value)
    }
  return (
    
    <>
        <h2>Test </h2>

        <div>
        <input className='userInput' type="text" onChange={getInput} placeholder='Enter keywords' />
        <input className='userInput' type="text" onChange={getQuestion} placeholder='Enter your question' />

        <button className='getPollsBtn btn-primary mx-5' onClick={sendData}>Get Polls</button>
        <button className='btn-primary my-5' onClick={displayPolls}>displayPolls</button>
        <br /><br />
        </div>

{/* 1. sendData
    2. CallServer
    3. Display polls
     */}    
        <div>

        <label > Enter Start Date</label>
        <input onChange={startDateInput} type="date"  />

        <label > Enter End Date</label>
        <input onChange={endDateInput} type="date"  />
        </div>
     
     <p className='ResponsePara my-5'> {responseFromOpenAI}</p>
     


        <div  className='tweetsContainer'>
            { testIds.map ((testIds) => (
            <div key={testIds} className='card'>
                <TwitterTweetEmbed  tweetId={testIds}/>
            </div>
            ))}
        </div>
    </>
  )
}

export default Home