import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './authStyles';
import { login } from '../../services/authService';
import { setSession } from '../../services/session';

export const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password'>(null);

    // PARA INICIAR SESIÓN
    const handleLogin = async () => {

        // VALIDACIONES PARA EL LOGIN
        if (!username || !password) return setError('Please fill in all fields');
        setLoading(true);
        setError(null);

        try {
            const res = await login(username, password);

            // GUARDAR INFORMACIÓN DEL USUARIO + TOKEN JWT
            setSession(res.userId, res.username, res.token);

            // REDIRECCIONAR SEGÚN ROL ( ADMIN O USER )
            router.push(res.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/user');
        } catch (err: any) {
            setError(err.message || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    // PARA EL CAMPO DE ENTRADA
    const InputField = ({ type, placeholder, value, setter, secure }: any) => (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setter}
            secureTextEntry={secure}
            style={[styles.input, focusedInput === type && styles.inputFocused]}
            onFocus={() => setFocusedInput(type)}
            onBlur={() => setFocusedInput(null)}
        />
    );

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
                {/* CAMPOS DE ENTRADA PARA LOGIN */}
                <View style={styles.containerInputs}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <InputField type="username" placeholder="Username" value={username} setter={setUsername} />
                    <InputField type="password" placeholder="Password" value={password} setter={setPassword} secure />
                </View>

                {/* BOTÓN DE LOGIN */}
                <TouchableOpacity style={[styles.primaryButton, { opacity: loading ? 0.7 : 1 }]} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : 'Enter'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

