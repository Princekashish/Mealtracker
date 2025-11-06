import Image from "next/image";
import { TbMoneybag } from "react-icons/tb";


export default function CreationSection() {
  return (
    <section className="container mx-auto px-4 py-16 ">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-2xl   md:text-[2.2em] font-medium mb-4 text-center">From tracking to <br /> savings</h1>
        <p className="text-gray-600 text-sm tracking-tight">See how Mealtracker helps you save money on your daily meals.</p>
      </div>
      <div className="flex flex-col justify-start items-start gap-5 md:flex-row md:justify-center md:gap-10 ">
        <div className="flex justify-center items-center gap-2">
          <div className="border rounded-full p-3">
            <TbMoneybag size={30} />
          </div>
          <div className=" ">
            <h1 className="font-medium">Optimize Expenses</h1>
            <p className="text-xs">Save money by optimizing your meal expenses.</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="border rounded-full p-3">
            <Image src={"./note-svgrepo-com.svg"} alt="note" width={30} height={30} />
          </div>
          <div className=" ">
            <h1 className="font-medium">Track Daily Meals</h1>
            <p className="text-xs">Log your daily meals with just a tap.</p>
          </div>
        </div>
        <div className="flex justify-center items- gap-2">
          <div className="border rounded-full p-3">
            <Image src={"./business-growth-management-svgrepo-com.svg"} alt="note" width={30} height={30} />
          </div>
          <div className=" ">
            <h1 className="font-medium">Analyze Patterns</h1>
            <p className="text-xs">Identify patterns in your meal consumption.</p>
          </div>
        </div>
      </div>

    </section>
  );
}
