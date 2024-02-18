import * as ts from "typescript";

import libs from "./libs";

export default function compiler(source) {
  const options = {
    // noEmitOnError: true,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
  };

  const file = {};

  // const host = ts.createCompilerHost(options);
  const host = {
    getSourceFile: (fileName, languageVersion, onError) => {
      // console.log("SOURCE:", fileName);
      // you will need to implement a way to get source files here
      // return { path: "/", source, fileName };
      if (fileName === "/abc.ts") {
        return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest);
      }
      if (libs[fileName]) {
        // console.log("FOUND 1", fileName);
        const source = libs[fileName];
        return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest);
      }
      fileName =
        "/" +
        fileName
          .split("/@typescript/")
          .pop()
          .replace(/\.ts/, ".d.ts")
          .replace(".d.d.", ".d.")
          .replace(/\//g, ".")
          .replace(/^lib-/, "lib.");
      if (libs[fileName]) {
        // console.log("FOUND 2", fileName);
        const source = libs[fileName];
        return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest);
      }
      // console.log("ERROR", fileName);
    },
    getDefaultLibFileName: (options) => "/" + ts.getDefaultLibFileName(options),
    writeFile: (fileName, contents) => {
      file.contents = contents;
    },
    getCurrentDirectory: () => "/virtual/",
    getDirectories: (path) => [],
    fileExists: (fileName) => true,
    readFile: (fileName) => "",
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    getEnvironmentVariable: () => "", // do nothing
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(["/abc.ts"], options, host);
  const out = program.emit();
  if (out.diagnostics.length) {
    // console.log(out.diagnostics);
  }

  return file.contents;
}
