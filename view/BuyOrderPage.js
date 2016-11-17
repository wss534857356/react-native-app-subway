// BuyOrderPage.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,TouchableHighlight  } from 'react-native'
import NavigationBar from 'react-native-navigationbar'
import OrderDetail from './OrderDetail'
class BuyOrderPage extends Component {
  constructor (props){
    super(props)
    this.state={
      loaded:false,
      isConfirm:false,
      price:0
    }
  }
  fetchData() {
    var REQUEST_URL="http://119.29.40.41/subway/subway/ticketPrice.php?siteBeginId="+this.props.siteBeginId+"&siteEndId="+this.props.siteEndId;
    fetch(REQUEST_URL).then((response) => response.json())
      .then((responseData) => {
        this.setState({
          price:responseData.result.price,
          loaded: true,
        });
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  fetchOonfirmOrder() {
    let status
    if(this.props.status!=2)
      status=1
    else
      status=this.props.status
    let REQUEST_URL=
      "http://119.29.40.41/subway/subway/ticketPurchase.php?siteBeginId="
      +this.props.siteBeginId
      +"&siteEndId="
      +this.props.siteEndId
      +"&unitPrice="
      +this.state.price
      +"&sheet="
      +this.props.ticketNum
      +"&accessToken="
      +this.props.accessToken
      +"&status="
      +status;
      fetch(REQUEST_URL).then((response) => response.json())
      .then((responseData) => {
        if(1==responseData.code){
          this.setState({
            result:responseData.code,
            orderId:responseData.result.orderId,
            isConfirm:true,
          });
          var _me=this;
          this.props.navigator.replace({// 活动跳转，以Navigator为容器管理活动页面
            component: OrderDetail,
            params:{
              orderId:this.state.orderId,
              accessToken:this.props.accessToken
            }
          });
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  render () {
    let content=''
    if (!this.state.loaded) {
      this.fetchData();
      content=(
      <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor:'#e9e9e9'}}>
        <Text>
          获取订单信息
        </Text>
      </View>);
    } else {
      content=(
        <View style={[styles.container,{backgroundColor:'#e9e9e9',flexDirection:'column'}]}>
          <View style={[styles.fiche,{flexDirection:'column'}]}>
            <View style={styles.ficheTop}>
              <View style={styles.ficheTopWithin}>
                <Text style={styles.labelTextStyle}>出发站</Text>
              </View>
              <View style={styles.ficheData}>
                <Text style={styles.textStyle}>{this.props.siteBeginName}</Text>
              </View>
            </View>
            <View style={styles.ficheBottom}>
              <View style={styles.ficheBottomWithin}>
                <Text style={styles.labelTextStyle}>到达站</Text>
              </View>
              <View style={styles.ficheData}>
                <Text style={styles.textStyle}>{this.props.siteEndName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.fiche}>
            <View style={styles.ficheTop}>
              <View style={styles.ficheTopWithin}>
                <Text style={styles.labelTextStyle}>票价</Text>
              </View>
              <View style={styles.ficheData}>
                <Text style={styles.textStyle}>{this.state.price}元</Text>
              </View>
            </View>
            <View style={styles.ficheBottom}>
              <View style={styles.ficheBottomWithin}>
                <Text style={styles.labelTextStyle}>张数</Text>
              </View>
              <View style={styles.ficheData}>
                <Text style={styles.textStyle}>{this.props.ticketNum}张</Text>
              </View>
            </View>
          </View>
          <View style={[styles.fiche,{flex:1}]}>
            <View style={styles.ficheTop}>
              <View style={styles.ficheTopWithin}>
                <Text style={styles.labelTextStyle}>应付金额</Text>
              </View>
              <View style={styles.ficheData}>
                <Text style={styles.textStyle}>{this.state.price*this.props.ticketNum}元</Text>
              </View>
            </View>
          </View> 
          <View style={{flex:1,paddingLeft:10,paddingRight:10,paddingTop:15}}>
            <View style={{flex:1,alignItems: 'center',flexDirection:'row'}}>
            <TouchableHighlight 
              style={styles.submitStyle}
              underlayColor="#90caf9"
              onPress={() => {
                // this.props.navigator.pop();
                this.fetchOonfirmOrder();
              }}>
                  <Text style={{fontSize:18,color:'#FFF'}}>确认支付</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{flex:3}}>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ='确认订单'
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
}
var styles= StyleSheet.create({
  container: {
    flex:1,
  },
  fiche:{
    borderColor:'#9e9e9e',
    flex:2,
    marginTop:15,
    backgroundColor:'#FFF',
    elevation:2,
  },
  ficheTop:{
    flex:1,
    flexDirection:'row'
  },
  ficheTopWithin:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    marginLeft:15
  },
  ficheBottom:{
    flex:1,
    flexDirection:'row',
    borderTopWidth:1,
    borderColor:'#9e9e9e',
    marginLeft:15
  },
  ficheBottomWithin:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  ficheData:{
    flex:3,
    justifyContent:'center'
  },
  labelTextStyle:{
    fontSize:18
  },
  textStyle:{
    fontSize:18,
    color:'#212121'
  },
  submitStyle:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:"#00BCD4",
    flex:1,
    height:40,
    borderRadius:2,
    elevation:2,
  },
})
module.exports = BuyOrderPage