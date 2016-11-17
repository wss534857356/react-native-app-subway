// userLogin.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,TextInput,TouchableNativeFeedback,ToastAndroid} from 'react-native'
import NavigationBar from 'react-native-navigationbar'
var REQUEST_URL='http://119.29.40.41/subway/user/userLogin.php'
class UserLoginPage extends Component{
  constructor (props){
    super(props)
    this.state={
      userNumber:0,
      userPasswd:0
    }
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
    fetch(REQUEST_URL,{
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
            accessToken:responseData.result.accessToken
          });
          this.saveAccessToken(responseData.result.accessToken)
          if(this.state.accessToken){
            this.props.navigator.replace({
              component: UserInfoPage,
              params:{
                accessToken:this.state.accessToken
              }
            })
          }
        }else{
          this.setState({
            msg:responseData.result.msg
          });
        }
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  }
  render () {
    let content=( 
      <View style={{backgroundColor:'#f4f4f4',flex:1}}>
        <View style={{paddingTop:10,paddingLeft:10,}}>
          <Text style={{color:'#ef5350'}}>{this.state.msg}</Text>
        </View>
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
        <TouchableNativeFeedback
          onPress= {()=>this.fetchAccessToken()}
          background={TouchableNativeFeedback.Ripple('#727272', false)}>
          <View style={styles.style_view_commit}>
            <Text style="color: #fff">
              登录
            </Text>
          </View>
        </TouchableNativeFeedback>
        <View style={[styles.style_view_commit,{backgroundColor:'#FFF'}]}>
          <Text style={styles.style_view_unlogin}>注册</Text>
        </View>
      </View>
      );
    return(
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ='用户登入'
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
var styles= StyleSheet.create({
  container: {
    flex:1,
  },
  style_user_input:{ 
      backgroundColor:'#fff',
      marginTop:10,
      height:40,
      borderWidth:1,
      borderColor:'#e9e9e9',
      elevation:1,
  },
   style_pwd_input:{ 
      backgroundColor:'#fff',
      borderBottomWidth:1,
      borderColor:'#e9e9e9',
      height:40,
      elevation:2,
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
      elevation:2,
  },
  style_view_unlogin:{
    fontSize:12,
    color:'#63B8FF',
    marginLeft:10,
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
module.exports = UserLoginPage