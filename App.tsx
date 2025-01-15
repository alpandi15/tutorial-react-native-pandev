import React from 'react';
import {
  Dimensions,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { interpolate, runOnJS, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useScrollViewOffset } from 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');
const IMAGE_HEIGHT = 320;

function Page(): React.JSX.Element {
  const [barStyle, setBarStyle] = React.useState<StatusBarStyle | null | undefined>('light-content');
  const ref = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(ref);
  const insets = useSafeAreaInsets();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollOffset.value,
            [0, IMAGE_HEIGHT, IMAGE_HEIGHT * 2],
            [1, 1.5, 2],
            'clamp'
          ),
        },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: interpolate(
        scrollOffset.value,
        [0, IMAGE_HEIGHT - 32],
        [32, 0],
        'clamp'
      ),
      borderTopRightRadius: interpolate(
        scrollOffset.value,
        [0, IMAGE_HEIGHT - 32],
        [32, 0],
        'clamp'
      ),
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, IMAGE_HEIGHT],
        [0, 1],
        'clamp'
      ),
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event?.contentOffset?.y;
    },
  });

  // Calculate barStyle based on scrollOffset
  useDerivedValue(() => {
    const newBarStyle = scrollOffset.value > IMAGE_HEIGHT / 2 ? 'dark-content' : 'light-content';
    runOnJS(setBarStyle)(newBarStyle);
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={barStyle} />
      <Animated.View style={[
        headerAnimatedStyle,
        styles.header,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
        <View style={styles.headerContent}>
          <Text>Header</Text>
        </View>
      </Animated.View>
      <Animated.Image
        source={{uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
        style={[styles.image, imageAnimatedStyle]}
        resizeMode="cover"
      />
      <Animated.ScrollView
        ref={ref}
        scrollEventThrottle={16}
        style={styles.scroll}
        onScroll={scrollHandler}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View>
            <Text style={styles.title}>Sepatu Pria Warna Merah</Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  image: {
    width,
    height: IMAGE_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  content: {
    height: 1500,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    textAlign: 'center',
  },
  scroll: {
    backgroundColor: 'transparent',
    marginTop: -50,
    paddingTop: IMAGE_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    // height: 60,
    zIndex: 999,
  },
  headerContent: {
    height: 45,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
};

export default App;
