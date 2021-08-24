#!/bin/bash
echo Building Project
npm run build
echo Deploying To Firebase
firebase deploy