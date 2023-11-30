import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';
import placevalue from './assets/placevalue.png'
import regroup from './assets/regrouping.png'
import logo from './assets/logo.png'

function App() {
  const [problems, setProblems] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('+');
  const [numProblems, setNumProblems] = useState("");
  const [digitsInOperand1, setDigitsInOperand1] = useState("");
  const [digitsInOperand2, setDigitsInOperand2] = useState("");
  const [problemsGenerated, setProblemsGenerated] = useState(false);

  const generateProblems = () => {
    const newProblems = [];
    const operation = selectedOperation;
    const totalProblems = numProblems;
    let problemsGenerated = 0;
    let counter = 1;

    while (problemsGenerated < totalProblems) {
      const row = [];
      for (let j = 0; j < 1 && problemsGenerated < totalProblems; j++) {
        const num1 = getRandomNumber(digitsInOperand1);
        const num2 = getRandomNumber(digitsInOperand2);

        const problem = {
          operand1: num1,
          operand2: num2,
          operator: operation,
          problemNumber: counter,
        };

        row.push(problem);
        problemsGenerated++;
        counter++;
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
    const newOperation = event.target.value;
    setSelectedOperation(newOperation);
  
    // Set the document title based on the selected operation
    document.title = `Math Worksheet - ${getOperationName(newOperation)}`;
  };
  
  // Helper function to get the operation name
  const getOperationName = (operation) => {
    switch (operation) {
      case '+':
        return 'Addition';
      case '-':
        return 'Subtraction';
      case 'x':
        return 'Multiplication';
      case '÷':
        return 'Division';
      default:
        return 'Math Worksheet';
    }
  };
  

  const handleNumProblemsChange = (event) => {
    setNumProblems(parseInt(event.target.value, 10) || '');
  };

  const handleDigitsInOperand1Change = (event) => {
    setDigitsInOperand1(parseInt(event.target.value, 10) || '');
  };

  const handleDigitsInOperand2Change = (event) => {
    setDigitsInOperand2(parseInt(event.target.value, 10) || '');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getBackgroundImage = () => {
    switch (selectedOperation) {
      case '+':
        return 'url("https://suncatcherstudio.com/uploads/printables/math/hundreds-charts/pdf-png/hundreds-chart-printable-colored1-fefefe-44aa44.png")';
      case '-':
        return 'url("https://suncatcherstudio.com/uploads/printables/math/hundreds-charts/pdf-png/hundreds-chart-printable-colored1-fefefe-44aa44.png")';
      case 'x':
        return 'url("https://www.memozor.com/images/multiplication/printable_charts/zoom/multiplication_charts.jpg")';
      case '÷':
        return 'url("https://suncatcherstudio.com/uploads/printables/math/division-charts/pdf-png/printable-division-chart-filled-in-1-10-landscape-2288ee-44aaff.png")';
      default:
        return 'none';
    }
  };




  return (
    <div className="container">
  <div className="row justify-content-center mt-5">
    <div className="col-md-12">
      <div className="header">
        {!problemsGenerated && (
          <h1 className="text-center logo">
            <img src={logo} alt='logo'  className='img-fluid' />
          </h1>
        )}
      </div>

      {!problemsGenerated ? (
        <div className="generator-options row">
          <div className="col-md-6 text-center">
            <label className='custom-label'>
              Select Operation:
              <select
                className="form-select form-select-lg mb-3 custom-label"
                value={selectedOperation}
                onChange={handleOperationChange}
                aria-label=".form-select-lg"
               
              >
                <option value="+">Addition</option>
                <option value="-">Subtraction</option>
                <option value="x">Multiplication</option>
                <option value="÷">Division</option>
              </select>
            </label>
          </div>

          <div className="col-md-6 text-center">
            <label className='custom-label'>
              Number of Problems:
              <input
                type="number"
                className="form-control"
                value={numProblems}
                onChange={handleNumProblemsChange}
                min=""
                max="7"
              />
            </label>
          </div>

          <div className="col-md-6 text-center">
            <label className='custom-label'>
              # of Digits in Operand 1:
              <input
                type="number"
                className="form-control custom-label"
                value={digitsInOperand1}
                onChange={handleDigitsInOperand1Change}
                min="1"
                max="7"
              />
            </label>
          </div>

          <div className="col-md-6 text-center">
            <label className='custom-label'>
              # of Digits in Operand 2:
              <input
                type="number"
                className="form-control"
                value={digitsInOperand2}
                onChange={handleDigitsInOperand2Change}
                min="1"
                max="7"
              />
            </label>
          </div>

          <div className="col-12 text-center mt-3">
            <button
              className="btn btn-success custom-label"
              onClick={generateProblems}
            >
              Generate New Worksheet
            </button>
          </div>
        </div>
          ) : (
            <div className="header">
              <h1 className="text-center">{getOperationName(selectedOperation)} Worksheet</h1>
              <button className="btn btn-primary refresh" onClick={handleRefresh}>
                Refresh
              </button>
            </div>
)}
            <div className="row">
              {problems.map((row, rowIndex) => (
                <div key={rowIndex} className="col-lg-3 col-8">
                  {row.map((p, colIndex) => (
                    <div
                      key={colIndex}
                      className="problem col-12 mb-4"
                    >
                      <div className="equation text-center text-md-left text-sm-left">
                      <div className="problem-number" style={{position:'absolute'}}> {p.problemNumber}.</div>
                        <div className="operator" style={{position:'relative'}}>{p.operator}</div>
                        <div className="operand image-container">
                        
                        <img src={regroup} style={{ width: '8rem', marginBottom: '-130px', marginLeft:'10px'}} alt='regroup' />
                          <img src={placevalue} style={{ width: '8rem', marginLeft:'10px', marginBottom: '-30px' }} alt='placevalue' />
                       
                          <br/>
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
          {problemsGenerated && (
            <div
              className="footer"
              style={{
                backgroundImage: getBackgroundImage(),
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                height: '80vh', 
                width: '80vw',
                backgroundPosition:'center'
              }}
            >
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


