import './App.css'
import { useState } from 'react'

function App() {

    function inputDigit(digit: string) {
      if(startNewNumber && !operator) {
          setDisplay(digit)
          setPreviousOperation('')
          setFirstNumber(null)
          setStartNewNumber(false)
      } else if (display === '0') {
        setDisplay(digit)
      } else {
        setDisplay(display + digit)
      }
    }

    function inputDecimal() {
        if(!display.includes('.')) {
            setDisplay(display + '.')
        }
    }

    function performCalculation(num1: number, num2: number, op: string): number {
        switch(op) {
            case '+':
                return num1 + num2
            case '-':
                return num1 - num2
            case 'x':
                return num1 * num2
            case '÷':
                return num1 / num2
            default:
                return num2
        }
    }

    function toggleSign() {
        setDisplay(String(Number(display)*-1))
    }

    function handlePercentage() {
        if (!isPercentage) {
            setPreviousOperation(
                operator != null
                    ? previousOperation + ' ' + display + '%'
                    : display + '%'
            )
            setIsPercentage(true)
        }
    }

    function chooseOperator(currentOperator: string) {
        if (operator != null && firstNumber != null) {
            let secondNumber = Number(display)

            if (isPercentage) {
                if (operator == '+' || operator == '-') {
                    secondNumber = (firstNumber * 0.01) * secondNumber
                } else {
                    secondNumber = secondNumber * 0.01
                }
            }

            const result = performCalculation(firstNumber, secondNumber, operator)

            setDisplay(String(Number(result.toFixed(10))))
            setFirstNumber(result)
            setPreviousOperation(String(result) + ' ' + currentOperator)
        } else {
            setFirstNumber(Number(display))
            setPreviousOperation(display + ' ' + currentOperator)
        }

        setOperator(currentOperator)
        setIsPercentage(false)
        setDisplay('0')
        setStartNewNumber(false)
    }

    function calculate() {
        let result: number
        let secondNumber: number = Number(display)

        if(operator == null && isPercentage) {
            result = secondNumber * 0.01
        }
        else if(operator != null && firstNumber != null) {
                if(!isPercentage) {
                    setPreviousOperation(previousOperation + ' ' + display)
                }

                if(isPercentage) {
                    if(operator == '+' || operator == '-') {
                        secondNumber = (firstNumber * 0.01) * secondNumber
                    } else {
                        secondNumber = secondNumber * 0.01
                    }
                }

                switch(operator) {
                    case '+':
                        result = firstNumber + secondNumber
                        break
                    case '-':
                        result = firstNumber - secondNumber
                        break
                    case 'x':
                        result = firstNumber * secondNumber
                        break
                    case '÷':
                        result = firstNumber / secondNumber
                        break
                }
        }
        setDisplay(String(Number(result.toFixed(10))))
        setOperator(null)
        setIsPercentage(false)
        setStartNewNumber(true)
    }
    const [display, setDisplay] = useState('0')
    const [firstNumber, setFirstNumber] = useState<number | null>(null)
    const [operator, setOperator] = useState<string | null>(null)
    const [previousOperation, setPreviousOperation] = useState('')
    const [startNewNumber, setStartNewNumber] = useState(false)
    const [isPercentage, setIsPercentage] = useState(false)
return (
<main className="calculator">
<div className="display">
<div className="previous-operation">{previousOperation} </div>
<div className="current-value">
    {isPercentage ? display + '%' : display}
</div>
</div>

  <div className="buttons">
    <button
        className="utility"
        onClick={() => {
            setDisplay('0')
            setPreviousOperation('')
            setFirstNumber(null)
            setOperator(null)
            setStartNewNumber(false)
            setIsPercentage(false)
        }}
    >
        AC
    </button>
    <button className="utility" onClick={() => toggleSign()}>±</button>
    <button className="utility" onClick={() => handlePercentage()}>%</button>
    <button className="operator" onClick={() => chooseOperator('÷')}>÷</button>

    <button onClick={() => inputDigit('7')}>7</button>
    <button onClick={() => inputDigit('8')}>8</button>
    <button onClick={() => inputDigit('9')}>9</button>
    <button className="operator" onClick={() => chooseOperator('x')}>×</button>

    <button onClick={() => inputDigit('4')}>4</button>
    <button onClick={() => inputDigit('5')}>5</button>
    <button onClick={() => inputDigit('6')}>6</button>
    <button className="operator" onClick={() => chooseOperator('-')}>−</button>

    <button onClick={() => inputDigit('1')}>1</button>
    <button onClick={() => inputDigit('2')}>2</button>
    <button onClick={() => inputDigit('3')}>3</button>
    <button className="operator" onClick={() => chooseOperator('+')}>+</button>

    <button className="zero" onClick={() => inputDigit('0')}>0</button>
    <button onClick={() => inputDecimal()}>.</button>
    <button className="operator" onClick={() => calculate()}>=</button>
  </div>
</main>

)
}

export default App