const hour = document.querySelector("#hour");
const minute = document.querySelector("#minute");
const AmPm = document.querySelector("#ampm");
const setAlarmBtn = document.querySelector("#setBtn");
const content = document.querySelector("#content");
const ringTone = new Audio("files/ringtone.mp3");
const body = document.querySelector("body");
const resumeBtn = document.querySelector("#resumeBtn");
const welcomeBackScreen = document.querySelector("#welcomeBack");
const alarmContainer = document.querySelector("#alarmContainer");
const alarmTimeIndicator = document.querySelector("#alarmListcont");
const clkLayout = document.querySelector(".clock-layout");
let currentTime = document.querySelector("#currentTime");
const stopBtn = document.querySelector("#stopBtn");
const snoozeBtn = document.querySelector("#snoozeBtn");
const counterContainer = document.querySelector("#counter");
const counterTextContainer = document.querySelector("#countertext");
const countHolder = document.querySelector("#counterContainer");

// Define a flag variable to track the countdown status
let continueCountdown = true;
let alarmPlayCountdownInProgress = false;

// Retrieve stored alarms from local storage
let storedAlarms = JSON.parse(localStorage.getItem("alarms")) || [];

// Hide Alarms List if no alarm is set
const dispAlarmList = () => {
  if (storedAlarms.length === 0) {
    alarmTimeIndicator.className = "disp-none";
  } else if (storedAlarms.length !== 0) {
    alarmTimeIndicator.classList.remove("disp-none");
  }
};

// Add class to content
if (!localStorage.getItem("contentClass")) {
  localStorage.setItem("contentClass", "content flex");
  content.className = localStorage.getItem("contentClass");
} else {
  content.className = localStorage.getItem("contentClass");
}

// Set button text
if (!localStorage.getItem("btnText")) {
  localStorage.setItem("btnText", "Set Alarm");
  setAlarmBtn.textContent = localStorage.getItem("btnText");
} else {
  setAlarmBtn.textContent = localStorage.getItem("btnText");
}

// create hour options
for (let i = 1; i <= 12; i++) {
  let option = document.createElement("option");
  option.value = i.toString().padStart(2, "0");
  option.textContent = i.toString().padStart(2, "0");
  hour.appendChild(option);
}

// create minute options
for (let i = 0; i < 60; i++) {
  let option = document.createElement("option");
  option.value = i.toString().padStart(2, "0");
  option.textContent = i.toString().padStart(2, "0");
  minute.appendChild(option);
}

// create ampm options
const amPmOptions = ["AM", "PM"];
amPmOptions.forEach((option) => {
  let amPmOption = document.createElement("option");
  amPmOption.value = option;
  amPmOption.textContent = option;
  AmPm.appendChild(amPmOption);
});

// Validate stored alarms and remove invalid ones
storedAlarms = storedAlarms.filter((alarm) => {
  return /^([0-1]\d|2[0-3]):([0-5]\d):([AP]M)$/.test(alarm);
});

// Render alarms list
const renderAlarms = () => {
  const alarmsList = document.querySelector("#alarmsList");
  alarmsList.innerHTML = "";

  // Sort the alarms by time
  storedAlarms.sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a}`).getTime();
    const timeB = new Date(`2000/01/01 ${b}`).getTime();
    return timeA - timeB;
  });

  // Create list items for each alarm
  storedAlarms.forEach((alarm) => {
    const listItem = document.createElement("li");

    const timeContainer = document.createElement("span");
    timeContainer.className = "time-container";
    timeContainer.innerHTML = alarm;

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.innerHTML = '<img src="./files/dlt-icon.svg" alt="Delete">';
    deleteIcon.addEventListener("click", () => deleteAlarm(alarm));

    listItem.appendChild(timeContainer);
    listItem.appendChild(deleteIcon);
    alarmsList.appendChild(listItem);
  });
};

// Delete alarm
const deleteAlarm = (alarm) => {
  const alarmIndex = storedAlarms.indexOf(alarm);
  if (alarmIndex !== -1) {
    storedAlarms.splice(alarmIndex, 1);
    localStorage.setItem("alarms", JSON.stringify(storedAlarms));
    renderAlarms();
  }
};

// Initially render alarms list
var stpAlarm = false;

// Stop Alarm function
const stopAlarm = () => {
  ringTone.pause();
  ringTone.currentTime = 0;
  clkLayout.classList.remove("shake-animation");
  stopBtn.classList.add("disp-none"); // Hide the Stop Alarm button
  snoozeBtn.classList.add("disp-none"); // Hide the Snooze button
};
countHolder.classList.add("disp-none");

// countdown Function
function downcounter(counter) {
  if (counter > 0 && continueCountdown) {
    countHolder.classList.remove("disp-none");
    counterContainer.innerHTML = counter + " sec";
    setTimeout(() => {
      downcounter(counter - 1);
    }, 1000);
  } else {
    countHolder.classList.add("disp-none");
    counterContainer.innerHTML = "";
    counterTextContainer.innerHTML = "";
    alarmPlayCountdownInProgress = false;
    return;
  }
}

// Function to stop the countdown
function stopCountdown() {
  continueCountdown = false;
}

// Function to continue the countdown
function contCountdown() {
  continueCountdown = true;
}

// Play Alarm function
const playAlarm = () => {
  if (!stpAlarm) {
    ringTone.play();
    ringTone.loop = true;
    clkLayout.classList.add("shake-animation");
    stopBtn.classList.remove("disp-none");
    snoozeBtn.classList.remove("disp-none");

    if (!alarmPlayCountdownInProgress) {
      stopCountdown();
      alarmPlayCountdownInProgress = true;
      setTimeout(() => {
        contCountdown();
        counterTextContainer.innerHTML = "Alarm will stop in";
        downcounter(58);
      }, 1000);
    }

    setTimeout(() => {
      stopAlarm();
    }, 60000); // Stop the alarm after 1 minute (60000 milliseconds)
  }
};

// Stop Alarm Button Function
const stopAlarmBtnFunc = () => {
  alarmPlayCountdownInProgress = false;
  stopCountdown();
  stpAlarm = true;
  stopAlarm();
  setTimeout(() => {
    stpAlarm = false;
  }, 60000); // marks stop alarm flag false after 1 min
};

// Snooze Alarm Button Function
const snoozeAlarm = () => {
  stopAlarmBtnFunc();
  setTimeout(() => {
    contCountdown();
    counterTextContainer.innerHTML = "Alarm will play in";
    downcounter(88);
  }, 1000);

  setTimeout(() => {
    playAlarm();
  }, 90000); // Play the alarm again after 1.5 minute (90000 milliseconds)
};

// Add event listeners to the buttons
stopBtn.addEventListener("click", stopAlarmBtnFunc);
snoozeBtn.addEventListener("click", snoozeAlarm);

// Update time every sec on webpage
setInterval(() => {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let ampm = "AM";

  // 12 Hour Format
  if (h > 11) {
    h = h - 12;
    ampm = "PM";
  }

  // if hour value is 0 then set it to 12
  h = h === 0 ? 12 : h;
  // Adding 0 before h, m, s
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  // Update time every second
  currentTime.textContent = `${h}:${m}:${s} ${ampm}`;

  // Play ringtone if setted alarm time matches with current time
  storedAlarms.forEach((alarm) => {
    if (alarm === `${h}:${m}:${ampm}`) {
      playAlarm();
    }
  });
}, 1000);

// Set alarm
const setAlarm = () => {
  // Getting alarm time from user
  let time = `${hour.value}:${minute.value}:${AmPm.value}`;
  if (
    time.includes("Hour") ||
    time.includes("Minute") ||
    time.includes("AM/PM")
  ) {
    alert("Please select a valid time");
    return;
  }

  // Add alarm time to storedAlarms array
  storedAlarms.push(time);

  // Save updated alarms to local storage
  localStorage.setItem("alarms", JSON.stringify(storedAlarms));

  // Clear input fields
  hour.value = "Hour";
  minute.value = "Minute";
  AmPm.value = "AM/PM";

  // Render updated alarms list
  renderAlarms();
};

// Clear alarm
const clearAlarm = () => {
  // Clear stored alarms
  storedAlarms = [];
  // Save updated alarms to local storage
  localStorage.setItem("alarms", JSON.stringify(storedAlarms));

  // Render updated alarms list
  renderAlarms();
};

// Hide Welcome Screen
const hideWelcomeScreen = () => {
  // hide WelcomeScreen
  welcomeBackScreen.classList.add("disp-none");
  alarmContainer.classList.remove("disp-none");
  // Set userExited to xxx to avoid DomException
  localStorage.setItem("userExited", "xxx");
};

// Event listeners
setAlarmBtn.addEventListener("click", setAlarm);
resumeBtn.addEventListener("click", hideWelcomeScreen);
document.addEventListener("click", dispAlarmList);

// Initially render alarms list
renderAlarms();
