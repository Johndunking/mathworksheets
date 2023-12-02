import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';
import placevalue from './assets/placevalue.png'
import placevaluelabel from './assets/placevaluelabels.png'
import regroup from './assets/regrouping.png'
import logo from './assets/logo.png'
import Select from 'react-select';

function App() {
  const [problems, setProblems] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('+');
  const [numProblems, setNumProblems] = useState("");
  const [digitsInOperand1, setDigitsInOperand1] = useState("");
  const [digitsInOperand2, setDigitsInOperand2] = useState("");
  const [problemsGenerated, setProblemsGenerated] = useState(false);
  const [regrouping, setRegrouping] = useState(true);

  const handleRegroupingChange = (selectedOption) => {
    setRegrouping(selectedOption.value === 'true');
  };

  const generateProblems = () => {
    const newProblems = [];
    const operation = selectedOperation;
    const totalProblems = numProblems;
    const generatedProblemNumbers = new Set();
  
    while (newProblems.length < totalProblems) {
      const row = [];
      for (let j = 0; j < 1 && newProblems.length < totalProblems; j++) {
        let num1, num2;
  
        // Generate operand1 and operand2, regenerating if subtraction results in a negative answer
        do {
          num1 = getRandomNumber(digitsInOperand1);
          num2 = getRandomNumber(digitsInOperand2, true, num1);
        } while (operation === '-' && num1 < num2);
  
        const problemNumber = newProblems.length + 1;
  
        if (!generatedProblemNumbers.has(problemNumber)) {
          const problem = {
            operand1: num1,
            operand2: num2,
            operator: operation,
            problemNumber: problemNumber,
            regrouping: requiresRegrouping(operation, num1, num2, regrouping),
          };
  
          row.push(problem);
          generatedProblemNumbers.add(problemNumber);
        }
      }
      newProblems.push(row);
    }
  
    setProblems(newProblems);
    setProblemsGenerated(true);
  };


  const requiresRegrouping = (operation, num1, num2, regrouping) => {
    switch (operation) {
      case '+':
        return regrouping && hasCarryOver(num1, num2);
        case 'x':
          return regrouping && hasCarryOver(num1, num2);
      case '-':
        return regrouping && requiresBorrow(num1, num2);
      // Add cases for other operations if needed
      default:
        return false;
    }
  };

  const hasCarryOver = (num1, num2, operation) => {
    if (operation === '+') {
      const sum = num1 + num2;
      return sum >= 10;
    } else if (operation === 'x') {
      const product = num1 * num2;
      return product >= 10;
    }
  
    return false; // Default case or handle other operations if needed
  };
  
  const requiresBorrow = (num1, num2) => {
    const num1Digits = num1.toString().split('').map(Number);
    const num2Digits = num2.toString().split('').map(Number);
  
    // Check each digit from right to left
    for (let i = num1Digits.length - 1; i >= 0; i--) {
      if (num1Digits[i] < num2Digits[i]) {
        // Requires borrowing from the higher digit
        return true;
      } else if (num1Digits[i] > num2Digits[i]) {
        // No borrowing required in this digit
        return false;
      }
    }

    // All digits are equal, no borrowing required
  return false;
};

  

  const getRandomNumber = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleOperationChange = (selectedOption) => {
    setSelectedOperation(selectedOption.value);
    document.title = `Math Worksheet - ${getOperationName(selectedOption.value)}`;
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

  const operationOptions = [
    { value: '+', label: 'Addition' },
    { value: '-', label: 'Subtraction' },
    { value: 'x', label: 'Multiplication' },
    { value: '÷', label: 'Division' },
  ];


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
          <label className="custom-label">
            Select Operation:
            <Select
              className="basic-single"
              value={operationOptions.find((option) => option.value === selectedOperation)}
              onChange={handleOperationChange}
              options={operationOptions}
            />
          </label>
          </div>

          <div className="col-md-6 text-center">
            <label className='custom-label'>
              Regrouping:
              <Select
                className="basic-single"
                value={{ value: regrouping, label: regrouping ? 'With Regrouping' : 'Without Regrouping' }}
                onChange={(selectedOption) => handleRegroupingChange(selectedOption.value === 'With Regrouping')}
                options={[
                  { value: true, label: 'With Regrouping' },
                  { value: false, label: 'Without Regrouping' },
                ]}
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
              <h1 className="text-center" >{getOperationName(selectedOperation)} Worksheet <br />
              <div className="image-container2">
                <img src={placevalue} alt='placevalue' className="image img-fluid" style={{ width: '28rem', marginBottom: '-40px', marginLeft:'-80px'}}/>
                <img src={placevaluelabel} alt='placevaluelabel' className='image-label img-fluid' style={{ width: '24rem', marginBottom: '-120px', marginLeft:'-440px'}} />
              </div>
              <br /> Place Value Chart</h1>
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


