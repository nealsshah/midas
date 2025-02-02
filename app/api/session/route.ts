// pages/api/session.js
import { NextResponse } from 'next/server';
import financialData from '@/finances.json';

export async function GET() {
  try {
    // Verify financial data is loaded correctly
    if (!financialData || !financialData.overview) {
      throw new Error('Financial data not properly loaded');
    }

    // Format financial data for instructions
    const financialContext = `
      Current Financial Overview:
      - Total Balance: $${financialData.overview.totalBalance.value.toFixed(2)}
      - Monthly Spending: $${financialData.overview.monthlySpending.value.toFixed(2)}
      - Savings Goal: $${financialData.overview.savingsGoal.value.toFixed(2)}

      Monthly Expenses:
      ${financialData.expenseCategories.map(cat => 
        `- ${cat.name}: $${cat.value.toFixed(2)}`
      ).join('\n')}

      Recent Activity:
      ${financialData.recentTransactions.map(tx => 
        `- ${tx.name}: $${tx.amount.toFixed(2)} (${tx.type})`
      ).join('\n')}
    `;

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "ash",
        modalities: ["audio", "text"],
        instructions: `You are an AI financial advisor with access to the following financial information:
          ${financialContext}

          Start conversation with the user by saying 'Hello! I'm your AI financial advisor. How can I help you manage your finances today?'
          
          Use this financial information to provide personalized advice and insights.
          When discussing finances, always reference specific numbers from the user's data.
          If asked about spending patterns, analyze the expense categories and recent transactions.
          Provide specific, actionable advice based on the user's current financial situation.`,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      client_secret: {
        value: data.token || data.client_secret?.value || data.sessionId || ''
      },
      ...data
    });

  } catch (error) {
    console.error("Error in session route:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : 'Unknown error',
        client_secret: { value: '' }
      },
      { status: 500 }
    );
  }
}
  