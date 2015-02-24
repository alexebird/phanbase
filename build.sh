#!/bin/bash

OUT="${1:-out}"
IN='.'

mkdir -p "./${OUT}"

cp -r "${IN}/icons" "${OUT}"
cp -r "${IN}/javascript" "${OUT}"
cat "${IN}/manifest.json" | sed '/secrets/d' > "${OUT}/manifest.json"
cp -r "${IN}/styles.css" "${OUT}"
cat "${IN}/secrets.js" > "${OUT}/javascript/bg.js.tmp"
cat "${IN}/secrets.js" "${IN}/javascript/bg.js" > "${OUT}/javascript/bg.js.tmp"
mv "${OUT}/javascript/bg.js.tmp" "${OUT}/javascript/bg.js"
find "${OUT}" -name '.DS_Store' | xargs rm -fv
zip -r phishtracks-buddy.zip "${OUT}"
