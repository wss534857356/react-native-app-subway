// StationListPage.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,ListView,TouchableHighlight } from 'react-native'
import NavigationBar from 'react-native-navigationbar'
import TimerFetch from './utils/TimerFetch'
// const OS = Platform.OS === 'ios'
var REQUEST_URL='http://119.29.40.41/subway/subway/subwayList.php';
// var REQUEST_URL='http://192.168.1.189/subway/subway/subwayList.php';
class StationListPage extends Component {
  constructor (props){
    super(props)
    this.state={
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 === row2,
      }),
      stationList:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 === row2,
      }),
      loaded:false,
      isError: true, 
      isRefreshing:false,
      Choose:"1号线"
    }
  }
  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.result),
          stationList:this.state.stationList.cloneWithRows(responseData.result[0].siteList),
          dataArray:responseData.result,
          loaded: true,
        });
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  componentDidMount(){
    try{
      this.timer=setTimeout(
        ()=>this.fetchData(),
        500
      );
    }catch(e){
      console.log(e);
    }
  }
  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
  }
  render () {
    let content=''
    // console.log(StationList);
    if (!this.state.loaded) {
      content=(
      <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor:'#e9e9e9'}}>
        <Text>
          Loading Station...
        </Text>
      </View>);
    } else {
      content=(
        <View style={[styles.container,{backgroundColor:'#e9e9e9',flexDirection:'row'}]}>
          <View style={{flex:1,}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderItem.bind(this)}/>
          </View>
          <View style={{flex:3,}}>
            <ListView
              dataSource={this.state.stationList}
              renderRow={this._siteItem.bind(this)}/>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ={this.props.title}
          backHidden={false}
          barTintColor='#00BCD4'
          barBottomColor='#00BCD4'
          titleTextColor='#FFF'
          backColor='#FFF'
          statusbarPadding={false}
          barBottomThickness={0.2}
          barStyle={{elevation:4}}
          backFunc={() => { 
            this.props.navigator.pop()
          }}>
        </NavigationBar>
        {content}
      </View>
      );
  }

  _renderItem (contentData, sectionID,rowId, highlightRow) {
    let backgroundColor='';
    let color='#212121';
    switch(contentData.routeName){
      case '1号线':
        backgroundColor="#03A9F4";
        break;
      case '2号线':
        backgroundColor='#B71C1C';
        break;
      case '3号线':
        backgroundColor='#00897B';
        break;
      case '10号线':
        backgroundColor='#FFE0B2';
        break;
      case 'S1号线':
        backgroundColor='#EF6C00';
        break;
      case 'S8号线':
        backgroundColor='#0288D1';
        break;
      default:backgroundColor='#fff';
    }
    let data=contentData
    let content=
    // contentData.routeName===this.state.Choose
    // ?(
    //   <View style={[styles.itemContainer,{backgroundColor:backgroundColor}]}>
    //     <Text style={[styles.routeName,{color:'#FFF'}]}>{contentData.routeName}</Text>
    //   </View>
    //   )
    // :
    (
      <TouchableHighlight
        onPress= {() => {
          this.setState({
            Choose:contentData.routeName,
            dataSource:this.state.dataSource.cloneWithRows(this.state.dataArray),
            stationList:new ListView.DataSource({rowHasChanged: (row1, row2) => row1 === row2,}).cloneWithRows(this.state.dataArray[rowId].siteList),
            // dataSource:this.state.dataSource.rowShouldUpdate(sectionID.sectionIndex,sectionID.rowIndex)
          })
        }}
        style={[styles.itemContainer,{backgroundColor:backgroundColor,}]}
        underlayColor="#727272">
          <Text style={[styles.routeName,contentData.routeName!==this.state.Choose?{color:color}:{color:'#FFF'}]}>{contentData.routeName}</Text>
      </TouchableHighlight>
      );
    return content;
  }
  _siteItem(contentData, sectionID,rowId, highlightRow){
    let content=
    // contentData.siteName===this.state.Choose
    // ?(
    //   <View style={[styles.itemContainer,{backgroundColor:backgroundColor}]}>
    //     <Text style={[styles.routeName,{color:'#FFF'}]}>{contentData.routeName}</Text>
    //   </View>
    //   )
    // :
    (
      <TouchableHighlight
        onPress= {() => {
          this.props.changeStart(contentData.siteId,contentData.siteName);
          this.props.navigator.pop();
        }}
        underlayColor="#727272"
        style={[styles.stationContainer,{backgroundColor:'#fff',}]}>
          <Text style={[styles.siteName]}>{contentData.siteName}</Text>
      </TouchableHighlight>
    );
    return content;
  }
}
var styles= StyleSheet.create({
  container: {
    flex:1,
  },
  itemContainer: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationContainer: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  routeName: {
    fontSize: 17,
    textAlign: 'center'
  },
  siteName: {
    fontSize: 17,
    textAlign: 'left',

  },
  siteNum: {// alignSelf 默认是center
    fontSize: 15,
    marginBottom: 10,
    marginRight: 35,
    marginLeft: 35,
    // letterSpacing: 10,//字间距
    lineHeight: 22, // 行距＋字高，0表示和字高一样，没效果
    color: '#727272',
    textAlign: 'center' // 字的对其方式：center每行都居中；left，right；auto ＝＝＝ justify ＝＝＝ left
  },
  one_station:{
    backgroundColor:'#03A9F4',
    color:'#FFFFFF',
  },
  two_station:{
    backgroundColor:'#03A9F4',
    color:'#FFFFFF',
  }
})
module.exports = StationListPage