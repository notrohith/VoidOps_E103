import google.generativeai as genai
import os

# 1. Paste your key here directly for this test
api_key = "PASTE_YOUR_API_KEY_HERE" 
genai.configure(api_key=api_key)

print("Searching for available models...")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"- {m.name}")