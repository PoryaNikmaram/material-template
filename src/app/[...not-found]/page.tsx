// Component Imports
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@components/shared/NotFound'

// Util Imports
import { getServerMode } from '@core/utils/serverHelpers'

const NotFoundPage = () => {
  const mode = getServerMode()

  return (
    <BlankLayout>
      <NotFound mode={mode} />
    </BlankLayout>
  )
}

export default NotFoundPage
