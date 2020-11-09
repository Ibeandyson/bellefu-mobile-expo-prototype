import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function withAuth(ComponentToBeRendered) {
    const Authenticate = (props) => {
        const load = async () => {
            let token = await AsyncStorage.getItem('user')
            if(token === undefined){
                props.navigation.navigate('Login')
            }
        }
         useEffect(() => {
           load()
         }, [])
            return (
                    <ComponentToBeRendered {...props} />
            )
        }

    return Authenticate;
}