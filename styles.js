import { StyleSheet } from 'react-native';

export const colors = {
    grey: '#e1dddd',
    white: '#fff',
    black: '#000',
    orange: '#ff7312',
    yellow: '#ffd800',
    blue: '#3b91fc',
    navBarInactive: '#b9b9b9'
}

export const styles = StyleSheet.create({
    title: {
        fontWeight: '600',
        fontSize: 36,
        marginTop: 25,
        marginBottom: 2,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'grey',
        marginBottom: 15,
        textAlign: 'center',
    },
    sliderTrackStyle: {
        backgroundColor: colors.grey,
        height: 12,
        borderRadius: 20,
    }
});
