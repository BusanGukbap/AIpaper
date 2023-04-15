import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import openai
import json
import tokens

'''
article:dict = {'title:str', 'sections:list'}
sections:list = [section:dict]
section:dict = {'subtitle':str, 'content':str}
'''
class Gpt:
    def __init__(self, article:dict,temprature:float = 0.5, max_tokens:int = 200):
    # OpenAI API key
        openai.api_key = tokens.gpt_key
        # Parameters for the API request
        self.model_engine = "gpt-3.5-turbo"  # GPT-3.5 Turbo
        self.temperature = temprature
        self.max_tokens = max_tokens
        self.article = article
        # self.message = ["role":"system", ]
        # message to generate text from
        for d in self.article['sections']:
            text = d['content']
            self.message.append({"role":"user", "content":text})
    
    def getresponse(self):
        # Call the OpenAI GPT API and get the response
        self.response = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=self.message,
            #temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.response
  
''' message set
  def setmessage(self):
    # message to generate text from
    for d in self.article['sections']:
      title = d['subtitle']
      text = d['content']
      self.message.append({"role":"user", "content":text})
'''
  
# Print the generated text from the response
if (__name__ == '__main__'):
    g = Gpt()
    res = g.getresponse
    print(res)
    print()
    print(res.choices[0].message["content"])
