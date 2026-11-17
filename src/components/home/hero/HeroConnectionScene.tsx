import { useSmoothScroll } from '../../../hooks/useSmoothScroll'

export function HeroConnectionScene() {
  const { scrollTo } = useSmoothScroll()

  return (
    <div className="relative w-full max-w-[620px] lg:max-w-[660px] mx-auto select-none">
      {/* Container holding the authentic illustrated student composition */}
      <div className="relative w-full aspect-[560/490] sm:aspect-[560/490] flex items-center justify-center">
        {/* Main Artwork Composite */}
        <img
          src="/images/hero-students-artwork.jpg"
          alt="PeerConnect Community — Three university students collaborating in a campus setting with creative doodles and marketplace cards"
          className="hero-student-artwork w-full h-full object-contain pointer-events-none select-none drop-shadow-xl"
        />

        {/* Interactive Hotspot 1: "Find Projects" Card (Top-Left) */}
        <button
          type="button"
          onClick={() => scrollTo('#projects')}
          aria-label="Find Projects - 1.2k+ opportunities"
          className="absolute top-[8%] left-[6%] w-[38%] h-[16%] rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 bg-transparent"
        />

        {/* Interactive Hotspot 2: "Discover Talent" Card (Top-Right) */}
        <button
          type="button"
          onClick={() => scrollTo('#talent')}
          aria-label="Discover Talent - 10k+ students"
          className="absolute top-[20%] right-[1%] w-[42%] h-[17%] rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 bg-transparent"
        />

        {/* Interactive Hotspot 3: "Collaborate" Card (Bottom-Right) */}
        <button
          type="button"
          onClick={() => scrollTo('#how-it-works')}
          aria-label="Collaborate - Turn ideas into reality"
          className="absolute bottom-[9%] right-[6%] w-[44%] h-[16%] rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#08C58A]/50 bg-transparent"
        />
      </div>
    </div>
  )
}
