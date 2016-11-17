/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict'
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, BackAndroid, Navigator, StatusBar, View } from 'react-native';
import HomePage from './view/HomePage'
import Storage from 'react-native-storage'
class Subway extends Component {
  constructor(props) {
    super(props);
    this.handleBack = this._handleBack.bind(this);
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
  }
  _handleBack() {
    var navigator = this.navigator;

    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    return false;
  }
  render() {
    var storage = new Storage({
      // 最大容量，默认值1000条数据循环存储
      size: 1000,

      // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
      defaultExpires: 1000 * 3600 * 24,

      // 读写时在内存中缓存数据。默认启用。
      enableCache: true,

      // 如果storage中没有相应数据，或数据已过期，
      // 则会调用相应的sync同步方法，无缝返回最新数据。
      sync : {
        // 同步方法的具体说明会在后文提到
      }
    })
    global.storage = storage
    return (
      <View style = {styles.container}>
        <StatusBar
          backgroundColor='#00ACC1'
          // translucent
          />
        <Navigator
          ref={component => this.navigator = component}
          initialRoute={{
            component: HomePage
          }}
          renderScene={(route, navigator) => { // 用来渲染navigator栈顶的route里的component页面
            // route={component: xxx, name: xxx, ...}， navigator.......route 用来在对应界面获取其他键值
            return <route.component navigator={navigator} {...route} {...route.params} {...route.passProps}/> // {...route.passProps}即就是把passProps里的键值对全部以给属性赋值的方式展开 如：test={10}
          } }/>
      </View>
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


AppRegistry.registerComponent('Subway', () => Subway);
