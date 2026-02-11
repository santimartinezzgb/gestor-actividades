import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
            <Text style={styles.title}>USER SCREEN</Text>

            <View style={styles.containerButtons}>
                <TouchableOpacity style={styles.contenedorLogin} onPress={() => router.push('/signup')}>
                    <Text style={styles.btnLogin}>Salir</Text>
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