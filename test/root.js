global.expect = require("expect");

const babel = require("@babel/core");
const { JSDOM } = require("jsdom");
const path = require("path");

before(function (done) {
  const babelResult = babel.transformFileSync(
    path.resolve(__dirname, "..", "index.js"),
    {
      presets: ["@babel/preset-env"],
    }
  );

  const html = path.resolve(__dirname, "..", "index.html");

  const jsdomConfig = {
    resources: "usable",
    runScripts: "dangerously",
  };

  JSDOM.fromFile(html, jsdomConfig)
    .then((jsdom) => {
      const { window } = jsdom;
      global.window = window;
      global.document = window.document;
      global.navigator = window.navigator;
      global.console = window.console;
      global.getComputedStyle = window.getComputedStyle;

      // Babel transpile and run in the context of JSDOM
      const script = window.document.createElement("script");
      script.textContent = babelResult.code;
      window.document.head.appendChild(script);
    })
    .then(done)
    .catch((error) => {
      console.error("JSDOM Error:", error);
      done(error);
    });
});
