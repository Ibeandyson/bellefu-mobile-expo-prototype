import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import { Button, TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Picker} from '@react-native-community/picker';

export default function UpadateProfile(props) {
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null)
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [updateData, setUpdataData] = React.useState({
        first_name: '',
        last_name: '',
        phone: '',
        country_code: '',
        state_code: '',
        lga_code: '',
        address: '',
        bio: '',
    });
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [lgaData, setLgaData] = useState([]);
    const [sucess, setSucess] = useState('')
    const {first_name, last_name, phone, country_code, state_code, lga_code, address, bio} = updateData;

    const onChangeFirstName = value => {
        setUpdataData({
            ...updateData,
            first_name: value
        });
    };
    const onChangeLastName = value => {
        setUpdataData({
            ...updateData,
            last_name: value
        });
    };
    const onChangePhone = value => {
        setUpdataData({
            ...updateData,
            phone: value
        });
    };
    const onChangeAddress = value => {
        setUpdataData({
            ...updateData,
            address: value
        });
    };
    const onChangeBio = value => {
        setUpdataData({
            ...updateData,
            bio: value
        });
    };

    const onChangeCountry = value => {
        setUpdataData({
            ...updateData,
            country_code: value
        });
    };
    const onChangeState = value => {
        setUpdataData({
            ...updateData,
            state_code: value
        });
    };
    const onChangeLga = value => {
        setUpdataData({
            ...updateData,
            lga_code: value
        });
    };


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setImageData(result)
            console.log("PIC", imageData)
        }
      
    };

    // call user profile api
    let url = 'https://bellefu.com/api/user/profile/details';
    const loadProfile = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);
        console.log(token);
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProfile(res.data.user);
                setLoading(false);
                let stateUrl = `https://bellefu.com/api/${res.data.user.country_code}/state/list`;

                axios.get(stateUrl).then(res => {
                    setStateData(res.data.states);
                   
                });
            })
            .catch(e => {
                console.log('profile error', e);
            });
    };

    // call country api
    let countryUrl = 'https://bellefu.com/api/country/list';
    const loadCountry = () => {
        axios.get(countryUrl).then(res => {
            setCountryData(res.data.countries);
        });
    };

    //call lga api
    let lgaUrl = `https://bellefu.com/api/${profile.country_code}/${updateData.state_code}/lga/list`;

    useEffect(
        () => {
            async function loadLga() {
                await axios
                    .get(lgaUrl)
                    .then(res => {
                        setLgaData(res.data.lgas);
                    })
                    .catch(error => console.log('lga', error));
            }
            loadLga();
            console.log(lgaData);
        },
        [updateData, setLgaData]
    );

    useEffect(
        () => {
            loadProfile();
            loadCountry();
        },
        [stateData.length]
    );


    
      const onSubmitHandle = () => {
        let localUri = imageData.uri;
        let filename = localUri.split('/').pop();
      
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

          const payload = new FormData();
         console.log(updateData)
          payload.append("first_name", updateData.first_name);
          payload.append("last_name", updateData.last_name);
          payload.append("lga_code", updateData.lga_code);
          payload.append("phone", updateData.phone);
          payload.append("state_code", updateData.state_code);
          payload.append("country_code", updateData.country_code);
          payload.append("address", updateData.address);
          payload.append("bio", updateData.bio);
          payload.append('avatar', { uri: localUri, name: filename, type});
        
        axios.post("https://bellefu.com/api/user/profile/update", payload, {
            
                headers: {
                    
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json'
            },
          }).then(res => {
            setSucess(res.data.message)
            Alert.alert(res.data.message)
            console.log("succes", res.data.message)
          }).catch(e => {
            console.log('submit', e.response.data);
          })
    };

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Preloader />
                ) : (
                    <View style={styles.container}>
                        <View style={{marginBottom: 10}}>
                            <Text>First Name</Text>
                            <TextInput
                                mode="outlined"
                                name="first_name"
                                value={first_name}
                                label={profile.profile && profile.profile.first_name}
                                onChangeText={value => onChangeFirstName(value)}
                            />
                        </View>
                        <View style={{marginBottom: 30}}>
                            <Text>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                name="last_name"
                                label={profile.profile && profile.profile.last_name}
                                value={last_name}
                                onChangeText={value => onChangeLastName(value)}
                            />
                        </View>
                        <View style={{marginBottom: 30}}>
                            <Text>Phone Number (do not add country code)</Text>
                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                name="phone"
                                label={profile.phone}
                                value={phone}
                                onChangeText={value => onChangePhone(value)}
                            />
                        </View>
                        <View style={{marginBottom: 30}}>
                            <Text>Address</Text>
                            <TextInput
                                style={styles.input}
                                mode="outlined"
                                name="address"
                                label={profile.address}
                                value={address}
                                onChangeText={value => onChangeAddress(value)}
                            />
                        </View>
                        <View style={{marginBottom: 30}}>
                            <Text>Bio</Text>
                            <TextInput
                                style={{marginBottom: 30}}
                                value={bio}
                                multiline={true}
                                numberOfLines={5}
                                mode="outlined"
                                name="bio"
                                label={profile.bio}
                                onChangeText={value => onChangeBio(value)}
                            />
                        </View>

                        <View style={{marginBottom: 30}}>
                            <Text>Country</Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 4,
                                    height: 60,
                                    opacity: 4
                                }}>
                                <Picker
                                    selectedValue={country_code}
                                    borderStyle="solid"
                                    onValueChange={value => onChangeCountry(value)}>
                                    {profile.country_code === null ? (
                                        <Picker.Item label=">>>select country<<<" />
                                    ) : (
                                        <Picker.Item label={profile.country && profile.country.name} />
                                    )}

                                    {countryData.map(data => (
                                        <Picker.Item key={data.ios2} label={data.name} value={data.iso2} />
                                    ))}
                                </Picker>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginBottom: 30}}>
                            <Text>State</Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 4,
                                    height: 60,
                                    opacity: 4
                                }}>
                                <Picker
                                    selectedValue={state_code}
                                    borderStyle="solid"
                                    onValueChange={value => onChangeState(value)}>
                                    {profile.admin1_code === null ? (
                                        <Picker.Item label=">>>select state<<<" />
                                    ) : (
                                        <Picker.Item label={profile.admin1_code} />
                                    )}

                                    {stateData.map(data => (
                                        <Picker.Item key={data.code} label={data.name} value={data.code} />
                                    ))}
                                </Picker>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginBottom: 30}}>
                            <Text>City</Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 4,
                                    height: 60,
                                    opacity: 4
                                }}>
                                <Picker
                                    selectedValue={lga_code}
                                    borderStyle="solid"
                                    onValueChange={value => onChangeLga(value)}>
                                    {profile.admin1_code === null ? (
                                        <Picker.Item label=">>>select city<<<" />
                                    ) : (
                                        <Picker.Item label={profile.admin1_code} />
                                    )}

                                    {lgaData.map(data => (
                                        <Picker.Item key={data.code} label={data.name} value={data.code} />
                                    ))}
                                </Picker>
                            </TouchableOpacity>
                        </View>
                        <View style={{justifyContent: 'center', marginTop: 10, alignSelf: "center"}}>
                            {image && <Image source={{uri: image}} style={{width: 200, height: 200}} />}
                        </View>

                        <View style={{padding: 20, marginTop: 20}}>
                            <Text style={{marginBottom: 10}}>*Upload the product images</Text>
                            <Button onPress={pickImage} mode="contained" style={{backgroundColor: '#ffa500'}}>
                                <AntDesign name="cloudupload" size={23} color="white" />
                                <Text style={{color: 'white'}}>upload image</Text>
                            </Button>
                        </View>

                        <Button
                            style={styles.btn}
                            onPress={() => onSubmitHandle(updateData,image)}
                            mode="contained"
                            icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                            <Text style={{color: 'white'}}>Upadte</Text>
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        marginBottom: 20
    },

    inputselect: {
        marginTop: 20
    },
    btn: {
        marginTop: 40,
        color: 'white',
        backgroundColor: '#ffa500'
    }
});
