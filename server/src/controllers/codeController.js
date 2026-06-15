const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const runCode = async (req, res) => {
  try {
    let filePath;
let command;
let args = [];
    const { code, input, language } = req.body;

    if (language === "python") {
  filePath = path.join(
    __dirname,
    "../../temp.py"
  );

  fs.writeFileSync(filePath, code);

  command = "python3";
  args = [filePath];
}

else if (language === "javascript") {
  filePath = path.join(
    __dirname,
    "../../temp.js"
  );

  fs.writeFileSync(filePath, code);

  command = "node";
  args = [filePath];
}
else if (language === "cpp") {
  filePath = path.join(
    __dirname,
    "../../temp.cpp"
  );

  fs.writeFileSync(filePath, code);

  const exePath = path.join(
    __dirname,
    "../../temp.out"
  );

  const compile = spawn(
    "g++",
    [filePath, "-o", exePath]
  );

  let compileErrors = "";

  compile.stderr.on("data", (data) => {
    compileErrors += data.toString();
  });

  compile.on("close", (code) => {
    if (code !== 0) {
      return res.json({
        output: compileErrors,
      });
    }

    const process = spawn(exePath);

    process.stdin.write(input || "");
    process.stdin.end();

    let output = "";
    let errors = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errors += data.toString();
    });

    process.on("close", () => {
      res.json({
        output: errors || output,
      });
    });
  });

  return;
}
else if (language === "java") {
  filePath = path.join(
    __dirname,
    "../../Main.java"
  );

  fs.writeFileSync(filePath, code);

  const compile = spawn(
    "javac",
    [filePath]
  );

  let compileErrors = "";

  compile.stderr.on("data", (data) => {
    compileErrors += data.toString();
  });

  compile.on("close", (code) => {
    if (code !== 0) {
      return res.json({
        output: compileErrors,
      });
    }

    const process = spawn(
      "java",
      ["-cp", path.dirname(filePath), "Main"]
    );

    process.stdin.write(input || "");
    process.stdin.end();

    let output = "";
    let errors = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errors += data.toString();
    });

    process.on("close", () => {
      res.json({
        output: errors || output,
      });
    });
  });

  return;
}
else {
  return res.json({
    output: "Language not supported yet",
  });
}

   const process = spawn(
  command,
  args
);
process.stdin.write(input || "");
process.stdin.end();
let output = "";
let errors = "";

process.stdout.on("data", (data) => {
  output += data.toString();
});

process.stderr.on("data", (data) => {
  errors += data.toString();
});

process.on("close", () => {
  res.json({
    output: errors || output,
  });
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Execution failed",
    });
  }
};

module.exports = {
  runCode,
};