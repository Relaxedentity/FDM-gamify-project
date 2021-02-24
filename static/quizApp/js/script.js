//Constant (non changing) variable definition
const nextBtn = document.getElementById('next-element')
const finishedBtn = document.getElementById('finished-element')
const redirectBtn = document.getElementById('redirect-element')
const container = document.getElementById('container-element')
const questionEl = document.getElementById('question')
const buttons = document.getElementById('buttons-element')
const responseEl = document.getElementById('result-response')
//Non-constant (changing) variable definition
let count = 0
let mixedQuestions, indexInQuestionArray
let softwareTest, businessIntel, techOperations

//Event listener for next button.
nextBtn.addEventListener('click', () => {
    //Question index incremented
    indexInQuestionArray++
    count = 0
    //Each button is checked to see if it selected.
    Array.from(buttons.children).forEach(button => {
        if (button.classList.contains("selected")) {
            //Stream scores are appended.
            if (button.dataset.ST) {
                softwareTest = softwareTest + 5
            }
            if (button.dataset.BI) {
                businessIntel = businessIntel + 5
            }
            if (button.dataset.TO) {
                techOperations = techOperations + 5
            }
        }
    })
    //Next question is loaded.
    questionIncrement()
})


/**
 * The gameStart procedure initialises the information to be used in the game.
 * This includes the array of questions in shuffled form, the initial index in
 * the questions array, the starting scores for each stream and loads the first question.
 */
function gameStart() {
    mixedQuestions = questions.sort(() => Math.random() - .5)
    indexInQuestionArray = 0
    softwareTest = 0
    businessIntel = 0
    techOperations = 0
    questionIncrement()
}

/**
 * The questionIncrement procedure resets the current question container and then
 * calls the displayQuestion procedure to load the next question into the container.
 */
function questionIncrement() {
    resetContainer()
    displayQuestion(mixedQuestions[indexInQuestionArray])
}


/**
 * The procedure displayQuestion takes a question object and takes its question and answers
 * variables and loads them into HTML elements so the user can see it. The question is loaded to
 * a simple title and for the answers, buttons are generated and appended to the buttons container
 * as children.
 * @param question The question to be loaded into the question container.
 */
function displayQuestion(question) {
    //Change the title of the question element to the current question.
    questionEl.innerText = question.question
    //Increment through each answer and generate a button for it.
    question.answers.forEach(answer => {
        const buttonX = document.createElement('buttonX')
        buttonX.innerText = answer.text
        buttonX.classList.add('btn_game')
        //Ensuring buttons are given dataset values for their stream scores.
        if (answer.ST) {
            buttonX.dataset.ST = answer.ST
        }
        if (answer.BI) {
            buttonX.dataset.BI = answer.BI
        }
        if (answer.TO) {
            buttonX.dataset.TO = answer.TO
        }
        //Adding event listeners for each of the buttons.
        buttonX.addEventListener('click', answerSelected)
        buttons.appendChild(buttonX)
    })
}

/**
 * The procedure resetContainer hides the next button and removes all the old
 * answer buttons from the container. The question title element does not need to be
 * hidden as this is an element that just changes.
 */
function resetContainer() {
    nextBtn.classList.add('hide')
    while (buttons.firstChild) {
        buttons.removeChild(buttons.firstChild)
    }
}


/**
 * The endState procedure occurs when the application reaches its end state.
 * Its sole purpose is to hide all existing elements on the page and display the
 * results of the personality test in the form of a pie chart.
 */
function endState() {
    resetContainer()
    //Hide all other elements that 'resetContainer()' does not remove.
    questionEl.classList.add("hide")
    finishedBtn.classList.add("hide")
    let total = softwareTest + techOperations + businessIntel
    //Set labels for pie chart.
    let labels1 = ['Software Testing', 'Technical Operations',"Business Intelligence"];
    //Set colours for pie chart.
    let colours1 = ['#49A9EA', '#36CAAB','#008000'];

    let softTestLabel = ((softwareTest/total) * 100).toFixed(2)
    let businessLabel = ((businessIntel/total) * 100).toFixed(2)
    let techOpLabel = ((techOperations/total) * 100).toFixed(2)



    //Create pie chart
    let pieChart = document.getElementById("myChart").getContext('2d');
    let chart1 = new Chart(pieChart, {
        type: 'pie',
        data: {
            labels: labels1,
            datasets: [ {
                data: [softTestLabel,techOpLabel,businessLabel],
                backgroundColor: colours1
            }]
        },
        options: {
            title: {
                text: "Results",
                display: true,
                fontSize: 20
            },
            responsive: false,
            maintainAspectRatio: false,
            showScale: false,
        }
    })
    //Show redirect button
    redirectBtn.classList.remove("hide")
    let arrayOfOutcomes = []

    //Find the highest score from all the stream scores
    let highScore = Math.max(softwareTest,techOperations,businessIntel)

    //Push all the streams that are equal to the high score to an array.
    if (softwareTest === highScore){
        arrayOfOutcomes.push("Software Testing")
    }
    if (techOperations === highScore){
        arrayOfOutcomes.push("Technical Operations")
    }
    if (businessIntel === highScore){
        arrayOfOutcomes.push("Business Intelligence")
    }

    let textOutput = 'From this test we can suggest that you would be good at'
    let count = 0
    //String builder to add either one or more categories to the output message.
    arrayOfOutcomes.forEach(outcome => {
        if (count !== 0){
            textOutput = textOutput + " and " + outcome
        } else {
            textOutput = textOutput + " " + outcome
        }
        count ++
    })
    textOutput = textOutput + "."
    //Show response to user.
    responseEl.innerText = textOutput
    responseEl.classList.remove("hide")
}

/**
 * The procedure answerSelect takes the selected button, changes its appearance
 * to look light green to indicate that it is selected, it then also shows the next button if no
 * other buttons are selected and adds 1 to the count which is used to check the limit on the number
 * of selections allowed for that question.
 * @param element The button element that was clicked.
 */
function answerSelected(element) {

    //Get the current question.
    let question = mixedQuestions[indexInQuestionArray]
    //Get the selected button.
    const selectedButton = element.target

    //Change the button's appearance by removing the 'selected' class if the button is already selected.
    //This only occurs when the button is deselected.
    if (selectedButton.classList.contains("selected")){
        selectedButton.classList.remove("selected")
        //Take 1 off the count
        count--
        if (count === 0){
            //Hide the next button if no answers are selected.
            nextBtn.classList.add("hide")
        }
    }
    //Change the button's appearance by adding the 'selected' class to its class list.
    else if (count !== question.selections) {
        selectedButton.classList.add('selected')
        //Count the number of buttons which are selected.
        count = 0
        Array.from(buttons.children).forEach(button => {
            if (button.classList.contains("selected")) {
                count++
            }
        })
        //Show next button if there is at least one answer selected.
        if (mixedQuestions.length > indexInQuestionArray + 1) {
            nextBtn.classList.remove('hide')
        }
        //Show the finished button when on last question and at least one answer is selected.
        else {
            finishedBtn.classList.remove("hide")
            finishedBtn.addEventListener("click", endState)
        }
    }
}

//JSON variable containing questions, answers, their stream categories and the selection limits.
const questions = [
    {
        question: 'Choose up to 3 skills you can identify yourself with the most: ',
        answers: [
            {text: 'Strategic Thinking',ST:true,BI:true,TO:false},
            {text: 'Objectivity',ST:true,BI:false,TO:false},
            {text: 'Ability to work under pressure',ST:false,BI:false,TO:true},
            {text: 'Creativity',ST:true,BI:false,TO:false},
            {text: 'Customer service skills',ST:false,BI:false,TO:true},
            {text: 'Team-player',ST:false,BI:true,TO:false},
            {text: 'Quality-driven',ST:false,BI:true,TO:false},
            {text: 'Attention to detail',ST:true,BI:true,TO:false},
            {text: 'Innovative thinking',ST:true,BI:false,TO:true},
            {text: 'Ability to work in dynamic environment',ST:false,BI:false,TO:true},
            {text: 'Strong communicator',ST:true,BI:true,TO:true},
            {text: 'Quick-wit and situational orientation skills',ST:false,BI:false,TO:true},
        ],
        selections: 3
    },
    {
        question: 'Choose up to 3 sentences that describe you best: ',
        answers: [
            {text: 'I would like a career which combines technology and development with business and management.',
                ST:false,BI:false,TO:true},
            {text: 'I am looking for a career in technology which will see me involved in each stage of software development.',
                ST:true,BI:false,TO:true},
            {text: 'I think it is of great importance that businesses understand and learn to use the data they collect, and I could help them do it.',
                ST:false,BI:true,TO:false},
            {text: 'I want to have access to the newest, cutting-edge technologies in my line of your work.',
                ST:true,BI:false,TO:false},
            {text: 'I would like to learn more about how modern technology supports today’s businesses.',
                ST:false,BI:true,TO:true},
            {text: 'I want to work closely with clients, for example by offering them technical support and making sure all their platforms are online and working.',
                ST:false,BI:false,TO:true},
            {text: 'I would like to use data to help my company strategically plan future steps.',
                ST:false,BI:true,TO:false},
            {text: 'I am more interested in the technical than the business side of things',
                ST:true,BI:false,TO:false},
        ],
        selections: 3
    },
    {
        question: 'Which of these sound the most interesting to you? (choose up to 3):',
        answers: [
            {text: 'Automation Testing',
                ST:true,BI:false,TO:false},
            {text: 'Cloud Engineering',
                ST:false,BI:false,TO:true},
            {text: 'Data Analysis ',
                ST:false,BI:true,TO:false},
            {text: 'Site Reliability',
                ST:false,BI:false,TO:true},
            {text: 'Operational Acceptance Testing ',
                ST:true,BI:false,TO:false},
            {text: 'Database Management',
                ST:false,BI:true,TO:false},
            {text: 'Security Testing',
                ST:true,BI:false,TO:false},
            {text: 'Information Security ',
                ST:false,BI:false,TO:true},
            {text: 'Platform Engineering',
                ST:false,BI:false,TO:true},
            {text: 'Predictive Analysis',
                ST:false,BI:true,TO:false},
        ],
        selections: 3
    },
    {
        question: 'Which of these are you most confident in doing?:',
        answers: [
            {text: 'Working in a small group of people.',
                ST:true,BI:false,TO:false},
            {text: 'Working with a large number of customers.',
                ST:false,BI:false,TO:true},
            {text: 'Working with businesses and public speaking.',
                ST:false,BI:true,TO:false},
        ],
        selections: 1
    },
    {
        question: 'How do you make decisions?:',
        answers: [
            {text: 'I take my time dissecting the problem and then use context to make an informed decision.',
                ST:false,BI:false,TO:true},
            {text: 'I look at the time I have to solve this problem and depending on how long that is, I will make my decision as quickly as I can.',
                ST:true,BI:false,TO:false},
            {text: 'I will speak to other professionals to help solve this problem and use their expertise to make an informed decision.',
                ST:false,BI:true,TO:false},
        ],
        selections: 1
    },
]
//Called when app is loaded.
gameStart();