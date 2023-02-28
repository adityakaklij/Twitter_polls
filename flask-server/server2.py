import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request,render_template,send_file
from flask.helpers import send_from_directory
import snscrape.modules.twitter as sntwitter
import openai
 
load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPEN_AI_API_KEY") 

app = Flask(__name__)
# app = Flask(__name__, static_url_path='')
# app = Flask(__name__, static_folder="./build", static_url_path='/')
# app = Flask(__name__, static_folder='../../client/build',static_url_path='')


# @app.route('/')
# def index():
#     return app.send_static_file('index.html')


# @app.route("/../../client/build")
# def serve_static(path):
#     return send_from_directory("../../client/build/", path)

# @app.route("/", defaults={'path':''})
# def serve(path):
#     return send_from_directory(app.static_folder,'index.html')

query = "crypto trading card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image"

tweets =[]
tweetsData=[]
tweetsData2=[]
AIConslusion=[]
limit = 50

# Keep track of votes for each tweetId
newTweetVoteCount=[]
userInputs =[]
userQuestion=[]
userStartDate=[]
userEndDate=[]
chatGPTAns=[]

userPolls = []
userQuestion2=[]

newFinalString=[]


# output_strings = []
class PollOption:
    def __init__(self, label, count):
        self.label = label
        self.count = count

@app.route("/members2")
def members2():
    print("Inside the Get function!")

    # for tweet in sntwitter.TwitterSearchScraper(userInputs[0]+" card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image").get_items(): # Working
    
    for tweet in sntwitter.TwitterSearchScraper(f"({userInputs[0]})+ card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image lang:en until:{userEndDate[0]} since:{userStartDate[0]}").get_items():
    # for tweet in sntwitter.TwitterSearchScraper(f"something + card_name:poll2choice_text_only OR card_name:poll3choice_text_only OR card_name:poll4choice_text_only OR card_name:poll2choice_image OR card_name:poll3choice_image OR card_name:poll4choice_image lang:en until:{userEndDate[0]} since:{userStartDate[0]}").get_items():

    
        if (len(tweets) == limit):
            break
        else:
            if(userPolls[0] == "Completed"):
                if(tweet.card.finalResults):

                    tweets.append(str(tweet.id))
                    tweetsData.append([tweet.content, tweet.card.options ])
                    tweetsData2.append([tweet.id, tweet.content, tweet.card.options, str(tweet.id) ])

     
                    print("######x########################################")
                else:
                    print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            
            elif (userPolls[0] == "Active"):
                if(tweet.card.finalResults == False):
                    tweets.append(str(tweet.id))
                    tweetsData.append([tweet.content, tweet.card.options ])
                    tweetsData2.append([tweet.id, tweet.content, tweet.card.options, str(tweet.id) ])
                    print("######x########################################")
                else:
                    print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
            else:
                tweets.append(str(tweet.id))
                tweetsData.append([tweet.content, tweet.card.options ])
                tweetsData2.append([tweet.id, tweet.content, tweet.card.options, str(tweet.id) ])
                print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")

         
    output_strings = []
    totalVoteCount = 0
    totalPollOptionCount  = 0
    newTweetVoteCount.clear()
    for i, (description, options) in enumerate(tweetsData, start=1):
        option_strings = []
        vote_count=[]
        for j, option in enumerate(options, start=1):
            totalPollOptionCount += 1
            option_string = f"{j}] {option.label} ({option.count})"
            # print("}}}}}}}}}}}}}}}}}}}}}")
            # print("option Count :- ", f"{j} {option.count}")
            z = f"{j} {option.count}"
            totalVoteCount = totalVoteCount +  option.count
            vote_count.append(option.count)
            # print("vote_count",vote_count)
                    
            option_strings.append(option_string)
        options_string = ', '.join(option_strings)

        newTweetVoteCount.append(sum(vote_count))
        # if(sum(vote_count) == 0):
        if(sum(vote_count) >= 25):
            output_string = f"{i}] {description}\n Options are:- \n {options_string} \n Total:- {sum(vote_count)} Votes \n"
            output_strings.append(output_string)
        else:
            pass
    print("New test arr^^^^^^^^^^^^^^", newTweetVoteCount)
    final_string = '\n'.join(output_strings)
    print("print(m[:1500])print(m[:1500])print(m[:1500])", final_string)
    # opneAifuncall = openAICall(final_string) #==============================================================THis is main
    # print( "opneAifuncall:- ---------", opneAifuncall) #==============================================================THis is main

    newFinalString.append(final_string)
    print("newFinalString ---- -- -- -", newFinalString[0])
    return [{"tweets": tweets}, {"tweetsData": tweetsData},{"AIConclusion":AIConslusion}, {"newTweetVoteCount":newTweetVoteCount},
            {"chatGPTAns":chatGPTAns}, {"totalVoteCount":totalVoteCount, "totalPollCount": limit, "totalPollOptionCount": totalPollOptionCount},
            {"tweetsData2":tweetsData2}]


@app.route('/add_todo', methods=["POST", "GET"])
def add_todo():
    print("Inside the post from front end")
    todo_data = request.get_json()
    # print("todo_data")
    # print("todo_data.userInput:- ",todo_data['userInput'])
    # print("todo_data.userQuestion:- ",todo_data['userQuestion'])
    # print("todo_data.userStartDate:- ",todo_data['userStartDate'])
    # print("todo_data.userEndDate:- ",todo_data['userEndDate'])
    # print("todo_data.user Selected Polls:- ",todo_data['userPollsType'])
    userInputs.clear()
    userQuestion.clear()
    userStartDate.clear()
    userEndDate.clear()
    tweets.clear()
    tweetsData.clear()
    userPolls.clear()
    userStartDate.append(todo_data['userStartDate'])
    userEndDate.append(todo_data['userEndDate'])
    userInputs.append(todo_data['userInput'])
    userQuestion.append(todo_data['userQuestion'])
    userPolls.append(todo_data['userPollsType'])
    
    # print("userInputs", userInputs)

    return 'Done', 201

@app.route('/askAI', methods=["GET"])
def askAI():
    print("Inside the askAI func")
    # print("newFinalString:- ",newFinalString[0])
    
    opneAifuncall = openAICall(userQuestion2[0]) #==============================================================THis is main
    print( "opneAifuncall:- ---------", opneAifuncall) #==============================================================THis is main?
    return {"OpenAIResoponse": opneAifuncall}
    # return {"OpenAIResoponse": userQuestion2[0]}



@app.route('/askAI2', methods=["POST","GET"])
def askAI2():
    print("Inside the askAI2 func")
    inputFromUser = request.get_json()
    print("inputFromUser --  --- ", inputFromUser['userQue'])
    userQuestion2.clear()
    userQuestion2.append(inputFromUser['userQue'])

    return {"OpenAIResoponse": inputFromUser['userQue']}


def openAICall(userQue):
    print("We are Inside the openAICall function")
    print("Uestion:- ", userQue)
    model_engin = "text-davinci-003"
    
    # prompt=[f"Analyse following poll data and on basis of this analysis the current situation of the crypto market and crypto conditions \n {userQue}"]
    # prompt=[f"{userQuestion[0]} \n {userQue}"]
    # prompt=[f" Analysis the following data \n {userQue}"]
    prompt=[f"{userQue}:- {(newFinalString[0])[:1500]}"]
    
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