import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request
import snscrape.modules.twitter as sntwitter
import openai

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPEN_AI_API_KEY") 
app = Flask(__name__)

query = "crypto trading card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image"

tweets =[]
tweetsData=[]
AIConslusion=[]
limit = 50

userInputs =[]
userQuestion=[]
userStartDate=[]
userEndDate=[]
chatGPTAns=[]
pollsDataToChatGPT=[]

colletingData=[]

newFinalString=""

# output_strings = []
class PollOption:
    def __init__(self, label, count):
        self.label = label
        self.count = count

# @app.route("/members")
@app.route("/members2", methods=[ "GET"])
def members2():
    print("Inside the Get function!")

    # for tweet in sntwitter.TwitterSearchScraper(userInputs[0]+" card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image").get_items(): # Working
    # for tweet in sntwitter.TwitterSearchScraper(userInputs[0]+" card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image until:2023-02-19 since:2023-01-01").get_items():
    for tweet in sntwitter.TwitterSearchScraper(userInputs[0]+f" card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image until:{userEndDate[0]} since:{userStartDate[0]}").get_items():
    # for tweet in sntwitter.TwitterSearchScraper(userInputs[0]+f" card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image").get_items():
    
        if (len(tweets) == limit):
            break
        else:
            tweets.append(str(tweet.id))
            # tweetsData.append([ tweet.content, tweet.card.options, tweet.place])
            tweetsData.append([ tweet.content, tweet.card.options ]) # No need of place as it's giving null values
            print("##############################################")
            # print(tweet.content)
            for i in tweet.card.options:
                # colletingData.append([{"options":i.label}, {"choice": i.count}])
                colletingData.append([ {"options":i.label}, {"choice": i.count}])
                # print("i:- ",i.label, " ",i.count)
            # print("colletingData",colletingData)
            # print("##############################################")
            # print( "tweet.",tweet) 
            # print( "tweet.content",tweet.content) 
            # print( "tweet.Is",tweet.id)
            # print("tweetsData:- ------------",tweetsData)
            pollsDataToChatGPT.clear()
            ### Now add the polls data and votes into below array
            # pollsDataToChatGPT.append()
            ### Sending, userQuestion, PollData
            # openAICall(userQuestion[0], pollsDataToChatGPT[0])


            

            # print("final_string:----------",final_string)
            # opneAifuncall = openAICall(final_string)
            # print( "opneAifuncall:- ---------", opneAifuncall)
    # opneAifuncall = openAICall(final_string)
    # print( "opneAifuncall:- ---------", opneAifuncall)
    output_strings = []
    for i, (description, options) in enumerate(tweetsData, start=1):
        option_strings = []
        vote_count=[]
        for j, option in enumerate(options, start=1):
            option_string = f"{j}] {option.label} ({option.count})"
                    # print("option Count :- ", f"{j} {option.count}")
            z = f"{j} {option.count}"
            vote_count.append(option.count)
                    
            option_strings.append(option_string)
        options_string = ', '.join(option_strings)
        output_string = f"{i}] {description}\n Options are:- \n {options_string} \n Total:- {sum(vote_count)} Votes \n"
        output_strings.append(output_string)
            
    final_string = '\n'.join(output_strings)
    # opneAifuncall = openAICall(final_string) #==============================================================THis is main
    # print( "opneAifuncall:- ---------", opneAifuncall) #==============================================================THis is main

    newFinalString = final_string
    print("newFinalString ---- -- -- -", newFinalString)
    # return [{"tweets": tweets}, {"tweetsData": tweetsData},{"AIConclusion":AIConslusion}, {"tweetsV0tes":colletingData}, {"chatGPTAns":chatGPTAns}]
    return [{"tweets": tweets}, {"tweetsData": tweetsData},{"AIConclusion":AIConslusion}, {"opneAifuncall":"opneAifuncall"}, {"chatGPTAns":chatGPTAns}]


@app.route('/add_todo', methods=["POST", "GET"])
def add_todo():
    print("Inside the post from front end")
    todo_data = request.get_json()
    print("todo_data")
    print("todo_data.userInput:- ",todo_data['userInput'])
    print("todo_data.userQuestion:- ",todo_data['userQuestion'])
    print("todo_data.userStartDate:- ",todo_data['userStartDate'])
    print("todo_data.userEndDate:- ",todo_data['userEndDate'])
    userInputs.clear()
    userQuestion.clear()
    userStartDate.clear()
    userEndDate.clear()
    tweets.clear()
    tweetsData.clear()
    userStartDate.append(todo_data['userStartDate'])
    userEndDate.append(todo_data['userEndDate'])
    userInputs.append(todo_data['userInput'])
    userQuestion.append(todo_data['userQuestion'])
    # openAICall(todo_data['userQuestion'])
    print("userInputs", userInputs)

    return 'Done', 201


def openAICall(userQue):
    print("We are Inside the openAICall function")
    print("OpenAi working properly, just print the userInput question and polls output here")
    print("Uestion:- ", userQue)
    model_engin = "text-davinci-003"
    
    # prompt=[f"Analyse following poll data and on basis of this analysis the current situation of the crypto market and crypto conditions \n {userQue}"]
    prompt=[f"{userQuestion[0]} \n {userQue}"]
    
    completion = openai.Completion.create(
        engine=model_engin,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    print("response from the openAi:-  ",response)
    chatGPTAns.clear()
    chatGPTAns.append(response)
    return(response)


if __name__ == "__main__":
    app.run(debug=True)