// Component Imports
import { Register } from '@/features/auth'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const RegisterPage = () => {
  // Vars
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
