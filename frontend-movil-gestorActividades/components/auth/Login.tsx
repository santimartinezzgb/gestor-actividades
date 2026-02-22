import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../../services/authService';
import { setSession } from '../../services/session';
import styles from './authStyles';

export const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password'>(null);

    const handleLogin = async () => {
        if (!username || !password) return setError('Please fill in all fields');
        setLoading(true);
        setError(null);

        try {
            const res = await login(username, password);
            setSession(res.userId, res.username, res.token, res.role || '');
            router.push(res.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/user');
        } catch (err: any) {
            setError(err.message || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.optionsTop}>
                <TouchableOpacity activeOpacity={1} style={styles.activeTab}>
                    <Text style={styles.activeTabText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inactiveTab} onPress={() => router.push('/signup')}>
                    <Text style={styles.inactiveTabText}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionTitle}>
                <Text style={styles.title}>MyFitness</Text>
                <Text style={styles.subtitle}>Track your activities with ease</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.containerInputs}>
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#5a5a5a"
                        value={username}
                        onChangeText={setUsername}
                        style={[styles.input, focusedInput === 'username' && styles.inputFocused]}
                        onFocus={() => setFocusedInput('username')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#5a5a5a"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <TouchableOpacity style={[styles.primaryButton, { opacity: loading ? 0.7 : 1 }]} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : 'Enter'}</Text>
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

