import Image from "next/image";

export default function FeatureSection() {

  return (
    <section className="container mx-auto px-4 " id="features">
      <div className="max-w-3xl mx-auto text-center ">
        <h2 className="md:text-[2.2em] text-2xl md:font-semibold font-medium mb-4 ">
          Find Meal Patterns <br /> in seconds
        </h2>
        <p className="text-gray-600 text-sm tracking-tight">
          Analyze your eating habits and optimize your meal expenses.
        </p>
      </div>
      <div className="flex justify-center items-center max-w-full ">
        <div className="hidden md:block"  >
          <div className="flex justify-center items-center  " >
            <Image src={"/logoMTblack.png"} alt="art" width={50} height={50} className="object-cover border-2 rounded-full p-2" />
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex justify-center items-center">
            <Image src={"/grident.png"} alt="art" width={600} height={10} className="object-cover" />
          </div>
        </div>

        <Image
          src="/phonelayoutsize.png"
          alt="Feature 1"
          width={600}
          height={400}
          className=" md:w-[300px] "
        />
      </div>
    </section>
  );
}