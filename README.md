# Getting Started

## Requirement
- JDK 1.8
- node.js >= 6

## Structure

- backend

  The backend project is based Springboot
- frontend
  
  The frontend project is based vue 
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

