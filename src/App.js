import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';

function App() {
  const [problems, setProblems] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('+');
  const [numProblems, setNumProblems] = useState(10);
  const [digitsInOperand1, setDigitsInOperand1] = useState(1);
  const [digitsInOperand2, setDigitsInOperand2] = useState(1);
  const [problemsGenerated, setProblemsGenerated] = useState(false);

  const generateProblems = () => {
    const newProblems = [];
    const operation = selectedOperation;
    const totalProblems = numProblems;
    let problemsGenerated = 0;

    while (problemsGenerated < totalProblems) {
      const row = [];
      for (let j = 0; j < 1 && problemsGenerated < totalProblems; j++) {
        const num1 = getRandomNumber(digitsInOperand1);
        const num2 = getRandomNumber(digitsInOperand2);

        const problem = {
          operand1: num1,
          operand2: num2,
          operator: operation,
        };

        row.push(problem);
        problemsGenerated++;
      }
      newProblems.push(row);
    }

    setProblems(newProblems);
    setProblemsGenerated(true);
  };

  const getRandomNumber = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleOperationChange = (event) => {
    setSelectedOperation(event.target.value);
  };

  const handleNumProblemsChange = (event) => {
    setNumProblems(parseInt(event.target.value, 10) || 0);
  };

  const handleDigitsInOperand1Change = (event) => {
    setDigitsInOperand1(parseInt(event.target.value, 10) || 1);
  };

  const handleDigitsInOperand2Change = (event) => {
    setDigitsInOperand2(parseInt(event.target.value, 10) || 1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-12">
          <div className="header">
            <h1 className="text-center">Math Worksheet</h1>
            {problemsGenerated && (
              <button className="btn btn-primary" onClick={handleRefresh}>
                Refresh
              </button>
            )}
          </div>
          {!problemsGenerated ? (
            <div className="generator-options">
              <div className='text-center'>
              <label>
                Select Operation: 
                <select
                  className="form-select"
                  value={selectedOperation}
                  onChange={handleOperationChange}
                >
                  <option value="+">Addition</option>
                  <option value="-">Subtraction</option>
                  <option value="x">Multiplication</option>
                  <option value="÷">Division</option>
                </select>
              </label>
              </div>
              <div className='text-center'>
              <label>
                Number of Problems:
                <input
                  type="number"
                  className="form-control"
                  value={numProblems}
                  onChange={handleNumProblemsChange}
                  min="1"
                />
              </label>
              </div>
              <div className='text-center'>
              <label>
                Number of Digits in Operand 1:
                <input
                  type="number"
                  className="form-control"
                  value={digitsInOperand1}
                  onChange={handleDigitsInOperand1Change}
                  min="1"
                />
              </label>
              </div>
              <div className='text-center'>
              <label>
                Number of Digits in Operand 2:
                <input
                  type="number"
                  className="form-control"
                  value={digitsInOperand2}
                  onChange={handleDigitsInOperand2Change}
                  min="1"
                />
              </label>
              </div>
              <div className='text-center'>
              <button
                className="btn btn-success mt-3"
                onClick={generateProblems}
              >
                Generate New Worksheet
              </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {problems.map((row, rowIndex) => (
                <div key={rowIndex} className="col-lg-2 col-4">
                  {row.map((p, colIndex) => (
                    <div
                      key={colIndex}
                      className="problem col-12 mb-4"
                    >
                      <div className="equation text-center text-md-left text-sm-left">
                        <div className="operator">{p.operator}</div>
                        <div className="operand">
                          {p.operand1}
                          <br />
                          {p.operand2}
                        </div>
                      </div>
                      <div className="answer">____________</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


