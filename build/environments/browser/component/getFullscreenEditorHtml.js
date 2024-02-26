/**
 * NB: you need to have the node_modules/monaco-editor in your public folder for this
 *
 * NB: useful vscode plugin: es6-string-html
 *
 * NB: since this thing takes 100% of all size, it's best to put it in an iframe
 *
 * TODO: to get type support, read tip at the bottom here: https://gist.github.com/RoboPhred/f767bea5cbc972e04155a625dc11da11
 */
export const getFullscreenEditorHtml = () => {
    return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
      <style type="text/css">
          html,
          body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: hidden;
              background-color: transparent;
          }
  
          @media (prefers-color-scheme: dark) {
  
              body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  background-color: #1e1e1e;
              }
          }
      </style>
  </head>
  
  <body>
      <button id="save" style="display:none" onclick="saveContents().then(result=>result && alert(result))">save</button>
      <div id="monacodo" style="width: 100%; height: 100%"></div>
      <script src="monaco-editor/min/vs/loader.js"></script>
      <script>
  
  
          window.onkeydown = function (e) {
              const saveShortcut = e.metaKey && e.key === "s";
              if (saveShortcut) {
                  e.preventDefault();
                  saveContents().then(result => result && alert(result));
                  return;
              }
  
              // console.log("wow, other onkeydown",parent.document)
              // NB: all other events need to bubble up. but this doesn't work!
              // parent.document.dispatchEvent(e)
          };
  
  
  
  
          require.config({ paths: { vs: 'monaco-editor/min/vs' } });
  
          const monacoPromise = new Promise((resolve) =>
              require(["vs/editor/editor.main"], function () {
                  resolve(monaco);
              })
          );
  
          const loadCode = () => {
              const code = window.localStorage.getItem("code")
              return code || "No code found";
          }
  
          //NB: load simultaneously
          const loadCodePromise = loadCode();
  
  
          loadCodePromise.then(async fileContents => {
  
  
              const monaco = await monacoPromise;
  
  
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                  target: monaco.languages.typescript.ScriptTarget.ESNext,
                  allowNonTsExtensions: true,
                  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                  module: monaco.languages.typescript.ModuleKind.CommonJS,
                  noEmit: true,
                  typeRoots: ["node_modules/@types"],
                  jsx: monaco.languages.typescript.JsxEmit.React,
                  //https://gist.github.com/RoboPhred/f767bea5cbc972e04155a625dc11da11
              });
  
  
              const isDarkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
              window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                  const isDarkmode = event.matches;
                  monaco.editor.setTheme(isDarkmode ? "vs-dark" : "vs")
              });
  
              //https://stackoverflow.com/questions/56954280/monaco-editor-how-to-disable-errors-typescript
  
  
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                  //noSemanticValidation: true,
                  diagnosticCodesToIgnore: [],
                  allowNonTsExtensions: true
                  // noSyntaxValidation: true,
              });
  
              monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                  allowNonTsExtensions: true
              });
  
  
  
  
  
              monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  
  
  
  
              var editor = monaco.editor.create(document.getElementById('monacodo'), {
                  language: "json",
                  wordWrap: "on",
                  theme: isDarkmode ? "vs-dark" : "vs",
                  model: null
              });
  
              const mainModel = monaco.editor.createModel(
                  fileContents,
                  language,
                  // NB: Typescript must see the 'file' it is editing as having a .tsx extension
                  monaco.Uri.file(srcRelativePath)
              );
  
              editor.setModel(mainModel)
  
  
  
  
              monaco.editor.getModels()?.[0]?.onDidChangeContent(() => {
                  console.log("ONChange fired");
  
                  console.log(monaco.editor.getModels().map(x => x.uri))
  
  
  
                  const saveButton = document.getElementById("save");
                  if (!saveButton) {
                      alert("No savebutton");
                      return;
                  }
                  const value = editor?.getValue();
                  if (value === undefined) {
                      alert("No value");
                      return;
                  }
                  if (fileContents === value) {
                      console.log("it's equal")
                      return;
                  }
  
  
                  saveButton.style.display = "block";
              })
  
              window.onresize = function () {
                  editor.layout();
              };
  
          })
  
  
  
          const saveContents = async () => {
  
  
              const monaco = await monacoPromise;
  
              const editor = monaco.editor.getEditors()?.[0];
              //https://github.com/microsoft/monaco-editor/issues/2664
              await editor?.getAction("editor.action.formatDocument")?.run();
  
              const value = editor?.getValue();
  
              if (value === undefined) {
                  return "Could not get file contents"
              }
  
              window.localStorage.setItem("code", value)
  
              const saveButton = document.getElementById("save");
              if (!saveButton) {
                  alert("No savebutton");
                  return;
              }
              saveButton.style.display = "none";
              // successfull. no message needed
  
          }
  
  
      </script>
  </body>
  
  </html>`;
};
const testOptions = { wordWrap: "on", codeLens: false };
//https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.CompletionItemProvider.html
//const editor = monaco.editor.getEditors()?.[0]; // get editor for typesafety checks
/*
//        allowNonTsExtensions: true

*/
// monaco.editor.registerEditorOpener({
//   openCodeEditor: (editor, uri, position) => {
//     console.log("I'd llike to go to ", uri.path);
//     return true;
//   },
// });
//# sourceMappingURL=getFullscreenEditorHtml.js.map