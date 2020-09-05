# Getting Started

## Requirement
- JDK 1.8
- node.js >= 10

## Structure

- backend

  The backend project is based on Springboot
- frontend
  
  The frontend project is based on vue 
- publish
   
  The publish project is used to organize backend and frontend together. You can run start.sh to start this project simply.

## How to build

```bash
./gradlew :publish:build
```

## FAQ

### Error: `gyp` failed with exit code: 1 gyp: binding.gyp not found
Reinstall node-gys
```bash
npm uninstall node-gyp -g
npm uninstall node-gyp
npm install node-gyp -g 
```

### Error: gyp: No Xcode or CLT version detected!
```bash
sudo rm -rf $(xcode-select -print-path)
xcode-select --install
```
