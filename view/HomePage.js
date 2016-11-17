'use strict'
import React, { Component } from 'react'
import { 
  View,
  Animated,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  Text,
  Navigator,
  StyleSheet,
  AsyncStorage,
  TextInput,
  ToastAndroid
} from 'react-native'
import StationListPage from './StationListPage'
import BuyOrderPage from './BuyOrderPage'
import TicketListPage from './TicketListPage'
import UserQRCodePage from './UserQRCodePage'
import UserInfoPage from './UserInfoPage'
import UserRegister from './UserRegister'
var LOGIN_URL='http://119.29.40.41/subway/user/userLogin.php'
class HomePage extends Component {
  constructor (...args) {
    super(...args)
    this.state = ({
      isError: false,
      isLoading: false,
      isPlaying: true,
      fadeAnimLogo: new Animated.Value(0), // 设置动画初始值，生成Value对象
      fadeAnimText0: new Animated.Value(0),
      fadeAnimText1: new Animated.Value(0),
      fadeAnimLayout: new Animated.Value(1),
      startId:0,
      startName:'请选择',
      endId:0,
      endName:'请选择',
      ticketNum:1
    })
  }
  saveAccessToken(accessToken){
    storage.save({
      key: 'accessToken',  //注意:请不要在key中使用_下划线符号!
      rawData: { 
        accessToken: accessToken
      },
      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      expires: null
    });
  }
  updateUserNumber(text) {
    this.setState((state) => {
      return {
        userNumber: text,
        msg:''
      };
    });
  }
  updateUserPasswd(password) {
    this.setState((state) => {
      return {
        userPasswd: password,
        msg:''
      };
    });
  }
  fetchAccessToken(){
    fetch(LOGIN_URL,{
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:"userNumber="+this.state.userNumber+"&userPassword="+this.state.userPasswd
    })
      .then((response) => response.json())
      .then((responseData) => {
        if(1==responseData.code){
          this.setState({
            accessToken:responseData.result.accessToken,
            userNumber:'',
            userPasswd:''
          });
          this.saveAccessToken(responseData.result.accessToken)
          ToastAndroid.show('登入成功!',ToastAndroid.SHORT)
        }else{
          ToastAndroid.show('账号或密码错误',ToastAndroid.SHORT)
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  loadAccessToken(){
    storage.load({
      key: 'accessToken',

      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
      autoSync: false,

      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用同步方法的同时先返回已经过期的数据。
      // 设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
      syncInBackground: true
    }).then(ret => {
      //如果找到数据，则在then方法中返回
      console.log(ret.accessToken);
      this.setState({
        accessToken:ret.accessToken,
      });
    }).catch(err => {
      //如果没有找到数据且没有同步方法，
      //或者有其他异常，则在catch中返回
      console.warn(err);
    })
  }
  async componentDidMount () {
    let timing = Animated.timing
    this.loadAccessToken();
    Animated.sequence([
      timing(this.state.fadeAnimLogo, {
        toValue: 1,
        duration: 800
      }),
      timing(this.state.fadeAnimText0, {
        toValue: 1,
        duration: 800
      }),
      timing(this.state.fadeAnimText1, {
        toValue: 1,
        duration: 800
      })
    ]).start(async() => {
      this.setState({
        isPlaying: false
      })

      setTimeout(() => this._hideWelcome(), 0)
    })
    setTimeout(() => this._hideWelcome(), 0)
  }
  ticketModel(num){
    let model=
    (num===this.state.ticketNum)
    ?(
      <View style={[styles.selectButton,{backgroundColor:'#e9e9e9'}]} >
        <Text>{num}张</Text>
      </View>
      )
    :(
      <TouchableHighlight 
        style={styles.selectButton} 
        onPress={() => {
          this.setState({
            ticketNum:num,
          })
        }}
        underlayColor='#e9e9e9'>
      <Text>{num}张</Text>
      </TouchableHighlight>
    );
    return model;

  }
  _hideWelcome () {
    if (this.state.isLoading || this.state.isPlaying) {
      return
    }

    Animated.timing(
      this.state.fadeAnimLayout,
      {
        toValue: 0,
        duration: 1000
      }).start(() => {
        this.setState({
          welcomeEnd: true
        })
      })
  }

  render () {
    
    let content
    let purchaseBtn
      // let homePageContent = this.contentDataGroup[0].results
    let UserLoginPage=(
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <View style={{backgroundColor:'#f4f4f4',flex:1,flexDirection:'column'}}>
        <Text>{this.state.accessToken}</Text>
          <View style={{alignItems:'center',flex:1,justifyContent:'center',marginTop:10}}>
            <Image
              source={require('./images/subway_launcher.png')}
            />
          </View>
          <View style={{flex:1}}>
            <View style={styles.style_user_input}>
              <TextInput 
                autofocus="{true}" 
                numberoflines="{1}"
                placeholder="账号/手机号" 
                underlinecolorandroid="{'transparent'}" 
                style={{textAlign:"center",textAlignVertical:'top'}}
                onChange={(event) => this.updateUserNumber(event.nativeEvent.text)}/>
            </View>
            <View style={styles.style_pwd_input}>
              <TextInput 
                numberoflines="{1}" 
                placeholder="密码" 
                securetextentry="{true}" 
                password={true}
                underlinecolorandroid="{'transparent'}" 
                style={{textAlign:"center",textAlignVertical:'top'}}
                onChange={(event) => this.updateUserPasswd(event.nativeEvent.text)} />
            </View>
            <TouchableHighlight
              onPress= {()=>this.fetchAccessToken()}
              underlayColor="#727272"
              style={styles.style_view_commit}>
                <Text style="color: #fff">
                  登录
                </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.style_view_commit,{backgroundColor:'#FFF'}]}
              underlayColor="#727272"
              onPress={() => {
                  this.props.navigator.push({
                    component: UserRegister,
                  })
              }}>
              <Text style={styles.style_view_unlogin}>注册</Text>
            </TouchableHighlight>
          </View>
          <View style={{flex:2}}></View>
        </View>
      </View>)
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
      
        <View style={styles.userView}>
          <Image 
            style={styles.headPhoto}
            source={require('./images/subway_launcher.png')}
          />
        </View>
        <TouchableHighlight
          style={styles.drawerPageButton}
          underlayColor="#90caf9"
          onPress={() => {
            this.props.navigator.popToTop()
          }}>
          <Text>
            购买地铁票
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.drawerPageButton,{backgroundColor:'#FFF'}]}
          underlayColor="#90caf9"
          onPress={() => {
            this.props.navigator.push({
              component: TicketListPage,
              params:{
                accessToken:this.state.accessToken
              }
            })
            this._unShowDrawer()
          }}>
          <Text>
            购票记录
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.drawerPageButton,{backgroundColor:'#FFF'}]}
          underlayColor="#90caf9"
          onPress={() => {
            if(this.state.accessToken){
              this.props.navigator.push({
                component: UserQRCodePage,
                params:{
                  accessToken:this.state.accessToken
                }
              })
            }else{
              this.props.navigator.push({
                component: UserLoginPage,
              })
            }
            this._unShowDrawer()
          }}>
          <Text>
            二维码进站
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.drawerPageButton,{backgroundColor:'#FFF'}]}
          underlayColor="#90caf9"
          onPress={() => {
              var _me=this;
              this.props.navigator.push({
                component: UserInfoPage,
                params:{
                  deleteAccessToken:function (){
                    _me.setState({
                      accessToken:'',
                    })
                  }
                }
              })
            this._unShowDrawer()
          }}>
          <Text>
            用户信息
          </Text>
        </TouchableHighlight>
        
      </View>);
    // let DRAWER_REF = 'drawer';
    if(0!=this.state.startId&&0!=this.state.endId){
      purchaseBtn=(
        <TouchableHighlight
        style={styles.submitStyle}
        underlayColor="#90caf9"
        onPress={() => {
          var _me=this;
          this.props.navigator.push({// 活动跳转，以Navigator为容器管理活动页面
            component: BuyOrderPage,
            params:{
               siteBeginId:this.state.startId,
               siteEndId:this.state.endId,
               siteBeginName:this.state.startName,
               siteEndName:this.state.endName,
               ticketNum:this.state.ticketNum,
               accessToken:this.state.accessToken
             }
           })
        }}>
          <Text style={{fontSize:16,color:'#FFF'}}>购买</Text>
        </TouchableHighlight>
      )
    }else{
      purchaseBtn=(
        <View style={styles.unSubmitStyle} >
          <Text style={{fontSize:16,color:'#FFF'}}>购买</Text>
        </View>
      )
    }
    if(this.state.accessToken){
      content = (
        <View style = {styles.container}>
          <DrawerLayoutAndroid
            ref={'drawer'}
            // top={20}
            drawerWidth={260}
            keyboardDismissMode='on-drag'
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
            <ToolbarAndroid
              // navIcon={require('./ic_menu_black_24dp')}
              navIcon={require('./images/menu_black.png')}
              onIconClicked={()=>{this._showDrawer();}}
              titleColor='#FFF'
              title="南京地铁" 
              style={styles.toolbar} />
          <View style={styles.viewPageBackground}>
            <View style={styles.ticketBackgroud}>
              <View style={{flexDirection:'row',flex:2,paddingLeft:20,paddingRight:20,}}>
                <View style={styles.ticketStationView}>
                  <Text style={[styles.ticketStationTitle,{textAlign:'left'}]}>出发站</Text>
                  <TouchableWithoutFeedback 
                    onPress={() => {
                      var _me=this;
                      this.props.navigator.push({// 活动跳转，以Navigator为容器管理活动页面
                        component: StationListPage,
                        title: '起始站点',
                        params:{
                          changeStart:function (stationId,startName){
                            _me.setState({
                              startId:stationId,
                              startName:startName
                            })
                          },
                        }
                      })
                    }}>
                    <View>
                      <Text style={[styles.ticketStationInfo,{textAlign:'left'}]}>{this.state.startName}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.ticketStationView}>
                  <Text style={[styles.ticketStationTitle,{textAlign:'center'}]}> </Text>
                  <Text style={[styles.ticketStationInfo,{textAlign:'center'}]}>>></Text>
                </View>
                <View style={styles.ticketStationView}>
                  <Text style={[styles.ticketStationTitle,{textAlign:'right'}]}>到达站</Text>
                  <TouchableWithoutFeedback 
                    onPress={() => {
                      var _me=this;
                      this.props.navigator.push({// 活动跳转，以Navigator为容器管理活动页面
                        component: StationListPage,
                        title: '起始站点',
                        params:{
                          changeStart:function (stationId,startName){
                            _me.setState({
                              endId:stationId,
                              endName:startName
                            })
                          },
                        }
                      })
                    }}>
                    <View>
                      <Text style={[styles.ticketStationInfo,{textAlign:'right'}]}>{this.state.endName}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <Image source={require('./images/cut.png')}/>
              <View style={{flex:3,justifyContent: 'center',}}>
                <View style={{flexDirection:'column',paddingLeft:20,paddingRight:20}}>
                  <View style={{flexDirection:'row',flex:2,marginBottom:15}}>
                    <View style={{flex:1,justifyContent:'center'}}> 
                      <Text style={{fontSize:16,color:'black'}}>张数</Text>
                    </View>
                    <View style={{flexDirection:'column',flex:7}}>
                      <View style={{flexDirection:'row',flex:1}}>
                        {this.ticketModel(1)}
                        {this.ticketModel(2)}
                        {this.ticketModel(3)}
                        {this.ticketModel(4)}
                      </View>
                      <View style={{flexDirection:'row',flex:1}}>
                        {this.ticketModel(5)}
                        {this.ticketModel(6)}
                        {this.ticketModel(7)}
                        {this.ticketModel(8)}
                      </View>
                    </View>
                  </View>
                  <View style={{flex:1,alignItems: 'center',flexDirection:'row'}}>
                    {purchaseBtn}
                  </View>
                </View>
              </View>
            </View>
          </View>
          </DrawerLayoutAndroid>
        </View>
      )
    }else {
      content=UserLoginPage
    }

    return (
      <View style={styles.content} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid >
        {content}
        {this._welcome()}
      </View>
      )
  }
  _unShowDrawer(){
    this.refs['drawer'].closeDrawer();
  }
  _showDrawer() {
    this.refs['drawer'].openDrawer();
    //this.setState({colorProps: {}});
  }
  _welcome () {
    if (this.state.welcomeEnd) {
      return null
    }
    let snackBar = this.state.isError
    ? (<SnackBar/>)
    : null

    return (
      <Animated.View style={[styles.indicatorWrapper, {
        opacity: this.state.fadeAnimLayout
      }]}>
        <Animated.View
          style={{
            opacity: this.state.fadeAnimLogo, // Binds directly
            marginTop: 220,
            alignItems: 'center',
            transform: [{
              translateY: this.state.fadeAnimLogo.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]  // 0 : 150, 0.5 : 75, 1 : 0
              })
            }]
          }}>
          <Image source={require('./images/subway_launcher.png')} style={{width: 100, height: 100}}/>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.state.fadeAnimText0,
            position: 'absolute',
            bottom: 70,
            left: 25,
            transform: [{
              translateY: this.state.fadeAnimText0.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10]
              })
            }]
          }}>
          <Text style={styles.footerText}>网络地铁自助取票系统</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.state.fadeAnimText1,
            position: 'absolute',
            bottom: 50,
            left: 25,
            transform: [{
              translateY: this.state.fadeAnimText1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10]
              })
            }]
          }}>
          <Text style={styles.footerText}>南京地铁</Text>
        </Animated.View>
        {snackBar}
      </Animated.View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    // 主页的颜色及样式
    backgroundColor: '#F5F5F5',
    flex: 1
  },
  indicatorWrapper: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#F5F5F5'
  },
  footerText: {
    color: '#263238',
    fontSize: 15
  },
  drawerPageButton: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  toolbar: {
    backgroundColor: '#00BCD4',
    height: 56,
    // elevation:num 代表android中的阴影高度
    elevation:4,
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
  ticketStationView:{
    flex:1,
    justifyContent: 'center',
  },
  ticketStationTitle:{
    fontSize:12,
    color:'#757575',
  },
  ticketStationInfo:{
    fontSize:24,
    color:'#000000'
  },
  submitStyle:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:"#00BCD4",
    flex:1,
    height:36,
    borderRadius:2,
    elevation:1,
  },
  unSubmitStyle:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:"#9e9e9e",
    flex:1,
    height:36,
    borderRadius:2,
    elevation:1,
  },
  selectButton:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderColor:"#9e9e9e",
    // width:30,
    height:30,
    borderRadius:2,
    borderWidth:1,
    margin:5,
  },
    style_user_input:{ 
      backgroundColor:'#fff',
      marginTop:10,
      height:40,
      borderWidth:1,
      borderColor:'#e9e9e9',
      elevation:0,
  },
   style_pwd_input:{ 
      backgroundColor:'#fff',
      borderBottomWidth:1,
      borderColor:'#e9e9e9',
      height:40,
      elevation:1,
  },
   style_view_commit:{ 
      marginTop:15,
      marginLeft:10,
      marginRight:10,
      backgroundColor:'#63B8FF',
      height:35,
      borderRadius:5,
      justifyContent: 'center',
      alignItems: 'center',
      elevation:1,
  },
  style_view_unlogin:{
    color:'#63B8FF',
  },
  style_view_register:{
    fontSize:12,
    color:'#63B8FF',
    marginRight:10,
    alignItems:'flex-end',
    flex:1,
    flexDirection:'row',
    textAlign:'right',
  }
})

module.exports = HomePage
