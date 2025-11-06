"use client";

import { AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { format, isSameMonth, parseISO, addMonths, subMonths } from 'date-fns';
import { useStore } from "@/lib/store";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { Button } from "../ui/Button";


const COLORS = ['#10B981', '#F97316', '#3B82F6', '#6366f1', '#ec4899', '#f59e0b', '#F4F4F5'];


const NavigationControls = ({
  onMonthChange
}: {
  onMonthChange: (direction: 'prev' | 'next') => void;
}) => (
  <div className="flex justify-center items-center gap-3">
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => onMonthChange('prev')}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => onMonthChange('next')}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export default function ExpenseBreakdown() {


  const mealLogs = useStore((state) => state.mealLogs)
  const currentMonth = useStore((state) => state.currentMonth)
  const vendors = useStore((state) => state.vendors)
  const setCurrentMonth = useStore((state) => state.setCurrentMonth);


  const formattedMonth = format(new Date(), 'MMMM yyyy')

  const expenseBreakdownByVendor = useMemo(() => {
    if (!mealLogs || !vendors) {
      return [];
    }
    const breakdown: { [key: string]: number } = {};
    const logsThisMonth = mealLogs.filter(log => isSameMonth(parseISO(log.date), new Date()));
    logsThisMonth.forEach(log => {
      const vendorName = vendors.find(v => v.id === log.vendorId)?.name || 'Unknown Vendor';
      if (!breakdown[vendorName]) {
        breakdown[vendorName] = 0;
      }
      breakdown[vendorName] += log.price * log.quantity;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
  }, [mealLogs, vendors, currentMonth]);

  // Calculate total monthly expense and average per meal
  const monthlyStats = useMemo(() => {
    if (!mealLogs) {
      return {
        totalCost: 0,
        totalMeals: 0,
        averagePerMeal: 0
      };
    }
    const logsThisMonth = mealLogs.filter(log => isSameMonth(parseISO(log.date), new Date()));
    const totalCost = logsThisMonth.reduce((acc, log) => acc + (Number(log.price || 0) * log.quantity), 0);
    const totalMeals = logsThisMonth.reduce((acc, log) => acc + log.quantity, 0);
    const averagePerMeal = totalMeals > 0 ? totalCost / totalMeals : 0;

    return {
      totalCost,
      totalMeals,
      averagePerMeal
    };
  }, [mealLogs, currentMonth]);
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev'
      ? subMonths(currentMonth, 1)
      : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };
  return (
    <div className="col-span-3 p-5 md:border md:border-gray-200 bg-[#F5F5F5] rounded-3xl h-full  dark:border-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="lg:text-2xl text-lg font-bold tracking-tight ">
            Expense Breakdown
          </h1>
          <p className="md:text-sm text-xs tracking-tight text-[#8C97A9] ">
            Total spending for {formattedMonth}
          </p>
        </div>
        <div className="bg-white/10 px-3 py-2 rounded-full ">
          <NavigationControls onMonthChange={handleMonthChange} />
        </div>

      </div>
      <div>
        <div className="grid lg:h-[200px] grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 sm:gap-8 mt-3">
          {expenseBreakdownByVendor.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={expenseBreakdownByVendor} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={70} fill="#8884d8" paddingAngle={0} startAngle={90} endAngle={450}>
                  {expenseBreakdownByVendor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    <div key="tooltip" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#000000',
                      border: '1px solid #333333',
                      borderRadius: '20px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 16px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: COLORS[expenseBreakdownByVendor.findIndex(item => item.name === name) % COLORS.length],
                        borderRadius: '2px'
                      }} />
                      <span>{name}</span>
                      <span >₹{(value as number).toFixed(2)}</span>
                    </div>
                  ]}
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <AreaChart className="h-12 w-12" />
              <p>No expenses this month</p>
            </div>
          )}
          <div className="space-y-2 text-center">
            <p className="md:text-sm text-xs  text-muted-foreground">Total Monthly Expense</p>

            <p className="lg:text-3xl text-lg font-bold">₹{monthlyStats.totalCost.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Average Per Meal: ₹{monthlyStats.averagePerMeal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 lg:mt-0 flex justify-center items-center rounded-full py-3 md:bg-black md:hover:bg-black/80 cursor-pointer  gap-3 bg-white/10 text-[#efefef] ] font-medium  shadow duration-300 hover:text-white">
        <button>
          Downlode file
        </button>
        <FileDown />
      </div>
    </div>
  );
}
