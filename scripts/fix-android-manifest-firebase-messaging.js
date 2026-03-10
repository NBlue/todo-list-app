#!/usr/bin/env node
/* eslint-env node */
/* global __dirname */
/**
 * Fix Android manifest-merger conflicts between app meta-data and
 * @react-native-firebase/messaging by adding tools:replace to the app's
 * meta-data entries.
 *
 * Intended usage: run AFTER `expo prebuild --clean` and BEFORE `expo run:android`.
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

const manifestPaths = [
  path.join(projectRoot, "android/app/src/main/AndroidManifest.xml"),
  path.join(projectRoot, "android/app/src/debug/AndroidManifest.xml"),
];

function ensureToolsNamespace(xml) {
  if (xml.includes('xmlns:tools="http://schemas.android.com/tools"')) return xml;
  return xml.replace(
    /<manifest\b([^>]*?)>/,
    '<manifest$1 xmlns:tools="http://schemas.android.com/tools">'
  );
}

function addToolsReplaceToMetaData(xml, androidName, toolsReplaceValue) {
  // Match <meta-data ... android:name="X" ... />
  const re = new RegExp(
    String.raw`<meta-data\b([^>]*\bandroid:name="${androidName}"[^>]*)\/>`,
    "g"
  );

  return xml.replace(re, (full, attrs) => {
    if (/\btools:replace\s*=/.test(full)) return full; // already patched
    return `<meta-data${attrs} tools:replace="${toolsReplaceValue}" />`;
  });
}

function patchManifest(xml) {
  let out = ensureToolsNamespace(xml);
  out = addToolsReplaceToMetaData(
    out,
    "com.google.firebase.messaging.default_notification_channel_id",
    "android:value"
  );
  out = addToolsReplaceToMetaData(
    out,
    "com.google.firebase.messaging.default_notification_color",
    "android:resource"
  );
  return out;
}

let touched = 0;
for (const p of manifestPaths) {
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, "utf8");
  const after = patchManifest(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    touched += 1;
    process.stdout.write(`Patched: ${path.relative(projectRoot, p)}\n`);
  } else {
    process.stdout.write(`No changes: ${path.relative(projectRoot, p)}\n`);
  }
}

if (touched === 0) {
  process.stdout.write(
    "Done. (Nothing to patch — manifests missing or already patched.)\n"
  );
}
