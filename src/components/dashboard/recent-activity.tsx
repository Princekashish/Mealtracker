import { useStore } from "@/lib/store";
import { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { BadgeCheck, PlusCircle, Trash2, Users, Utensils, X } from "lucide-react";

export default function RecentActivity() {
  const recentActivity: Activity[] = useStore((state) => state.activities) || [];

  const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
    const iconMap: Record<Activity['type'], React.ElementType> = {
      meal_add: Utensils,
      meal_remove: X,
      vendor_add: PlusCircle,
      vendor_update: Users,
      vendor_delete: Trash2,
    };
    const Icon = iconMap[type] || BadgeCheck;

    const colorMap: Record<Activity['type'], string> = {
      meal_add: 'text-green-600 bg-green-100',
      meal_remove: 'text-red-600 bg-red-100',
      vendor_add: 'text-blue-600 bg-blue-100',
      vendor_update: 'text-yellow-600 bg-yellow-100',
      vendor_delete: 'text-destructive bg-destructive/10',
    };
    const colorClass = colorMap[type] || 'text-primary bg-primary/10';

    return (
      <div className={cn("rounded-full p-2 flex items-center justify-center", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
    );
  };

  return (
    <div className="p-5 border border-gray-200 rounded-3xl dark:bg-[#161616] dark:border-none">
      <div>
        <h1 className="md:text-2xl text-lg font-bold tracking-tight">Recent Activity</h1>
        <p className="text-xs tracking-tight text-[#8C97A9]">
          Your latest meal tracking activities.
        </p>
      </div>

      <div className="mt-5">
        <div className="space-y-4 overflow-hidden h-[315px] overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity,i) => (
              <div key={i} className="flex items-start">
                <ActivityIcon type={activity.type} />
                <div className="flex-grow ml-3">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No recent activity to show.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
