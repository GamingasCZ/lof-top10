#!/bin/bash

# make production folder
mkdir ../production
rsync -aq ../src/ ../production --exclude production --exclude tools

# remove unneccessary files
cd ../production
rm -rf github/

#minify js, bundle them, move to root and delete js folder
BUNDLE=$RANDOM
cd js
touch "bundle$BUNDLE.js"
uglifyjs languages.js -m >> "bundle$BUNDLE.js"
for f in $(ls -I "bundle$BUNDLE.js" -I "generator.js" -I "languages.js");
    do
        uglifyjs $f -m >> "bundle$BUNDLE.js";
    done;

uglifyjs generator.js -m >> "bundle$BUNDLE.js"

mv "bundle$BUNDLE.js" ../
cd ..
rm -rf js/

# remove unneccessary files in php folder
rm php/secretsTemplate.php
rm php/README.md

# minify css, make bundle and move to root folder (SKIPPED: not working properly for now)
: '
cd assets/
touch "bundle$BUNDLE.css"
for f in $(ls *.css);
    do
        css-minify -f $f >> "bundle$BUNDLE.css"
    done;

mv "bundle$BUNDLE.css" ../
rm *.css
'

# replace js and css links in html
awk "{gsub(\"<jsbundle>\",\"<script rel=\x22text/javascript\x22 src=\x22bundle$BUNDLE.js\x22 defer></script>\")}1" index.html > ok2.html && mv ok2.html index.html
#awk "{gsub(\"<cssbundle>\",\"<link rel=\x22stylesheet\x22 href=\x22bundle$BUNDLE.css\x22>\")}1" index.html > ok2.html && mv ok2.html index.html
