// OrderDetail.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,ListView,ScrollView} from 'react-native'
import NavigationBar from 'react-native-navigationbar'
import RequestUtils from './utils/RequestUtils'
import QRCode from 'react-native-qrcode'
class OrderDetail extends Component {
  constructor (props){
    super(props)
    this.state={
      orderId:0,
      loaded:false,
      purchaseTime:"",
      status:"未出票",
      fetchNum:0
    }
  }
  componentDidMount(){
    this.fetchData()
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
    var REQUEST_URL=
      "http://119.29.40.41/subway/ticket/getTicket.php?orderId="
      +this.props.orderId
      +"&accessToken="
      +this.props.accessToken;
    let fetchNum=this.state.fetchNum+1
    fetch(REQUEST_URL).then((response) => response.json())
      .then((responseData) => {
        let status
        let tkColor
        if(1==responseData.result.status){
          status='未出票'
          tkColor='#00BCD4'
        }else if(2==responseData.result.status){
          status='已出票'
          tkColor='#9e9e9e'
        }else if(3==responseData.result.status){
          status='已退票'
          tkColor='#9e9e9e'
        }
        this.setState({
          orderId:responseData.result.orderId,
          purchaseTime:responseData.result.purchaseTime,
          siteBeginName:responseData.result.siteBeginName,
          siteEndName:responseData.result.siteEndName,
          status:status,
          tkColor:tkColor,
          sheet:responseData.result.sheet,
          unitPrice:responseData.result.unitPrice,
          loaded: true,
          fetchNum:fetchNum
        });
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  render(){
    let btn=(<View style={{flex:1,justifyContent:'center'}}>
              <View style={{alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#FFF',borderRadius:2,height:28}}>
                <Text style={{color:'#FFF'}}>查看线路</Text>
              </View>
            </View>)
    let content=''
    if (!this.state.loaded) {
      content=(
      <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center',backgroundColor:'#e9e9e9'}}>
        <Text>
          获取订单信息
        </Text>
      </View>);
    } else {
      content=(
        <ScrollView style={{backgroundColor:'#e9e9e9',height:570}}>
          <View style={{height:400,backgroundColor:'#FFF',elevation:2}}>
            <View style={{height:150,backgroundColor:this.state.tkColor,flexDirection:'column'}}>
              <View style={{flex:2,padding:15,flexDirection:'row'}}>
                <View style={{flex:3,flexDirection:'column'}}>
                  <Text style={{fontSize:16,color:'#FFF'}}>南京地铁单程票兑换卷</Text>
                  <Text style={{fontSize:14,color:'#e0e0e0'}}>{this.state.siteBeginName} - {this.state.siteEndName}</Text>
                </View>
              </View>
              <View style={{flex:2,flexDirection:'row'}}>
                <View style={styles.boxLeft}>
                  <Text style={styles.toolTipsFont}>票面金额</Text>
                  <Text style={styles.textFont}>{parseFloat(this.state.unitPrice).toFixed(2)}</Text>
                </View>
                <View style={styles.boxRight}>
                  <Text style={styles.toolTipsFont}>张数</Text>
                  <Text style={styles.textFont}>{this.state.sheet}</Text>
                </View>
                <View style={styles.boxRight}>
                  <Text style={styles.toolTipsFont}>票务状态</Text>
                  <Text style={styles.textFont}>{this.state.status}</Text>
                  
                </View>
              </View>
              <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingTop:5,paddingBottom:5}}>
                <Text style={{color:'#e0e0e0'}}>购买日期 {this.state.purchaseTime}</Text>
              </View>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{fontSize:20,color:'#212121',margin:10}}>
                {this.state.orderId.substr(0,5)}&nbsp;
                {this.state.orderId.substr(5,3)}&nbsp;
                {this.state.orderId.substr(8,5)}
              </Text>
              <QRCode
                value={this.state.orderId}
                size={150}
                bgColor='black'
                fgColor='white'/>
              <Text style={{margin:15}}>兑换地铁票时请扫码或直接输入号码</Text>
            </View>
          </View>
          <View style={{height:170,flexDirection:'column'}}>
            <View style={{flex:1,paddingTop:15,paddingLeft:15}}>
              <Text style={{color:'#212121',fontSize:16}}>使用引导</Text>
            </View>
            <View style={{flex:3,borderTopWidth:1,borderBottomWidth:1,borderColor:'#e0e0e0',backgroundColor:'#FFF',marginBottom:20,paddingTop:15,paddingLeft:15,elevation:1 }}>
              <Text style={{fontSize:14}}>1.请至出发站点找到自助取票机</Text>
              <Text style={{fontSize:14}}>2.打开"购票记录"，找到购买的地铁票兑换券，对准自助取票机的扫描处扫码或直接输入二维码上方的取票码</Text>
              <Text style={{fontSize:14}}>3.拿到兑换的地铁票进站乘车</Text>
            </View>
          </View>
        </ScrollView>
      )
    }
     return (
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ='订单详情'
          backHidden={false}
          barTintColor='#00BCD4'
          barBottomColor='#00BCD4'
          titleTextColor='#FFF'
          backColor='#FFF'
          statusbarPadding={false}
          barBottomThickness={0.2}
          barStyle={{elevation:2}}
          backFunc={() => { 
            this.props.navigator.pop()
            this.componentWillUnmount()
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
  toolTipsFont:{
    fontSize:13,
    color:'#e0e0e0'
  },
  textFont:{
    fontSize:18,
    color:'#FFF'
  },
  boxLeft:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column'
  },
  boxRight:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    borderLeftWidth:1,
    borderColor:'#e0e0e0'
  }
})
module.exports = OrderDetail