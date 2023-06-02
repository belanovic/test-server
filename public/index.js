const btn = document.getElementsByClassName('btn')[0];
btn.addEventListener('click', clickHandler);
const display = document.getElementsByClassName('display')[0];
const rate = document.getElementsByClassName('rate')[0];
let count = 1;
function clickHandler() {
    count = count + parseInt(rate.value);
    console.log(count)
    display.innerHTML = count;
}
