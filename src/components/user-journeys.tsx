"use client";

export function UserJourneys() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Explore entire meal
          <br />
          journeys with flows.
        </h2>
        <p className="text-gray-600">
          From ordering to delivery, track every step of your meal journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-medium mb-2">Meal Planning</h3>
          <p className="text-sm text-gray-600">
            Plan your meals in advance and save money.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-medium mb-2">Expense Tracking</h3>
          <p className="text-sm text-gray-600">
            Track your expenses and avoid overpaying.
          </p>
        </div>
      </div>
    </section>
  );
}
