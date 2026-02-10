'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '../api/client/endpoints'
import { Button } from '@/shared/ui/button'

export function LogoutButton() {
    const router = useRouter()
    const [logout, { isLoading }] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            router.push('/auth')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoading}
            data-testid="logout-button"
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    )
}
