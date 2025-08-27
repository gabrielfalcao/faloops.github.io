const context = new AudioContext(); //allows access to webaudioapi
const oscillator = context.createOscillator(); //creates oscillator
const audio = {context, oscillator};

const faloopsConfig = {
   minPitch : 13000,  // hz
   maxPitch : 22000,  // hz
   minInterval : 60,  // ms
   maxInterval : 420, // ms
   active : false,
};

function randomPitch() {
  return Math.floor(Math.random() * (faloopsConfig.maxPitch - faloopsConfig.minPitch + 1)) + faloopsConfig.minPitch;
}
function randomInterval() {
  return (
    Math.floor(Math.random() * (faloopsConfig.maxInterval - faloopsConfig.minInterval + 1)) + faloopsConfig.minInterval
  );
}

function tryClear(toClear) {
  if (toClear !== undefined && toClear !== null) {
    try {
      clearTimeout(toClear);
    } catch (_) {}
  }
}
function addTimer(audio, toClear) {
  const interval = randomInterval();

  tryClear(toClear);
  if (!faloopsConfig.active) {
    const dump = JSON.stringify(faloopsConfig, null, 4);
    document.getElementById("status").innerText = `not active\n\n${dump}`;
    return
  }

  const handle = setTimeout(() => {
    const freq = randomPitch();
      document.getElementById("freq").innerText = `${freq}hz`;
      // console.log(`${freq}hz`)

    audio.oscillator.frequency.value = freq;
    addTimer(audio, handle);
  }, interval);
}
function startOscillator() {
  faloopsConfig.active = true;
  addTimer(audio);
  oscillator.type = "sine"; //chooses the type of wave
  // console.log("freq", oscillator.frequency);
  oscillator.frequency.value = randomPitch();
  oscillator.connect(context.destination); //sends to output
  oscillator.start(context.currentTime); //starts the sound at the current time
  // console.log("audio", { context, oscillator });
  context.resume().then(() => {
    // console.log("Playback resumed successfully");
  });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log({context, oscillator, audio});
  document.getElementById("start").addEventListener("click", () => {
    startOscillator()
    document.getElementById("when-active").style.display = "block";
    document.getElementById("when-inactive").style.display = "none";

  });
  ["min", "max"].forEach(kind => {
    document.getElementById(`freq-${kind}`).addEventListener("change", (event) => {
      const value = parseFloat(event.target.value);
      console.log(`freq-min changed to: ${value}`, typeof value);
      faloopsConfig.minPitch = parseFloat(value);
    });
    document.getElementById(`freq-${kind}`).value = faloopsConfig[`${kind}Pitch`];
  })
});
