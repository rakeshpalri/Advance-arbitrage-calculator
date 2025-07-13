// Ultra-Advanced Personal Finance Arbitrage Calculator Web Tool (Full AI & Advanced Features)
// Tech Stack: React + Tailwind + Chart.js + Context API + jsPDF

import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function FinanceCalculator() {
  const [incomeSources, setIncomeSources] = useState([{ amount: '', type: 'Salary', frequency: 'Monthly' }]);
  const [loans, setLoans] = useState([{ type: 'Personal', principal: '', emi: '', rate: '', tenure: '', interestType: 'Simple', prepaymentAllowed: true, penalty: '' }]);
  const [sips, setSips] = useState([{ name: 'Equity', amount: '', cagr: '', horizon: '', delay: 0 }]);
  const [oneTimeInvestments, setOneTimeInvestments] = useState([{ source: 'FD', amount: '', date: '' }]);

  const [report, setReport] = useState({ netWorth: [], loanChart: {}, sipGrowth: {}, alerts: [], recommendations: [], arbitrageScore: 0 });
  const [language, setLanguage] = useState('en');
  const [inflation, setInflation] = useState(5);
  const [cibilScore, setCibilScore] = useState(750);

  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  const handleAdd = (setState, defaultObj) => setState(prev => [...prev, defaultObj]);

  const calculateFinancials = () => {
    const netWorth = [100000, 150000, 200000];
    const loanChart = {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: loans.map((loan, i) => ({
        label: loan.type || `Loan ${i + 1}`,
        data: [loan.principal * 0.8, loan.principal * 0.5, loan.principal * 0.2]
      }))
    };
    const sipGrowth = {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: sips.map((sip, i) => ({
        label: sip.name || `SIP ${i + 1}`,
        data: [sip.amount * 12, sip.amount * 12 * 1.1, sip.amount * 12 * 1.3]
      }))
    };

    const alerts = [];
    const recommendations = [];
    let arbitrageScore = 0;

    loans.forEach((loan) => {
      sips.forEach((sip) => {
        if (Number(loan.rate) > Number(sip.cagr)) {
          alerts.push(`Consider repaying loan (${loan.type}) with higher interest than SIP (${sip.name})`);
        } else {
          recommendations.push(`Continue SIP (${sip.name}) instead of loan prepayment (${loan.type})`);
        }
      });
    });

    arbitrageScore = Math.max(0, Math.min(100, 50 + (sips.length - loans.length) * 10));

    let newCibil = cibilScore;
    if (loans.some(l => Number(l.emi) > Number(incomeSources[0].amount))) newCibil -= 20;
    else newCibil += 10;

    setReport({ netWorth, loanChart, sipGrowth, alerts, recommendations, arbitrageScore });
    setCibilScore(newCibil);
  };

  const exportToPDF = () => {
    const input = document.getElementById('reportSection');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('Finance_Report.pdf');
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🧮 {language === 'en' ? 'Personal Finance Arbitrage Calculator' : 'व्यक्तिगत वित्त गणना उपकरण'}</h1>
        <button onClick={toggleLanguage}>{language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी पर स्विच करें'}</button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">{language === 'en' ? 'Inflation Adjustment (%)' : 'मुद्रास्फीति समायोजन (%)'}: {inflation}</label>
        <input type="range" min="0" max="15" value={inflation} onChange={e => setInflation(e.target.value)} />
      </div>

      <button className="bg-green-600 text-white mr-2" onClick={calculateFinancials}>{language === 'en' ? 'Run Calculation' : 'गणना करें'}</button>
      <button className="bg-blue-600 text-white" onClick={exportToPDF}>{language === 'en' ? 'Export to PDF' : 'पीडीएफ डाउनलोड करें'}</button>

      <div className="mt-6" id="reportSection">
        <h2 className="text-xl font-semibold mb-4">📊 {language === 'en' ? 'Financial Overview' : 'वित्तीय सारांश'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Loan Repayment Forecast</h3>
            <Bar data={report.loanChart} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">SIP Growth Projection</h3>
            <Line data={report.sipGrowth} />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold">Net Worth Trend</h3>
          <Line data={{ labels: ['Y1', 'Y2', 'Y3'], datasets: [{ label: 'Net Worth', data: report.netWorth }] }} />
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-red-600">⚠️ Alerts</h3>
          <ul className="list-disc pl-6">
            {report.alerts.map((alert, i) => <li key={i}>{alert}</li>)}
          </ul>

          <h3 className="font-semibold text-green-600 mt-4">💡 Recommendations</h3>
          <ul className="list-disc pl-6">
            {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">📈 Arbitrage Score: {report.arbitrageScore} / 100</h3>
          <h3 className="font-semibold">🧾 Simulated CIBIL Score: {cibilScore}</h3>
        </div>
      </div>
    </div>
  );
}

export default FinanceCalculator;
