import { useState } from 'react'
import {
  CheckCircle2,
  CreditCard,
  Eye,
  Landmark,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageHeading } from '../../components/common/PageHeading'
import { studentPlusAnalyticsPreview, studentPlusPlan } from '../../data/studentPlusMockData'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import type { DemoPaymentMethod } from '../../types'

const paymentMethods = [
  { id: 'upi' as const, label: 'UPI', detail: 'Use a virtual UPI handle for this demo.', icon: Landmark },
  { id: 'card' as const, label: 'Card', detail: 'Uses a non-chargeable demo card.', icon: CreditCard },
]

export function StudentPlusPage() {
  const { student, updateStudent } = useStudentProfile()
  const [paymentMethod, setPaymentMethod] = useState<DemoPaymentMethod>('upi')
  const [isActivating, setIsActivating] = useState(false)
  const [activationComplete, setActivationComplete] = useState(false)

  const activateDemo = async () => {
    setIsActivating(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      await updateStudent({ isPlusMember: true })
      setActivationComplete(true)
    } finally {
      setIsActivating(false)
    }
  }

  const resetDemo = async () => {
    await updateStudent({ isPlusMember: false })
    setActivationComplete(false)
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="peer-ambient-glow peer-glow-gold -left-28 -top-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-32 right-0 h-[28rem] w-[28rem]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageHeading
          eyebrow="Student Plus · demo"
          title={student.isPlusMember ? 'Your Student Plus demo is active.' : 'Be easier to discover.'}
          description={student.isPlusMember
            ? 'Explore the visibility and analytics preview included with Student Plus.'
            : 'Try the proposed Student Plus experience. This is a frontend demo: no real payment, account, or renewal is created.'}
          actions={
            <Link to={routes.dashboard}>
              <Button variant="secondary" size="sm">Back to dashboard</Button>
            </Link>
          }
        />

        {student.isPlusMember ? (
          <ActiveMembership onReset={resetDemo} activationComplete={activationComplete} />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <Card variant="editorial" padding="lg" className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#08C58A]/10 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <Badge variant="peach" className="font-bold">PROPOSED PLAN</Badge>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-[#171916]">{studentPlusPlan.name}</h2>
                      <p className="mt-1 text-sm text-[#777A72]">For students building a more visible professional presence.</p>
                    </div>
                    <p className="font-mono text-3xl font-black text-[#171916]">
                      ₹{studentPlusPlan.price}<span className="font-sans text-sm font-semibold text-[#777A72]">/{studentPlusPlan.billingInterval}</span>
                    </p>
                  </div>

                  <ul className="mt-7 space-y-4 border-t border-[#E7E8E1] pt-6">
                    {studentPlusPlan.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-[#171916]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#08A876]" aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card padding="lg" className="mt-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#176B4C]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-[#171916]">What this demo does</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#777A72]">It temporarily adds Plus access to this browser session so you can review the member state. No payment information is collected, saved, or sent anywhere.</p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="lg:col-span-5" aria-labelledby="checkout-title">
              <Card padding="lg" className="h-full">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Checkout preview</p>
                    <h2 id="checkout-title" className="mt-2 text-xl font-black text-[#171916]">Activate demo access</h2>
                  </div>
                  <Badge variant="neutral" size="sm">No charge</Badge>
                </div>

                <fieldset className="mt-6 space-y-3">
                  <legend className="text-sm font-bold text-[#171916]">Choose a payment method</legend>
                  {paymentMethods.map(({ id, label, detail, icon: Icon }) => {
                    const checked = paymentMethod === id

                    return (
                      <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${checked ? 'border-[#08C58A] bg-[#E3F4EB]/45' : 'border-[#E7E8E1] bg-white hover:border-[#08C58A]/50'}`}>
                        <input type="radio" name="demo-payment-method" value={id} checked={checked} onChange={() => setPaymentMethod(id)} className="h-4 w-4 accent-[#08A876]" />
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#123D30] shadow-2xs"><Icon className="h-4 w-4" /></span>
                        <span>
                          <span className="block text-sm font-bold text-[#171916]">{label} · demo</span>
                          <span className="mt-0.5 block text-xs text-[#777A72]">{detail}</span>
                        </span>
                      </label>
                    )
                  })}
                </fieldset>

                <div className="mt-6 rounded-2xl bg-[#F7F6F0] p-4 text-sm">
                  <div className="flex items-center justify-between gap-4 text-[#777A72]"><span>Student Plus</span><span>₹{studentPlusPlan.price}.00</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#E7E8E1] pt-3 font-bold text-[#171916]"><span>Amount due today</span><span>₹0.00</span></div>
                  <p className="mt-2 text-xs leading-relaxed text-[#777A72]">The ₹{studentPlusPlan.price}/month price is shown for product testing only. This demo never starts billing.</p>
                </div>

                <Button type="button" onClick={() => void activateDemo()} disabled={isActivating} className="mt-6 w-full">
                  {isActivating ? 'Activating demo access…' : 'Complete demo checkout'}
                </Button>
                <p className="mt-3 text-center text-xs leading-relaxed text-[#777A72]">By continuing, you are only changing local demo state for this session.</p>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function ActiveMembership({ onReset, activationComplete }: { onReset: () => Promise<void>; activationComplete: boolean }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <Card variant="editorial" padding="lg" className="overflow-hidden">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#08C58A] text-[#0A261D] shadow-[0_6px_20px_rgba(8,197,138,0.25)]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <Badge variant="green" className="font-bold">STUDENT PLUS ACTIVE · DEMO</Badge>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#171916]">Your profile now has Plus visibility.</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#777A72]">{activationComplete ? 'Demo checkout completed successfully.' : 'This membership state is active from a previous demo action.'} Your Plus badge is now visible on the demo profile.</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#E7E8E1] pt-6 sm:grid-cols-2">
            <Link to={routes.profiles} className="rounded-xl border border-[#E7E8E1] bg-white px-4 py-3 text-center text-sm font-bold text-[#123D30] transition hover:border-[#08C58A]">View talent directory</Link>
            <Link to={routes.dashboard} className="rounded-xl bg-[#123D30] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0E3127]">Return to dashboard</Link>
          </div>
        </Card>
      </section>

      <section className="lg:col-span-5">
        <Card padding="lg" className="h-full">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#08A876]" /><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">Analytics preview</p></div>
          <div className="mt-5 space-y-4">
            {studentPlusAnalyticsPreview.map((metric, index) => {
              const Icon = [Eye, UserRoundCheck, Sparkles][index]

              return (
                <div key={metric.label} className="flex items-center gap-3 rounded-2xl bg-[#F7F6F0] p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#176B4C] shadow-2xs"><Icon className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-bold text-[#171916]">{metric.value} {metric.label.toLowerCase()}</span><span className="block text-xs text-[#777A72]">{metric.detail}</span></span>
                </div>
              )
            })}
          </div>
          <Button variant="ghost" size="sm" onClick={() => void onReset()} className="mt-5 w-full">Reset demo membership</Button>
        </Card>
      </section>
    </div>
  )
}
