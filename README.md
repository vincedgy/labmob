labmob
========

:sun:

App running under Ionic Framework <http://ionicframework.com/> 
using Google API and FireBase

The static side (www) is made of Inoic based on AngularJS and other features. 

Please check out here : <https://github.com/vincedgy/labmob>

# Installation

For more (simple) info : <http://ionicframework.com/getting-started/>

```

# Create the ionic project
$ npm install -g cordova ionic
$ ionic start labmob sidemenu
$ cd labmob
$ ionic plugin add org.apache.cordova.geolocation
$ ionic plugin add cordova-plugin-whitelist


# Here you can copy/paste the www dir into the brand new project and enjoy ! 

```

# /!\ Add cordova-plugin-whitelist config into labmob/config.xml
Use the following config snippet to be added in config.xml under labmob directory

```
    <access origin="*" />
    <allow-navigation href="http://*/*" />
    <allow-navigation href="https://*/*" />
    <allow-navigation href="data:*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <!-- Allow SMS links to open messaging app -->
    <allow-intent href="sms:*" />
    <!-- Allow tel: links to open the dialer -->
    <allow-intent href="tel:*" />
    <!-- Allow geo: links to open maps -->
    <allow-intent href="geo:*" />
```

# Other goodies

```
# Install android devices dependencies
$ ionic platform add android 

# Install appel devices dependencies
$ ionic platform add ios

# Build APK for android
$ ionic build android

# For local dev with chrome 
$ ionic serve

# With the device plugged on USB 
$ ionic run android 


## git :


Set proxy for http et https :

```
git config --global http.proxy "http://user:password@proxy:tcp"
git config --global https.proxy "http://user:password@proxy:tcp"
git config --global color.ui true
git config --global credential.helper wincred
```

Push the master release to github : 

It will need user/password interactive entry

```
git push --progress origin master --set-upstream
git push --progress origin master:master
```

## bower :

Create .bowerrc in static and add proxy settings as well

static/.bowerrc :

```
{
    "directory": "components",
    "analytics": false,
    "proxy" : "http://user:password@proxy:tcp",
    "https-proxy": "http://user:password@proxy:tcp"
}
```

# TODO

Many thing to do in this app

- [ ] Security 
  - [ ] Implement security modal form
  - [ ] Linked to external account validation (FB, Google)
  - [ ] Audit trail
  - [ ] Separate Admin page
- [ ] Implement drag&drop 
- [X] Animations during transitions
- [X] More modularity
