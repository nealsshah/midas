import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import path from 'path';
import { writeFile } from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use OpenAI to extract text from PDF
    const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    const fileUpload = await openai.files.create({
      file: buffer,
      purpose: 'assistants',
    });

    // Process the text with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Convert financial PDF data into a specific JSON format."
        },
        {
          role: "user",
          content: `Convert this financial data into the following JSON structure:
            {
              "overview": {
                "totalBalance": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } },
                "monthlySpending": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } },
                "savingsGoal": { "value": number, "change": { "value": number, "percentage": number, "isPositive": boolean } }
              },
              "expenseCategories": [{ "name": string, "value": number }],
              "monthlySpendingHistory": [{ "month": string, "spending": number }],
              "recentTransactions": [{ "name": string, "category": string, "amount": number, "date": string, "type": string }]
            }`
        }
      ]
    });

    const financialData = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to finances.json
    const financeFilePath = path.join(process.cwd(), 'src', 'finances.json');
    await writeFile(financeFilePath, JSON.stringify(financialData, null, 2));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process financial data' },
      { status: 500 }
    );
  }
} 