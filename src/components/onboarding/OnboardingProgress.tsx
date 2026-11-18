import { Check } from 'lucide-react'
import type { OnboardingStep } from '../../types/onboarding'

interface OnboardingProgressProps {
  currentStep: OnboardingStep
  onStepClick?: (step: OnboardingStep) => void
  highestStepVisited: number
}

const steps = [
  { step: 1 as OnboardingStep, label: 'Account', description: 'Basic details' },
  { step: 2 as OnboardingStep, label: 'College', description: 'Institution & ID' },
  { step: 3 as OnboardingStep, label: 'Skills', description: 'Talent & interests' },
  { step: 4 as OnboardingStep, label: 'Goals', description: 'Availability' },
  { step: 5 as OnboardingStep, label: 'Portfolio', description: 'Links & experience' },
  { step: 6 as OnboardingStep, label: 'Review', description: 'Confirm profile' },
]

export function OnboardingProgress({
  currentStep,
  onStepClick,
  highestStepVisited,
}: OnboardingProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile step progress indicator */}
      <div className="flex items-center justify-between lg:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
            Step {currentStep} of 6
          </span>
          <h2 className="text-sm font-bold text-[#171916]">
            {steps[currentStep - 1].label} — {steps[currentStep - 1].description}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-[#525A55]">
          {Math.round((currentStep / 6) * 100)}%
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E7E8E1] lg:hidden">
        <div
          className="h-full rounded-full bg-[#08C58A] transition-all duration-300"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>

      {/* Desktop multi-step stepper */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        {steps.map((item, idx) => {
          const isCompleted = item.step < currentStep
          const isCurrent = item.step === currentStep
          const canNavigate = item.step <= highestStepVisited

          return (
            <div key={item.step} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && onStepClick?.(item.step)}
                className={`group flex items-center gap-3 text-left transition-all ${
                  canNavigate ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#123D30] text-[#08C58A] shadow-xs'
                      : isCurrent
                      ? 'border-2 border-[#08C58A] bg-[#E3F4EB] text-[#123D30] shadow-sm'
                      : 'border border-[#E7E8E1] bg-white text-[#777A72]'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : item.step}
                </div>
                <div className="hidden xl:block">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-[#08A876]' : 'text-[#777A72]'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs font-medium text-[#171916] line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-3 h-0.5 flex-1 transition-colors ${
                    item.step < currentStep ? 'bg-[#08C58A]' : 'bg-[#E7E8E1]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
