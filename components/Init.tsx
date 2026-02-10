import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Init = () => {
    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            resizeMethod="scale"

        >
            <Text style={styles.title}>MyFitness</Text>

            <View style={styles.containerInputs}>
                <TextInput placeholder="Username" style={styles.input} />
                <TextInput placeholder="Password" secureTextEntry style={styles.input} />
            </View>

            <View style={styles.containerButtons}>

                <TouchableOpacity style={styles.contenedorLogin}>
                    <Text style={styles.btnLogin}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contenedorSignUp}>
                    <Text style={styles.btnSignUp}>Sign Up</Text>
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
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    containerButtons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    contenedorLogin: {
        backgroundColor: '#F7B176',
        width: '30%',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    contenedorSignUp: {
        width: '30%',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    btnLogin: {
        width: '70%',
        height: 20,
        textAlign: 'center',
        color: '#222',
        fontWeight: 'bold',
    },
    btnSignUp: {
        width: '70%',
        height: 20,
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
    },
});