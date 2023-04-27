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

    if (total && total > -1) {
        noTip.classList.add('hidden');
        tipSuggestion.classList.remove('hidden');
        updateTip(total);
    } else {
        noTip.classList.remove('hidden');
        tipSuggestion.classList.add('hidden');
    }
}

function updateTip(total) {
    const form = document.getElementById('tip-selection');
    const radioButtons = form.querySelectorAll('input[type="radio"]');

    const fixedChoice = Array.from(radioButtons).filter(
        button => parseNum(button.value) > 0
    );

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

window.onload = () => {
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    updateDate(date);
    updateTime(time);

    setInterval(() => updateTime(time), 1000);

    const totalInput = document.getElementById('total');

    totalInput.addEventListener('input', totalOnChange);
};
