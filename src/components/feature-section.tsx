import Image from "next/image";

export function FeatureSection() {
  // Array of random food and tracking related images
  const featureImages = [
    "https://images.unsplash.com/photo-1666251214795-a1296307d29c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1677921755291-c39158477b8e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1664392208900-cd5712daf2bb?q=80&w=3140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <section className="container mx-auto px-4 py-20" id="features">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Find meal patterns
          <br />
          in seconds.
        </h2>
        <p className="text-gray-600">
          Analyze your eating habits and optimize your meal expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureImages.map((image, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Feature ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
