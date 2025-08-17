import Image from "next/image";

export default function FeatureSection() {
  // Array of random food and tracking related images
  const featureImages = [
    "/featurs-mobile.png",
    "/features-women.png",
    "/features-al.png",
  ];

  return (
    <section className="container mx-auto px-4 py-20" id="features">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="md:text-[2.2em] text-3xl font-bold mb-4 ">
          Find <span className="text-amber-300">Meal Patterns</span>
          <br />
          in seconds
        </h2>
        <p className="text-gray-600 text-sm tracking-tight">
          Analyze your eating habits and optimize your meal expenses.
        </p>
      </div>
      <div>
        {/* Mobile: show only the first image */}
        <div className="block md:hidden">
          <div className="rounded-xl overflow-hidden border border-gray-100  shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={featureImages[1] || "/placeholder.svg"}
              alt="Feature 1"
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        </div>
        {/* Desktop: show all images in a grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {featureImages.map((image, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-gray-100 dark:border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Feature ${index + 1}`}
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}