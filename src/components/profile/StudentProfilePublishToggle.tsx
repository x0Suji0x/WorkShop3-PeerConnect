import { useStudentProfile } from '../../hooks/useStudentProfile'

export function StudentProfilePublishToggle() {
  const { student, isSaving, updateStudent } = useStudentProfile()

  return (
    <div className="rounded-2xl border border-[#E7E8E1] bg-white/80 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={Boolean(student.isPublic)}
          disabled={isSaving}
          onChange={(event) => void updateStudent({ isPublic: event.target.checked }).catch(() => {})}
          className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#08A876] focus:ring-[#08C58A]"
          aria-label="Publish my profile"
        />
        <span>
          <span className="block text-sm font-bold text-[#171916]">Publish my profile</span>
          <span className="mt-1 block text-xs leading-relaxed text-[#777A72]">
            When published, your name, education, skills, portfolio, and profile links are visible in the talent directory. Contact details are not included.
          </span>
        </span>
      </label>
    </div>
  )
}
