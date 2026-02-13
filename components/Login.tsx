import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../services/authService';
import { userSession } from './ActivitiesUser';


export const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password'>(null);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await login(username, password);
            console.log('Login success:', response);

            // Save session info
            userSession.userId = response.userId;
            userSession.username = response.username;

            if (response.role && response.role.toUpperCase() === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/user');
            }
        } catch (err: any) {
            setError(err.message || 'Error logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Fitness</Text>

            <View style={styles.containerInputs}>
                {error && <Text style={styles.errorText}>{error}</Text>}
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
            </View>


            <View style={styles.containerButtons}>
                <TouchableOpacity
                    style={[styles.contenedorLogin, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.btnLogin}>{loading ? 'loading...' : 'Login'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contenedorSignUp} onPress={() => router.push('/signup')}>
                    <Text style={styles.btnSignUp}>Sign Up</Text>
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
    contenedorLogin: {
        backgroundColor: '#F7B176',
        width: '30%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    btnLogin: {
        width: '70%',
        height: 25,
        fontSize: 20,
        textAlign: 'center',
        color: '#222',
        fontWeight: 'bold',
    },

    /* Sign Up */
    contenedorSignUp: {
        width: '30%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    btnSignUp: {
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