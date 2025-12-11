export default {
  expo: {
    name: "EXAMMBROW",
    slug: "EXAMMBROW",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true
    },

    android: {
      resizeMode: "native",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ],
      package: "com.anonymous.EXAMMBROW",

      // (ANTI SPLIT SCREEN)
      manifest: {
        application: {
          activity: [
            {
              "$": {
                "android:name": ".MainActivity",
                "android:resizeableActivity": "false",
                "android:supportsPictureInPicture": "false",
                "android:screenOrientation": "portrait"
              }
            }
          ]
        }
      }
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true
        }
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-barcode-scanner"
    ],

    experiments: {
      typedRoutes: true
    },

    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "234838a4-18e0-4bf6-90c3-8de1cfabb60f"
      }
    }
  }
};
