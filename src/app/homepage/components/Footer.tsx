"use client"

export default function Footer() {

  return (
    <section className="">

      {/*  Hero image header  */}
      <div
        className="relative h-[60vh] flex flex-col justify-end px-8 sm:px-16 pb-14"
        style={{ backgroundImage: "url('/embermath_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] font-medium leading-tight">
            Its easier than you think to climb your mountain.
          </h1> 
        </div>
      </div>

    </section>
  )
}