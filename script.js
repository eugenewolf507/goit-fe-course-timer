/*
Добавьте следующий функционал:
  
+ При нажатии на кнопку button.js-start, запускается таймер, который считает время 
  со старта и до текущего момента времени, обновляя содержимое элемента p.js-time 
  новым значение времени в формате xx:xx.x (минуты:секунды.сотни_миллисекунд).
     
  🔔 Подсказка: так как необходимо отображать только сотни миллисекунд, интервал
                достаточно повторять не чаще чем 1 раз в 100 мс.
  
+ Когда секундомер запущен, текст кнопки button.js-start меняется на 'Pause', 
- а функционал при клике превращается в оставновку секундомера без сброса 
  значений времени.
  
  🔔 Подсказка: вам понадобится буль который описывает состояние таймера активен/неактивен.

- Если секундомер находится в состоянии паузы, текст на кнопке button.js-start
  меняется на 'Continue'. При следующем клике в нее, продолжается отсчет времени, 
  а текст меняется на 'Pause'. То есть если во время нажатия 'Pause' прошло 6 секунд 
  со старта, при нажатии 'Continue' 10 секунд спустя, секундомер продолжит отсчет времени 
  с 6 секунд, а не с 16. 
  
  🔔 Подсказка: сохраните время секундомера на момент паузы и используйте его 
                при рассчете текущего времени после возобновления таймера отнимая
                это значение от времени запуска таймера.
  
- Если секундомер находится в активном состоянии или в состоянии паузы, кнопка 
  button.js-reset должна быть активна (на нее можно кликнуть), в противном случае
  disabled. Функционал при клике - остановка таймера и сброс всех полей в исходное состояние.
  
- Функционал кнопки button.js-take-lap при клике - сохранение текущего времени секундомера 
  в массив и добавление в ul.js-laps нового li с сохраненным временем в формате xx:xx.x
*/
// ===========================================================================
const time = document.querySelector(".js-time");
const startBtn = document.querySelector(".js-start");
const lapBtn = document.querySelector(".js-take-lap");
const stopBtn = document.querySelector(".js-reset");
const lapsList = document.querySelector(".js-laps");

const timer = {
  startTime: null,
  deltaTime: null,
  id: null,
  active: null,
  laps: []
};

function setActiveBtn(target) {
  if (target.classList.contains("active")) {
    return;
  }
  startBtn.classList.remove("active");
  lapBtn.classList.remove("active");
  stopBtn.classList.remove("active");
  target.classList.add("active");
}

function getFormattedTime(time) {
  var tm = new Date(time);
  var tmMS = tm.toTimeString(); // minutes + seconds
  tmMS = tmMS.slice(3, 8); //get from 3 to 8 char from string text with minutes and seconds
  var tmMilS = parseInt(tm.getMilliseconds() / 100); // milliseconds
  return `${tmMS + "." + tmMilS}`;
}

// Обновляет поле счетчика новым значением при вызове
// аргумент time это кол-во миллисекунд
function updatetime(elem, time) {
  elem.textContent = `${getFormattedTime(time)}`;
}

startBtn.addEventListener("click", startTimer);

function startTimer() {
  const target = event.target;
  setActiveBtn(target);
  lapBtn.classList.remove("transparent");
  stopBtn.classList.remove("transparent");

  lapBtn.addEventListener("click", lap);
  stopBtn.addEventListener("click", stopTimer);

  // for first click
  if (timer.active === null) {
    timer.active = false;
    timer.startTime = Date.now();
  }

  // for timer pause and continue
  if (!timer.active) {
    timer.active = true;
    target.textContent = "Pause";
    timer.startTime = Date.now() - timer.deltaTime;
    timerID = setInterval(() => {
      timer.deltaTime = Date.now() - timer.startTime;
      updatetime(time, timer.deltaTime);
    }, 100);
  } else {
    timer.active = false;
    target.textContent = "Continue";
    clearTimeout(timerID);
  }
}

function stopTimer() {
  const target = event.target;
  setActiveBtn(target);
  clearTimeout(timerID);
  timer.startTime = null;
  timer.deltaTime = null;
  timer.active = null;
  updatetime(time, 0);
  startBtn.textContent = "Start";
  stopBtn.classList.add("transparent");
  lapBtn.classList.add("transparent");
  lapBtn.removeEventListener("click", lap);
  stopBtn.removeEventListener("click", stopTimer);
  lapsList.innerHTML=''; //clear lapsList
}

function lap() {
  const target = event.target;
  setActiveBtn(target);

  const lapItem = document.createElement("li");
  updatetime(lapItem, timer.deltaTime);
  lapsList.appendChild(lapItem);
}