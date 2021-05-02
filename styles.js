import { StyleSheet } from 'react-native';

export const colors = {
    grey: '#e1dddd',
    darkGrey: '#464749',
    white: '#fff',
    black: '#000',
    red: '#c30000',
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
    },
    roundButtonM: {
        height: 60,
        width: 60,
        borderRadius: 30,
        padding: 0,
        alignSelf: 'center',
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 11,
    },
    roundButtonPaddingM: {
        height:80,
        width:80,
        padding: 7,
        // marginTop:10,
        alignSelf: 'center',
    },
    roundButtonS: {
        height: 40,
        width: 40,
        borderRadius: 20,
        padding: 0,
        alignSelf: 'center',
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    roundButtonPaddingS: {
        height:50,
        width:50,
        padding: 2,
        // marginTop:10,
        alignSelf: 'center',
    }
});
