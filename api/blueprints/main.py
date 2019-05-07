import json
import random
import jwt
import datetime
from api.api_utils import json_res
from flask import  Blueprint, request, make_response, jsonify
from api.dao.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from api.config import BaseConfig
main = Blueprint('main', __name__)


@main.route('/')
@main.route('/home', methods=['GET'])
def index():
    return json_res({'index': 'hello world'}, 200)


def prepare_response(speech):
    response_dict = {
        "speech": speech,
        "displayText": speech,
        "source": "medbot"
    }
    jsonified_response = json.dumps(response_dict, indent=2)
    print(f"Bot says: ")
    print(jsonified_response)
    print()
    print()
    res = make_response(jsonified_response)
    res.headers["Content-Type"] = "application/json"
    return res


@main.route("/", methods=['POST'])
def webhook():
    print(request.json)
    dict_json = request.json
    # user_msg: str = dict_json["result"]["resolvedQuery"]
    # context_dict: dict = dict_json["result"]["contexts"][0]
    # context_name: str = context_dict["name"]
    # context_parameters_dict: dict = dict_json["result"]["parameters"]
    # intent_name: str = dict_json["result"]["metadata"]["intentName"]
    # lifespan: int = context_dict["lifespan"]

    # speech = ""

    # print()
    # print()
    # print("~"*20)
    # print("USER")
    # print(f"user sent message: {user_msg}")
    # print(f"with intent: {intent_name}")
    # print(f"context: {context_name}")
    # print(f"lifespan: {lifespan}")
    # print(f"context parameters are: "
    #       f"{' '.join([' '.join([k, v]) for k, v in context_parameters_dict.items()])}")
    # print("~"*20)

    if context_name == "feeling":
        # feeling lifespan is set to 12
        if intent_name == "Default Welcome Intent":
            speech = random.choice(
                ["My name is Bot - MEDBot and I'm thrilled to be performing "
                 "a medical interview with You today! How are You feeling today?",
                 "Hi there. I'm the MEDBot and I'm lucky to be performing "
                 "a medical interview with You today! How are You feeling today?",
                 "Hey. I'm the MEDBot and I can't wait to finally perform "
                 "a medical interview scheduled for today with You! How are You feeling today?"])
            lifespan = 0
        if intent_name == "Default Fallback Intent":
            if lifespan % 3 == 2:
                speech = random.choice(
                    ["How do You feel today?", "How are You feeling?", "How do You feel?"])
            if lifespan % 3 == 1:
                speech = random.choice(
                    ["You forgot to answer my question: `How do You feel today?`",
                     "You still haven't answered the main question: `How do You feel today?`",
                     "Please answer my question: `How are You feeling today?`"])
            if lifespan % 3 == 0:
                speech = random.choice(
                    ["OK. You're being annoying to me... I have a plenty of time, "
                     "so if You feel like messing around with me - that's fine. "
                     "I'll be simply looping my answers, so that it gets boring to You. "
                     "Have fun. `How are You feeling?`",
                     "It's not nice from You. I'm just trying to do my job well, feed my kids..."
                     "You know how it is. So please cooperate with me and answer the question:"
                     "`How do You feel today?` If You don't answer, I'll be looping my responses"
                     "and You won't hear anything interesting from me anymore. "
                     "The choice belongs to You."])
    elif context_name == "medicine":
        if intent_name == "Feeling good":
            if context_parameters_dict["Mood"] == "good":
                speech = random.choice(
                    ["That's a great news! I'm really glad. Did You remember to take all "
                     "Your medicine last night?",
                     "Cool, cool! I'm really happy to hear that. Did You take all "
                     "Your medicine?",
                     "That's really graet news! I'm really happy for You. Did You remember"
                     "to take all Your drugs?"])
            if context_parameters_dict["Mood"] == "bad":
                speech = random.choice(
                    ["That's a bad news. Hopefully You'll feel better by the end "
                     "of the interview. Did You remember to take all Your medicines "
                     "last night?",
                     "I'm really sorry to hear that. Maybe I'll manage "
                     "to cheer You up during the interview. Did You take all Your drugs?"])
            if context_parameters_dict["Mood"] == "mediocre":
                speech = random.choice(
                    ["It's not that bad, right? Keep smiling and it will only get better!"
                     "Did You remember to take all Your medicine?",
                     "Could be worse, I guess ;) Did You remember to take all Your medicine?"])
            lifespan = 0
        if intent_name == "Default Fallback Intent":
            if lifespan % 3 == 2:
                speech = random.choice(
                    ["Did You take all Your drugs?", "Did You remember to take Your medicine?",
                     "Did You remember to take all Your drugs?"])
            if lifespan % 3 == 1:
                speech = random.choice(
                    ["You forgot to answer my question: `Did You remember to take all Your drugs?`",
                     "You must have missed my question. `Did You remember to take Your medicine?`",
                     "You didn't answer my question. `Did You take all Your drugs?`"])
            if lifespan % 3 == 0:
                speech = random.choice(
                    ["That's annoying. You don't answer my question. Let's not waste each "
                     "others time. Please answer the question: `Did You take Your medicine?`",
                     "OMG. Just answer the question already. `Did You take all Your drugs?`",
                     "You're just being mean. That's fine. I'll keep asking You then: "
                     "`Did You remember to take Your medicine?`"])
    elif context_name == "exercise":
        if intent_name == "Drugs taken":
            if context_parameters_dict["Confirm"] == "yes":
                speech = random.choice(["Great memory, that's awesome. I assume You "
                                        "remembered about rehab exercises as well?",
                                        "Good job! Did you do Your rehab exercises as well?"])
            if context_parameters_dict["Confirm"] == "no":
                speech = random.choice(["You should care about it more! Go take them "
                                        "immediately and come back. Did you at least do "
                                        "Your rehab exercises?",
                                        "Go get them right away and tell me if you have "
                                        "done Your rehab exercises."])
            if context_parameters_dict["Confirm"] == "dk":
                speech = random.choice(["You're weird. How could you forget "
                                        "about such an important thing? Never mind."
                                        "Did You at least remember to do Your exercises?",
                                        "I hope You have at least remembered to do Your"
                                        "rehab exercises?"])
            lifespan = 0
        if intent_name == "Default Fallback Intent":
            if lifespan % 3 == 2:
                speech = random.choice(
                    ["Have You done Your rehab exercises?", "Did You remember to do the exercises?",
                     "Did You do Your rehab exercises?"])
            if lifespan % 3 == 1:
                speech = random.choice(
                    ["You still haven't answered my question: "
                     "`Did You remember to do Your exercises?`",
                     "You didn't answer my question! `Did You do all Your exercises?`",
                     "Please, answer my question. `Have You done all Your rehab exercises?`"])
            if lifespan % 3 == 0:
                speech = random.choice(
                    ["Gosh. Can't You really answer my question?! Please, let's respect each other"
                     "like real adults. Please answer my question: `Did You do rehab exercises?`",
                     "If You won't answer my question, I'll keep asking You it over and over again."
                     " Trust me - it gets annoying pretty fast. So please answer my question: "
                     "`Have You done all Your rehab exercises?`",
                     "Please, just answer my question. The sooner You answer all of them, "
                     "the faster You can stop talking to me if that's what's bothering You. "
                     "So please, answer my question. `Did You do all Your rehab exercises?`"])
    elif context_name == "exercise":
        if intent_name == "Exercise Done":
            if context_parameters_dict["Confirm"] == "yes":
                speech = "Great! We'll end up our conversation now! Have a great day! Submit to send interview."
                lifespan = 0
            if context_parameters_dict["Confirm"] == "no":
               speech = "Too bad. Remember to do them next time. Have a great day! Submit to send interview."
        if intent_name == "Default Fallback Intent":
            speech = "Too bad. Remember to do them next time. Have a great day! Submit to send interview."
            if lifespan % 3 == 2:
                speech = random.choice(
                    ["Have You done Your rehab exercises?", "Did You remember to do the exercises?",
                     "Did You do Your rehab exercises?"])
            if lifespan % 3 == 1:
                speech = random.choice(
                    ["You still haven't answered my question: "
                     "`Did You remember to do Your exercises?`",
                     "You didn't answer my question! `Did You do all Your exercises?`",
                     "Please, answer my question. `Have You done all Your rehab exercises?`"])
            if lifespan % 3 == 0:
                speech = random.choice(
                    ["Gosh. Can't You really answer my question?! Please, let's respect each other"
                     "like real adults. Please answer my question: `Did You do rehab exercises?`",
                     "If You won't answer my question, I'll keep asking You it over and over again."
                     " Trust me - it gets annoying pretty fast. So please answer my question: "
                     "`Have You done all Your rehab exercises?`",
                     "Please, just answer my question. The sooner You answer all of them, "
                     "the faster You can stop talking to me if that's what's bothering You. "
                     "So please, answer my question. `Did You do all Your rehab exercises?`"])
        if intent_name == "Exercise Done(not)":
            speech = "Too bad. Remember to do them next time. Have a great day! Submit to send interview."
        
    # if not speech:
    #     speech: random.choice(
    #         ["I'm sorry, but I have no clue what You're talking about "
    #          "at the moment. Could You please answer to my questions!"
    #          "I promise to improve soon and be able to talk on a way"
    #          "higher level. Thanks for Your patience!",
    #          "I'm sorry, I didn't get what You mean. Could You please"
    #          "try to paraphrase it? Or better yet stick to answering"
    #          "my questions? I'll try to improve my conversational skills"
    #          "so that we can talk on a higher level soon! Thanks for Your patience!"])
    return prepare_response(speech)


@main.route('/authenticate', methods=['POST'])
def auth():
    req = request.get_json(force=True)
    user = User.query.filter_by(email=req['email']).first()
    if not user:
        return jsonify({'error': 'Could not verify'}), 404

    if check_password_hash(user.password, req['password']):
        if user.passwordChange <= datetime.datetime.now():
            return jsonify({'userID': user.id, 'passwordchange': True})
        token = jwt.encode({'user_id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, BaseConfig.SECRET_KEY, algorithm='HS256')
        print(user.id, user.roleID)
        return jsonify({'token' : token.decode('UTF-8'), 'userID': user.id, "roleID": user.roleID})
        
    return jsonify({'error': 'Could not verify'}), 400
    
@main.route('/changepassword', methods=['PUT'])
def changePassword():
    req = request.get_json(force=True)
    changed = User.changePassword(req)
    if changed:
        return jsonify({'changed': True})
    else:
        return jsonify({'error': 'Error try again'}), 400
