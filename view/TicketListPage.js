// ticketListPage.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,ListView,TouchableHighlight  } from 'react-native'
import NavigationBar from 'react-native-navigationbar'
import OrderDetail from './OrderDetail'
class TicketListPage extends Component{
  constructor (props){
    super(props)
    this.state={
      ticketList:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 === row2,
      }),
      loaded:false
    }
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
  fetchData() {
    let REQUEST_URL='http://119.29.40.41/subway/ticket/ticketList.php?accessToken='+this.props.accessToken+'&purchaseTime=';
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          ticketList: this.state.ticketList.cloneWithRows(responseData.result),
          loaded: true,
        });
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  _renderItem (contentData, sectionID,rowId, highlightRow) {
    let status='已出票';
    {if(1==contentData.status)status='未出票';else status='已出票'}
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
          this.props.navigator.push({
            component: OrderDetail,
              params:{
                orderId:contentData.orderId,
                accessToken:this.props.accessToken
              }
            })
        }}
        underlayColor="#727272">
        <View style={{height:60,flex:1,flexDirection:'row',borderBottomWidth:1,borderColor:'#e9e9e9'}}>
          <View style={{flex:1,justifyContent:'center',marginLeft:10}}>
            <Text style={{fontSize:16,color:'#212121'}}>{contentData.siteBeginName} - {contentData.siteEndName}</Text>
            <Text style={{fontSize:13}}>{contentData.sheet}张 | {parseFloat(contentData.unitPrice).toFixed(2)}元</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
            <Text style={{fontSize:14,marginRight:10}}>{status}</Text>
            <Text style={{fontSize:14,marginRight:10}}>{contentData.purchaseTime.substr(0,10)}</Text>
          </View>
        </View>
      </TouchableHighlight>
      );
    return content;
  }
  render () {
    let content=(<Text></Text>);
    if(true==this.state.loaded){
      content=(
        <View style={{flex:1,backgroundColor:'#FFF'}}>
          <ListView
            dataSource={this.state.ticketList}
            renderRow={this._renderItem.bind(this)}/>
        </View>
      )
    }else {
      content=(
      <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor:'#e9e9e9'}}>
        <Text>
          获取购票记录
        </Text>
      </View>);
    }
    return (
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
       <NavigationBar title ='购票记录'
          backHidden={false}
          barTintColor='#00BCD4'
          barBottomColor='#00BCD4'
          titleTextColor='#FFF'
          backColor='#FFF'
          statusbarPadding={false}
          barStyle={{elevation:4}}
          backFunc={() => { 
            this.props.navigator.pop()
          }}>
        </NavigationBar>
        {content}
      </View>
      );
  }
  _showDrawer() {
    this.refs['drawer'].openDrawer();
    //this.setState({colorProps: {}});
  }
}
var styles=StyleSheet.create({
  container:{
    flex:1
  },
  userView:{
    backgroundColor: '#039be5',
    height:120,
    padding:20,
    // flex:1,
  },
  headPhoto:{
    width:40,
    height:40,
  },
  toolbar: {
    backgroundColor: '#00BCD4',
    height: 56,
    // elevation:num 代表android中的阴影高度
    elevation:4,
  },
  drawerPageButton: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
})
module.exports = TicketListPage