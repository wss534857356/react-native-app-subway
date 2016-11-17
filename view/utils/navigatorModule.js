// navigatorModule.js
'use strict'
import React,{Component} from 'react'
import { View,Text, StyleSheet,TouchableHighlight,Image} from 'react-native'

let nativegatorView =React.createClass ({
  render(){
  let nativegatorModule=(
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.userView}>
        <Image 
        style={styles.headPhoto}
        source={require('./images/subway_launcher.png')}/>
      </View>
      <TouchableHighlight
      style={styles.drawerPageButton,{backgroundColor:'#FFF'}}
      underlayColor="#90caf9"
      onPress={() => {
        this.props.navigator.resetTo({
          component: TicketListPage,
        })
      }}>
        <Text>
          购买地铁票
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.drawerPageButton]}
        underlayColor="#90caf9"
        onPress={() => {
          this.props.navigator.resetTo({
            component: TicketListPage,
          })
        }}>
        <Text>
          购票记录
        </Text>
      </TouchableHighlight>
    </View>);
  return ({nativegatorModule})
    }
})
var styles=StyleSheet.create({
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
  drawerPageButton: {
    borderRadius: 5,
    backgroundColor: '#eeeeee',
    padding: 10,
  },
})
module.exports=nativegatorView