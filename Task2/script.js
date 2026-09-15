const display=document.getElementById("display");
const buttons=document.querySelectorAll("button");
const operators=["+","−","×","÷"];

let justCalculated= false;

// Calculate expression
function calculate() {
try {
let expression=display.value;

    expression=expression.replaceAll("×", "*");
    expression=expression.replaceAll("÷", "/");
    expression=expression.replaceAll("−", "-");

    if(!expression) {
        return;
    }

    const result=eval(expression);

    if (!Number.isFinite(result)) {
        display.value = "Cannot divide by zero";
    } else {
        display.value = result;
    }
    justCalculated=true;

} catch {
    display.value = "Error";
    justCalculated=true;
}

}

// Add value to display
function addValue(value) {

// start new calculation after "="
if(justCalculated){
    if(!operators.includes(value)){
        display.value="";
    }
    justCalculated=false;
}

const lastCharacter=display.value.slice(-1);

// Prevent multiple operators
if (operators.includes(value) && operators.includes(lastCharacter)) {
    display.value=display.value.slice(0, -1) + value;
    return;
}

// Prevent multiple decimal points
if (value === ".") {

    const parts = display.value.split(/[+−×÷]/);
    const currentNumber = parts[parts.length - 1];

    if (currentNumber.includes(".")) {
        return;
    }
}

display.value += value;

}

// Button click
buttons.forEach(button => {

button.addEventListener("click", () => {

    const value=button.textContent;

    // Clear
    if (button.id==="clear") {
        display.value = "";
        justCalculated=false;
    }

    // Equal
    else if (value==="=") {
        calculate();
    }

    // Backspace
    else if (value==="⌫") {
        display.value=display.value.slice(0, -1);
        justCalculated=false;
    }

    // Other buttons
    else {
        addValue(value);
    }

});

});

// Keyboard support
document.addEventListener("keydown",(event) => {

const key=event.key;

// Numbers
if (key >="0" && key <= "9") {
    addValue(key);
}

// Operators
else if (key === "+") {
    addValue("+");
}

else if (key === "-") {
    addValue("−");
}

else if (key==="*") {
    addValue("×");
}

else if (key === "/") {
    addValue("÷");
}

// Decimal
else if (key === ".") {
    addValue(".");
}

// Calculate
else if (key === "Enter" || key === "=") {
    calculate();
}

// Backspace
else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
    justCalculated=false;
}

// Clear
else if (key === "Escape") {
    display.value = "";
    justCalculated=false;
}

});