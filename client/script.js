import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");

const chatConatiner = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStrip(isAi, value, uniqueId) {
  return `<div class="wrapper">
            <div class="chat">
              <div class="profile">
                <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}"/>
              </div>
              <div class="message" id="${uniqueId}">${value}</div>
            </div>
          </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // users chat stripe
  chatConatiner.innerHTML += chatStrip(false, data.get("prompt"));

  form.reset();

  // bot chat stripe
  const uniqueId = generateUniqueId();
  chatConatiner.innerHTML += chatStrip(true, " ", uniqueId);

  chatConatiner.scrollTop = chatConatiner.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from openai

  const response = await fetch("https://botcode-ynvm.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    debugger;
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.json();
    messageDiv.innerHTML = "Something went wrong!";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
