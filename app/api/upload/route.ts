// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { writeFile } from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "Convert financial data into a specific JSON format. You MUST return only a valid JSON with no markdown formatting or additional commentary. Just return the JSON"
          },
          {
            role: "user",
            content: `Convert this financial data into the following JSON structure. Use "n/a" for any fields that are not available:
      {
        "overview": {
          "totalBalance": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } },
          "monthlySpending": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } },
          "savingsGoal": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } }
        },
        "expenseCategories": [{ "name": string, "value": number }],
        "monthlySpendingHistory": [{ "month": string, "spending": number }],
        "recentTransactions": [{ "name": string, "category": string, "amount": number, "date": string, "type": string }],
        "monthlyExpenses": [{ "name": string, "value": number }]
      }
      
      Financial data: ${text}`
          }
        ]
      });
      

    const output = completion.choices[0].message.content?.trim() || '';
    const jsonData = JSON.parse(output);

    // Save to finances.json
    const financeFilePath = path.join(process.cwd(), 'finances.json');
    await writeFile(financeFilePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      data: jsonData
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process financial data', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
