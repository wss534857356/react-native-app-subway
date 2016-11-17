// UserInfoPage.js
// userLogin.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,Navigator,TextInput,TouchableHighlight,ToastAndroid} from 'react-native'
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
  deleteAccessToken(){
    storage.remove({
      key: 'accessToken'
    });
    this.props.deleteAccessToken();
    this.props.navigator.pop()
  }
  render () {
    let content=( 
      <View style={{backgroundColor:'#f4f4f4',flex:1}}>
        <TouchableHighlight
          style={[styles.style_view_commit,{backgroundColor:'#F44336'}]}
          underlayColor="#727272"
          onPress={() => this.deleteAccessToken()}>
          <Text style={[styles.style_view_unlogin,{color:'#FFF'}]}>退出</Text>
        </TouchableHighlight>
      </View>
      );
    return(
      <View style={styles.container} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
        <NavigationBar title ='用户信息'
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