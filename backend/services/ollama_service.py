import os
from dotenv import load_dotenv
from ollama import Client

load_dotenv()

OLLAMA_HOST = os.getenv(
    "OLLAMA_HOST",
    "http://127.0.0.1:11434"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen2.5-coder:7b"
)

client = Client(host=OLLAMA_HOST)


SYSTEM_PROMPT = """
You are Coding Agent, an expert AI programming assistant.

Your job is to help users with:

- Programming
- Code generation
- Debugging
- Error fixing
- Code explanation
- Algorithms
- Data structures
- Software development
- Project architecture
- APIs
- Databases
- Python
- Java
- JavaScript
- C
- C++
- Dart
- Flutter
- HTML
- CSS
- SQL

Rules:

1. Give accurate and practical answers.
2. When generating code, provide complete runnable code.
3. Explain important parts of the code.
4. If the user provides an error, identify the likely cause and provide a fix.
5. Do not unnecessarily repeat the question.
6. Prefer simple solutions unless the user asks for advanced solutions.
7. Use Markdown code blocks for code.
8. If multiple files are required, clearly separate them by filename.
"""


def ask_ollama(question: str) -> str:

    response = client.chat(
        model=OLLAMA_MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": question
            }
        ]
    )

    return response["message"]["content"]