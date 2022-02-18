// VARS
var model = {
    answer: "",
    answerToggle: false,
    needsReset: false,
    petitionText: "Sapiens please answer the following question."
}
const reset_btn = document.createElement('reset-button');
const form = document.querySelector('form');
const changed_msg = document.querySelector('.changed_msg');

// FUNCS
const changeParagraphFirst = () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  const content = 'SAPIENS SAYS:';
  const welcome = document.getElementById('welcome');
  welcome.textContent = content
};

let classy_word_p = document.querySelector('.classy_word_p');
let classy_word_author = document.querySelector('.classy_word_author');
const twitter_btn = document.querySelector('.twitter');
const generate_btn = document.querySelector('.generate');
const proxy = 'https://fathomless-dawn-61850.herokuapp.com/';
const api_quote =
  'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
//Getting quotes from API:
const getQuote = async () => {
  try {
    const response = await fetch(proxy + api_quote);
    const data = await response.json();
    if (data.quoteAuthor === ' ') {
      classy_word_author.textContent = '-Unknown...';
    }
    classy_word_author.textContent = '-' + data.quoteAuthor;
    classy_word_p.textContent = '"' + data.quoteText.trim() + '"';
  } catch (err) {
    classy_word_p.textContent =
      '"This is your unlucky day. Try again. HTTP for the blame!"';
    classy_word_author.textContent = '-Dilara Aksoy';
  }
};

//Twitter Functionality:
const tweetOfTheDay = () => {
  const quote = classy_word_p.textContent;
  const author = classy_word_author.textContent;
  const twitter = `https://twitter.com/intent/tweet?text=${quote} ${author}`;
  window.open(twitter, '_blank');
};
//Generate A Quote:
generate_btn.addEventListener('click', getQuote);
//Tweet the Quote:
twitter_btn.addEventListener('click', tweetOfTheDay);

function createButton() {
document.getElementsByClassName('btn')[0].style.visibility = "hidden";
  reset_btn.classList.add('btn_plus');
  const pls = 'Reset';
  reset_btn.append(pls);
  document.getElementById('reset_btn_placeholder').appendChild(reset_btn);
  //btn.addEventListener('click', () => {window.alert("Please reset the form.");});
}

var controller = {
    init: () => {
        view.init();
    },
    keyDown: (e) => {
        let len = view.getPetitionLength();

        if(e.key === '.'){ // Period is the secret key
            model.answerToggle = !model.answerToggle;
            document.getElementById('petition').value += model.petitionText[len];
            return false;
        } else if (e.key.length === 1 && model.answerToggle) { // If its a character and in answer mode
            model.answer += e.key;
            document.getElementById('petition').value += model.petitionText[len];
            console.log(model.answer);
            return false;
        } else if (e.key === "Backspace" && model.answerToggle) { // if its a backpace
            model.answer = model.answer.slice(0,-1);
        }
    },
    getResetStatus: () => {
        return model.needsReset;
    },
    getAnswer: () => {
        const invalidResponse = [
            "You may not be authorized!",
            "Better luck next time...",
            "What's in it for me?",
            "Why should I answer to that?",
            "Please try again tomorrow. Or never...",
            "I'm tired... Try again another time.",
            "Not now, I'm busy. Maybe later.",
            "LMAO, there's no way...",
        ];
        const invalidQuestion = "Please ask Sapiens a valid question.";
        const invalidPetition = "Please enter a petition!";
        model.needsReset = true;

        if (!view.getQuestion()) {                  // Valid Question check
            return invalidQuestion;
        } else if(model.answer) {                   // Valid Petition check
            return model.answer + ".";
        } else if (!view.getPetition()) {
            return invalidPetition
        } else {                                    // Invalid Response
            let randomNum = Math.floor(Math.random() * invalidResponse.length);
            return invalidResponse[randomNum];
        }

    },
    reset: () => {
        reset_btn.click();
    },
}

var view = {
    init: () => {
        document.getElementById('btn').addEventListener('click', changeParagraphFirst, { once: true });

        reset_btn.addEventListener('click', () => {location.reload();});
        btn.addEventListener('click', () => {
        changed_msg.textContent = controller.getAnswer();
        });
        btn.addEventListener('click', createButton, { once: true });

        document.getElementById('petition').onkeydown = (event) => {
            return controller.keyDown(event)
        };
        document.getElementById('question').onkeydown = (event) => {
            switch(event.key) {
                case "?":
                    //document.getElementById('question').value += "?";
                    document.getElementById('btn').click();
                    break;
                case "Enter":
                    if(!document.getElementById('question').value.includes('?')){
                        document.getElementById('question').value += "?";
                    }
                    document.getElementById('btn').click();
                    break;
            }

        };
        document.getElementById('petition').onfocus = ()=> {
            if(controller.getResetStatus()){
                controller.reset();
            }
        };
        //tweetTheFortuneBtn.addEventListener('click', controller.tweetAnswer());

    },
    getPetitionLength: () => {
        return document.getElementById('petition').value.length;
    },
    getQuestion: () => {
        return document.getElementById('question').value;
    },
    getPetition: () => {
        return document.getElementById('petition').value;
    }
}


controller.init();