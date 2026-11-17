import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { routes } from '../../app/routes'

export interface ModulePlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  owner: string
}

export function ModulePlaceholderPage({ eyebrow, title, description, owner }: ModulePlaceholderPageProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8">
        <EmptyState
          icon={Construction}
          title={`${title} is being prepared`}
          description={`This route contract is ready for ${owner}'s module. The shared layout, navigation, and routing are already in place.`}
          action={<Link to={routes.home}><Button variant="secondary">Back to home</Button></Link>}
        />
      </div>
    </div>
  )
}
