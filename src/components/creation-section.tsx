import Image from "next/image";

export function CreationSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl   md:text-[2.2em] font-bold mb-4">From tracking to  <br className="md:hidden"/> <span className="text-amber-300 ">savings</span></h2>
        <p className="text-gray-600 text-sm tracking-tight">
          See how Mealtracker helps you save money on your daily meals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="https://plus.unsplash.com/premium_photo-1681487874673-976050b1dcab?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Track Daily Meals"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold tracking-tight mb-2">Track Daily Meals</h3>
          <p className="text-xs text-gray-600">
            Log your daily meals with just a tap.
          </p>
        </div>

        

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="https://plus.unsplash.com/premium_photo-1681487810054-4bced4f73e24?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Analyze Patterns"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold tracking-tight text-lg mb-2">Analyze Patterns</h3>
          <p className="text-xs text-gray-600">
            Identify patterns in your meal consumption.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Optimize Expenses"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold tracking-tight text-lg mb-2">Optimize Expenses</h3>
          <p className="text-xs  text-gray-600">
            Save money by optimizing your meal expenses.
          </p>
        </div>
      </div>
    </section>
  );
}
