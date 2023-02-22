import React, { useState, useEffect } from 'react'
import axios from "axios"
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Dna } from  'react-loader-spinner'
import '../CSS/Home.css'

let newArray = []
// var data = [{}]
function Home() {

    
    let StartDate = new Date()
    let StartDateToString = StartDate.toISOString().slice(0, 10)
    
    let priorDate = new Date(new Date().setDate(StartDate.getDate() - 20));
    let priorDateToString = priorDate.toISOString().slice(0, 10)
    const[isLoaderTrue, setIsLoaderTrue] = useState(false)

    const [userInput, setUserInput] = useState()
    const [userQuestion, setUserQuestion] = useState("Question")

    const [userStartDate, setUserStartDate] = useState(priorDateToString)
    const [userEndDate, setUserEndDate] = useState(StartDateToString)

    const [data, setData] = useState([{}])
    const [testIds, setTestIds] = useState([])
    const [isTrue, setIsTrue] = useState(false)
    const [responseFromOpenAI, serResponseFromOpenAI] = useState()
    const [userPollsType, setUserPollType] = useState("Both")
        

        useEffect(() => {
            if(isTrue){
                // setTestIds([])
                displayPolls()
            }            
        }, [isTrue, testIds])
    
    const callServer = async() => {
        try {
            let z = await fetch("/members2").then(res => res.json()).then(data => {
                setData(data)
                console.log("data:-", data) //$$$$$$$$$$$$$$$$
    
            })
            console.log("Inside fetch get")
            setIsTrue(true)
            displayPolls()
            // setIsLoaderTrue(false)

        } catch (error) {
            // alert("Somthing went wrong :( \n Please try later!")
            console.log(error)
        }
        

    }

    const sendData = async() => {

        try {
            setData([{}])
            setTestIds([])
            setIsLoaderTrue(true)
            const response = await fetch("/add_todo", {
                method: "POST",
                headers: {
                   'Content-Type':"application/json" 
                },
                body:JSON.stringify({"userInput":userInput,"userQuestion":userQuestion, "userStartDate":userStartDate, "userEndDate":userEndDate,
                                     "userPollsType": userPollsType})
                // body:({"useInput":userInput,"userQuestion":userQuestion})
    
            })
            if (response.ok){
                console.log("Works!")
    
                callServer()
            }
            
        } catch (error) {
            alert("Somthing went wrong :( \n Please try later!")
            // console.log(error)
        }

        
    }

    const displayPolls = async() => {

        try {
        // console.log("data:- ",data) $$$$$$$$$$$$$$$$
        // console.log("data.tweets:- ",data[0]) $$$$$$$$$$$$$$$$
        newArray.push(data[0].tweets)
        serResponseFromOpenAI(` Response From OpneAI: \n ${data[3].opneAifuncall}`)
        // console.log("Data of 2 ", data[3].opneAifuncall) $$$$$$$$$$$$$$$$
        // setTestIds([])
        setTestIds(data[0].tweets)
        // console.log("data:- [0] ",data[0].tweets) $$$$$$$$$$$$$$$$
        setIsLoaderTrue(false)
    
        } catch (error) {
            // alert("Somthing went wrong :( \n Please try later!")
            console.log(error)
        }
        
    }

    const startDateInput = (e) =>{
        setUserStartDate(e.target.value)
        console.log(e.target.value)
    }
    
    const endDateInput = (e) =>{
        setUserEndDate(e.target.value)
        console.log(e.target.value)
    }

    const getInput = (e) =>{
        setUserInput(e.target.value)
    }

    const getQuestion = (e) =>{
        setUserQuestion(e.target.value)
    }

    const getUserDropDown = (e) =>{
        setUserPollType(e.target.value)
    }
  return (
    
    <>
        <h2> </h2>

        <div className='MainContainer'>
        <input className='userInput' type="text" onChange={getInput} placeholder='Enter keywords' />
        <input className='userInput' type="text" onChange={getQuestion} placeholder='Enter your question' />

        <button className='getPollsBtn btn-primary mx-5' onClick={sendData}>Get Polls</button>
        {/* <button className='btn-primary my-5' onClick={displayPolls}>displayPolls</button> */}
        <br /><br />
        </div>


        
        {/* ****************  Dates Input ************* */}
        {/* <div>
            <label > Enter Start Date: &nbsp;</label>
            <input onChange={startDateInput} type="date" />

            <label > Enter End Date: &nbsp;</label>
            <input onChange={endDateInput} type="date"  />
        </div> */}
     

            {/* ******************** User Choice for Default, Active, Completed */}
        {/* <label htmlFor="PollsType">Poll Type &nbsp;</label>
        <select name="Poll Type" id="PollsType" onChange={getUserDropDown} > Choodr 
            <option value="Both">Default</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
        </select> */}


        {/* ********************* Response From OpenAI********************* */}
     {/* <p className='ResponsePara my-5'> {responseFromOpenAI}</p> */}
     


     
        <div  className='tweetsContainer'>
            { isLoaderTrue? <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        /> :  testIds.map ((testIds) => (
                <div key={testIds}  className='card'>
                    <TwitterTweetEmbed  tweetId={testIds}/>
                </div>
            ))}
        </div>

{/* Working properly!! */}

{/*      
        <div  className='tweetsContainer'>
            { isLoaderTrue? <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        /> :  testIds.map ((testIds) => (
                <div  className='card'>
                    <TwitterTweetEmbed  tweetId={testIds}/>
                </div>
            ))}
        </div> */}


    </>
  )
}

export default Home