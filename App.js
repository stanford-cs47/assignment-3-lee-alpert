/*
*
* Assignment 3
* Starter Files
*
* CS47
* Oct, 2018
*/

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableHighlight, FlatList, ActivityIndicator, Keyboard, Linking} from 'react-native';
import { Images, Colors, Metrics } from './App/Themes'
import APIRequest from './App/Config/APIRequest'
import { Icon } from 'react-native-elements'

import News from './App/Components/News'
import Search from './App/Components/Search'

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class App extends React.Component {

  state = {
    loading: true,
    articles : [],
    searchText: '',
    category: ''
  }

  componentDidMount() {
    //uncomment this to run an API query!
    this.loadArticles();
  }

  async loadArticles(searchTerm = '', category = '') {
    this.setState({articles:[], loading: true});
    var resultArticles = [];
    if (category === '') {
      resultArticles = await APIRequest.requestSearchPosts(searchTerm);
    } else {
      resultArticles = await APIRequest.requestCategoryPosts(category);
    }
    console.log(resultArticles);
    this.setState({loading: false, articles: resultArticles})
  }

_handleTextChange = inputValue => {
    this.setState({ searchText: inputValue });
  };

_fetchResults = () => {
  this.loadArticles(this.state.searchText)
  this.setState({ searchText: "" });
}

getArticleContent = () => {
  const{articles, loading} = this.state;

  let contentDisplayed = null;

  if (loading) {
    contentDisplayed = <ActivityIndicator style = {[styles.flatListView]}/>;
  }

  else {
    contentDisplayed = <FlatList 
          data = {articles}
          renderItem={({ item }) => (
              <View>
                <TouchableHighlight onPress={() => Linking.openURL(item.url)}>
                  <View>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                  </View>
                </TouchableHighlight>
                <Text>{item.snippet}</Text>
                <Text style={styles.articleAuthor}>{item.byline}</Text>
                <Text style={styles.articleDate}>{item.date}</Text>
              </View>
            )}
          keyExtractor={item => item.url} 
          />
  }

  return ( 
    <View>
      {contentDisplayed}
    </View>
  )
}

  render() {
    const {articles, loading} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.logo]}>
          <Image
              style={{height: Metrics.images.logo, width: Metrics.screenWidth, resizeMode:'contain'}}
              source={Images.logo}
            />
        </View>

        <View style={{flexDirection:'row', width: Metrics.screenWidth, alignItems:'center', justifyContent:'center',}}>
          <View style={{flex: 2, width: Metrics.screenWidth, marginLeft: Metrics.screenWidth/20, marginRight: Metrics.screenWidth/20}}>
            <TextInput
              style={[styles.textInput]}
              placeholder="Search for News"
              onChangeText={(text) => this._handleTextChange(text)}
              value={this.state.searchText}
            />
          </View>
          <TouchableHighlight style={[styles.magnifyingGlass]} onPress = {()=>this._fetchResults()} underlayColor = 'transparent'>
            <View>
              <Icon name="search" size = {30} color = "#F02484" />
            </View>
          </TouchableHighlight>
        </View>

        <View style={[styles.flatListView]}>
          {this.getArticleContent()}
        </View>
        {/*And some news*/}

        {/*Though, you can style and organize these however you want! power to you 😎*/}

        {/*If you want to return custom stuff from the NYT API, checkout the APIRequest file!*/}

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    flexDirection:'row',
  },
  textInput: {
    height: Metrics.navBarHeight,
    width: Metrics.screenWidth - Metrics.screenWidth/10,
    backgroundColor: Colors.frost,
    borderRadius: 15,
    padding: 20, 
  },
  magnifyingGlass: {
    alignItems:'center',
    justifyContent:'center',
    flex: 1,
  },
  flatListView: {
    alignItems:'center',
    justifyContent:'center',
    flex: 4,
    flexDirection: 'row',
    padding: 25,
  },
  articleTitle: {
    fontSize: 30,
    marginTop: 20,
  },
  articleAuthor: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  articleDate: {
    color: Colors.charcoal,
  }
});
