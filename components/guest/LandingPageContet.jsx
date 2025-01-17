import React, {useState, useEffect} from 'react';
import {View, Text, Linking, TouchableOpacity} from 'react-native';
import CategoryListing from './CategoryListing';
import {Card} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Search from '../reusableComponents/Search';

const LandingPageContet = React.memo(props => {
    return (
        <View style={{marginBottom: 10}}>
            <View style={{backgroundColor: '#76ba1b', height: 250}}>
                <View style={{padding: 10, marginTop: 50}}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10
                        }}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                            Bellefu - digital agro connect...
                        </Text>
                    </View>
                    <Search {...props} country={props.country} token={props.token} />
                    <View
                        style={{
                            marginTop: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/groups/bellefu')}>
                            <View style={{flexDirection: "row"}}>
                                <FontAwesome name="users" color="white" size={20} />
                                <Text style={{paddingLeft: 10, color: 'white'}}>Farmer's Club</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <CategoryListing token={props.token} country={props.country} {...props} />
            </View>
        </View>
    );
});
export default LandingPageContet;
