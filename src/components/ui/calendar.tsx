"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {

    const customClassNames = {
        selected: `bg-amber-500 border-amber-500 text-white`,
        day_today: "bg-red-300 text-white",
        day: "relative h-9 w-9 p-0 font-normal " +
            "hover:bg-[#F4F4F5] aria-selected:bg-[#FE9900] rounded-xl aria-selected:text-white ",

        day_selected: " text-white aria-current:bg-gray-400 aria-current:text-white",

        today: " bg-[#F4F4F5] aria-selected:bg-[#FE9900] aria-selected:text-white",
        Chevron: 'text-white bg-black hover:bg-black bg-red-500'

    };

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            classNames={{
                ...customClassNames,
                ...classNames,
            }}

            {...props}
            navLayout="around"
        />
    );
}

Calendar.displayName = "Calendar";

export { Calendar };
