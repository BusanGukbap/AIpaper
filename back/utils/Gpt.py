import openai
import tiktoken
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import tokens

#article:dict = {'section':list}

class Gpt:
    def __init__(self):
        # OpenAI API key
        openai.api_key = tokens.gpt_key
        # Parameters for the API request
        self.model_engine = 'gpt-3.5-turbo'
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.tokenizer = tiktoken.encoding_for_model("gpt-3.5-turbo")

    def checktoken(self, text):
        return len(self.tokenizer.encode(text))
    
    def getsummary(self):
        # Call the OpenAI GPT API and get the response
        text = ''
        tokenover = len(self.message)
        for i in range(tokenover):
            if (i==0):
                prompt = [{'role': 'user', 'content': f'Summarize the following article in 10 sentences : {self.message[i]}'}]
            elif (i>0):
                prompt = [{'role': 'user', 'content': f'Summarize the following article in 10 sentences : {text} {self.message[i]}'}]
            self.summary = openai.ChatCompletion.create(
                model = self.model_engine,
                messages = prompt,
                # temperature=temperature,
                max_tokens=self.max_tokens,
            )
            text = self.summary['choices'][0]['message']['content']
        return self.summary
    # message set
    # def setmessage(self, type:str = 'sentences', number:int = 5, article: dict, max_tokens: int = 200, temprature: float = 0.5):

    def setmessage(self, article: dict, temprature: float = 0.5):
        # message to generate text from
        self.temperature = temprature
        self.max_tokens = 0
        # message to generate text from
        text = ''
        self.message = []
        for d in article['sections']:
            text = text + d
            if (self.checktoken(text) > 3000):
                if (self.max_tokens < 4000-self.checktoken(text)):
                  self.max_tokens = 4000-self.checktoken(text)
                self.message.append(text)
                #self.prompt.append([{'role': 'user', 'content': f'Summarize the following article in 3 sentences : {text}'}])
                text = ''
        if (self.max_tokens < 4000-self.checktoken(text)):
            self.max_tokens = 4000-self.checktoken(text)
        self.message.append(text)

    def high_difficulty(self):
        text = self.summary['choices'][0]['message']['content']
        self.highdiff = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=[{'role': 'user', 'content': f'Change it to high school level vocabulary : {text}'}],
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.highdiff

    def low_difficulty(self):
        text = self.summary['choices'][0]['message']['content']
        self.lowdiff = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=[{'role': 'user', 'content': f'Change it to elementary school level vocabulary : {text}'}],
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.lowdiff
      
    def middle_difficulty(self):
        text = self.summary['choices'][0]['message']['content']
        self.middiff = openai.ChatCompletion.create(
            model=self.model_engine,
            messages=[{'role': 'user', 'content': f'Change it to middle school level vocabulary : {text}'}],
            # temperature=temperature,
            max_tokens=self.max_tokens,
        )
        return self.middiff

    def all_response(self):
        summary = self.getsummary()['choices'][0]['message']['content']
        difficulty = {
            'easy': self.low_difficulty()['choices'][0]['message']['content'],
            'hard': self.high_difficulty()['choices'][0]['message']['content'],
            'normal': self.middle_difficulty()['choices'][0]['message']['content']
        }
        self.response = {'summary':summary, 'difficulty': difficulty}
        return self.response



#Find paragraphs related to 'keyword'
# Print the generated text from the response
if (__name__ == '__main__'):
    g = Gpt()
    article = {'sections': ['Monday marks the 25th anniversary of the Good Friday Agreement, which brought peace to Northern Ireland after a 30-year period of sectarian conflict known as the Troubles. Decades after the Irish War of Independence led to the island\'s partition, the conflict escalated in the late 1960s, amid swelling anger at discrimination towards the province\'s Irish Catholics. The IRA, mainly comprising Irish Catholics, sought to liberate the north from British rule and reunite it with the Republic of Ireland. This was opposed by the British Army and loyalist paramilitary groups such as the UDA and UVF, mainly comprising Protestants, who sought to keep Northern Ireland a part of the United Kingdom.']}
    g.setmessage(article)
    res = g.all_response()
    print(res)
    # print()
    '''
    print(res['choices'][0]['message']['content'])
    print()
    res = g.raise_difficulty()
    print(res['choices'][0]['message']['content'])
    print()
    res = g.lower_difficulty()
    print(res['choices'][0]['message']['content'])
    '''
