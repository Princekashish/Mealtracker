"use server";
/**
 * @fileOverview An AI agent that analyzes meal tracking data and alerts users of unexpectedly high expenses relative to prior months.
 *
 * - analyzeSpending - A function that handles the spending analysis process.
 * - AnalyzeSpendingInput - The input type for the analyzeSpending function.
 * - AnalyzeSpendingOutput - The return type for the analyzeSpending function.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";

/** Input schema for the main analyzeSpending function */
const AnalyzeSpendingInputSchema = z.object({
  mealData: z
    .array(
      z.object({
        date: z.string().describe("The date of the meal (YYYY-MM-DD)."),
        vendor: z.string().describe("The name of the vendor."),
        breakfastPrice: z
          .number()
          .optional()
          .describe("The price of breakfast on this date, if any."),
        lunchPrice: z
          .number()
          .optional()
          .describe("The price of lunch on this date, if any."),
        dinnerPrice: z
          .number()
          .optional()
          .describe("The price of dinner on this date, if any."),
      })
    )
    .describe(
      "Array of meal objects containing date, vendor, and meal prices."
    ),
  currentMonth: z.string().describe("The current month (YYYY-MM)."),
  previousMonths: z
    .array(z.string())
    .describe("Array of previous months (YYYY-MM) to compare against."),
  spendingThreshold: z
    .number()
    .default(1.5)
    .describe(
      "The threshold (as a multiplier) above which spending is considered suspicious compared to previous months."
    ),
});
export type AnalyzeSpendingInput = z.infer<typeof AnalyzeSpendingInputSchema>;

/** Output schema for the analyzeSpending function */
const AnalyzeSpendingOutputSchema = z.object({
  isSuspicious: z
    .boolean()
    .describe("Whether the spending is considered suspicious."),
  explanation: z
    .string()
    .describe(
      "A concise, one-sentence explanation of why the spending is suspicious or not."
    ),
  currentMonthTotal: z
    .number()
    .describe("The total spending for the current month"),
  averagePreviousMonthTotal: z
    .number()
    .describe("The average spending for the previous months"),
});
export type AnalyzeSpendingOutput = z.infer<typeof AnalyzeSpendingOutputSchema>;

/** Extended input schema for the AI prompt including computed fields */
const AnalyzeSpendingPromptInputSchema = AnalyzeSpendingInputSchema.extend({
  currentMonthTotal: z.number(),
  averagePreviousMonthTotal: z.number(),
  isSuspicious: z.boolean(),
});

/** Main function that wraps the flow */
export async function analyzeSpending(
  input: AnalyzeSpendingInput
): Promise<AnalyzeSpendingOutput> {
  return analyzeSpendingFlow(input);
}

const analyzeSpendingPrompt = ai.definePrompt(
  {
    name: "analyzeSpendingPrompt",
    input: { schema: AnalyzeSpendingPromptInputSchema },
    output: { schema: AnalyzeSpendingOutputSchema },
  },
  `You are a personal finance advisor specializing in meal spending analysis. Your goal is to determine if the user's spending in the current month is unexpectedly high compared to previous months and provide a brief, one-sentence summary.

Here's the meal data you need to analyze:

- Current Month's Total Spending: {{currentMonthTotal}}
- Average Spending of Previous Months: {{averagePreviousMonthTotal}}
- Spending Threshold Multiplier: {{spendingThreshold}}

Based on this data, determine if the current month's spending is greater than the average of previous months multiplied by the spendingThreshold.

- If it IS higher, set isSuspicious to true. Your one-sentence explanation should state that spending is higher than average.
- If it IS NOT higher, set isSuspicious to false. Your one-sentence explanation should state that spending is normal or within the expected range.

Keep your explanation to a single, clear sentence.`
);

/** Define the analysis flow */
const analyzeSpendingFlow = ai.defineFlow(
  {
    name: "analyzeSpendingFlow",
    inputSchema: AnalyzeSpendingInputSchema,
    outputSchema: AnalyzeSpendingOutputSchema,
  },
  async (input: AnalyzeSpendingInput) => {
    // Handle case with no meal data
    if (input.mealData.length === 0) {
      return {
        isSuspicious: false,
        explanation: "Not enough data to perform analysis.",
        currentMonthTotal: 0,
        averagePreviousMonthTotal: 0,
      };
    }

    // Calculate current month total
    const currentMonthTotal = input.mealData
      .filter((meal) => meal.date.startsWith(input.currentMonth))
      .reduce(
        (total: number, meal) =>
          total +
          (meal.breakfastPrice || 0) +
          (meal.lunchPrice || 0) +
          (meal.dinnerPrice || 0),
        0
      );

    // Calculate totals for previous months
    const previousMonthsTotals = input.previousMonths.map((month: string) => {
      return input.mealData
        .filter((meal) => meal.date.startsWith(month))
        .reduce(
          (total: number, meal) =>
            total +
            (meal.breakfastPrice || 0) +
            (meal.lunchPrice || 0) +
            (meal.dinnerPrice || 0),
          0
        );
    });

    const validPreviousMonthsTotals = previousMonthsTotals.filter(
      (total: number) => total > 0
    );

    const averagePreviousMonthTotal =
      validPreviousMonthsTotals.length > 0
        ? validPreviousMonthsTotals.reduce(
            (sum: number, total: number) => sum + total,
            0
          ) / validPreviousMonthsTotals.length
        : 0;

    if (averagePreviousMonthTotal === 0) {
      return {
        isSuspicious: false,
        explanation:
          "No spending data available for previous months to compare.",
        currentMonthTotal,
        averagePreviousMonthTotal: 0,
      };
    }

    // Determine if spending is suspicious
    const isSuspicious =
      currentMonthTotal > averagePreviousMonthTotal * input.spendingThreshold;

    // Call AI prompt with all necessary data
    const { output } = await analyzeSpendingPrompt({
      ...input,
      currentMonthTotal,
      averagePreviousMonthTotal,
      isSuspicious,
    });

    return {
      ...output!,
      currentMonthTotal,
      averagePreviousMonthTotal,
    };
  }
);
