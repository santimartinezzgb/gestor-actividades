import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './authStyles';
import { register } from '../../services/authService';

export const Signup = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password' | 'confirm'>(null);

    const handleSignup = async () => {

        // VALIDACIONES PARA EL REGISTRO
        if (!username || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // INICIAR PROCESO DE REGISTRO
        setLoading(true);
        setError(null);

        try {
            await register({
                username,
                password,
                rol: 'USER',
            });
            alert('Registration successful! You can now log in.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.optionsTop}>
                <TouchableOpacity style={styles.inactiveTab} onPress={() => router.push('/login')}>
                    <Text style={styles.inactiveTabText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.activeTab}>
                    <Text style={styles.activeTabText}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionTitle}>
                <Text style={styles.title}>MyFitness</Text>
                <Text style={styles.subtitle}>Track your activities with ease</Text>
            </View>

            <View style={styles.card}>
                {/* CAMPOS DE ENTRADA PARA REGISTRO */}
                <View style={styles.containerInputs}>
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {/* CAMPO DE USUARIO */}
                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={[
                            styles.input,
                            focusedInput === 'username' && styles.inputFocused
                        ]}
                        onFocus={() => setFocusedInput('username')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    {/* CAMPO DE CONTRASEÑA */}
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={[
                            styles.input,
                            focusedInput === 'password' && styles.inputFocused
                        ]}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                    />
                    {/* CAMPO DE CONFIRMAR CONTRASEÑA */}
                    <TextInput
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={[
                            styles.input,
                            focusedInput === 'confirm' && styles.inputFocused
                        ]}
                        onFocus={() => setFocusedInput('confirm')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                {/* BOTÓN DE REGISTRO */}
                <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                    onPress={handleSignup} disabled={loading}>
                    <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : 'Register'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
