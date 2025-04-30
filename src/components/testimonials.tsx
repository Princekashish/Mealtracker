import Image from "next/image";

export function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Student",
      content:
        "Mealtracker has saved me so much money on my daily tiffin expenses. I used to overpay by at least ₹500 every month!",
      avatar: "https://avatar.iran.liara.run/public",
    },
    {
      name: "Priya Patel",
      role: "Working Professional",
      content:
        "I manage multiple tiffin services for my family. Mealtracker makes it easy to keep track of everything in one place.",
      avatar: "https://avatar.iran.liara.run/public/boy",
    },
    {
      name: "Amit Kumar",
      role: "Hostel Student",
      content:
        "Our entire hostel uses Mealtracker to manage our mess expenses. It's been a game-changer for us.",
      avatar: "https://avatar.iran.liara.run/public/15",
    },
    {
      name: "Neha Gupta",
      role: "Homemaker",
      content:
        "I track meals for my entire family. Mealtracker helps me budget better and ensure we're not being overcharged.",
      avatar: "https://avatar.iran.liara.run/public/girl",
    },
  
  ];

  return (
    <section className="container mx-auto px-4 py-20" id="testimonials">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">What our users are saying</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-gray-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <Image
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
