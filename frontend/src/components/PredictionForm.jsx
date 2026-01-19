import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const numericFields = [
  'no_of_dependents',
  'income_annum',
  'loan_amount',
  'loan_term',
  'cibil_score',
  'residential_assets_value',
  'commercial_assets_value',
  'luxury_assets_value',
  'bank_asset_value',
];

export default function PredictionForm() {
  const formRef = useRef(null);
  const [result, setResult] = useState(null);

  // On submit, read form data and validate numeric fields manually
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    // Validate numeric fields
    const errors = [];
    numericFields.forEach((field) => {
      const value = data[field]?.trim();
      if (!value || isNaN(value)) {
        errors.push(`${field.replaceAll('_', ' ')} must be a valid number`);
      }
    });

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/user/predict`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Prediction failed' });
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <form ref={formRef} onSubmit={handleSubmit} className="form" noValidate>
          <p className="title">Loan Prediction Form</p>

          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                name="no_of_dependents"
                placeholder="No of Dependents"
                required
                autoComplete="off"
              />
              <span>No of Dependents</span>
            </label>

            <label>
              <input
                className="input"
                type="text"
                name="income_annum"
                placeholder="Income Annum"
                required
                autoComplete="off"
              />
              <span>Income Annum</span>
            </label>
          </div>

          <div className="flex">
            <label>
              <input
                className="input"
                type="text"
                name="loan_amount"
                placeholder="Loan Amount"
                required
                autoComplete="off"
              />
              <span>Loan Amount</span>
            </label>

            <label>
              <input
                className="input"
                type="text"
                name="loan_term"
                placeholder="Loan Term"
                required
                autoComplete="off"
              />
              <span>Loan Term</span>
            </label>
          </div>

          <label>
            <input
              className="input"
              type="text"
              name="cibil_score"
              placeholder="CIBIL Score"
              required
              autoComplete="off"
            />
            <span>CIBIL Score</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="residential_assets_value"
              placeholder="Residential Assets Value"
              required
              autoComplete="off"
            />
            <span>Residential Assets Value</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="commercial_assets_value"
              placeholder="Commercial Assets Value"
              required
              autoComplete="off"
            />
            <span>Commercial Assets Value</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="luxury_assets_value"
              placeholder="Luxury Assets Value"
              required
              autoComplete="off"
            />
            <span>Luxury Assets Value</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              name="bank_asset_value"
              placeholder="Bank Asset Value"
              required
              autoComplete="off"
            />
            <span>Bank Asset Value</span>
          </label>

          <label>
            <select className="input" name="education" required defaultValue="">
              <option value="" disabled>
                Select Education
              </option>
              <option value="High School">High School</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Other">Other</option>
            </select>
            <span>Education</span>
          </label>

          <label>
            <select className="input" name="self_employed" required defaultValue="">
              <option value="" disabled>
                Select Self Employed
              </option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <span>Self Employed</span>
          </label>

          <button className="submit" type="submit">
            Predict
          </button>
        </form>
        {result && (
          <div className="result-card">
            <div className="header">
              <h3 className="result-title">Result Analytics</h3>
              {result.error ? (
                <p className="error">{result.error}</p>
              ) : (
                <span className="status">
                  <span className="dot" />
                  Status: <strong>{result.prediction}</strong>
                </span>
              )}
            </div>

            {!result.error && (
              <div className="scores">
                <div className="score-box">
                  <CircularProgressbar
                    value={result.risk_score}
                    maxValue={100}
                    text={`${result.risk_score}%`}
                    background
                    styles={buildStyles({
                      strokeLinecap: 'round',
                      pathColor: '#ff002f',
                      trailColor: '#333',
                      textColor: '#fff',
                      backgroundColor: '#111',
                      textSize: '18px',
                    })}
                  />
                  <p>Risk Score</p>
                </div>
                <div className="score-box">
                  <CircularProgressbar
                    value={result.confidence}
                    maxValue={100}
                    text={`${result.confidence}%`}
                    background
                    styles={buildStyles({
                      strokeLinecap: 'round',
                      pathColor: '#00bfff',
                      trailColor: '#333',
                      textColor: '#fff',
                      backgroundColor: '#111',
                      textSize: '18px',
                    })}
                  />
                  <p>Confidence</p>
                </div>
              </div>
            )}

            {result.explanation && (
              <div className="shap-section">
                <h4 className="shap-title">🔍 SHAP Explanation</h4>

                {result.explanation.features_increasing_approval?.length > 0 && (
                  <div className="shap-group approval">
                    <p className="shap-label">📈 Features Increasing Approval</p>
                    <ul>
                      {result.explanation.features_increasing_approval.map(([feature, val], i) => (
                        <li key={i}>
                          <span className="shap-feature">{feature}</span>: <span className="shap-value">{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.explanation.features_increasing_rejection?.length > 0 && (
                  <div className="shap-group rejection">
                    <p className="shap-label">📉 Features Increasing Rejection</p>
                    <ul>
                      {result.explanation.features_increasing_rejection.map(([feature, val], i) => (
                        <li key={i}>
                          <span className="shap-feature">{feature}</span>: <span className="shap-value">{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
  display: flex;
  gap: 10px; /* space between form and result */
  justify-content: center;
  align-items: flex-start;
  max-width: 1300px;
  margin: 10px auto;
  flex-wrap: wrap; /* for smaller screens, wrap vertically */
}
  .form {
    width: 600px;
    margin: 20px auto;
    padding: 25px;
    background: #1a1a1a;
    border-radius: 15px;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #00bfff;
    margin-bottom: 20px;
    text-align: center;
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
  .input {
    padding: 12px;
    margin-top: 5px;
    border-radius: 8px;
    border: none;
    background: #333;
    color: #fff;
    font-size: 1rem;
  }
  .flex {
    display: flex;
    gap: 15px;
  }
  .submit {
    margin-top: 15px;
    background: #00bfff;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 1.1rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.25s ease;
  }
  .submit:hover {
    background: #009acc;
  }
  .result-card {
    margin-top: 20px;
    padding: 20px;
    background: #0f172a;
    border-radius: 12px;
    width: 600px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .result-title {
    font-size: 18px;
    font-weight: 700;
    color: #60a5fa;
  }
  .error {
    color: #f87171;
    font-weight: 600;
  }
  .status {
    color: #10b981;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
  }
  .scores {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
  }
  .score-box {
    width: 160px;
    height: 160px;
    background: #1e293b;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .score-box p {
    margin: 0;
    font-weight: 600;
  }
  .shap-section {
    margin-top: 30px;
    background: #1e293b;
    padding: 20px;
    border-radius: 12px;
    color: #e2e8f0;
  }
  .shap-title {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 12px;
  }
  .shap-group {
    margin-bottom: 18px;
  }
  .shap-label {
    font-weight: 600;
    color: #fbbf24;
    margin-bottom: 8px;
  }
  .shap-group ul {
    padding-left: 20px;
    list-style: disc;
  }
  .shap-feature {
    color: #38bdf8;
    font-weight: 600;
  }
  .shap-value {
    color: #a5f3fc;
  }
`;
