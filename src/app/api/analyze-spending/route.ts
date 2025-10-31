import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpending, AnalyzeSpendingInput } from '@/ai/flows/spending-analysis';

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeSpendingInput = await request.json();
    
    // Validate input
    if (!body.mealData || !body.currentMonth || !body.previousMonths) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call AI analysis
    const result = await analyzeSpending(body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Spending analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze spending' },
      { status: 500 }
    );
  }
}

