import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { isAdmin, isAuthenticated } from '../../services/session';

export default function AdminScreen() {
    const router = useRouter();

    // GUARD: redirigir si no es admin
    useEffect(() => {
        if (!isAuthenticated() || !isAdmin()) {
            router.replace('/login');
        }
    }, []);

    if (!isAuthenticated() || !isAdmin()) return null;

    return <AdminDashboard />;
}
