import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#222222',
        padding: 20,
    },
    optionsTop: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 100,
        marginTop: 120,
    },
    sectionTitle: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subtitle: {
        color: '#ffffff',
        fontSize: 18,
        marginTop: 4,
        opacity: 0.9,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: 'transparent',
        rowGap: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#F7B176',
        paddingBottom: 4,
    },
    inactiveTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        paddingBottom: 4,
    },
    activeTabText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    inactiveTabText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '500',
        opacity: 0.9,
    },
    containerInputs: {
        width: '100%',
        alignItems: 'center',
        rowGap: 8,
    },
    input: {
        width: '80%',
        height: 60,
        backgroundColor: '#828282',
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 14,
        color: '#ffffff',
        fontSize: 18,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    inputFocused: {
        borderLeftColor: '#F7B176',
    },
    primaryButton: {
        width: '30%',
        height: 50,
        borderRadius: 14,
        backgroundColor: '#F7B176',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold',
    },
    errorText: {
        width: '100%',
        color: '#ff6b6b',
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
