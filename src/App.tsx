import { useState } from 'react';

interface DebtInput {
    totalDebt: number;
    annualSalary: number;
    interestRate: number;
    repaymentTerm: number;
}

const DEBT_TIPS: string[] = [
    'A debt-to-income ratio under 1.0 is generally considered manageable',
    'Monthly payments below 10% of gross income are typically affordable',
    'Consider income-driven repayment plans if payments are high',
    'Employer student loan benefits may help reduce your burden'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

function App() {
    const [values, setValues] = useState<DebtInput>({ totalDebt: 45000, annualSalary: 55000, interestRate: 6.5, repaymentTerm: 10 });
    const handleChange = (field: keyof DebtInput, value: number) => setValues(prev => ({ ...prev, [field]: value }));

    // Calculate debt-to-income ratio
    const debtToIncomeRatio = values.annualSalary > 0 ? values.totalDebt / values.annualSalary : 0;

    // Calculate monthly payment using amortization formula
    const monthlyRate = values.interestRate / 100 / 12;
    const totalPayments = values.repaymentTerm * 12;
    let monthlyPayment = 0;
    if (monthlyRate > 0 && totalPayments > 0) {
        monthlyPayment = (values.totalDebt * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (totalPayments > 0) {
        monthlyPayment = values.totalDebt / totalPayments;
    }

    // Calculate payment as percentage of monthly gross income
    const monthlyGrossIncome = values.annualSalary / 12;
    const paymentToIncomeRatio = monthlyGrossIncome > 0 ? (monthlyPayment / monthlyGrossIncome) * 100 : 0;

    // Affordability indicator
    let affordabilityStatus = 'Comfortable';
    let affordabilityColor = '#16A34A';
    if (paymentToIncomeRatio > 20) {
        affordabilityStatus = 'Stretched';
        affordabilityColor = '#DC2626';
    } else if (paymentToIncomeRatio > 10) {
        affordabilityStatus = 'Moderate';
        affordabilityColor = '#D97706';
    }

    const breakdownData = [
        { label: 'Total Student Debt', value: fmt(values.totalDebt), isTotal: false },
        { label: 'Annual Salary', value: fmt(values.annualSalary), isTotal: false },
        { label: 'Payment % of Income', value: pct(paymentToIncomeRatio), isTotal: true }
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>College Debt vs Salary Calculator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Evaluate student loan burden relative to income</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="totalDebt">Total Student Loan Debt ($)</label>
                            <input id="totalDebt" type="number" min="1000" max="500000" step="1000" value={values.totalDebt || ''} onChange={(e) => handleChange('totalDebt', parseInt(e.target.value) || 0)} placeholder="45000" />
                        </div>
                        <div>
                            <label htmlFor="annualSalary">Annual Salary ($)</label>
                            <input id="annualSalary" type="number" min="10000" max="500000" step="1000" value={values.annualSalary || ''} onChange={(e) => handleChange('annualSalary', parseInt(e.target.value) || 0)} placeholder="55000" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="interestRate">Interest Rate (%)</label>
                            <input id="interestRate" type="number" min="0" max="15" step="0.1" value={values.interestRate || ''} onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)} placeholder="6.5" />
                        </div>
                        <div>
                            <label htmlFor="repaymentTerm">Repayment Term (Years)</label>
                            <input id="repaymentTerm" type="number" min="1" max="30" step="1" value={values.repaymentTerm || ''} onChange={(e) => handleChange('repaymentTerm', parseInt(e.target.value) || 0)} placeholder="10" />
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Calculate Ratio</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Debt-to-Income Ratio</h2>
                    <div className="result-hero">{debtToIncomeRatio.toFixed(2)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>debt relative to annual salary</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Monthly Payment</div>
                        <div className="result-value">{fmt(Math.round(monthlyPayment))}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Affordability</div>
                        <div className="result-value" style={{ color: affordabilityColor }}>{affordabilityStatus}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Key Considerations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {DEBT_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Debt Analysis</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of student loan burden relative to income using simplified assumptions. Affordability indicators are general guidelines and individual circumstances vary. The figures shown are estimates only and do not constitute financial advice. Actual loan terms, rates, and repayment options depend on your lender and loan type. Consult a financial advisor for personalized guidance.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Simplified assumptions</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 College Debt Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
