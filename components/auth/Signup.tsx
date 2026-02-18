import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
            <Text style={styles.title}>My Fitness</Text>

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

            {/* BOTONES DE REGISTRO Y LOGIN */}
            <View style={styles.containerButtons}>
                {/* BOTÓN DE REGISTRO */}
                <TouchableOpacity style={[styles.contenedorSignUp, loading && { opacity: 0.7 }]}
                    onPress={handleSignup} disabled={loading}>
                    <Text style={styles.btnSignUp}>{loading ? '...' : 'Sign Up'}</Text>
                </TouchableOpacity>
                {/* BOTÓN DE LOGIN */}
                <TouchableOpacity style={styles.contenedorLogin} onPress={() => router.push('/login')}>
                    <Text style={styles.btnLogin}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        paddingTop: 60,
    },
    logo: {
        width: 64,
        height: 64,
        marginBottom: 24,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    containerInputs: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        width: '70%',
        height: 60,
        backgroundColor: '#828282',
        borderRadius: 40,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
    },
    inputFocused: {
        borderLeftColor: '#F7B176',
    },


    /* BUTTONS */
    containerButtons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
    },

    /* Login */
    contenedorSignUp: {
        backgroundColor: '#F7B176',
        width: '30%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    btnSignUp: {
        width: '70%',
        height: 25,
        fontSize: 20,
        textAlign: 'center',
        color: '#222',
        fontWeight: 'bold',
    },

    /* Sign Up */
    contenedorLogin: {
        width: '30%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    btnLogin: {
        width: '70%',
        height: 60,
        fontSize: 16,
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff4444',
        marginBottom: 10,
        fontWeight: 'bold',
    },
});