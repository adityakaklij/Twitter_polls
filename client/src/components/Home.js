import React, { useState, useEffect } from 'react'
import axios from "axios"
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Dna } from  'react-loader-spinner'
import { TagsInput } from "react-tag-input-component";

import '../CSS/Home.css'

let newArray = []
let newArrayIDs = []
function Home() {

    
    let StartDate = new Date()
    let StartDateToString = StartDate.toISOString().slice(0, 10)
    
    let priorDate = new Date(new Date().setDate(StartDate.getDate() - 100));
    let priorDateToString = priorDate.toISOString().slice(0, 10)
    // Loader loding
    const[isLoaderTrue, setIsLoaderTrue] = useState(false)
    // For getting input tags
    const [selected, setSelected] = useState([]);

    const [userInput, setUserInput] = useState()
    const [userQuestion, setUserQuestion] = useState("Question")

    const [userStartDate, setUserStartDate] = useState(priorDateToString)
    const [userEndDate, setUserEndDate] = useState(StartDateToString)

    const [data, setData] = useState([{}])
    const [testIds, setTestIds] = useState([])
    const [isTrue, setIsTrue] = useState(false)
    const [responseFromOpenAI, setResponseFromOpenAI] = useState()
    const [userPollsType, setUserPollType] = useState("Completed")
    const [totalVotes, setTotalVotes] = useState()
    const [totalPollCount, setTotalPollCount] = useState()
    const [totalPollOptionCount, setTotalPollOptionCount] = useState()

    const [showFilters, setShowFilter] = useState(false)

    const [individualVoteCount, setIndividualVoteCount] = useState([])
    const [tweetsFinalData, setTweetsFinalData] = useState([])
    const [tweetsFinalData2, setTweetsFinalData2] = useState([])


    // Only true when the polls are rendered! it's for open AI and vote count
    const [isPollsRender, setIsPollRender] = useState(false)
        
        useEffect(() => {
            if(isTrue){
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
            await displayPolls()
            setIsTrue(true)
            // setIsLoaderTrue(false)

        } catch (error) {
            alert("Somthing went wrong :( \n Please try later!")
            console.log(error)
            setIsLoaderTrue(false)
        }
        

    }

    const sendData = async() => {

        setIsPollRender(false)
        setShowFilter(false)
        try {
            setData([{}])
            setTestIds([])
            setIsLoaderTrue(true)
            // const response = await fetch("/add_todo", {
            const response = await fetch("/add_todo", {
                method: "POST",
                headers: {
                   'Content-Type':"application/json" 
                },
                // body:JSON.stringify({"userInput":userInput,"userQuestion":userQuestion, "userStartDate":userStartDate, "userEndDate":userEndDate,
                body:JSON.stringify({"userInput":selected.join(" OR "),"userQuestion":userQuestion, "userStartDate":userStartDate, "userEndDate":userEndDate,
                                     "userPollsType": userPollsType})
    
            })
            if (response.ok){
                console.log("Works!")
    
                callServer()
            }
            else{
                alert("Something went Wrong!")
            }
            
        } catch (error) {
            alert("Somthing went wrong :( \n Please try later!")
            // console.log(error)
        }

        
    }

    const displayPolls = async() => {

        try {
        let sortedTweets = []
        setIsPollRender(true)
        // console.log("data:- ",data) $$$$$$$$$$$$$$$$
        // console.log("data.tweets:- ",data[0]) $$$$$$$$$$$$$$$$
        // newArray.push(data[0].tweets)
        // setResponseFromOpenAI(` Response From OpneAI: \n ${data[3].opneAifuncall}`)
        // console.log(` totalPollCount:-  ${data[5].totalPollCount}`)
        setTotalVotes(data[5].totalVoteCount)
        setTotalPollCount(data[5].totalPollCount)
        setTotalPollOptionCount(data[5].totalPollOptionCount)

        // console.log("tweetsData2:-  ------",data[1].tweetsData2)
        console.log("newTweetVoteCount newTweetVoteCount",data[3].newTweetVoteCount)
        
        
        
        // Need to compair below two arrays.

        setTestIds(data[0].tweets)
        setIndividualVoteCount(data[3].newTweetVoteCount)
        newArray=[]
        
        for (let i = 0; i < testIds.length; i ++){

            newArray.push({"TweetID": testIds[i], "VoteCount": individualVoteCount[i]})
        }
        
        sortedTweets = [...newArray].sort((a, b) => b.VoteCount - a.VoteCount);
        setTweetsFinalData([]);
        console.log("New Array: 0 00 0 0 0 ", sortedTweets)
        newArrayIDs=[]
        for (let i = 0; i < sortedTweets.length; i ++){
            newArrayIDs.push(sortedTweets[i].TweetID)
            setTweetsFinalData(tweetsFinalData => [tweetsFinalData, (sortedTweets[i].TweetID)] ) 
            console.log("<<<<<<<<<<<<<<<<********", sortedTweets[i].TweetID)
        }
        console.log("newArrayIDsnewArrayIDsnewArrayIDs",newArrayIDs)
        // setTweetsFinalData(newArrayIDs);

        // console.log("tweetsFinalData tweetsFinalData ********", sortedTweets)
        // console.log("tweetsFinalData tweetsFinalData <<<<<<<<<<<<<<<<********", tweetsFinalData1)


        // console.log("data:- [0] ",data[0].tweets) $$$$$$$$$$$$$$$$
        setIsLoaderTrue(false)
    
        } catch (error) {
            // alert("Somthing went wrong :( \n Please try later!")
            console.log(error)
        }
        
    }



    const askOpenAI2 = async () => {
        setIsLoaderTrue(true)
        try {

            const response = await fetch("/askAI2", {
                method: "POST",
                headers: {
                   'Content-Type':"application/json" 
                },
                
                body:JSON.stringify({ "userQue":userQuestion })
            })
            // .then(res=>res.json()).then(data1 => {
            //     console.log("data1==data1===data1==data1",data1.OpenAIResoponse)
            // })

            // console.log(response.json)

            let z = await fetch("/askAI").then(res => res.json()).then(data => {
                
                // setData(data)
                setIsLoaderTrue(false)
                console.log("data:-", data.OpenAIResoponse) //$$$$$$$$$$$$$$$$
                console.log("Printing it!")
                setResponseFromOpenAI(data.OpenAIResoponse)
    
            })
            if (response.ok){
                console.log("Works!")
            }
            else{
                alert("Something went Wrong!")
            }
            
        } catch (error) {
            alert("Somthing went wrong :( \n Please try later!")
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
        // setUserInput(e.target.value)
        // console.log(e.target.valu)
        // console.log(selected)
        // setUserInput((selected.join(" OR ")))
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

        {/* <input className='userInput' type="text" onChange={getInput} placeholder='Enter keywords' />  Working old input */}

        <div className='inputTagDiv'>
            <TagsInput classNames={"TagsInput"} value={selected} onChange={setSelected} name="inputTags" separators={[" ", "TAB", ","]}
            placeHolder="Enter Keywords" 
            />
        </div>

        {/* **********Questoin for openAI ************** */}
        {/* <input className='userInput' type="text" onChange={getQuestion} placeholder='Enter your question' /> */}

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
     

        <div > 
            {isPollsRender ? 
                <div> 
                    <div className='ResponsePara my-5'>  
                        <p>Total Votes:- {totalVotes} </p> 
                        <p>Total Polls:- {totalPollCount}</p>    
                        <p>Total Options:- {totalPollOptionCount}</p>    
                    </div> 
                        <button className='showFilterBtn btn-primary' onClick={() => {setShowFilter(!showFilters)}}>Filter</button> 



                </div>
                
                : null}
        </div>
        
        <div className='filtersDiv mt-5'>
            {showFilters ? 

                <div>
                        <p className='FiltersPara'><u> Filters </u></p>
                        {/* Dates input */}
                    <div >
                        <label > Enter Start Date: &nbsp;</label>
                        <input onChange={startDateInput} type="date" />

                        <label >&nbsp;&nbsp; Enter End Date: &nbsp;</label>
                        <input onChange={endDateInput} type="date"  />
                    </div>
                        
                        {/* Polls Type  */}
                    <div className='my-3'>
                        <label htmlFor="PollsType">Poll Type &nbsp;</label>
                        <select name="Poll Type" id="PollsType" onChange={getUserDropDown} > 
                            <option value="Both">Default</option>
                            <option value="Completed">Completed</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>


                    {/* Remove polls with 0 votes */}

                    <div>
                        {/* <p> 0 Votes </p> */}
                    </div>

                    <button className='ApplyFilterBtn btn-primary mx-5' onClick={sendData}>Apply Filter</button>
                        {/* Ask OpenAI */}
                    <div>
                        <p className='FiltersPara'> <u>Ask OpenAI </u>!</p>

                        <div>
                            <input className='userInput' type="text" onChange={getQuestion} placeholder='Enter your question' />
                            <button className='askAIBtn btn-primary mx-5' onClick={askOpenAI2}>Ask AI</button>
                        </div>

                        <p className='ResponsePara my-5'> {responseFromOpenAI}</p>
                    </div>
                </div>
            
            : null}
        </div>
     
        <div className='tweetsContainer'>
           
            { isLoaderTrue? <Dna className="LoaderClass"
            visible={true}
            height="120"
            width="360%"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        /> :  newArrayIDs.map ((newArrayIDs) => (
                <div key={newArrayIDs}  className='card'>
                    <TwitterTweetEmbed  tweetId={newArrayIDs}/>
        {/* /> :  testIds.map ((testIds) => (
                <div key={testIds}  className='card'>
                    <TwitterTweetEmbed  tweetId={testIds}/> */}
                </div>
            ))}
        </div>


    </>
  )
}

export default Home