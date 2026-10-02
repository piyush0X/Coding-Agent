const API_URL = "http://localhost:8000/api/ask";


const chat = document.getElementById("chat");

const questionInput = document.getElementById("question");

const sendButton = document.getElementById("sendButton");


/* ========================================
   SEND MESSAGE
======================================== */

async function sendMessage() {

    const question = questionInput.value.trim();

    if (!question) {
        return;
    }


    // Remove welcome screen

    const welcome = document.getElementById("welcome");

    if (welcome) {
        welcome.remove();
    }


    // Add user message

    addMessage(
        "You",
        question,
        "user"
    );


    // Clear input

    questionInput.value = "";

    autoResize();


    // Disable button

    sendButton.disabled = true;


    // Add loading message

    const loadingId = addLoading();


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        const data = await response.json();


        // Remove loading

        removeLoading(loadingId);


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Server error"
            );
        }


        // Add AI response

        addMessage(
            "Coding Agent",
            data.answer,
            "ai"
        );


    } catch (error) {

        removeLoading(loadingId);


        addMessage(
            "Coding Agent",
            "❌ Error: " + error.message +
            "\n\nMake sure Ollama and FastAPI are running.",
            "ai"
        );

    } finally {

        sendButton.disabled = false;

        questionInput.focus();
    }
}


/* ========================================
   ADD MESSAGE
======================================== */

function addMessage(
    name,
    text,
    type
) {

    const message = document.createElement("div");

    message.className = "message";


    const avatar = document.createElement("div");

    avatar.className =
        "avatar " +
        (type === "user"
            ? "user-avatar"
            : "ai-avatar");


    avatar.textContent =
        type === "user"
            ? "U"
            : "</>";


    const content = document.createElement("div");

    content.className = "message-content";


    const nameElement = document.createElement("div");

    nameElement.className = "message-name";

    nameElement.textContent = name;


    const textElement = document.createElement("div");

    textElement.className = "message-text";


    if (type === "ai") {

        textElement.innerHTML =
            formatMarkdown(text);

    } else {

        textElement.textContent = text;

    }


    content.appendChild(nameElement);

    content.appendChild(textElement);


    message.appendChild(avatar);

    message.appendChild(content);


    chat.appendChild(message);


    scrollToBottom();
}


/* ========================================
   SIMPLE MARKDOWN FORMATTER
======================================== */

function formatMarkdown(text) {

    let html = escapeHtml(text);


    // Code blocks

    html = html.replace(
        /```(\w+)?\n?([\s\S]*?)```/g,
        function(match, language, code) {

            return `
                <pre><code>${code.trim()}</code></pre>
            `;
        }
    );


    // Inline code

    html = html.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    );


    // Bold

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // Headings

    html = html.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    html = html.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    html = html.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );


    return html;
}


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ========================================
   LOADING
======================================== */

function addLoading() {

    const id =
        "loading-" +
        Date.now();


    const message =
        document.createElement("div");


    message.id = id;

    message.className = "message";


    message.innerHTML = `

        <div class="avatar ai-avatar">
            &lt;/&gt;
        </div>

        <div class="message-content">

            <div class="message-name">
                Coding Agent
            </div>

            <div class="loading">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `;


    chat.appendChild(message);

    scrollToBottom();


    return id;
}


function removeLoading(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.remove();
    }
}


/* ========================================
   SCROLL
======================================== */

function scrollToBottom() {

    chat.scrollTop =
        chat.scrollHeight;
}


/* ========================================
   ENTER KEY
======================================== */

function handleKeyDown(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
}


/* ========================================
   AUTO RESIZE
======================================== */

questionInput.addEventListener(
    "input",
    autoResize
);


function autoResize() {

    questionInput.style.height = "auto";

    questionInput.style.height =
        Math.min(
            questionInput.scrollHeight,
            180
        ) + "px";
}


/* ========================================
   SUGGESTION PROMPT
======================================== */

function usePrompt(prompt) {

    questionInput.value = prompt;

    questionInput.focus();

    autoResize();
}


/* ========================================
   NEW CHAT
======================================== */

function newChat() {

    chat.innerHTML = `

        <div
            id="welcome"
            class="welcome"
        >

            <div class="welcome-icon">
                &lt;/&gt;
            </div>

            <h2>
                What can I help you code?
            </h2>

            <p>
                Ask me to write, explain, debug,
                or improve your code.
            </p>

            <div class="suggestions">

                <button
                    onclick="usePrompt('Create a Python calculator program')"
                >
                    <strong>💻 Generate Code</strong>
                    <span>Create a program from scratch</span>
                </button>

                <button
                    onclick="usePrompt('Explain this code and tell me how it works:')"
                >
                    <strong>📚 Explain Code</strong>
                    <span>Understand code step by step</span>
                </button>

                <button
                    onclick="usePrompt('Find and fix the bugs in this code:')"
                >
                    <strong>🐞 Debug</strong>
                    <span>Find and fix programming errors</span>
                </button>

                <button
                    onclick="usePrompt('Optimize this code:')"
                >
                    <strong>⚡ Optimize</strong>
                    <span>Improve performance and quality</span>
                </button>

            </div>

        </div>
    `;

    questionInput.focus();
}