let steam_type = document.getElementById('stream-holder').value

document.addEventListener('DOMContentLoaded', ()=>{
    //Array of options
    const PanelArray = [
        {
            name:'im 1',
            img:'/static/images/'+steam_type+'/im 1.png'
        },
        {
            name:'im 1',
            img:'/static/images/'+steam_type+'/im 1.png'
        },
        {
            name:'im 2',
            img:'/static/images/'+steam_type+'/im 2.png'
        },
        {
            name:'im 2',
            img:'/static/images/'+steam_type+'/im 2.png'
        },
        {
            name:'im 3',
            img:'/static/images/'+steam_type+'/im 3.png'
        },
        {
            name:'im 3',
            img:'/static/images/'+steam_type+'/im 3.png'
        },
        {
            name:'im 4',
            img:'/static/images/'+steam_type+'/im 4.png'
        },
        {
            name:'im 4',
            img:'/static/images/'+steam_type+'/im 4.png'
        },
        {
            name:'im 5',
            img:'/static/images/'+steam_type+'/im 5.png'
        },
        {
            name:'im 5',
            img:'/static/images/'+steam_type+'/im 5.png'
        },
        {
            name:'im 6',
            img:'/static/images/'+steam_type+'/im 6.png'
        },
        {
            name:'im 6',
            img:'/static/images/'+steam_type+'/im 6.png'
        },
        {
            name:'im 7',
            img:'/static/images/'+steam_type+'/im 7.png'
        },
        {
            name:'im 7',
            img:'/static/images/'+steam_type+'/im 7.png'
        },
        {
            name:'im 8',
            img:'/static/images/'+steam_type+'/im 8.png'
        },
        {
            name:'im 8',
            img:'/static/images/'+steam_type+'/im 8.png'
        },
        {
            name:'im 9',
            img:'/static/images/'+steam_type+'/im 9.png'
        },
        {
            name:'im 9',
            img:'/static/images/'+steam_type+'/im 9.png'
        }
    ]
    //randomise panel images displayed on grid
    PanelArray.sort(()=>0.5 - Math.random())
    const grid = document.querySelector('.grid')
    const displayResult = document.querySelector('#result')
    let gameStarted = false;
    //create array for chosen panels, chosen panel ids and completed panels.
    var chosenPanels=[]
    var chosenPanelId = []
    var completedPanels = []
    let won = false
    //creating main game panel

    /**
     * creating main game panel
     */
    function createGamePanel(){
        for (let i = 0; i< PanelArray.length; i++){
            var imgPanel = document.createElement('img')
            imgPanel.setAttribute('src', '/static/images/grey.png')
            imgPanel.setAttribute('data-id', i)
            imgPanel.addEventListener('click',flipPanel)
            grid.appendChild(imgPanel)
        }
    }

    /**
     * check for matching panels
     */
    function checkMatchingPanel() {
        var imgPanel = document.querySelectorAll('img')
        const panelOneId = chosenPanelId[0]
        const panelTwoId = chosenPanelId[1]

        if (panelOneId === panelTwoId){

            document.getElementById("status").innerText = "Incorrect Panel Match"
            imgPanel[panelOneId].setAttribute('src','/static/images/'+steam_type+'/'+ chosenPanels[0]+ ' red.png')
            setTimeout(() => {  imgPanel[panelOneId].setAttribute('src','/static/images/grey.png');
            }, 1000);
            setTimeout(enablePanels, 1000)

        }
        // case where matching panels are selected
        else if(chosenPanels[0] === chosenPanels[1]){
            document.getElementById("status").innerText = "Matching Panel Found"
            if(chosenPanels[0] === chosenPanels[1]) {
                imgPanel[panelOneId].setAttribute('src', '/static/images/'+steam_type+'/'+ chosenPanels[0]+ ' green.png')
                imgPanel[panelTwoId].setAttribute('src', '/static/images/'+steam_type+'/'+ chosenPanels[1]+ ' green.png')
                imgPanel[panelOneId].removeEventListener('click',flipPanel)
                imgPanel[panelTwoId].removeEventListener('click',flipPanel)
                imgPanel[panelOneId].classList.add("found")
                imgPanel[panelTwoId].classList.add("found")
                setTimeout(enablePanels, 0)
            }
            completedPanels.push(chosenPanels)
        }
        // case where incorrect panels are selected
        else{

            document.getElementById("status").innerText = "Incorrect Panel Match"
            imgPanel[panelOneId].setAttribute('src','/static/images/'+steam_type+'/'+ chosenPanels[0]+ ' red.png')
            imgPanel[panelTwoId].setAttribute('src','/static/images/'+steam_type+'/'+ chosenPanels[1]+ ' red.png')
            setTimeout(() => {  imgPanel[panelOneId].setAttribute('src','/static/images/grey.png');
                imgPanel[panelTwoId].setAttribute('src','/static/images/grey.png');
            }, 1000);
            setTimeout(enablePanels, 1000)


        }
        chosenPanels = []
        chosenPanelId = []

        // case when all panels have been matched
        if (completedPanels.length === PanelArray.length/2){
            let score = returnIntTime(document.getElementById("timer").innerText)
            document.getElementById("status").innerText = "You have won in: "+
                (score) + " seconds."
            document.getElementById("timer").classList.add("hide")
            document.getElementById("sub-btn").classList.remove("hide")
            won = true
            document.getElementById("score-holder").value = score

        }
    }

    /**
     * function to turn duration string into int variable.
     * @param timeString time in string form e.g. '01:20'
     * @returns {number} time in int form e.g. 80
     */
    function returnIntTime(timeString){
        let mins = timeString.slice(0,2)
        let secs = timeString.slice(3,5)
        let totalMins = parseInt(mins)
        let totalSecs = parseInt(secs)

        let timeBeforeChange = (totalMins * 60) + totalSecs

        return 120 - timeBeforeChange
    }


    /**
     * function to create a timer
     * @param duration duration to be displayed
     * @param display display object
     */
    function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer === 0 && !(won)) {

            document.getElementById("status").innerText = "Game Over"
            document.getElementById("timer").classList.add("hide")
            document.getElementById("mybutton-1").classList.remove("hide")
            document.getElementById("mybutton-2").classList.remove("hide")
            timer = duration; // uncomment this line to reset timer automatically after reaching 0
        }
    }, 1000);
}


    /**
     * function to flip panel called on click
     */
    function flipPanel(){

        if (gameStarted === false) {
            var time = 119, // your time in seconds here
            display = document.querySelector('#timer');
            startTimer(time, display);
            gameStarted = true
        }

        let panelChildren = document.getElementById("grid-id").children
        var panelId = this.getAttribute('data-id')
        chosenPanels.push(PanelArray[panelId].name)
        chosenPanelId.push(panelId)
        this.setAttribute('src',PanelArray[panelId].img)
        if (chosenPanels.length ===2){

            for (let i = 0; i< panelChildren.length; i++) {
                panelChildren[i].removeEventListener('click',flipPanel)
            }
            setTimeout(checkMatchingPanel, 0)
        }
    }

    /**
     * enables all the panels on the grid
     */
    function enablePanels(){
        let panelChildren = document.getElementById("grid-id").children
        for (let i = 0; i< panelChildren.length; i++) {
                if (!(panelChildren[i].classList.contains("found"))){
                    panelChildren[i].addEventListener('click',flipPanel)
                }

            }
    }

    createGamePanel()
    document.getElementById("child-class-id").classList.remove("hide")
    document.getElementById("timer").classList.remove("hide")
    document.getElementById("grid-id").classList.remove("hide")
})