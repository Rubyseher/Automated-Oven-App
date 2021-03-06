import { StyleSheet } from 'react-native';

export const colors = {
    red: '#e93838',
    lightRed: '#ed4849',
    orange: '#ff7300',
    yellow: '#ffd600',
    teal: '#2dc09c',
    lightGreen: '#26d46c',
    blue: '#3f91ff',
    lightBlue: '#f3fbff',
    darkBlue: '#065ff6',
    purple: '#634dd3',
    turquoise: '#7ae8ff',
    grey: '#e1dddd',
    textGrey: '#a5a5a5',
    darkGrey: '#727676',
    white: '#fff',
    black: '#000',
    navBarInactive: '#b9b9b9'
}

export const itemColors = {
    cook: colors.yellow,
    preheat: colors.orange,
    notify: colors.purple,
    cool: colors.turquoise,
    poweroff: colors.red,
    checkpoint: colors.blue,
}

export const styles = StyleSheet.create({
    title: {
        fontWeight: '600',
        fontSize: 41,
        marginTop: 65,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: colors.darkGrey,
        textAlign: 'center',
    },
    carouselTitle: {
        fontWeight: 'bold',
        paddingTop: 14,
        paddingBottom: 20,
        textAlign: 'center',
        fontSize: 21
    },
    sliderTrackStyle: {
        backgroundColor: colors.grey,
        height: 12,
        borderRadius: 20,
    },
    carouselCircle: {
        height: 95,
        width: 95,
        borderRadius: 47.5,
        justifyContent: 'center',
        backgroundColor: colors.yellow,
    },
    roundButtonM: {
        height: 70,
        width: 70,
        borderRadius: 35,
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
        height: 90,
        width: 90,
        padding: 7,
        marginLeft: 40,
        marginRight: 40,
        alignSelf: 'center',
    },
    closeButtonM: {
        height: 20,
        width: 20,
        borderRadius: 10,
        padding: 0,
        alignSelf: 'center',
        backgroundColor: colors.textGrey
    },
    closeButtonPaddingM: {
        height: 40,
        width: 70,
        alignSelf: 'flex-end'
    },
    closeButtonS: {
        height: 15,
        width: 15,
        borderRadius: 8,
        padding: 0,
        alignSelf: 'center',
        backgroundColor: colors.textGrey
    },
    closeButtonPaddingS: {
        height: 26,
        width: '18%',
        padding: 4,
        alignSelf: 'flex-end'
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
        height: 50,
        width: 50,
        padding: 2,
        // marginTop:10,
        alignSelf: 'center',
    },
    mainCardContainer: {
        width: '76%',
        height: 450,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: '5%',
        marginHorizontal: '11%',
        paddingHorizontal: 26,
        paddingVertical: 50,
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6.94,
        elevation: 4,
    },
    urlOverlay: {
        width: '90%',
        height: 75,
        flexDirection: 'row',
        borderRadius: 40,
        alignSelf: 'center',
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        zIndex: 1,
        shadowOpacity: 0.1,
        shadowRadius: 8.34,
        elevation: 4,
        position: 'absolute',
        top: '12%'
    },
    urlName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 14,
        marginBottom: 4,
    },
    urlTemp: {
        padding: 0,
        fontSize: 15,
        // color: colors.blue,
        // marginLeft: 26,
    },
    urlCook: {
        backgroundColor: colors.darkBlue,
        width: '90%',
        padding: 5,
        borderRadius: 24,
        alignSelf: 'center',
    },
    urlPlay: {
        height: 45,
        width: 45,
        marginLeft: 14,
        marginTop: 15,
        borderRadius: 22,
        padding: 0,
        backgroundColor: colors.orange,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    //   ********* historyScreen ********* 
    heading: {
        fontWeight: 'bold',
        fontSize: 36,
        color: colors.blue,
        marginTop: 50,
        marginLeft: -4,
        marginBottom: 27,
        // marginLeft: 26,
    },
    foodContainer: {
        width: '100%',
        height: 75,
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        zIndex: 1,
        shadowOpacity: 0.15,
        shadowRadius: 3.34,
        elevation: 4,
    },
    detailsContainer: {
        width: '100%',
        height: 43,
        zIndex: 0,
        flexDirection: 'row',
        marginBottom: 20,
        alignSelf: 'center',
        backgroundColor: colors.lightBlue,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tagBadge: {
        height: 45,
        width: 45,
        marginLeft: 14,
        marginTop: 15,
        borderRadius: 22,
        padding: 0,
        backgroundColor: colors.yellow,
    },
    foodCircleM: {
        height: 28,
        width: 28,
        borderRadius: 22,
        marginTop: 26,
    },
    detailsCircle: {
        marginTop: 12,
        height: 22,
        width: 22,
        marginLeft: 14,
        borderRadius: 22,
        // padding: 0,
        justifyContent: 'center'
    },
    detailText: {
        marginTop: 15,
        marginRight: 18,
        color: colors.darkGrey,
    },
    //  ********** profile screen *********
    profileCircle: {
        height: 65,
        width: 65,
        marginLeft: 20,
        borderRadius: 32,
        marginBottom: 42,
        // padding: 20,
        paddingLeft: 18,
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
    fullName: {
        fontWeight: 'bold',
        marginLeft: 14,
        marginRight: 38,
        fontSize: 21
    },
    profileTitles: {
        fontWeight: '500',
        marginLeft: 6,
        marginRight: 22,
        fontSize: 21,
        marginBottom: 10,
        width: '60%',
    },
    energy: {
        fontSize: 16,
        color: colors.darkGrey,
        marginTop: 6,
        textAlign: 'right',
        width: '30%',
    },
    recomend: {
        width: '65%',
        height: '50%',
        backgroundColor: colors.darkGrey,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        zIndex: 1,

    },
    recomendContainer: {
        zIndex: 0,
        backgroundColor: colors.blue,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    // ********* energy screen ********
    consumption: {
        textAlign: 'right',
        width: '30%',
        fontWeight: '600',
        fontSize: 28,
        color: colors.black,
        marginTop: -2
    },
    tagContainer: {
        width: '94%',
        height: 70,
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 8,
        paddingTop: 6,
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    graphLabel: {
        fontWeight: '400',
        marginLeft: 12,
        // marginRight: 38,
        fontSize: 20,
        marginBottom: 10,
        width: '64%',
        color: colors.darkGrey
    },
    tagLabel: {
        fontWeight: '400',
        fontSize: 20,
        width: '46%',
        marginLeft: 10,
        marginTop: 18,
        color: colors.darkGrey
    },
    // ********* automation screen ********
    autoTitle: {
        marginTop: 15,
        // marginRight: 18,
        color: colors.darkGrey,
        width: '74%'
    },
    autoRecipe: {
        fontWeight: 'bold',
        marginLeft: 14,
        fontSize: 21,
        marginTop: 26,
        width: '60%'
    },
    autoContainer: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        marginBottom: 40,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 12
    },
    contentContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontWeight: '600',
        fontSize: 22,
        color: colors.blue,
    },
    min: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.blue,
    },
    notifyMsg: {
        marginVertical: 6,
        marginHorizontal: 16,
        fontSize: 14,
        color: colors.black,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.grey,
    },
    timeThread: {
        height: 30,
        width: 5,
        backgroundColor: colors.grey,
        alignSelf: 'center',
        marginTop: -40,
    },
    close: {
        marginTop: 12,
        height: 18,
        width: 18,
        // marginLeft: 14,
        borderRadius: 6,
        // padding: 0,
        justifyContent: 'center'
    },
    listTitle: {
        paddingVertical: 15,
        fontSize: 20,
        fontWeight: '600'
    },
    overlayContainer: {
        backgroundColor: colors.white,
        width: '100%',
        height: "65%",
        bottom: 0,
        position: 'absolute',
        borderRadius: 26,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 6.94,
        elevation: 4,
    },
    saveOverlay: {
        backgroundColor: colors.white,
        width: '100%',
        bottom: 0,
        position: 'absolute',
        paddingTop: 20,
        paddingBottom: 30,
        borderTopRightRadius: 26,
        borderTopLeftRadius: 26,
        // borderRadius:26,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6.94,
        elevation: 4,
    },
    saveButton: {
        backgroundColor: colors.darkBlue,
        width: '90%',
        padding: 15,
        borderRadius: 12,
        alignSelf: 'center',
    },
    saveText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addStep: {
        fontWeight: '600',
        fontSize: 30,
        color: colors.black,
        marginTop: 20,
        marginBottom: 27,
        marginLeft: 26,
    },
    saveAuto: {
        fontWeight: 'bold',
        fontSize: 22,
        color: colors.black,
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.grey,
    },
    stepTitle: {
        // marginRight: 18,
        fontSize: 18,
        textAlign: 'center',
        color: colors.darkGrey,
        width: '84%',
        marginBottom: 20
    },
    stepCircle: {
        height: 85,
        width: 85,
        borderRadius: 42.5,
        justifyContent: 'center',
        backgroundColor: colors.yellow,
    },
    stepCirclePadding: {
        height: 105,
        width: 105,
        // padding: 7,
        // marginLeft: 60,
        // marginRight: 40,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    closeHeading: {
        fontWeight: 'bold',
        fontSize: 36,
        color: colors.blue,
        marginLeft: -4,
        // marginBottom: 27,
        // marginLeft: 26,
    },
    // *********** welocme screen *******
    welcomeTitle: {
        fontWeight: 'bold',
        fontSize: 36,
        marginBottom: 24,
        color: colors.white
    },
    welcomeContainer: {
        padding: 50,
        alignItems: 'center',
        marginVertical: '50%',
        marginHorizontal: 30,
        borderRadius: 12,
        backgroundColor: colors.blue,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '500',
        paddingBottom: 12,
        color: colors.white,
    },
    newName: {
        fontSize: 22,
        color: colors.white,
        fontWeight: '500',
        padding: 8,
        margin: 10,
        textAlign: 'center',
        width: '80%',
        borderBottomWidth: 4,
        borderColor: colors.white
    },
    dropDown: {
        backgroundColor: colors.white,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 3.84,
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    chooseTone: {
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 24,
    },
    chooseTitle: {
        color: colors.black,
        fontSize: 14
    },
    currentTone: {
        backgroundColor: colors.blue,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 24,
    },
    currentTitle: {
        color: colors.white,
        fontSize: 14
    },

    volumeChooseContainer: {
        height: 40,
        // width: 50,
        padding: 4,
        marginHorizontal: 2,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.84,
        // elevation: 5,
    },
    switchItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 8
    },
    switchIcon: {
        height: 34,
        width: 34,
        borderRadius: 17,
        paddingVertical: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
    listItemName: {
        fontWeight: '500',
        fontSize: 16,
        color: colors.darkGrey,
        width: '70%',
        marginLeft: 5
    },
    divider: {
        width: '90%',
        backgroundColor: colors.grey,
        height: 1,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 5
    },
    paginationContainer: {
        marginHorizontal: '5%',
        flexDirection:'row',
        alignSelf:'center'
    },
    paginationItem: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth:6,
        marginHorizontal:15,
    },
    currentTemp: {
        fontWeight:'bold',
        color:colors.red,
        fontSize:24,
        marginTop:10,
        marginBottom:40
    },
    quickTypeTextInput: {
        fontWeight:'bold',
        fontSize:22,
        color:colors.black,
    }
});
