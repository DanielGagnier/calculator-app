import './App.css'
import { useState } from 'react'

function App() {
    function inputDigit(digit: string) {
      if(startNewNumber && !operator) {
          setDisplay(digit)
          setPreviousOperation(null)
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

    function chooseOperator(currentOperator: string) {
        setOperator(currentOperator)
        setFirstNumber(Number(display))
        setPreviousOperation(display + ' ' + currentOperator)
        setDisplay('0')
        setStartNewNumber(false)
    }

    function calculate() {
        if(operator != null && firstNumber != null) {
                setPreviousOperation(previousOperation + ' ' + display)
                let result: number

                switch(operator) {
                    case '+':
                        result = firstNumber + Number(display)
                        break
                    case '-':
                        result = firstNumber - Number(display)
                        break
                    case 'x':
                        result = firstNumber * Number(display)
                        break
                    case '÷':
                        result = firstNumber / Number(display)
                        break
                }
                setDisplay(String(result))
                setOperator(null)
                setStartNewNumber(true)
        }
    }
    const [display, setDisplay] = useState('0')
    const [firstNumber, setFirstNumber] = useState<number | null>(null)
    const [operator, setOperator] = useState<string | null>(null)
    const [previousOperation, setPreviousOperation] = useState('')
    const [startNewNumber, setStartNewNumber] = useState(false)
return (
<main className="calculator">
<div className="display">
<div className="previous-operation">{previousOperation} </div>
<div className="current-value">{display}</div>
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
        }}
    >
        AC
    </button>
    <button className="utility">±</button>
    <button className="utility">%</button>
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