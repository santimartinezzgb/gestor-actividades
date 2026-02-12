import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Login = () => {
    const router = useRouter();
    const [focusedInput, setFocusedInput] = useState<null | 'username' | 'password'>(null);
    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            resizeMethod="scale"
        >
            <Text style={styles.title}>LOGIN</Text>

            <View style={styles.containerInputs}>
                <TextInput
                    placeholder="Username"
                    style={[
                        styles.input,
                        focusedInput === 'username' && styles.inputFocused
                    ]}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                    placeholder="Password"
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
                <TouchableOpacity style={styles.contenedorLogin}>
                    <Text style={styles.btnLogin} onPress={() => router.push('/user')}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contenedorSignUp}>
                    <Text style={styles.btnSignUp} onPress={() => router.push('/signup')}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 54,
        width: width,
        height: height,
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
});