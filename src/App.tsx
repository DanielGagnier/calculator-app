
import './App.css'
import { useState } from 'react'

type ExpressionItem = {
    value: number
    isPercentage: boolean
}

function App() {
    const [display, setDisplay] = useState('0')
    const [expression, setExpression] = useState<(ExpressionItem | string)[]>([])
    const [previousOperation, setPreviousOperation] = useState('')
    const [isPercentage, setIsPercentage] = useState(false)
    const [startNewNumber, setStartNewNumber] = useState(false)

    function formatResult(value: number): string {
        return String(Number(value.toFixed(10)))
    }

    function inputDigit(digit: string) {
        if (startNewNumber) {
            setDisplay(digit)
            setStartNewNumber(false)
            setIsPercentage(false)
        } else if (display === '0') {
            setDisplay(digit)
        } else {
            setDisplay(display + digit)
        }
    }

    function inputDecimal() {
        if (startNewNumber) {
            setDisplay('0.')
            setStartNewNumber(false)
        } else if (!display.includes('.')) {
            setDisplay(display + '.')
        }
    }

    function toggleSign() {
        setDisplay(String(Number(display) * -1))
    }

    function handlePercentage() {
        if (!isPercentage) {
            setIsPercentage(true)
            setPreviousOperation(
                previousOperation + display + '%'
            )
        }
    }

    function chooseOperator(currentOperator: string) {
        if (startNewNumber && expression.length > 0) {
            setExpression([
                ...expression.slice(0, -1),
                currentOperator
            ])
            setPreviousOperation(
                previousOperation.replace(/[+\-x÷]$/, currentOperator)
            )
            return
        }

        const newExpression = [
            ...expression,
            {
                value: Number(display),
                isPercentage: isPercentage
            },
            currentOperator
        ]

        setExpression(newExpression)
        setPreviousOperation(
            newExpression.map(item =>
                typeof item === 'string'
                    ? item
                    : formatResult(item.value) + (item.isPercentage ? '%' : '')
            ).join(' ')
        )

        setDisplay('0')
        setIsPercentage(false)
        setStartNewNumber(true)
    }

    function performCalculation(
        num1: number,
        num2: number,
        operator: string
    ): number {
        switch (operator) {
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

    function calculate() {
        const items = [
            ...expression,
            {
                value: Number(display),
                isPercentage: isPercentage
            }
        ]

        if (items.length === 1 && isPercentage) {
            const result = items[0].value / 100
            setDisplay(formatResult(result))
            setPreviousOperation(display + '%')
            setExpression([])
            setIsPercentage(false)
            setStartNewNumber(true)
            return
        }

        if (items.length < 3) return

        const values = items.map(item =>
            typeof item === 'string' ? item : item.value
        )

        // Apply percentage adjustments.
        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            if (typeof item !== 'string' && item.isPercentage) {
                const precedingOperator = items[i - 1]

                if (precedingOperator === '+' || precedingOperator === '-') {
                    let precedingValue = Number(values[i - 2])

                    // Account for multiplication/division immediately
                    // before the addition or subtraction.
                    if (items[i - 3] === 'x' || items[i - 3] === '÷') {
                        precedingValue = performCalculation(
                            Number(items[i - 4]),
                            precedingValue,
                            String(items[i - 3])
                        )
                    }

                    values[i] = precedingValue * item.value / 100
                } else {
                    values[i] = item.value / 100
                }
            }
        }

        // First pass: multiplication and division.
        let i = 1

        while (i < values.length - 1) {
            const operator = values[i]

            if (operator === 'x' || operator === '÷') {
                const result = performCalculation(
                    Number(values[i - 1]),
                    Number(values[i + 1]),
                    String(operator)
                )

                values.splice(i - 1, 3, result)
            } else {
                i += 2
            }
        }

        // Second pass: addition and subtraction.
        let result = Number(values[0])

        for (let i = 1; i < values.length; i += 2) {
            result = performCalculation(
                result,
                Number(values[i + 1]),
                String(values[i])
            )
        }

        setPreviousOperation(
            items.map(item =>
                typeof item === 'string'
                    ? item
                    : formatResult(item.value) + (item.isPercentage ? '%' : '')
            ).join(' ')
        )

        setDisplay(formatResult(result))
        setExpression([])
        setIsPercentage(false)
        setStartNewNumber(true)
    }

    function clearCalculator() {
        setDisplay('0')
        setExpression([])
        setPreviousOperation('')
        setIsPercentage(false)
        setStartNewNumber(false)
    }

    return (
        <main className="calculator">
            <div className="display">
                <div className="previous-operation">
                    {previousOperation}
                </div>
                <div className="current-value">
                    {isPercentage ? display + '%' : display}
                </div>
            </div>

            <div className="buttons">
                <button className="utility" onClick={clearCalculator}>AC</button>
                <button className="utility" onClick={toggleSign}>±</button>
                <button className="utility" onClick={handlePercentage}>%</button>
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
                <button onClick={inputDecimal}>.</button>
                <button className="operator" onClick={calculate}>=</button>
            </div>
        </main>
    )
}

export default App
