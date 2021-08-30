#!/bin/bash
echo Building Project

npm run build

if [ $1 = "-p" ]
then
  echo Deploying To Firebase Preview Channel $2
  firebase hosting:channel:deploy $2
fi

if [ $1 = "-m" ]
then
  echo Deploying To Firebase Main Channel
  firebase deploy
fi


while [ true ] ; do
read -t 3 -n 1
if [ $? = 0 ] ; then
exit ;
else
echo "waiting for the keypress"
fi
done