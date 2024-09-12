import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';
import placevalue from './assets/placevalue.png'
import placevaluelabel from './assets/placevaluelabels.png'
import regroup from './assets/regrouping.png'
import logo from './assets/logo1.2.png'
import Select from 'react-select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [problems, setProblems] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('+');
  const [numProblems, setNumProblems] = useState("");
  const [digitsInOperand1, setDigitsInOperand1] = useState("");
  const [digitsInOperand2, setDigitsInOperand2] = useState("");
  const [problemsGenerated, setProblemsGenerated] = useState(false);
  const [regrouping, setRegrouping] = useState(true);

  useEffect(() => {
    // Detect Google Chrome and add class to HTML element
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (isChrome) {
      document.documentElement.className += ' chrome';
    }

    // Update body class based on problemsGenerated state
    if (problemsGenerated) {
      document.body.classList.add('problems-generated');
    } else {
      document.body.classList.remove('problems-generated');
    }
  }, [problemsGenerated]);    

  const handleRegroupingChange = (selectedOption) => {
    setRegrouping(selectedOption.value === 'true');
  };

  const generateProblems = () => {
    const newProblems = [];
    const totalProblems = numProblems;
  
    while (newProblems.length < totalProblems) {
      let num1, num2;
      let regroupRequired;
  
      // Generate problems based on selected operation
      switch (selectedOperation) {
        case '+':
          ({ num1, num2, regroupRequired } = generateAdditionProblem());
          break;
        case '-':
          ({ num1, num2, regroupRequired } = generateSubtractionProblem());
          break;
        case 'x': // For multiplication
          ({ num1, num2, regroupRequired } = generateMultiplicationProblem());
          break;
        case '÷': // For division
          ({ num1, num2, regroupRequired } = generateDivisionProblem());
          break;
        default:
          break;
      }
  
      // If regrouping is disabled, ensure the problem doesn't require regrouping
      if (!regrouping && regroupRequired) {
        continue; // Skip and regenerate the problem
      }
  
      const problemNumber = newProblems.length + 1;
  
      newProblems.push([{
        operand1: num1,
        operand2: num2,
        operator: selectedOperation,
        problemNumber: problemNumber,
        regrouping: regrouping && regroupRequired, // Regrouping control
      }]);
    }
  
    setProblems(newProblems);
    setProblemsGenerated(true);
  };
  
  // Function to generate an addition problem
  const generateAdditionProblem = () => {
    let num1 = getRandomNumber(digitsInOperand1);
    let num2 = getRandomNumber(digitsInOperand2);
    let regroupRequired = checkCarryOver(num1, num2);
  
    return { num1, num2, regroupRequired };
  };
  
  // Function to generate a subtraction problem
  const generateSubtractionProblem = () => {
    let num1 = getRandomNumber(digitsInOperand1);
    let num2 = getRandomNumber(digitsInOperand2);
  
    // Ensure no negative results for subtraction
    if (num2 > num1) [num1, num2] = [num2, num1];
  
    let regroupRequired = checkBorrowing(num1, num2);
  
    return { num1, num2, regroupRequired };
  };
  
  // Function to generate a multiplication problem
  const generateMultiplicationProblem = () => {
    let num1 = getRandomNumber(digitsInOperand1);
    let num2 = getRandomNumber(digitsInOperand2);
    let regroupRequired = checkMultiplicationCarryOver(num1, num2);
  
    return { num1, num2, regroupRequired };
  };
  
  // Function to generate a division problem
  const generateDivisionProblem = () => {
    let num1 = getRandomNumber(digitsInOperand1);
    let num2 = getRandomNumber(digitsInOperand2);
  
    // Ensure no division by zero
    if (num2 === 0) num2 = 1;
  
    // Ensure no fractional results
    num1 = num1 * num2; // Make sure num1 is divisible by num2
  
    let regroupRequired = checkDivisionRemainder(num1, num2);
  
    return { num1, num2, regroupRequired };
  };
  
  // Checking for carryover in addition
  const checkCarryOver = (num1, num2) => {
    const num1Digits = num1.toString().split('').reverse().map(Number);
    const num2Digits = num2.toString().split('').reverse().map(Number);
  
    for (let i = 0; i < Math.min(num1Digits.length, num2Digits.length); i++) {
      if (num1Digits[i] + num2Digits[i] >= 10) {
        return true; // Regrouping required (carryover)
      }
    }
    return false;
  };
  
  // Checking for borrowing in subtraction
  const checkBorrowing = (num1, num2) => {
    const num1Digits = num1.toString().split('').reverse().map(Number);
    const num2Digits = num2.toString().split('').reverse().map(Number);
  
    for (let i = 0; i < Math.min(num1Digits.length, num2Digits.length); i++) {
      if (num1Digits[i] < num2Digits[i]) {
        return true; // Borrowing required
      }
    }
    return false;
  };
  
  // Checking for carryover in multiplication
  const checkMultiplicationCarryOver = (num1, num2) => {
    const num1Digits = num1.toString().split('').reverse().map(Number);
    const num2Digits = num2.toString().split('').reverse().map(Number);
  
    // Check multiplication of each pair of digits for carryover
    for (let i = 0; i < Math.min(num1Digits.length, num2Digits.length); i++) {
      if (num1Digits[i] * num2Digits[i] >= 10) {
        return true; // Regrouping required (carryover)
      }
    }
    return false;
  };
  
  // Checking for a remainder in division (regrouping in division)
  const checkDivisionRemainder = (num1, num2) => {
    return num1 % num2 !== 0; // If there's a remainder, regrouping (or fraction) is required
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

   const generatePDF = () => {
    if (window.confirm('Do you want to download the PDF?')) {
      const input = document.getElementById('worksheet');
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('worksheet.pdf');
      });
    }
  };

  return (
    <div className="container background-container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-12">
          <div className="header">
            {!problemsGenerated && (
              <div className="logo-wrapper">
                <button className="logo-button" onClick={generateProblems}>
                  <img src={logo} alt="logo" className="background-logo" />
                  <span className="logo-text">Create Worksheet</span>
                </button>
              </div>
            )}
          </div>

          {!problemsGenerated ? (
            <div className="generator-options row">
              <div className="col-md-12 text-center d-flex flex-column flex-md-row justify-content-md-around align-items-center">
                <div className="select-container">
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

                <div className="select-container">
                  <label className="custom-label">
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

                <div className="select-container">
                  <label className="custom-label">
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
                <div className="select-container">
                  <label className="custom-label">
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
                <div className="select-container">
                  <label className="custom-label">
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
              </div>
            </div>
          ) : (
            <div className="header">
              <h1 className="text-center">
                {getOperationName(selectedOperation)} Worksheet
                <br />
                <div className="image-container2">
                  <img src={placevalue} alt="placevalue" className="image img-fluid" style={{ width: '28rem', marginBottom: '-40px', marginLeft: '-80px' }} />
                  <img src={placevaluelabel} alt="placevaluelabel" className="image-label img-fluid" style={{ width: '24rem', marginBottom: '-120px', marginLeft: '-440px' }} />
                </div>
                <br /> Place Value Chart
              </h1>
              <button className="btn btn-primary refresh" onClick={handleRefresh}>
                Refresh
              </button>
              <button className="btn btn-success generate-pdf" onClick={generatePDF}>
                Generate PDF
              </button>
            </div>
          )}
          <div className="row" id="worksheet">
            {problems.map((row, rowIndex) => (
              <div key={rowIndex} className="col-lg-3 col-8">
                {row.map((p, colIndex) => (
                  <div key={colIndex} className="problem col-12 mb-4">
                    <div className="equation text-center text-md-left text-sm-left">
                      <div className="problem-number" style={{ position: 'absolute' }}> {p.problemNumber}.</div>
                      <div className="operator" style={{ position: 'relative' }}>{p.operator}</div>
                      <div className="operand image-container">
                        <img src={regroup} style={{ width: '8rem', marginBottom: '-130px', marginLeft: '10px' }} alt="regroup" />
                        <img src={placevalue} style={{ width: '8rem', marginLeft: '10px', marginBottom: '-30px' }} alt="placevalue" />
                        <br />
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
                backgroundPosition: 'center'
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


