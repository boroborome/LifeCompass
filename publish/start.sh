#!/usr/bin/env sh

cd `dirname $0`
java -Xdock:icon=brain.png -Xdock:name="Life Compass" -jar life-compass.jar&
cd -
