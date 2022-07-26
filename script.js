const keys = [
    "C", "C#",
    "D", "D#", "Db",
    "E", "Eb",
    "F", "F#",
    "G", "G#", "Gb",
    "A", "A#", "Ab",
    "B", "Bb",
]
let activeKeys = []
const checkBoxContainer = document.getElementById('checkbox-container')
const key = document.getElementById('key')
const intervalInput = document.getElementById('interval')
const defaultInterval = 1
intervalInput.value = defaultInterval
let intervalTimer

loop = () => {
    const number = Math.floor(Math.random() * 8) + 1 // 1 to 8
    const randomKey = activeKeys[Math.floor(Math.random() * activeKeys.length)]
    key.textContent = number + " of " + randomKey
}

setLoop = (interval) => {
    loop()
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
    if(intervalTimer == undefined){
        setLoop(defaultInterval)
    }
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
        }
    }
}

for (const k of keys) {
    checkBoxContainer.innerHTML += `<label for="key-${k}"><input type="checkbox" name="key" value="${k}" id="key-${k}">${k}</label><br>`
}

key.textContent = "Start by selecting one or more keys"

// ---------- Input ------------------------------------

document.onkeypress = (ev) => {
    (ev.key == ' ' && !intervalTimer.paused) ? intervalTimer.pause() : intervalTimer.resume()
}

intervalInput.oninput = () => {
    let v = intervalInput.value < 0.5 ? 0.5 : intervalInput.value
    console.log("changing to " + v)
    setLoop(v)
}

const keySelection = document.querySelectorAll('input[name="key"]')

for (let k of keySelection) { k.onclick = (ev) => changeActiveKey(ev.target.checked, ev.target.value) }