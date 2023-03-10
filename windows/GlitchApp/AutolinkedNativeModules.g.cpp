// AutolinkedNativeModules.g.cpp contents generated by "react-native autolink-windows"
// clang-format off
#include "pch.h"
#include "AutolinkedNativeModules.g.h"

// Includes from react-native-document-picker
#include <winrt/ReactNativeDocumentPicker.h>

// Includes from react-native-fs
#include <winrt/RNFS.h>

namespace winrt::Microsoft::ReactNative
{

void RegisterAutolinkedNativeModulePackages(winrt::Windows::Foundation::Collections::IVector<winrt::Microsoft::ReactNative::IReactPackageProvider> const& packageProviders)
{ 
    // IReactPackageProviders from react-native-document-picker
    packageProviders.Append(winrt::ReactNativeDocumentPicker::ReactPackageProvider());
    // IReactPackageProviders from react-native-fs
    packageProviders.Append(winrt::RNFS::ReactPackageProvider());
}

}
