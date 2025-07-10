import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { CSVData, DataColumn } from '../types';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

interface CSVChatProps {
  csvData: CSVData;
  columns: DataColumn[];
}

const CSVChat: React.FC<CSVChatProps> = ({ csvData, columns }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simple welcome message without complex formatting
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Hello! I'm your AI Data Analyst

I'm ready to help you explore your CSV data with ${csvData.rows.length} rows and ${csvData.headers.length} columns.

Your Data Columns:
${csvData.headers.slice(0, 8).join(', ')}${csvData.headers.length > 8 ? ` and ${csvData.headers.length - 8} more...` : ''}

What I can help you with:
- Statistical analysis and summaries
- Data patterns and trends  
- Correlations and relationships
- Specific insights about any column
- Data quality assessment
- Custom analysis requests

Try asking me:
• "What are the key insights from this data?"
• "Show me statistics for [column name]"
• "What patterns do you see?"
• "How does [column A] relate to [column B]?"

What would you like to explore first?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [csvData]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simple response without external API calls
      const response = generateSimpleResponse(currentQuestion, csvData, columns);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `I encountered an issue while analyzing your data. Please try asking your question differently.

Example questions that work well:
• "What's the average value in [column name]?"
• "Show me the distribution of [column name]"
• "What are the top 5 values in [column name]?"

I'm still here to help! Please try asking your question differently.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key insights from this data?",
    "Show me statistical summary of numeric columns",
    "What patterns and trends do you see?",
    "Are there any data quality issues?",
    "What correlations exist between columns?",
    `Analyze the distribution of ${columns.find(col => col.type === 'string')?.name || 'categorical data'}`,
    `What's the average ${columns.find(col => col.type === 'number')?.name || 'numeric value'}?`,
    "What are the most interesting findings?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome-reset',
      type: 'assistant',
      content: `Chat Reset

I'm ready to help you analyze your data again! 

Your Dataset: ${csvData.rows.length} rows, ${csvData.headers.length} columns

What would you like to explore?`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[700px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-purple-600 mr-2" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Chat with Your Data</h2>
            <p className="text-sm text-gray-600">{csvData.rows.length} rows • {csvData.headers.length} columns</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-600">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Powered
          </div>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {message.type === 'assistant' && (
                  <Bot className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                )}
                {message.type === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' 
                      ? 'text-blue-100' 
                      : message.type === 'error'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <User className="h-5 w-5 text-blue-100 mt-1 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-lg p-4 max-w-[85%] border border-gray-200">
              <div className="flex items-center space-x-3">
                <Bot className="h-5 w-5 text-purple-600" />
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Analyzing your data...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-3 font-medium">Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.slice(0, 6).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your data... (e.g., 'What's the average sales by region?')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tip: Be specific about which columns or metrics you want to analyze for better results
        </p>
      </div>
    </div>
  );
};

// Simple response generator without external API calls
const generateSimpleResponse = (question: string, csvData: CSVData, columns: DataColumn[]): string => {
  const questionLower = question.toLowerCase();
  
  // Basic data overview
  if (questionLower.includes('overview') || questionLower.includes('summary') || questionLower.includes('describe')) {
    const numericCols = columns.filter(col => col.type === 'number');
    const categoricalCols = columns.filter(col => col.type === 'string');
    
    return `Data Overview:

Dataset: ${csvData.rows.length} rows, ${csvData.headers.length} columns

Column Types:
- Numeric columns: ${numericCols.length} (${numericCols.map(col => col.name).join(', ')})
- Categorical columns: ${categoricalCols.length} (${categoricalCols.map(col => col.name).join(', ')})

Data Quality:
- Complete columns: ${columns.filter(col => col.nullCount === 0).length}/${columns.length}
- Columns with missing data: ${columns.filter(col => col.nullCount > 0).length}

Most diverse column: ${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).name} (${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).uniqueCount} unique values)

What specific aspect would you like me to analyze further?`;
  }
  
  // Statistics
  if (questionLower.includes('statistic') || questionLower.includes('average') || questionLower.includes('mean')) {
    const numericColumns = columns.filter(col => col.type === 'number');
    
    if (numericColumns.length === 0) {
      return `No numeric columns found for statistical analysis.

Available columns: ${columns.map(col => `${col.name} (${col.type})`).join(', ')}

Try asking about categorical distributions instead.`;
    }
    
    let response = `Statistical Summary:\n\n`;
    
    numericColumns.slice(0, 3).forEach(col => {
      const values = col.values.filter(v => v !== null && v !== '' && !isNaN(parseFloat(v))).map(v => parseFloat(v));
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        response += `${col.name}:
- Average: ${avg.toFixed(2)}
- Range: ${min} to ${max}
- Valid records: ${values.length}/${csvData.rows.length}

`;
      }
    });
    
    return response;
  }
  
  // Default response
  return `I understand you're asking about: "${question}"

Here's what I can help you with:

1. Data Overview: Ask "What's the overview of this data?"
2. Statistics: Ask "Show me statistics" for numeric analysis
3. Column Analysis: Ask about specific columns by name
4. Data Quality: Ask "Are there any data quality issues?"

Your dataset has ${csvData.rows.length} rows and ${csvData.headers.length} columns.
Available columns: ${csvData.headers.join(', ')}

Please ask a more specific question and I'll provide detailed analysis!`;
};

export default CSVChat;