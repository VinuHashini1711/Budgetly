import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AIInsights.css';

export default function AIInsights() {
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    transactions: 0,
    budgets: 0,
    goals: 0
  });
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [transactionsRes, budgetsRes, goalsRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/budgets'),
        axios.get('/api/goals')
      ]);

      const transactions = transactionsRes.data;
      const budgets = budgetsRes.data;
      const goals = goalsRes.data;

      console.log('Transactions:', transactions); // Debug log
      
      const income = transactions
        .filter(t => t.type?.toLowerCase() === 'income')
        .reduce((sum, t) => {
          console.log('Income transaction:', t.amount, typeof t.amount);
          return sum + (parseFloat(t.amount) || 0);
        }, 0);
      
      const expenses = transactions
        .filter(t => t.type?.toLowerCase() === 'expense')
        .reduce((sum, t) => {
          console.log('Expense transaction:', t.amount, typeof t.amount);
          return sum + (parseFloat(t.amount) || 0);
        }, 0);
      
      console.log('Calculated income:', income, 'expenses:', expenses);

      setStats({
        income: Math.round(income),
        expenses: Math.round(expenses),
        transactions: transactions.length,
        budgets: budgets.length,
        goals: goals.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="ai-insights-container">
      <div className="ai-insights-header">
        <div>
          <h1>AI Financial Insights</h1>
          <div style={{ color: '#94a3b8', marginTop: '8px' }}>Get personalized recommendations powered by AI</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="insight-card" style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>💰</div>
          <div style={{ color: '#10b981', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Total Income</div>
          <div style={{ color: '#10b981', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>₹{stats.income.toLocaleString()}</div>
          <div style={{ color: '#6ee7b7', fontSize: '11px' }}>This month</div>
        </div>
        
        <div className="insight-card" style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>💸</div>
          <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Total Expenses</div>
          <div style={{ color: '#ef4444', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>₹{stats.expenses.toLocaleString()}</div>
          <div style={{ color: '#fca5a5', fontSize: '11px' }}>This month</div>
        </div>
        
        <div className="insight-card" style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>📊</div>
          <div style={{ color: '#6366f1', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Transactions</div>
          <div style={{ color: '#6366f1', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{stats.transactions}</div>
          <div style={{ color: '#a5b4fc', fontSize: '11px' }}>Total count</div>
        </div>
        
        <div className="insight-card" style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>🎯</div>
          <div style={{ color: '#8b5cf6', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Active Budgets</div>
          <div style={{ color: '#8b5cf6', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{stats.budgets}</div>
          <div style={{ color: '#c4b5fd', fontSize: '11px' }}>Budget plans</div>
        </div>
        
        <div className="insight-card" style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', opacity: 0.3 }}>🏆</div>
          <div style={{ color: '#ec4899', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Financial Goals</div>
          <div style={{ color: '#ec4899', fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{stats.goals}</div>
          <div style={{ color: '#f9a8d4', fontSize: '11px' }}>Active goals</div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="insight-card" style={{ textAlign: 'center', padding: '30px 24px', maxWidth: 600, margin: '0 auto', width: '100%', background: 'rgba(255, 255, 255, 0.05)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#000000' }}>Generate AI-Powered Insights</h2>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={generateSpendingAnalysis}
            disabled={loading}
            style={{ 
              padding: '12px 20px', 
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '600', 
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 {loading ? 'Analyzing...' : 'Spending Analysis'}
          </button>
          <button 
            className="btn" 
            onClick={generateBudgetRecommendations}
            disabled={loading}
            style={{ 
              padding: '12px 20px', 
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '600', 
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💡 {loading ? 'Analyzing...' : 'Budget Tips'}
          </button>
        </div>
      </div>

      {/* AI Chatbot Section */}
      <div className="insight-card" style={{ 
        padding: '0', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        height: '500px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>🤖</div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>AI Financial Assistant</h3>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>Ask me anything about your finances!</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {chatMessages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              padding: '40px 20px',
              fontSize: '14px'
            }}>
              👋 Hi! I'm your AI financial assistant. Ask me questions like:
              <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.8 }}>
                • "How can I reduce my expenses?"
                • "What's my spending pattern?"
                • "Give me budget recommendations"
              </div>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : '#f3f4f6',
                  color: msg.type === 'user' ? 'white' : '#1f2937',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                background: '#f3f4f6',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                🤔 Thinking...
              </div>
            </div>
          )}
        </div>
        
        <div style={{ 
          padding: '20px', 
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              placeholder="Ask me about your finances..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#1f2937',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleChatMessage}
              disabled={loading || !chatInput.trim()}
              style={{
                padding: '12px 20px',
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? '⏳' : '🚀'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Display */}
      {insights && (
        <div className="insight-card" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '20px 24px', 
            color: 'white' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px' 
              }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>AI Financial Analysis</h3>
                <span style={{ 
                  fontSize: '12px', 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  textTransform: 'uppercase', 
                  fontWeight: '500' 
                }}>
                  {insights.category}
                </span>
              </div>
            </div>
          </div>

          {/* Main Insight */}
          <div style={{ padding: '24px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)', 
              border: '2px solid rgba(99, 102, 241, 0.2)', 
              borderRadius: '16px', 
              padding: '24px', 
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                borderRadius: '50%',
                opacity: 0.5
              }}></div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '16px' 
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>📊</div>
                <h4 style={{ 
                  color: '#1f2937', 
                  margin: 0, 
                  fontSize: '20px', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Financial Analysis
                </h4>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  color: '#1f2937', 
                  lineHeight: '1.8', 
                  fontSize: '16px',
                  fontWeight: '500',
                  whiteSpace: 'pre-line'
                }}>
                  {formatInsightText(insights.insight)}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {insights.recommendation && (
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)', 
                border: '2px solid rgba(16, 185, 129, 0.25)', 
                borderRadius: '16px', 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '-15px',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  borderRadius: '50%',
                  opacity: 0.7
                }}></div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '20px' 
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}>💡</div>
                  <h4 style={{ 
                    color: '#1f2937', 
                    margin: 0, 
                    fontSize: '20px', 
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Action Plan
                  </h4>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gap: '16px' 
                }}>
                  {formatRecommendations(insights.recommendation).map((rec, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      padding: '18px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'default'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>{index + 1}</div>
                      <div style={{
                        flex: 1
                      }}>
                        <div style={{ 
                          color: '#1f2937', 
                          fontSize: '15px', 
                          lineHeight: '1.6',
                          fontWeight: '500'
                        }}>{rec}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );

  async function generateSpendingAnalysis() {
    setLoading(true);
    try {
      const response = await axios.get('/api/ai/spending-analysis');
      setInsights(response.data);
    } catch (error) {
      console.error('Error generating spending analysis:', error);
      setInsights({
        insight: 'Unable to generate spending analysis. Please ensure Ollama is running.',
        category: 'Error',
        recommendation: 'Check your Ollama installation and try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateBudgetRecommendations() {
    setLoading(true);
    try {
      const response = await axios.get('/api/ai/budget-recommendations');
      setInsights(response.data);
    } catch (error) {
      console.error('Error generating budget recommendations:', error);
      setInsights({
        insight: 'Unable to generate budget recommendations. Please ensure Ollama is running.',
        category: 'Error',
        recommendation: 'Check your Ollama installation and try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleChatMessage() {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/insights', {
        query: userMessage,
        context: ''
      });
      
      // Add AI response to chat
      const aiResponse = response.data.insight || response.data.message || 'I received your question but couldn\'t generate a proper response.';
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Sorry, I\'m having trouble connecting to the AI service. Please make sure Ollama is running and try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomQuery() {
    if (!customQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/insights', {
        query: customQuery,
        context: ''
      });
      setInsights(response.data);
      setCustomQuery('');
    } catch (error) {
      console.error('Error generating custom insight:', error);
      setInsights({
        insight: 'Unable to process your query. Please ensure Ollama is running.',
        category: 'Error',
        recommendation: 'Check your Ollama installation and try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  function formatInsightText(text) {
    if (!text) return '';
    
    // Clean up markdown formatting and make it readable
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove ** markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove * markdown
      .replace(/Category:\s*/gi, '')   // Remove "Category:" prefix
      .replace(/Financial Insight:?\s*/gi, '') // Remove "Financial Insight:" prefix
      .replace(/Actionable Recommendation:?\s*/gi, '') // Remove "Actionable Recommendation:" prefix
    
    // Split into sentences and format
    return cleanText
      .split('. ')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10)
      .map(sentence => sentence.endsWith('.') ? sentence : sentence + '.')
      .join('\n\n');
  }

  function formatRecommendations(text) {
    if (!text) return [];
    
    // Clean up markdown and extract recommendations
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove ** markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove * markdown
      .replace(/Actionable Recommendation:?\s*/gi, '') // Remove prefix
    
    // Split recommendations by numbers or bullet points
    const recommendations = cleanText
      .split(/\d+\.|\u2022|-|\n\n/)
      .map(rec => {
        // Clean each recommendation
        return rec
          .trim()
          .replace(/^\s*\d+\.\s*/, '') // Remove leading numbers
          .replace(/^\s*[-•]\s*/, '') // Remove bullets
          .trim()
      })
      .filter(rec => rec.length > 15)
      .slice(0, 5); // Limit to 5 recommendations
    
    return recommendations.length > 0 ? recommendations : [cleanText.trim()];
  }
}