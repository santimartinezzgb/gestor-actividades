import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivitiesAdmin } from '../../../components/admin/ActivitiesAdmin';
import { isAdmin, isAuthenticated } from '../../../services/session';

export default function ActivitiesAdminScreen() {
    const router = useRouter();
    useEffect(() => { if (!isAuthenticated() || !isAdmin()) router.replace('/login'); }, []);
    if (!isAuthenticated() || !isAdmin()) return null;
    return <ActivitiesAdmin />;
}
