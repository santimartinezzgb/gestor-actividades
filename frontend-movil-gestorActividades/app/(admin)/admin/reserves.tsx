import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ReservesAdmin } from '../../../components/admin/ReservesAdmin';
import { isAdmin, isAuthenticated } from '../../../services/session';

export default function ReservesAdminScreen() {
    const router = useRouter();
    useEffect(() => { if (!isAuthenticated() || !isAdmin()) router.replace('/login'); }, []);
    if (!isAuthenticated() || !isAdmin()) return null;
    return <ReservesAdmin />;
}
