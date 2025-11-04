import Image from "next/image"

function AppShowcase() {
  return (
    <section className="container mx-auto px-4">
      <div className="relative max-w-5xl mx-auto ">
        {/* Device frame */}
        {/* linear-gradient(120deg,#3B82F6_0%,#F3A82E_60%) */}
        <div className="relative rounded-3xl   bg-[url('/noicebg.png')] bg-cover bg-center bg-no-repeat h-[30vh] md:h-[70vh] overflow-hidden dark:border-none border border-gray-200 shadow-2xl ">
          <div className="flex justify-center items-center">
            <Image
              src="/Desktopview.png"
              alt="Mealtracker Dashboard"
              width={650}          // Base width
              height={550}         // Base height
              className="absolute bottom-0 mx-5 px-5 md:px-0 md:w-[800px]   object-cover"
            />

          </div>

        </div>
      </div>
    </section>
  )
}
export default AppShowcase
