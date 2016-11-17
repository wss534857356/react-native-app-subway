// UserQRCodePage.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,TouchableHighlight} from 'react-native'
import NavigationBar from 'react-native-navigationbar'
import QRCode from 'react-native-qrcode'
import BuyOrderPage from './BuyOrderPage'
class UserQRCodePage extends Component{
  constructor(props){
    super(props)
    this.state={
      code:0,
    }
  }
  componentDidMount(){
    try{
      this.timer=setInterval(
        ()=>this.fetchData(),
        2000
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
    let REQUEST_URL='http://119.29.40.41/subway/user/userStartStation.php?accessToken='+this.props.accessToken;
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        if(1==responseData.code){
          this.setState({
            code: responseData.code,
            startId: responseData.result.startId,
            startName: responseData.result.startName,
          });
        }else if(2==responseData.code){
          this.setState({
            code: responseData.code
          });
        }else if(3==responseData.code){
          this.setState({
            code: responseData.code,
            startId: responseData.result.startId,
            startName: responseData.result.startName,
            endId: responseData.result.endId,
            endName: responseData.result.endName,
          });
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  render(){
    let userType
    if(1==this.state.code){
      userType=(
        <View style={{height:80,flexDirection:'row'}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#00BCD4'}}>
            <Text style={{fontSize:18,color:'#FFF'}}>由{this.state.startName}进站</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:18}}>还未到站</Text>
          </View>
        </View>
      )
    }else if(2==this.state.code){
      userType=(
        <View style={{height:80}}>
          <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            <Text style={{fontSize:18}}>用户未进站</Text>
          </View>
        </View>
      )
    }else if(3==this.state.code){
      userType=(
        <View style={{flexDirection:'column',height:120,}}>
          <View style={{flexDirection:'row',flex:2}}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#00BCD4'}}>
              <Text style={{fontSize:18,color:'#FFF'}}>由{this.state.startName}进站</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#00BCD4'}}>
              <Text style={{fontSize:18,color:'#FFF'}}>已到达{this.state.endName}</Text>
            </View>
          </View>
          <View style={{flex:1}}>
            <TouchableHighlight 
              style={styles.submitStyle}
              underlayColor="#90caf9"
              onPress={() => {
               this.props.navigator.push({// 活动跳转，以Navigator为容器管理活动页面
                component: BuyOrderPage,
                params:{
                   siteBeginId:this.state.startId,
                   siteEndId:this.state.endId,
                   siteBeginName:this.state.startName,
                   siteEndName:this.state.endName,
                   ticketNum:1,
                   accessToken:this.props.accessToken,
                   status:2,
                 }
               })
              }}>
              <Text style={{fontSize:18}}>确认支付</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    let content=(
      <View style={styles.viewPageBackground}>
        <View style={styles.ticketBackgroud}>
          <View style={styles.QRPaperBackgroud}>
            <Text style={{fontSize:16,marginBottom:15}}>二维码凭证</Text>
            <QRCode
              value={this.props.accessToken}
              size={180}
              bgColor='black'
              fgColor='white'/>
          </View>
          {userType}
        </View>
      </View>
        )
    return(
      <View style={{flex:1}} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ='二维码进站'
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
      )
  }
}
var styles = StyleSheet.create({
  viewPageBackground:{
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#E0E0E0',
    flexDirection:'row',
  },
  ticketBackgroud:{
    margin:10,
    flex:1,
    backgroundColor:'#FFF',
    // width:320,
    height:360,
    elevation:2,
    borderRadius:4,
    flexDirection:'column',
  },
  QRPaperBackgroud:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFF',
    borderTopLeftRadius:4,
    borderTopRightRadius:4
  }, 
  submitStyle:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:"#FFF",
    flex:1,
    height:40,
    borderRadius:2,
    elevation:2,
    borderBottomLeftRadius:4,
    borderBottomRightRadius:4
  },
})
module.exports = UserQRCodePage