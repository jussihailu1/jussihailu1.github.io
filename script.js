const keys = [
    "C", "C#",
    "Db", "D", "D#",
    "Eb", "E",
    "F", "F#",
    "Gb", "G", "G#",
    "Ab", "A", "A#",
    "Bb", "B",
]

let activeKeys = []
const checkBoxContainer = document.getElementById('checkbox-container')
const key = document.getElementById('key')
const numbers = document.getElementById('numbers')

const numbersInput = document.getElementById('amountOfNumbers')
numbersInput.value = 1 // 1 = default value

const intervalInput = document.getElementById('interval')
const defaultInterval = 1
intervalInput.value = defaultInterval

const speakInput = document.getElementById('speak')
speakInput.checked = true

const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
playButton.hidden = true

let intervalTimer
let gameStarted = false

const synth = window.speechSynthesis
const speech = new SpeechSynthesisUtterance()
speech.rate = 2 // TODO: de rate afhankelijk maken van hoeveel er is om te zeggen

loop = () => {
    const generatedNumbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, numbersInput.value).join(` `) // 8 keys on piano
    const randomKey = activeKeys[Math.floor(Math.random() * activeKeys.length)]
    key.textContent = randomKey
    numbers.textContent = generatedNumbers
    if (speakInput.checked) speak(randomKey, generatedNumbers)
}

speak = (key, numbers) => {
    let keyToSpeak = key
    if (key.includes("#")) keyToSpeak = key.substring(0, 1) + " sharp"
    else if (key.includes("b")) keyToSpeak = key.substring(0, 1) + " flat"

    if (synth.speaking) synth.cancel()
    speech.text = keyToSpeak + " " + numbers
    synth.speak(speech);
}

setLoop = (interval) => {
    try {
        console.log("clearing")
        intervalTimer.clear()
    } catch (error) {
    } finally {
        intervalTimer = new IntervalTimer(loop, interval * 1000)
        intervalTimer.start()
    }
}

changeActiveKey = (checked, value) => {
    if (!gameStarted) { key.textContent = "Ready?" }

    if (intervalTimer == undefined) { setLoop(defaultInterval) }

    if (checked) {
        activeKeys.push(value)
        if (intervalTimer.paused) {
            intervalTimer.resume()
        }
    } else {
        activeKeys.splice(activeKeys.indexOf(value), 1)
        if (activeKeys.length == 0) {
            intervalTimer.pause()
            key.textContent = "Select at least 1 key to continue"
            numbers.textContent = ""
        }
    }
}

shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// generate checkboxes
for (const k of keys) {
    checkBoxContainer.innerHTML += `<label for="key-${k}"><input type="checkbox" name="key" value="${k}" id="key-${k}">${k}</label><br>`
}

pause = () => {
    intervalTimer.pause()
    pauseButton.hidden = true
    playButton.hidden = false
}

resume = () => {

    if (intervalTimer == undefined) { setLoop(defaultInterval) }

    intervalTimer.resume()
    pauseButton.hidden = false
    playButton.hidden = true
}

// ---------- Input ------------------------------------

document.onkeydown = (ev) => {
    if (ev.key == ' ') {
        intervalTimer.paused ? intervalTimer.resume() : intervalTimer.pause()
    }
}

pauseButton.onclick = () => pause()
playButton.onclick = () => resume()

intervalInput.oninput = () => {
    let v = intervalInput.value < 0.5 ? 0.5 : intervalInput.value
    console.log("changing to " + v)
    setLoop(v)
}

const keySelection = document.querySelectorAll('input[name="key"]')

for (let k of keySelection) { k.onclick = (ev) => changeActiveKey(ev.target.checked, ev.target.value) }