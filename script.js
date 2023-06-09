function updateDate(element) {
    const now = new Date();
    element.textContent = now.toLocaleDateString();
}

function updateTime(element) {
    const now = new Date();
    const time = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    element.textContent = time;
}

function parseNum(string) {
    string = string.endsWith('.')
        ? string.substring(0, string.length - 1)
        : string;
    return Number(string);
}

function totalOnChange(event) {
    const total = parseNum(event.target.value);
    const noTip = document.getElementById('no-tip');
    const tipSuggestion = document.getElementById('suggestion');

    if (total && total > 0) {
        noTip.classList.add('hidden');
        tipSuggestion.classList.remove('hidden');
        tipSuggestion.addEventListener('transitionstart', changeScroll);
        updateTip(total);
    } else {
        tipSuggestion.removeEventListener('transitionstart', changeScroll);
        noTip.classList.remove('hidden');
        tipSuggestion.classList.add('hidden');
    }
}

function getFixedRadioButtons() {
    const form = document.getElementById('tip-selection');
    const radioButtons = form.querySelectorAll('input[type="radio"]');

    return Array.from(radioButtons).filter(
        button => parseNum(button.value) > 0
    );
}

function updateTip(total) {
    const form = document.getElementById('tip-selection');
    const fixedChoice = getFixedRadioButtons();
    fixedChoice.forEach(button => updateLabel({ form, total, button }));
}

function updateLabel({ form, total, button }) {
    const tip = (parseNum(button.value) / 100) * total;
    const tippedTotal = total + tip;
    const name = button.id;
    const label = form.querySelector(`label[for='${name}']`);
    const totalSpan = label.nextElementSibling;

    label.textContent = `${button.value}% $${tip.toFixed(2)}`;
    totalSpan.textContent = `total: $${tippedTotal.toFixed(2)}`;
}

function manualTipOnChange(event) {
    const input = event.target;
    const totalInput = document.getElementById('total');
    const totalSpan = document.getElementById('custom-total');
    const customTip = parseNum(input.value);
    if (customTip || customTip > -1) {
        totalSpan.textContent = `total: $${(
            customTip + parseNum(totalInput.value)
        ).toFixed(2)}`;
    } else {
        totalSpan.textContent = 'total: $_____';
    }
}

function selectCustomTip() {
    const customTipRadio = document.getElementById('percent-x');
    customTipRadio.checked = true;
}

function validateInput(event, strat) {
    const num = parseNum(event.target.value);
    event.target.value = strat(num) ? num.toFixed(2) : '';
}

function clearZero(event) {
    const num = parseNum(event.target.value);
    event.target.value = num == 0 ? '' : num.toFixed(2);
}

function clearManualTip() {
    document.getElementById('manual-tip').value = '';
    document.getElementById('custom-total').textContent = 'total: $_____';
}

function changeScroll() {
    if (window.innerWidth > 600) return;
    document.getElementById('manual-tip').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}

window.onload = () => {
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    updateDate(date);
    updateTime(time);

    setInterval(() => updateTime(time), 1000);

    getFixedRadioButtons().forEach(button =>
        button.addEventListener('input', clearManualTip)
    );

    const totalInput = document.getElementById('total');
    totalInput.addEventListener('input', totalOnChange);
    totalInput.addEventListener('focusout', e =>
        validateInput(e, num => num && num > -1)
    );

    const manualTip = document.getElementById('manual-tip');
    manualTip.addEventListener('input', manualTipOnChange);
    manualTip.addEventListener('focusin', selectCustomTip);
    manualTip.addEventListener('focusin', e =>
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    );
    manualTip.addEventListener('focusin', clearZero);
    manualTip.addEventListener('focusout', e =>
        validateInput(e, num => num ^ (num > -1))
    );
    manualTip.addEventListener('focusout', manualTipOnChange);
};
