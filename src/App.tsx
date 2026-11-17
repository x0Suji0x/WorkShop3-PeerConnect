import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/Home/HomePage'

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppShell>
        <HomePage />
      </AppShell>
    </SmoothScrollProvider>
  )
}
