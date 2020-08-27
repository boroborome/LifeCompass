#!/usr/bin/env sh

cd "`dirname \"$0\"`/"
cd ..
PUBLISH_HOME=`pwd`

rm -rf web
cp -rf ../front-end/build web

cp ../back-end/build/libs/back-end-0.0.1-SNAPSHOT.jar life-compass.jar
