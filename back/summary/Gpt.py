import tokens
import json
import openai
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))


'''
article:dict = {'title:str', 'sections:list'}
sections:list = [section:dict]
section:dict = {'subtitle':str, 'content':str}
'''


class Gpt:
    def __init__(self):
        # OpenAI API key
        openai.api_key = tokens.gpt_key
        # Parameters for the API request
        self.model_engine = 'gpt-3.5-turbo'  # GPT-3.5 Turbo

    def getresponse(self):
        # Call the OpenAI GPT API and get the response
        self.response = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=self.message,
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.response
    # message set
    # def setmessage(self, type:str = 'sentences', number:int = 5, article: dict, max_tokens: int = 200, temprature: float = 0.5):

    def setmessage(self, article: dict, max_tokens: int = 200, temprature: float = 0.5):
        # message to generate text from
        self.temperature = temprature
        self.max_tokens = max_tokens
        # message to generate text from
        text = ''
        for d in article['sections']:
            text = text + (d['content'])
        self.message = [
            {'role': 'user', 'content': f'Summarize the following article in 3 sentences : {text}'}]


# Print the generated text from the response
if (__name__ == '__main__'):
    g = Gpt()
    article = {'sections': [{'content': 'Monday marks the 25th anniversary of the Good Friday Agreement, which brought peace to Northern Ireland after a 30-year period of sectarian conflict known as the Troubles. Decades after the Irish War of Independence led to the island’s partition, the conflict escalated in the late 1960s, amid swelling anger at discrimination towards the province’s Irish Catholics. The IRA, mainly comprising Irish Catholics, sought to liberate the north from British rule and reunite it with the Republic of Ireland. This was opposed by the British Army and loyalist paramilitary groups such as the UDA and UVF, mainly comprising Protestants, who sought to keep Northern Ireland a part of the United Kingdom.'}]}
    g.setmessage(article)
    res = g.getresponse()
    # print(res)
    # print()
    print(res['choices'][0]['message']['content'])
