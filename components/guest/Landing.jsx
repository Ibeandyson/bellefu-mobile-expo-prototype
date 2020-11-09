import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView
} from "react-native";
import Header from "../navigations/Header";
import Bottom from "../navigations/BottomNav";
import ProductList from "../reusableComponents/ProductList";
import LandingPageContet from "../guest/LandingPageContet"
import { FlatList, } from "react-native-gesture-handler";
import Axios from "axios";
import Preloader from "./Preloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function Landing(props) {
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [token, setToken] = useState("");
  const [country, setCountry] = useState('')

  const callApi = async (country, token) => {
    Axios.get(
      `https://bellefu.com/api/product/list?country=${country}`,
      {
        headers: {
          Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        setLoading(false);
        setProducts(res.data.products);
        setProductsData(res.data.products.data);
        setNextPageUrl(res.data.products.next_page_url);
      })
      .catch((error) => {});
  }

  const loadData = async () => {
    let tokenn = await AsyncStorage.getItem("user");
    await setToken(tokenn);
    let countryy = await AsyncStorage.getItem("countrySlug");
      
    if(countryy !== undefined && countryy !== null) {
        setCountry(countryy)
        await callApi(countryy, tokenn)
      } else {
        let res = await Axios.get('https://bellefu.com/api/location/info')
        AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug).then(() => {
          AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2).then(() => {
            setCountry(res.location_info.country_slug)
            callApi(res.data.location_info.country_slug, tokenn)
          }) 
        })
      }
    }

   

  const nextData = () => {
    if (nextPageUrl === null) {
      return;
    } else {
      Axios.get(nextPageUrl, {
        headers: {
          Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((res) => {
        setProducts(res.data.products);
        setNextPageUrl(res.data.products.next_page_url);
        setProductsData(productsData.concat(...res.data.products.data));
      });
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      setRefreshing(false);
      loadData();
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View>
    <Header home={true} {...props} />
    {loading && (
        <View style={{height: '' + 100 + '%'}}>
            <Preloader />
        </View>
    )}
    
        <FlatList
         refreshControl={
          <RefreshControl
            progressBackgroundColor="#76BA1A"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
            data={productsData}
            onEndReached={nextData}
            initialNumToRender={15}
            keyExtractor={item => item.slug}
            onEndReachedThreshold={100}
            ListHeaderComponent={<LandingPageContet token={token} country={country} {...props}/>}
            renderItem={({item, index}) => (
                <ProductList data={productsData} nextPageUrl={nextPageUrl} token={token} {...props} country={country} item={item} key={item.slug} />
            )}
        />
    <ScrollView>
    </ScrollView>
    <Bottom home={true} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});




