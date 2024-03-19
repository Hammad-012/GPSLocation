import { Dimensions, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Page = ({
  isLight,
  image,
  title,
  subtitle,
  width,
  height,
  containerStyles,
  imageContainerStyles,
  allowFontScaling,
  titleStyles,
  subTitleStyles,
}) => {
  let titleElement = title;
  if (typeof title === 'string' || title instanceof String) {
    titleElement = (
      <View style={styles.padding}>
        <Text allowFontScaling={allowFontScaling} style={[styles.title, isLight ? styles.titleLight : {}, titleStyles]}>
          {title}
        </Text>
      </View>
    );
  }

  let subtitleElement = subtitle;
  if (typeof subtitle === 'string' || subtitle instanceof String) {
    subtitleElement = (
      <View style={styles.padding}>
        <Text allowFontScaling={allowFontScaling} style={[styles.subtitle, isLight ? styles.subtitleLight : {}, subTitleStyles]}>
          {subtitle}
        </Text>
      </View>
    );
  }


  return (
    <View style={{justifyContent:"center", alignItems:"center", width:widthPercentageToDP(100)}}>
    {image}
      {titleElement}
      {subtitleElement}
    </View>
  );
};

Page.propTypes = {
  isLight: PropTypes.bool.isRequired,
  image: PropTypes.element.isRequired,
  containerStyles: PropTypes.shape({
    style: PropTypes.any,
  }),
  imageContainerStyles: PropTypes.shape({
    style: PropTypes.any,
  }),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  allowFontScaling: PropTypes.bool,
  titleStyles: PropTypes.shape({
    style: PropTypes.any,
  }),
  subTitleStyles: PropTypes.shape({
    style: PropTypes.any,
  }),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Page.defaultProps = {
  containerStyles: null,
  imageContainerStyles: null,
  allowFontScaling: true,
  titleStyles: null,
  subTitleStyles: null,
};

const { width, height } = Dimensions.get('window');
const potrait = height > width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width:20,
    justifyContent: potrait ? 'center' : 'flex-start',
    paddingTop: potrait ? 0 : 10,
  },
  imageContainer: {
    flex: 0,
    paddingBottom: potrait ? 60 : 100,
    alignItems: 'center',
    width: '100%',
  },
  padding: {
    paddingHorizontal: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    color: '#fff',
    paddingBottom: 15,
  },
  titleLight: {
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  subtitleLight: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default Page;
