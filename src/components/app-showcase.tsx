import Image from "next/image"

function AppShowcase() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative max-w-5xl mx-auto ">
        {/* Device frame */}
        <div className="relative rounded-3xl bg-[url('https://images.pexels.com/photos/20395301/pexels-photo-20395301.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center h-[50vh] md:h-[70vh] overflow-hidden dark:border-none border border-gray-200 shadow-2xl ">
          <div className="p-4 md:p-0 h-[50vh] md:h-[70vh] flex justify-center items-center">
            <Image
              src="/Desktopview.png"
              alt="Mealtracker Dashboard"
              width={650}
              height={550}
              className=" relative z-10  object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

          {/* Overlay content */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg inline-flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium dark:text-black">Mealtracker</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default AppShowcase
