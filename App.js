import React from 'react';
import {
  StyleSheet,
  View,
  PanResponder
} from 'react-native';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.translate = false;
    this.prevTranslateLocation = null;
    
    this.transformMatrix = MatrixMath.createIdentityMatrix();
    this.translateMatrix = MatrixMath.createIdentityMatrix();

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        return true;
      },
      onMoveShouldSetPanResponderCapture: () => {
        return true;
      },
      onPanResponderStart: event => {
        this.onPanResponderStart(event);
      },
      onPanResponderMove: event => {
        this.handleTranslate(event);
        this.handleScale(event);
      },
      onPanResponderEnd: event => {
        this.onPanResponderEnd(event);
      }
    });
  }

  onPanResponderStart(event) {
    if (event.nativeEvent.touches.length === 1) {
      this.enableTranslate(event);
    } else {
      this.disableTranslate();
    }
    if (event.nativeEvent.touches.length === 2) {
      this.enableScale(event);
    } else {
      this.disableScale();
    }
  }

  onPanResponderEnd(event) {
    if (event.nativeEvent.touches.length === 1) {
      this.enableTranslate(event);
    } else {
      this.disableTranslate();
    }
    if (event.nativeEvent.touches.length === 2) {
      this.enableScale(event);
    } else {
      this.disableScale();
    }
  }

  enableTranslate(event) {
    this.translate = true;
    const touch = event.nativeEvent.touches[0];
    this.prevTranslateLocation = { x: touch.pageX, y: touch.pageY };
  }

  disableTranslate() {
    this.translate = false;
    this.prevTranslateLocation = null;
  }

  enableScale() {
    
  }

  disableScale() {
    
  }

  handleTranslate(event) {
    if (!this.translate) {
      return;
    }
    const touch = event.nativeEvent.touches[0];
    
    const diffX = touch.pageX - this.prevTranslateLocation.x;
    const diffY = touch.pageY - this.prevTranslateLocation.y;

    const result = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate2dCommand(this.translateMatrix, diffX, diffY);
    MatrixMath.multiplyInto(result, this.translateMatrix, this.transformMatrix);

    this.transformMatrix = result;

    this.transformView.setNativeProps({ style: { transform: [ { matrix: this.transformMatrix } ] } });
    this.prevTranslateLocation = { x: touch.pageX, y: touch.pageY };
  }

  handleScale() {

  }

  render() {
    return (
      <View style={ styles.container } { ...this.panResponder.panHandlers }>
        <View style={ styles.box } ref={ it => this.transformView = it }>
          
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    backgroundColor: 'orange',
    width: 100,
    height: 100
  }
});

export default App;
