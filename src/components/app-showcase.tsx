import Image from "next/image"

export function AppShowcase() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative max-w-5xl mx-auto ">
        {/* Device frame */}
        <div className="relative rounded-3xl bg-[url('https://images.pexels.com/photos/20395301/pexels-photo-20395301.jpeg')] bg-cover bg-center h-[50vh] md:h-[70vh] overflow-hidden border border-gray-200 shadow-2xl ">
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
              <span className="text-sm font-medium">Mealtracker</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Track your tiffin meals</h3>
            <p className="text-sm text-gray-600 mb-4">
              Easily log daily meals, manage vendors, and see exactly what you owe.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-amber-50 p-2 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-600">28</div>
                <div className="text-xs text-gray-500">Meals</div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">₹1,400</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-500">Vendors</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
