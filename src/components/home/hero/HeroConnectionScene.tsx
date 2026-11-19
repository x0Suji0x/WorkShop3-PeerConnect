import campus from '../../../assets/hero-campus-v2.webp'
import students from '../../../assets/hero-students-sprite-v2.webp'

export function HeroConnectionScene() {
  return (
    <div className="hero-cinematic-scene" aria-hidden="true">
      <img className="hero-campus-plate" src={campus} alt="" fetchPriority="high" />
      <div className="hero-photo-light" />
      <div className="hero-transition-glow" />
      <div className="hero-cast">
        <div className="hero-person hero-student-right"><img src={students} className="hero-sprite-right" alt="" /></div>
        <div className="hero-person hero-student-left"><img src={students} className="hero-sprite-left" alt="" /></div>
        <div className="hero-person hero-student-center"><img src={students} className="hero-sprite-center" alt="" fetchPriority="high" /></div>
      </div>
    </div>
  )
}
