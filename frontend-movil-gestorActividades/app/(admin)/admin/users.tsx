import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { UsersAdmin } from '../../../components/admin/UsersAdmin';
import { isAdmin, isAuthenticated } from '../../../services/session';

export default function UsersAdminScreen() {
    const router = useRouter();
    useEffect(() => { if (!isAuthenticated() || !isAdmin()) router.replace('/login'); }, []);
    if (!isAuthenticated() || !isAdmin()) return null;
    return <UsersAdmin />;
}
