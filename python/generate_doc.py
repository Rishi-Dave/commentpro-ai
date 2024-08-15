from openai import AzureOpenAI
import os
import dotenv
import sys

dotenv.load_dotenv()

client = AzureOpenAI(
  azure_endpoint = os.environ["AZURE_OPENAI_ENDPOINT"], 
  api_key=os.environ['AZURE_OPENAI_API_KEY'],  
  api_version = "2023-10-01-preview"
)

deployment=os.environ['AZURE_OPENAI_DEPLOYMENT']
def generateDocumentation(code):
  prompt = f"Write a full code documentation of this code: \n\n{code} \n\n Make sure to include comments that describe every function and loop but make sure the code still stands out"
  messages = [{"role": "user", "content": prompt}]  
  completion = client.chat.completions.create(model=deployment, messages=messages, max_tokens=600, temperature = 0.1)
  return completion.choices[0].message.content

def main():
  code_input = sys.stdin.read()
  documentation = generateDocumentation(code_input)
  print(documentation)
  
if __name__ == "__main__":
    main()