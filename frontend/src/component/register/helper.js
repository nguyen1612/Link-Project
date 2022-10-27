import hide from '../../image/hide.png'
import view from '../../image/view.png'

export function onTabClick(evt) {
    setLineStyle(evt.target)

    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    evt.target.className += " active";

    return evt.target.innerHTML
}

function setLineStyle(tab) {
    let line = document.querySelector('.register .inner')
    line.style.left = tab.offsetLeft + "px";
    line.style.width = tab.clientWidth + "px";
}


export function addBorder(id) {
    // var hover = document.getElementsByClassName('tooltiptext');
    // hover[0].classList.add('visible')

    const current = document.getElementById(id);
    current.classList.add('addBorder')

    // let suggest = document.getElementById('suggest');
    // if (!suggest.innerHTML) {
    //     let suggestList = document.createElement('ul')
    //     suggestList.setAttribute('id', 'suggestList')
    //     suggestList.classList.add('suggestHover')
    //     suggestList.innerHTML = `<li>Contains 8 - 16 characters</li>
    //                             <li>Contains 8 - 16 characters</li>
    //                             <li>Contains 8 - 16 characters</li>
    //                             <li>Contains 8 - 16 characters</li>`
    //     suggest.appendChild(suggestList)
    // }
}

export function rmvBorder(id) {
    const div = document.getElementById(id);
    div.classList.remove('addBorder');
    
}

export function rmvInvalid(id) {
    const div = document.getElementById(id);
    div.classList.remove('addInvalid');
    const label = document.querySelector(`label[for=${id}]`)
    if (label.classList.contains('invalid')) {
        label.classList.remove('invalid')
    }
}

export function addInvalid(id) {
    let error = document.getElementById(id)
    error.classList.add('addInvalid')
    let label = document.querySelector(`label[for='${id}']`)
    
    if(!label.classList.contains('invalid')) {
        label.innerHTML = label.innerHTML.split(' ')[0]
        label.innerHTML += ' (Invalid)'
        label.classList.add('invalid')
    }
}

export function displayPassword(id1, id2) {
    const passField = document.querySelector(`input[name=${id1}]`);;
    const eyeField = document.getElementById(id2);

    eyeField.src = (passField.type === 'password') ? view : hide;
    passField.type = (passField.type === 'password') ? 'text' : 'password';
}

export function detectPass(id1, id2, id3) {
    console.log(id1)
    console.log(id2)

    const input = document.querySelector(`input[name=${id1}]`).value
    const div = document.getElementById(id2).style
    const label = document.getElementById(id3)

    const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}/
    const mediumPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/
    
    if (input.match(strongPass)) {
        div.backgroundColor = "green";
        div.width = "85%"
        label.style.color = "green"
        label.textContent = "Strong"
    } else if (input.match(mediumPass)){
        div.backgroundColor = "#FFD700";
        div.width = "60%";
        label.style.color = "#FFD700"
        label.textContent = "Medium"
    } else {
        div.backgroundColor = "red";
        div.width = "30%";
        label.style.color = "red"
        label.textContent = "Week"
    }
}
