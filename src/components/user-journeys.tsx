export function UserJourneys() {
  return (
    <section className="container mx-auto px-4 py-16 ">
      <div className="flex flex-col text-center gap-2">
        <h2 className="text-2xl md:text-[2.2.em] font-medium  ">
          Explore entire meal journeys with flows.
        </h2>
        <p className="text-gray-600 text-sm">
          From ordering to delivery, track every step of your meal journey.
        </p>
      </div>
      <div className="relative p-4  bg-[url('/makeit.png')] bg-cover bg-center h-[30vh] opacity-40 overflow-hidden dark:border-none border border-gray-200 ">
        <div className="flex justify-between flex-col gap-5 ">
          <div>
            <h1>step 1 :</h1>
            <div>
              <h1>Meal Planning</h1>
              <p>Plan your meals in advance and save money.</p>
            </div>
          </div>
          <div>
            <h1>step 2 :</h1>
            <div>
              <h1>Expense Tracking</h1>
              <p>Track your expenses and avoid overpaying.</p>
            </div>
          </div>
        </div>

      </div>


    </section>
  );
}
