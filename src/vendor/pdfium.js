var PDFiumModule = (() => {
  var _scriptName = globalThis.document?.currentScript?.src;
  return async function (moduleArg = {}) {
    var moduleRtn;
    (function () {
      function humanReadableVersionToPacked(str) {
        str = str.split("-")[0];
        var vers = str.split(".").slice(0, 3);
        while (vers.length < 3) vers.push("00");
        vers = vers.map((n, i, arr) => n.padStart(2, "0"));
        return vers.join("");
      }
      var packedVersionToHumanReadable = (n) =>
        [(n / 1e4) | 0, ((n / 100) | 0) % 100, n % 100].join(".");
      var TARGET_NOT_SUPPORTED = 2147483647;
      var currentNodeVersion =
        typeof process !== "undefined" && process.versions?.node
          ? humanReadableVersionToPacked(process.versions.node)
          : TARGET_NOT_SUPPORTED;
      if (currentNodeVersion < 180300) {
        throw new Error(
          `This emscripten-generated code requires node v${packedVersionToHumanReadable(180300)} (detected v${packedVersionToHumanReadable(currentNodeVersion)})`,
        );
      }
      var userAgent = typeof navigator !== "undefined" && navigator.userAgent;
      if (!userAgent) {
        return;
      }
      var currentSafariVersion =
        userAgent.includes("Safari/") &&
        !userAgent.includes("Chrome/") &&
        userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)
          ? humanReadableVersionToPacked(
              userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1],
            )
          : TARGET_NOT_SUPPORTED;
      if (currentSafariVersion < 15e4) {
        throw new Error(
          `This emscripten-generated code requires Safari v${packedVersionToHumanReadable(15e4)} (detected v${currentSafariVersion})`,
        );
      }
      var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)
        ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1])
        : TARGET_NOT_SUPPORTED;
      if (currentFirefoxVersion < 79) {
        throw new Error(
          `This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`,
        );
      }
      var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)
        ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1])
        : TARGET_NOT_SUPPORTED;
      if (currentChromeVersion < 85) {
        throw new Error(
          `This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`,
        );
      }
    })();
    var Module = moduleArg;
    var ENVIRONMENT_IS_WEB = !!globalThis.window;
    var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
    var ENVIRONMENT_IS_NODE =
      globalThis.process?.versions?.node &&
      globalThis.process?.type != "renderer";
    var ENVIRONMENT_IS_SHELL =
      !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    var programArgs = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    if (typeof __filename != "undefined") {
      _scriptName = __filename;
    } else if (ENVIRONMENT_IS_WORKER) {
      _scriptName = self.location.href;
    }
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var readAsync, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      const isNode =
        globalThis.process?.versions?.node &&
        globalThis.process?.type != "renderer";
      if (!isNode)
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)",
        );
      var fs = require("node:fs");
      scriptDirectory = __dirname + "/";
      readBinary = (filename) => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs.readFileSync(filename);
        assert(Buffer.isBuffer(ret));
        return ret;
      };
      readAsync = async (filename, binary = true) => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
        assert(binary ? Buffer.isBuffer(ret) : typeof ret == "string");
        return ret;
      };
      if (process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/");
      }
      programArgs = process.argv.slice(2);
      quit_ = (status, toThrow) => {
        process.exitCode = status;
        throw toThrow;
      };
    } else if (ENVIRONMENT_IS_SHELL) {
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      try {
        scriptDirectory = new URL(".", _scriptName).href;
      } catch {}
      if (!(globalThis.window || globalThis.WorkerGlobalScope))
        throw new Error(
          "not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)",
        );
      {
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = async (url) => {
          if (isFileURI(url)) {
            return new Promise((resolve, reject) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                  resolve(xhr.response);
                  return;
                }
                reject(xhr.status);
              };
              xhr.onerror = reject;
              xhr.send(null);
            });
          }
          var response = await fetch(url, { credentials: "same-origin" });
          if (response.ok) {
            return response.arrayBuffer();
          }
          throw new Error(response.status + " : " + response.url);
        };
      }
    } else {
      throw new Error("environment detection error");
    }
    var out = console.log.bind(console);
    var err = console.error.bind(console);
    assert(
      !ENVIRONMENT_IS_SHELL,
      "shell environment detected but not enabled at build time (add `shell` to `-sENVIRONMENT` to enable)",
    );
    var wasmBinary;
    if (!globalThis.WebAssembly) {
      err("no native wasm support detected");
    }
    var ABORT = false;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed" + (text ? ": " + text : ""));
      }
    }
    var isFileURI = (filename) => filename.startsWith("file://");
    function writeStackCookie() {
      var max = _emscripten_stack_get_end();
      assert((max & 3) == 0);
      if (max == 0) {
        max += 4;
      }
      HEAPU32[max >> 2] = 34821223;
      HEAPU32[(max + 4) >> 2] = 2310721022;
      HEAPU32[0 >> 2] = 1668509029;
    }
    function checkStackCookie() {
      if (ABORT) return;
      var max = _emscripten_stack_get_end();
      if (max == 0) {
        max += 4;
      }
      var cookie1 = HEAPU32[max >> 2];
      var cookie2 = HEAPU32[(max + 4) >> 2];
      if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort(
          `Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`,
        );
      }
      if (HEAPU32[0 >> 2] != 1668509029) {
        abort(
          "Runtime error: The application has corrupted its heap memory area (address zero)!",
        );
      }
    }
    class EmscriptenEH {}
    class EmscriptenSjLj extends EmscriptenEH {}
    var runtimeDebug = true;
    (() => {
      var h16 = new Int16Array(1);
      var h8 = new Int8Array(h16.buffer);
      h16[0] = 25459;
      if (h8[0] !== 115 || h8[1] !== 99)
        abort(
          "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)",
        );
    })();
    function consumedModuleProp(prop) {
      if (!Object.getOwnPropertyDescriptor(Module, prop)) {
        Object.defineProperty(Module, prop, {
          configurable: true,
          set() {
            abort(
              `Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`,
            );
          },
        });
      }
    }
    function makeInvalidEarlyAccess(name) {
      return () =>
        assert(
          false,
          `call to '${name}' via reference taken before Wasm module initialization`,
        );
    }
    function ignoredModuleProp(prop) {
      if (Object.getOwnPropertyDescriptor(Module, prop)) {
        abort(
          `\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`,
        );
      }
    }
    function isExportedByForceFilesystem(name) {
      return (
        name === "FS_createPath" ||
        name === "FS_createDataFile" ||
        name === "FS_createPreloadedFile" ||
        name === "FS_preloadFile" ||
        name === "FS_unlink" ||
        name === "addRunDependency" ||
        name === "FS_createLazyFile" ||
        name === "FS_createDevice" ||
        name === "removeRunDependency"
      );
    }
    function missingLibrarySymbol(sym) {
      unexportedRuntimeSymbol(sym);
    }
    function unexportedRuntimeSymbol(sym) {
      if (!Object.getOwnPropertyDescriptor(Module, sym)) {
        Object.defineProperty(Module, sym, {
          configurable: true,
          get() {
            var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
            if (isExportedByForceFilesystem(sym)) {
              msg +=
                ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
            }
            abort(msg);
          },
        });
      }
    }
    var readyPromiseResolve, readyPromiseReject;
    var runtimeInitialized = false;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module["HEAP8"] = HEAP8 = new Int8Array(b);
      Module["HEAP16"] = HEAP16 = new Int16Array(b);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
      Module["HEAP32"] = HEAP32 = new Int32Array(b);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
      HEAP64 = new BigInt64Array(b);
      HEAPU64 = new BigUint64Array(b);
    }
    assert(
      globalThis.Int32Array &&
        globalThis.Float64Array &&
        Int32Array.prototype.subarray &&
        Int32Array.prototype.set,
      "JS engine does not provide full typed array support",
    );
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      consumedModuleProp("preRun");
      callRuntimeCallbacks(onPreRuns);
    }
    function initRuntime() {
      assert(!runtimeInitialized);
      runtimeInitialized = true;
      checkStackCookie();
      if (!Module["noFSInit"] && !FS.initialized) FS.init();
      TTY.init();
      wasmExports["__wasm_call_ctors"]();
      FS.ignorePermissions = false;
    }
    function postRun() {
      checkStackCookie();
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      consumedModuleProp("postRun");
      callRuntimeCallbacks(onPostRuns);
    }
    function abort(what) {
      Module["onAbort"]?.(what);
      what = `Aborted(${what})`;
      err(what);
      ABORT = true;
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject?.(e);
      throw e;
    }
    function createExportWrapper(name, nargs) {
      return (...args) => {
        assert(
          runtimeInitialized,
          `native function \`${name}\` called before runtime initialization`,
        );
        var f = wasmExports[name];
        assert(f, `exported native function \`${name}\` not found`);
        assert(
          args.length <= nargs,
          `native function \`${name}\` called with ${args.length} args but expects ${nargs}`,
        );
        return f(...args);
      };
    }
    var wasmBinaryFile;
    function findWasmBinary() {
      return locateFile("pdfium.wasm");
    }
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw "both async and sync fetching of the wasm failed";
    }
    async function getWasmBinary(binaryFile) {
      if (!wasmBinary) {
        try {
          var response = await readAsync(binaryFile);
          return new Uint8Array(response);
        } catch {}
      }
      return getBinarySync(binaryFile);
    }
    async function instantiateArrayBuffer(binaryFile, imports) {
      try {
        var binary = await getWasmBinary(binaryFile);
        var instance = await WebAssembly.instantiate(binary, imports);
        return instance;
      } catch (reason) {
        err(`failed to asynchronously prepare wasm: ${reason}`);
        if (isFileURI(binaryFile)) {
          err(
            `warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`,
          );
        }
        abort(reason);
      }
    }
    async function instantiateAsync(binary, binaryFile, imports) {
      if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
        try {
          var response = fetch(binaryFile, { credentials: "same-origin" });
          var instantiationResult = await WebAssembly.instantiateStreaming(
            response,
            imports,
          );
          return instantiationResult;
        } catch (reason) {
          err(`wasm streaming compile failed: ${reason}`);
          err("falling back to ArrayBuffer instantiation");
        }
      }
      return instantiateArrayBuffer(binaryFile, imports);
    }
    function getWasmImports() {
      var imports = { env: wasmImports, wasi_snapshot_preview1: wasmImports };
      return imports;
    }
    async function createWasm() {
      function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        assignWasmExports(wasmExports);
        Module["wasmExports"] = wasmExports;
        updateMemoryViews();
        return wasmExports;
      }
      var trueModule = Module;
      function receiveInstantiationResult(result) {
        assert(
          Module === trueModule,
          "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?",
        );
        trueModule = null;
        return receiveInstance(result["instance"]);
      }
      var info = getWasmImports();
      if (Module["instantiateWasm"]) {
        return new Promise((resolve, reject) => {
          try {
            Module["instantiateWasm"](info, (inst, mod) => {
              resolve(receiveInstance(inst, mod));
            });
          } catch (e) {
            err(`Module.instantiateWasm callback failed with error: ${e}`);
            reject(e);
          }
        });
      }
      wasmBinaryFile ??= findWasmBinary();
      var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
      var exports = receiveInstantiationResult(result);
      return exports;
    }
    class ExitStatus {
      name = "ExitStatus";
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }
    var HEAP16;
    var HEAP32;
    var HEAP64;
    var HEAP8;
    var HEAPF32;
    var HEAPF64;
    var HEAPU16;
    var HEAPU32;
    var HEAPU64;
    var HEAPU8;
    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var onPostRuns = [];
    var addOnPostRun = (cb) => onPostRuns.push(cb);
    var onPreRuns = [];
    var addOnPreRun = (cb) => onPreRuns.push(cb);
    var noExitRuntime = true;
    function ptrToString(ptr) {
      assert(
        typeof ptr === "number",
        `ptrToString expects a number, got ${typeof ptr}`,
      );
      ptr >>>= 0;
      return "0x" + ptr.toString(16).padStart(8, "0");
    }
    function setValue(ptr, value, type = "i8") {
      if (type.endsWith("*")) type = "*";
      switch (type) {
        case "i1":
          HEAP8[ptr] = value;
          break;
        case "i8":
          HEAP8[ptr] = value;
          break;
        case "i16":
          HEAP16[ptr >> 1] = value;
          break;
        case "i32":
          HEAP32[ptr >> 2] = value;
          break;
        case "i64":
          HEAP64[ptr >> 3] = BigInt(value);
          break;
        case "float":
          HEAPF32[ptr >> 2] = value;
          break;
        case "double":
          HEAPF64[ptr >> 3] = value;
          break;
        case "*":
          HEAPU32[ptr >> 2] = value;
          break;
        default:
          abort(`invalid type for setValue: ${type}`);
      }
    }
    var stackRestore = (val) => __emscripten_stack_restore(val);
    var stackSave = () => _emscripten_stack_get_current();
    var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
        err(text);
      }
    };
    var syscallGetVarargI = () => {
      assert(SYSCALLS.varargs != undefined);
      var ret = HEAP32[+SYSCALLS.varargs >> 2];
      SYSCALLS.varargs += 4;
      return ret;
    };
    var syscallGetVarargP = syscallGetVarargI;
    var PATH = {
      isAbs: (path) => path.charAt(0) === "/",
      splitPath: (filename) => {
        var splitPathRe =
          /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }
        return parts;
      },
      normalize: (path) => {
        var isAbsolute = PATH.isAbs(path),
          trailingSlash = path.slice(-1) === "/";
        path = PATH.normalizeArray(
          path.split("/").filter((p) => !!p),
          !isAbsolute,
        ).join("/");
        if (!path && !isAbsolute) {
          path = ".";
        }
        if (path && trailingSlash) {
          path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
      },
      dirname: (path) => {
        var result = PATH.splitPath(path),
          root = result[0],
          dir = result[1];
        if (!root && !dir) {
          return ".";
        }
        if (dir) {
          dir = dir.slice(0, -1);
        }
        return root + dir;
      },
      basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
      join: (...paths) => PATH.normalize(paths.join("/")),
      join2: (l, r) => PATH.normalize(l + "/" + r),
    };
    var initRandomFill = () => {
      if (ENVIRONMENT_IS_NODE) {
        var nodeCrypto = require("node:crypto");
        return (view) => nodeCrypto.randomFillSync(view);
      }
      return (view) => (crypto.getRandomValues(view), 0);
    };
    var randomFill = (view) => (randomFill = initRandomFill())(view);
    var PATH_FS = {
      resolve: (...args) => {
        var resolvedPath = "",
          resolvedAbsolute = false;
        for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? args[i] : FS.cwd();
          if (typeof path != "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else if (!path) {
            return "";
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        resolvedPath = PATH.normalizeArray(
          resolvedPath.split("/").filter((p) => !!p),
          !resolvedAbsolute,
        ).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
      },
      relative: (from, to) => {
        from = PATH_FS.resolve(from).slice(1);
        to = PATH_FS.resolve(to).slice(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== "") break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== "") break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..");
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      },
    };
    var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
    var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
    var UTF8ArrayToString = (
      heapOrArray,
      idx = 0,
      maxBytesToRead,
      ignoreNul,
    ) => {
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 248) != 240)
            warnOnce(
              `Invalid UTF-8 leading byte ${ptrToString(u0)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`,
            );
          u0 =
            ((u0 & 7) << 18) |
            (u1 << 12) |
            (u2 << 6) |
            (heapOrArray[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
      return str;
    };
    var FS_stdin_getChar_buffer = [];
    var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(
        typeof str === "string",
        `stringToUTF8Array expects a string (got ${typeof str})`,
      );
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.codePointAt(i);
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 1114111)
            warnOnce(
              `Invalid Unicode code point ${ptrToString(u)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).`,
            );
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
          i++;
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
    var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(
        stringy,
        u8array,
        0,
        u8array.length,
      );
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };
    var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
          var fd = process.stdin.fd;
          try {
            bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
          } catch (e) {
            if (e.toString().includes("EOF")) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString("utf-8");
          }
        } else if (globalThis.window?.prompt) {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else {
        }
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
    var TTY = {
      ttys: [],
      init() {},
      shutdown() {},
      register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
      stream_ops: {
        open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
        close(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
        read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        },
        write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        },
      },
      default_tty_ops: {
        get_char(tty) {
          return FS_stdin_getChar();
        },
        put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
        ioctl_tcgets(tty) {
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
          };
        },
        ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        },
        ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
      },
      default_tty1_ops: {
        put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
      },
    };
    var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
    var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
    var mmapAlloc = (size) => {
      size = alignMemory(size, 65536);
      var ptr = _emscripten_builtin_memalign(65536, size);
      if (ptr) zeroMemory(ptr, size);
      return ptr;
    };
    var MEMFS = {
      ops_table: null,
      mount(mount) {
        return MEMFS.createNode(null, "/", 16895, 0);
      },
      createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink,
            },
            stream: { llseek: MEMFS.stream_ops.llseek },
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync,
            },
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink,
            },
            stream: {},
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
            },
            stream: FS.chrdev_stream_ops,
          },
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.atime = node.mtime = node.ctime = Date.now();
        if (parent) {
          parent.contents[name] = node;
          parent.atime = parent.mtime = parent.ctime = node.atime;
        }
        return node;
      },
      getFileDataAsTypedArray(node) {
        assert(
          FS.isFile(node.mode),
          "getFileDataAsTypedArray called on non-file",
        );
        return node.contents.subarray(0, node.usedBytes);
      },
      expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents.length;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(
          newCapacity,
          (prevCapacity *
            (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
            0,
        );
        if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
        var oldContents = MEMFS.getFileDataAsTypedArray(node);
        node.contents = new Uint8Array(newCapacity);
        node.contents.set(oldContents);
      },
      resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        var oldContents = node.contents;
        node.contents = new Uint8Array(newSize);
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes)),
        );
        node.usedBytes = newSize;
      },
      node_ops: {
        getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
        setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) {
            if (attr[key] != null) {
              node[key] = attr[key];
            }
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
        lookup(parent, name) {
          throw new FS.ErrnoError(44);
        },
        mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
        rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {}
          if (new_node) {
            if (FS.isDir(old_node.mode)) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
            FS.hashRemoveNode(new_node);
          }
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime =
            new_dir.mtime =
            old_node.parent.ctime =
            old_node.parent.mtime =
              Date.now();
        },
        unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
        rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
        readdir(node) {
          return [".", "..", ...Object.keys(node.contents)];
        },
        symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        },
        readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
      },
      stream_ops: {
        read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          buffer.set(contents.subarray(position, position + size), offset);
          return size;
        },
        write(stream, buffer, offset, length, position, canOwn) {
          assert(buffer.subarray, "FS.write expects a TypedArray");
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
          if (canOwn) {
            assert(
              position === 0,
              "canOwn must imply no weird position inside the file",
            );
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
          } else if (node.usedBytes === 0 && position === 0) {
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
          } else {
            MEMFS.expandFileStorage(node, position + length);
            node.contents.set(
              buffer.subarray(offset, offset + length),
              position,
            );
            node.usedBytes = Math.max(node.usedBytes, position + length);
          }
          return length;
        },
        llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
        mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(
                    contents,
                    position,
                    position + length,
                  );
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        },
        msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        },
      },
    };
    var FS_modeStringToFlags = (str) => {
      if (typeof str != "string") return str;
      var flagModes = {
        r: 0,
        "r+": 2,
        w: 512 | 64 | 1,
        "w+": 512 | 64 | 2,
        a: 1024 | 64 | 1,
        "a+": 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == "undefined") {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
    var FS_fileDataToTypedArray = (data) => {
      if (typeof data == "string") {
        data = intArrayFromString(data, true);
      }
      if (!data.subarray) {
        data = new Uint8Array(data);
      }
      return data;
    };
    var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
    var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(
        typeof ptr == "number",
        `UTF8ToString expects a number (got ${typeof ptr})`,
      );
      return ptr
        ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul)
        : "";
    };
    var strError = (errno) => UTF8ToString(_strerror(errno));
    var ERRNO_CODES = {
      EPERM: 63,
      ENOENT: 44,
      ESRCH: 71,
      EINTR: 27,
      EIO: 29,
      ENXIO: 60,
      E2BIG: 1,
      ENOEXEC: 45,
      EBADF: 8,
      ECHILD: 12,
      EAGAIN: 6,
      EWOULDBLOCK: 6,
      ENOMEM: 48,
      EACCES: 2,
      EFAULT: 21,
      ENOTBLK: 105,
      EBUSY: 10,
      EEXIST: 20,
      EXDEV: 75,
      ENODEV: 43,
      ENOTDIR: 54,
      EISDIR: 31,
      EINVAL: 28,
      ENFILE: 41,
      EMFILE: 33,
      ENOTTY: 59,
      ETXTBSY: 74,
      EFBIG: 22,
      ENOSPC: 51,
      ESPIPE: 70,
      EROFS: 69,
      EMLINK: 34,
      EPIPE: 64,
      EDOM: 18,
      ERANGE: 68,
      ENOMSG: 49,
      EIDRM: 24,
      ECHRNG: 106,
      EL2NSYNC: 156,
      EL3HLT: 107,
      EL3RST: 108,
      ELNRNG: 109,
      EUNATCH: 110,
      ENOCSI: 111,
      EL2HLT: 112,
      EDEADLK: 16,
      ENOLCK: 46,
      EBADE: 113,
      EBADR: 114,
      EXFULL: 115,
      ENOANO: 104,
      EBADRQC: 103,
      EBADSLT: 102,
      EDEADLOCK: 16,
      EBFONT: 101,
      ENOSTR: 100,
      ENODATA: 116,
      ETIME: 117,
      ENOSR: 118,
      ENONET: 119,
      ENOPKG: 120,
      EREMOTE: 121,
      ENOLINK: 47,
      EADV: 122,
      ESRMNT: 123,
      ECOMM: 124,
      EPROTO: 65,
      EMULTIHOP: 36,
      EDOTDOT: 125,
      EBADMSG: 9,
      ENOTUNIQ: 126,
      EBADFD: 127,
      EREMCHG: 128,
      ELIBACC: 129,
      ELIBBAD: 130,
      ELIBSCN: 131,
      ELIBMAX: 132,
      ELIBEXEC: 133,
      ENOSYS: 52,
      ENOTEMPTY: 55,
      ENAMETOOLONG: 37,
      ELOOP: 32,
      EOPNOTSUPP: 138,
      EPFNOSUPPORT: 139,
      ECONNRESET: 15,
      ENOBUFS: 42,
      EAFNOSUPPORT: 5,
      EPROTOTYPE: 67,
      ENOTSOCK: 57,
      ENOPROTOOPT: 50,
      ESHUTDOWN: 140,
      ECONNREFUSED: 14,
      EADDRINUSE: 3,
      ECONNABORTED: 13,
      ENETUNREACH: 40,
      ENETDOWN: 38,
      ETIMEDOUT: 73,
      EHOSTDOWN: 142,
      EHOSTUNREACH: 23,
      EINPROGRESS: 26,
      EALREADY: 7,
      EDESTADDRREQ: 17,
      EMSGSIZE: 35,
      EPROTONOSUPPORT: 66,
      ESOCKTNOSUPPORT: 137,
      EADDRNOTAVAIL: 4,
      ENETRESET: 39,
      EISCONN: 30,
      ENOTCONN: 53,
      ETOOMANYREFS: 141,
      EUSERS: 136,
      EDQUOT: 19,
      ESTALE: 72,
      ENOTSUP: 138,
      ENOMEDIUM: 148,
      EILSEQ: 25,
      EOVERFLOW: 61,
      ECANCELED: 11,
      ENOTRECOVERABLE: 56,
      EOWNERDEAD: 62,
      ESTRPIPE: 135,
    };
    var asyncLoad = async (url) => {
      var arrayBuffer = await readAsync(url);
      assert(
        arrayBuffer,
        `Loading data file "${url}" failed (no arrayBuffer).`,
      );
      return new Uint8Array(arrayBuffer);
    };
    var FS_createDataFile = (...args) => FS.createDataFile(...args);
    var getUniqueRunDependency = (id) => {
      var orig = id;
      while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
      }
    };
    var runDependencies = 0;
    var dependenciesFulfilled = null;
    var runDependencyTracking = {};
    var runDependencyWatcher = null;
    var removeRunDependency = (id) => {
      runDependencies--;
      Module["monitorRunDependencies"]?.(runDependencies);
      assert(id, "removeRunDependency requires an ID");
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    };
    var addRunDependency = (id) => {
      runDependencies++;
      Module["monitorRunDependencies"]?.(runDependencies);
      assert(id, "addRunDependency requires an ID");
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && globalThis.setInterval) {
        runDependencyWatcher = setInterval(() => {
          if (ABORT) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
            return;
          }
          var shown = false;
          for (var dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              err("still waiting on run dependencies:");
            }
            err(`dependency: ${dep}`);
          }
          if (shown) {
            err("(end of list)");
          }
        }, 1e4);
        runDependencyWatcher.unref?.();
      }
    };
    var preloadPlugins = [];
    var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
      if (typeof Browser != "undefined") Browser.init();
      for (var plugin of preloadPlugins) {
        if (plugin["canHandle"](fullname)) {
          assert(
            plugin["handle"].constructor.name === "AsyncFunction",
            "Filesystem plugin handlers must be async functions (See #24914)",
          );
          return plugin["handle"](byteArray, fullname);
        }
      }
      return byteArray;
    };
    var FS_preloadFile = async (
      parent,
      name,
      url,
      canRead,
      canWrite,
      dontCreateFile,
      canOwn,
      preFinish,
    ) => {
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`);
      addRunDependency(dep);
      try {
        var byteArray = url;
        if (typeof url == "string") {
          byteArray = await asyncLoad(url);
        }
        byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
        preFinish?.();
        if (!dontCreateFile) {
          FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
      } finally {
        removeRunDependency(dep);
      }
    };
    var FS_createPreloadedFile = (
      parent,
      name,
      url,
      canRead,
      canWrite,
      onload,
      onerror,
      dontCreateFile,
      canOwn,
      preFinish,
    ) => {
      FS_preloadFile(
        parent,
        name,
        url,
        canRead,
        canWrite,
        dontCreateFile,
        canOwn,
        preFinish,
      )
        .then(onload)
        .catch(onerror);
    };
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      filesystems: null,
      syncFSRequests: 0,
      ErrnoError: class extends Error {
        name = "ErrnoError";
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : "");
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
      FSStream: class {
        shared = {};
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return this.flags & 1024;
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
      FSNode: class {
        node_ops = {};
        stream_ops = {};
        readMode = 292 | 73;
        writeMode = 146;
        mounted = null;
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.rdev = rdev;
          this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? (this.mode |= this.readMode) : (this.mode &= ~this.readMode);
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? (this.mode |= this.writeMode) : (this.mode &= ~this.writeMode);
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
      },
      lookupPath(path, opts = {}) {
        if (!path) {
          throw new FS.ErrnoError(44);
        }
        opts.follow_mount ??= true;
        if (!PATH.isAbs(path)) {
          path = FS.cwd() + "/" + path;
        }
        linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
          var parts = path.split("/").filter((p) => !!p);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break;
            }
            if (parts[i] === ".") {
              continue;
            }
            if (parts[i] === "..") {
              current_path = PATH.dirname(current_path);
              if (FS.isRoot(current)) {
                path = current_path + "/" + parts.slice(i + 1).join("/");
                nlinks--;
                continue linkloop;
              } else {
                current = current.parent;
              }
              continue;
            }
            current_path = PATH.join2(current_path, parts[i]);
            try {
              current = FS.lookupNode(current, parts[i]);
            } catch (e) {
              if (e?.errno === 44 && islast && opts.noent_okay) {
                return { path: current_path };
              }
              throw e;
            }
            if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
              current = current.mounted.root;
            }
            if (FS.isLink(current.mode) && (!islast || opts.follow)) {
              if (!current.node_ops.readlink) {
                throw new FS.ErrnoError(52);
              }
              var link = current.node_ops.readlink(current);
              if (!PATH.isAbs(link)) {
                link = PATH.dirname(current_path) + "/" + link;
              }
              path = link + "/" + parts.slice(i + 1).join("/");
              continue linkloop;
            }
          }
          return { path: current_path, node: current };
        }
        throw new FS.ErrnoError(32);
      },
      getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length - 1] !== "/"
              ? `${mount}/${path}`
              : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
      hashName(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
      hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
      hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
      lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        return FS.lookup(parent, name);
      },
      createNode(parent, name, mode, rdev) {
        assert(typeof parent == "object");
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },
      destroyNode(node) {
        FS.hashRemoveNode(node);
      },
      isRoot(node) {
        return node === node.parent;
      },
      isMountpoint(node) {
        return !!node.mounted;
      },
      isFile(mode) {
        return (mode & 61440) === 32768;
      },
      isDir(mode) {
        return (mode & 61440) === 16384;
      },
      isLink(mode) {
        return (mode & 61440) === 40960;
      },
      isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
      isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
      isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
      isSocket(mode) {
        return (mode & 49152) === 49152;
      },
      flagsToPermissionString(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
          perms += "w";
        }
        return perms;
      },
      nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        if (perms.includes("r") && !(node.mode & 292)) {
          return 2;
        }
        if (perms.includes("w") && !(node.mode & 146)) {
          return 2;
        }
        if (perms.includes("x") && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
      mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
      mayCreate(dir, name) {
        if (!FS.isDir(dir.mode)) {
          return 54;
        }
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {}
        return FS.nodePermissions(dir, "wx");
      },
      mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else if (FS.isDir(node.mode)) {
          return 31;
        }
        return 0;
      },
      mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        }
        var mode = FS.flagsToPermissionString(flags);
        if (FS.isDir(node.mode)) {
          if (mode !== "r" || flags & (512 | 64)) {
            return 31;
          }
        }
        return FS.nodePermissions(node, mode);
      },
      checkOpExists(op, err) {
        if (!op) {
          throw new FS.ErrnoError(err);
        }
        return op;
      },
      MAX_OPEN_FDS: 4096,
      nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
      getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
      getStream: (fd) => FS.streams[fd],
      createStream(stream, fd = -1) {
        assert(fd >= -1);
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
      closeStream(fd) {
        FS.streams[fd] = null;
      },
      dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
      doSetAttr(stream, node, attr) {
        var setattr = stream?.stream_ops.setattr;
        var arg = setattr ? stream : node;
        setattr ??= node.node_ops.setattr;
        FS.checkOpExists(setattr, 63);
        try {
          setattr(arg, attr);
        } catch (e) {
          if (e instanceof RangeError) {
            throw new FS.ErrnoError(22);
          }
          throw e;
        }
      },
      chrdev_stream_ops: {
        open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          stream.stream_ops.open?.(stream);
        },
        llseek() {
          throw new FS.ErrnoError(70);
        },
      },
      major: (dev) => dev >> 8,
      minor: (dev) => dev & 255,
      makedev: (ma, mi) => (ma << 8) | mi,
      registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
      getDevice: (dev) => FS.devices[dev],
      getMounts(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push(...m.mounts);
        }
        return mounts;
      },
      syncfs(populate, callback) {
        if (typeof populate == "function") {
          callback = populate;
          populate = false;
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
          err(
            `warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`,
          );
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }
        for (var mount of mounts) {
          if (mount.type.syncfs) {
            mount.type.syncfs(mount, populate, done);
          } else {
            done(null);
          }
        }
      },
      mount(type, opts, mountpoint) {
        if (typeof type == "string") {
          throw type;
        }
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path;
          node = lookup.node;
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
        var mount = { type, opts, mountpoint, mounts: [] };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          node.mounted = mount;
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      },
      unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        for (var [hash, current] of Object.entries(FS.nameTable)) {
          while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
            current = next;
          }
        }
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
      lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
      mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name) {
          throw new FS.ErrnoError(28);
        }
        if (name === "." || name === "..") {
          throw new FS.ErrnoError(20);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
      statfs(path) {
        return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
      },
      statfsStream(stream) {
        return FS.statfsNode(stream.node);
      },
      statfsNode(node) {
        var rtn = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: FS.nextInode,
          ffree: FS.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255,
        };
        if (node.node_ops.statfs) {
          Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
        }
        return rtn;
      },
      create(path, mode = 438) {
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
      mkdir(path, mode = 511) {
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
      mkdirTree(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var dir of dirs) {
          if (!dir) continue;
          if (d || PATH.isAbs(path)) d += "/";
          d += dir;
          try {
            FS.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
        }
      },
      mkdev(path, mode, dev) {
        if (typeof dev == "undefined") {
          dev = mode;
          mode = 438;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
      symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
      rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(55);
        }
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (old_node === new_node) {
          return;
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        errCode = new_node
          ? FS.mayDelete(new_dir, new_name, isdir)
          : FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (
          FS.isMountpoint(old_node) ||
          (new_node && FS.isMountpoint(new_node))
        ) {
          throw new FS.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        FS.hashRemoveNode(old_node);
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          FS.hashAddNode(old_node);
        }
      },
      rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
      readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
        return readdir(node);
      },
      unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
      readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return link.node_ops.readlink(link);
      },
      stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
        return getattr(node);
      },
      fstat(fd) {
        var stream = FS.getStreamChecked(fd);
        var node = stream.node;
        var getattr = stream.stream_ops.getattr;
        var arg = getattr ? stream : node;
        getattr ??= node.node_ops.getattr;
        FS.checkOpExists(getattr, 63);
        return getattr(arg);
      },
      lstat(path) {
        return FS.stat(path, true);
      },
      doChmod(stream, node, mode, dontFollow) {
        FS.doSetAttr(stream, node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          ctime: Date.now(),
          dontFollow,
        });
      },
      chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChmod(null, node, mode, dontFollow);
      },
      lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
      fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.doChmod(stream, stream.node, mode, false);
      },
      doChown(stream, node, dontFollow) {
        FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
      },
      chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChown(null, node, dontFollow);
      },
      lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
      fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.doChown(stream, stream.node, false);
      },
      doTruncate(stream, node, len) {
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
      },
      truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doTruncate(null, node, len);
      },
      ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if (len < 0 || (stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.doTruncate(stream, stream.node, len);
      },
      utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
        setattr(node, { atime, mtime });
      },
      open(path, flags, mode = 438) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = FS_modeStringToFlags(flags);
        if (flags & 64) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        var isDirPath;
        if (typeof path == "object") {
          node = path;
        } else {
          isDirPath = path.endsWith("/");
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 131072),
            noent_okay: true,
          });
          node = lookup.node;
          path = lookup.path;
        }
        var created = false;
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20);
            }
          } else if (isDirPath) {
            throw new FS.ErrnoError(31);
          } else {
            node = FS.mknod(path, mode | 511, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        if (flags & 512 && !created) {
          FS.truncate(node, 0);
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false,
        });
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (created) {
          FS.chmod(node, mode & 511);
        }
        return stream;
      },
      close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
      isClosed(stream) {
        return stream.fd === null;
      },
      llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
      read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(
          stream,
          buffer,
          offset,
          length,
          position,
        );
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
      write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        assert(buffer.subarray, "FS.write expects a TypedArray");
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(
          stream,
          buffer,
          offset,
          length,
          position,
          canOwn,
        );
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
      mmap(stream, length, position, prot, flags) {
        if (
          (prot & 2) !== 0 &&
          (flags & 2) === 0 &&
          (stream.flags & 2097155) !== 2
        ) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        if (!length) {
          throw new FS.ErrnoError(28);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
      msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(
          stream,
          buffer,
          offset,
          length,
          mmapFlags,
        );
      },
      ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
      readFile(path, opts = {}) {
        opts.flags = opts.flags ?? 0;
        opts.encoding = opts.encoding ?? "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          abort(`Invalid encoding type "${opts.encoding}"`);
        }
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
          buf = UTF8ArrayToString(buf);
        }
        FS.close(stream);
        return buf;
      },
      writeFile(path, data, opts = {}) {
        opts.flags = opts.flags ?? 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        data = FS_fileDataToTypedArray(data);
        FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        FS.close(stream);
      },
      cwd: () => FS.currentPath,
      chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
      createDefaultDirectories() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
      },
      createDefaultDevices() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
          llseek: () => 0,
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var randomBuffer = new Uint8Array(1024),
          randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomFill(randomBuffer);
            randomLeft = randomBuffer.byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice("/dev", "random", randomByte);
        FS.createDevice("/dev", "urandom", randomByte);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories() {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount(
          {
            mount() {
              var node = FS.createNode(proc_self, "fd", 16895, 73);
              node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
              node.node_ops = {
                lookup(parent, name) {
                  var fd = +name;
                  var stream = FS.getStreamChecked(fd);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: { readlink: () => stream.path },
                    id: fd + 1,
                  };
                  ret.parent = ret;
                  return ret;
                },
                readdir() {
                  return Array.from(FS.streams.entries())
                    .filter(([k, v]) => v)
                    .map(([k, v]) => k.toString());
                },
              };
              return node;
            },
          },
          {},
          "/proc/self/fd",
        );
      },
      createStandardStreams(input, output, error) {
        if (input) {
          FS.createDevice("/dev", "stdin", input);
        } else {
          FS.symlink("/dev/tty", "/dev/stdin");
        }
        if (output) {
          FS.createDevice("/dev", "stdout", null, output);
        } else {
          FS.symlink("/dev/tty", "/dev/stdout");
        }
        if (error) {
          FS.createDevice("/dev", "stderr", null, error);
        } else {
          FS.symlink("/dev/tty1", "/dev/stderr");
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
      staticInit() {
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = { MEMFS };
      },
      init(input, output, error) {
        assert(
          !FS.initialized,
          "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)",
        );
        FS.initialized = true;
        input ??= Module["stdin"];
        output ??= Module["stdout"];
        error ??= Module["stderr"];
        FS.createStandardStreams(input, output, error);
      },
      quit() {
        FS.initialized = false;
        _fflush(0);
        for (var stream of FS.streams) {
          if (stream) {
            FS.close(stream);
          }
        }
      },
      findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
      analyzePath(path, dontResolveLastLink) {
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {}
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null,
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === "/";
        } catch (e) {
          ret.error = e.errno;
        }
        return ret;
      },
      createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
          parent = current;
        }
        return current;
      },
      createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(
          typeof parent == "string" ? parent : FS.getPath(parent),
          name,
        );
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
      createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          data = FS_fileDataToTypedArray(data);
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
      createDevice(parent, name, input, output) {
        var path = PATH.join2(
          typeof parent == "string" ? parent : FS.getPath(parent),
          name,
        );
        var mode = FS_getMode(!!input, !!output);
        FS.createDevice.major ??= 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.atime = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.mtime = stream.node.ctime = Date.now();
            }
            return i;
          },
        });
        return FS.mkdev(path, mode, dev);
      },
      forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
          return true;
        if (globalThis.XMLHttpRequest) {
          abort(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
          );
        } else {
          try {
            obj.contents = readBinary(obj.url);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
      createLazyFile(parent, name, url, canRead, canWrite) {
        class LazyUint8Array {
          lengthKnown = false;
          chunks = [];
          get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize) | 0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (
              !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
            )
              abort("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing =
              (header = xhr.getResponseHeader("Accept-Ranges")) &&
              header === "bytes";
            var usesGzip =
              (header = xhr.getResponseHeader("Content-Encoding")) &&
              header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
              if (from > to)
                abort(`invalid range (${from}, ${to}) or no bytes requested!`);
              if (to > datalength - 1)
                abort(`only ${datalength} bytes available! programmer error!`);
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              if (datalength !== chunkSize)
                xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
              xhr.responseType = "arraybuffer";
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
              }
              xhr.send(null);
              if (
                !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
              )
                abort("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || []);
              }
              return intArrayFromString(xhr.responseText ?? "", true);
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == "undefined")
                abort("doXHR failed!");
              return lazyArray.chunks[chunkNum];
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out(
                "LazyFiles on gzip forces download of the whole file when length is accessed",
              );
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
        if (globalThis.XMLHttpRequest) {
          if (!ENVIRONMENT_IS_WORKER)
            abort(
              "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc",
            );
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        Object.defineProperties(node, {
          usedBytes: {
            get: function () {
              return this.contents.length;
            },
          },
        });
        var stream_ops = {};
        for (const [key, fn] of Object.entries(node.stream_ops)) {
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        }
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length) return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position);
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
    };
    var SYSCALLS = {
      currentUmask: 18,
      calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);
          }
          return dir;
        }
        return dir + "/" + path;
      },
      writeStat(buf, stat) {
        HEAPU32[buf >> 2] = stat.dev;
        HEAPU32[(buf + 4) >> 2] = stat.mode;
        HEAPU32[(buf + 8) >> 2] = stat.nlink;
        HEAPU32[(buf + 12) >> 2] = stat.uid;
        HEAPU32[(buf + 16) >> 2] = stat.gid;
        HEAPU32[(buf + 20) >> 2] = stat.rdev;
        HEAP64[(buf + 24) >> 3] = BigInt(stat.size);
        HEAP32[(buf + 32) >> 2] = 4096;
        HEAP32[(buf + 36) >> 2] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        HEAP64[(buf + 40) >> 3] = BigInt(Math.floor(atime / 1e3));
        HEAPU32[(buf + 48) >> 2] = (atime % 1e3) * 1e3 * 1e3;
        HEAP64[(buf + 56) >> 3] = BigInt(Math.floor(mtime / 1e3));
        HEAPU32[(buf + 64) >> 2] = (mtime % 1e3) * 1e3 * 1e3;
        HEAP64[(buf + 72) >> 3] = BigInt(Math.floor(ctime / 1e3));
        HEAPU32[(buf + 80) >> 2] = (ctime % 1e3) * 1e3 * 1e3;
        HEAP64[(buf + 88) >> 3] = BigInt(stat.ino);
        return 0;
      },
      writeStatFs(buf, stats) {
        HEAPU32[(buf + 4) >> 2] = stats.bsize;
        HEAPU32[(buf + 60) >> 2] = stats.bsize;
        HEAP64[(buf + 8) >> 3] = BigInt(stats.blocks);
        HEAP64[(buf + 16) >> 3] = BigInt(stats.bfree);
        HEAP64[(buf + 24) >> 3] = BigInt(stats.bavail);
        HEAP64[(buf + 32) >> 3] = BigInt(stats.files);
        HEAP64[(buf + 40) >> 3] = BigInt(stats.ffree);
        HEAPU32[(buf + 48) >> 2] = stats.fsid;
        HEAPU32[(buf + 64) >> 2] = stats.flags;
        HEAPU32[(buf + 56) >> 2] = stats.namelen;
      },
      doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
      getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
      varargs: undefined,
      getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
    };
    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
          case 0: {
            var arg = syscallGetVarargI();
            if (arg < 0) {
              return -28;
            }
            while (FS.streams[arg]) {
              arg++;
            }
            var newStream;
            newStream = FS.dupStream(stream, arg);
            return newStream.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return stream.flags;
          case 4: {
            var arg = syscallGetVarargI();
            var mask = 289792;
            stream.flags = (stream.flags & ~mask) | (arg & mask);
            return 0;
          }
          case 12: {
            var arg = syscallGetVarargP();
            var offset = 0;
            HEAP16[(arg + offset) >> 1] = 2;
            return 0;
          }
          case 13:
          case 14:
            return 0;
        }
        return -28;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_fstat64(fd, buf) {
      try {
        return SYSCALLS.writeStat(buf, FS.fstat(fd));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var INT53_MAX = 9007199254740992;
    var INT53_MIN = -9007199254740992;
    var bigintToI53Checked = (num) =>
      num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
    function ___syscall_ftruncate64(fd, length) {
      length = bigintToI53Checked(length);
      try {
        if (isNaN(length)) return -22;
        FS.ftruncate(fd, length);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(
        typeof maxBytesToWrite == "number",
        "stringToUTF8 requires a third parameter that specifies the length of the output buffer",
      );
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
    function ___syscall_getdents64(fd, dirp, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        stream.getdents ||= FS.readdir(stream.path);
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var startIdx = Math.floor(off / struct_size);
        var endIdx = Math.min(
          stream.getdents.length,
          startIdx + Math.floor(count / struct_size),
        );
        for (var idx = startIdx; idx < endIdx; idx++) {
          var id;
          var type;
          var name = stream.getdents[idx];
          if (name === ".") {
            id = stream.node.id;
            type = 4;
          } else if (name === "..") {
            var lookup = FS.lookupPath(stream.path, { parent: true });
            id = lookup.node.id;
            type = 4;
          } else {
            var child;
            try {
              child = FS.lookupNode(stream.node, name);
            } catch (e) {
              if (e?.errno === 28) {
                continue;
              }
              throw e;
            }
            id = child.id;
            type = FS.isChrdev(child.mode)
              ? 2
              : FS.isDir(child.mode)
                ? 4
                : FS.isLink(child.mode)
                  ? 10
                  : 8;
          }
          assert(id);
          HEAP64[(dirp + pos) >> 3] = BigInt(id);
          HEAP64[(dirp + pos + 8) >> 3] = BigInt((idx + 1) * struct_size);
          HEAP16[(dirp + pos + 16) >> 1] = 280;
          HEAP8[dirp + pos + 18] = type;
          stringToUTF8(name, dirp + pos + 19, 256);
          pos += struct_size;
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
          case 21509: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21505: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcgets) {
              var termios = stream.tty.ops.ioctl_tcgets(stream);
              var argp = syscallGetVarargP();
              HEAP32[argp >> 2] = termios.c_iflag || 0;
              HEAP32[(argp + 4) >> 2] = termios.c_oflag || 0;
              HEAP32[(argp + 8) >> 2] = termios.c_cflag || 0;
              HEAP32[(argp + 12) >> 2] = termios.c_lflag || 0;
              for (var i = 0; i < 32; i++) {
                HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
              }
              return 0;
            }
            return 0;
          }
          case 21510:
          case 21511:
          case 21512: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tcsets) {
              var argp = syscallGetVarargP();
              var c_iflag = HEAP32[argp >> 2];
              var c_oflag = HEAP32[(argp + 4) >> 2];
              var c_cflag = HEAP32[(argp + 8) >> 2];
              var c_lflag = HEAP32[(argp + 12) >> 2];
              var c_cc = [];
              for (var i = 0; i < 32; i++) {
                c_cc.push(HEAP8[argp + i + 17]);
              }
              return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                c_iflag,
                c_oflag,
                c_cflag,
                c_lflag,
                c_cc,
              });
            }
            return 0;
          }
          case 21519: {
            if (!stream.tty) return -59;
            var argp = syscallGetVarargP();
            HEAP32[argp >> 2] = 0;
            return 0;
          }
          case 21520: {
            if (!stream.tty) return -59;
            return -28;
          }
          case 21537:
          case 21531: {
            var argp = syscallGetVarargP();
            return FS.ioctl(stream, op, argp);
          }
          case 21523: {
            if (!stream.tty) return -59;
            if (stream.tty.ops.ioctl_tiocgwinsz) {
              var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
              var argp = syscallGetVarargP();
              HEAP16[argp >> 1] = winsize[0];
              HEAP16[(argp + 2) >> 1] = winsize[1];
            }
            return 0;
          }
          case 21524: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21515: {
            if (!stream.tty) return -59;
            return 0;
          }
          default:
            return -28;
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_lstat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.writeStat(buf, FS.lstat(path));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_newfstatat(dirfd, path, buf, flags) {
      try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~6400;
        assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.writeStat(
          buf,
          nofollow ? FS.lstat(path) : FS.stat(path),
        );
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? syscallGetVarargI() : 0;
        if (flags & 64) {
          mode &= ~SYSCALLS.currentUmask;
        }
        return FS.open(path, flags, mode).fd;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_rmdir(path) {
      try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_stat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.writeStat(buf, FS.stat(path));
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function ___syscall_unlinkat(dirfd, path, flags) {
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (!flags) {
          FS.unlink(path);
        } else if (flags === 512) {
          FS.rmdir(path);
        } else {
          return -28;
        }
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var __abort_js = () => abort("native code called abort()");
    var __emscripten_throw_longjmp = () => {
      throw new EmscriptenSjLj();
    };
    function __gmtime_js(time, tmPtr) {
      time = bigintToI53Checked(time);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
      HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
      HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
      HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
      HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
      HEAP32[(tmPtr + 28) >> 2] = yday;
    }
    var isLeapYear = (year) =>
      year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var MONTH_DAYS_LEAP_CUMULATIVE = [
      0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335,
    ];
    var MONTH_DAYS_REGULAR_CUMULATIVE = [
      0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
    ];
    var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = leap
        ? MONTH_DAYS_LEAP_CUMULATIVE
        : MONTH_DAYS_REGULAR_CUMULATIVE;
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
      return yday;
    };
    function __localtime_js(time, tmPtr) {
      time = bigintToI53Checked(time);
      var date = new Date(time * 1e3);
      HEAP32[tmPtr >> 2] = date.getSeconds();
      HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
      HEAP32[(tmPtr + 8) >> 2] = date.getHours();
      HEAP32[(tmPtr + 12) >> 2] = date.getDate();
      HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
      HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
      HEAP32[(tmPtr + 24) >> 2] = date.getDay();
      var yday = ydayFromDate(date) | 0;
      HEAP32[(tmPtr + 28) >> 2] = yday;
      HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst =
        (summerOffset != winterOffset &&
          date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
      HEAP32[(tmPtr + 32) >> 2] = dst;
    }
    function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
      offset = bigintToI53Checked(offset);
      try {
        assert(!isNaN(offset));
        var stream = SYSCALLS.getStreamFromFD(fd);
        var res = FS.mmap(stream, len, offset, prot, flags);
        var ptr = res.ptr;
        HEAP32[allocated >> 2] = res.allocated;
        HEAPU32[addr >> 2] = ptr;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    function __munmap_js(addr, len, prot, flags, fd, offset) {
      offset = bigintToI53Checked(offset);
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (prot & 2) {
          SYSCALLS.doMsync(addr, stream, len, flags, offset);
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno;
      }
    }
    var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      var extractZone = (timezoneOffset) => {
        var sign = timezoneOffset >= 0 ? "-" : "+";
        var absOffset = Math.abs(timezoneOffset);
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
        return `UTC${sign}${hours}${minutes}`;
      };
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(
        lengthBytesUTF8(winterName) <= 16,
        `timezone name truncated to fit in TZNAME_MAX (${winterName})`,
      );
      assert(
        lengthBytesUTF8(summerName) <= 16,
        `timezone name truncated to fit in TZNAME_MAX (${summerName})`,
      );
      if (summerOffset < winterOffset) {
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };
    var _emscripten_date_now = () => Date.now();
    var getHeapMax = () => 2147483648;
    var growMemory = (size) => {
      var oldHeapSize = wasmMemory.buffer.byteLength;
      var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {
        err(
          `growMemory: Attempted to grow heap from ${oldHeapSize} bytes to ${size} bytes, but got error: ${e}`,
        );
      }
    };
    var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      assert(requestedSize > oldSize);
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(
          `Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`,
        );
        return false;
      }
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296,
        );
        var newSize = Math.min(
          maxHeapSize,
          alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536),
        );
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      err(
        `Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`,
      );
      return false;
    };
    var ENV = {};
    var getExecutableName = () => thisProgram;
    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var lang =
          (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
        var env = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: lang,
          _: getExecutableName(),
        };
        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
    var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(__environ + envp) >> 2] = ptr;
        bufSize += stringToUTF8(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    };
    var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF8(string) + 1;
      }
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    };
    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
        if (typeof offset != "undefined") {
          offset += curr;
        }
      }
      return ret;
    };
    function _fd_read(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    function _fd_seek(fd, offset, whence, newOffset) {
      offset = bigintToI53Checked(offset);
      try {
        if (isNaN(offset)) return 22;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        HEAP64[newOffset >> 3] = BigInt(stream.position);
        if (stream.getdents && offset === 0 && whence === 0)
          stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    function _fd_sync(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var rtn = stream.stream_ops?.fsync?.(stream);
        return rtn;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) {
          break;
        }
        if (typeof offset != "undefined") {
          offset += curr;
        }
      }
      return ret;
    };
    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno;
      }
    }
    var wasmTableMirror = [];
    var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, "table mirror is out of date");
      return func;
    };
    var getCFunc = (ident) => {
      var func = Module["_" + ident];
      assert(
        func,
        `Cannot call unknown function ${ident}, make sure it is exported`,
      );
      return func;
    };
    var writeArrayToMemory = (array, buffer) => {
      assert(
        array.length >= 0,
        "writeArrayToMemory array must have a length (should be an array or typed array)",
      );
      HEAP8.set(array, buffer);
    };
    var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
    var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
    var ccall = (ident, returnType, argTypes, args, opts) => {
      var toC = {
        string: (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) {
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        array: (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        },
      };
      function convertReturnValue(ret) {
        if (returnType === "string") {
          return UTF8ToString(ret);
        }
        if (returnType === "boolean") return Boolean(ret);
        return ret;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== "array", 'return type should not be "array"');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
      ret = onDone(ret);
      return ret;
    };
    var cwrap =
      (ident, returnType, argTypes, opts) =>
      (...args) =>
        ccall(ident, returnType, argTypes, args, opts);
    var updateTableMap = (offset, count) => {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    };
    var functionsInTableMap;
    var getFunctionAddress = (func) => {
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      return functionsInTableMap.get(func) || 0;
    };
    var freeTableIndexes = [];
    var getEmptyTableSlot = () => {
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      try {
        return wasmTable["grow"](1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        abort("Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.");
      }
    };
    var setWasmTableEntry = (idx, func) => {
      wasmTable.set(idx, func);
      wasmTableMirror[idx] = wasmTable.get(idx);
    };
    var uleb128EncodeWithLen = (arr) => {
      const n = arr.length;
      assert(n < 16384);
      return [(n % 128) | 128, n >> 7, ...arr];
    };
    var wasmTypeCodes = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
    var generateTypePack = (types) =>
      uleb128EncodeWithLen(
        Array.from(types, (type) => {
          var code = wasmTypeCodes[type];
          assert(code, `invalid signature char: ${type}`);
          return code;
        }),
      );
    var convertJsFunctionToWasm = (func, sig) => {
      var bytes = Uint8Array.of(
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        ...uleb128EncodeWithLen([
          1,
          96,
          ...generateTypePack(sig.slice(1)),
          ...generateTypePack(sig[0] === "v" ? "" : sig[0]),
        ]),
        2,
        7,
        1,
        1,
        101,
        1,
        102,
        0,
        0,
        7,
        5,
        1,
        1,
        102,
        0,
        0,
      );
      var module = new WebAssembly.Module(bytes);
      var instance = new WebAssembly.Instance(module, { e: { f: func } });
      var wrappedFunc = instance.exports["f"];
      return wrappedFunc;
    };
    var addFunction = (func, sig) => {
      assert(typeof func != "undefined");
      var rtn = getFunctionAddress(func);
      if (rtn) {
        return rtn;
      }
      var ret = getEmptyTableSlot();
      try {
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        assert(
          typeof sig != "undefined",
          "Missing signature argument to addFunction: " + func,
        );
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
      functionsInTableMap.set(func, ret);
      return ret;
    };
    var removeFunction = (index) => {
      functionsInTableMap.delete(getWasmTableEntry(index));
      setWasmTableEntry(index, null);
      freeTableIndexes.push(index);
    };
    var FS_createPath = (...args) => FS.createPath(...args);
    var FS_unlink = (...args) => FS.unlink(...args);
    var FS_createLazyFile = (...args) => FS.createLazyFile(...args);
    var FS_createDevice = (...args) => FS.createDevice(...args);
    FS.createPreloadedFile = FS_createPreloadedFile;
    FS.preloadFile = FS_preloadFile;
    FS.staticInit();
    {
      if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
      if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
      if (Module["print"]) out = Module["print"];
      if (Module["printErr"]) err = Module["printErr"];
      if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
      checkIncomingModuleAPI();
      if (Module["arguments"]) programArgs = Module["arguments"];
      if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
      assert(
        typeof Module["memoryInitializerPrefixURL"] == "undefined",
        "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead",
      );
      assert(
        typeof Module["pthreadMainPrefixURL"] == "undefined",
        "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead",
      );
      assert(
        typeof Module["cdInitializerPrefixURL"] == "undefined",
        "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead",
      );
      assert(
        typeof Module["filePackagePrefixURL"] == "undefined",
        "Module.filePackagePrefixURL option was removed, use Module.locateFile instead",
      );
      assert(
        typeof Module["read"] == "undefined",
        "Module.read option was removed",
      );
      assert(
        typeof Module["readAsync"] == "undefined",
        "Module.readAsync option was removed (modify readAsync in JS)",
      );
      assert(
        typeof Module["readBinary"] == "undefined",
        "Module.readBinary option was removed (modify readBinary in JS)",
      );
      assert(
        typeof Module["setWindowTitle"] == "undefined",
        "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)",
      );
      assert(
        typeof Module["TOTAL_MEMORY"] == "undefined",
        "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY",
      );
      assert(
        typeof Module["ENVIRONMENT"] == "undefined",
        "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)",
      );
      assert(
        typeof Module["STACK_SIZE"] == "undefined",
        "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time",
      );
      assert(
        typeof Module["wasmMemory"] == "undefined",
        "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally",
      );
      assert(
        typeof Module["INITIAL_MEMORY"] == "undefined",
        "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically",
      );
      if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function")
          Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
          Module["preInit"].shift()();
        }
      }
      consumedModuleProp("preInit");
    }
    Module["wasmExports"] = wasmExports;
    Module["addRunDependency"] = addRunDependency;
    Module["removeRunDependency"] = removeRunDependency;
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    Module["addFunction"] = addFunction;
    Module["removeFunction"] = removeFunction;
    Module["setValue"] = setValue;
    Module["FS_preloadFile"] = FS_preloadFile;
    Module["FS_unlink"] = FS_unlink;
    Module["FS_createPath"] = FS_createPath;
    Module["FS_createDevice"] = FS_createDevice;
    Module["FS"] = FS;
    Module["FS_createDataFile"] = FS_createDataFile;
    Module["FS_createLazyFile"] = FS_createLazyFile;
    var missingLibrarySymbols = [
      "writeI53ToI64",
      "writeI53ToI64Clamped",
      "writeI53ToI64Signaling",
      "writeI53ToU64Clamped",
      "writeI53ToU64Signaling",
      "readI53FromI64",
      "readI53FromU64",
      "convertI32PairToI53",
      "convertI32PairToI53Checked",
      "convertU32PairToI53",
      "getTempRet0",
      "setTempRet0",
      "createNamedFunction",
      "exitJS",
      "withStackSave",
      "inetPton4",
      "inetNtop4",
      "inetPton6",
      "inetNtop6",
      "readSockaddr",
      "writeSockaddr",
      "readEmAsmArgs",
      "jstoi_q",
      "autoResumeAudioContext",
      "getDynCaller",
      "dynCall",
      "handleException",
      "keepRuntimeAlive",
      "runtimeKeepalivePush",
      "runtimeKeepalivePop",
      "callUserCallback",
      "maybeExit",
      "asmjsMangle",
      "HandleAllocator",
      "addOnInit",
      "addOnPostCtor",
      "addOnPreMain",
      "addOnExit",
      "STACK_SIZE",
      "STACK_ALIGN",
      "POINTER_SIZE",
      "ASSERTIONS",
      "intArrayToString",
      "AsciiToString",
      "stringToAscii",
      "UTF16ToString",
      "stringToUTF16",
      "lengthBytesUTF16",
      "UTF32ToString",
      "stringToUTF32",
      "lengthBytesUTF32",
      "stringToNewUTF8",
      "registerKeyEventCallback",
      "maybeCStringToJsString",
      "findEventTarget",
      "getBoundingClientRect",
      "fillMouseEventData",
      "registerMouseEventCallback",
      "registerWheelEventCallback",
      "registerUiEventCallback",
      "registerFocusEventCallback",
      "fillDeviceOrientationEventData",
      "registerDeviceOrientationEventCallback",
      "fillDeviceMotionEventData",
      "registerDeviceMotionEventCallback",
      "screenOrientation",
      "fillOrientationChangeEventData",
      "registerOrientationChangeEventCallback",
      "fillFullscreenChangeEventData",
      "registerFullscreenChangeEventCallback",
      "JSEvents_requestFullscreen",
      "JSEvents_resizeCanvasForFullscreen",
      "registerRestoreOldStyle",
      "hideEverythingExceptGivenElement",
      "restoreHiddenElements",
      "setLetterbox",
      "softFullscreenResizeWebGLRenderTarget",
      "doRequestFullscreen",
      "fillPointerlockChangeEventData",
      "registerPointerlockChangeEventCallback",
      "registerPointerlockErrorEventCallback",
      "requestPointerLock",
      "fillVisibilityChangeEventData",
      "registerVisibilityChangeEventCallback",
      "registerTouchEventCallback",
      "fillGamepadEventData",
      "registerGamepadEventCallback",
      "registerBeforeUnloadEventCallback",
      "fillBatteryEventData",
      "registerBatteryEventCallback",
      "setCanvasElementSize",
      "getCanvasElementSize",
      "jsStackTrace",
      "getCallstack",
      "convertPCtoSourceLocation",
      "checkWasiClock",
      "wasiRightsToMuslOFlags",
      "wasiOFlagsToMuslOFlags",
      "safeSetTimeout",
      "setImmediateWrapped",
      "safeRequestAnimationFrame",
      "clearImmediateWrapped",
      "registerPostMainLoop",
      "registerPreMainLoop",
      "getPromise",
      "makePromise",
      "addPromise",
      "idsToPromises",
      "makePromiseCallback",
      "ExceptionInfo",
      "findMatchingCatch",
      "incrementUncaughtExceptionCount",
      "decrementUncaughtExceptionCount",
      "Browser_asyncPrepareDataCounter",
      "arraySum",
      "addDays",
      "getSocketFromFD",
      "getSocketAddress",
      "FS_mkdirTree",
      "_setNetworkCallback",
      "heapObjectForWebGLType",
      "toTypedArrayIndex",
      "webgl_enable_ANGLE_instanced_arrays",
      "webgl_enable_OES_vertex_array_object",
      "webgl_enable_WEBGL_draw_buffers",
      "webgl_enable_WEBGL_multi_draw",
      "webgl_enable_EXT_polygon_offset_clamp",
      "webgl_enable_EXT_clip_control",
      "webgl_enable_WEBGL_polygon_mode",
      "emscriptenWebGLGet",
      "computeUnpackAlignedImageSize",
      "colorChannelsInGlTextureFormat",
      "emscriptenWebGLGetTexPixelData",
      "emscriptenWebGLGetUniform",
      "webglGetProgramUniformLocation",
      "webglGetUniformLocation",
      "webglPrepareUniformLocationsBeforeFirstUse",
      "webglGetLeftBracePos",
      "emscriptenWebGLGetVertexAttrib",
      "__glGetActiveAttribOrUniform",
      "writeGLArray",
      "registerWebGlEventCallback",
      "runAndAbortIfError",
      "ALLOC_NORMAL",
      "ALLOC_STACK",
      "allocate",
      "writeStringToMemory",
      "writeAsciiToMemory",
      "allocateUTF8",
      "allocateUTF8OnStack",
      "demangle",
      "stackTrace",
      "getNativeTypeSize",
    ];
    missingLibrarySymbols.forEach(missingLibrarySymbol);
    var unexportedSymbols = [
      "run",
      "out",
      "err",
      "callMain",
      "abort",
      "writeStackCookie",
      "checkStackCookie",
      "INT53_MAX",
      "INT53_MIN",
      "bigintToI53Checked",
      "HEAP64",
      "HEAPU64",
      "stackSave",
      "stackRestore",
      "stackAlloc",
      "ptrToString",
      "zeroMemory",
      "getHeapMax",
      "growMemory",
      "ENV",
      "ERRNO_CODES",
      "strError",
      "DNS",
      "Protocols",
      "Sockets",
      "timers",
      "warnOnce",
      "readEmAsmArgsArray",
      "getExecutableName",
      "asyncLoad",
      "alignMemory",
      "mmapAlloc",
      "wasmTable",
      "wasmMemory",
      "getUniqueRunDependency",
      "noExitRuntime",
      "addOnPreRun",
      "addOnPostRun",
      "convertJsFunctionToWasm",
      "freeTableIndexes",
      "functionsInTableMap",
      "getEmptyTableSlot",
      "updateTableMap",
      "getFunctionAddress",
      "getValue",
      "PATH",
      "PATH_FS",
      "UTF8Decoder",
      "UTF8ArrayToString",
      "UTF8ToString",
      "stringToUTF8Array",
      "stringToUTF8",
      "lengthBytesUTF8",
      "intArrayFromString",
      "UTF16Decoder",
      "stringToUTF8OnStack",
      "writeArrayToMemory",
      "JSEvents",
      "specialHTMLTargets",
      "findCanvasEventTarget",
      "currentFullscreenStrategy",
      "restoreOldWindowedStyle",
      "UNWIND_CACHE",
      "ExitStatus",
      "getEnvStrings",
      "doReadv",
      "doWritev",
      "initRandomFill",
      "randomFill",
      "emSetImmediate",
      "emClearImmediate_deps",
      "emClearImmediate",
      "promiseMap",
      "uncaughtExceptionCount",
      "exceptionCaught",
      "Browser",
      "requestFullscreen",
      "requestFullScreen",
      "setCanvasSize",
      "getUserMedia",
      "createContext",
      "getPreloadedImageData__data",
      "wget",
      "MONTH_DAYS_REGULAR",
      "MONTH_DAYS_LEAP",
      "MONTH_DAYS_REGULAR_CUMULATIVE",
      "MONTH_DAYS_LEAP_CUMULATIVE",
      "isLeapYear",
      "ydayFromDate",
      "SYSCALLS",
      "preloadPlugins",
      "FS_createPreloadedFile",
      "FS_modeStringToFlags",
      "FS_getMode",
      "FS_fileDataToTypedArray",
      "FS_stdin_getChar_buffer",
      "FS_stdin_getChar",
      "FS_readFile",
      "FS_root",
      "FS_mounts",
      "FS_devices",
      "FS_streams",
      "FS_nextInode",
      "FS_nameTable",
      "FS_currentPath",
      "FS_initialized",
      "FS_ignorePermissions",
      "FS_filesystems",
      "FS_syncFSRequests",
      "FS_lookupPath",
      "FS_getPath",
      "FS_hashName",
      "FS_hashAddNode",
      "FS_hashRemoveNode",
      "FS_lookupNode",
      "FS_createNode",
      "FS_destroyNode",
      "FS_isRoot",
      "FS_isMountpoint",
      "FS_isFile",
      "FS_isDir",
      "FS_isLink",
      "FS_isChrdev",
      "FS_isBlkdev",
      "FS_isFIFO",
      "FS_isSocket",
      "FS_flagsToPermissionString",
      "FS_nodePermissions",
      "FS_mayLookup",
      "FS_mayCreate",
      "FS_mayDelete",
      "FS_mayOpen",
      "FS_checkOpExists",
      "FS_nextfd",
      "FS_getStreamChecked",
      "FS_getStream",
      "FS_createStream",
      "FS_closeStream",
      "FS_dupStream",
      "FS_doSetAttr",
      "FS_chrdev_stream_ops",
      "FS_major",
      "FS_minor",
      "FS_makedev",
      "FS_registerDevice",
      "FS_getDevice",
      "FS_getMounts",
      "FS_syncfs",
      "FS_mount",
      "FS_unmount",
      "FS_lookup",
      "FS_mknod",
      "FS_statfs",
      "FS_statfsStream",
      "FS_statfsNode",
      "FS_create",
      "FS_mkdir",
      "FS_mkdev",
      "FS_symlink",
      "FS_rename",
      "FS_rmdir",
      "FS_readdir",
      "FS_readlink",
      "FS_stat",
      "FS_fstat",
      "FS_lstat",
      "FS_doChmod",
      "FS_chmod",
      "FS_lchmod",
      "FS_fchmod",
      "FS_doChown",
      "FS_chown",
      "FS_lchown",
      "FS_fchown",
      "FS_doTruncate",
      "FS_truncate",
      "FS_ftruncate",
      "FS_utime",
      "FS_open",
      "FS_close",
      "FS_isClosed",
      "FS_llseek",
      "FS_read",
      "FS_write",
      "FS_mmap",
      "FS_msync",
      "FS_ioctl",
      "FS_writeFile",
      "FS_cwd",
      "FS_chdir",
      "FS_createDefaultDirectories",
      "FS_createDefaultDevices",
      "FS_createSpecialDirectories",
      "FS_createStandardStreams",
      "FS_staticInit",
      "FS_init",
      "FS_quit",
      "FS_findObject",
      "FS_analyzePath",
      "FS_createFile",
      "FS_forceLoadFile",
      "MEMFS",
      "TTY",
      "PIPEFS",
      "SOCKFS",
      "tempFixedLengthArray",
      "miniTempWebGLFloatBuffers",
      "miniTempWebGLIntBuffers",
      "GL",
      "AL",
      "GLUT",
      "EGL",
      "GLEW",
      "IDBStore",
      "SDL",
      "SDL_gfx",
      "print",
      "printErr",
      "jstoi_s",
    ];
    unexportedSymbols.forEach(unexportedRuntimeSymbol);
    function checkIncomingModuleAPI() {
      ignoredModuleProp("fetchSettings");
      ignoredModuleProp("logReadFiles");
      ignoredModuleProp("loadSplitModule");
      ignoredModuleProp("onMalloc");
      ignoredModuleProp("onRealloc");
      ignoredModuleProp("onFree");
      ignoredModuleProp("onSbrkGrow");
    }
    var _PDFium_Init = (Module["_PDFium_Init"] =
      makeInvalidEarlyAccess("_PDFium_Init"));
    var _FPDF_InitLibraryWithConfig = (Module["_FPDF_InitLibraryWithConfig"] =
      makeInvalidEarlyAccess("_FPDF_InitLibraryWithConfig"));
    var _FPDFAnnot_IsSupportedSubtype = (Module[
      "_FPDFAnnot_IsSupportedSubtype"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_IsSupportedSubtype"));
    var _FPDFPage_CreateAnnot = (Module["_FPDFPage_CreateAnnot"] =
      makeInvalidEarlyAccess("_FPDFPage_CreateAnnot"));
    var _FPDFPage_GetAnnotCount = (Module["_FPDFPage_GetAnnotCount"] =
      makeInvalidEarlyAccess("_FPDFPage_GetAnnotCount"));
    var _FPDFPage_GetAnnot = (Module["_FPDFPage_GetAnnot"] =
      makeInvalidEarlyAccess("_FPDFPage_GetAnnot"));
    var _FPDFPage_GetAnnotIndex = (Module["_FPDFPage_GetAnnotIndex"] =
      makeInvalidEarlyAccess("_FPDFPage_GetAnnotIndex"));
    var _FPDFPage_CloseAnnot = (Module["_FPDFPage_CloseAnnot"] =
      makeInvalidEarlyAccess("_FPDFPage_CloseAnnot"));
    var _FPDFPage_RemoveAnnot = (Module["_FPDFPage_RemoveAnnot"] =
      makeInvalidEarlyAccess("_FPDFPage_RemoveAnnot"));
    var _FPDFAnnot_GetSubtype = (Module["_FPDFAnnot_GetSubtype"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetSubtype"));
    var _FPDFAnnot_IsObjectSupportedSubtype = (Module[
      "_FPDFAnnot_IsObjectSupportedSubtype"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_IsObjectSupportedSubtype"));
    var _FPDFAnnot_UpdateObject = (Module["_FPDFAnnot_UpdateObject"] =
      makeInvalidEarlyAccess("_FPDFAnnot_UpdateObject"));
    var _FPDFAnnot_AddInkStroke = (Module["_FPDFAnnot_AddInkStroke"] =
      makeInvalidEarlyAccess("_FPDFAnnot_AddInkStroke"));
    var _FPDFAnnot_RemoveInkList = (Module["_FPDFAnnot_RemoveInkList"] =
      makeInvalidEarlyAccess("_FPDFAnnot_RemoveInkList"));
    var _FPDFAnnot_AppendObject = (Module["_FPDFAnnot_AppendObject"] =
      makeInvalidEarlyAccess("_FPDFAnnot_AppendObject"));
    var _FPDFAnnot_GetObjectCount = (Module["_FPDFAnnot_GetObjectCount"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetObjectCount"));
    var _FPDFAnnot_GetObject = (Module["_FPDFAnnot_GetObject"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetObject"));
    var _FPDFAnnot_RemoveObject = (Module["_FPDFAnnot_RemoveObject"] =
      makeInvalidEarlyAccess("_FPDFAnnot_RemoveObject"));
    var _FPDFAnnot_SetColor = (Module["_FPDFAnnot_SetColor"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetColor"));
    var _FPDFAnnot_GetColor = (Module["_FPDFAnnot_GetColor"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetColor"));
    var _FPDFAnnot_HasAttachmentPoints = (Module[
      "_FPDFAnnot_HasAttachmentPoints"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_HasAttachmentPoints"));
    var _FPDFAnnot_SetAttachmentPoints = (Module[
      "_FPDFAnnot_SetAttachmentPoints"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_SetAttachmentPoints"));
    var _FPDFAnnot_AppendAttachmentPoints = (Module[
      "_FPDFAnnot_AppendAttachmentPoints"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_AppendAttachmentPoints"));
    var _FPDFAnnot_CountAttachmentPoints = (Module[
      "_FPDFAnnot_CountAttachmentPoints"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_CountAttachmentPoints"));
    var _FPDFAnnot_GetAttachmentPoints = (Module[
      "_FPDFAnnot_GetAttachmentPoints"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetAttachmentPoints"));
    var _FPDFAnnot_SetRect = (Module["_FPDFAnnot_SetRect"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetRect"));
    var _FPDFAnnot_GetRect = (Module["_FPDFAnnot_GetRect"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetRect"));
    var _FPDFAnnot_GetVertices = (Module["_FPDFAnnot_GetVertices"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetVertices"));
    var _FPDFAnnot_GetInkListCount = (Module["_FPDFAnnot_GetInkListCount"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetInkListCount"));
    var _FPDFAnnot_GetInkListPath = (Module["_FPDFAnnot_GetInkListPath"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetInkListPath"));
    var _FPDFAnnot_GetLine = (Module["_FPDFAnnot_GetLine"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetLine"));
    var _FPDFAnnot_SetBorder = (Module["_FPDFAnnot_SetBorder"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetBorder"));
    var _FPDFAnnot_GetBorder = (Module["_FPDFAnnot_GetBorder"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetBorder"));
    var _FPDFAnnot_HasKey = (Module["_FPDFAnnot_HasKey"] =
      makeInvalidEarlyAccess("_FPDFAnnot_HasKey"));
    var _FPDFAnnot_GetValueType = (Module["_FPDFAnnot_GetValueType"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetValueType"));
    var _FPDFAnnot_SetStringValue = (Module["_FPDFAnnot_SetStringValue"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetStringValue"));
    var _FPDFAnnot_GetStringValue = (Module["_FPDFAnnot_GetStringValue"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetStringValue"));
    var _FPDFAnnot_GetNumberValue = (Module["_FPDFAnnot_GetNumberValue"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetNumberValue"));
    var _FPDFAnnot_SetAP = (Module["_FPDFAnnot_SetAP"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetAP"));
    var _FPDFAnnot_GetAP = (Module["_FPDFAnnot_GetAP"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetAP"));
    var _FPDFAnnot_GetLinkedAnnot = (Module["_FPDFAnnot_GetLinkedAnnot"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetLinkedAnnot"));
    var _FPDFAnnot_GetFlags = (Module["_FPDFAnnot_GetFlags"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFlags"));
    var _FPDFAnnot_SetFlags = (Module["_FPDFAnnot_SetFlags"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetFlags"));
    var _FPDFAnnot_GetFormFieldFlags = (Module["_FPDFAnnot_GetFormFieldFlags"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldFlags"));
    var _FPDFAnnot_SetFormFieldFlags = (Module["_FPDFAnnot_SetFormFieldFlags"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetFormFieldFlags"));
    var _FPDFAnnot_GetFormFieldAtPoint = (Module[
      "_FPDFAnnot_GetFormFieldAtPoint"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldAtPoint"));
    var _FPDFAnnot_GetFormFieldName = (Module["_FPDFAnnot_GetFormFieldName"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldName"));
    var _FPDFAnnot_GetFormFieldType = (Module["_FPDFAnnot_GetFormFieldType"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldType"));
    var _FPDFAnnot_GetFormAdditionalActionJavaScript = (Module[
      "_FPDFAnnot_GetFormAdditionalActionJavaScript"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormAdditionalActionJavaScript"));
    var _FPDFAnnot_GetFormFieldAlternateName = (Module[
      "_FPDFAnnot_GetFormFieldAlternateName"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldAlternateName"));
    var _FPDFAnnot_GetFormFieldValue = (Module["_FPDFAnnot_GetFormFieldValue"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldValue"));
    var _FPDFAnnot_GetOptionCount = (Module["_FPDFAnnot_GetOptionCount"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetOptionCount"));
    var _FPDFAnnot_GetOptionLabel = (Module["_FPDFAnnot_GetOptionLabel"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetOptionLabel"));
    var _FPDFAnnot_IsOptionSelected = (Module["_FPDFAnnot_IsOptionSelected"] =
      makeInvalidEarlyAccess("_FPDFAnnot_IsOptionSelected"));
    var _FPDFAnnot_GetFontSize = (Module["_FPDFAnnot_GetFontSize"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFontSize"));
    var _FPDFAnnot_SetFontColor = (Module["_FPDFAnnot_SetFontColor"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetFontColor"));
    var _FPDFAnnot_GetFontColor = (Module["_FPDFAnnot_GetFontColor"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFontColor"));
    var _FPDFAnnot_IsChecked = (Module["_FPDFAnnot_IsChecked"] =
      makeInvalidEarlyAccess("_FPDFAnnot_IsChecked"));
    var _FPDFAnnot_SetFocusableSubtypes = (Module[
      "_FPDFAnnot_SetFocusableSubtypes"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_SetFocusableSubtypes"));
    var _FPDFAnnot_GetFocusableSubtypesCount = (Module[
      "_FPDFAnnot_GetFocusableSubtypesCount"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFocusableSubtypesCount"));
    var _FPDFAnnot_GetFocusableSubtypes = (Module[
      "_FPDFAnnot_GetFocusableSubtypes"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFocusableSubtypes"));
    var _FPDFAnnot_GetLink = (Module["_FPDFAnnot_GetLink"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetLink"));
    var _FPDFAnnot_GetFormControlCount = (Module[
      "_FPDFAnnot_GetFormControlCount"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormControlCount"));
    var _FPDFAnnot_GetFormControlIndex = (Module[
      "_FPDFAnnot_GetFormControlIndex"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormControlIndex"));
    var _FPDFAnnot_GetFormFieldExportValue = (Module[
      "_FPDFAnnot_GetFormFieldExportValue"
    ] = makeInvalidEarlyAccess("_FPDFAnnot_GetFormFieldExportValue"));
    var _FPDFAnnot_SetURI = (Module["_FPDFAnnot_SetURI"] =
      makeInvalidEarlyAccess("_FPDFAnnot_SetURI"));
    var _FPDFAnnot_GetFileAttachment = (Module["_FPDFAnnot_GetFileAttachment"] =
      makeInvalidEarlyAccess("_FPDFAnnot_GetFileAttachment"));
    var _FPDFAnnot_AddFileAttachment = (Module["_FPDFAnnot_AddFileAttachment"] =
      makeInvalidEarlyAccess("_FPDFAnnot_AddFileAttachment"));
    var _FPDFDoc_GetAttachmentCount = (Module["_FPDFDoc_GetAttachmentCount"] =
      makeInvalidEarlyAccess("_FPDFDoc_GetAttachmentCount"));
    var _FPDFDoc_AddAttachment = (Module["_FPDFDoc_AddAttachment"] =
      makeInvalidEarlyAccess("_FPDFDoc_AddAttachment"));
    var _FPDFDoc_GetAttachment = (Module["_FPDFDoc_GetAttachment"] =
      makeInvalidEarlyAccess("_FPDFDoc_GetAttachment"));
    var _FPDFDoc_DeleteAttachment = (Module["_FPDFDoc_DeleteAttachment"] =
      makeInvalidEarlyAccess("_FPDFDoc_DeleteAttachment"));
    var _FPDFAttachment_GetName = (Module["_FPDFAttachment_GetName"] =
      makeInvalidEarlyAccess("_FPDFAttachment_GetName"));
    var _FPDFAttachment_HasKey = (Module["_FPDFAttachment_HasKey"] =
      makeInvalidEarlyAccess("_FPDFAttachment_HasKey"));
    var _FPDFAttachment_GetValueType = (Module["_FPDFAttachment_GetValueType"] =
      makeInvalidEarlyAccess("_FPDFAttachment_GetValueType"));
    var _FPDFAttachment_SetStringValue = (Module[
      "_FPDFAttachment_SetStringValue"
    ] = makeInvalidEarlyAccess("_FPDFAttachment_SetStringValue"));
    var _FPDFAttachment_GetStringValue = (Module[
      "_FPDFAttachment_GetStringValue"
    ] = makeInvalidEarlyAccess("_FPDFAttachment_GetStringValue"));
    var _FPDFAttachment_SetFile = (Module["_FPDFAttachment_SetFile"] =
      makeInvalidEarlyAccess("_FPDFAttachment_SetFile"));
    var _FPDFAttachment_GetFile = (Module["_FPDFAttachment_GetFile"] =
      makeInvalidEarlyAccess("_FPDFAttachment_GetFile"));
    var _FPDFAttachment_GetSubtype = (Module["_FPDFAttachment_GetSubtype"] =
      makeInvalidEarlyAccess("_FPDFAttachment_GetSubtype"));
    var _FPDFCatalog_IsTagged = (Module["_FPDFCatalog_IsTagged"] =
      makeInvalidEarlyAccess("_FPDFCatalog_IsTagged"));
    var _FPDFCatalog_GetLanguage = (Module["_FPDFCatalog_GetLanguage"] =
      makeInvalidEarlyAccess("_FPDFCatalog_GetLanguage"));
    var _FPDFCatalog_SetLanguage = (Module["_FPDFCatalog_SetLanguage"] =
      makeInvalidEarlyAccess("_FPDFCatalog_SetLanguage"));
    var _FPDFAvail_Create = (Module["_FPDFAvail_Create"] =
      makeInvalidEarlyAccess("_FPDFAvail_Create"));
    var _FPDFAvail_Destroy = (Module["_FPDFAvail_Destroy"] =
      makeInvalidEarlyAccess("_FPDFAvail_Destroy"));
    var _FPDFAvail_IsDocAvail = (Module["_FPDFAvail_IsDocAvail"] =
      makeInvalidEarlyAccess("_FPDFAvail_IsDocAvail"));
    var _FPDFAvail_GetDocument = (Module["_FPDFAvail_GetDocument"] =
      makeInvalidEarlyAccess("_FPDFAvail_GetDocument"));
    var _FPDFAvail_GetFirstPageNum = (Module["_FPDFAvail_GetFirstPageNum"] =
      makeInvalidEarlyAccess("_FPDFAvail_GetFirstPageNum"));
    var _FPDFAvail_IsPageAvail = (Module["_FPDFAvail_IsPageAvail"] =
      makeInvalidEarlyAccess("_FPDFAvail_IsPageAvail"));
    var _FPDFAvail_IsFormAvail = (Module["_FPDFAvail_IsFormAvail"] =
      makeInvalidEarlyAccess("_FPDFAvail_IsFormAvail"));
    var _FPDFAvail_IsLinearized = (Module["_FPDFAvail_IsLinearized"] =
      makeInvalidEarlyAccess("_FPDFAvail_IsLinearized"));
    var _FPDFBookmark_GetFirstChild = (Module["_FPDFBookmark_GetFirstChild"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetFirstChild"));
    var _FPDFBookmark_GetNextSibling = (Module["_FPDFBookmark_GetNextSibling"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetNextSibling"));
    var _FPDFBookmark_GetTitle = (Module["_FPDFBookmark_GetTitle"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetTitle"));
    var _FPDFBookmark_GetCount = (Module["_FPDFBookmark_GetCount"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetCount"));
    var _FPDFBookmark_Find = (Module["_FPDFBookmark_Find"] =
      makeInvalidEarlyAccess("_FPDFBookmark_Find"));
    var _FPDFBookmark_GetDest = (Module["_FPDFBookmark_GetDest"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetDest"));
    var _FPDFBookmark_GetAction = (Module["_FPDFBookmark_GetAction"] =
      makeInvalidEarlyAccess("_FPDFBookmark_GetAction"));
    var _FPDFAction_GetType = (Module["_FPDFAction_GetType"] =
      makeInvalidEarlyAccess("_FPDFAction_GetType"));
    var _FPDFAction_GetDest = (Module["_FPDFAction_GetDest"] =
      makeInvalidEarlyAccess("_FPDFAction_GetDest"));
    var _FPDFAction_GetFilePath = (Module["_FPDFAction_GetFilePath"] =
      makeInvalidEarlyAccess("_FPDFAction_GetFilePath"));
    var _FPDFAction_GetURIPath = (Module["_FPDFAction_GetURIPath"] =
      makeInvalidEarlyAccess("_FPDFAction_GetURIPath"));
    var _FPDFDest_GetDestPageIndex = (Module["_FPDFDest_GetDestPageIndex"] =
      makeInvalidEarlyAccess("_FPDFDest_GetDestPageIndex"));
    var _FPDFDest_GetView = (Module["_FPDFDest_GetView"] =
      makeInvalidEarlyAccess("_FPDFDest_GetView"));
    var _FPDFDest_GetLocationInPage = (Module["_FPDFDest_GetLocationInPage"] =
      makeInvalidEarlyAccess("_FPDFDest_GetLocationInPage"));
    var _FPDFLink_GetLinkAtPoint = (Module["_FPDFLink_GetLinkAtPoint"] =
      makeInvalidEarlyAccess("_FPDFLink_GetLinkAtPoint"));
    var _FPDFLink_GetLinkZOrderAtPoint = (Module[
      "_FPDFLink_GetLinkZOrderAtPoint"
    ] = makeInvalidEarlyAccess("_FPDFLink_GetLinkZOrderAtPoint"));
    var _FPDFLink_GetDest = (Module["_FPDFLink_GetDest"] =
      makeInvalidEarlyAccess("_FPDFLink_GetDest"));
    var _FPDFLink_GetAction = (Module["_FPDFLink_GetAction"] =
      makeInvalidEarlyAccess("_FPDFLink_GetAction"));
    var _FPDFLink_Enumerate = (Module["_FPDFLink_Enumerate"] =
      makeInvalidEarlyAccess("_FPDFLink_Enumerate"));
    var _FPDFLink_GetAnnot = (Module["_FPDFLink_GetAnnot"] =
      makeInvalidEarlyAccess("_FPDFLink_GetAnnot"));
    var _FPDFLink_GetAnnotRect = (Module["_FPDFLink_GetAnnotRect"] =
      makeInvalidEarlyAccess("_FPDFLink_GetAnnotRect"));
    var _FPDFLink_CountQuadPoints = (Module["_FPDFLink_CountQuadPoints"] =
      makeInvalidEarlyAccess("_FPDFLink_CountQuadPoints"));
    var _FPDFLink_GetQuadPoints = (Module["_FPDFLink_GetQuadPoints"] =
      makeInvalidEarlyAccess("_FPDFLink_GetQuadPoints"));
    var _FPDF_GetPageAAction = (Module["_FPDF_GetPageAAction"] =
      makeInvalidEarlyAccess("_FPDF_GetPageAAction"));
    var _FPDF_GetFileIdentifier = (Module["_FPDF_GetFileIdentifier"] =
      makeInvalidEarlyAccess("_FPDF_GetFileIdentifier"));
    var _FPDF_GetMetaText = (Module["_FPDF_GetMetaText"] =
      makeInvalidEarlyAccess("_FPDF_GetMetaText"));
    var _FPDF_GetPageLabel = (Module["_FPDF_GetPageLabel"] =
      makeInvalidEarlyAccess("_FPDF_GetPageLabel"));
    var _FPDFPageObj_NewImageObj = (Module["_FPDFPageObj_NewImageObj"] =
      makeInvalidEarlyAccess("_FPDFPageObj_NewImageObj"));
    var _FPDFImageObj_LoadJpegFile = (Module["_FPDFImageObj_LoadJpegFile"] =
      makeInvalidEarlyAccess("_FPDFImageObj_LoadJpegFile"));
    var _FPDFImageObj_LoadJpegFileInline = (Module[
      "_FPDFImageObj_LoadJpegFileInline"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_LoadJpegFileInline"));
    var _FPDFImageObj_SetMatrix = (Module["_FPDFImageObj_SetMatrix"] =
      makeInvalidEarlyAccess("_FPDFImageObj_SetMatrix"));
    var _FPDFImageObj_SetBitmap = (Module["_FPDFImageObj_SetBitmap"] =
      makeInvalidEarlyAccess("_FPDFImageObj_SetBitmap"));
    var _FPDFImageObj_GetBitmap = (Module["_FPDFImageObj_GetBitmap"] =
      makeInvalidEarlyAccess("_FPDFImageObj_GetBitmap"));
    var _FPDFImageObj_GetRenderedBitmap = (Module[
      "_FPDFImageObj_GetRenderedBitmap"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetRenderedBitmap"));
    var _FPDFImageObj_GetImageDataDecoded = (Module[
      "_FPDFImageObj_GetImageDataDecoded"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetImageDataDecoded"));
    var _FPDFImageObj_GetImageDataRaw = (Module[
      "_FPDFImageObj_GetImageDataRaw"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetImageDataRaw"));
    var _FPDFImageObj_GetImageFilterCount = (Module[
      "_FPDFImageObj_GetImageFilterCount"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetImageFilterCount"));
    var _FPDFImageObj_GetImageFilter = (Module["_FPDFImageObj_GetImageFilter"] =
      makeInvalidEarlyAccess("_FPDFImageObj_GetImageFilter"));
    var _FPDFImageObj_GetImageMetadata = (Module[
      "_FPDFImageObj_GetImageMetadata"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetImageMetadata"));
    var _FPDFImageObj_GetImagePixelSize = (Module[
      "_FPDFImageObj_GetImagePixelSize"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetImagePixelSize"));
    var _FPDFImageObj_GetIccProfileDataDecoded = (Module[
      "_FPDFImageObj_GetIccProfileDataDecoded"
    ] = makeInvalidEarlyAccess("_FPDFImageObj_GetIccProfileDataDecoded"));
    var _FPDF_CreateNewDocument = (Module["_FPDF_CreateNewDocument"] =
      makeInvalidEarlyAccess("_FPDF_CreateNewDocument"));
    var _FPDFPage_Delete = (Module["_FPDFPage_Delete"] =
      makeInvalidEarlyAccess("_FPDFPage_Delete"));
    var _FPDF_MovePages = (Module["_FPDF_MovePages"] =
      makeInvalidEarlyAccess("_FPDF_MovePages"));
    var _FPDFPage_New = (Module["_FPDFPage_New"] =
      makeInvalidEarlyAccess("_FPDFPage_New"));
    var _FPDFPage_GetRotation = (Module["_FPDFPage_GetRotation"] =
      makeInvalidEarlyAccess("_FPDFPage_GetRotation"));
    var _FPDFPage_InsertObject = (Module["_FPDFPage_InsertObject"] =
      makeInvalidEarlyAccess("_FPDFPage_InsertObject"));
    var _FPDFPage_InsertObjectAtIndex = (Module[
      "_FPDFPage_InsertObjectAtIndex"
    ] = makeInvalidEarlyAccess("_FPDFPage_InsertObjectAtIndex"));
    var _FPDFPage_RemoveObject = (Module["_FPDFPage_RemoveObject"] =
      makeInvalidEarlyAccess("_FPDFPage_RemoveObject"));
    var _FPDFPage_CountObjects = (Module["_FPDFPage_CountObjects"] =
      makeInvalidEarlyAccess("_FPDFPage_CountObjects"));
    var _FPDFPage_GetObject = (Module["_FPDFPage_GetObject"] =
      makeInvalidEarlyAccess("_FPDFPage_GetObject"));
    var _FPDFPage_HasTransparency = (Module["_FPDFPage_HasTransparency"] =
      makeInvalidEarlyAccess("_FPDFPage_HasTransparency"));
    var _FPDFPageObj_Destroy = (Module["_FPDFPageObj_Destroy"] =
      makeInvalidEarlyAccess("_FPDFPageObj_Destroy"));
    var _FPDFPageObj_GetMarkedContentID = (Module[
      "_FPDFPageObj_GetMarkedContentID"
    ] = makeInvalidEarlyAccess("_FPDFPageObj_GetMarkedContentID"));
    var _FPDFPageObj_CountMarks = (Module["_FPDFPageObj_CountMarks"] =
      makeInvalidEarlyAccess("_FPDFPageObj_CountMarks"));
    var _FPDFPageObj_GetMark = (Module["_FPDFPageObj_GetMark"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetMark"));
    var _FPDFPageObj_AddExistingMark = (Module["_FPDFPageObj_AddExistingMark"] =
      makeInvalidEarlyAccess("_FPDFPageObj_AddExistingMark"));
    var _FPDFPageObj_AddMark = (Module["_FPDFPageObj_AddMark"] =
      makeInvalidEarlyAccess("_FPDFPageObj_AddMark"));
    var _FPDFPageObj_RemoveMark = (Module["_FPDFPageObj_RemoveMark"] =
      makeInvalidEarlyAccess("_FPDFPageObj_RemoveMark"));
    var _FPDFPageObjMark_GetName = (Module["_FPDFPageObjMark_GetName"] =
      makeInvalidEarlyAccess("_FPDFPageObjMark_GetName"));
    var _FPDFPageObjMark_CountParams = (Module["_FPDFPageObjMark_CountParams"] =
      makeInvalidEarlyAccess("_FPDFPageObjMark_CountParams"));
    var _FPDFPageObjMark_GetParamKey = (Module["_FPDFPageObjMark_GetParamKey"] =
      makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamKey"));
    var _FPDFPageObjMark_GetParamValueType = (Module[
      "_FPDFPageObjMark_GetParamValueType"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamValueType"));
    var _FPDFPageObjMark_GetParamIntValue = (Module[
      "_FPDFPageObjMark_GetParamIntValue"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamIntValue"));
    var _FPDFPageObjMark_GetParamFloatValue = (Module[
      "_FPDFPageObjMark_GetParamFloatValue"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamFloatValue"));
    var _FPDFPageObjMark_GetParamStringValue = (Module[
      "_FPDFPageObjMark_GetParamStringValue"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamStringValue"));
    var _FPDFPageObjMark_GetParamBlobValue = (Module[
      "_FPDFPageObjMark_GetParamBlobValue"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_GetParamBlobValue"));
    var _FPDFPageObj_HasTransparency = (Module["_FPDFPageObj_HasTransparency"] =
      makeInvalidEarlyAccess("_FPDFPageObj_HasTransparency"));
    var _FPDFPageObjMark_SetIntParam = (Module["_FPDFPageObjMark_SetIntParam"] =
      makeInvalidEarlyAccess("_FPDFPageObjMark_SetIntParam"));
    var _FPDFPageObjMark_SetFloatParam = (Module[
      "_FPDFPageObjMark_SetFloatParam"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_SetFloatParam"));
    var _FPDFPageObjMark_SetStringParam = (Module[
      "_FPDFPageObjMark_SetStringParam"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_SetStringParam"));
    var _FPDFPageObjMark_SetBlobParam = (Module[
      "_FPDFPageObjMark_SetBlobParam"
    ] = makeInvalidEarlyAccess("_FPDFPageObjMark_SetBlobParam"));
    var _FPDFPageObjMark_RemoveParam = (Module["_FPDFPageObjMark_RemoveParam"] =
      makeInvalidEarlyAccess("_FPDFPageObjMark_RemoveParam"));
    var _FPDFPageObj_GetType = (Module["_FPDFPageObj_GetType"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetType"));
    var _FPDFPageObj_GetIsActive = (Module["_FPDFPageObj_GetIsActive"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetIsActive"));
    var _FPDFPageObj_SetIsActive = (Module["_FPDFPageObj_SetIsActive"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetIsActive"));
    var _FPDFPage_GenerateContent = (Module["_FPDFPage_GenerateContent"] =
      makeInvalidEarlyAccess("_FPDFPage_GenerateContent"));
    var _FPDFPageObj_Transform = (Module["_FPDFPageObj_Transform"] =
      makeInvalidEarlyAccess("_FPDFPageObj_Transform"));
    var _FPDFPageObj_TransformF = (Module["_FPDFPageObj_TransformF"] =
      makeInvalidEarlyAccess("_FPDFPageObj_TransformF"));
    var _FPDFPageObj_GetMatrix = (Module["_FPDFPageObj_GetMatrix"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetMatrix"));
    var _FPDFPageObj_SetMatrix = (Module["_FPDFPageObj_SetMatrix"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetMatrix"));
    var _FPDFPageObj_SetBlendMode = (Module["_FPDFPageObj_SetBlendMode"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetBlendMode"));
    var _FPDFPage_TransformAnnots = (Module["_FPDFPage_TransformAnnots"] =
      makeInvalidEarlyAccess("_FPDFPage_TransformAnnots"));
    var _FPDFPage_SetRotation = (Module["_FPDFPage_SetRotation"] =
      makeInvalidEarlyAccess("_FPDFPage_SetRotation"));
    var _FPDFPageObj_SetFillColor = (Module["_FPDFPageObj_SetFillColor"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetFillColor"));
    var _FPDFPageObj_GetFillColor = (Module["_FPDFPageObj_GetFillColor"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetFillColor"));
    var _FPDFPageObj_GetBounds = (Module["_FPDFPageObj_GetBounds"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetBounds"));
    var _FPDFPageObj_GetRotatedBounds = (Module[
      "_FPDFPageObj_GetRotatedBounds"
    ] = makeInvalidEarlyAccess("_FPDFPageObj_GetRotatedBounds"));
    var _FPDFPageObj_SetStrokeColor = (Module["_FPDFPageObj_SetStrokeColor"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetStrokeColor"));
    var _FPDFPageObj_GetStrokeColor = (Module["_FPDFPageObj_GetStrokeColor"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetStrokeColor"));
    var _FPDFPageObj_SetStrokeWidth = (Module["_FPDFPageObj_SetStrokeWidth"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetStrokeWidth"));
    var _FPDFPageObj_GetStrokeWidth = (Module["_FPDFPageObj_GetStrokeWidth"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetStrokeWidth"));
    var _FPDFPageObj_GetLineJoin = (Module["_FPDFPageObj_GetLineJoin"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetLineJoin"));
    var _FPDFPageObj_SetLineJoin = (Module["_FPDFPageObj_SetLineJoin"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetLineJoin"));
    var _FPDFPageObj_GetLineCap = (Module["_FPDFPageObj_GetLineCap"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetLineCap"));
    var _FPDFPageObj_SetLineCap = (Module["_FPDFPageObj_SetLineCap"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetLineCap"));
    var _FPDFPageObj_GetDashPhase = (Module["_FPDFPageObj_GetDashPhase"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetDashPhase"));
    var _FPDFPageObj_SetDashPhase = (Module["_FPDFPageObj_SetDashPhase"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetDashPhase"));
    var _FPDFPageObj_GetDashCount = (Module["_FPDFPageObj_GetDashCount"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetDashCount"));
    var _FPDFPageObj_GetDashArray = (Module["_FPDFPageObj_GetDashArray"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetDashArray"));
    var _FPDFPageObj_SetDashArray = (Module["_FPDFPageObj_SetDashArray"] =
      makeInvalidEarlyAccess("_FPDFPageObj_SetDashArray"));
    var _FPDFFormObj_CountObjects = (Module["_FPDFFormObj_CountObjects"] =
      makeInvalidEarlyAccess("_FPDFFormObj_CountObjects"));
    var _FPDFFormObj_GetObject = (Module["_FPDFFormObj_GetObject"] =
      makeInvalidEarlyAccess("_FPDFFormObj_GetObject"));
    var _FPDFFormObj_RemoveObject = (Module["_FPDFFormObj_RemoveObject"] =
      makeInvalidEarlyAccess("_FPDFFormObj_RemoveObject"));
    var _FPDFPageObj_CreateNewPath = (Module["_FPDFPageObj_CreateNewPath"] =
      makeInvalidEarlyAccess("_FPDFPageObj_CreateNewPath"));
    var _FPDFPageObj_CreateNewRect = (Module["_FPDFPageObj_CreateNewRect"] =
      makeInvalidEarlyAccess("_FPDFPageObj_CreateNewRect"));
    var _FPDFPath_CountSegments = (Module["_FPDFPath_CountSegments"] =
      makeInvalidEarlyAccess("_FPDFPath_CountSegments"));
    var _FPDFPath_GetPathSegment = (Module["_FPDFPath_GetPathSegment"] =
      makeInvalidEarlyAccess("_FPDFPath_GetPathSegment"));
    var _FPDFPath_MoveTo = (Module["_FPDFPath_MoveTo"] =
      makeInvalidEarlyAccess("_FPDFPath_MoveTo"));
    var _FPDFPath_LineTo = (Module["_FPDFPath_LineTo"] =
      makeInvalidEarlyAccess("_FPDFPath_LineTo"));
    var _FPDFPath_BezierTo = (Module["_FPDFPath_BezierTo"] =
      makeInvalidEarlyAccess("_FPDFPath_BezierTo"));
    var _FPDFPath_Close = (Module["_FPDFPath_Close"] =
      makeInvalidEarlyAccess("_FPDFPath_Close"));
    var _FPDFPath_SetDrawMode = (Module["_FPDFPath_SetDrawMode"] =
      makeInvalidEarlyAccess("_FPDFPath_SetDrawMode"));
    var _FPDFPath_GetDrawMode = (Module["_FPDFPath_GetDrawMode"] =
      makeInvalidEarlyAccess("_FPDFPath_GetDrawMode"));
    var _FPDFPathSegment_GetPoint = (Module["_FPDFPathSegment_GetPoint"] =
      makeInvalidEarlyAccess("_FPDFPathSegment_GetPoint"));
    var _FPDFPathSegment_GetType = (Module["_FPDFPathSegment_GetType"] =
      makeInvalidEarlyAccess("_FPDFPathSegment_GetType"));
    var _FPDFPathSegment_GetClose = (Module["_FPDFPathSegment_GetClose"] =
      makeInvalidEarlyAccess("_FPDFPathSegment_GetClose"));
    var _FPDFPageObj_NewTextObj = (Module["_FPDFPageObj_NewTextObj"] =
      makeInvalidEarlyAccess("_FPDFPageObj_NewTextObj"));
    var _FPDFText_SetText = (Module["_FPDFText_SetText"] =
      makeInvalidEarlyAccess("_FPDFText_SetText"));
    var _FPDFText_SetCharcodes = (Module["_FPDFText_SetCharcodes"] =
      makeInvalidEarlyAccess("_FPDFText_SetCharcodes"));
    var _FPDFText_SetPositions = (Module["_FPDFText_SetPositions"] =
      makeInvalidEarlyAccess("_FPDFText_SetPositions"));
    var _FPDFText_LoadFont = (Module["_FPDFText_LoadFont"] =
      makeInvalidEarlyAccess("_FPDFText_LoadFont"));
    var _FPDFText_LoadStandardFont = (Module["_FPDFText_LoadStandardFont"] =
      makeInvalidEarlyAccess("_FPDFText_LoadStandardFont"));
    var _FPDFText_LoadCidType2Font = (Module["_FPDFText_LoadCidType2Font"] =
      makeInvalidEarlyAccess("_FPDFText_LoadCidType2Font"));
    var _FPDFTextObj_GetFontSize = (Module["_FPDFTextObj_GetFontSize"] =
      makeInvalidEarlyAccess("_FPDFTextObj_GetFontSize"));
    var _FPDFTextObj_SetFontSize = (Module["_FPDFTextObj_SetFontSize"] =
      makeInvalidEarlyAccess("_FPDFTextObj_SetFontSize"));
    var _FPDFTextObj_GetText = (Module["_FPDFTextObj_GetText"] =
      makeInvalidEarlyAccess("_FPDFTextObj_GetText"));
    var _FPDFTextObj_GetRenderedBitmap = (Module[
      "_FPDFTextObj_GetRenderedBitmap"
    ] = makeInvalidEarlyAccess("_FPDFTextObj_GetRenderedBitmap"));
    var _FPDFFont_Close = (Module["_FPDFFont_Close"] =
      makeInvalidEarlyAccess("_FPDFFont_Close"));
    var _FPDFPageObj_CreateTextObj = (Module["_FPDFPageObj_CreateTextObj"] =
      makeInvalidEarlyAccess("_FPDFPageObj_CreateTextObj"));
    var _FPDFTextObj_GetTextRenderMode = (Module[
      "_FPDFTextObj_GetTextRenderMode"
    ] = makeInvalidEarlyAccess("_FPDFTextObj_GetTextRenderMode"));
    var _FPDFTextObj_SetTextRenderMode = (Module[
      "_FPDFTextObj_SetTextRenderMode"
    ] = makeInvalidEarlyAccess("_FPDFTextObj_SetTextRenderMode"));
    var _FPDFTextObj_GetFont = (Module["_FPDFTextObj_GetFont"] =
      makeInvalidEarlyAccess("_FPDFTextObj_GetFont"));
    var _FPDFFont_GetBaseFontName = (Module["_FPDFFont_GetBaseFontName"] =
      makeInvalidEarlyAccess("_FPDFFont_GetBaseFontName"));
    var _FPDFFont_GetFamilyName = (Module["_FPDFFont_GetFamilyName"] =
      makeInvalidEarlyAccess("_FPDFFont_GetFamilyName"));
    var _FPDFFont_GetFontData = (Module["_FPDFFont_GetFontData"] =
      makeInvalidEarlyAccess("_FPDFFont_GetFontData"));
    var _FPDFFont_GetIsEmbedded = (Module["_FPDFFont_GetIsEmbedded"] =
      makeInvalidEarlyAccess("_FPDFFont_GetIsEmbedded"));
    var _FPDFFont_GetFlags = (Module["_FPDFFont_GetFlags"] =
      makeInvalidEarlyAccess("_FPDFFont_GetFlags"));
    var _FPDFFont_GetWeight = (Module["_FPDFFont_GetWeight"] =
      makeInvalidEarlyAccess("_FPDFFont_GetWeight"));
    var _FPDFFont_GetItalicAngle = (Module["_FPDFFont_GetItalicAngle"] =
      makeInvalidEarlyAccess("_FPDFFont_GetItalicAngle"));
    var _FPDFFont_GetAscent = (Module["_FPDFFont_GetAscent"] =
      makeInvalidEarlyAccess("_FPDFFont_GetAscent"));
    var _FPDFFont_GetDescent = (Module["_FPDFFont_GetDescent"] =
      makeInvalidEarlyAccess("_FPDFFont_GetDescent"));
    var _FPDFFont_GetGlyphWidth = (Module["_FPDFFont_GetGlyphWidth"] =
      makeInvalidEarlyAccess("_FPDFFont_GetGlyphWidth"));
    var _FPDFFont_GetGlyphPath = (Module["_FPDFFont_GetGlyphPath"] =
      makeInvalidEarlyAccess("_FPDFFont_GetGlyphPath"));
    var _FPDFGlyphPath_CountGlyphSegments = (Module[
      "_FPDFGlyphPath_CountGlyphSegments"
    ] = makeInvalidEarlyAccess("_FPDFGlyphPath_CountGlyphSegments"));
    var _FPDFGlyphPath_GetGlyphPathSegment = (Module[
      "_FPDFGlyphPath_GetGlyphPathSegment"
    ] = makeInvalidEarlyAccess("_FPDFGlyphPath_GetGlyphPathSegment"));
    var _FSDK_SetUnSpObjProcessHandler = (Module[
      "_FSDK_SetUnSpObjProcessHandler"
    ] = makeInvalidEarlyAccess("_FSDK_SetUnSpObjProcessHandler"));
    var _FSDK_SetTimeFunction = (Module["_FSDK_SetTimeFunction"] =
      makeInvalidEarlyAccess("_FSDK_SetTimeFunction"));
    var _FSDK_SetLocaltimeFunction = (Module["_FSDK_SetLocaltimeFunction"] =
      makeInvalidEarlyAccess("_FSDK_SetLocaltimeFunction"));
    var _FPDFDoc_GetPageMode = (Module["_FPDFDoc_GetPageMode"] =
      makeInvalidEarlyAccess("_FPDFDoc_GetPageMode"));
    var _FPDFPage_Flatten = (Module["_FPDFPage_Flatten"] =
      makeInvalidEarlyAccess("_FPDFPage_Flatten"));
    var _FPDFPage_HasFormFieldAtPoint = (Module[
      "_FPDFPage_HasFormFieldAtPoint"
    ] = makeInvalidEarlyAccess("_FPDFPage_HasFormFieldAtPoint"));
    var _FPDFPage_FormFieldZOrderAtPoint = (Module[
      "_FPDFPage_FormFieldZOrderAtPoint"
    ] = makeInvalidEarlyAccess("_FPDFPage_FormFieldZOrderAtPoint"));
    var _FPDFDOC_InitFormFillEnvironment = (Module[
      "_FPDFDOC_InitFormFillEnvironment"
    ] = makeInvalidEarlyAccess("_FPDFDOC_InitFormFillEnvironment"));
    var _FPDFDOC_ExitFormFillEnvironment = (Module[
      "_FPDFDOC_ExitFormFillEnvironment"
    ] = makeInvalidEarlyAccess("_FPDFDOC_ExitFormFillEnvironment"));
    var _FORM_OnMouseMove = (Module["_FORM_OnMouseMove"] =
      makeInvalidEarlyAccess("_FORM_OnMouseMove"));
    var _FORM_OnMouseWheel = (Module["_FORM_OnMouseWheel"] =
      makeInvalidEarlyAccess("_FORM_OnMouseWheel"));
    var _FORM_OnFocus = (Module["_FORM_OnFocus"] =
      makeInvalidEarlyAccess("_FORM_OnFocus"));
    var _FORM_OnLButtonDown = (Module["_FORM_OnLButtonDown"] =
      makeInvalidEarlyAccess("_FORM_OnLButtonDown"));
    var _FORM_OnLButtonUp = (Module["_FORM_OnLButtonUp"] =
      makeInvalidEarlyAccess("_FORM_OnLButtonUp"));
    var _FORM_OnLButtonDoubleClick = (Module["_FORM_OnLButtonDoubleClick"] =
      makeInvalidEarlyAccess("_FORM_OnLButtonDoubleClick"));
    var _FORM_OnRButtonDown = (Module["_FORM_OnRButtonDown"] =
      makeInvalidEarlyAccess("_FORM_OnRButtonDown"));
    var _FORM_OnRButtonUp = (Module["_FORM_OnRButtonUp"] =
      makeInvalidEarlyAccess("_FORM_OnRButtonUp"));
    var _FORM_OnKeyDown = (Module["_FORM_OnKeyDown"] =
      makeInvalidEarlyAccess("_FORM_OnKeyDown"));
    var _FORM_OnKeyUp = (Module["_FORM_OnKeyUp"] =
      makeInvalidEarlyAccess("_FORM_OnKeyUp"));
    var _FORM_OnChar = (Module["_FORM_OnChar"] =
      makeInvalidEarlyAccess("_FORM_OnChar"));
    var _FORM_GetFocusedText = (Module["_FORM_GetFocusedText"] =
      makeInvalidEarlyAccess("_FORM_GetFocusedText"));
    var _FORM_GetSelectedText = (Module["_FORM_GetSelectedText"] =
      makeInvalidEarlyAccess("_FORM_GetSelectedText"));
    var _FORM_ReplaceAndKeepSelection = (Module[
      "_FORM_ReplaceAndKeepSelection"
    ] = makeInvalidEarlyAccess("_FORM_ReplaceAndKeepSelection"));
    var _FORM_ReplaceSelection = (Module["_FORM_ReplaceSelection"] =
      makeInvalidEarlyAccess("_FORM_ReplaceSelection"));
    var _FORM_SelectAllText = (Module["_FORM_SelectAllText"] =
      makeInvalidEarlyAccess("_FORM_SelectAllText"));
    var _FORM_CanUndo = (Module["_FORM_CanUndo"] =
      makeInvalidEarlyAccess("_FORM_CanUndo"));
    var _FORM_CanRedo = (Module["_FORM_CanRedo"] =
      makeInvalidEarlyAccess("_FORM_CanRedo"));
    var _FORM_Undo = (Module["_FORM_Undo"] =
      makeInvalidEarlyAccess("_FORM_Undo"));
    var _FORM_Redo = (Module["_FORM_Redo"] =
      makeInvalidEarlyAccess("_FORM_Redo"));
    var _FORM_ForceToKillFocus = (Module["_FORM_ForceToKillFocus"] =
      makeInvalidEarlyAccess("_FORM_ForceToKillFocus"));
    var _FORM_GetFocusedAnnot = (Module["_FORM_GetFocusedAnnot"] =
      makeInvalidEarlyAccess("_FORM_GetFocusedAnnot"));
    var _FORM_SetFocusedAnnot = (Module["_FORM_SetFocusedAnnot"] =
      makeInvalidEarlyAccess("_FORM_SetFocusedAnnot"));
    var _FPDF_FFLDraw = (Module["_FPDF_FFLDraw"] =
      makeInvalidEarlyAccess("_FPDF_FFLDraw"));
    var _FPDF_SetFormFieldHighlightColor = (Module[
      "_FPDF_SetFormFieldHighlightColor"
    ] = makeInvalidEarlyAccess("_FPDF_SetFormFieldHighlightColor"));
    var _FPDF_SetFormFieldHighlightAlpha = (Module[
      "_FPDF_SetFormFieldHighlightAlpha"
    ] = makeInvalidEarlyAccess("_FPDF_SetFormFieldHighlightAlpha"));
    var _FPDF_RemoveFormFieldHighlight = (Module[
      "_FPDF_RemoveFormFieldHighlight"
    ] = makeInvalidEarlyAccess("_FPDF_RemoveFormFieldHighlight"));
    var _FORM_OnAfterLoadPage = (Module["_FORM_OnAfterLoadPage"] =
      makeInvalidEarlyAccess("_FORM_OnAfterLoadPage"));
    var _FORM_OnBeforeClosePage = (Module["_FORM_OnBeforeClosePage"] =
      makeInvalidEarlyAccess("_FORM_OnBeforeClosePage"));
    var _FORM_DoDocumentJSAction = (Module["_FORM_DoDocumentJSAction"] =
      makeInvalidEarlyAccess("_FORM_DoDocumentJSAction"));
    var _FORM_DoDocumentOpenAction = (Module["_FORM_DoDocumentOpenAction"] =
      makeInvalidEarlyAccess("_FORM_DoDocumentOpenAction"));
    var _FORM_DoDocumentAAction = (Module["_FORM_DoDocumentAAction"] =
      makeInvalidEarlyAccess("_FORM_DoDocumentAAction"));
    var _FORM_DoPageAAction = (Module["_FORM_DoPageAAction"] =
      makeInvalidEarlyAccess("_FORM_DoPageAAction"));
    var _FORM_SetIndexSelected = (Module["_FORM_SetIndexSelected"] =
      makeInvalidEarlyAccess("_FORM_SetIndexSelected"));
    var _FORM_IsIndexSelected = (Module["_FORM_IsIndexSelected"] =
      makeInvalidEarlyAccess("_FORM_IsIndexSelected"));
    var _FPDFDoc_GetJavaScriptActionCount = (Module[
      "_FPDFDoc_GetJavaScriptActionCount"
    ] = makeInvalidEarlyAccess("_FPDFDoc_GetJavaScriptActionCount"));
    var _FPDFDoc_GetJavaScriptAction = (Module["_FPDFDoc_GetJavaScriptAction"] =
      makeInvalidEarlyAccess("_FPDFDoc_GetJavaScriptAction"));
    var _FPDFDoc_CloseJavaScriptAction = (Module[
      "_FPDFDoc_CloseJavaScriptAction"
    ] = makeInvalidEarlyAccess("_FPDFDoc_CloseJavaScriptAction"));
    var _FPDFJavaScriptAction_GetName = (Module[
      "_FPDFJavaScriptAction_GetName"
    ] = makeInvalidEarlyAccess("_FPDFJavaScriptAction_GetName"));
    var _FPDFJavaScriptAction_GetScript = (Module[
      "_FPDFJavaScriptAction_GetScript"
    ] = makeInvalidEarlyAccess("_FPDFJavaScriptAction_GetScript"));
    var _FPDF_ImportPagesByIndex = (Module["_FPDF_ImportPagesByIndex"] =
      makeInvalidEarlyAccess("_FPDF_ImportPagesByIndex"));
    var _FPDF_ImportPages = (Module["_FPDF_ImportPages"] =
      makeInvalidEarlyAccess("_FPDF_ImportPages"));
    var _FPDF_ImportNPagesToOne = (Module["_FPDF_ImportNPagesToOne"] =
      makeInvalidEarlyAccess("_FPDF_ImportNPagesToOne"));
    var _FPDF_NewXObjectFromPage = (Module["_FPDF_NewXObjectFromPage"] =
      makeInvalidEarlyAccess("_FPDF_NewXObjectFromPage"));
    var _FPDF_CloseXObject = (Module["_FPDF_CloseXObject"] =
      makeInvalidEarlyAccess("_FPDF_CloseXObject"));
    var _FPDF_NewFormObjectFromXObject = (Module[
      "_FPDF_NewFormObjectFromXObject"
    ] = makeInvalidEarlyAccess("_FPDF_NewFormObjectFromXObject"));
    var _FPDF_CopyViewerPreferences = (Module["_FPDF_CopyViewerPreferences"] =
      makeInvalidEarlyAccess("_FPDF_CopyViewerPreferences"));
    var _FPDF_RenderPageBitmapWithColorScheme_Start = (Module[
      "_FPDF_RenderPageBitmapWithColorScheme_Start"
    ] = makeInvalidEarlyAccess("_FPDF_RenderPageBitmapWithColorScheme_Start"));
    var _FPDF_RenderPageBitmap_Start = (Module["_FPDF_RenderPageBitmap_Start"] =
      makeInvalidEarlyAccess("_FPDF_RenderPageBitmap_Start"));
    var _FPDF_RenderPage_Continue = (Module["_FPDF_RenderPage_Continue"] =
      makeInvalidEarlyAccess("_FPDF_RenderPage_Continue"));
    var _FPDF_RenderPage_Close = (Module["_FPDF_RenderPage_Close"] =
      makeInvalidEarlyAccess("_FPDF_RenderPage_Close"));
    var _FPDF_SaveAsCopy = (Module["_FPDF_SaveAsCopy"] =
      makeInvalidEarlyAccess("_FPDF_SaveAsCopy"));
    var _FPDF_SaveWithVersion = (Module["_FPDF_SaveWithVersion"] =
      makeInvalidEarlyAccess("_FPDF_SaveWithVersion"));
    var _FPDFText_GetCharIndexFromTextIndex = (Module[
      "_FPDFText_GetCharIndexFromTextIndex"
    ] = makeInvalidEarlyAccess("_FPDFText_GetCharIndexFromTextIndex"));
    var _FPDFText_GetTextIndexFromCharIndex = (Module[
      "_FPDFText_GetTextIndexFromCharIndex"
    ] = makeInvalidEarlyAccess("_FPDFText_GetTextIndexFromCharIndex"));
    var _FPDF_GetSignatureCount = (Module["_FPDF_GetSignatureCount"] =
      makeInvalidEarlyAccess("_FPDF_GetSignatureCount"));
    var _FPDF_GetSignatureObject = (Module["_FPDF_GetSignatureObject"] =
      makeInvalidEarlyAccess("_FPDF_GetSignatureObject"));
    var _FPDFSignatureObj_GetContents = (Module[
      "_FPDFSignatureObj_GetContents"
    ] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetContents"));
    var _FPDFSignatureObj_GetByteRange = (Module[
      "_FPDFSignatureObj_GetByteRange"
    ] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetByteRange"));
    var _FPDFSignatureObj_GetSubFilter = (Module[
      "_FPDFSignatureObj_GetSubFilter"
    ] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetSubFilter"));
    var _FPDFSignatureObj_GetReason = (Module["_FPDFSignatureObj_GetReason"] =
      makeInvalidEarlyAccess("_FPDFSignatureObj_GetReason"));
    var _FPDFSignatureObj_GetTime = (Module["_FPDFSignatureObj_GetTime"] =
      makeInvalidEarlyAccess("_FPDFSignatureObj_GetTime"));
    var _FPDFSignatureObj_GetDocMDPPermission = (Module[
      "_FPDFSignatureObj_GetDocMDPPermission"
    ] = makeInvalidEarlyAccess("_FPDFSignatureObj_GetDocMDPPermission"));
    var _FPDF_StructTree_GetForPage = (Module["_FPDF_StructTree_GetForPage"] =
      makeInvalidEarlyAccess("_FPDF_StructTree_GetForPage"));
    var _FPDF_StructTree_Close = (Module["_FPDF_StructTree_Close"] =
      makeInvalidEarlyAccess("_FPDF_StructTree_Close"));
    var _FPDF_StructTree_CountChildren = (Module[
      "_FPDF_StructTree_CountChildren"
    ] = makeInvalidEarlyAccess("_FPDF_StructTree_CountChildren"));
    var _FPDF_StructTree_GetChildAtIndex = (Module[
      "_FPDF_StructTree_GetChildAtIndex"
    ] = makeInvalidEarlyAccess("_FPDF_StructTree_GetChildAtIndex"));
    var _FPDF_StructElement_GetAltText = (Module[
      "_FPDF_StructElement_GetAltText"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetAltText"));
    var _FPDF_StructElement_GetActualText = (Module[
      "_FPDF_StructElement_GetActualText"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetActualText"));
    var _FPDF_StructElement_GetExpansion = (Module[
      "_FPDF_StructElement_GetExpansion"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetExpansion"));
    var _FPDF_StructElement_GetID = (Module["_FPDF_StructElement_GetID"] =
      makeInvalidEarlyAccess("_FPDF_StructElement_GetID"));
    var _FPDF_StructElement_GetLang = (Module["_FPDF_StructElement_GetLang"] =
      makeInvalidEarlyAccess("_FPDF_StructElement_GetLang"));
    var _FPDF_StructElement_GetAttributeCount = (Module[
      "_FPDF_StructElement_GetAttributeCount"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetAttributeCount"));
    var _FPDF_StructElement_GetAttributeAtIndex = (Module[
      "_FPDF_StructElement_GetAttributeAtIndex"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetAttributeAtIndex"));
    var _FPDF_StructElement_GetStringAttribute = (Module[
      "_FPDF_StructElement_GetStringAttribute"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetStringAttribute"));
    var _FPDF_StructElement_GetMarkedContentID = (Module[
      "_FPDF_StructElement_GetMarkedContentID"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetMarkedContentID"));
    var _FPDF_StructElement_GetType = (Module["_FPDF_StructElement_GetType"] =
      makeInvalidEarlyAccess("_FPDF_StructElement_GetType"));
    var _FPDF_StructElement_GetObjType = (Module[
      "_FPDF_StructElement_GetObjType"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetObjType"));
    var _FPDF_StructElement_GetTitle = (Module["_FPDF_StructElement_GetTitle"] =
      makeInvalidEarlyAccess("_FPDF_StructElement_GetTitle"));
    var _FPDF_StructElement_CountChildren = (Module[
      "_FPDF_StructElement_CountChildren"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_CountChildren"));
    var _FPDF_StructElement_GetChildAtIndex = (Module[
      "_FPDF_StructElement_GetChildAtIndex"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetChildAtIndex"));
    var _FPDF_StructElement_GetChildMarkedContentID = (Module[
      "_FPDF_StructElement_GetChildMarkedContentID"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetChildMarkedContentID"));
    var _FPDF_StructElement_GetParent = (Module[
      "_FPDF_StructElement_GetParent"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetParent"));
    var _FPDF_StructElement_Attr_GetCount = (Module[
      "_FPDF_StructElement_Attr_GetCount"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetCount"));
    var _FPDF_StructElement_Attr_GetName = (Module[
      "_FPDF_StructElement_Attr_GetName"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetName"));
    var _FPDF_StructElement_Attr_GetValue = (Module[
      "_FPDF_StructElement_Attr_GetValue"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetValue"));
    var _FPDF_StructElement_Attr_GetType = (Module[
      "_FPDF_StructElement_Attr_GetType"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetType"));
    var _FPDF_StructElement_Attr_GetBooleanValue = (Module[
      "_FPDF_StructElement_Attr_GetBooleanValue"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetBooleanValue"));
    var _FPDF_StructElement_Attr_GetNumberValue = (Module[
      "_FPDF_StructElement_Attr_GetNumberValue"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetNumberValue"));
    var _FPDF_StructElement_Attr_GetStringValue = (Module[
      "_FPDF_StructElement_Attr_GetStringValue"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetStringValue"));
    var _FPDF_StructElement_Attr_GetBlobValue = (Module[
      "_FPDF_StructElement_Attr_GetBlobValue"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetBlobValue"));
    var _FPDF_StructElement_Attr_CountChildren = (Module[
      "_FPDF_StructElement_Attr_CountChildren"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_CountChildren"));
    var _FPDF_StructElement_Attr_GetChildAtIndex = (Module[
      "_FPDF_StructElement_Attr_GetChildAtIndex"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_Attr_GetChildAtIndex"));
    var _FPDF_StructElement_GetMarkedContentIdCount = (Module[
      "_FPDF_StructElement_GetMarkedContentIdCount"
    ] = makeInvalidEarlyAccess("_FPDF_StructElement_GetMarkedContentIdCount"));
    var _FPDF_StructElement_GetMarkedContentIdAtIndex = (Module[
      "_FPDF_StructElement_GetMarkedContentIdAtIndex"
    ] = makeInvalidEarlyAccess(
      "_FPDF_StructElement_GetMarkedContentIdAtIndex",
    ));
    var _FPDF_AddInstalledFont = (Module["_FPDF_AddInstalledFont"] =
      makeInvalidEarlyAccess("_FPDF_AddInstalledFont"));
    var _FPDF_SetSystemFontInfo = (Module["_FPDF_SetSystemFontInfo"] =
      makeInvalidEarlyAccess("_FPDF_SetSystemFontInfo"));
    var _FPDF_GetDefaultTTFMap = (Module["_FPDF_GetDefaultTTFMap"] =
      makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMap"));
    var _FPDF_GetDefaultTTFMapCount = (Module["_FPDF_GetDefaultTTFMapCount"] =
      makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMapCount"));
    var _FPDF_GetDefaultTTFMapEntry = (Module["_FPDF_GetDefaultTTFMapEntry"] =
      makeInvalidEarlyAccess("_FPDF_GetDefaultTTFMapEntry"));
    var _FPDF_GetDefaultSystemFontInfo = (Module[
      "_FPDF_GetDefaultSystemFontInfo"
    ] = makeInvalidEarlyAccess("_FPDF_GetDefaultSystemFontInfo"));
    var _FPDF_FreeDefaultSystemFontInfo = (Module[
      "_FPDF_FreeDefaultSystemFontInfo"
    ] = makeInvalidEarlyAccess("_FPDF_FreeDefaultSystemFontInfo"));
    var _FPDFText_LoadPage = (Module["_FPDFText_LoadPage"] =
      makeInvalidEarlyAccess("_FPDFText_LoadPage"));
    var _FPDFText_ClosePage = (Module["_FPDFText_ClosePage"] =
      makeInvalidEarlyAccess("_FPDFText_ClosePage"));
    var _FPDFText_CountChars = (Module["_FPDFText_CountChars"] =
      makeInvalidEarlyAccess("_FPDFText_CountChars"));
    var _FPDFText_GetUnicode = (Module["_FPDFText_GetUnicode"] =
      makeInvalidEarlyAccess("_FPDFText_GetUnicode"));
    var _FPDFText_GetTextObject = (Module["_FPDFText_GetTextObject"] =
      makeInvalidEarlyAccess("_FPDFText_GetTextObject"));
    var _FPDFText_IsGenerated = (Module["_FPDFText_IsGenerated"] =
      makeInvalidEarlyAccess("_FPDFText_IsGenerated"));
    var _FPDFText_IsHyphen = (Module["_FPDFText_IsHyphen"] =
      makeInvalidEarlyAccess("_FPDFText_IsHyphen"));
    var _FPDFText_HasUnicodeMapError = (Module["_FPDFText_HasUnicodeMapError"] =
      makeInvalidEarlyAccess("_FPDFText_HasUnicodeMapError"));
    var _FPDFText_GetFontSize = (Module["_FPDFText_GetFontSize"] =
      makeInvalidEarlyAccess("_FPDFText_GetFontSize"));
    var _FPDFText_GetFontInfo = (Module["_FPDFText_GetFontInfo"] =
      makeInvalidEarlyAccess("_FPDFText_GetFontInfo"));
    var _FPDFText_GetFontWeight = (Module["_FPDFText_GetFontWeight"] =
      makeInvalidEarlyAccess("_FPDFText_GetFontWeight"));
    var _FPDFText_GetFillColor = (Module["_FPDFText_GetFillColor"] =
      makeInvalidEarlyAccess("_FPDFText_GetFillColor"));
    var _FPDFText_GetStrokeColor = (Module["_FPDFText_GetStrokeColor"] =
      makeInvalidEarlyAccess("_FPDFText_GetStrokeColor"));
    var _FPDFText_GetCharAngle = (Module["_FPDFText_GetCharAngle"] =
      makeInvalidEarlyAccess("_FPDFText_GetCharAngle"));
    var _FPDFText_GetCharBox = (Module["_FPDFText_GetCharBox"] =
      makeInvalidEarlyAccess("_FPDFText_GetCharBox"));
    var _FPDFText_GetLooseCharBox = (Module["_FPDFText_GetLooseCharBox"] =
      makeInvalidEarlyAccess("_FPDFText_GetLooseCharBox"));
    var _FPDFText_GetMatrix = (Module["_FPDFText_GetMatrix"] =
      makeInvalidEarlyAccess("_FPDFText_GetMatrix"));
    var _FPDFText_GetCharOrigin = (Module["_FPDFText_GetCharOrigin"] =
      makeInvalidEarlyAccess("_FPDFText_GetCharOrigin"));
    var _FPDFText_GetCharIndexAtPos = (Module["_FPDFText_GetCharIndexAtPos"] =
      makeInvalidEarlyAccess("_FPDFText_GetCharIndexAtPos"));
    var _FPDFText_GetText = (Module["_FPDFText_GetText"] =
      makeInvalidEarlyAccess("_FPDFText_GetText"));
    var _FPDFText_CountRects = (Module["_FPDFText_CountRects"] =
      makeInvalidEarlyAccess("_FPDFText_CountRects"));
    var _FPDFText_GetRect = (Module["_FPDFText_GetRect"] =
      makeInvalidEarlyAccess("_FPDFText_GetRect"));
    var _FPDFText_GetBoundedText = (Module["_FPDFText_GetBoundedText"] =
      makeInvalidEarlyAccess("_FPDFText_GetBoundedText"));
    var _FPDFText_FindStart = (Module["_FPDFText_FindStart"] =
      makeInvalidEarlyAccess("_FPDFText_FindStart"));
    var _FPDFText_FindNext = (Module["_FPDFText_FindNext"] =
      makeInvalidEarlyAccess("_FPDFText_FindNext"));
    var _FPDFText_FindPrev = (Module["_FPDFText_FindPrev"] =
      makeInvalidEarlyAccess("_FPDFText_FindPrev"));
    var _FPDFText_GetSchResultIndex = (Module["_FPDFText_GetSchResultIndex"] =
      makeInvalidEarlyAccess("_FPDFText_GetSchResultIndex"));
    var _FPDFText_GetSchCount = (Module["_FPDFText_GetSchCount"] =
      makeInvalidEarlyAccess("_FPDFText_GetSchCount"));
    var _FPDFText_FindClose = (Module["_FPDFText_FindClose"] =
      makeInvalidEarlyAccess("_FPDFText_FindClose"));
    var _FPDFLink_LoadWebLinks = (Module["_FPDFLink_LoadWebLinks"] =
      makeInvalidEarlyAccess("_FPDFLink_LoadWebLinks"));
    var _FPDFLink_CountWebLinks = (Module["_FPDFLink_CountWebLinks"] =
      makeInvalidEarlyAccess("_FPDFLink_CountWebLinks"));
    var _FPDFLink_GetURL = (Module["_FPDFLink_GetURL"] =
      makeInvalidEarlyAccess("_FPDFLink_GetURL"));
    var _FPDFLink_CountRects = (Module["_FPDFLink_CountRects"] =
      makeInvalidEarlyAccess("_FPDFLink_CountRects"));
    var _FPDFLink_GetRect = (Module["_FPDFLink_GetRect"] =
      makeInvalidEarlyAccess("_FPDFLink_GetRect"));
    var _FPDFLink_GetTextRange = (Module["_FPDFLink_GetTextRange"] =
      makeInvalidEarlyAccess("_FPDFLink_GetTextRange"));
    var _FPDFLink_CloseWebLinks = (Module["_FPDFLink_CloseWebLinks"] =
      makeInvalidEarlyAccess("_FPDFLink_CloseWebLinks"));
    var _FPDFPage_GetDecodedThumbnailData = (Module[
      "_FPDFPage_GetDecodedThumbnailData"
    ] = makeInvalidEarlyAccess("_FPDFPage_GetDecodedThumbnailData"));
    var _FPDFPage_GetRawThumbnailData = (Module[
      "_FPDFPage_GetRawThumbnailData"
    ] = makeInvalidEarlyAccess("_FPDFPage_GetRawThumbnailData"));
    var _FPDFPage_GetThumbnailAsBitmap = (Module[
      "_FPDFPage_GetThumbnailAsBitmap"
    ] = makeInvalidEarlyAccess("_FPDFPage_GetThumbnailAsBitmap"));
    var _FPDFPage_SetMediaBox = (Module["_FPDFPage_SetMediaBox"] =
      makeInvalidEarlyAccess("_FPDFPage_SetMediaBox"));
    var _FPDFPage_SetCropBox = (Module["_FPDFPage_SetCropBox"] =
      makeInvalidEarlyAccess("_FPDFPage_SetCropBox"));
    var _FPDFPage_SetBleedBox = (Module["_FPDFPage_SetBleedBox"] =
      makeInvalidEarlyAccess("_FPDFPage_SetBleedBox"));
    var _FPDFPage_SetTrimBox = (Module["_FPDFPage_SetTrimBox"] =
      makeInvalidEarlyAccess("_FPDFPage_SetTrimBox"));
    var _FPDFPage_SetArtBox = (Module["_FPDFPage_SetArtBox"] =
      makeInvalidEarlyAccess("_FPDFPage_SetArtBox"));
    var _FPDFPage_GetMediaBox = (Module["_FPDFPage_GetMediaBox"] =
      makeInvalidEarlyAccess("_FPDFPage_GetMediaBox"));
    var _FPDFPage_GetCropBox = (Module["_FPDFPage_GetCropBox"] =
      makeInvalidEarlyAccess("_FPDFPage_GetCropBox"));
    var _FPDFPage_GetBleedBox = (Module["_FPDFPage_GetBleedBox"] =
      makeInvalidEarlyAccess("_FPDFPage_GetBleedBox"));
    var _FPDFPage_GetTrimBox = (Module["_FPDFPage_GetTrimBox"] =
      makeInvalidEarlyAccess("_FPDFPage_GetTrimBox"));
    var _FPDFPage_GetArtBox = (Module["_FPDFPage_GetArtBox"] =
      makeInvalidEarlyAccess("_FPDFPage_GetArtBox"));
    var _FPDFPage_TransFormWithClip = (Module["_FPDFPage_TransFormWithClip"] =
      makeInvalidEarlyAccess("_FPDFPage_TransFormWithClip"));
    var _FPDFPageObj_TransformClipPath = (Module[
      "_FPDFPageObj_TransformClipPath"
    ] = makeInvalidEarlyAccess("_FPDFPageObj_TransformClipPath"));
    var _FPDFPageObj_GetClipPath = (Module["_FPDFPageObj_GetClipPath"] =
      makeInvalidEarlyAccess("_FPDFPageObj_GetClipPath"));
    var _FPDFClipPath_CountPaths = (Module["_FPDFClipPath_CountPaths"] =
      makeInvalidEarlyAccess("_FPDFClipPath_CountPaths"));
    var _FPDFClipPath_CountPathSegments = (Module[
      "_FPDFClipPath_CountPathSegments"
    ] = makeInvalidEarlyAccess("_FPDFClipPath_CountPathSegments"));
    var _FPDFClipPath_GetPathSegment = (Module["_FPDFClipPath_GetPathSegment"] =
      makeInvalidEarlyAccess("_FPDFClipPath_GetPathSegment"));
    var _FPDF_CreateClipPath = (Module["_FPDF_CreateClipPath"] =
      makeInvalidEarlyAccess("_FPDF_CreateClipPath"));
    var _FPDF_DestroyClipPath = (Module["_FPDF_DestroyClipPath"] =
      makeInvalidEarlyAccess("_FPDF_DestroyClipPath"));
    var _FPDFPage_InsertClipPath = (Module["_FPDFPage_InsertClipPath"] =
      makeInvalidEarlyAccess("_FPDFPage_InsertClipPath"));
    var _FPDF_InitLibrary = (Module["_FPDF_InitLibrary"] =
      makeInvalidEarlyAccess("_FPDF_InitLibrary"));
    var _malloc = (Module["_malloc"] = makeInvalidEarlyAccess("_malloc"));
    var _free = (Module["_free"] = makeInvalidEarlyAccess("_free"));
    var _FPDF_DestroyLibrary = (Module["_FPDF_DestroyLibrary"] =
      makeInvalidEarlyAccess("_FPDF_DestroyLibrary"));
    var _FPDF_SetSandBoxPolicy = (Module["_FPDF_SetSandBoxPolicy"] =
      makeInvalidEarlyAccess("_FPDF_SetSandBoxPolicy"));
    var _FPDF_LoadDocument = (Module["_FPDF_LoadDocument"] =
      makeInvalidEarlyAccess("_FPDF_LoadDocument"));
    var _FPDF_GetFormType = (Module["_FPDF_GetFormType"] =
      makeInvalidEarlyAccess("_FPDF_GetFormType"));
    var _FPDF_LoadXFA = (Module["_FPDF_LoadXFA"] =
      makeInvalidEarlyAccess("_FPDF_LoadXFA"));
    var _FPDF_LoadMemDocument = (Module["_FPDF_LoadMemDocument"] =
      makeInvalidEarlyAccess("_FPDF_LoadMemDocument"));
    var _FPDF_LoadMemDocument64 = (Module["_FPDF_LoadMemDocument64"] =
      makeInvalidEarlyAccess("_FPDF_LoadMemDocument64"));
    var _FPDF_LoadCustomDocument = (Module["_FPDF_LoadCustomDocument"] =
      makeInvalidEarlyAccess("_FPDF_LoadCustomDocument"));
    var _FPDF_GetFileVersion = (Module["_FPDF_GetFileVersion"] =
      makeInvalidEarlyAccess("_FPDF_GetFileVersion"));
    var _FPDF_DocumentHasValidCrossReferenceTable = (Module[
      "_FPDF_DocumentHasValidCrossReferenceTable"
    ] = makeInvalidEarlyAccess("_FPDF_DocumentHasValidCrossReferenceTable"));
    var _FPDF_GetDocPermissions = (Module["_FPDF_GetDocPermissions"] =
      makeInvalidEarlyAccess("_FPDF_GetDocPermissions"));
    var _FPDF_GetDocUserPermissions = (Module["_FPDF_GetDocUserPermissions"] =
      makeInvalidEarlyAccess("_FPDF_GetDocUserPermissions"));
    var _FPDF_GetSecurityHandlerRevision = (Module[
      "_FPDF_GetSecurityHandlerRevision"
    ] = makeInvalidEarlyAccess("_FPDF_GetSecurityHandlerRevision"));
    var _FPDF_GetPageCount = (Module["_FPDF_GetPageCount"] =
      makeInvalidEarlyAccess("_FPDF_GetPageCount"));
    var _FPDF_LoadPage = (Module["_FPDF_LoadPage"] =
      makeInvalidEarlyAccess("_FPDF_LoadPage"));
    var _FPDF_GetPageWidthF = (Module["_FPDF_GetPageWidthF"] =
      makeInvalidEarlyAccess("_FPDF_GetPageWidthF"));
    var _FPDF_GetPageWidth = (Module["_FPDF_GetPageWidth"] =
      makeInvalidEarlyAccess("_FPDF_GetPageWidth"));
    var _FPDF_GetPageHeightF = (Module["_FPDF_GetPageHeightF"] =
      makeInvalidEarlyAccess("_FPDF_GetPageHeightF"));
    var _FPDF_GetPageHeight = (Module["_FPDF_GetPageHeight"] =
      makeInvalidEarlyAccess("_FPDF_GetPageHeight"));
    var _FPDF_GetPageBoundingBox = (Module["_FPDF_GetPageBoundingBox"] =
      makeInvalidEarlyAccess("_FPDF_GetPageBoundingBox"));
    var _FPDF_RenderPageBitmap = (Module["_FPDF_RenderPageBitmap"] =
      makeInvalidEarlyAccess("_FPDF_RenderPageBitmap"));
    var _FPDF_RenderPageBitmapWithMatrix = (Module[
      "_FPDF_RenderPageBitmapWithMatrix"
    ] = makeInvalidEarlyAccess("_FPDF_RenderPageBitmapWithMatrix"));
    var _FPDF_ClosePage = (Module["_FPDF_ClosePage"] =
      makeInvalidEarlyAccess("_FPDF_ClosePage"));
    var _FPDF_CloseDocument = (Module["_FPDF_CloseDocument"] =
      makeInvalidEarlyAccess("_FPDF_CloseDocument"));
    var _FPDF_GetLastError = (Module["_FPDF_GetLastError"] =
      makeInvalidEarlyAccess("_FPDF_GetLastError"));
    var _FPDF_DeviceToPage = (Module["_FPDF_DeviceToPage"] =
      makeInvalidEarlyAccess("_FPDF_DeviceToPage"));
    var _FPDF_PageToDevice = (Module["_FPDF_PageToDevice"] =
      makeInvalidEarlyAccess("_FPDF_PageToDevice"));
    var _FPDFBitmap_Create = (Module["_FPDFBitmap_Create"] =
      makeInvalidEarlyAccess("_FPDFBitmap_Create"));
    var _FPDFBitmap_CreateEx = (Module["_FPDFBitmap_CreateEx"] =
      makeInvalidEarlyAccess("_FPDFBitmap_CreateEx"));
    var _FPDFBitmap_GetFormat = (Module["_FPDFBitmap_GetFormat"] =
      makeInvalidEarlyAccess("_FPDFBitmap_GetFormat"));
    var _FPDFBitmap_FillRect = (Module["_FPDFBitmap_FillRect"] =
      makeInvalidEarlyAccess("_FPDFBitmap_FillRect"));
    var _FPDFBitmap_GetBuffer = (Module["_FPDFBitmap_GetBuffer"] =
      makeInvalidEarlyAccess("_FPDFBitmap_GetBuffer"));
    var _FPDFBitmap_GetWidth = (Module["_FPDFBitmap_GetWidth"] =
      makeInvalidEarlyAccess("_FPDFBitmap_GetWidth"));
    var _FPDFBitmap_GetHeight = (Module["_FPDFBitmap_GetHeight"] =
      makeInvalidEarlyAccess("_FPDFBitmap_GetHeight"));
    var _FPDFBitmap_GetStride = (Module["_FPDFBitmap_GetStride"] =
      makeInvalidEarlyAccess("_FPDFBitmap_GetStride"));
    var _FPDFBitmap_Destroy = (Module["_FPDFBitmap_Destroy"] =
      makeInvalidEarlyAccess("_FPDFBitmap_Destroy"));
    var _FPDF_GetPageSizeByIndexF = (Module["_FPDF_GetPageSizeByIndexF"] =
      makeInvalidEarlyAccess("_FPDF_GetPageSizeByIndexF"));
    var _FPDF_GetPageSizeByIndex = (Module["_FPDF_GetPageSizeByIndex"] =
      makeInvalidEarlyAccess("_FPDF_GetPageSizeByIndex"));
    var _FPDF_VIEWERREF_GetPrintScaling = (Module[
      "_FPDF_VIEWERREF_GetPrintScaling"
    ] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintScaling"));
    var _FPDF_VIEWERREF_GetNumCopies = (Module["_FPDF_VIEWERREF_GetNumCopies"] =
      makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetNumCopies"));
    var _FPDF_VIEWERREF_GetPrintPageRange = (Module[
      "_FPDF_VIEWERREF_GetPrintPageRange"
    ] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintPageRange"));
    var _FPDF_VIEWERREF_GetPrintPageRangeCount = (Module[
      "_FPDF_VIEWERREF_GetPrintPageRangeCount"
    ] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintPageRangeCount"));
    var _FPDF_VIEWERREF_GetPrintPageRangeElement = (Module[
      "_FPDF_VIEWERREF_GetPrintPageRangeElement"
    ] = makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetPrintPageRangeElement"));
    var _FPDF_VIEWERREF_GetDuplex = (Module["_FPDF_VIEWERREF_GetDuplex"] =
      makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetDuplex"));
    var _FPDF_VIEWERREF_GetName = (Module["_FPDF_VIEWERREF_GetName"] =
      makeInvalidEarlyAccess("_FPDF_VIEWERREF_GetName"));
    var _FPDF_CountNamedDests = (Module["_FPDF_CountNamedDests"] =
      makeInvalidEarlyAccess("_FPDF_CountNamedDests"));
    var _FPDF_GetNamedDestByName = (Module["_FPDF_GetNamedDestByName"] =
      makeInvalidEarlyAccess("_FPDF_GetNamedDestByName"));
    var _FPDF_GetNamedDest = (Module["_FPDF_GetNamedDest"] =
      makeInvalidEarlyAccess("_FPDF_GetNamedDest"));
    var _FPDF_GetXFAPacketCount = (Module["_FPDF_GetXFAPacketCount"] =
      makeInvalidEarlyAccess("_FPDF_GetXFAPacketCount"));
    var _FPDF_GetXFAPacketName = (Module["_FPDF_GetXFAPacketName"] =
      makeInvalidEarlyAccess("_FPDF_GetXFAPacketName"));
    var _FPDF_GetXFAPacketContent = (Module["_FPDF_GetXFAPacketContent"] =
      makeInvalidEarlyAccess("_FPDF_GetXFAPacketContent"));
    var _FPDF_GetTrailerEnds = (Module["_FPDF_GetTrailerEnds"] =
      makeInvalidEarlyAccess("_FPDF_GetTrailerEnds"));
    var _fflush = makeInvalidEarlyAccess("_fflush");
    var _emscripten_stack_get_end = makeInvalidEarlyAccess(
      "_emscripten_stack_get_end",
    );
    var _emscripten_stack_get_base = makeInvalidEarlyAccess(
      "_emscripten_stack_get_base",
    );
    var _emscripten_builtin_memalign = makeInvalidEarlyAccess(
      "_emscripten_builtin_memalign",
    );
    var _strerror = makeInvalidEarlyAccess("_strerror");
    var _setThrew = makeInvalidEarlyAccess("_setThrew");
    var _emscripten_stack_init = makeInvalidEarlyAccess(
      "_emscripten_stack_init",
    );
    var _emscripten_stack_get_free = makeInvalidEarlyAccess(
      "_emscripten_stack_get_free",
    );
    var __emscripten_stack_restore = makeInvalidEarlyAccess(
      "__emscripten_stack_restore",
    );
    var __emscripten_stack_alloc = makeInvalidEarlyAccess(
      "__emscripten_stack_alloc",
    );
    var _emscripten_stack_get_current = makeInvalidEarlyAccess(
      "_emscripten_stack_get_current",
    );
    var memory = makeInvalidEarlyAccess("memory");
    var __indirect_function_table = makeInvalidEarlyAccess(
      "__indirect_function_table",
    );
    var wasmMemory = makeInvalidEarlyAccess("wasmMemory");
    var wasmTable = makeInvalidEarlyAccess("wasmTable");
    function assignWasmExports(wasmExports) {
      assert(
        typeof wasmExports["PDFium_Init"] != "undefined",
        "missing Wasm export: PDFium_Init",
      );
      assert(
        typeof wasmExports["FPDF_InitLibraryWithConfig"] != "undefined",
        "missing Wasm export: FPDF_InitLibraryWithConfig",
      );
      assert(
        typeof wasmExports["FPDFAnnot_IsSupportedSubtype"] != "undefined",
        "missing Wasm export: FPDFAnnot_IsSupportedSubtype",
      );
      assert(
        typeof wasmExports["FPDFPage_CreateAnnot"] != "undefined",
        "missing Wasm export: FPDFPage_CreateAnnot",
      );
      assert(
        typeof wasmExports["FPDFPage_GetAnnotCount"] != "undefined",
        "missing Wasm export: FPDFPage_GetAnnotCount",
      );
      assert(
        typeof wasmExports["FPDFPage_GetAnnot"] != "undefined",
        "missing Wasm export: FPDFPage_GetAnnot",
      );
      assert(
        typeof wasmExports["FPDFPage_GetAnnotIndex"] != "undefined",
        "missing Wasm export: FPDFPage_GetAnnotIndex",
      );
      assert(
        typeof wasmExports["FPDFPage_CloseAnnot"] != "undefined",
        "missing Wasm export: FPDFPage_CloseAnnot",
      );
      assert(
        typeof wasmExports["FPDFPage_RemoveAnnot"] != "undefined",
        "missing Wasm export: FPDFPage_RemoveAnnot",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetSubtype"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetSubtype",
      );
      assert(
        typeof wasmExports["FPDFAnnot_IsObjectSupportedSubtype"] != "undefined",
        "missing Wasm export: FPDFAnnot_IsObjectSupportedSubtype",
      );
      assert(
        typeof wasmExports["FPDFAnnot_UpdateObject"] != "undefined",
        "missing Wasm export: FPDFAnnot_UpdateObject",
      );
      assert(
        typeof wasmExports["FPDFAnnot_AddInkStroke"] != "undefined",
        "missing Wasm export: FPDFAnnot_AddInkStroke",
      );
      assert(
        typeof wasmExports["FPDFAnnot_RemoveInkList"] != "undefined",
        "missing Wasm export: FPDFAnnot_RemoveInkList",
      );
      assert(
        typeof wasmExports["FPDFAnnot_AppendObject"] != "undefined",
        "missing Wasm export: FPDFAnnot_AppendObject",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetObjectCount"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetObjectCount",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetObject"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetObject",
      );
      assert(
        typeof wasmExports["FPDFAnnot_RemoveObject"] != "undefined",
        "missing Wasm export: FPDFAnnot_RemoveObject",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetColor"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetColor",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetColor"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetColor",
      );
      assert(
        typeof wasmExports["FPDFAnnot_HasAttachmentPoints"] != "undefined",
        "missing Wasm export: FPDFAnnot_HasAttachmentPoints",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetAttachmentPoints"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetAttachmentPoints",
      );
      assert(
        typeof wasmExports["FPDFAnnot_AppendAttachmentPoints"] != "undefined",
        "missing Wasm export: FPDFAnnot_AppendAttachmentPoints",
      );
      assert(
        typeof wasmExports["FPDFAnnot_CountAttachmentPoints"] != "undefined",
        "missing Wasm export: FPDFAnnot_CountAttachmentPoints",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetAttachmentPoints"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetAttachmentPoints",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetRect"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetRect",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetRect"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetRect",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetVertices"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetVertices",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetInkListCount"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetInkListCount",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetInkListPath"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetInkListPath",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetLine"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetLine",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetBorder"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetBorder",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetBorder"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetBorder",
      );
      assert(
        typeof wasmExports["FPDFAnnot_HasKey"] != "undefined",
        "missing Wasm export: FPDFAnnot_HasKey",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetValueType"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetValueType",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetStringValue"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetStringValue",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetStringValue"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetStringValue",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetNumberValue"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetNumberValue",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetAP"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetAP",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetAP"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetAP",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetLinkedAnnot"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetLinkedAnnot",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFlags"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFlags",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetFlags"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetFlags",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldFlags"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldFlags",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetFormFieldFlags"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetFormFieldFlags",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldAtPoint"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldAtPoint",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldName"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldName",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldType"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldType",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormAdditionalActionJavaScript"] !=
          "undefined",
        "missing Wasm export: FPDFAnnot_GetFormAdditionalActionJavaScript",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldAlternateName"] !=
          "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldAlternateName",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldValue"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldValue",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetOptionCount"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetOptionCount",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetOptionLabel"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetOptionLabel",
      );
      assert(
        typeof wasmExports["FPDFAnnot_IsOptionSelected"] != "undefined",
        "missing Wasm export: FPDFAnnot_IsOptionSelected",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFontSize"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFontSize",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetFontColor"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetFontColor",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFontColor"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFontColor",
      );
      assert(
        typeof wasmExports["FPDFAnnot_IsChecked"] != "undefined",
        "missing Wasm export: FPDFAnnot_IsChecked",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetFocusableSubtypes"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetFocusableSubtypes",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFocusableSubtypesCount"] !=
          "undefined",
        "missing Wasm export: FPDFAnnot_GetFocusableSubtypesCount",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFocusableSubtypes"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFocusableSubtypes",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetLink"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetLink",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormControlCount"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormControlCount",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormControlIndex"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormControlIndex",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFormFieldExportValue"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFormFieldExportValue",
      );
      assert(
        typeof wasmExports["FPDFAnnot_SetURI"] != "undefined",
        "missing Wasm export: FPDFAnnot_SetURI",
      );
      assert(
        typeof wasmExports["FPDFAnnot_GetFileAttachment"] != "undefined",
        "missing Wasm export: FPDFAnnot_GetFileAttachment",
      );
      assert(
        typeof wasmExports["FPDFAnnot_AddFileAttachment"] != "undefined",
        "missing Wasm export: FPDFAnnot_AddFileAttachment",
      );
      assert(
        typeof wasmExports["FPDFDoc_GetAttachmentCount"] != "undefined",
        "missing Wasm export: FPDFDoc_GetAttachmentCount",
      );
      assert(
        typeof wasmExports["FPDFDoc_AddAttachment"] != "undefined",
        "missing Wasm export: FPDFDoc_AddAttachment",
      );
      assert(
        typeof wasmExports["FPDFDoc_GetAttachment"] != "undefined",
        "missing Wasm export: FPDFDoc_GetAttachment",
      );
      assert(
        typeof wasmExports["FPDFDoc_DeleteAttachment"] != "undefined",
        "missing Wasm export: FPDFDoc_DeleteAttachment",
      );
      assert(
        typeof wasmExports["FPDFAttachment_GetName"] != "undefined",
        "missing Wasm export: FPDFAttachment_GetName",
      );
      assert(
        typeof wasmExports["FPDFAttachment_HasKey"] != "undefined",
        "missing Wasm export: FPDFAttachment_HasKey",
      );
      assert(
        typeof wasmExports["FPDFAttachment_GetValueType"] != "undefined",
        "missing Wasm export: FPDFAttachment_GetValueType",
      );
      assert(
        typeof wasmExports["FPDFAttachment_SetStringValue"] != "undefined",
        "missing Wasm export: FPDFAttachment_SetStringValue",
      );
      assert(
        typeof wasmExports["FPDFAttachment_GetStringValue"] != "undefined",
        "missing Wasm export: FPDFAttachment_GetStringValue",
      );
      assert(
        typeof wasmExports["FPDFAttachment_SetFile"] != "undefined",
        "missing Wasm export: FPDFAttachment_SetFile",
      );
      assert(
        typeof wasmExports["FPDFAttachment_GetFile"] != "undefined",
        "missing Wasm export: FPDFAttachment_GetFile",
      );
      assert(
        typeof wasmExports["FPDFAttachment_GetSubtype"] != "undefined",
        "missing Wasm export: FPDFAttachment_GetSubtype",
      );
      assert(
        typeof wasmExports["FPDFCatalog_IsTagged"] != "undefined",
        "missing Wasm export: FPDFCatalog_IsTagged",
      );
      assert(
        typeof wasmExports["FPDFCatalog_GetLanguage"] != "undefined",
        "missing Wasm export: FPDFCatalog_GetLanguage",
      );
      assert(
        typeof wasmExports["FPDFCatalog_SetLanguage"] != "undefined",
        "missing Wasm export: FPDFCatalog_SetLanguage",
      );
      assert(
        typeof wasmExports["FPDFAvail_Create"] != "undefined",
        "missing Wasm export: FPDFAvail_Create",
      );
      assert(
        typeof wasmExports["FPDFAvail_Destroy"] != "undefined",
        "missing Wasm export: FPDFAvail_Destroy",
      );
      assert(
        typeof wasmExports["FPDFAvail_IsDocAvail"] != "undefined",
        "missing Wasm export: FPDFAvail_IsDocAvail",
      );
      assert(
        typeof wasmExports["FPDFAvail_GetDocument"] != "undefined",
        "missing Wasm export: FPDFAvail_GetDocument",
      );
      assert(
        typeof wasmExports["FPDFAvail_GetFirstPageNum"] != "undefined",
        "missing Wasm export: FPDFAvail_GetFirstPageNum",
      );
      assert(
        typeof wasmExports["FPDFAvail_IsPageAvail"] != "undefined",
        "missing Wasm export: FPDFAvail_IsPageAvail",
      );
      assert(
        typeof wasmExports["FPDFAvail_IsFormAvail"] != "undefined",
        "missing Wasm export: FPDFAvail_IsFormAvail",
      );
      assert(
        typeof wasmExports["FPDFAvail_IsLinearized"] != "undefined",
        "missing Wasm export: FPDFAvail_IsLinearized",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetFirstChild"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetFirstChild",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetNextSibling"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetNextSibling",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetTitle"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetTitle",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetCount"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetCount",
      );
      assert(
        typeof wasmExports["FPDFBookmark_Find"] != "undefined",
        "missing Wasm export: FPDFBookmark_Find",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetDest"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetDest",
      );
      assert(
        typeof wasmExports["FPDFBookmark_GetAction"] != "undefined",
        "missing Wasm export: FPDFBookmark_GetAction",
      );
      assert(
        typeof wasmExports["FPDFAction_GetType"] != "undefined",
        "missing Wasm export: FPDFAction_GetType",
      );
      assert(
        typeof wasmExports["FPDFAction_GetDest"] != "undefined",
        "missing Wasm export: FPDFAction_GetDest",
      );
      assert(
        typeof wasmExports["FPDFAction_GetFilePath"] != "undefined",
        "missing Wasm export: FPDFAction_GetFilePath",
      );
      assert(
        typeof wasmExports["FPDFAction_GetURIPath"] != "undefined",
        "missing Wasm export: FPDFAction_GetURIPath",
      );
      assert(
        typeof wasmExports["FPDFDest_GetDestPageIndex"] != "undefined",
        "missing Wasm export: FPDFDest_GetDestPageIndex",
      );
      assert(
        typeof wasmExports["FPDFDest_GetView"] != "undefined",
        "missing Wasm export: FPDFDest_GetView",
      );
      assert(
        typeof wasmExports["FPDFDest_GetLocationInPage"] != "undefined",
        "missing Wasm export: FPDFDest_GetLocationInPage",
      );
      assert(
        typeof wasmExports["FPDFLink_GetLinkAtPoint"] != "undefined",
        "missing Wasm export: FPDFLink_GetLinkAtPoint",
      );
      assert(
        typeof wasmExports["FPDFLink_GetLinkZOrderAtPoint"] != "undefined",
        "missing Wasm export: FPDFLink_GetLinkZOrderAtPoint",
      );
      assert(
        typeof wasmExports["FPDFLink_GetDest"] != "undefined",
        "missing Wasm export: FPDFLink_GetDest",
      );
      assert(
        typeof wasmExports["FPDFLink_GetAction"] != "undefined",
        "missing Wasm export: FPDFLink_GetAction",
      );
      assert(
        typeof wasmExports["FPDFLink_Enumerate"] != "undefined",
        "missing Wasm export: FPDFLink_Enumerate",
      );
      assert(
        typeof wasmExports["FPDFLink_GetAnnot"] != "undefined",
        "missing Wasm export: FPDFLink_GetAnnot",
      );
      assert(
        typeof wasmExports["FPDFLink_GetAnnotRect"] != "undefined",
        "missing Wasm export: FPDFLink_GetAnnotRect",
      );
      assert(
        typeof wasmExports["FPDFLink_CountQuadPoints"] != "undefined",
        "missing Wasm export: FPDFLink_CountQuadPoints",
      );
      assert(
        typeof wasmExports["FPDFLink_GetQuadPoints"] != "undefined",
        "missing Wasm export: FPDFLink_GetQuadPoints",
      );
      assert(
        typeof wasmExports["FPDF_GetPageAAction"] != "undefined",
        "missing Wasm export: FPDF_GetPageAAction",
      );
      assert(
        typeof wasmExports["FPDF_GetFileIdentifier"] != "undefined",
        "missing Wasm export: FPDF_GetFileIdentifier",
      );
      assert(
        typeof wasmExports["FPDF_GetMetaText"] != "undefined",
        "missing Wasm export: FPDF_GetMetaText",
      );
      assert(
        typeof wasmExports["FPDF_GetPageLabel"] != "undefined",
        "missing Wasm export: FPDF_GetPageLabel",
      );
      assert(
        typeof wasmExports["FPDFPageObj_NewImageObj"] != "undefined",
        "missing Wasm export: FPDFPageObj_NewImageObj",
      );
      assert(
        typeof wasmExports["FPDFImageObj_LoadJpegFile"] != "undefined",
        "missing Wasm export: FPDFImageObj_LoadJpegFile",
      );
      assert(
        typeof wasmExports["FPDFImageObj_LoadJpegFileInline"] != "undefined",
        "missing Wasm export: FPDFImageObj_LoadJpegFileInline",
      );
      assert(
        typeof wasmExports["FPDFImageObj_SetMatrix"] != "undefined",
        "missing Wasm export: FPDFImageObj_SetMatrix",
      );
      assert(
        typeof wasmExports["FPDFImageObj_SetBitmap"] != "undefined",
        "missing Wasm export: FPDFImageObj_SetBitmap",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetBitmap"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetBitmap",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetRenderedBitmap"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetRenderedBitmap",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImageDataDecoded"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImageDataDecoded",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImageDataRaw"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImageDataRaw",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImageFilterCount"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImageFilterCount",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImageFilter"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImageFilter",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImageMetadata"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImageMetadata",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetImagePixelSize"] != "undefined",
        "missing Wasm export: FPDFImageObj_GetImagePixelSize",
      );
      assert(
        typeof wasmExports["FPDFImageObj_GetIccProfileDataDecoded"] !=
          "undefined",
        "missing Wasm export: FPDFImageObj_GetIccProfileDataDecoded",
      );
      assert(
        typeof wasmExports["FPDF_CreateNewDocument"] != "undefined",
        "missing Wasm export: FPDF_CreateNewDocument",
      );
      assert(
        typeof wasmExports["FPDFPage_Delete"] != "undefined",
        "missing Wasm export: FPDFPage_Delete",
      );
      assert(
        typeof wasmExports["FPDF_MovePages"] != "undefined",
        "missing Wasm export: FPDF_MovePages",
      );
      assert(
        typeof wasmExports["FPDFPage_New"] != "undefined",
        "missing Wasm export: FPDFPage_New",
      );
      assert(
        typeof wasmExports["FPDFPage_GetRotation"] != "undefined",
        "missing Wasm export: FPDFPage_GetRotation",
      );
      assert(
        typeof wasmExports["FPDFPage_InsertObject"] != "undefined",
        "missing Wasm export: FPDFPage_InsertObject",
      );
      assert(
        typeof wasmExports["FPDFPage_InsertObjectAtIndex"] != "undefined",
        "missing Wasm export: FPDFPage_InsertObjectAtIndex",
      );
      assert(
        typeof wasmExports["FPDFPage_RemoveObject"] != "undefined",
        "missing Wasm export: FPDFPage_RemoveObject",
      );
      assert(
        typeof wasmExports["FPDFPage_CountObjects"] != "undefined",
        "missing Wasm export: FPDFPage_CountObjects",
      );
      assert(
        typeof wasmExports["FPDFPage_GetObject"] != "undefined",
        "missing Wasm export: FPDFPage_GetObject",
      );
      assert(
        typeof wasmExports["FPDFPage_HasTransparency"] != "undefined",
        "missing Wasm export: FPDFPage_HasTransparency",
      );
      assert(
        typeof wasmExports["FPDFPageObj_Destroy"] != "undefined",
        "missing Wasm export: FPDFPageObj_Destroy",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetMarkedContentID"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetMarkedContentID",
      );
      assert(
        typeof wasmExports["FPDFPageObj_CountMarks"] != "undefined",
        "missing Wasm export: FPDFPageObj_CountMarks",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetMark"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetMark",
      );
      assert(
        typeof wasmExports["FPDFPageObj_AddExistingMark"] != "undefined",
        "missing Wasm export: FPDFPageObj_AddExistingMark",
      );
      assert(
        typeof wasmExports["FPDFPageObj_AddMark"] != "undefined",
        "missing Wasm export: FPDFPageObj_AddMark",
      );
      assert(
        typeof wasmExports["FPDFPageObj_RemoveMark"] != "undefined",
        "missing Wasm export: FPDFPageObj_RemoveMark",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetName"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetName",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_CountParams"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_CountParams",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamKey"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamKey",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamValueType"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamValueType",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamIntValue"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamIntValue",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamFloatValue"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamFloatValue",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamStringValue"] !=
          "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamStringValue",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_GetParamBlobValue"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_GetParamBlobValue",
      );
      assert(
        typeof wasmExports["FPDFPageObj_HasTransparency"] != "undefined",
        "missing Wasm export: FPDFPageObj_HasTransparency",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_SetIntParam"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_SetIntParam",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_SetFloatParam"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_SetFloatParam",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_SetStringParam"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_SetStringParam",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_SetBlobParam"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_SetBlobParam",
      );
      assert(
        typeof wasmExports["FPDFPageObjMark_RemoveParam"] != "undefined",
        "missing Wasm export: FPDFPageObjMark_RemoveParam",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetType"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetType",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetIsActive"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetIsActive",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetIsActive"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetIsActive",
      );
      assert(
        typeof wasmExports["FPDFPage_GenerateContent"] != "undefined",
        "missing Wasm export: FPDFPage_GenerateContent",
      );
      assert(
        typeof wasmExports["FPDFPageObj_Transform"] != "undefined",
        "missing Wasm export: FPDFPageObj_Transform",
      );
      assert(
        typeof wasmExports["FPDFPageObj_TransformF"] != "undefined",
        "missing Wasm export: FPDFPageObj_TransformF",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetMatrix"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetMatrix",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetMatrix"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetMatrix",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetBlendMode"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetBlendMode",
      );
      assert(
        typeof wasmExports["FPDFPage_TransformAnnots"] != "undefined",
        "missing Wasm export: FPDFPage_TransformAnnots",
      );
      assert(
        typeof wasmExports["FPDFPage_SetRotation"] != "undefined",
        "missing Wasm export: FPDFPage_SetRotation",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetFillColor"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetFillColor",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetFillColor"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetFillColor",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetBounds"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetBounds",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetRotatedBounds"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetRotatedBounds",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetStrokeColor"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetStrokeColor",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetStrokeColor"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetStrokeColor",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetStrokeWidth"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetStrokeWidth",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetStrokeWidth"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetStrokeWidth",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetLineJoin"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetLineJoin",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetLineJoin"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetLineJoin",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetLineCap"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetLineCap",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetLineCap"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetLineCap",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetDashPhase"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetDashPhase",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetDashPhase"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetDashPhase",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetDashCount"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetDashCount",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetDashArray"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetDashArray",
      );
      assert(
        typeof wasmExports["FPDFPageObj_SetDashArray"] != "undefined",
        "missing Wasm export: FPDFPageObj_SetDashArray",
      );
      assert(
        typeof wasmExports["FPDFFormObj_CountObjects"] != "undefined",
        "missing Wasm export: FPDFFormObj_CountObjects",
      );
      assert(
        typeof wasmExports["FPDFFormObj_GetObject"] != "undefined",
        "missing Wasm export: FPDFFormObj_GetObject",
      );
      assert(
        typeof wasmExports["FPDFFormObj_RemoveObject"] != "undefined",
        "missing Wasm export: FPDFFormObj_RemoveObject",
      );
      assert(
        typeof wasmExports["FPDFPageObj_CreateNewPath"] != "undefined",
        "missing Wasm export: FPDFPageObj_CreateNewPath",
      );
      assert(
        typeof wasmExports["FPDFPageObj_CreateNewRect"] != "undefined",
        "missing Wasm export: FPDFPageObj_CreateNewRect",
      );
      assert(
        typeof wasmExports["FPDFPath_CountSegments"] != "undefined",
        "missing Wasm export: FPDFPath_CountSegments",
      );
      assert(
        typeof wasmExports["FPDFPath_GetPathSegment"] != "undefined",
        "missing Wasm export: FPDFPath_GetPathSegment",
      );
      assert(
        typeof wasmExports["FPDFPath_MoveTo"] != "undefined",
        "missing Wasm export: FPDFPath_MoveTo",
      );
      assert(
        typeof wasmExports["FPDFPath_LineTo"] != "undefined",
        "missing Wasm export: FPDFPath_LineTo",
      );
      assert(
        typeof wasmExports["FPDFPath_BezierTo"] != "undefined",
        "missing Wasm export: FPDFPath_BezierTo",
      );
      assert(
        typeof wasmExports["FPDFPath_Close"] != "undefined",
        "missing Wasm export: FPDFPath_Close",
      );
      assert(
        typeof wasmExports["FPDFPath_SetDrawMode"] != "undefined",
        "missing Wasm export: FPDFPath_SetDrawMode",
      );
      assert(
        typeof wasmExports["FPDFPath_GetDrawMode"] != "undefined",
        "missing Wasm export: FPDFPath_GetDrawMode",
      );
      assert(
        typeof wasmExports["FPDFPathSegment_GetPoint"] != "undefined",
        "missing Wasm export: FPDFPathSegment_GetPoint",
      );
      assert(
        typeof wasmExports["FPDFPathSegment_GetType"] != "undefined",
        "missing Wasm export: FPDFPathSegment_GetType",
      );
      assert(
        typeof wasmExports["FPDFPathSegment_GetClose"] != "undefined",
        "missing Wasm export: FPDFPathSegment_GetClose",
      );
      assert(
        typeof wasmExports["FPDFPageObj_NewTextObj"] != "undefined",
        "missing Wasm export: FPDFPageObj_NewTextObj",
      );
      assert(
        typeof wasmExports["FPDFText_SetText"] != "undefined",
        "missing Wasm export: FPDFText_SetText",
      );
      assert(
        typeof wasmExports["FPDFText_SetCharcodes"] != "undefined",
        "missing Wasm export: FPDFText_SetCharcodes",
      );
      assert(
        typeof wasmExports["FPDFText_SetPositions"] != "undefined",
        "missing Wasm export: FPDFText_SetPositions",
      );
      assert(
        typeof wasmExports["FPDFText_LoadFont"] != "undefined",
        "missing Wasm export: FPDFText_LoadFont",
      );
      assert(
        typeof wasmExports["FPDFText_LoadStandardFont"] != "undefined",
        "missing Wasm export: FPDFText_LoadStandardFont",
      );
      assert(
        typeof wasmExports["FPDFText_LoadCidType2Font"] != "undefined",
        "missing Wasm export: FPDFText_LoadCidType2Font",
      );
      assert(
        typeof wasmExports["FPDFTextObj_GetFontSize"] != "undefined",
        "missing Wasm export: FPDFTextObj_GetFontSize",
      );
      assert(
        typeof wasmExports["FPDFTextObj_SetFontSize"] != "undefined",
        "missing Wasm export: FPDFTextObj_SetFontSize",
      );
      assert(
        typeof wasmExports["FPDFTextObj_GetText"] != "undefined",
        "missing Wasm export: FPDFTextObj_GetText",
      );
      assert(
        typeof wasmExports["FPDFTextObj_GetRenderedBitmap"] != "undefined",
        "missing Wasm export: FPDFTextObj_GetRenderedBitmap",
      );
      assert(
        typeof wasmExports["FPDFFont_Close"] != "undefined",
        "missing Wasm export: FPDFFont_Close",
      );
      assert(
        typeof wasmExports["FPDFPageObj_CreateTextObj"] != "undefined",
        "missing Wasm export: FPDFPageObj_CreateTextObj",
      );
      assert(
        typeof wasmExports["FPDFTextObj_GetTextRenderMode"] != "undefined",
        "missing Wasm export: FPDFTextObj_GetTextRenderMode",
      );
      assert(
        typeof wasmExports["FPDFTextObj_SetTextRenderMode"] != "undefined",
        "missing Wasm export: FPDFTextObj_SetTextRenderMode",
      );
      assert(
        typeof wasmExports["FPDFTextObj_GetFont"] != "undefined",
        "missing Wasm export: FPDFTextObj_GetFont",
      );
      assert(
        typeof wasmExports["FPDFFont_GetBaseFontName"] != "undefined",
        "missing Wasm export: FPDFFont_GetBaseFontName",
      );
      assert(
        typeof wasmExports["FPDFFont_GetFamilyName"] != "undefined",
        "missing Wasm export: FPDFFont_GetFamilyName",
      );
      assert(
        typeof wasmExports["FPDFFont_GetFontData"] != "undefined",
        "missing Wasm export: FPDFFont_GetFontData",
      );
      assert(
        typeof wasmExports["FPDFFont_GetIsEmbedded"] != "undefined",
        "missing Wasm export: FPDFFont_GetIsEmbedded",
      );
      assert(
        typeof wasmExports["FPDFFont_GetFlags"] != "undefined",
        "missing Wasm export: FPDFFont_GetFlags",
      );
      assert(
        typeof wasmExports["FPDFFont_GetWeight"] != "undefined",
        "missing Wasm export: FPDFFont_GetWeight",
      );
      assert(
        typeof wasmExports["FPDFFont_GetItalicAngle"] != "undefined",
        "missing Wasm export: FPDFFont_GetItalicAngle",
      );
      assert(
        typeof wasmExports["FPDFFont_GetAscent"] != "undefined",
        "missing Wasm export: FPDFFont_GetAscent",
      );
      assert(
        typeof wasmExports["FPDFFont_GetDescent"] != "undefined",
        "missing Wasm export: FPDFFont_GetDescent",
      );
      assert(
        typeof wasmExports["FPDFFont_GetGlyphWidth"] != "undefined",
        "missing Wasm export: FPDFFont_GetGlyphWidth",
      );
      assert(
        typeof wasmExports["FPDFFont_GetGlyphPath"] != "undefined",
        "missing Wasm export: FPDFFont_GetGlyphPath",
      );
      assert(
        typeof wasmExports["FPDFGlyphPath_CountGlyphSegments"] != "undefined",
        "missing Wasm export: FPDFGlyphPath_CountGlyphSegments",
      );
      assert(
        typeof wasmExports["FPDFGlyphPath_GetGlyphPathSegment"] != "undefined",
        "missing Wasm export: FPDFGlyphPath_GetGlyphPathSegment",
      );
      assert(
        typeof wasmExports["FSDK_SetUnSpObjProcessHandler"] != "undefined",
        "missing Wasm export: FSDK_SetUnSpObjProcessHandler",
      );
      assert(
        typeof wasmExports["FSDK_SetTimeFunction"] != "undefined",
        "missing Wasm export: FSDK_SetTimeFunction",
      );
      assert(
        typeof wasmExports["FSDK_SetLocaltimeFunction"] != "undefined",
        "missing Wasm export: FSDK_SetLocaltimeFunction",
      );
      assert(
        typeof wasmExports["FPDFDoc_GetPageMode"] != "undefined",
        "missing Wasm export: FPDFDoc_GetPageMode",
      );
      assert(
        typeof wasmExports["FPDFPage_Flatten"] != "undefined",
        "missing Wasm export: FPDFPage_Flatten",
      );
      assert(
        typeof wasmExports["FPDFPage_HasFormFieldAtPoint"] != "undefined",
        "missing Wasm export: FPDFPage_HasFormFieldAtPoint",
      );
      assert(
        typeof wasmExports["FPDFPage_FormFieldZOrderAtPoint"] != "undefined",
        "missing Wasm export: FPDFPage_FormFieldZOrderAtPoint",
      );
      assert(
        typeof wasmExports["FPDFDOC_InitFormFillEnvironment"] != "undefined",
        "missing Wasm export: FPDFDOC_InitFormFillEnvironment",
      );
      assert(
        typeof wasmExports["FPDFDOC_ExitFormFillEnvironment"] != "undefined",
        "missing Wasm export: FPDFDOC_ExitFormFillEnvironment",
      );
      assert(
        typeof wasmExports["FORM_OnMouseMove"] != "undefined",
        "missing Wasm export: FORM_OnMouseMove",
      );
      assert(
        typeof wasmExports["FORM_OnMouseWheel"] != "undefined",
        "missing Wasm export: FORM_OnMouseWheel",
      );
      assert(
        typeof wasmExports["FORM_OnFocus"] != "undefined",
        "missing Wasm export: FORM_OnFocus",
      );
      assert(
        typeof wasmExports["FORM_OnLButtonDown"] != "undefined",
        "missing Wasm export: FORM_OnLButtonDown",
      );
      assert(
        typeof wasmExports["FORM_OnLButtonUp"] != "undefined",
        "missing Wasm export: FORM_OnLButtonUp",
      );
      assert(
        typeof wasmExports["FORM_OnLButtonDoubleClick"] != "undefined",
        "missing Wasm export: FORM_OnLButtonDoubleClick",
      );
      assert(
        typeof wasmExports["FORM_OnRButtonDown"] != "undefined",
        "missing Wasm export: FORM_OnRButtonDown",
      );
      assert(
        typeof wasmExports["FORM_OnRButtonUp"] != "undefined",
        "missing Wasm export: FORM_OnRButtonUp",
      );
      assert(
        typeof wasmExports["FORM_OnKeyDown"] != "undefined",
        "missing Wasm export: FORM_OnKeyDown",
      );
      assert(
        typeof wasmExports["FORM_OnKeyUp"] != "undefined",
        "missing Wasm export: FORM_OnKeyUp",
      );
      assert(
        typeof wasmExports["FORM_OnChar"] != "undefined",
        "missing Wasm export: FORM_OnChar",
      );
      assert(
        typeof wasmExports["FORM_GetFocusedText"] != "undefined",
        "missing Wasm export: FORM_GetFocusedText",
      );
      assert(
        typeof wasmExports["FORM_GetSelectedText"] != "undefined",
        "missing Wasm export: FORM_GetSelectedText",
      );
      assert(
        typeof wasmExports["FORM_ReplaceAndKeepSelection"] != "undefined",
        "missing Wasm export: FORM_ReplaceAndKeepSelection",
      );
      assert(
        typeof wasmExports["FORM_ReplaceSelection"] != "undefined",
        "missing Wasm export: FORM_ReplaceSelection",
      );
      assert(
        typeof wasmExports["FORM_SelectAllText"] != "undefined",
        "missing Wasm export: FORM_SelectAllText",
      );
      assert(
        typeof wasmExports["FORM_CanUndo"] != "undefined",
        "missing Wasm export: FORM_CanUndo",
      );
      assert(
        typeof wasmExports["FORM_CanRedo"] != "undefined",
        "missing Wasm export: FORM_CanRedo",
      );
      assert(
        typeof wasmExports["FORM_Undo"] != "undefined",
        "missing Wasm export: FORM_Undo",
      );
      assert(
        typeof wasmExports["FORM_Redo"] != "undefined",
        "missing Wasm export: FORM_Redo",
      );
      assert(
        typeof wasmExports["FORM_ForceToKillFocus"] != "undefined",
        "missing Wasm export: FORM_ForceToKillFocus",
      );
      assert(
        typeof wasmExports["FORM_GetFocusedAnnot"] != "undefined",
        "missing Wasm export: FORM_GetFocusedAnnot",
      );
      assert(
        typeof wasmExports["FORM_SetFocusedAnnot"] != "undefined",
        "missing Wasm export: FORM_SetFocusedAnnot",
      );
      assert(
        typeof wasmExports["FPDF_FFLDraw"] != "undefined",
        "missing Wasm export: FPDF_FFLDraw",
      );
      assert(
        typeof wasmExports["FPDF_SetFormFieldHighlightColor"] != "undefined",
        "missing Wasm export: FPDF_SetFormFieldHighlightColor",
      );
      assert(
        typeof wasmExports["FPDF_SetFormFieldHighlightAlpha"] != "undefined",
        "missing Wasm export: FPDF_SetFormFieldHighlightAlpha",
      );
      assert(
        typeof wasmExports["FPDF_RemoveFormFieldHighlight"] != "undefined",
        "missing Wasm export: FPDF_RemoveFormFieldHighlight",
      );
      assert(
        typeof wasmExports["FORM_OnAfterLoadPage"] != "undefined",
        "missing Wasm export: FORM_OnAfterLoadPage",
      );
      assert(
        typeof wasmExports["FORM_OnBeforeClosePage"] != "undefined",
        "missing Wasm export: FORM_OnBeforeClosePage",
      );
      assert(
        typeof wasmExports["FORM_DoDocumentJSAction"] != "undefined",
        "missing Wasm export: FORM_DoDocumentJSAction",
      );
      assert(
        typeof wasmExports["FORM_DoDocumentOpenAction"] != "undefined",
        "missing Wasm export: FORM_DoDocumentOpenAction",
      );
      assert(
        typeof wasmExports["FORM_DoDocumentAAction"] != "undefined",
        "missing Wasm export: FORM_DoDocumentAAction",
      );
      assert(
        typeof wasmExports["FORM_DoPageAAction"] != "undefined",
        "missing Wasm export: FORM_DoPageAAction",
      );
      assert(
        typeof wasmExports["FORM_SetIndexSelected"] != "undefined",
        "missing Wasm export: FORM_SetIndexSelected",
      );
      assert(
        typeof wasmExports["FORM_IsIndexSelected"] != "undefined",
        "missing Wasm export: FORM_IsIndexSelected",
      );
      assert(
        typeof wasmExports["FPDFDoc_GetJavaScriptActionCount"] != "undefined",
        "missing Wasm export: FPDFDoc_GetJavaScriptActionCount",
      );
      assert(
        typeof wasmExports["FPDFDoc_GetJavaScriptAction"] != "undefined",
        "missing Wasm export: FPDFDoc_GetJavaScriptAction",
      );
      assert(
        typeof wasmExports["FPDFDoc_CloseJavaScriptAction"] != "undefined",
        "missing Wasm export: FPDFDoc_CloseJavaScriptAction",
      );
      assert(
        typeof wasmExports["FPDFJavaScriptAction_GetName"] != "undefined",
        "missing Wasm export: FPDFJavaScriptAction_GetName",
      );
      assert(
        typeof wasmExports["FPDFJavaScriptAction_GetScript"] != "undefined",
        "missing Wasm export: FPDFJavaScriptAction_GetScript",
      );
      assert(
        typeof wasmExports["FPDF_ImportPagesByIndex"] != "undefined",
        "missing Wasm export: FPDF_ImportPagesByIndex",
      );
      assert(
        typeof wasmExports["FPDF_ImportPages"] != "undefined",
        "missing Wasm export: FPDF_ImportPages",
      );
      assert(
        typeof wasmExports["FPDF_ImportNPagesToOne"] != "undefined",
        "missing Wasm export: FPDF_ImportNPagesToOne",
      );
      assert(
        typeof wasmExports["FPDF_NewXObjectFromPage"] != "undefined",
        "missing Wasm export: FPDF_NewXObjectFromPage",
      );
      assert(
        typeof wasmExports["FPDF_CloseXObject"] != "undefined",
        "missing Wasm export: FPDF_CloseXObject",
      );
      assert(
        typeof wasmExports["FPDF_NewFormObjectFromXObject"] != "undefined",
        "missing Wasm export: FPDF_NewFormObjectFromXObject",
      );
      assert(
        typeof wasmExports["FPDF_CopyViewerPreferences"] != "undefined",
        "missing Wasm export: FPDF_CopyViewerPreferences",
      );
      assert(
        typeof wasmExports["FPDF_RenderPageBitmapWithColorScheme_Start"] !=
          "undefined",
        "missing Wasm export: FPDF_RenderPageBitmapWithColorScheme_Start",
      );
      assert(
        typeof wasmExports["FPDF_RenderPageBitmap_Start"] != "undefined",
        "missing Wasm export: FPDF_RenderPageBitmap_Start",
      );
      assert(
        typeof wasmExports["FPDF_RenderPage_Continue"] != "undefined",
        "missing Wasm export: FPDF_RenderPage_Continue",
      );
      assert(
        typeof wasmExports["FPDF_RenderPage_Close"] != "undefined",
        "missing Wasm export: FPDF_RenderPage_Close",
      );
      assert(
        typeof wasmExports["FPDF_SaveAsCopy"] != "undefined",
        "missing Wasm export: FPDF_SaveAsCopy",
      );
      assert(
        typeof wasmExports["FPDF_SaveWithVersion"] != "undefined",
        "missing Wasm export: FPDF_SaveWithVersion",
      );
      assert(
        typeof wasmExports["FPDFText_GetCharIndexFromTextIndex"] != "undefined",
        "missing Wasm export: FPDFText_GetCharIndexFromTextIndex",
      );
      assert(
        typeof wasmExports["FPDFText_GetTextIndexFromCharIndex"] != "undefined",
        "missing Wasm export: FPDFText_GetTextIndexFromCharIndex",
      );
      assert(
        typeof wasmExports["FPDF_GetSignatureCount"] != "undefined",
        "missing Wasm export: FPDF_GetSignatureCount",
      );
      assert(
        typeof wasmExports["FPDF_GetSignatureObject"] != "undefined",
        "missing Wasm export: FPDF_GetSignatureObject",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetContents"] != "undefined",
        "missing Wasm export: FPDFSignatureObj_GetContents",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetByteRange"] != "undefined",
        "missing Wasm export: FPDFSignatureObj_GetByteRange",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetSubFilter"] != "undefined",
        "missing Wasm export: FPDFSignatureObj_GetSubFilter",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetReason"] != "undefined",
        "missing Wasm export: FPDFSignatureObj_GetReason",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetTime"] != "undefined",
        "missing Wasm export: FPDFSignatureObj_GetTime",
      );
      assert(
        typeof wasmExports["FPDFSignatureObj_GetDocMDPPermission"] !=
          "undefined",
        "missing Wasm export: FPDFSignatureObj_GetDocMDPPermission",
      );
      assert(
        typeof wasmExports["FPDF_StructTree_GetForPage"] != "undefined",
        "missing Wasm export: FPDF_StructTree_GetForPage",
      );
      assert(
        typeof wasmExports["FPDF_StructTree_Close"] != "undefined",
        "missing Wasm export: FPDF_StructTree_Close",
      );
      assert(
        typeof wasmExports["FPDF_StructTree_CountChildren"] != "undefined",
        "missing Wasm export: FPDF_StructTree_CountChildren",
      );
      assert(
        typeof wasmExports["FPDF_StructTree_GetChildAtIndex"] != "undefined",
        "missing Wasm export: FPDF_StructTree_GetChildAtIndex",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetAltText"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetAltText",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetActualText"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetActualText",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetExpansion"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetExpansion",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetID"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetID",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetLang"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetLang",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetAttributeCount"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetAttributeCount",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetAttributeAtIndex"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetAttributeAtIndex",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetStringAttribute"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetStringAttribute",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetMarkedContentID"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetMarkedContentID",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetType"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetType",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetObjType"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetObjType",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetTitle"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetTitle",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_CountChildren"] != "undefined",
        "missing Wasm export: FPDF_StructElement_CountChildren",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetChildAtIndex"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetChildAtIndex",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetChildMarkedContentID"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetChildMarkedContentID",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetParent"] != "undefined",
        "missing Wasm export: FPDF_StructElement_GetParent",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetCount"] != "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetCount",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetName"] != "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetName",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetValue"] != "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetValue",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetType"] != "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetType",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetBooleanValue"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetBooleanValue",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetNumberValue"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetNumberValue",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetStringValue"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetStringValue",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetBlobValue"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetBlobValue",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_CountChildren"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_CountChildren",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_Attr_GetChildAtIndex"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_Attr_GetChildAtIndex",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetMarkedContentIdCount"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetMarkedContentIdCount",
      );
      assert(
        typeof wasmExports["FPDF_StructElement_GetMarkedContentIdAtIndex"] !=
          "undefined",
        "missing Wasm export: FPDF_StructElement_GetMarkedContentIdAtIndex",
      );
      assert(
        typeof wasmExports["FPDF_AddInstalledFont"] != "undefined",
        "missing Wasm export: FPDF_AddInstalledFont",
      );
      assert(
        typeof wasmExports["FPDF_SetSystemFontInfo"] != "undefined",
        "missing Wasm export: FPDF_SetSystemFontInfo",
      );
      assert(
        typeof wasmExports["FPDF_GetDefaultTTFMap"] != "undefined",
        "missing Wasm export: FPDF_GetDefaultTTFMap",
      );
      assert(
        typeof wasmExports["FPDF_GetDefaultTTFMapCount"] != "undefined",
        "missing Wasm export: FPDF_GetDefaultTTFMapCount",
      );
      assert(
        typeof wasmExports["FPDF_GetDefaultTTFMapEntry"] != "undefined",
        "missing Wasm export: FPDF_GetDefaultTTFMapEntry",
      );
      assert(
        typeof wasmExports["FPDF_GetDefaultSystemFontInfo"] != "undefined",
        "missing Wasm export: FPDF_GetDefaultSystemFontInfo",
      );
      assert(
        typeof wasmExports["FPDF_FreeDefaultSystemFontInfo"] != "undefined",
        "missing Wasm export: FPDF_FreeDefaultSystemFontInfo",
      );
      assert(
        typeof wasmExports["FPDFText_LoadPage"] != "undefined",
        "missing Wasm export: FPDFText_LoadPage",
      );
      assert(
        typeof wasmExports["FPDFText_ClosePage"] != "undefined",
        "missing Wasm export: FPDFText_ClosePage",
      );
      assert(
        typeof wasmExports["FPDFText_CountChars"] != "undefined",
        "missing Wasm export: FPDFText_CountChars",
      );
      assert(
        typeof wasmExports["FPDFText_GetUnicode"] != "undefined",
        "missing Wasm export: FPDFText_GetUnicode",
      );
      assert(
        typeof wasmExports["FPDFText_GetTextObject"] != "undefined",
        "missing Wasm export: FPDFText_GetTextObject",
      );
      assert(
        typeof wasmExports["FPDFText_IsGenerated"] != "undefined",
        "missing Wasm export: FPDFText_IsGenerated",
      );
      assert(
        typeof wasmExports["FPDFText_IsHyphen"] != "undefined",
        "missing Wasm export: FPDFText_IsHyphen",
      );
      assert(
        typeof wasmExports["FPDFText_HasUnicodeMapError"] != "undefined",
        "missing Wasm export: FPDFText_HasUnicodeMapError",
      );
      assert(
        typeof wasmExports["FPDFText_GetFontSize"] != "undefined",
        "missing Wasm export: FPDFText_GetFontSize",
      );
      assert(
        typeof wasmExports["FPDFText_GetFontInfo"] != "undefined",
        "missing Wasm export: FPDFText_GetFontInfo",
      );
      assert(
        typeof wasmExports["FPDFText_GetFontWeight"] != "undefined",
        "missing Wasm export: FPDFText_GetFontWeight",
      );
      assert(
        typeof wasmExports["FPDFText_GetFillColor"] != "undefined",
        "missing Wasm export: FPDFText_GetFillColor",
      );
      assert(
        typeof wasmExports["FPDFText_GetStrokeColor"] != "undefined",
        "missing Wasm export: FPDFText_GetStrokeColor",
      );
      assert(
        typeof wasmExports["FPDFText_GetCharAngle"] != "undefined",
        "missing Wasm export: FPDFText_GetCharAngle",
      );
      assert(
        typeof wasmExports["FPDFText_GetCharBox"] != "undefined",
        "missing Wasm export: FPDFText_GetCharBox",
      );
      assert(
        typeof wasmExports["FPDFText_GetLooseCharBox"] != "undefined",
        "missing Wasm export: FPDFText_GetLooseCharBox",
      );
      assert(
        typeof wasmExports["FPDFText_GetMatrix"] != "undefined",
        "missing Wasm export: FPDFText_GetMatrix",
      );
      assert(
        typeof wasmExports["FPDFText_GetCharOrigin"] != "undefined",
        "missing Wasm export: FPDFText_GetCharOrigin",
      );
      assert(
        typeof wasmExports["FPDFText_GetCharIndexAtPos"] != "undefined",
        "missing Wasm export: FPDFText_GetCharIndexAtPos",
      );
      assert(
        typeof wasmExports["FPDFText_GetText"] != "undefined",
        "missing Wasm export: FPDFText_GetText",
      );
      assert(
        typeof wasmExports["FPDFText_CountRects"] != "undefined",
        "missing Wasm export: FPDFText_CountRects",
      );
      assert(
        typeof wasmExports["FPDFText_GetRect"] != "undefined",
        "missing Wasm export: FPDFText_GetRect",
      );
      assert(
        typeof wasmExports["FPDFText_GetBoundedText"] != "undefined",
        "missing Wasm export: FPDFText_GetBoundedText",
      );
      assert(
        typeof wasmExports["FPDFText_FindStart"] != "undefined",
        "missing Wasm export: FPDFText_FindStart",
      );
      assert(
        typeof wasmExports["FPDFText_FindNext"] != "undefined",
        "missing Wasm export: FPDFText_FindNext",
      );
      assert(
        typeof wasmExports["FPDFText_FindPrev"] != "undefined",
        "missing Wasm export: FPDFText_FindPrev",
      );
      assert(
        typeof wasmExports["FPDFText_GetSchResultIndex"] != "undefined",
        "missing Wasm export: FPDFText_GetSchResultIndex",
      );
      assert(
        typeof wasmExports["FPDFText_GetSchCount"] != "undefined",
        "missing Wasm export: FPDFText_GetSchCount",
      );
      assert(
        typeof wasmExports["FPDFText_FindClose"] != "undefined",
        "missing Wasm export: FPDFText_FindClose",
      );
      assert(
        typeof wasmExports["FPDFLink_LoadWebLinks"] != "undefined",
        "missing Wasm export: FPDFLink_LoadWebLinks",
      );
      assert(
        typeof wasmExports["FPDFLink_CountWebLinks"] != "undefined",
        "missing Wasm export: FPDFLink_CountWebLinks",
      );
      assert(
        typeof wasmExports["FPDFLink_GetURL"] != "undefined",
        "missing Wasm export: FPDFLink_GetURL",
      );
      assert(
        typeof wasmExports["FPDFLink_CountRects"] != "undefined",
        "missing Wasm export: FPDFLink_CountRects",
      );
      assert(
        typeof wasmExports["FPDFLink_GetRect"] != "undefined",
        "missing Wasm export: FPDFLink_GetRect",
      );
      assert(
        typeof wasmExports["FPDFLink_GetTextRange"] != "undefined",
        "missing Wasm export: FPDFLink_GetTextRange",
      );
      assert(
        typeof wasmExports["FPDFLink_CloseWebLinks"] != "undefined",
        "missing Wasm export: FPDFLink_CloseWebLinks",
      );
      assert(
        typeof wasmExports["FPDFPage_GetDecodedThumbnailData"] != "undefined",
        "missing Wasm export: FPDFPage_GetDecodedThumbnailData",
      );
      assert(
        typeof wasmExports["FPDFPage_GetRawThumbnailData"] != "undefined",
        "missing Wasm export: FPDFPage_GetRawThumbnailData",
      );
      assert(
        typeof wasmExports["FPDFPage_GetThumbnailAsBitmap"] != "undefined",
        "missing Wasm export: FPDFPage_GetThumbnailAsBitmap",
      );
      assert(
        typeof wasmExports["FPDFPage_SetMediaBox"] != "undefined",
        "missing Wasm export: FPDFPage_SetMediaBox",
      );
      assert(
        typeof wasmExports["FPDFPage_SetCropBox"] != "undefined",
        "missing Wasm export: FPDFPage_SetCropBox",
      );
      assert(
        typeof wasmExports["FPDFPage_SetBleedBox"] != "undefined",
        "missing Wasm export: FPDFPage_SetBleedBox",
      );
      assert(
        typeof wasmExports["FPDFPage_SetTrimBox"] != "undefined",
        "missing Wasm export: FPDFPage_SetTrimBox",
      );
      assert(
        typeof wasmExports["FPDFPage_SetArtBox"] != "undefined",
        "missing Wasm export: FPDFPage_SetArtBox",
      );
      assert(
        typeof wasmExports["FPDFPage_GetMediaBox"] != "undefined",
        "missing Wasm export: FPDFPage_GetMediaBox",
      );
      assert(
        typeof wasmExports["FPDFPage_GetCropBox"] != "undefined",
        "missing Wasm export: FPDFPage_GetCropBox",
      );
      assert(
        typeof wasmExports["FPDFPage_GetBleedBox"] != "undefined",
        "missing Wasm export: FPDFPage_GetBleedBox",
      );
      assert(
        typeof wasmExports["FPDFPage_GetTrimBox"] != "undefined",
        "missing Wasm export: FPDFPage_GetTrimBox",
      );
      assert(
        typeof wasmExports["FPDFPage_GetArtBox"] != "undefined",
        "missing Wasm export: FPDFPage_GetArtBox",
      );
      assert(
        typeof wasmExports["FPDFPage_TransFormWithClip"] != "undefined",
        "missing Wasm export: FPDFPage_TransFormWithClip",
      );
      assert(
        typeof wasmExports["FPDFPageObj_TransformClipPath"] != "undefined",
        "missing Wasm export: FPDFPageObj_TransformClipPath",
      );
      assert(
        typeof wasmExports["FPDFPageObj_GetClipPath"] != "undefined",
        "missing Wasm export: FPDFPageObj_GetClipPath",
      );
      assert(
        typeof wasmExports["FPDFClipPath_CountPaths"] != "undefined",
        "missing Wasm export: FPDFClipPath_CountPaths",
      );
      assert(
        typeof wasmExports["FPDFClipPath_CountPathSegments"] != "undefined",
        "missing Wasm export: FPDFClipPath_CountPathSegments",
      );
      assert(
        typeof wasmExports["FPDFClipPath_GetPathSegment"] != "undefined",
        "missing Wasm export: FPDFClipPath_GetPathSegment",
      );
      assert(
        typeof wasmExports["FPDF_CreateClipPath"] != "undefined",
        "missing Wasm export: FPDF_CreateClipPath",
      );
      assert(
        typeof wasmExports["FPDF_DestroyClipPath"] != "undefined",
        "missing Wasm export: FPDF_DestroyClipPath",
      );
      assert(
        typeof wasmExports["FPDFPage_InsertClipPath"] != "undefined",
        "missing Wasm export: FPDFPage_InsertClipPath",
      );
      assert(
        typeof wasmExports["FPDF_InitLibrary"] != "undefined",
        "missing Wasm export: FPDF_InitLibrary",
      );
      assert(
        typeof wasmExports["malloc"] != "undefined",
        "missing Wasm export: malloc",
      );
      assert(
        typeof wasmExports["free"] != "undefined",
        "missing Wasm export: free",
      );
      assert(
        typeof wasmExports["FPDF_DestroyLibrary"] != "undefined",
        "missing Wasm export: FPDF_DestroyLibrary",
      );
      assert(
        typeof wasmExports["FPDF_SetSandBoxPolicy"] != "undefined",
        "missing Wasm export: FPDF_SetSandBoxPolicy",
      );
      assert(
        typeof wasmExports["FPDF_LoadDocument"] != "undefined",
        "missing Wasm export: FPDF_LoadDocument",
      );
      assert(
        typeof wasmExports["FPDF_GetFormType"] != "undefined",
        "missing Wasm export: FPDF_GetFormType",
      );
      assert(
        typeof wasmExports["FPDF_LoadXFA"] != "undefined",
        "missing Wasm export: FPDF_LoadXFA",
      );
      assert(
        typeof wasmExports["FPDF_LoadMemDocument"] != "undefined",
        "missing Wasm export: FPDF_LoadMemDocument",
      );
      assert(
        typeof wasmExports["FPDF_LoadMemDocument64"] != "undefined",
        "missing Wasm export: FPDF_LoadMemDocument64",
      );
      assert(
        typeof wasmExports["FPDF_LoadCustomDocument"] != "undefined",
        "missing Wasm export: FPDF_LoadCustomDocument",
      );
      assert(
        typeof wasmExports["FPDF_GetFileVersion"] != "undefined",
        "missing Wasm export: FPDF_GetFileVersion",
      );
      assert(
        typeof wasmExports["FPDF_DocumentHasValidCrossReferenceTable"] !=
          "undefined",
        "missing Wasm export: FPDF_DocumentHasValidCrossReferenceTable",
      );
      assert(
        typeof wasmExports["FPDF_GetDocPermissions"] != "undefined",
        "missing Wasm export: FPDF_GetDocPermissions",
      );
      assert(
        typeof wasmExports["FPDF_GetDocUserPermissions"] != "undefined",
        "missing Wasm export: FPDF_GetDocUserPermissions",
      );
      assert(
        typeof wasmExports["FPDF_GetSecurityHandlerRevision"] != "undefined",
        "missing Wasm export: FPDF_GetSecurityHandlerRevision",
      );
      assert(
        typeof wasmExports["FPDF_GetPageCount"] != "undefined",
        "missing Wasm export: FPDF_GetPageCount",
      );
      assert(
        typeof wasmExports["FPDF_LoadPage"] != "undefined",
        "missing Wasm export: FPDF_LoadPage",
      );
      assert(
        typeof wasmExports["FPDF_GetPageWidthF"] != "undefined",
        "missing Wasm export: FPDF_GetPageWidthF",
      );
      assert(
        typeof wasmExports["FPDF_GetPageWidth"] != "undefined",
        "missing Wasm export: FPDF_GetPageWidth",
      );
      assert(
        typeof wasmExports["FPDF_GetPageHeightF"] != "undefined",
        "missing Wasm export: FPDF_GetPageHeightF",
      );
      assert(
        typeof wasmExports["FPDF_GetPageHeight"] != "undefined",
        "missing Wasm export: FPDF_GetPageHeight",
      );
      assert(
        typeof wasmExports["FPDF_GetPageBoundingBox"] != "undefined",
        "missing Wasm export: FPDF_GetPageBoundingBox",
      );
      assert(
        typeof wasmExports["FPDF_RenderPageBitmap"] != "undefined",
        "missing Wasm export: FPDF_RenderPageBitmap",
      );
      assert(
        typeof wasmExports["FPDF_RenderPageBitmapWithMatrix"] != "undefined",
        "missing Wasm export: FPDF_RenderPageBitmapWithMatrix",
      );
      assert(
        typeof wasmExports["FPDF_ClosePage"] != "undefined",
        "missing Wasm export: FPDF_ClosePage",
      );
      assert(
        typeof wasmExports["FPDF_CloseDocument"] != "undefined",
        "missing Wasm export: FPDF_CloseDocument",
      );
      assert(
        typeof wasmExports["FPDF_GetLastError"] != "undefined",
        "missing Wasm export: FPDF_GetLastError",
      );
      assert(
        typeof wasmExports["FPDF_DeviceToPage"] != "undefined",
        "missing Wasm export: FPDF_DeviceToPage",
      );
      assert(
        typeof wasmExports["FPDF_PageToDevice"] != "undefined",
        "missing Wasm export: FPDF_PageToDevice",
      );
      assert(
        typeof wasmExports["FPDFBitmap_Create"] != "undefined",
        "missing Wasm export: FPDFBitmap_Create",
      );
      assert(
        typeof wasmExports["FPDFBitmap_CreateEx"] != "undefined",
        "missing Wasm export: FPDFBitmap_CreateEx",
      );
      assert(
        typeof wasmExports["FPDFBitmap_GetFormat"] != "undefined",
        "missing Wasm export: FPDFBitmap_GetFormat",
      );
      assert(
        typeof wasmExports["FPDFBitmap_FillRect"] != "undefined",
        "missing Wasm export: FPDFBitmap_FillRect",
      );
      assert(
        typeof wasmExports["FPDFBitmap_GetBuffer"] != "undefined",
        "missing Wasm export: FPDFBitmap_GetBuffer",
      );
      assert(
        typeof wasmExports["FPDFBitmap_GetWidth"] != "undefined",
        "missing Wasm export: FPDFBitmap_GetWidth",
      );
      assert(
        typeof wasmExports["FPDFBitmap_GetHeight"] != "undefined",
        "missing Wasm export: FPDFBitmap_GetHeight",
      );
      assert(
        typeof wasmExports["FPDFBitmap_GetStride"] != "undefined",
        "missing Wasm export: FPDFBitmap_GetStride",
      );
      assert(
        typeof wasmExports["FPDFBitmap_Destroy"] != "undefined",
        "missing Wasm export: FPDFBitmap_Destroy",
      );
      assert(
        typeof wasmExports["FPDF_GetPageSizeByIndexF"] != "undefined",
        "missing Wasm export: FPDF_GetPageSizeByIndexF",
      );
      assert(
        typeof wasmExports["FPDF_GetPageSizeByIndex"] != "undefined",
        "missing Wasm export: FPDF_GetPageSizeByIndex",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetPrintScaling"] != "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetPrintScaling",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetNumCopies"] != "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetNumCopies",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetPrintPageRange"] != "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetPrintPageRange",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetPrintPageRangeCount"] !=
          "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetPrintPageRangeCount",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetPrintPageRangeElement"] !=
          "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetPrintPageRangeElement",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetDuplex"] != "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetDuplex",
      );
      assert(
        typeof wasmExports["FPDF_VIEWERREF_GetName"] != "undefined",
        "missing Wasm export: FPDF_VIEWERREF_GetName",
      );
      assert(
        typeof wasmExports["FPDF_CountNamedDests"] != "undefined",
        "missing Wasm export: FPDF_CountNamedDests",
      );
      assert(
        typeof wasmExports["FPDF_GetNamedDestByName"] != "undefined",
        "missing Wasm export: FPDF_GetNamedDestByName",
      );
      assert(
        typeof wasmExports["FPDF_GetNamedDest"] != "undefined",
        "missing Wasm export: FPDF_GetNamedDest",
      );
      assert(
        typeof wasmExports["FPDF_GetXFAPacketCount"] != "undefined",
        "missing Wasm export: FPDF_GetXFAPacketCount",
      );
      assert(
        typeof wasmExports["FPDF_GetXFAPacketName"] != "undefined",
        "missing Wasm export: FPDF_GetXFAPacketName",
      );
      assert(
        typeof wasmExports["FPDF_GetXFAPacketContent"] != "undefined",
        "missing Wasm export: FPDF_GetXFAPacketContent",
      );
      assert(
        typeof wasmExports["FPDF_GetTrailerEnds"] != "undefined",
        "missing Wasm export: FPDF_GetTrailerEnds",
      );
      assert(
        typeof wasmExports["fflush"] != "undefined",
        "missing Wasm export: fflush",
      );
      assert(
        typeof wasmExports["emscripten_stack_get_end"] != "undefined",
        "missing Wasm export: emscripten_stack_get_end",
      );
      assert(
        typeof wasmExports["emscripten_stack_get_base"] != "undefined",
        "missing Wasm export: emscripten_stack_get_base",
      );
      assert(
        typeof wasmExports["emscripten_builtin_memalign"] != "undefined",
        "missing Wasm export: emscripten_builtin_memalign",
      );
      assert(
        typeof wasmExports["strerror"] != "undefined",
        "missing Wasm export: strerror",
      );
      assert(
        typeof wasmExports["setThrew"] != "undefined",
        "missing Wasm export: setThrew",
      );
      assert(
        typeof wasmExports["emscripten_stack_init"] != "undefined",
        "missing Wasm export: emscripten_stack_init",
      );
      assert(
        typeof wasmExports["emscripten_stack_get_free"] != "undefined",
        "missing Wasm export: emscripten_stack_get_free",
      );
      assert(
        typeof wasmExports["_emscripten_stack_restore"] != "undefined",
        "missing Wasm export: _emscripten_stack_restore",
      );
      assert(
        typeof wasmExports["_emscripten_stack_alloc"] != "undefined",
        "missing Wasm export: _emscripten_stack_alloc",
      );
      assert(
        typeof wasmExports["emscripten_stack_get_current"] != "undefined",
        "missing Wasm export: emscripten_stack_get_current",
      );
      assert(
        typeof wasmExports["memory"] != "undefined",
        "missing Wasm export: memory",
      );
      assert(
        typeof wasmExports["__indirect_function_table"] != "undefined",
        "missing Wasm export: __indirect_function_table",
      );
      _PDFium_Init = Module["_PDFium_Init"] = createExportWrapper(
        "PDFium_Init",
        0,
      );
      _FPDF_InitLibraryWithConfig = Module["_FPDF_InitLibraryWithConfig"] =
        createExportWrapper("FPDF_InitLibraryWithConfig", 1);
      _FPDFAnnot_IsSupportedSubtype = Module["_FPDFAnnot_IsSupportedSubtype"] =
        createExportWrapper("FPDFAnnot_IsSupportedSubtype", 1);
      _FPDFPage_CreateAnnot = Module["_FPDFPage_CreateAnnot"] =
        createExportWrapper("FPDFPage_CreateAnnot", 2);
      _FPDFPage_GetAnnotCount = Module["_FPDFPage_GetAnnotCount"] =
        createExportWrapper("FPDFPage_GetAnnotCount", 1);
      _FPDFPage_GetAnnot = Module["_FPDFPage_GetAnnot"] = createExportWrapper(
        "FPDFPage_GetAnnot",
        2,
      );
      _FPDFPage_GetAnnotIndex = Module["_FPDFPage_GetAnnotIndex"] =
        createExportWrapper("FPDFPage_GetAnnotIndex", 2);
      _FPDFPage_CloseAnnot = Module["_FPDFPage_CloseAnnot"] =
        createExportWrapper("FPDFPage_CloseAnnot", 1);
      _FPDFPage_RemoveAnnot = Module["_FPDFPage_RemoveAnnot"] =
        createExportWrapper("FPDFPage_RemoveAnnot", 2);
      _FPDFAnnot_GetSubtype = Module["_FPDFAnnot_GetSubtype"] =
        createExportWrapper("FPDFAnnot_GetSubtype", 1);
      _FPDFAnnot_IsObjectSupportedSubtype = Module[
        "_FPDFAnnot_IsObjectSupportedSubtype"
      ] = createExportWrapper("FPDFAnnot_IsObjectSupportedSubtype", 1);
      _FPDFAnnot_UpdateObject = Module["_FPDFAnnot_UpdateObject"] =
        createExportWrapper("FPDFAnnot_UpdateObject", 2);
      _FPDFAnnot_AddInkStroke = Module["_FPDFAnnot_AddInkStroke"] =
        createExportWrapper("FPDFAnnot_AddInkStroke", 3);
      _FPDFAnnot_RemoveInkList = Module["_FPDFAnnot_RemoveInkList"] =
        createExportWrapper("FPDFAnnot_RemoveInkList", 1);
      _FPDFAnnot_AppendObject = Module["_FPDFAnnot_AppendObject"] =
        createExportWrapper("FPDFAnnot_AppendObject", 2);
      _FPDFAnnot_GetObjectCount = Module["_FPDFAnnot_GetObjectCount"] =
        createExportWrapper("FPDFAnnot_GetObjectCount", 1);
      _FPDFAnnot_GetObject = Module["_FPDFAnnot_GetObject"] =
        createExportWrapper("FPDFAnnot_GetObject", 2);
      _FPDFAnnot_RemoveObject = Module["_FPDFAnnot_RemoveObject"] =
        createExportWrapper("FPDFAnnot_RemoveObject", 2);
      _FPDFAnnot_SetColor = Module["_FPDFAnnot_SetColor"] = createExportWrapper(
        "FPDFAnnot_SetColor",
        6,
      );
      _FPDFAnnot_GetColor = Module["_FPDFAnnot_GetColor"] = createExportWrapper(
        "FPDFAnnot_GetColor",
        6,
      );
      _FPDFAnnot_HasAttachmentPoints = Module[
        "_FPDFAnnot_HasAttachmentPoints"
      ] = createExportWrapper("FPDFAnnot_HasAttachmentPoints", 1);
      _FPDFAnnot_SetAttachmentPoints = Module[
        "_FPDFAnnot_SetAttachmentPoints"
      ] = createExportWrapper("FPDFAnnot_SetAttachmentPoints", 3);
      _FPDFAnnot_AppendAttachmentPoints = Module[
        "_FPDFAnnot_AppendAttachmentPoints"
      ] = createExportWrapper("FPDFAnnot_AppendAttachmentPoints", 2);
      _FPDFAnnot_CountAttachmentPoints = Module[
        "_FPDFAnnot_CountAttachmentPoints"
      ] = createExportWrapper("FPDFAnnot_CountAttachmentPoints", 1);
      _FPDFAnnot_GetAttachmentPoints = Module[
        "_FPDFAnnot_GetAttachmentPoints"
      ] = createExportWrapper("FPDFAnnot_GetAttachmentPoints", 3);
      _FPDFAnnot_SetRect = Module["_FPDFAnnot_SetRect"] = createExportWrapper(
        "FPDFAnnot_SetRect",
        2,
      );
      _FPDFAnnot_GetRect = Module["_FPDFAnnot_GetRect"] = createExportWrapper(
        "FPDFAnnot_GetRect",
        2,
      );
      _FPDFAnnot_GetVertices = Module["_FPDFAnnot_GetVertices"] =
        createExportWrapper("FPDFAnnot_GetVertices", 3);
      _FPDFAnnot_GetInkListCount = Module["_FPDFAnnot_GetInkListCount"] =
        createExportWrapper("FPDFAnnot_GetInkListCount", 1);
      _FPDFAnnot_GetInkListPath = Module["_FPDFAnnot_GetInkListPath"] =
        createExportWrapper("FPDFAnnot_GetInkListPath", 4);
      _FPDFAnnot_GetLine = Module["_FPDFAnnot_GetLine"] = createExportWrapper(
        "FPDFAnnot_GetLine",
        3,
      );
      _FPDFAnnot_SetBorder = Module["_FPDFAnnot_SetBorder"] =
        createExportWrapper("FPDFAnnot_SetBorder", 4);
      _FPDFAnnot_GetBorder = Module["_FPDFAnnot_GetBorder"] =
        createExportWrapper("FPDFAnnot_GetBorder", 4);
      _FPDFAnnot_HasKey = Module["_FPDFAnnot_HasKey"] = createExportWrapper(
        "FPDFAnnot_HasKey",
        2,
      );
      _FPDFAnnot_GetValueType = Module["_FPDFAnnot_GetValueType"] =
        createExportWrapper("FPDFAnnot_GetValueType", 2);
      _FPDFAnnot_SetStringValue = Module["_FPDFAnnot_SetStringValue"] =
        createExportWrapper("FPDFAnnot_SetStringValue", 3);
      _FPDFAnnot_GetStringValue = Module["_FPDFAnnot_GetStringValue"] =
        createExportWrapper("FPDFAnnot_GetStringValue", 4);
      _FPDFAnnot_GetNumberValue = Module["_FPDFAnnot_GetNumberValue"] =
        createExportWrapper("FPDFAnnot_GetNumberValue", 3);
      _FPDFAnnot_SetAP = Module["_FPDFAnnot_SetAP"] = createExportWrapper(
        "FPDFAnnot_SetAP",
        3,
      );
      _FPDFAnnot_GetAP = Module["_FPDFAnnot_GetAP"] = createExportWrapper(
        "FPDFAnnot_GetAP",
        4,
      );
      _FPDFAnnot_GetLinkedAnnot = Module["_FPDFAnnot_GetLinkedAnnot"] =
        createExportWrapper("FPDFAnnot_GetLinkedAnnot", 2);
      _FPDFAnnot_GetFlags = Module["_FPDFAnnot_GetFlags"] = createExportWrapper(
        "FPDFAnnot_GetFlags",
        1,
      );
      _FPDFAnnot_SetFlags = Module["_FPDFAnnot_SetFlags"] = createExportWrapper(
        "FPDFAnnot_SetFlags",
        2,
      );
      _FPDFAnnot_GetFormFieldFlags = Module["_FPDFAnnot_GetFormFieldFlags"] =
        createExportWrapper("FPDFAnnot_GetFormFieldFlags", 2);
      _FPDFAnnot_SetFormFieldFlags = Module["_FPDFAnnot_SetFormFieldFlags"] =
        createExportWrapper("FPDFAnnot_SetFormFieldFlags", 3);
      _FPDFAnnot_GetFormFieldAtPoint = Module[
        "_FPDFAnnot_GetFormFieldAtPoint"
      ] = createExportWrapper("FPDFAnnot_GetFormFieldAtPoint", 3);
      _FPDFAnnot_GetFormFieldName = Module["_FPDFAnnot_GetFormFieldName"] =
        createExportWrapper("FPDFAnnot_GetFormFieldName", 4);
      _FPDFAnnot_GetFormFieldType = Module["_FPDFAnnot_GetFormFieldType"] =
        createExportWrapper("FPDFAnnot_GetFormFieldType", 2);
      _FPDFAnnot_GetFormAdditionalActionJavaScript = Module[
        "_FPDFAnnot_GetFormAdditionalActionJavaScript"
      ] = createExportWrapper("FPDFAnnot_GetFormAdditionalActionJavaScript", 5);
      _FPDFAnnot_GetFormFieldAlternateName = Module[
        "_FPDFAnnot_GetFormFieldAlternateName"
      ] = createExportWrapper("FPDFAnnot_GetFormFieldAlternateName", 4);
      _FPDFAnnot_GetFormFieldValue = Module["_FPDFAnnot_GetFormFieldValue"] =
        createExportWrapper("FPDFAnnot_GetFormFieldValue", 4);
      _FPDFAnnot_GetOptionCount = Module["_FPDFAnnot_GetOptionCount"] =
        createExportWrapper("FPDFAnnot_GetOptionCount", 2);
      _FPDFAnnot_GetOptionLabel = Module["_FPDFAnnot_GetOptionLabel"] =
        createExportWrapper("FPDFAnnot_GetOptionLabel", 5);
      _FPDFAnnot_IsOptionSelected = Module["_FPDFAnnot_IsOptionSelected"] =
        createExportWrapper("FPDFAnnot_IsOptionSelected", 3);
      _FPDFAnnot_GetFontSize = Module["_FPDFAnnot_GetFontSize"] =
        createExportWrapper("FPDFAnnot_GetFontSize", 3);
      _FPDFAnnot_SetFontColor = Module["_FPDFAnnot_SetFontColor"] =
        createExportWrapper("FPDFAnnot_SetFontColor", 5);
      _FPDFAnnot_GetFontColor = Module["_FPDFAnnot_GetFontColor"] =
        createExportWrapper("FPDFAnnot_GetFontColor", 5);
      _FPDFAnnot_IsChecked = Module["_FPDFAnnot_IsChecked"] =
        createExportWrapper("FPDFAnnot_IsChecked", 2);
      _FPDFAnnot_SetFocusableSubtypes = Module[
        "_FPDFAnnot_SetFocusableSubtypes"
      ] = createExportWrapper("FPDFAnnot_SetFocusableSubtypes", 3);
      _FPDFAnnot_GetFocusableSubtypesCount = Module[
        "_FPDFAnnot_GetFocusableSubtypesCount"
      ] = createExportWrapper("FPDFAnnot_GetFocusableSubtypesCount", 1);
      _FPDFAnnot_GetFocusableSubtypes = Module[
        "_FPDFAnnot_GetFocusableSubtypes"
      ] = createExportWrapper("FPDFAnnot_GetFocusableSubtypes", 3);
      _FPDFAnnot_GetLink = Module["_FPDFAnnot_GetLink"] = createExportWrapper(
        "FPDFAnnot_GetLink",
        1,
      );
      _FPDFAnnot_GetFormControlCount = Module[
        "_FPDFAnnot_GetFormControlCount"
      ] = createExportWrapper("FPDFAnnot_GetFormControlCount", 2);
      _FPDFAnnot_GetFormControlIndex = Module[
        "_FPDFAnnot_GetFormControlIndex"
      ] = createExportWrapper("FPDFAnnot_GetFormControlIndex", 2);
      _FPDFAnnot_GetFormFieldExportValue = Module[
        "_FPDFAnnot_GetFormFieldExportValue"
      ] = createExportWrapper("FPDFAnnot_GetFormFieldExportValue", 4);
      _FPDFAnnot_SetURI = Module["_FPDFAnnot_SetURI"] = createExportWrapper(
        "FPDFAnnot_SetURI",
        2,
      );
      _FPDFAnnot_GetFileAttachment = Module["_FPDFAnnot_GetFileAttachment"] =
        createExportWrapper("FPDFAnnot_GetFileAttachment", 1);
      _FPDFAnnot_AddFileAttachment = Module["_FPDFAnnot_AddFileAttachment"] =
        createExportWrapper("FPDFAnnot_AddFileAttachment", 2);
      _FPDFDoc_GetAttachmentCount = Module["_FPDFDoc_GetAttachmentCount"] =
        createExportWrapper("FPDFDoc_GetAttachmentCount", 1);
      _FPDFDoc_AddAttachment = Module["_FPDFDoc_AddAttachment"] =
        createExportWrapper("FPDFDoc_AddAttachment", 2);
      _FPDFDoc_GetAttachment = Module["_FPDFDoc_GetAttachment"] =
        createExportWrapper("FPDFDoc_GetAttachment", 2);
      _FPDFDoc_DeleteAttachment = Module["_FPDFDoc_DeleteAttachment"] =
        createExportWrapper("FPDFDoc_DeleteAttachment", 2);
      _FPDFAttachment_GetName = Module["_FPDFAttachment_GetName"] =
        createExportWrapper("FPDFAttachment_GetName", 3);
      _FPDFAttachment_HasKey = Module["_FPDFAttachment_HasKey"] =
        createExportWrapper("FPDFAttachment_HasKey", 2);
      _FPDFAttachment_GetValueType = Module["_FPDFAttachment_GetValueType"] =
        createExportWrapper("FPDFAttachment_GetValueType", 2);
      _FPDFAttachment_SetStringValue = Module[
        "_FPDFAttachment_SetStringValue"
      ] = createExportWrapper("FPDFAttachment_SetStringValue", 3);
      _FPDFAttachment_GetStringValue = Module[
        "_FPDFAttachment_GetStringValue"
      ] = createExportWrapper("FPDFAttachment_GetStringValue", 4);
      _FPDFAttachment_SetFile = Module["_FPDFAttachment_SetFile"] =
        createExportWrapper("FPDFAttachment_SetFile", 4);
      _FPDFAttachment_GetFile = Module["_FPDFAttachment_GetFile"] =
        createExportWrapper("FPDFAttachment_GetFile", 4);
      _FPDFAttachment_GetSubtype = Module["_FPDFAttachment_GetSubtype"] =
        createExportWrapper("FPDFAttachment_GetSubtype", 3);
      _FPDFCatalog_IsTagged = Module["_FPDFCatalog_IsTagged"] =
        createExportWrapper("FPDFCatalog_IsTagged", 1);
      _FPDFCatalog_GetLanguage = Module["_FPDFCatalog_GetLanguage"] =
        createExportWrapper("FPDFCatalog_GetLanguage", 3);
      _FPDFCatalog_SetLanguage = Module["_FPDFCatalog_SetLanguage"] =
        createExportWrapper("FPDFCatalog_SetLanguage", 2);
      _FPDFAvail_Create = Module["_FPDFAvail_Create"] = createExportWrapper(
        "FPDFAvail_Create",
        2,
      );
      _FPDFAvail_Destroy = Module["_FPDFAvail_Destroy"] = createExportWrapper(
        "FPDFAvail_Destroy",
        1,
      );
      _FPDFAvail_IsDocAvail = Module["_FPDFAvail_IsDocAvail"] =
        createExportWrapper("FPDFAvail_IsDocAvail", 2);
      _FPDFAvail_GetDocument = Module["_FPDFAvail_GetDocument"] =
        createExportWrapper("FPDFAvail_GetDocument", 2);
      _FPDFAvail_GetFirstPageNum = Module["_FPDFAvail_GetFirstPageNum"] =
        createExportWrapper("FPDFAvail_GetFirstPageNum", 1);
      _FPDFAvail_IsPageAvail = Module["_FPDFAvail_IsPageAvail"] =
        createExportWrapper("FPDFAvail_IsPageAvail", 3);
      _FPDFAvail_IsFormAvail = Module["_FPDFAvail_IsFormAvail"] =
        createExportWrapper("FPDFAvail_IsFormAvail", 2);
      _FPDFAvail_IsLinearized = Module["_FPDFAvail_IsLinearized"] =
        createExportWrapper("FPDFAvail_IsLinearized", 1);
      _FPDFBookmark_GetFirstChild = Module["_FPDFBookmark_GetFirstChild"] =
        createExportWrapper("FPDFBookmark_GetFirstChild", 2);
      _FPDFBookmark_GetNextSibling = Module["_FPDFBookmark_GetNextSibling"] =
        createExportWrapper("FPDFBookmark_GetNextSibling", 2);
      _FPDFBookmark_GetTitle = Module["_FPDFBookmark_GetTitle"] =
        createExportWrapper("FPDFBookmark_GetTitle", 3);
      _FPDFBookmark_GetCount = Module["_FPDFBookmark_GetCount"] =
        createExportWrapper("FPDFBookmark_GetCount", 1);
      _FPDFBookmark_Find = Module["_FPDFBookmark_Find"] = createExportWrapper(
        "FPDFBookmark_Find",
        2,
      );
      _FPDFBookmark_GetDest = Module["_FPDFBookmark_GetDest"] =
        createExportWrapper("FPDFBookmark_GetDest", 2);
      _FPDFBookmark_GetAction = Module["_FPDFBookmark_GetAction"] =
        createExportWrapper("FPDFBookmark_GetAction", 1);
      _FPDFAction_GetType = Module["_FPDFAction_GetType"] = createExportWrapper(
        "FPDFAction_GetType",
        1,
      );
      _FPDFAction_GetDest = Module["_FPDFAction_GetDest"] = createExportWrapper(
        "FPDFAction_GetDest",
        2,
      );
      _FPDFAction_GetFilePath = Module["_FPDFAction_GetFilePath"] =
        createExportWrapper("FPDFAction_GetFilePath", 3);
      _FPDFAction_GetURIPath = Module["_FPDFAction_GetURIPath"] =
        createExportWrapper("FPDFAction_GetURIPath", 4);
      _FPDFDest_GetDestPageIndex = Module["_FPDFDest_GetDestPageIndex"] =
        createExportWrapper("FPDFDest_GetDestPageIndex", 2);
      _FPDFDest_GetView = Module["_FPDFDest_GetView"] = createExportWrapper(
        "FPDFDest_GetView",
        3,
      );
      _FPDFDest_GetLocationInPage = Module["_FPDFDest_GetLocationInPage"] =
        createExportWrapper("FPDFDest_GetLocationInPage", 7);
      _FPDFLink_GetLinkAtPoint = Module["_FPDFLink_GetLinkAtPoint"] =
        createExportWrapper("FPDFLink_GetLinkAtPoint", 3);
      _FPDFLink_GetLinkZOrderAtPoint = Module[
        "_FPDFLink_GetLinkZOrderAtPoint"
      ] = createExportWrapper("FPDFLink_GetLinkZOrderAtPoint", 3);
      _FPDFLink_GetDest = Module["_FPDFLink_GetDest"] = createExportWrapper(
        "FPDFLink_GetDest",
        2,
      );
      _FPDFLink_GetAction = Module["_FPDFLink_GetAction"] = createExportWrapper(
        "FPDFLink_GetAction",
        1,
      );
      _FPDFLink_Enumerate = Module["_FPDFLink_Enumerate"] = createExportWrapper(
        "FPDFLink_Enumerate",
        3,
      );
      _FPDFLink_GetAnnot = Module["_FPDFLink_GetAnnot"] = createExportWrapper(
        "FPDFLink_GetAnnot",
        2,
      );
      _FPDFLink_GetAnnotRect = Module["_FPDFLink_GetAnnotRect"] =
        createExportWrapper("FPDFLink_GetAnnotRect", 2);
      _FPDFLink_CountQuadPoints = Module["_FPDFLink_CountQuadPoints"] =
        createExportWrapper("FPDFLink_CountQuadPoints", 1);
      _FPDFLink_GetQuadPoints = Module["_FPDFLink_GetQuadPoints"] =
        createExportWrapper("FPDFLink_GetQuadPoints", 3);
      _FPDF_GetPageAAction = Module["_FPDF_GetPageAAction"] =
        createExportWrapper("FPDF_GetPageAAction", 2);
      _FPDF_GetFileIdentifier = Module["_FPDF_GetFileIdentifier"] =
        createExportWrapper("FPDF_GetFileIdentifier", 4);
      _FPDF_GetMetaText = Module["_FPDF_GetMetaText"] = createExportWrapper(
        "FPDF_GetMetaText",
        4,
      );
      _FPDF_GetPageLabel = Module["_FPDF_GetPageLabel"] = createExportWrapper(
        "FPDF_GetPageLabel",
        4,
      );
      _FPDFPageObj_NewImageObj = Module["_FPDFPageObj_NewImageObj"] =
        createExportWrapper("FPDFPageObj_NewImageObj", 1);
      _FPDFImageObj_LoadJpegFile = Module["_FPDFImageObj_LoadJpegFile"] =
        createExportWrapper("FPDFImageObj_LoadJpegFile", 4);
      _FPDFImageObj_LoadJpegFileInline = Module[
        "_FPDFImageObj_LoadJpegFileInline"
      ] = createExportWrapper("FPDFImageObj_LoadJpegFileInline", 4);
      _FPDFImageObj_SetMatrix = Module["_FPDFImageObj_SetMatrix"] =
        createExportWrapper("FPDFImageObj_SetMatrix", 7);
      _FPDFImageObj_SetBitmap = Module["_FPDFImageObj_SetBitmap"] =
        createExportWrapper("FPDFImageObj_SetBitmap", 4);
      _FPDFImageObj_GetBitmap = Module["_FPDFImageObj_GetBitmap"] =
        createExportWrapper("FPDFImageObj_GetBitmap", 1);
      _FPDFImageObj_GetRenderedBitmap = Module[
        "_FPDFImageObj_GetRenderedBitmap"
      ] = createExportWrapper("FPDFImageObj_GetRenderedBitmap", 3);
      _FPDFImageObj_GetImageDataDecoded = Module[
        "_FPDFImageObj_GetImageDataDecoded"
      ] = createExportWrapper("FPDFImageObj_GetImageDataDecoded", 3);
      _FPDFImageObj_GetImageDataRaw = Module["_FPDFImageObj_GetImageDataRaw"] =
        createExportWrapper("FPDFImageObj_GetImageDataRaw", 3);
      _FPDFImageObj_GetImageFilterCount = Module[
        "_FPDFImageObj_GetImageFilterCount"
      ] = createExportWrapper("FPDFImageObj_GetImageFilterCount", 1);
      _FPDFImageObj_GetImageFilter = Module["_FPDFImageObj_GetImageFilter"] =
        createExportWrapper("FPDFImageObj_GetImageFilter", 4);
      _FPDFImageObj_GetImageMetadata = Module[
        "_FPDFImageObj_GetImageMetadata"
      ] = createExportWrapper("FPDFImageObj_GetImageMetadata", 3);
      _FPDFImageObj_GetImagePixelSize = Module[
        "_FPDFImageObj_GetImagePixelSize"
      ] = createExportWrapper("FPDFImageObj_GetImagePixelSize", 3);
      _FPDFImageObj_GetIccProfileDataDecoded = Module[
        "_FPDFImageObj_GetIccProfileDataDecoded"
      ] = createExportWrapper("FPDFImageObj_GetIccProfileDataDecoded", 5);
      _FPDF_CreateNewDocument = Module["_FPDF_CreateNewDocument"] =
        createExportWrapper("FPDF_CreateNewDocument", 0);
      _FPDFPage_Delete = Module["_FPDFPage_Delete"] = createExportWrapper(
        "FPDFPage_Delete",
        2,
      );
      _FPDF_MovePages = Module["_FPDF_MovePages"] = createExportWrapper(
        "FPDF_MovePages",
        4,
      );
      _FPDFPage_New = Module["_FPDFPage_New"] = createExportWrapper(
        "FPDFPage_New",
        4,
      );
      _FPDFPage_GetRotation = Module["_FPDFPage_GetRotation"] =
        createExportWrapper("FPDFPage_GetRotation", 1);
      _FPDFPage_InsertObject = Module["_FPDFPage_InsertObject"] =
        createExportWrapper("FPDFPage_InsertObject", 2);
      _FPDFPage_InsertObjectAtIndex = Module["_FPDFPage_InsertObjectAtIndex"] =
        createExportWrapper("FPDFPage_InsertObjectAtIndex", 3);
      _FPDFPage_RemoveObject = Module["_FPDFPage_RemoveObject"] =
        createExportWrapper("FPDFPage_RemoveObject", 2);
      _FPDFPage_CountObjects = Module["_FPDFPage_CountObjects"] =
        createExportWrapper("FPDFPage_CountObjects", 1);
      _FPDFPage_GetObject = Module["_FPDFPage_GetObject"] = createExportWrapper(
        "FPDFPage_GetObject",
        2,
      );
      _FPDFPage_HasTransparency = Module["_FPDFPage_HasTransparency"] =
        createExportWrapper("FPDFPage_HasTransparency", 1);
      _FPDFPageObj_Destroy = Module["_FPDFPageObj_Destroy"] =
        createExportWrapper("FPDFPageObj_Destroy", 1);
      _FPDFPageObj_GetMarkedContentID = Module[
        "_FPDFPageObj_GetMarkedContentID"
      ] = createExportWrapper("FPDFPageObj_GetMarkedContentID", 1);
      _FPDFPageObj_CountMarks = Module["_FPDFPageObj_CountMarks"] =
        createExportWrapper("FPDFPageObj_CountMarks", 1);
      _FPDFPageObj_GetMark = Module["_FPDFPageObj_GetMark"] =
        createExportWrapper("FPDFPageObj_GetMark", 2);
      _FPDFPageObj_AddExistingMark = Module["_FPDFPageObj_AddExistingMark"] =
        createExportWrapper("FPDFPageObj_AddExistingMark", 2);
      _FPDFPageObj_AddMark = Module["_FPDFPageObj_AddMark"] =
        createExportWrapper("FPDFPageObj_AddMark", 2);
      _FPDFPageObj_RemoveMark = Module["_FPDFPageObj_RemoveMark"] =
        createExportWrapper("FPDFPageObj_RemoveMark", 2);
      _FPDFPageObjMark_GetName = Module["_FPDFPageObjMark_GetName"] =
        createExportWrapper("FPDFPageObjMark_GetName", 4);
      _FPDFPageObjMark_CountParams = Module["_FPDFPageObjMark_CountParams"] =
        createExportWrapper("FPDFPageObjMark_CountParams", 1);
      _FPDFPageObjMark_GetParamKey = Module["_FPDFPageObjMark_GetParamKey"] =
        createExportWrapper("FPDFPageObjMark_GetParamKey", 5);
      _FPDFPageObjMark_GetParamValueType = Module[
        "_FPDFPageObjMark_GetParamValueType"
      ] = createExportWrapper("FPDFPageObjMark_GetParamValueType", 2);
      _FPDFPageObjMark_GetParamIntValue = Module[
        "_FPDFPageObjMark_GetParamIntValue"
      ] = createExportWrapper("FPDFPageObjMark_GetParamIntValue", 3);
      _FPDFPageObjMark_GetParamFloatValue = Module[
        "_FPDFPageObjMark_GetParamFloatValue"
      ] = createExportWrapper("FPDFPageObjMark_GetParamFloatValue", 3);
      _FPDFPageObjMark_GetParamStringValue = Module[
        "_FPDFPageObjMark_GetParamStringValue"
      ] = createExportWrapper("FPDFPageObjMark_GetParamStringValue", 5);
      _FPDFPageObjMark_GetParamBlobValue = Module[
        "_FPDFPageObjMark_GetParamBlobValue"
      ] = createExportWrapper("FPDFPageObjMark_GetParamBlobValue", 5);
      _FPDFPageObj_HasTransparency = Module["_FPDFPageObj_HasTransparency"] =
        createExportWrapper("FPDFPageObj_HasTransparency", 1);
      _FPDFPageObjMark_SetIntParam = Module["_FPDFPageObjMark_SetIntParam"] =
        createExportWrapper("FPDFPageObjMark_SetIntParam", 5);
      _FPDFPageObjMark_SetFloatParam = Module[
        "_FPDFPageObjMark_SetFloatParam"
      ] = createExportWrapper("FPDFPageObjMark_SetFloatParam", 5);
      _FPDFPageObjMark_SetStringParam = Module[
        "_FPDFPageObjMark_SetStringParam"
      ] = createExportWrapper("FPDFPageObjMark_SetStringParam", 5);
      _FPDFPageObjMark_SetBlobParam = Module["_FPDFPageObjMark_SetBlobParam"] =
        createExportWrapper("FPDFPageObjMark_SetBlobParam", 6);
      _FPDFPageObjMark_RemoveParam = Module["_FPDFPageObjMark_RemoveParam"] =
        createExportWrapper("FPDFPageObjMark_RemoveParam", 3);
      _FPDFPageObj_GetType = Module["_FPDFPageObj_GetType"] =
        createExportWrapper("FPDFPageObj_GetType", 1);
      _FPDFPageObj_GetIsActive = Module["_FPDFPageObj_GetIsActive"] =
        createExportWrapper("FPDFPageObj_GetIsActive", 2);
      _FPDFPageObj_SetIsActive = Module["_FPDFPageObj_SetIsActive"] =
        createExportWrapper("FPDFPageObj_SetIsActive", 2);
      _FPDFPage_GenerateContent = Module["_FPDFPage_GenerateContent"] =
        createExportWrapper("FPDFPage_GenerateContent", 1);
      _FPDFPageObj_Transform = Module["_FPDFPageObj_Transform"] =
        createExportWrapper("FPDFPageObj_Transform", 7);
      _FPDFPageObj_TransformF = Module["_FPDFPageObj_TransformF"] =
        createExportWrapper("FPDFPageObj_TransformF", 2);
      _FPDFPageObj_GetMatrix = Module["_FPDFPageObj_GetMatrix"] =
        createExportWrapper("FPDFPageObj_GetMatrix", 2);
      _FPDFPageObj_SetMatrix = Module["_FPDFPageObj_SetMatrix"] =
        createExportWrapper("FPDFPageObj_SetMatrix", 2);
      _FPDFPageObj_SetBlendMode = Module["_FPDFPageObj_SetBlendMode"] =
        createExportWrapper("FPDFPageObj_SetBlendMode", 2);
      _FPDFPage_TransformAnnots = Module["_FPDFPage_TransformAnnots"] =
        createExportWrapper("FPDFPage_TransformAnnots", 7);
      _FPDFPage_SetRotation = Module["_FPDFPage_SetRotation"] =
        createExportWrapper("FPDFPage_SetRotation", 2);
      _FPDFPageObj_SetFillColor = Module["_FPDFPageObj_SetFillColor"] =
        createExportWrapper("FPDFPageObj_SetFillColor", 5);
      _FPDFPageObj_GetFillColor = Module["_FPDFPageObj_GetFillColor"] =
        createExportWrapper("FPDFPageObj_GetFillColor", 5);
      _FPDFPageObj_GetBounds = Module["_FPDFPageObj_GetBounds"] =
        createExportWrapper("FPDFPageObj_GetBounds", 5);
      _FPDFPageObj_GetRotatedBounds = Module["_FPDFPageObj_GetRotatedBounds"] =
        createExportWrapper("FPDFPageObj_GetRotatedBounds", 2);
      _FPDFPageObj_SetStrokeColor = Module["_FPDFPageObj_SetStrokeColor"] =
        createExportWrapper("FPDFPageObj_SetStrokeColor", 5);
      _FPDFPageObj_GetStrokeColor = Module["_FPDFPageObj_GetStrokeColor"] =
        createExportWrapper("FPDFPageObj_GetStrokeColor", 5);
      _FPDFPageObj_SetStrokeWidth = Module["_FPDFPageObj_SetStrokeWidth"] =
        createExportWrapper("FPDFPageObj_SetStrokeWidth", 2);
      _FPDFPageObj_GetStrokeWidth = Module["_FPDFPageObj_GetStrokeWidth"] =
        createExportWrapper("FPDFPageObj_GetStrokeWidth", 2);
      _FPDFPageObj_GetLineJoin = Module["_FPDFPageObj_GetLineJoin"] =
        createExportWrapper("FPDFPageObj_GetLineJoin", 1);
      _FPDFPageObj_SetLineJoin = Module["_FPDFPageObj_SetLineJoin"] =
        createExportWrapper("FPDFPageObj_SetLineJoin", 2);
      _FPDFPageObj_GetLineCap = Module["_FPDFPageObj_GetLineCap"] =
        createExportWrapper("FPDFPageObj_GetLineCap", 1);
      _FPDFPageObj_SetLineCap = Module["_FPDFPageObj_SetLineCap"] =
        createExportWrapper("FPDFPageObj_SetLineCap", 2);
      _FPDFPageObj_GetDashPhase = Module["_FPDFPageObj_GetDashPhase"] =
        createExportWrapper("FPDFPageObj_GetDashPhase", 2);
      _FPDFPageObj_SetDashPhase = Module["_FPDFPageObj_SetDashPhase"] =
        createExportWrapper("FPDFPageObj_SetDashPhase", 2);
      _FPDFPageObj_GetDashCount = Module["_FPDFPageObj_GetDashCount"] =
        createExportWrapper("FPDFPageObj_GetDashCount", 1);
      _FPDFPageObj_GetDashArray = Module["_FPDFPageObj_GetDashArray"] =
        createExportWrapper("FPDFPageObj_GetDashArray", 3);
      _FPDFPageObj_SetDashArray = Module["_FPDFPageObj_SetDashArray"] =
        createExportWrapper("FPDFPageObj_SetDashArray", 4);
      _FPDFFormObj_CountObjects = Module["_FPDFFormObj_CountObjects"] =
        createExportWrapper("FPDFFormObj_CountObjects", 1);
      _FPDFFormObj_GetObject = Module["_FPDFFormObj_GetObject"] =
        createExportWrapper("FPDFFormObj_GetObject", 2);
      _FPDFFormObj_RemoveObject = Module["_FPDFFormObj_RemoveObject"] =
        createExportWrapper("FPDFFormObj_RemoveObject", 2);
      _FPDFPageObj_CreateNewPath = Module["_FPDFPageObj_CreateNewPath"] =
        createExportWrapper("FPDFPageObj_CreateNewPath", 2);
      _FPDFPageObj_CreateNewRect = Module["_FPDFPageObj_CreateNewRect"] =
        createExportWrapper("FPDFPageObj_CreateNewRect", 4);
      _FPDFPath_CountSegments = Module["_FPDFPath_CountSegments"] =
        createExportWrapper("FPDFPath_CountSegments", 1);
      _FPDFPath_GetPathSegment = Module["_FPDFPath_GetPathSegment"] =
        createExportWrapper("FPDFPath_GetPathSegment", 2);
      _FPDFPath_MoveTo = Module["_FPDFPath_MoveTo"] = createExportWrapper(
        "FPDFPath_MoveTo",
        3,
      );
      _FPDFPath_LineTo = Module["_FPDFPath_LineTo"] = createExportWrapper(
        "FPDFPath_LineTo",
        3,
      );
      _FPDFPath_BezierTo = Module["_FPDFPath_BezierTo"] = createExportWrapper(
        "FPDFPath_BezierTo",
        7,
      );
      _FPDFPath_Close = Module["_FPDFPath_Close"] = createExportWrapper(
        "FPDFPath_Close",
        1,
      );
      _FPDFPath_SetDrawMode = Module["_FPDFPath_SetDrawMode"] =
        createExportWrapper("FPDFPath_SetDrawMode", 3);
      _FPDFPath_GetDrawMode = Module["_FPDFPath_GetDrawMode"] =
        createExportWrapper("FPDFPath_GetDrawMode", 3);
      _FPDFPathSegment_GetPoint = Module["_FPDFPathSegment_GetPoint"] =
        createExportWrapper("FPDFPathSegment_GetPoint", 3);
      _FPDFPathSegment_GetType = Module["_FPDFPathSegment_GetType"] =
        createExportWrapper("FPDFPathSegment_GetType", 1);
      _FPDFPathSegment_GetClose = Module["_FPDFPathSegment_GetClose"] =
        createExportWrapper("FPDFPathSegment_GetClose", 1);
      _FPDFPageObj_NewTextObj = Module["_FPDFPageObj_NewTextObj"] =
        createExportWrapper("FPDFPageObj_NewTextObj", 3);
      _FPDFText_SetText = Module["_FPDFText_SetText"] = createExportWrapper(
        "FPDFText_SetText",
        2,
      );
      _FPDFText_SetCharcodes = Module["_FPDFText_SetCharcodes"] =
        createExportWrapper("FPDFText_SetCharcodes", 3);
      _FPDFText_SetPositions = Module["_FPDFText_SetPositions"] =
        createExportWrapper("FPDFText_SetPositions", 3);
      _FPDFText_LoadFont = Module["_FPDFText_LoadFont"] = createExportWrapper(
        "FPDFText_LoadFont",
        5,
      );
      _FPDFText_LoadStandardFont = Module["_FPDFText_LoadStandardFont"] =
        createExportWrapper("FPDFText_LoadStandardFont", 2);
      _FPDFText_LoadCidType2Font = Module["_FPDFText_LoadCidType2Font"] =
        createExportWrapper("FPDFText_LoadCidType2Font", 6);
      _FPDFTextObj_GetFontSize = Module["_FPDFTextObj_GetFontSize"] =
        createExportWrapper("FPDFTextObj_GetFontSize", 2);
      _FPDFTextObj_SetFontSize = Module["_FPDFTextObj_SetFontSize"] =
        createExportWrapper("FPDFTextObj_SetFontSize", 2);
      _FPDFTextObj_GetText = Module["_FPDFTextObj_GetText"] =
        createExportWrapper("FPDFTextObj_GetText", 4);
      _FPDFTextObj_GetRenderedBitmap = Module[
        "_FPDFTextObj_GetRenderedBitmap"
      ] = createExportWrapper("FPDFTextObj_GetRenderedBitmap", 4);
      _FPDFFont_Close = Module["_FPDFFont_Close"] = createExportWrapper(
        "FPDFFont_Close",
        1,
      );
      _FPDFPageObj_CreateTextObj = Module["_FPDFPageObj_CreateTextObj"] =
        createExportWrapper("FPDFPageObj_CreateTextObj", 3);
      _FPDFTextObj_GetTextRenderMode = Module[
        "_FPDFTextObj_GetTextRenderMode"
      ] = createExportWrapper("FPDFTextObj_GetTextRenderMode", 1);
      _FPDFTextObj_SetTextRenderMode = Module[
        "_FPDFTextObj_SetTextRenderMode"
      ] = createExportWrapper("FPDFTextObj_SetTextRenderMode", 2);
      _FPDFTextObj_GetFont = Module["_FPDFTextObj_GetFont"] =
        createExportWrapper("FPDFTextObj_GetFont", 1);
      _FPDFFont_GetBaseFontName = Module["_FPDFFont_GetBaseFontName"] =
        createExportWrapper("FPDFFont_GetBaseFontName", 3);
      _FPDFFont_GetFamilyName = Module["_FPDFFont_GetFamilyName"] =
        createExportWrapper("FPDFFont_GetFamilyName", 3);
      _FPDFFont_GetFontData = Module["_FPDFFont_GetFontData"] =
        createExportWrapper("FPDFFont_GetFontData", 4);
      _FPDFFont_GetIsEmbedded = Module["_FPDFFont_GetIsEmbedded"] =
        createExportWrapper("FPDFFont_GetIsEmbedded", 1);
      _FPDFFont_GetFlags = Module["_FPDFFont_GetFlags"] = createExportWrapper(
        "FPDFFont_GetFlags",
        1,
      );
      _FPDFFont_GetWeight = Module["_FPDFFont_GetWeight"] = createExportWrapper(
        "FPDFFont_GetWeight",
        1,
      );
      _FPDFFont_GetItalicAngle = Module["_FPDFFont_GetItalicAngle"] =
        createExportWrapper("FPDFFont_GetItalicAngle", 2);
      _FPDFFont_GetAscent = Module["_FPDFFont_GetAscent"] = createExportWrapper(
        "FPDFFont_GetAscent",
        3,
      );
      _FPDFFont_GetDescent = Module["_FPDFFont_GetDescent"] =
        createExportWrapper("FPDFFont_GetDescent", 3);
      _FPDFFont_GetGlyphWidth = Module["_FPDFFont_GetGlyphWidth"] =
        createExportWrapper("FPDFFont_GetGlyphWidth", 4);
      _FPDFFont_GetGlyphPath = Module["_FPDFFont_GetGlyphPath"] =
        createExportWrapper("FPDFFont_GetGlyphPath", 3);
      _FPDFGlyphPath_CountGlyphSegments = Module[
        "_FPDFGlyphPath_CountGlyphSegments"
      ] = createExportWrapper("FPDFGlyphPath_CountGlyphSegments", 1);
      _FPDFGlyphPath_GetGlyphPathSegment = Module[
        "_FPDFGlyphPath_GetGlyphPathSegment"
      ] = createExportWrapper("FPDFGlyphPath_GetGlyphPathSegment", 2);
      _FSDK_SetUnSpObjProcessHandler = Module[
        "_FSDK_SetUnSpObjProcessHandler"
      ] = createExportWrapper("FSDK_SetUnSpObjProcessHandler", 1);
      _FSDK_SetTimeFunction = Module["_FSDK_SetTimeFunction"] =
        createExportWrapper("FSDK_SetTimeFunction", 1);
      _FSDK_SetLocaltimeFunction = Module["_FSDK_SetLocaltimeFunction"] =
        createExportWrapper("FSDK_SetLocaltimeFunction", 1);
      _FPDFDoc_GetPageMode = Module["_FPDFDoc_GetPageMode"] =
        createExportWrapper("FPDFDoc_GetPageMode", 1);
      _FPDFPage_Flatten = Module["_FPDFPage_Flatten"] = createExportWrapper(
        "FPDFPage_Flatten",
        2,
      );
      _FPDFPage_HasFormFieldAtPoint = Module["_FPDFPage_HasFormFieldAtPoint"] =
        createExportWrapper("FPDFPage_HasFormFieldAtPoint", 4);
      _FPDFPage_FormFieldZOrderAtPoint = Module[
        "_FPDFPage_FormFieldZOrderAtPoint"
      ] = createExportWrapper("FPDFPage_FormFieldZOrderAtPoint", 4);
      _FPDFDOC_InitFormFillEnvironment = Module[
        "_FPDFDOC_InitFormFillEnvironment"
      ] = createExportWrapper("FPDFDOC_InitFormFillEnvironment", 2);
      _FPDFDOC_ExitFormFillEnvironment = Module[
        "_FPDFDOC_ExitFormFillEnvironment"
      ] = createExportWrapper("FPDFDOC_ExitFormFillEnvironment", 1);
      _FORM_OnMouseMove = Module["_FORM_OnMouseMove"] = createExportWrapper(
        "FORM_OnMouseMove",
        5,
      );
      _FORM_OnMouseWheel = Module["_FORM_OnMouseWheel"] = createExportWrapper(
        "FORM_OnMouseWheel",
        6,
      );
      _FORM_OnFocus = Module["_FORM_OnFocus"] = createExportWrapper(
        "FORM_OnFocus",
        5,
      );
      _FORM_OnLButtonDown = Module["_FORM_OnLButtonDown"] = createExportWrapper(
        "FORM_OnLButtonDown",
        5,
      );
      _FORM_OnLButtonUp = Module["_FORM_OnLButtonUp"] = createExportWrapper(
        "FORM_OnLButtonUp",
        5,
      );
      _FORM_OnLButtonDoubleClick = Module["_FORM_OnLButtonDoubleClick"] =
        createExportWrapper("FORM_OnLButtonDoubleClick", 5);
      _FORM_OnRButtonDown = Module["_FORM_OnRButtonDown"] = createExportWrapper(
        "FORM_OnRButtonDown",
        5,
      );
      _FORM_OnRButtonUp = Module["_FORM_OnRButtonUp"] = createExportWrapper(
        "FORM_OnRButtonUp",
        5,
      );
      _FORM_OnKeyDown = Module["_FORM_OnKeyDown"] = createExportWrapper(
        "FORM_OnKeyDown",
        4,
      );
      _FORM_OnKeyUp = Module["_FORM_OnKeyUp"] = createExportWrapper(
        "FORM_OnKeyUp",
        4,
      );
      _FORM_OnChar = Module["_FORM_OnChar"] = createExportWrapper(
        "FORM_OnChar",
        4,
      );
      _FORM_GetFocusedText = Module["_FORM_GetFocusedText"] =
        createExportWrapper("FORM_GetFocusedText", 4);
      _FORM_GetSelectedText = Module["_FORM_GetSelectedText"] =
        createExportWrapper("FORM_GetSelectedText", 4);
      _FORM_ReplaceAndKeepSelection = Module["_FORM_ReplaceAndKeepSelection"] =
        createExportWrapper("FORM_ReplaceAndKeepSelection", 3);
      _FORM_ReplaceSelection = Module["_FORM_ReplaceSelection"] =
        createExportWrapper("FORM_ReplaceSelection", 3);
      _FORM_SelectAllText = Module["_FORM_SelectAllText"] = createExportWrapper(
        "FORM_SelectAllText",
        2,
      );
      _FORM_CanUndo = Module["_FORM_CanUndo"] = createExportWrapper(
        "FORM_CanUndo",
        2,
      );
      _FORM_CanRedo = Module["_FORM_CanRedo"] = createExportWrapper(
        "FORM_CanRedo",
        2,
      );
      _FORM_Undo = Module["_FORM_Undo"] = createExportWrapper("FORM_Undo", 2);
      _FORM_Redo = Module["_FORM_Redo"] = createExportWrapper("FORM_Redo", 2);
      _FORM_ForceToKillFocus = Module["_FORM_ForceToKillFocus"] =
        createExportWrapper("FORM_ForceToKillFocus", 1);
      _FORM_GetFocusedAnnot = Module["_FORM_GetFocusedAnnot"] =
        createExportWrapper("FORM_GetFocusedAnnot", 3);
      _FORM_SetFocusedAnnot = Module["_FORM_SetFocusedAnnot"] =
        createExportWrapper("FORM_SetFocusedAnnot", 2);
      _FPDF_FFLDraw = Module["_FPDF_FFLDraw"] = createExportWrapper(
        "FPDF_FFLDraw",
        9,
      );
      _FPDF_SetFormFieldHighlightColor = Module[
        "_FPDF_SetFormFieldHighlightColor"
      ] = createExportWrapper("FPDF_SetFormFieldHighlightColor", 3);
      _FPDF_SetFormFieldHighlightAlpha = Module[
        "_FPDF_SetFormFieldHighlightAlpha"
      ] = createExportWrapper("FPDF_SetFormFieldHighlightAlpha", 2);
      _FPDF_RemoveFormFieldHighlight = Module[
        "_FPDF_RemoveFormFieldHighlight"
      ] = createExportWrapper("FPDF_RemoveFormFieldHighlight", 1);
      _FORM_OnAfterLoadPage = Module["_FORM_OnAfterLoadPage"] =
        createExportWrapper("FORM_OnAfterLoadPage", 2);
      _FORM_OnBeforeClosePage = Module["_FORM_OnBeforeClosePage"] =
        createExportWrapper("FORM_OnBeforeClosePage", 2);
      _FORM_DoDocumentJSAction = Module["_FORM_DoDocumentJSAction"] =
        createExportWrapper("FORM_DoDocumentJSAction", 1);
      _FORM_DoDocumentOpenAction = Module["_FORM_DoDocumentOpenAction"] =
        createExportWrapper("FORM_DoDocumentOpenAction", 1);
      _FORM_DoDocumentAAction = Module["_FORM_DoDocumentAAction"] =
        createExportWrapper("FORM_DoDocumentAAction", 2);
      _FORM_DoPageAAction = Module["_FORM_DoPageAAction"] = createExportWrapper(
        "FORM_DoPageAAction",
        3,
      );
      _FORM_SetIndexSelected = Module["_FORM_SetIndexSelected"] =
        createExportWrapper("FORM_SetIndexSelected", 4);
      _FORM_IsIndexSelected = Module["_FORM_IsIndexSelected"] =
        createExportWrapper("FORM_IsIndexSelected", 3);
      _FPDFDoc_GetJavaScriptActionCount = Module[
        "_FPDFDoc_GetJavaScriptActionCount"
      ] = createExportWrapper("FPDFDoc_GetJavaScriptActionCount", 1);
      _FPDFDoc_GetJavaScriptAction = Module["_FPDFDoc_GetJavaScriptAction"] =
        createExportWrapper("FPDFDoc_GetJavaScriptAction", 2);
      _FPDFDoc_CloseJavaScriptAction = Module[
        "_FPDFDoc_CloseJavaScriptAction"
      ] = createExportWrapper("FPDFDoc_CloseJavaScriptAction", 1);
      _FPDFJavaScriptAction_GetName = Module["_FPDFJavaScriptAction_GetName"] =
        createExportWrapper("FPDFJavaScriptAction_GetName", 3);
      _FPDFJavaScriptAction_GetScript = Module[
        "_FPDFJavaScriptAction_GetScript"
      ] = createExportWrapper("FPDFJavaScriptAction_GetScript", 3);
      _FPDF_ImportPagesByIndex = Module["_FPDF_ImportPagesByIndex"] =
        createExportWrapper("FPDF_ImportPagesByIndex", 5);
      _FPDF_ImportPages = Module["_FPDF_ImportPages"] = createExportWrapper(
        "FPDF_ImportPages",
        4,
      );
      _FPDF_ImportNPagesToOne = Module["_FPDF_ImportNPagesToOne"] =
        createExportWrapper("FPDF_ImportNPagesToOne", 5);
      _FPDF_NewXObjectFromPage = Module["_FPDF_NewXObjectFromPage"] =
        createExportWrapper("FPDF_NewXObjectFromPage", 3);
      _FPDF_CloseXObject = Module["_FPDF_CloseXObject"] = createExportWrapper(
        "FPDF_CloseXObject",
        1,
      );
      _FPDF_NewFormObjectFromXObject = Module[
        "_FPDF_NewFormObjectFromXObject"
      ] = createExportWrapper("FPDF_NewFormObjectFromXObject", 1);
      _FPDF_CopyViewerPreferences = Module["_FPDF_CopyViewerPreferences"] =
        createExportWrapper("FPDF_CopyViewerPreferences", 2);
      _FPDF_RenderPageBitmapWithColorScheme_Start = Module[
        "_FPDF_RenderPageBitmapWithColorScheme_Start"
      ] = createExportWrapper("FPDF_RenderPageBitmapWithColorScheme_Start", 10);
      _FPDF_RenderPageBitmap_Start = Module["_FPDF_RenderPageBitmap_Start"] =
        createExportWrapper("FPDF_RenderPageBitmap_Start", 9);
      _FPDF_RenderPage_Continue = Module["_FPDF_RenderPage_Continue"] =
        createExportWrapper("FPDF_RenderPage_Continue", 2);
      _FPDF_RenderPage_Close = Module["_FPDF_RenderPage_Close"] =
        createExportWrapper("FPDF_RenderPage_Close", 1);
      _FPDF_SaveAsCopy = Module["_FPDF_SaveAsCopy"] = createExportWrapper(
        "FPDF_SaveAsCopy",
        3,
      );
      _FPDF_SaveWithVersion = Module["_FPDF_SaveWithVersion"] =
        createExportWrapper("FPDF_SaveWithVersion", 4);
      _FPDFText_GetCharIndexFromTextIndex = Module[
        "_FPDFText_GetCharIndexFromTextIndex"
      ] = createExportWrapper("FPDFText_GetCharIndexFromTextIndex", 2);
      _FPDFText_GetTextIndexFromCharIndex = Module[
        "_FPDFText_GetTextIndexFromCharIndex"
      ] = createExportWrapper("FPDFText_GetTextIndexFromCharIndex", 2);
      _FPDF_GetSignatureCount = Module["_FPDF_GetSignatureCount"] =
        createExportWrapper("FPDF_GetSignatureCount", 1);
      _FPDF_GetSignatureObject = Module["_FPDF_GetSignatureObject"] =
        createExportWrapper("FPDF_GetSignatureObject", 2);
      _FPDFSignatureObj_GetContents = Module["_FPDFSignatureObj_GetContents"] =
        createExportWrapper("FPDFSignatureObj_GetContents", 3);
      _FPDFSignatureObj_GetByteRange = Module[
        "_FPDFSignatureObj_GetByteRange"
      ] = createExportWrapper("FPDFSignatureObj_GetByteRange", 3);
      _FPDFSignatureObj_GetSubFilter = Module[
        "_FPDFSignatureObj_GetSubFilter"
      ] = createExportWrapper("FPDFSignatureObj_GetSubFilter", 3);
      _FPDFSignatureObj_GetReason = Module["_FPDFSignatureObj_GetReason"] =
        createExportWrapper("FPDFSignatureObj_GetReason", 3);
      _FPDFSignatureObj_GetTime = Module["_FPDFSignatureObj_GetTime"] =
        createExportWrapper("FPDFSignatureObj_GetTime", 3);
      _FPDFSignatureObj_GetDocMDPPermission = Module[
        "_FPDFSignatureObj_GetDocMDPPermission"
      ] = createExportWrapper("FPDFSignatureObj_GetDocMDPPermission", 1);
      _FPDF_StructTree_GetForPage = Module["_FPDF_StructTree_GetForPage"] =
        createExportWrapper("FPDF_StructTree_GetForPage", 1);
      _FPDF_StructTree_Close = Module["_FPDF_StructTree_Close"] =
        createExportWrapper("FPDF_StructTree_Close", 1);
      _FPDF_StructTree_CountChildren = Module[
        "_FPDF_StructTree_CountChildren"
      ] = createExportWrapper("FPDF_StructTree_CountChildren", 1);
      _FPDF_StructTree_GetChildAtIndex = Module[
        "_FPDF_StructTree_GetChildAtIndex"
      ] = createExportWrapper("FPDF_StructTree_GetChildAtIndex", 2);
      _FPDF_StructElement_GetAltText = Module[
        "_FPDF_StructElement_GetAltText"
      ] = createExportWrapper("FPDF_StructElement_GetAltText", 3);
      _FPDF_StructElement_GetActualText = Module[
        "_FPDF_StructElement_GetActualText"
      ] = createExportWrapper("FPDF_StructElement_GetActualText", 3);
      _FPDF_StructElement_GetExpansion = Module[
        "_FPDF_StructElement_GetExpansion"
      ] = createExportWrapper("FPDF_StructElement_GetExpansion", 3);
      _FPDF_StructElement_GetID = Module["_FPDF_StructElement_GetID"] =
        createExportWrapper("FPDF_StructElement_GetID", 3);
      _FPDF_StructElement_GetLang = Module["_FPDF_StructElement_GetLang"] =
        createExportWrapper("FPDF_StructElement_GetLang", 3);
      _FPDF_StructElement_GetAttributeCount = Module[
        "_FPDF_StructElement_GetAttributeCount"
      ] = createExportWrapper("FPDF_StructElement_GetAttributeCount", 1);
      _FPDF_StructElement_GetAttributeAtIndex = Module[
        "_FPDF_StructElement_GetAttributeAtIndex"
      ] = createExportWrapper("FPDF_StructElement_GetAttributeAtIndex", 2);
      _FPDF_StructElement_GetStringAttribute = Module[
        "_FPDF_StructElement_GetStringAttribute"
      ] = createExportWrapper("FPDF_StructElement_GetStringAttribute", 4);
      _FPDF_StructElement_GetMarkedContentID = Module[
        "_FPDF_StructElement_GetMarkedContentID"
      ] = createExportWrapper("FPDF_StructElement_GetMarkedContentID", 1);
      _FPDF_StructElement_GetType = Module["_FPDF_StructElement_GetType"] =
        createExportWrapper("FPDF_StructElement_GetType", 3);
      _FPDF_StructElement_GetObjType = Module[
        "_FPDF_StructElement_GetObjType"
      ] = createExportWrapper("FPDF_StructElement_GetObjType", 3);
      _FPDF_StructElement_GetTitle = Module["_FPDF_StructElement_GetTitle"] =
        createExportWrapper("FPDF_StructElement_GetTitle", 3);
      _FPDF_StructElement_CountChildren = Module[
        "_FPDF_StructElement_CountChildren"
      ] = createExportWrapper("FPDF_StructElement_CountChildren", 1);
      _FPDF_StructElement_GetChildAtIndex = Module[
        "_FPDF_StructElement_GetChildAtIndex"
      ] = createExportWrapper("FPDF_StructElement_GetChildAtIndex", 2);
      _FPDF_StructElement_GetChildMarkedContentID = Module[
        "_FPDF_StructElement_GetChildMarkedContentID"
      ] = createExportWrapper("FPDF_StructElement_GetChildMarkedContentID", 2);
      _FPDF_StructElement_GetParent = Module["_FPDF_StructElement_GetParent"] =
        createExportWrapper("FPDF_StructElement_GetParent", 1);
      _FPDF_StructElement_Attr_GetCount = Module[
        "_FPDF_StructElement_Attr_GetCount"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetCount", 1);
      _FPDF_StructElement_Attr_GetName = Module[
        "_FPDF_StructElement_Attr_GetName"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetName", 5);
      _FPDF_StructElement_Attr_GetValue = Module[
        "_FPDF_StructElement_Attr_GetValue"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetValue", 2);
      _FPDF_StructElement_Attr_GetType = Module[
        "_FPDF_StructElement_Attr_GetType"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetType", 1);
      _FPDF_StructElement_Attr_GetBooleanValue = Module[
        "_FPDF_StructElement_Attr_GetBooleanValue"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetBooleanValue", 2);
      _FPDF_StructElement_Attr_GetNumberValue = Module[
        "_FPDF_StructElement_Attr_GetNumberValue"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetNumberValue", 2);
      _FPDF_StructElement_Attr_GetStringValue = Module[
        "_FPDF_StructElement_Attr_GetStringValue"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetStringValue", 4);
      _FPDF_StructElement_Attr_GetBlobValue = Module[
        "_FPDF_StructElement_Attr_GetBlobValue"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetBlobValue", 4);
      _FPDF_StructElement_Attr_CountChildren = Module[
        "_FPDF_StructElement_Attr_CountChildren"
      ] = createExportWrapper("FPDF_StructElement_Attr_CountChildren", 1);
      _FPDF_StructElement_Attr_GetChildAtIndex = Module[
        "_FPDF_StructElement_Attr_GetChildAtIndex"
      ] = createExportWrapper("FPDF_StructElement_Attr_GetChildAtIndex", 2);
      _FPDF_StructElement_GetMarkedContentIdCount = Module[
        "_FPDF_StructElement_GetMarkedContentIdCount"
      ] = createExportWrapper("FPDF_StructElement_GetMarkedContentIdCount", 1);
      _FPDF_StructElement_GetMarkedContentIdAtIndex = Module[
        "_FPDF_StructElement_GetMarkedContentIdAtIndex"
      ] = createExportWrapper(
        "FPDF_StructElement_GetMarkedContentIdAtIndex",
        2,
      );
      _FPDF_AddInstalledFont = Module["_FPDF_AddInstalledFont"] =
        createExportWrapper("FPDF_AddInstalledFont", 3);
      _FPDF_SetSystemFontInfo = Module["_FPDF_SetSystemFontInfo"] =
        createExportWrapper("FPDF_SetSystemFontInfo", 1);
      _FPDF_GetDefaultTTFMap = Module["_FPDF_GetDefaultTTFMap"] =
        createExportWrapper("FPDF_GetDefaultTTFMap", 0);
      _FPDF_GetDefaultTTFMapCount = Module["_FPDF_GetDefaultTTFMapCount"] =
        createExportWrapper("FPDF_GetDefaultTTFMapCount", 0);
      _FPDF_GetDefaultTTFMapEntry = Module["_FPDF_GetDefaultTTFMapEntry"] =
        createExportWrapper("FPDF_GetDefaultTTFMapEntry", 1);
      _FPDF_GetDefaultSystemFontInfo = Module[
        "_FPDF_GetDefaultSystemFontInfo"
      ] = createExportWrapper("FPDF_GetDefaultSystemFontInfo", 0);
      _FPDF_FreeDefaultSystemFontInfo = Module[
        "_FPDF_FreeDefaultSystemFontInfo"
      ] = createExportWrapper("FPDF_FreeDefaultSystemFontInfo", 1);
      _FPDFText_LoadPage = Module["_FPDFText_LoadPage"] = createExportWrapper(
        "FPDFText_LoadPage",
        1,
      );
      _FPDFText_ClosePage = Module["_FPDFText_ClosePage"] = createExportWrapper(
        "FPDFText_ClosePage",
        1,
      );
      _FPDFText_CountChars = Module["_FPDFText_CountChars"] =
        createExportWrapper("FPDFText_CountChars", 1);
      _FPDFText_GetUnicode = Module["_FPDFText_GetUnicode"] =
        createExportWrapper("FPDFText_GetUnicode", 2);
      _FPDFText_GetTextObject = Module["_FPDFText_GetTextObject"] =
        createExportWrapper("FPDFText_GetTextObject", 2);
      _FPDFText_IsGenerated = Module["_FPDFText_IsGenerated"] =
        createExportWrapper("FPDFText_IsGenerated", 2);
      _FPDFText_IsHyphen = Module["_FPDFText_IsHyphen"] = createExportWrapper(
        "FPDFText_IsHyphen",
        2,
      );
      _FPDFText_HasUnicodeMapError = Module["_FPDFText_HasUnicodeMapError"] =
        createExportWrapper("FPDFText_HasUnicodeMapError", 2);
      _FPDFText_GetFontSize = Module["_FPDFText_GetFontSize"] =
        createExportWrapper("FPDFText_GetFontSize", 2);
      _FPDFText_GetFontInfo = Module["_FPDFText_GetFontInfo"] =
        createExportWrapper("FPDFText_GetFontInfo", 5);
      _FPDFText_GetFontWeight = Module["_FPDFText_GetFontWeight"] =
        createExportWrapper("FPDFText_GetFontWeight", 2);
      _FPDFText_GetFillColor = Module["_FPDFText_GetFillColor"] =
        createExportWrapper("FPDFText_GetFillColor", 6);
      _FPDFText_GetStrokeColor = Module["_FPDFText_GetStrokeColor"] =
        createExportWrapper("FPDFText_GetStrokeColor", 6);
      _FPDFText_GetCharAngle = Module["_FPDFText_GetCharAngle"] =
        createExportWrapper("FPDFText_GetCharAngle", 2);
      _FPDFText_GetCharBox = Module["_FPDFText_GetCharBox"] =
        createExportWrapper("FPDFText_GetCharBox", 6);
      _FPDFText_GetLooseCharBox = Module["_FPDFText_GetLooseCharBox"] =
        createExportWrapper("FPDFText_GetLooseCharBox", 3);
      _FPDFText_GetMatrix = Module["_FPDFText_GetMatrix"] = createExportWrapper(
        "FPDFText_GetMatrix",
        3,
      );
      _FPDFText_GetCharOrigin = Module["_FPDFText_GetCharOrigin"] =
        createExportWrapper("FPDFText_GetCharOrigin", 4);
      _FPDFText_GetCharIndexAtPos = Module["_FPDFText_GetCharIndexAtPos"] =
        createExportWrapper("FPDFText_GetCharIndexAtPos", 5);
      _FPDFText_GetText = Module["_FPDFText_GetText"] = createExportWrapper(
        "FPDFText_GetText",
        4,
      );
      _FPDFText_CountRects = Module["_FPDFText_CountRects"] =
        createExportWrapper("FPDFText_CountRects", 3);
      _FPDFText_GetRect = Module["_FPDFText_GetRect"] = createExportWrapper(
        "FPDFText_GetRect",
        6,
      );
      _FPDFText_GetBoundedText = Module["_FPDFText_GetBoundedText"] =
        createExportWrapper("FPDFText_GetBoundedText", 7);
      _FPDFText_FindStart = Module["_FPDFText_FindStart"] = createExportWrapper(
        "FPDFText_FindStart",
        4,
      );
      _FPDFText_FindNext = Module["_FPDFText_FindNext"] = createExportWrapper(
        "FPDFText_FindNext",
        1,
      );
      _FPDFText_FindPrev = Module["_FPDFText_FindPrev"] = createExportWrapper(
        "FPDFText_FindPrev",
        1,
      );
      _FPDFText_GetSchResultIndex = Module["_FPDFText_GetSchResultIndex"] =
        createExportWrapper("FPDFText_GetSchResultIndex", 1);
      _FPDFText_GetSchCount = Module["_FPDFText_GetSchCount"] =
        createExportWrapper("FPDFText_GetSchCount", 1);
      _FPDFText_FindClose = Module["_FPDFText_FindClose"] = createExportWrapper(
        "FPDFText_FindClose",
        1,
      );
      _FPDFLink_LoadWebLinks = Module["_FPDFLink_LoadWebLinks"] =
        createExportWrapper("FPDFLink_LoadWebLinks", 1);
      _FPDFLink_CountWebLinks = Module["_FPDFLink_CountWebLinks"] =
        createExportWrapper("FPDFLink_CountWebLinks", 1);
      _FPDFLink_GetURL = Module["_FPDFLink_GetURL"] = createExportWrapper(
        "FPDFLink_GetURL",
        4,
      );
      _FPDFLink_CountRects = Module["_FPDFLink_CountRects"] =
        createExportWrapper("FPDFLink_CountRects", 2);
      _FPDFLink_GetRect = Module["_FPDFLink_GetRect"] = createExportWrapper(
        "FPDFLink_GetRect",
        7,
      );
      _FPDFLink_GetTextRange = Module["_FPDFLink_GetTextRange"] =
        createExportWrapper("FPDFLink_GetTextRange", 4);
      _FPDFLink_CloseWebLinks = Module["_FPDFLink_CloseWebLinks"] =
        createExportWrapper("FPDFLink_CloseWebLinks", 1);
      _FPDFPage_GetDecodedThumbnailData = Module[
        "_FPDFPage_GetDecodedThumbnailData"
      ] = createExportWrapper("FPDFPage_GetDecodedThumbnailData", 3);
      _FPDFPage_GetRawThumbnailData = Module["_FPDFPage_GetRawThumbnailData"] =
        createExportWrapper("FPDFPage_GetRawThumbnailData", 3);
      _FPDFPage_GetThumbnailAsBitmap = Module[
        "_FPDFPage_GetThumbnailAsBitmap"
      ] = createExportWrapper("FPDFPage_GetThumbnailAsBitmap", 1);
      _FPDFPage_SetMediaBox = Module["_FPDFPage_SetMediaBox"] =
        createExportWrapper("FPDFPage_SetMediaBox", 5);
      _FPDFPage_SetCropBox = Module["_FPDFPage_SetCropBox"] =
        createExportWrapper("FPDFPage_SetCropBox", 5);
      _FPDFPage_SetBleedBox = Module["_FPDFPage_SetBleedBox"] =
        createExportWrapper("FPDFPage_SetBleedBox", 5);
      _FPDFPage_SetTrimBox = Module["_FPDFPage_SetTrimBox"] =
        createExportWrapper("FPDFPage_SetTrimBox", 5);
      _FPDFPage_SetArtBox = Module["_FPDFPage_SetArtBox"] = createExportWrapper(
        "FPDFPage_SetArtBox",
        5,
      );
      _FPDFPage_GetMediaBox = Module["_FPDFPage_GetMediaBox"] =
        createExportWrapper("FPDFPage_GetMediaBox", 5);
      _FPDFPage_GetCropBox = Module["_FPDFPage_GetCropBox"] =
        createExportWrapper("FPDFPage_GetCropBox", 5);
      _FPDFPage_GetBleedBox = Module["_FPDFPage_GetBleedBox"] =
        createExportWrapper("FPDFPage_GetBleedBox", 5);
      _FPDFPage_GetTrimBox = Module["_FPDFPage_GetTrimBox"] =
        createExportWrapper("FPDFPage_GetTrimBox", 5);
      _FPDFPage_GetArtBox = Module["_FPDFPage_GetArtBox"] = createExportWrapper(
        "FPDFPage_GetArtBox",
        5,
      );
      _FPDFPage_TransFormWithClip = Module["_FPDFPage_TransFormWithClip"] =
        createExportWrapper("FPDFPage_TransFormWithClip", 3);
      _FPDFPageObj_TransformClipPath = Module[
        "_FPDFPageObj_TransformClipPath"
      ] = createExportWrapper("FPDFPageObj_TransformClipPath", 7);
      _FPDFPageObj_GetClipPath = Module["_FPDFPageObj_GetClipPath"] =
        createExportWrapper("FPDFPageObj_GetClipPath", 1);
      _FPDFClipPath_CountPaths = Module["_FPDFClipPath_CountPaths"] =
        createExportWrapper("FPDFClipPath_CountPaths", 1);
      _FPDFClipPath_CountPathSegments = Module[
        "_FPDFClipPath_CountPathSegments"
      ] = createExportWrapper("FPDFClipPath_CountPathSegments", 2);
      _FPDFClipPath_GetPathSegment = Module["_FPDFClipPath_GetPathSegment"] =
        createExportWrapper("FPDFClipPath_GetPathSegment", 3);
      _FPDF_CreateClipPath = Module["_FPDF_CreateClipPath"] =
        createExportWrapper("FPDF_CreateClipPath", 4);
      _FPDF_DestroyClipPath = Module["_FPDF_DestroyClipPath"] =
        createExportWrapper("FPDF_DestroyClipPath", 1);
      _FPDFPage_InsertClipPath = Module["_FPDFPage_InsertClipPath"] =
        createExportWrapper("FPDFPage_InsertClipPath", 2);
      _FPDF_InitLibrary = Module["_FPDF_InitLibrary"] = createExportWrapper(
        "FPDF_InitLibrary",
        0,
      );
      _malloc = Module["_malloc"] = createExportWrapper("malloc", 1);
      _free = Module["_free"] = createExportWrapper("free", 1);
      _FPDF_DestroyLibrary = Module["_FPDF_DestroyLibrary"] =
        createExportWrapper("FPDF_DestroyLibrary", 0);
      _FPDF_SetSandBoxPolicy = Module["_FPDF_SetSandBoxPolicy"] =
        createExportWrapper("FPDF_SetSandBoxPolicy", 2);
      _FPDF_LoadDocument = Module["_FPDF_LoadDocument"] = createExportWrapper(
        "FPDF_LoadDocument",
        2,
      );
      _FPDF_GetFormType = Module["_FPDF_GetFormType"] = createExportWrapper(
        "FPDF_GetFormType",
        1,
      );
      _FPDF_LoadXFA = Module["_FPDF_LoadXFA"] = createExportWrapper(
        "FPDF_LoadXFA",
        1,
      );
      _FPDF_LoadMemDocument = Module["_FPDF_LoadMemDocument"] =
        createExportWrapper("FPDF_LoadMemDocument", 3);
      _FPDF_LoadMemDocument64 = Module["_FPDF_LoadMemDocument64"] =
        createExportWrapper("FPDF_LoadMemDocument64", 3);
      _FPDF_LoadCustomDocument = Module["_FPDF_LoadCustomDocument"] =
        createExportWrapper("FPDF_LoadCustomDocument", 2);
      _FPDF_GetFileVersion = Module["_FPDF_GetFileVersion"] =
        createExportWrapper("FPDF_GetFileVersion", 2);
      _FPDF_DocumentHasValidCrossReferenceTable = Module[
        "_FPDF_DocumentHasValidCrossReferenceTable"
      ] = createExportWrapper("FPDF_DocumentHasValidCrossReferenceTable", 1);
      _FPDF_GetDocPermissions = Module["_FPDF_GetDocPermissions"] =
        createExportWrapper("FPDF_GetDocPermissions", 1);
      _FPDF_GetDocUserPermissions = Module["_FPDF_GetDocUserPermissions"] =
        createExportWrapper("FPDF_GetDocUserPermissions", 1);
      _FPDF_GetSecurityHandlerRevision = Module[
        "_FPDF_GetSecurityHandlerRevision"
      ] = createExportWrapper("FPDF_GetSecurityHandlerRevision", 1);
      _FPDF_GetPageCount = Module["_FPDF_GetPageCount"] = createExportWrapper(
        "FPDF_GetPageCount",
        1,
      );
      _FPDF_LoadPage = Module["_FPDF_LoadPage"] = createExportWrapper(
        "FPDF_LoadPage",
        2,
      );
      _FPDF_GetPageWidthF = Module["_FPDF_GetPageWidthF"] = createExportWrapper(
        "FPDF_GetPageWidthF",
        1,
      );
      _FPDF_GetPageWidth = Module["_FPDF_GetPageWidth"] = createExportWrapper(
        "FPDF_GetPageWidth",
        1,
      );
      _FPDF_GetPageHeightF = Module["_FPDF_GetPageHeightF"] =
        createExportWrapper("FPDF_GetPageHeightF", 1);
      _FPDF_GetPageHeight = Module["_FPDF_GetPageHeight"] = createExportWrapper(
        "FPDF_GetPageHeight",
        1,
      );
      _FPDF_GetPageBoundingBox = Module["_FPDF_GetPageBoundingBox"] =
        createExportWrapper("FPDF_GetPageBoundingBox", 2);
      _FPDF_RenderPageBitmap = Module["_FPDF_RenderPageBitmap"] =
        createExportWrapper("FPDF_RenderPageBitmap", 8);
      _FPDF_RenderPageBitmapWithMatrix = Module[
        "_FPDF_RenderPageBitmapWithMatrix"
      ] = createExportWrapper("FPDF_RenderPageBitmapWithMatrix", 5);
      _FPDF_ClosePage = Module["_FPDF_ClosePage"] = createExportWrapper(
        "FPDF_ClosePage",
        1,
      );
      _FPDF_CloseDocument = Module["_FPDF_CloseDocument"] = createExportWrapper(
        "FPDF_CloseDocument",
        1,
      );
      _FPDF_GetLastError = Module["_FPDF_GetLastError"] = createExportWrapper(
        "FPDF_GetLastError",
        0,
      );
      _FPDF_DeviceToPage = Module["_FPDF_DeviceToPage"] = createExportWrapper(
        "FPDF_DeviceToPage",
        10,
      );
      _FPDF_PageToDevice = Module["_FPDF_PageToDevice"] = createExportWrapper(
        "FPDF_PageToDevice",
        10,
      );
      _FPDFBitmap_Create = Module["_FPDFBitmap_Create"] = createExportWrapper(
        "FPDFBitmap_Create",
        3,
      );
      _FPDFBitmap_CreateEx = Module["_FPDFBitmap_CreateEx"] =
        createExportWrapper("FPDFBitmap_CreateEx", 5);
      _FPDFBitmap_GetFormat = Module["_FPDFBitmap_GetFormat"] =
        createExportWrapper("FPDFBitmap_GetFormat", 1);
      _FPDFBitmap_FillRect = Module["_FPDFBitmap_FillRect"] =
        createExportWrapper("FPDFBitmap_FillRect", 6);
      _FPDFBitmap_GetBuffer = Module["_FPDFBitmap_GetBuffer"] =
        createExportWrapper("FPDFBitmap_GetBuffer", 1);
      _FPDFBitmap_GetWidth = Module["_FPDFBitmap_GetWidth"] =
        createExportWrapper("FPDFBitmap_GetWidth", 1);
      _FPDFBitmap_GetHeight = Module["_FPDFBitmap_GetHeight"] =
        createExportWrapper("FPDFBitmap_GetHeight", 1);
      _FPDFBitmap_GetStride = Module["_FPDFBitmap_GetStride"] =
        createExportWrapper("FPDFBitmap_GetStride", 1);
      _FPDFBitmap_Destroy = Module["_FPDFBitmap_Destroy"] = createExportWrapper(
        "FPDFBitmap_Destroy",
        1,
      );
      _FPDF_GetPageSizeByIndexF = Module["_FPDF_GetPageSizeByIndexF"] =
        createExportWrapper("FPDF_GetPageSizeByIndexF", 3);
      _FPDF_GetPageSizeByIndex = Module["_FPDF_GetPageSizeByIndex"] =
        createExportWrapper("FPDF_GetPageSizeByIndex", 4);
      _FPDF_VIEWERREF_GetPrintScaling = Module[
        "_FPDF_VIEWERREF_GetPrintScaling"
      ] = createExportWrapper("FPDF_VIEWERREF_GetPrintScaling", 1);
      _FPDF_VIEWERREF_GetNumCopies = Module["_FPDF_VIEWERREF_GetNumCopies"] =
        createExportWrapper("FPDF_VIEWERREF_GetNumCopies", 1);
      _FPDF_VIEWERREF_GetPrintPageRange = Module[
        "_FPDF_VIEWERREF_GetPrintPageRange"
      ] = createExportWrapper("FPDF_VIEWERREF_GetPrintPageRange", 1);
      _FPDF_VIEWERREF_GetPrintPageRangeCount = Module[
        "_FPDF_VIEWERREF_GetPrintPageRangeCount"
      ] = createExportWrapper("FPDF_VIEWERREF_GetPrintPageRangeCount", 1);
      _FPDF_VIEWERREF_GetPrintPageRangeElement = Module[
        "_FPDF_VIEWERREF_GetPrintPageRangeElement"
      ] = createExportWrapper("FPDF_VIEWERREF_GetPrintPageRangeElement", 2);
      _FPDF_VIEWERREF_GetDuplex = Module["_FPDF_VIEWERREF_GetDuplex"] =
        createExportWrapper("FPDF_VIEWERREF_GetDuplex", 1);
      _FPDF_VIEWERREF_GetName = Module["_FPDF_VIEWERREF_GetName"] =
        createExportWrapper("FPDF_VIEWERREF_GetName", 4);
      _FPDF_CountNamedDests = Module["_FPDF_CountNamedDests"] =
        createExportWrapper("FPDF_CountNamedDests", 1);
      _FPDF_GetNamedDestByName = Module["_FPDF_GetNamedDestByName"] =
        createExportWrapper("FPDF_GetNamedDestByName", 2);
      _FPDF_GetNamedDest = Module["_FPDF_GetNamedDest"] = createExportWrapper(
        "FPDF_GetNamedDest",
        4,
      );
      _FPDF_GetXFAPacketCount = Module["_FPDF_GetXFAPacketCount"] =
        createExportWrapper("FPDF_GetXFAPacketCount", 1);
      _FPDF_GetXFAPacketName = Module["_FPDF_GetXFAPacketName"] =
        createExportWrapper("FPDF_GetXFAPacketName", 4);
      _FPDF_GetXFAPacketContent = Module["_FPDF_GetXFAPacketContent"] =
        createExportWrapper("FPDF_GetXFAPacketContent", 5);
      _FPDF_GetTrailerEnds = Module["_FPDF_GetTrailerEnds"] =
        createExportWrapper("FPDF_GetTrailerEnds", 3);
      _fflush = createExportWrapper("fflush", 1);
      _emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"];
      _emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"];
      _emscripten_builtin_memalign = createExportWrapper(
        "emscripten_builtin_memalign",
        2,
      );
      _strerror = createExportWrapper("strerror", 1);
      _setThrew = createExportWrapper("setThrew", 2);
      _emscripten_stack_init = wasmExports["emscripten_stack_init"];
      _emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"];
      __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
      __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
      _emscripten_stack_get_current =
        wasmExports["emscripten_stack_get_current"];
      memory = wasmMemory = wasmExports["memory"];
      __indirect_function_table = wasmTable =
        wasmExports["__indirect_function_table"];
    }
    var wasmImports = {
      __syscall_fcntl64: ___syscall_fcntl64,
      __syscall_fstat64: ___syscall_fstat64,
      __syscall_ftruncate64: ___syscall_ftruncate64,
      __syscall_getdents64: ___syscall_getdents64,
      __syscall_ioctl: ___syscall_ioctl,
      __syscall_lstat64: ___syscall_lstat64,
      __syscall_newfstatat: ___syscall_newfstatat,
      __syscall_openat: ___syscall_openat,
      __syscall_rmdir: ___syscall_rmdir,
      __syscall_stat64: ___syscall_stat64,
      __syscall_unlinkat: ___syscall_unlinkat,
      _abort_js: __abort_js,
      _emscripten_throw_longjmp: __emscripten_throw_longjmp,
      _gmtime_js: __gmtime_js,
      _localtime_js: __localtime_js,
      _mmap_js: __mmap_js,
      _munmap_js: __munmap_js,
      _tzset_js: __tzset_js,
      emscripten_date_now: _emscripten_date_now,
      emscripten_resize_heap: _emscripten_resize_heap,
      environ_get: _environ_get,
      environ_sizes_get: _environ_sizes_get,
      fd_close: _fd_close,
      fd_read: _fd_read,
      fd_seek: _fd_seek,
      fd_sync: _fd_sync,
      fd_write: _fd_write,
      invoke_ii,
      invoke_iii,
      invoke_iiii,
      invoke_iiiii,
      invoke_viii,
      invoke_viiii,
    };
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (!(e instanceof EmscriptenEH)) throw e;
        _setThrew(1, 0);
      }
    }
    var calledRun;
    function stackCheckInit() {
      _emscripten_stack_init();
      writeStackCookie();
    }
    function run() {
      if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      stackCheckInit();
      preRun();
      if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      function doRun() {
        assert(!calledRun);
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve?.(Module);
        Module["onRuntimeInitialized"]?.();
        consumedModuleProp("onRuntimeInitialized");
        assert(
          !Module["_main"],
          'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]',
        );
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(() => {
          setTimeout(() => Module["setStatus"](""), 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
      checkStackCookie();
    }
    var wasmExports;
    wasmExports = await createWasm();
    run();
    if (runtimeInitialized) {
      moduleRtn = Module;
    } else {
      moduleRtn = new Promise((resolve, reject) => {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
    }
    for (const prop of Object.keys(Module)) {
      if (!(prop in moduleArg)) {
        Object.defineProperty(moduleArg, prop, {
          configurable: true,
          get() {
            abort(
              `Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`,
            );
          },
        });
      }
    }
    return moduleRtn;
  };
})();
if (typeof exports === "object" && typeof module === "object") {
  module.exports = PDFiumModule;
  module.exports.default = PDFiumModule;
} else if (typeof define === "function" && define["amd"])
  define([], () => PDFiumModule);
