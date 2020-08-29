#!/usr/bin/env sh

cd `dirname $0`
java -Xdock:icon=compass.png -Xdock:name="Life Compass" -jar life-compass.jar
#java -Xdock:icon=compass.png -Xdock:name="Life Compass" -jar life-compass.jar&
cd -
