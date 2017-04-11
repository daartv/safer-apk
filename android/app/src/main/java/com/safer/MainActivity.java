package com.safer;

import com.facebook.react.ReactActivity;

import com.surialabs.rn.geofencing.GeoFencingPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "safer";
    }
        protected List<ReactPackage> getPackages() {
        	return Arrays.<ReactPackage>asList(
            	new MainReactPackage(),
            	new GeoFencingPackage()
         );
}
