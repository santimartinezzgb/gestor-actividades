import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../../services/authService';
import { userSession } from '../../services/session';


export const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password'>(null);

    // PARA INICIAR SESIÓN
    const handleLogin = async () => {
        if (!username || !password) return setError('Please fill in all fields');
        setLoading(true);
        setError(null);
        try {
            const res = await login(username, password);

            // GUARDAR INFORMACIÓN DEL USUARIO
            Object.assign(userSession, { userId: res.userId, username: res.username, token: res.token });

            // REDIRECCIONAR A LA PÁGINA CORRECTA
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
            <Text style={styles.title}>My Fitness</Text>
            <View style={styles.containerInputs}>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <InputField type="username" placeholder="Username" value={username} setter={setUsername} />
                <InputField type="password" placeholder="Password" value={password} setter={setPassword} secure />
            </View>
            <View style={styles.containerButtons}>
                <TouchableOpacity style={[styles.contenedorLogin, { opacity: loading ? 0.7 : 1 }]} onPress={handleLogin} disabled={loading}>
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