import React from 'react';
import {
  StyleSheet,
  View,
  PanResponder
} from 'react-native';

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 100;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      containerWidth: null,
      containerHeight: null
    };

    this.isTranslating = false;
    this.prevTouchPageX = null;
    this.prevTouchPageY = null;

    this.centerX = null;
    this.centerY = null;

    this.isScaling = false;
    this.scale = 1;
    this.scalePrevDistance = null;

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
    this.isTranslating = true;
    const touch = event.nativeEvent.touches[0];
    this.prevTouchPageX = touch.pageX;
    this.prevTouchPageY = touch.pageY;
  }

  disableTranslate() {
    this.isTranslating = false;
    this.prevTouchPageX = null;
    this.prevTouchPageY = null;
  }

  enableScale(event) {
    this.isScaling = true;
    const touch1 = event.nativeEvent.touches[0];
    const touch2 = event.nativeEvent.touches[1];
    this.scalePrevDistance = this.dist(touch1, touch2);
  }

  disableScale() {
    this.isScaling = false;
    this.scalePrevDistance = null;
  }

  handleTranslate(event) {
    if (!this.isTranslating) {
      return;
    }

    const touch = event.nativeEvent.touches[0];

    const diffX = touch.pageX - this.prevTouchPageX;
    const diffY = touch.pageY - this.prevTouchPageY;

    this.centerX += diffX;
    this.centerY += diffY;

    this.transformView.setNativeProps(
      { style: { transform: [ { translateX: this.centerX }, { translateY: this.centerY }, { scale: this.scale } ] } }
    );

    this.prevTouchPageX = touch.pageX;
    this.prevTouchPageY = touch.pageY;
  }

  handleScale(event) {
    if (!this.isScaling) {
      return;
    }

    const touch1 = event.nativeEvent.touches[0];
    const touch2 = event.nativeEvent.touches[1];
    const dist = this.dist(touch1, touch2);
    const midX = (touch1.pageX + touch2.pageX) / 2;
    const midY = (touch1.pageY + touch2.pageY) / 2;
    const scaleFactor = dist / this.scalePrevDistance;

    const diffX = this.centerX - midX;
    const diffY = this.centerY - midY;

    this.centerX += diffX * scaleFactor - diffX;
    this.centerY += diffY * scaleFactor - diffY;
    this.scale *= scaleFactor;
    this.scalePrevDistance = dist;

    this.transformView.setNativeProps(
      { style: { transform: [ { translateX: this.centerX }, { translateY: this.centerY }, { scale: this.scale } ] } }
    );
  }

  dist(touch1, touch2) {
    return Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY
    );
  }

  render() {
    return (
      <View
        style={ styles.container } { ...this.panResponder.panHandlers }
        onLayout={
          event => {
            const width = event.nativeEvent.layout.width;
            const height = event.nativeEvent.layout.height;
            this.setState({
              containerWidth: width,
              containerHeight: height
            });
            this.centerX = VIEW_WIDTH / 2;
            this.y = VIEW_HEIGHT / 2;
          }
        }>
        <View
          style={ styles.box }
          ref={ it => this.transformView = it } />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  box: {
    backgroundColor: 'orange',
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT
  }
});

export default App;
