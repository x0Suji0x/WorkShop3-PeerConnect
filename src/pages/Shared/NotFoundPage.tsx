import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <EmptyState
          icon={Compass}
          title="That page is not on the map"
          description="The link may be out of date, or the page has not been created yet."
          action={<Link to={routes.home}><Button>Return to PeerConnect</Button></Link>}
        />
      </div>
    </div>
  )
}
