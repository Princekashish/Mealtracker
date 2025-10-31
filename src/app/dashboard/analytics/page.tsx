"use client"

import { useEffect, useState } from 'react';
import { AlertTriangle, BadgeCheck, Bot, TrendingUp, TrendingDown, Loader2,} from 'lucide-react';
import { subMonths, format } from 'date-fns';
import { useStore } from '@/lib/store';

interface AnalyzeSpendingOutput {
    isSuspicious: boolean;
    explanation: string;
    currentMonthTotal: number;
    averagePreviousMonthTotal: number;
}


type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

export default function Analytics() {
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [result, setResult] = useState<AnalyzeSpendingOutput | null>(null);
    const { mealLogs } = useStore()

    const handleAnalyze = async () => {
        setAnalysisState('loading');
        setResult(null);

        try {
            const today = new Date();
            const currentMonthStr = format(today, 'yyyy-MM');

            const previousMonths = Array.from({ length: 3 }).map((_, i) =>
                format(subMonths(today, i + 1), 'yyyy-MM')
            );

            const mealDataForAI = mealLogs.map(log => {
                const price = Number(log.price) * log.quantity;
                return {
                    date: log.date,
                    vendor: log.vendorId,
                    [`${log.mealType}Price`]: price,
                } as {
                    date: string;
                    vendor: string;
                    breakfastPrice?: number;
                    lunchPrice?: number;
                    dinnerPrice?: number;
                };
            });

            const input = {
                mealData: mealDataForAI,
                currentMonth: currentMonthStr,
                previousMonths: previousMonths,
                spendingThreshold: 1.5,
            };

            // Call API route instead of direct import
            const response = await fetch('/api/analyze-spending', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze spending');
            }

            const analysisResult: AnalyzeSpendingOutput = await response.json();
            setResult(analysisResult);
            setAnalysisState('success');
        } catch (error) {
            console.error("Spending analysis failed:", error);
            setAnalysisState('error');
        }
    };

    useEffect(() => {
        handleAnalyze()
    }, [])



    return (
        // <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-3">

        // </div>
        <div className='flex justify-center items-center h-[80vh]'>
            <div className="relative grid w-full max-w-lg gap-4  bg-background p-6 shadow-lg sm:rounded-lg rounded-xl">
                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Bot className="h-6 w-6" /> Spending Analysis
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Analyzing your spending patterns for this month compared to previous months.
                    </p>
                </div>

                {/* Content */}
                <div className="py-4 min-h-[200px] flex items-center justify-center">
                    {analysisState === 'loading' && (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    )}

                    {analysisState === 'error' && (
                        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-destructive">Analysis Error</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Something went wrong. Please close this window and try again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {analysisState === 'success' && result && (
                        <div className={`rounded-lg border p-4 w-full ${result.isSuspicious
                            ? 'border-destructive bg-destructive/10'
                            : 'border-green-200 bg-green-50 dark:bg-green-950/20'
                            }`}>
                            <div className="flex items-start gap-3">
                                {result.isSuspicious ? (
                                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                ) : (
                                    <BadgeCheck className="h-5 w-5 text-green-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className={`font-medium ${result.isSuspicious ? 'text-destructive' : 'text-green-700 dark:text-green-500'
                                            }`}>
                                            {result.isSuspicious ? 'High Spending Detected' : 'Spending Looks Normal'}
                                        </h3>
                                        {result.isSuspicious ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {result.explanation}
                                    </p>
                                    <div className="flex justify-around text-center gap-4 pt-3 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Current Month</p>
                                            <p className="text-lg font-bold">₹{result.currentMonthTotal.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Previous Avg.</p>
                                            <p className="text-lg font-bold">₹{result.averagePreviousMonthTotal.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
