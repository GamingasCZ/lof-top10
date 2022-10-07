#!/bin/bash

# make production folder
mkdir ../production
rsync -aq ../ ../production --exclude production --exclude tools

# remove unneccessary files
cd ../production
rm -rf github/
rm LICENSE
rm README.md

#minify js, bundle them, move to root and delete js folder
BUNDLE=$RANDOM
cd js
touch "bundle$BUNDLE.js"
for f in $(ls -I "bundle$BUNDLE.js");
    do
        uglifyjs $f -m >> "bundle$BUNDLE.js";
    done;

mv "bundle$BUNDLE.js" ../
cd ..
rm -rf js/

# remove unneccessary files in php folder
rm php/secretsTemplate.php
rm php/README.md

# minify css, make bundle and move to root folder
cd assets/
touch "mid.css"
for f in $(ls *.css -I mid.css);
    do
        cat $f >> mid.css
    done;
tr -d '\n \t' < mid.css > "bundle$BUNDLE.css"
mv "bundle$BUNDLE.css" ../
rm *.css

# replace js and css links in html
cd ..
sed -i 's|.*.js\/.*||g' index.html
sed -i "s|<cssbundle>|<script rel='text/javascript' src='bundle$BUNDLE.js' defer></script>|" index.html

sed -i 's|.*.css\/.*||g' index.html
sed -i "s|<jsbundle>|<link rel='stylesheet' href='bundle$BUNDLE.css'>|" index.html
