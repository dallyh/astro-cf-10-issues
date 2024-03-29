var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-sphDBH/checked-fetch.js
function checkURL(request, init2) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init2) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-sphDBH/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init2] = argArray;
        checkURL(request, init2);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/astro_Bticr204.mjs
function getDefaultExportFromCjs(x3) {
  return x3 && x3.__esModule && Object.prototype.hasOwnProperty.call(x3, "default") ? x3["default"] : x3;
}
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n2 = -2; n2 <= 2; n2++) {
    if (lines[loc.line + n2])
      visibleLines.push(loc.line + n2);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w3 = `> ${lineNo}`;
    if (w3.length > gutterWidth)
      gutterWidth = w3.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
function init(x3, y2) {
  let rgx = new RegExp(`\\x1b\\[${y2}m`, "g");
  let open = `\x1B[${x3}m`, close = `\x1B[${y2}m`;
  return function(txt) {
    if (!$.enabled || txt == null)
      return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
async function renderEndpoint(mod, context, ssr, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  const handler = mod[method] ?? mod["ALL"];
  if (!ssr && ssr === false && method !== "GET") {
    logger.warn(
      "router",
      `${url.pathname} ${bold(
        method
      )} requests are not available for a static site. Update your config to \`output: 'server'\` or \`output: 'hybrid'\` to enable.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  const response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
  }
  return response;
}
function validateArgs(args) {
  if (args.length !== 3)
    return false;
  if (!args[0] || typeof args[0] !== "object")
    return false;
  return true;
}
function baseCreateComponent(cb2, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb2(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts2) {
  const cb2 = baseCreateComponent(opts2.factory, opts2.moduleId, opts2.propagation);
  return cb2;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult) => {
    if (typeof importMetaGlobResult === "string") {
      throw new AstroError({
        ...AstroGlobUsedOutside,
        message: AstroGlobUsedOutside.message(JSON.stringify(importMetaGlobResult))
      });
    }
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new AstroError({
        ...AstroGlobNoMatch,
        message: AstroGlobNoMatch.message(JSON.stringify(importMetaGlobResult))
      });
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(site) {
  return {
    // TODO: this is no longer neccessary for `Astro.site`
    // but it somehow allows working around caching issues in content collections for some tests
    site: site ? new URL(site) : void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    glob: createAstroGlobFn()
  };
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function r(e) {
  var t2, f, n2 = "";
  if ("string" == typeof e || "number" == typeof e)
    n2 += e;
  else if ("object" == typeof e)
    if (Array.isArray(e)) {
      var o2 = e.length;
      for (t2 = 0; t2 < o2; t2++)
        e[t2] && (f = r(e[t2])) && (n2 && (n2 += " "), n2 += f);
    } else
      for (f in e)
        e[f] && (n2 && (n2 += " "), n2 += f);
  return n2;
}
function clsx() {
  for (var e, t2, f = 0, n2 = "", o2 = arguments.length; f < o2; f++)
    (e = arguments[f]) && (t2 = r(e)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v2) => {
    return convertToSerializedForm(v2, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k3, v2]) => {
      return [k3, convertToSerializedForm(v2, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else if (value === void 0) {
        return [PROP_TYPE.Value];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.componentMetadata.has(factory.moduleId) && hint === "none") {
    hint = result.componentMetadata.get(factory.moduleId).propagation;
  }
  return hint === "in-tree" || hint === "self";
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `${ISLAND_STYLES}<script>${getDirectiveScriptText(result, directive)};${astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}<\/script>`;
  }
  return "";
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)?.replace(
      /<\/script>/g,
      "\\x3C/script>"
    )};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (typeof value === "string" && value.includes("&") && urlCanParse(value)) {
    return markHTMLString(` ${key}="${toAttributeString(value, false)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _2, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}
function renderToBufferDestination(bufferRenderFunction) {
  const bufferChunks = [];
  const bufferDestination = {
    write: (chunk) => bufferChunks.push(chunk)
  };
  const renderPromise = bufferRenderFunction(bufferDestination);
  Promise.resolve(renderPromise).catch(() => {
  });
  return {
    async renderToFinalDestination(destination) {
      for (const chunk of bufferChunks) {
        destination.write(chunk);
      }
      bufferDestination.write = (chunk) => destination.write(chunk);
      await renderPromise;
    }
  };
}
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function urlCanParse(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map(
    (style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style)
  );
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  let content = styles.join("\n") + links.join("\n") + scripts.join("\n");
  if (result._metadata.extraHead.length > 0) {
    for (const part of result._metadata.extraHead) {
      content += part;
    }
  }
  return markHTMLString(content);
}
function renderHead() {
  return createRenderInstruction({ type: "head" });
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}
function isSlotString(str) {
  return !!str[slotString];
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) {
    return renderSlot(result, fallback);
  }
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        if (chunk.instructions) {
          instructions ??= [];
          instructions.push(...chunk.instructions);
        }
      } else if (chunk instanceof Response)
        return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted, fallback);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
        if (prescriptType) {
          let prescripts = getPrescripts(result, prescriptType, hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (result._metadata.hasRenderedHead || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (result._metadata.hasRenderedHead || result._metadata.headInTree || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c = chunk;
    if (c.instructions) {
      for (const instr of c.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}
async function renderChild(destination, child) {
  child = await child;
  if (child instanceof SlotString) {
    destination.write(child);
  } else if (isHTMLString(child)) {
    destination.write(child);
  } else if (Array.isArray(child)) {
    const childRenders = child.map((c) => {
      return renderToBufferDestination((bufferDestination) => {
        return renderChild(bufferDestination, c);
      });
    });
    for (const childRender of childRenders) {
      if (!childRender)
        continue;
      await childRender.renderToFinalDestination(destination);
    }
  } else if (typeof child === "function") {
    await renderChild(destination, child());
  } else if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
  } else if (!child && child !== 0)
    ;
  else if (isRenderInstance(child)) {
    await child.render(destination);
  } else if (isRenderTemplateResult(child)) {
    await child.render(destination);
  } else if (isAstroComponentInstance(child)) {
    await child.render(destination);
  } else if (ArrayBuffer.isView(child)) {
    destination.write(child);
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    for await (const value of child) {
      await renderChild(destination, value);
    }
  } else {
    destination.write(child);
  }
}
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (prop.startsWith("client:")) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory)) {
    result._metadata.propagators.add(instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response)
        return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
}
async function bufferHeadContent(result) {
  const iterator = result._metadata.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(result);
    if (isHeadAndContent(returnValue)) {
      result._metadata.extraHead.push(returnValue.head);
    }
  }
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response)
    return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = promiseWithResolvers();
  const buffer = [];
  const iterator = {
    async next() {
      if (result.cancelled)
        return { done: true, value: void 0 };
      await next.promise;
      if (error2) {
        throw error2;
      }
      let length = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        length += buffer[i].length;
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        const item = buffer[i];
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done if there are no chunks to return.
        done: length === 0,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArray(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next.resolve();
        next = promiseWithResolvers();
      }
    }
  };
  const renderPromise = templateResult.render(destination);
  renderPromise.then(() => {
    next.resolve();
  }).catch((err) => {
    error2 = err;
    next.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte",
        "@astrojs/lit"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r3) => r3.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error2;
      for (const r3 of renderers2) {
        try {
          if (await r3.ssr.check.call({ result }, Component, props, children)) {
            renderer = r3;
            break;
          }
        } catch (e) {
          error2 ??= e;
        }
      }
      if (!renderer && error2) {
        throw error2;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers2.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers2.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...NoClientOnlyHint,
        message: NoClientOnlyHint.message(metadata.displayName),
        hint: NoClientOnlyHint.hint(
          probableRendererNames.map((r3) => r3.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r3) => probableRendererNames.includes(r3.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r3) => "`" + r3 + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...NoClientEntrypoint,
      message: NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response)
          return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlotToString(result, slots?.default);
  return {
    render(destination) {
      if (children == null)
        return;
      destination.write(children);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    async render(destination) {
      await instance.render(destination);
    }
  };
}
async function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    Component = await Component.catch(handleCancellation);
  }
  if (isFragmentComponent(Component)) {
    return await renderFragmentComponent(result, slots).catch(handleCancellation);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return await renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return await renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return { render() {
      } };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response)
          return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v2) => renderJSX(result, v2)))).join("")
      );
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderToString(result, vnode.type, props, slots);
        if (str instanceof Response) {
          throw str;
        }
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    const str = await renderComponentToString(
      result,
      componentFactory.name,
      componentFactory,
      pageProps,
      {},
      true,
      route
    );
    const bytes = encoder.encode(str);
    return new Response(bytes, {
      headers: new Headers([
        ["Content-Type", "text/html; charset=utf-8"],
        ["Content-Length", bytes.byteLength.toString()]
      ])
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response)
    return body;
  const init2 = result.response;
  const headers = new Headers(init2.headers);
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  if (route?.component.endsWith(".md")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  const response = new Response(body, { ...init2, headers });
  return response;
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
var ClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientEntrypoint, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, PrerenderDynamicEndpointPathCollide, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, AstroResponseHeadersReassigned, AstroGlobUsedOutside, AstroGlobNoMatch, AstroError, ASTRO_VERSION, REROUTE_DIRECTIVE_HEADER, ROUTE_TYPE_HEADER, DEFAULT_404_COMPONENT, REROUTABLE_STATUS_CODES, clientAddressSymbol, clientLocalsSymbol, responseSentSymbol, FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY, $, bold, dim, red, yellow, blue, replace, ca, esca, pe, escape, escapeHTML, HTMLString, markHTMLString, AstroJSX, RenderInstructionSymbol, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, ISLAND_STYLES, voidElementNames, htmlBooleanAttributes, htmlEnumAttributes, svgEnumAttributes, STATIC_DIRECTIVES, toIdent, toAttributeString, kebab, toStyleString, isNode, uniqueElements, slotString, SlotString, Fragment, Renderer, encoder, decoder, astroComponentInstanceSym, AstroComponentInstance, renderTemplateResultSym, RenderTemplateResult, DOCTYPE_EXP, needsHeadRenderingSymbol, rendererAliases, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder, hasTriedRenderComponentSymbol, object, hasOwnProperty, merge, regexAnySingleEscape, regexSingleEscape, regexExcessiveSpaces, cssesc;
var init_astro_Bticr204 = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/astro_Bticr204.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in static mode.",
      message: "`Astro.clientAddress` is only available when using `output: 'server'` or `output: 'hybrid'`. Update your Astro config if you need SSR features.",
      hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
      hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
      hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
      hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
    };
    NoClientEntrypoint = {
      name: "NoClientEntrypoint",
      title: "No client entrypoint specified in renderer.",
      message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
      hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
      hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside getStaticPath's return value",
      message: (entryType) => `Invalid entry returned by getStaticPaths. Expected an object, got \`${entryType}\``,
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by getStaticPaths.",
      message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
      hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths` route.",
      message: "Missing or empty required `params` property on `getStaticPaths` route.",
      hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid value for `getStaticPaths` route parameter.",
      message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
      hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` or \`output: "hybrid"\` in your Astro config file to switch to a non-static server build. This error can also occur if using \`export const prerender = true;\`.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: (slotName2) => `Unable to create a slot named \`${slotName2}\`. \`${slotName2}\` is a reserved slot name. Please update the name of this slot.`
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
      hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m) => `.json` + m)}\``
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    AstroGlobUsedOutside = {
      name: "AstroGlobUsedOutside",
      title: "Astro.glob() used outside of an Astro file.",
      message: (globStr) => `\`Astro.glob(${globStr})\` can only be used in \`.astro\` files. \`import.meta.glob(${globStr})\` can be used instead to achieve a similar result.`,
      hint: "See Vite's documentation on `import.meta.glob` for more information: https://vitejs.dev/guide/features.html#glob-import"
    };
    AstroGlobNoMatch = {
      name: "AstroGlobNoMatch",
      title: "Astro.glob() did not match any files.",
      message: (globStr) => `\`Astro.glob(${globStr})\` did not return any matching files.`,
      hint: "Check the pattern for typos."
    };
    AstroError = class extends Error {
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message)
          this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err.type === "AstroError";
      }
    };
    ASTRO_VERSION = "4.5.12";
    REROUTE_DIRECTIVE_HEADER = "X-Astro-Reroute";
    ROUTE_TYPE_HEADER = "X-Astro-Route-Type";
    DEFAULT_404_COMPONENT = "astro-default-404";
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = Symbol.for("astro.clientAddress");
    clientLocalsSymbol = Symbol.for("astro.locals");
    responseSentSymbol = Symbol.for("astro.responseSent");
    isTTY = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
      isTTY = process.stdout && process.stdout.isTTY;
    }
    $ = {
      enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
    };
    bold = init(1, 22);
    dim = init(2, 22);
    red = init(31, 39);
    yellow = init(33, 39);
    blue = init(34, 39);
    ({ replace } = "");
    ca = /[&<>'"]/g;
    esca = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    pe = (m) => esca[m];
    escape = (es) => replace.call(es, ca, pe);
    escapeHTML = escape;
    HTMLString = class extends String {
      get [Symbol.toStringTag]() {
        return "HTMLString";
      }
    };
    markHTMLString = (value) => {
      if (value instanceof HTMLString) {
        return value;
      }
      if (typeof value === "string") {
        return new HTMLString(value);
      }
      return value;
    };
    AstroJSX = "astro:jsx";
    RenderInstructionSymbol = Symbol.for("astro:render");
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      // Actually means Array
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10
    };
    transitionDirectivesToCopyOnIsland = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = dictionary.length;
    headAndContentSym = Symbol.for("astro.headAndContent");
    astro_island_prebuilt_default = `(()=>{var v=Object.defineProperty;var A=(c,s,a)=>s in c?v(c,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):c[s]=a;var d=(c,s,a)=>(A(c,typeof s!="symbol"?s+"":s,a),a);var u;{let c={0:t=>m(t),1:t=>a(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(a(t)),5:t=>new Set(a(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t)},s=t=>{let[e,n]=t;return e in c?c[e](n):void 0},a=t=>t.map(s),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([e,n])=>[e,s(n)]));customElements.get("astro-island")||customElements.define("astro-island",(u=class extends HTMLElement{constructor(){super(...arguments);d(this,"Component");d(this,"hydrator");d(this,"hydrate",async()=>{var f;if(!this.hydrator||!this.isConnected)return;let e=(f=this.parentElement)==null?void 0:f.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},l=this.querySelectorAll("template[data-astro-template]");for(let o of l){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let h;try{h=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(o){let i=this.getAttribute("component-url")||"<unknown>",b=this.getAttribute("component-export");throw b&&(i+=\` (export \${b})\`),console.error(\`[hydrate] Error parsing props for component \${i}\`,this.getAttribute("props"),o),o}let p;await this.hydrator(this)(this.Component,h,r,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});d(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(\`astro:\${n}\`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url"),[l,{default:h}]=await Promise.all([import(this.getAttribute("component-url")),r?import(r):()=>()=>{}]),p=this.getAttribute("component-export")||"default";if(!p.includes("."))this.Component=l[p];else{this.Component=l;for(let y of p.split("."))this.Component=this.Component[y]}return this.hydrator=h,this.hydrate},e,this)}catch(r){console.error(\`[astro-island] Error hydrating \${this.getAttribute("component-url")}\`,r)}}attributeChangedCallback(){this.hydrate()}},d(u,"observedAttributes",["props"]),u))}})();`;
    ISLAND_STYLES = `<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>`;
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
    htmlEnumAttributes = /^(?:contenteditable|draggable|spellcheck|value)$/i;
    svgEnumAttributes = /^(?:autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    toIdent = (k3) => k3.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match))
        return "";
      return index === 0 ? match : match.toUpperCase();
    });
    toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
    kebab = (k3) => k3.toLowerCase() === k3 ? k3 : k3.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    toStyleString = (obj) => Object.entries(obj).filter(([_2, v2]) => typeof v2 === "string" && v2.trim() || typeof v2 === "number").map(([k3, v2]) => {
      if (k3[0] !== "-" && k3[1] !== "-")
        return `${kebab(k3)}:${v2}`;
      return `${k3}:${v2}`;
    }).join(";");
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    uniqueElements = (item, index, all) => {
      const props = JSON.stringify(item.props);
      const children = item.children;
      return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
    };
    slotString = Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      instructions;
      [slotString];
      constructor(content, instructions) {
        super(content);
        this.instructions = instructions;
        this[slotString] = true;
      }
    };
    Fragment = Symbol.for("astro:fragment");
    Renderer = Symbol.for("astro:renderer");
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    astroComponentInstanceSym = Symbol.for("astro.componentInstance");
    AstroComponentInstance = class {
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = {};
        for (const name in slots) {
          let didRender = false;
          let value = slots[name](result);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      async init(result) {
        if (this.returnValue !== void 0)
          return this.returnValue;
        this.returnValue = this.factory(result, this.props, this.slotValues);
        return this.returnValue;
      }
      async render(destination) {
        if (this.returnValue === void 0) {
          await this.init(this.result);
        }
        let value = this.returnValue;
        if (isPromise(value)) {
          value = await value;
        }
        if (isHeadAndContent(value)) {
          await value.content.render(destination);
        } else {
          await renderChild(destination, value);
        }
      }
    };
    renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
    RenderTemplateResult = class {
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions.map((expression) => {
          if (isPromise(expression)) {
            return Promise.resolve(expression).catch((err) => {
              if (!this.error) {
                this.error = err;
                throw err;
              }
            });
          }
          return expression;
        });
      }
      async render(destination) {
        const expRenders = this.expressions.map((exp) => {
          return renderToBufferDestination((bufferDestination) => {
            if (exp || exp === 0) {
              return renderChild(bufferDestination, exp);
            }
          });
        });
        for (let i = 0; i < this.htmlParts.length; i++) {
          const html = this.htmlParts[i];
          const expRender = expRenders[i];
          destination.write(markHTMLString(html));
          if (expRender) {
            await expRender.renderToFinalDestination(destination);
          }
        }
      }
    };
    DOCTYPE_EXP = /<!doctype html/i;
    needsHeadRenderingSymbol = Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    ClientOnlyPlaceholder = "astro-client-only";
    hasTriedRenderComponentSymbol = Symbol("hasTriedRenderComponent");
    object = {};
    hasOwnProperty = object.hasOwnProperty;
    merge = function merge2(options, defaults) {
      if (!options) {
        return defaults;
      }
      var result = {};
      for (var key in defaults) {
        result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
      }
      return result;
    };
    regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
    regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
    regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
    cssesc = function cssesc2(string, options) {
      options = merge(options, cssesc2.options);
      if (options.quotes != "single" && options.quotes != "double") {
        options.quotes = "single";
      }
      var quote = options.quotes == "double" ? '"' : "'";
      var isIdentifier = options.isIdentifier;
      var firstChar = string.charAt(0);
      var output = "";
      var counter = 0;
      var length = string.length;
      while (counter < length) {
        var character = string.charAt(counter++);
        var codePoint = character.charCodeAt();
        var value = void 0;
        if (codePoint < 32 || codePoint > 126) {
          if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
            var extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
            } else {
              counter--;
            }
          }
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        } else {
          if (options.escapeEverything) {
            if (regexAnySingleEscape.test(character)) {
              value = "\\" + character;
            } else {
              value = "\\" + codePoint.toString(16).toUpperCase() + " ";
            }
          } else if (/[\t\n\f\r\x0B]/.test(character)) {
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = character;
          }
        }
        output += value;
      }
      if (isIdentifier) {
        if (/^-[-\d]/.test(output)) {
          output = "\\-" + output.slice(1);
        } else if (/\d/.test(firstChar)) {
          output = "\\3" + firstChar + " " + output.slice(1);
        }
      }
      output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
        if ($1 && $1.length % 2) {
          return $0;
        }
        return ($1 || "") + $2;
      });
      if (!isIdentifier && options.wrap) {
        return quote + output + quote;
      }
      return output;
    };
    cssesc.options = {
      "escapeEverything": false,
      "isIdentifier": false,
      "quotes": "single",
      "wrap": false
    };
    cssesc.version = "3.0.0";
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v2, c) => (v2[c.charCodeAt(0)] = c, v2), []);
    "-0123456789_".split("").reduce((v2, c) => (v2[c.charCodeAt(0)] = c, v2), []);
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/vnode-children_VTcTc4QR.mjs
var vnode_children_VTcTc4QR_exports = {};
__export(vnode_children_VTcTc4QR_exports, {
  default: () => convert
});
function P(e) {
  let t2 = {}, a;
  if (e)
    for (_.lastIndex = 0, e = " " + (e || "") + " "; a = _.exec(e); )
      a[0] !== " " && (t2[a[1]] = a[3]);
  return t2;
}
function w(e) {
  let t2 = typeof e == "string" ? e : e.value, a, r3, n2, i, l2, d, g, h, s2, c = [];
  o.lastIndex = 0, r3 = a = { type: 0, children: [] };
  let E2 = 0;
  function m() {
    i = t2.substring(E2, o.lastIndex - n2[0].length), i && r3.children.push({ type: 2, value: i, parent: r3 });
  }
  for (; n2 = o.exec(t2); ) {
    if (d = n2[5] || n2[8], g = n2[6] || n2[9], h = n2[7] || n2[10], x.has(r3.name) && n2[2] !== r3.name) {
      l2 = o.lastIndex - n2[0].length, r3.children.length > 0 && (r3.children[0].value += n2[0]);
      continue;
    } else if (d === "<!--") {
      if (l2 = o.lastIndex - n2[0].length, x.has(r3.name))
        continue;
      s2 = { type: 3, value: g, parent: r3, loc: [{ start: l2, end: l2 + d.length }, { start: o.lastIndex - h.length, end: o.lastIndex }] }, c.push(s2), s2.parent.children.push(s2);
    } else if (d === "<!")
      l2 = o.lastIndex - n2[0].length, s2 = { type: 4, value: g, parent: r3, loc: [{ start: l2, end: l2 + d.length }, { start: o.lastIndex - h.length, end: o.lastIndex }] }, c.push(s2), s2.parent.children.push(s2);
    else if (n2[1] !== "/")
      if (m(), x.has(r3.name)) {
        E2 = o.lastIndex, m();
        continue;
      } else
        s2 = { type: 1, name: n2[2] + "", attributes: P(n2[3]), parent: r3, children: [], loc: [{ start: o.lastIndex - n2[0].length, end: o.lastIndex }] }, c.push(s2), s2.parent.children.push(s2), n2[4] && n2[4].indexOf("/") > -1 || D.has(s2.name) ? (s2.loc[1] = s2.loc[0], s2.isSelfClosingTag = true) : r3 = s2;
    else
      m(), n2[2] + "" === r3.name ? (s2 = r3, r3 = s2.parent, s2.loc.push({ start: o.lastIndex - n2[0].length, end: o.lastIndex }), i = t2.substring(s2.loc[0].end, s2.loc[1].start), s2.children.length === 0 && s2.children.push({ type: 2, value: i, parent: r3 })) : n2[2] + "" === c[c.length - 1].name && c[c.length - 1].isSelfClosingTag === true && (s2 = c[c.length - 1], s2.loc.push({ start: o.lastIndex - n2[0].length, end: o.lastIndex }));
    E2 = o.lastIndex;
  }
  return i = t2.slice(E2), r3.children.push({ type: 2, value: i, parent: r3 }), a;
}
function convert(children) {
  let doc = w(children.toString().trim());
  let id2 = ids++;
  let key = 0;
  function createReactElementFromNode(node) {
    const childVnodes = Array.isArray(node.children) && node.children.length ? node.children.map((child) => createReactElementFromNode(child)).filter(Boolean) : void 0;
    if (node.type === R) {
      return reactExports.createElement(reactExports.Fragment, {}, childVnodes);
    } else if (node.type === k) {
      const { class: className, ...props } = node.attributes;
      return reactExports.createElement(node.name, { ...props, className, key: `${id2}-${key++}` }, childVnodes);
    } else if (node.type === j) {
      return node.value.trim() ? node.value : void 0;
    }
  }
  const root = createReactElementFromNode(doc);
  return root.props.children;
}
var R, k, j, D, x, _, o, ids;
var init_vnode_children_VTcTc4QR = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/vnode-children_VTcTc4QR.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    R = 0;
    k = 1;
    j = 2;
    D = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
    x = /* @__PURE__ */ new Set(["script", "style"]);
    _ = /([\@\.a-z0-9_\:\-]*)\s*?=?\s*?(['"]?)([\s\S]*?)\2\s+/gim;
    o = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:-]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!)([\s\S]*?)(>))/gm;
    ids = 0;
  }
});

// .wrangler/tmp/pages-L6EXwU/renderers.mjs
function A$1(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
function E$2(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$2;
}
function F$1() {
}
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$2;
}
function M$2(a, b, e) {
  var d, c = {}, k3 = null, h = null;
  if (null != b)
    for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k3 = "" + b.key), b)
      J$2.call(b, d) && !L$2.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g)
    c.children = e;
  else if (1 < g) {
    for (var f = Array(g), m = 0; m < g; m++)
      f[m] = arguments[m + 2];
    c.children = f;
  }
  if (a && a.defaultProps)
    for (d in g = a.defaultProps, g)
      void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$3, type: a, key: k3, ref: h, props: c, _owner: K$2.current };
}
function N$2(a, b) {
  return { $$typeof: l$3, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$2(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$3;
}
function escape2(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
function Q$2(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape2("" + a.key) : b.toString(36);
}
function R$2(a, b, e, d, c) {
  var k3 = typeof a;
  if ("undefined" === k3 || "boolean" === k3)
    a = null;
  var h = false;
  if (null === a)
    h = true;
  else
    switch (k3) {
      case "string":
      case "number":
        h = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l$3:
          case n$1:
            h = true;
        }
    }
  if (h)
    return h = a, c = c(h), a = "" === d ? "." + Q$2(h, 0) : d, I$2(c) ? (e = "", null != a && (e = a.replace(P$2, "$&/") + "/"), R$2(c, b, e, "", function(a2) {
      return a2;
    })) : null != c && (O$2(c) && (c = N$2(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$2, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$2(a))
    for (var g = 0; g < a.length; g++) {
      k3 = a[g];
      var f = d + Q$2(k3, g);
      h += R$2(k3, b, e, f, c);
    }
  else if (f = A$1(a), "function" === typeof f)
    for (a = f.call(a), g = 0; !(k3 = a.next()).done; )
      k3 = k3.value, f = d + Q$2(k3, g++), h += R$2(k3, b, e, f, c);
  else if ("object" === k3)
    throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$2(a, b, e) {
  if (null == a)
    return a;
  var d = [], c = 0;
  R$2(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$2(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status)
    return a._result.default;
  throw a._result;
}
function l$2(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
    b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function ja$1(a) {
  if (p$1.call(ia$1, a))
    return true;
  if (p$1.call(ha$1, a))
    return false;
  if (fa$1.test(a))
    return ia$1[a] = true;
  ha$1[a] = true;
  return false;
}
function r2(a, b, c, d, f, e, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = f;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = e;
  this.removeEmptyString = g;
}
function la$1(a) {
  return a[1].toUpperCase();
}
function v(a) {
  if ("boolean" === typeof a || "number" === typeof a)
    return "" + a;
  a = "" + a;
  var b = na.exec(a);
  if (b) {
    var c = "", d, f = 0;
    for (d = b.index; d < a.length; d++) {
      switch (a.charCodeAt(d)) {
        case 34:
          b = "&quot;";
          break;
        case 38:
          b = "&amp;";
          break;
        case 39:
          b = "&#x27;";
          break;
        case 60:
          b = "&lt;";
          break;
        case 62:
          b = "&gt;";
          break;
        default:
          continue;
      }
      f !== d && (c += a.substring(f, d));
      f = d + 1;
      c += b;
    }
    a = f !== d ? c + a.substring(f, d) : c;
  }
  return a;
}
function w$1(a, b) {
  return { insertionMode: a, selectedValue: b };
}
function ra$1(a, b, c) {
  switch (b) {
    case "select":
      return w$1(1, null != c.value ? c.value : c.defaultValue);
    case "svg":
      return w$1(2, null);
    case "math":
      return w$1(3, null);
    case "foreignObject":
      return w$1(1, null);
    case "table":
      return w$1(4, null);
    case "thead":
    case "tbody":
    case "tfoot":
      return w$1(5, null);
    case "colgroup":
      return w$1(7, null);
    case "tr":
      return w$1(6, null);
  }
  return 4 <= a.insertionMode || 0 === a.insertionMode ? w$1(1, null) : a;
}
function ta$1(a, b, c) {
  if ("object" !== typeof c)
    throw Error(l$2(62));
  b = true;
  for (var d in c)
    if (p$1.call(c, d)) {
      var f = c[d];
      if (null != f && "boolean" !== typeof f && "" !== f) {
        if (0 === d.indexOf("--")) {
          var e = v(d);
          f = v(("" + f).trim());
        } else {
          e = d;
          var g = sa$1.get(e);
          void 0 !== g ? e = g : (g = v(e.replace(oa$1, "-$1").toLowerCase().replace(pa$1, "-ms-")), sa$1.set(e, g), e = g);
          f = "number" === typeof f ? 0 === f || p$1.call(u$1, d) ? "" + f : f + "px" : v(("" + f).trim());
        }
        b ? (b = false, a.push(' style="', e, ":", f)) : a.push(";", e, ":", f);
      }
    }
  b || a.push('"');
}
function x$1(a, b, c, d) {
  switch (c) {
    case "style":
      ta$1(a, b, d);
      return;
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
      return;
  }
  if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
    if (b = t$1.hasOwnProperty(c) ? t$1[c] : null, null !== b) {
      switch (typeof d) {
        case "function":
        case "symbol":
          return;
        case "boolean":
          if (!b.acceptsBooleans)
            return;
      }
      c = b.attributeName;
      switch (b.type) {
        case 3:
          d && a.push(" ", c, '=""');
          break;
        case 4:
          true === d ? a.push(" ", c, '=""') : false !== d && a.push(" ", c, '="', v(d), '"');
          break;
        case 5:
          isNaN(d) || a.push(" ", c, '="', v(d), '"');
          break;
        case 6:
          !isNaN(d) && 1 <= d && a.push(" ", c, '="', v(d), '"');
          break;
        default:
          b.sanitizeURL && (d = "" + d), a.push(" ", c, '="', v(d), '"');
      }
    } else if (ja$1(c)) {
      switch (typeof d) {
        case "function":
        case "symbol":
          return;
        case "boolean":
          if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b)
            return;
      }
      a.push(" ", c, '="', v(d), '"');
    }
  }
}
function y$1(a, b, c) {
  if (null != b) {
    if (null != c)
      throw Error(l$2(60));
    if ("object" !== typeof b || !("__html" in b))
      throw Error(l$2(61));
    b = b.__html;
    null !== b && void 0 !== b && a.push("" + b);
  }
}
function ua$1(a) {
  var b = "";
  aa$1.Children.forEach(a, function(a2) {
    null != a2 && (b += a2);
  });
  return b;
}
function va$1(a, b, c, d) {
  a.push(A(c));
  var f = c = null, e;
  for (e in b)
    if (p$1.call(b, e)) {
      var g = b[e];
      if (null != g)
        switch (e) {
          case "children":
            c = g;
            break;
          case "dangerouslySetInnerHTML":
            f = g;
            break;
          default:
            x$1(a, d, e, g);
        }
    }
  a.push(">");
  y$1(a, f, c);
  return "string" === typeof c ? (a.push(v(c)), null) : c;
}
function A(a) {
  var b = xa$1.get(a);
  if (void 0 === b) {
    if (!wa$1.test(a))
      throw Error(l$2(65, a));
    b = "<" + a;
    xa$1.set(a, b);
  }
  return b;
}
function ya$1(a, b, c, d, f) {
  switch (b) {
    case "select":
      a.push(A("select"));
      var e = null, g = null;
      for (n2 in c)
        if (p$1.call(c, n2)) {
          var h = c[n2];
          if (null != h)
            switch (n2) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              case "defaultValue":
              case "value":
                break;
              default:
                x$1(a, d, n2, h);
            }
        }
      a.push(">");
      y$1(a, g, e);
      return e;
    case "option":
      g = f.selectedValue;
      a.push(A("option"));
      var k3 = h = null, m = null;
      var n2 = null;
      for (e in c)
        if (p$1.call(c, e)) {
          var q2 = c[e];
          if (null != q2)
            switch (e) {
              case "children":
                h = q2;
                break;
              case "selected":
                m = q2;
                break;
              case "dangerouslySetInnerHTML":
                n2 = q2;
                break;
              case "value":
                k3 = q2;
              default:
                x$1(a, d, e, q2);
            }
        }
      if (null != g)
        if (c = null !== k3 ? "" + k3 : ua$1(h), qa$1(g))
          for (d = 0; d < g.length; d++) {
            if ("" + g[d] === c) {
              a.push(' selected=""');
              break;
            }
          }
        else
          "" + g === c && a.push(' selected=""');
      else
        m && a.push(' selected=""');
      a.push(">");
      y$1(a, n2, h);
      return h;
    case "textarea":
      a.push(A("textarea"));
      n2 = g = e = null;
      for (h in c)
        if (p$1.call(c, h) && (k3 = c[h], null != k3))
          switch (h) {
            case "children":
              n2 = k3;
              break;
            case "value":
              e = k3;
              break;
            case "defaultValue":
              g = k3;
              break;
            case "dangerouslySetInnerHTML":
              throw Error(l$2(91));
            default:
              x$1(
                a,
                d,
                h,
                k3
              );
          }
      null === e && null !== g && (e = g);
      a.push(">");
      if (null != n2) {
        if (null != e)
          throw Error(l$2(92));
        if (qa$1(n2) && 1 < n2.length)
          throw Error(l$2(93));
        e = "" + n2;
      }
      "string" === typeof e && "\n" === e[0] && a.push("\n");
      null !== e && a.push(v("" + e));
      return null;
    case "input":
      a.push(A("input"));
      k3 = n2 = h = e = null;
      for (g in c)
        if (p$1.call(c, g) && (m = c[g], null != m))
          switch (g) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(l$2(399, "input"));
            case "defaultChecked":
              k3 = m;
              break;
            case "defaultValue":
              h = m;
              break;
            case "checked":
              n2 = m;
              break;
            case "value":
              e = m;
              break;
            default:
              x$1(a, d, g, m);
          }
      null !== n2 ? x$1(a, d, "checked", n2) : null !== k3 && x$1(a, d, "checked", k3);
      null !== e ? x$1(a, d, "value", e) : null !== h && x$1(a, d, "value", h);
      a.push("/>");
      return null;
    case "menuitem":
      a.push(A("menuitem"));
      for (var C2 in c)
        if (p$1.call(c, C2) && (e = c[C2], null != e))
          switch (C2) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(l$2(400));
            default:
              x$1(a, d, C2, e);
          }
      a.push(">");
      return null;
    case "title":
      a.push(A("title"));
      e = null;
      for (q2 in c)
        if (p$1.call(c, q2) && (g = c[q2], null != g))
          switch (q2) {
            case "children":
              e = g;
              break;
            case "dangerouslySetInnerHTML":
              throw Error(l$2(434));
            default:
              x$1(a, d, q2, g);
          }
      a.push(">");
      return e;
    case "listing":
    case "pre":
      a.push(A(b));
      g = e = null;
      for (k3 in c)
        if (p$1.call(c, k3) && (h = c[k3], null != h))
          switch (k3) {
            case "children":
              e = h;
              break;
            case "dangerouslySetInnerHTML":
              g = h;
              break;
            default:
              x$1(a, d, k3, h);
          }
      a.push(">");
      if (null != g) {
        if (null != e)
          throw Error(l$2(60));
        if ("object" !== typeof g || !("__html" in g))
          throw Error(l$2(61));
        c = g.__html;
        null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push("\n", c) : a.push("" + c));
      }
      "string" === typeof e && "\n" === e[0] && a.push("\n");
      return e;
    case "area":
    case "base":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "img":
    case "keygen":
    case "link":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "wbr":
      a.push(A(b));
      for (var D3 in c)
        if (p$1.call(c, D3) && (e = c[D3], null != e))
          switch (D3) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(l$2(399, b));
            default:
              x$1(a, d, D3, e);
          }
      a.push("/>");
      return null;
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return va$1(
        a,
        c,
        b,
        d
      );
    case "html":
      return 0 === f.insertionMode && a.push("<!DOCTYPE html>"), va$1(a, c, b, d);
    default:
      if (-1 === b.indexOf("-") && "string" !== typeof c.is)
        return va$1(a, c, b, d);
      a.push(A(b));
      g = e = null;
      for (m in c)
        if (p$1.call(c, m) && (h = c[m], null != h))
          switch (m) {
            case "children":
              e = h;
              break;
            case "dangerouslySetInnerHTML":
              g = h;
              break;
            case "style":
              ta$1(a, d, h);
              break;
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              break;
            default:
              ja$1(m) && "function" !== typeof h && "symbol" !== typeof h && a.push(" ", m, '="', v(h), '"');
          }
      a.push(">");
      y$1(a, g, e);
      return e;
  }
}
function za$1(a, b, c) {
  a.push('<!--$?--><template id="');
  if (null === c)
    throw Error(l$2(395));
  a.push(c);
  return a.push('"></template>');
}
function Aa$1(a, b, c, d) {
  switch (c.insertionMode) {
    case 0:
    case 1:
      return a.push('<div hidden id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 2:
      return a.push('<svg aria-hidden="true" style="display:none" id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 3:
      return a.push('<math aria-hidden="true" style="display:none" id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 4:
      return a.push('<table hidden id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 5:
      return a.push('<table hidden><tbody id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 6:
      return a.push('<table hidden><tr id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    case 7:
      return a.push('<table hidden><colgroup id="'), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push('">');
    default:
      throw Error(l$2(397));
  }
}
function Ba$1(a, b) {
  switch (b.insertionMode) {
    case 0:
    case 1:
      return a.push("</div>");
    case 2:
      return a.push("</svg>");
    case 3:
      return a.push("</math>");
    case 4:
      return a.push("</table>");
    case 5:
      return a.push("</tbody></table>");
    case 6:
      return a.push("</tr></table>");
    case 7:
      return a.push("</colgroup></table>");
    default:
      throw Error(l$2(397));
  }
}
function Da$1(a) {
  return JSON.stringify(a).replace(Ca$1, function(a2) {
    switch (a2) {
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function Ea$1(a, b) {
  b = void 0 === b ? "" : b;
  return { bootstrapChunks: [], startInlineScript: "<script>", placeholderPrefix: b + "P:", segmentPrefix: b + "S:", boundaryPrefix: b + "B:", idPrefix: b, nextSuspenseID: 0, sentCompleteSegmentFunction: false, sentCompleteBoundaryFunction: false, sentClientRenderFunction: false, generateStaticMarkup: a };
}
function Fa$1(a, b, c, d) {
  if (c.generateStaticMarkup)
    return a.push(v(b)), false;
  "" === b ? a = d : (d && a.push("<!-- -->"), a.push(v(b)), a = true);
  return a;
}
function Xa$1(a) {
  if (null == a)
    return null;
  if ("function" === typeof a)
    return a.displayName || a.name || null;
  if ("string" === typeof a)
    return a;
  switch (a) {
    case Ia$1:
      return "Fragment";
    case Ha$1:
      return "Portal";
    case Ka$1:
      return "Profiler";
    case Ja$1:
      return "StrictMode";
    case Oa$1:
      return "Suspense";
    case Pa$1:
      return "SuspenseList";
  }
  if ("object" === typeof a)
    switch (a.$$typeof) {
      case Ma$1:
        return (a.displayName || "Context") + ".Consumer";
      case La$1:
        return (a._context.displayName || "Context") + ".Provider";
      case Na$1:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Qa$1:
        return b = a.displayName || null, null !== b ? b : Xa$1(a.type) || "Memo";
      case Ra$1:
        b = a._payload;
        a = a._init;
        try {
          return Xa$1(a(b));
        } catch (c) {
        }
    }
  return null;
}
function Za$1(a, b) {
  a = a.contextTypes;
  if (!a)
    return Ya$1;
  var c = {}, d;
  for (d in a)
    c[d] = b[d];
  return c;
}
function F(a, b) {
  if (a !== b) {
    a.context._currentValue2 = a.parentValue;
    a = a.parent;
    var c = b.parent;
    if (null === a) {
      if (null !== c)
        throw Error(l$2(401));
    } else {
      if (null === c)
        throw Error(l$2(401));
      F(a, c);
    }
    b.context._currentValue2 = b.value;
  }
}
function $a$1(a) {
  a.context._currentValue2 = a.parentValue;
  a = a.parent;
  null !== a && $a$1(a);
}
function ab$1(a) {
  var b = a.parent;
  null !== b && ab$1(b);
  a.context._currentValue2 = a.value;
}
function bb$1(a, b) {
  a.context._currentValue2 = a.parentValue;
  a = a.parent;
  if (null === a)
    throw Error(l$2(402));
  a.depth === b.depth ? F(a, b) : bb$1(a, b);
}
function cb$1(a, b) {
  var c = b.parent;
  if (null === c)
    throw Error(l$2(402));
  a.depth === c.depth ? F(a, c) : cb$1(a, c);
  b.context._currentValue2 = b.value;
}
function G(a) {
  var b = E$1;
  b !== a && (null === b ? ab$1(a) : null === a ? $a$1(b) : b.depth === a.depth ? F(b, a) : b.depth > a.depth ? bb$1(b, a) : cb$1(b, a), E$1 = a);
}
function eb$1(a, b, c, d) {
  var f = void 0 !== a.state ? a.state : null;
  a.updater = db$1;
  a.props = c;
  a.state = f;
  var e = { queue: [], replace: false };
  a._reactInternals = e;
  var g = b.contextType;
  a.context = "object" === typeof g && null !== g ? g._currentValue2 : d;
  g = b.getDerivedStateFromProps;
  "function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : B$1({}, f, g), a.state = f);
  if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount))
    if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && db$1.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length)
      if (b = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b.length)
        a.state = b[0];
      else {
        e = g ? b[0] : a.state;
        f = true;
        for (g = g ? 1 : 0; g < b.length; g++) {
          var h = b[g];
          h = "function" === typeof h ? h.call(a, e, c, d) : h;
          null != h && (f ? (f = false, e = B$1({}, e, h)) : B$1(e, h));
        }
        a.state = e;
      }
    else
      e.queue = null;
}
function gb$1(a, b, c) {
  var d = a.id;
  a = a.overflow;
  var f = 32 - H$1(d) - 1;
  d &= ~(1 << f);
  c += 1;
  var e = 32 - H$1(b) + f;
  if (30 < e) {
    var g = f - f % 5;
    e = (d & (1 << g) - 1).toString(32);
    d >>= g;
    f -= g;
    return { id: 1 << 32 - H$1(b) + f | c << f | d, overflow: e + a };
  }
  return { id: 1 << e | c << f | d, overflow: a };
}
function hb$1(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (ib$1(a) / jb$1 | 0) | 0;
}
function kb$1(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
function Q$1() {
  if (null === I$1)
    throw Error(l$2(321));
  return I$1;
}
function pb$1() {
  if (0 < P$1)
    throw Error(l$2(312));
  return { memoizedState: null, queue: null, next: null };
}
function qb$1() {
  null === K$1 ? null === J$1 ? (L$1 = false, J$1 = K$1 = pb$1()) : (L$1 = true, K$1 = J$1) : null === K$1.next ? (L$1 = false, K$1 = K$1.next = pb$1()) : (L$1 = true, K$1 = K$1.next);
  return K$1;
}
function rb$1() {
  ob$1 = I$1 = null;
  M$1 = false;
  J$1 = null;
  P$1 = 0;
  K$1 = O$1 = null;
}
function sb$1(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function tb$1(a, b, c) {
  I$1 = Q$1();
  K$1 = qb$1();
  if (L$1) {
    var d = K$1.queue;
    b = d.dispatch;
    if (null !== O$1 && (c = O$1.get(d), void 0 !== c)) {
      O$1.delete(d);
      d = K$1.memoizedState;
      do
        d = a(d, c.action), c = c.next;
      while (null !== c);
      K$1.memoizedState = d;
      return [d, b];
    }
    return [K$1.memoizedState, b];
  }
  a = a === sb$1 ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
  K$1.memoizedState = a;
  a = K$1.queue = { last: null, dispatch: null };
  a = a.dispatch = ub$1.bind(null, I$1, a);
  return [K$1.memoizedState, a];
}
function vb$1(a, b) {
  I$1 = Q$1();
  K$1 = qb$1();
  b = void 0 === b ? null : b;
  if (null !== K$1) {
    var c = K$1.memoizedState;
    if (null !== c && null !== b) {
      var d = c[1];
      a:
        if (null === d)
          d = false;
        else {
          for (var f = 0; f < d.length && f < b.length; f++)
            if (!lb$1(b[f], d[f])) {
              d = false;
              break a;
            }
          d = true;
        }
      if (d)
        return c[0];
    }
  }
  a = a();
  K$1.memoizedState = [a, b];
  return a;
}
function ub$1(a, b, c) {
  if (25 <= P$1)
    throw Error(l$2(301));
  if (a === I$1)
    if (M$1 = true, a = { action: c, next: null }, null === O$1 && (O$1 = /* @__PURE__ */ new Map()), c = O$1.get(b), void 0 === c)
      O$1.set(b, a);
    else {
      for (b = c; null !== b.next; )
        b = b.next;
      b.next = a;
    }
}
function wb$1() {
  throw Error(l$2(394));
}
function R$1() {
}
function zb$1(a) {
  console.error(a);
  return null;
}
function T$1() {
}
function Ab$1(a, b, c, d, f, e, g, h, k3) {
  var m = [], n2 = /* @__PURE__ */ new Set();
  b = { destination: null, responseState: b, progressiveChunkSize: void 0 === d ? 12800 : d, status: 0, fatalError: null, nextSegmentId: 0, allPendingTasks: 0, pendingRootTasks: 0, completedRootSegment: null, abortableTasks: n2, pingedTasks: m, clientRenderedBoundaries: [], completedBoundaries: [], partialBoundaries: [], onError: void 0 === f ? zb$1 : f, onAllReady: void 0 === e ? T$1 : e, onShellReady: void 0 === g ? T$1 : g, onShellError: void 0 === h ? T$1 : h, onFatalError: void 0 === k3 ? T$1 : k3 };
  c = U$1(b, 0, null, c, false, false);
  c.parentFlushed = true;
  a = Bb$1(b, a, null, c, n2, Ya$1, null, fb$1);
  m.push(a);
  return b;
}
function Bb$1(a, b, c, d, f, e, g, h) {
  a.allPendingTasks++;
  null === c ? a.pendingRootTasks++ : c.pendingTasks++;
  var k3 = { node: b, ping: function() {
    var b2 = a.pingedTasks;
    b2.push(k3);
    1 === b2.length && Cb$1(a);
  }, blockedBoundary: c, blockedSegment: d, abortSet: f, legacyContext: e, context: g, treeContext: h };
  f.add(k3);
  return k3;
}
function U$1(a, b, c, d, f, e) {
  return { status: 0, id: -1, index: b, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c, lastPushedText: f, textEmbedded: e };
}
function V$1(a, b) {
  a = a.onError(b);
  if (null != a && "string" !== typeof a)
    throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
  return a;
}
function W$1(a, b) {
  var c = a.onShellError;
  c(b);
  c = a.onFatalError;
  c(b);
  null !== a.destination ? (a.status = 2, a.destination.destroy(b)) : (a.status = 1, a.fatalError = b);
}
function Db$1(a, b, c, d, f) {
  I$1 = {};
  ob$1 = b;
  N$1 = 0;
  for (a = c(d, f); M$1; )
    M$1 = false, N$1 = 0, P$1 += 1, K$1 = null, a = c(d, f);
  rb$1();
  return a;
}
function Eb$1(a, b, c, d) {
  var f = c.render(), e = d.childContextTypes;
  if (null !== e && void 0 !== e) {
    var g = b.legacyContext;
    if ("function" !== typeof c.getChildContext)
      d = g;
    else {
      c = c.getChildContext();
      for (var h in c)
        if (!(h in e))
          throw Error(l$2(108, Xa$1(d) || "Unknown", h));
      d = B$1({}, g, c);
    }
    b.legacyContext = d;
    X$1(a, b, f);
    b.legacyContext = g;
  } else
    X$1(a, b, f);
}
function Fb(a, b) {
  if (a && a.defaultProps) {
    b = B$1({}, b);
    a = a.defaultProps;
    for (var c in a)
      void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Gb$1(a, b, c, d, f) {
  if ("function" === typeof c)
    if (c.prototype && c.prototype.isReactComponent) {
      f = Za$1(c, b.legacyContext);
      var e = c.contextType;
      e = new c(d, "object" === typeof e && null !== e ? e._currentValue2 : f);
      eb$1(e, c, d, f);
      Eb$1(a, b, e, c);
    } else {
      e = Za$1(c, b.legacyContext);
      f = Db$1(a, b, c, d, e);
      var g = 0 !== N$1;
      if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof)
        eb$1(f, c, d, e), Eb$1(a, b, f, c);
      else if (g) {
        d = b.treeContext;
        b.treeContext = gb$1(d, 1, 0);
        try {
          X$1(a, b, f);
        } finally {
          b.treeContext = d;
        }
      } else
        X$1(a, b, f);
    }
  else if ("string" === typeof c) {
    f = b.blockedSegment;
    e = ya$1(f.chunks, c, d, a.responseState, f.formatContext);
    f.lastPushedText = false;
    g = f.formatContext;
    f.formatContext = ra$1(g, c, d);
    Hb$1(a, b, e);
    f.formatContext = g;
    switch (c) {
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "input":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        break;
      default:
        f.chunks.push("</", c, ">");
    }
    f.lastPushedText = false;
  } else {
    switch (c) {
      case Ua$1:
      case Ta$1:
      case Ja$1:
      case Ka$1:
      case Ia$1:
        X$1(a, b, d.children);
        return;
      case Pa$1:
        X$1(a, b, d.children);
        return;
      case Sa$1:
        throw Error(l$2(343));
      case Oa$1:
        a: {
          c = b.blockedBoundary;
          f = b.blockedSegment;
          e = d.fallback;
          d = d.children;
          g = /* @__PURE__ */ new Set();
          var h = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, k3 = U$1(a, f.chunks.length, h, f.formatContext, false, false);
          f.children.push(k3);
          f.lastPushedText = false;
          var m = U$1(a, 0, null, f.formatContext, false, false);
          m.parentFlushed = true;
          b.blockedBoundary = h;
          b.blockedSegment = m;
          try {
            if (Hb$1(
              a,
              b,
              d
            ), a.responseState.generateStaticMarkup || m.lastPushedText && m.textEmbedded && m.chunks.push("<!-- -->"), m.status = 1, Y$1(h, m), 0 === h.pendingTasks)
              break a;
          } catch (n2) {
            m.status = 4, h.forceClientRender = true, h.errorDigest = V$1(a, n2);
          } finally {
            b.blockedBoundary = c, b.blockedSegment = f;
          }
          b = Bb$1(a, e, c, k3, g, b.legacyContext, b.context, b.treeContext);
          a.pingedTasks.push(b);
        }
        return;
    }
    if ("object" === typeof c && null !== c)
      switch (c.$$typeof) {
        case Na$1:
          d = Db$1(a, b, c.render, d, f);
          if (0 !== N$1) {
            c = b.treeContext;
            b.treeContext = gb$1(c, 1, 0);
            try {
              X$1(a, b, d);
            } finally {
              b.treeContext = c;
            }
          } else
            X$1(a, b, d);
          return;
        case Qa$1:
          c = c.type;
          d = Fb(c, d);
          Gb$1(a, b, c, d, f);
          return;
        case La$1:
          f = d.children;
          c = c._context;
          d = d.value;
          e = c._currentValue2;
          c._currentValue2 = d;
          g = E$1;
          E$1 = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c, parentValue: e, value: d };
          b.context = d;
          X$1(a, b, f);
          a = E$1;
          if (null === a)
            throw Error(l$2(403));
          d = a.parentValue;
          a.context._currentValue2 = d === Va$1 ? a.context._defaultValue : d;
          a = E$1 = a.parent;
          b.context = a;
          return;
        case Ma$1:
          d = d.children;
          d = d(c._currentValue2);
          X$1(a, b, d);
          return;
        case Ra$1:
          f = c._init;
          c = f(c._payload);
          d = Fb(c, d);
          Gb$1(
            a,
            b,
            c,
            d,
            void 0
          );
          return;
      }
    throw Error(l$2(130, null == c ? c : typeof c, ""));
  }
}
function X$1(a, b, c) {
  b.node = c;
  if ("object" === typeof c && null !== c) {
    switch (c.$$typeof) {
      case Ga$1:
        Gb$1(a, b, c.type, c.props, c.ref);
        return;
      case Ha$1:
        throw Error(l$2(257));
      case Ra$1:
        var d = c._init;
        c = d(c._payload);
        X$1(a, b, c);
        return;
    }
    if (qa$1(c)) {
      Ib$1(a, b, c);
      return;
    }
    null === c || "object" !== typeof c ? d = null : (d = Wa$1 && c[Wa$1] || c["@@iterator"], d = "function" === typeof d ? d : null);
    if (d && (d = d.call(c))) {
      c = d.next();
      if (!c.done) {
        var f = [];
        do
          f.push(c.value), c = d.next();
        while (!c.done);
        Ib$1(a, b, f);
      }
      return;
    }
    a = Object.prototype.toString.call(c);
    throw Error(l$2(31, "[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a));
  }
  "string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Fa$1(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Fa$1(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
}
function Ib$1(a, b, c) {
  for (var d = c.length, f = 0; f < d; f++) {
    var e = b.treeContext;
    b.treeContext = gb$1(e, d, f);
    try {
      Hb$1(a, b, c[f]);
    } finally {
      b.treeContext = e;
    }
  }
}
function Hb$1(a, b, c) {
  var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
  try {
    return X$1(a, b, c);
  } catch (k3) {
    if (rb$1(), "object" === typeof k3 && null !== k3 && "function" === typeof k3.then) {
      c = k3;
      var g = b.blockedSegment, h = U$1(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
      g.children.push(h);
      g.lastPushedText = false;
      a = Bb$1(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
      c.then(a, a);
      b.blockedSegment.formatContext = d;
      b.legacyContext = f;
      b.context = e;
      G(e);
    } else
      throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, G(e), k3;
  }
}
function Jb$1(a) {
  var b = a.blockedBoundary;
  a = a.blockedSegment;
  a.status = 3;
  Kb$1(this, b, a);
}
function Lb$1(a, b, c) {
  var d = a.blockedBoundary;
  a.blockedSegment.status = 3;
  null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.push(null))) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, a = void 0 === c ? Error(l$2(432)) : c, d.errorDigest = b.onError(a), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
    return Lb$1(a2, b, c);
  }), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (d = b.onAllReady, d()));
}
function Y$1(a, b) {
  if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
    var c = b.children[0];
    c.id = b.id;
    c.parentFlushed = true;
    1 === c.status && Y$1(a, c);
  } else
    a.completedSegments.push(b);
}
function Kb$1(a, b, c) {
  if (null === b) {
    if (c.parentFlushed) {
      if (null !== a.completedRootSegment)
        throw Error(l$2(389));
      a.completedRootSegment = c;
    }
    a.pendingRootTasks--;
    0 === a.pendingRootTasks && (a.onShellError = T$1, b = a.onShellReady, b());
  } else
    b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && Y$1(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(Jb$1, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (Y$1(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
  a.allPendingTasks--;
  0 === a.allPendingTasks && (a = a.onAllReady, a());
}
function Cb$1(a) {
  if (2 !== a.status) {
    var b = E$1, c = yb$1.current;
    yb$1.current = xb$1;
    var d = S$1;
    S$1 = a.responseState;
    try {
      var f = a.pingedTasks, e;
      for (e = 0; e < f.length; e++) {
        var g = f[e];
        var h = a, k3 = g.blockedSegment;
        if (0 === k3.status) {
          G(g.context);
          try {
            X$1(h, g, g.node), h.responseState.generateStaticMarkup || k3.lastPushedText && k3.textEmbedded && k3.chunks.push("<!-- -->"), g.abortSet.delete(g), k3.status = 1, Kb$1(h, g.blockedBoundary, k3);
          } catch (z2) {
            if (rb$1(), "object" === typeof z2 && null !== z2 && "function" === typeof z2.then) {
              var m = g.ping;
              z2.then(m, m);
            } else {
              g.abortSet.delete(g);
              k3.status = 4;
              var n2 = g.blockedBoundary, q2 = z2, C2 = V$1(h, q2);
              null === n2 ? W$1(h, q2) : (n2.pendingTasks--, n2.forceClientRender || (n2.forceClientRender = true, n2.errorDigest = C2, n2.parentFlushed && h.clientRenderedBoundaries.push(n2)));
              h.allPendingTasks--;
              if (0 === h.allPendingTasks) {
                var D3 = h.onAllReady;
                D3();
              }
            }
          } finally {
          }
        }
      }
      f.splice(0, e);
      null !== a.destination && Mb$1(a, a.destination);
    } catch (z2) {
      V$1(a, z2), W$1(a, z2);
    } finally {
      S$1 = d, yb$1.current = c, c === xb$1 && G(b);
    }
  }
}
function Z$1(a, b, c) {
  c.parentFlushed = true;
  switch (c.status) {
    case 0:
      var d = c.id = a.nextSegmentId++;
      c.lastPushedText = false;
      c.textEmbedded = false;
      a = a.responseState;
      b.push('<template id="');
      b.push(a.placeholderPrefix);
      a = d.toString(16);
      b.push(a);
      return b.push('"></template>');
    case 1:
      c.status = 2;
      var f = true;
      d = c.chunks;
      var e = 0;
      c = c.children;
      for (var g = 0; g < c.length; g++) {
        for (f = c[g]; e < f.index; e++)
          b.push(d[e]);
        f = Nb$1(a, b, f);
      }
      for (; e < d.length - 1; e++)
        b.push(d[e]);
      e < d.length && (f = b.push(d[e]));
      return f;
    default:
      throw Error(l$2(390));
  }
}
function Nb$1(a, b, c) {
  var d = c.boundary;
  if (null === d)
    return Z$1(a, b, c);
  d.parentFlushed = true;
  if (d.forceClientRender)
    return a.responseState.generateStaticMarkup || (d = d.errorDigest, b.push("<!--$!-->"), b.push("<template"), d && (b.push(' data-dgst="'), d = v(d), b.push(d), b.push('"')), b.push("></template>")), Z$1(a, b, c), a = a.responseState.generateStaticMarkup ? true : b.push("<!--/$-->"), a;
  if (0 < d.pendingTasks) {
    d.rootSegmentID = a.nextSegmentId++;
    0 < d.completedSegments.length && a.partialBoundaries.push(d);
    var f = a.responseState;
    var e = f.nextSuspenseID++;
    f = f.boundaryPrefix + e.toString(16);
    d = d.id = f;
    za$1(b, a.responseState, d);
    Z$1(a, b, c);
    return b.push("<!--/$-->");
  }
  if (d.byteSize > a.progressiveChunkSize)
    return d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), za$1(b, a.responseState, d.id), Z$1(a, b, c), b.push("<!--/$-->");
  a.responseState.generateStaticMarkup || b.push("<!--$-->");
  c = d.completedSegments;
  if (1 !== c.length)
    throw Error(l$2(391));
  Nb$1(a, b, c[0]);
  a = a.responseState.generateStaticMarkup ? true : b.push("<!--/$-->");
  return a;
}
function Ob$1(a, b, c) {
  Aa$1(b, a.responseState, c.formatContext, c.id);
  Nb$1(a, b, c);
  return Ba$1(b, c.formatContext);
}
function Pb$1(a, b, c) {
  for (var d = c.completedSegments, f = 0; f < d.length; f++)
    Qb$1(a, b, c, d[f]);
  d.length = 0;
  a = a.responseState;
  d = c.id;
  c = c.rootSegmentID;
  b.push(a.startInlineScript);
  a.sentCompleteBoundaryFunction ? b.push('$RC("') : (a.sentCompleteBoundaryFunction = true, b.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'));
  if (null === d)
    throw Error(l$2(395));
  c = c.toString(16);
  b.push(d);
  b.push('","');
  b.push(a.segmentPrefix);
  b.push(c);
  return b.push('")<\/script>');
}
function Qb$1(a, b, c, d) {
  if (2 === d.status)
    return true;
  var f = d.id;
  if (-1 === f) {
    if (-1 === (d.id = c.rootSegmentID))
      throw Error(l$2(392));
    return Ob$1(a, b, d);
  }
  Ob$1(a, b, d);
  a = a.responseState;
  b.push(a.startInlineScript);
  a.sentCompleteSegmentFunction ? b.push('$RS("') : (a.sentCompleteSegmentFunction = true, b.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'));
  b.push(a.segmentPrefix);
  f = f.toString(16);
  b.push(f);
  b.push('","');
  b.push(a.placeholderPrefix);
  b.push(f);
  return b.push('")<\/script>');
}
function Mb$1(a, b) {
  try {
    var c = a.completedRootSegment;
    if (null !== c && 0 === a.pendingRootTasks) {
      Nb$1(a, b, c);
      a.completedRootSegment = null;
      var d = a.responseState.bootstrapChunks;
      for (c = 0; c < d.length - 1; c++)
        b.push(d[c]);
      c < d.length && b.push(d[c]);
    }
    var f = a.clientRenderedBoundaries, e;
    for (e = 0; e < f.length; e++) {
      var g = f[e];
      d = b;
      var h = a.responseState, k3 = g.id, m = g.errorDigest, n2 = g.errorMessage, q2 = g.errorComponentStack;
      d.push(h.startInlineScript);
      h.sentClientRenderFunction ? d.push('$RX("') : (h.sentClientRenderFunction = true, d.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'));
      if (null === k3)
        throw Error(l$2(395));
      d.push(k3);
      d.push('"');
      if (m || n2 || q2) {
        d.push(",");
        var C2 = Da$1(m || "");
        d.push(C2);
      }
      if (n2 || q2) {
        d.push(",");
        var D3 = Da$1(n2 || "");
        d.push(D3);
      }
      if (q2) {
        d.push(",");
        var z2 = Da$1(q2);
        d.push(z2);
      }
      if (!d.push(")<\/script>")) {
        a.destination = null;
        e++;
        f.splice(0, e);
        return;
      }
    }
    f.splice(0, e);
    var ba2 = a.completedBoundaries;
    for (e = 0; e < ba2.length; e++)
      if (!Pb$1(a, b, ba2[e])) {
        a.destination = null;
        e++;
        ba2.splice(0, e);
        return;
      }
    ba2.splice(0, e);
    var ca3 = a.partialBoundaries;
    for (e = 0; e < ca3.length; e++) {
      var mb2 = ca3[e];
      a: {
        f = a;
        g = b;
        var da2 = mb2.completedSegments;
        for (h = 0; h < da2.length; h++)
          if (!Qb$1(f, g, mb2, da2[h])) {
            h++;
            da2.splice(0, h);
            var nb2 = false;
            break a;
          }
        da2.splice(0, h);
        nb2 = true;
      }
      if (!nb2) {
        a.destination = null;
        e++;
        ca3.splice(0, e);
        return;
      }
    }
    ca3.splice(0, e);
    var ea2 = a.completedBoundaries;
    for (e = 0; e < ea2.length; e++)
      if (!Pb$1(a, b, ea2[e])) {
        a.destination = null;
        e++;
        ea2.splice(0, e);
        return;
      }
    ea2.splice(0, e);
  } finally {
    0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.push(null);
  }
}
function Rb$1(a, b) {
  try {
    var c = a.abortableTasks;
    c.forEach(function(c2) {
      return Lb$1(c2, a, b);
    });
    c.clear();
    null !== a.destination && Mb$1(a, a.destination);
  } catch (d) {
    V$1(a, d), W$1(a, d);
  }
}
function Sb$1() {
}
function Tb$1(a, b, c, d) {
  var f = false, e = null, g = "", h = { push: function(a2) {
    null !== a2 && (g += a2);
    return true;
  }, destroy: function(a2) {
    f = true;
    e = a2;
  } }, k3 = false;
  a = Ab$1(a, Ea$1(c, b ? b.identifierPrefix : void 0), { insertionMode: 1, selectedValue: null }, Infinity, Sb$1, void 0, function() {
    k3 = true;
  }, void 0, void 0);
  Cb$1(a);
  Rb$1(a, d);
  if (1 === a.status)
    a.status = 2, h.destroy(a.fatalError);
  else if (2 !== a.status && null === a.destination) {
    a.destination = h;
    try {
      Mb$1(a, h);
    } catch (m) {
      V$1(a, m), W$1(a, m);
    }
  }
  if (f)
    throw e;
  if (!k3)
    throw Error(l$2(426));
  return g;
}
function k2(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
    b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function p(a, b) {
  if (0 !== b.length)
    if (512 < b.length)
      0 < n && (a.enqueue(new Uint8Array(l$1.buffer, 0, n)), l$1 = new Uint8Array(512), n = 0), a.enqueue(b);
    else {
      var c = l$1.length - n;
      c < b.length && (0 === c ? a.enqueue(l$1) : (l$1.set(b.subarray(0, c), n), a.enqueue(l$1), b = b.subarray(c)), l$1 = new Uint8Array(512), n = 0);
      l$1.set(b, n);
      n += b.length;
    }
}
function t(a, b) {
  p(a, b);
  return true;
}
function ba(a) {
  l$1 && 0 < n && (a.enqueue(new Uint8Array(l$1.buffer, 0, n)), l$1 = null, n = 0);
}
function u(a) {
  return ca2.encode(a);
}
function w2(a) {
  return ca2.encode(a);
}
function da(a, b) {
  "function" === typeof a.error ? a.error(b) : a.close();
}
function ia(a) {
  if (x2.call(ha, a))
    return true;
  if (x2.call(fa, a))
    return false;
  if (ea.test(a))
    return ha[a] = true;
  fa[a] = true;
  return false;
}
function y(a, b, c, d, f, e, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = f;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = e;
  this.removeEmptyString = g;
}
function ka(a) {
  return a[1].toUpperCase();
}
function C(a) {
  if ("boolean" === typeof a || "number" === typeof a)
    return "" + a;
  a = "" + a;
  var b = oa.exec(a);
  if (b) {
    var c = "", d, f = 0;
    for (d = b.index; d < a.length; d++) {
      switch (a.charCodeAt(d)) {
        case 34:
          b = "&quot;";
          break;
        case 38:
          b = "&amp;";
          break;
        case 39:
          b = "&#x27;";
          break;
        case 60:
          b = "&lt;";
          break;
        case 62:
          b = "&gt;";
          break;
        default:
          continue;
      }
      f !== d && (c += a.substring(f, d));
      f = d + 1;
      c += b;
    }
    a = f !== d ? c + a.substring(f, d) : c;
  }
  return a;
}
function ya(a, b, c, d) {
  return "" + b + ("s" === c ? "\\u0073" : "\\u0053") + d;
}
function za(a, b, c, d, f) {
  a = void 0 === a ? "" : a;
  b = void 0 === b ? sa : w2('<script nonce="' + C(b) + '">');
  var e = [];
  void 0 !== c && e.push(b, u(("" + c).replace(xa, ya)), ta);
  if (void 0 !== d)
    for (c = 0; c < d.length; c++)
      e.push(ua, u(C(d[c])), wa);
  if (void 0 !== f)
    for (d = 0; d < f.length; d++)
      e.push(va, u(C(f[d])), wa);
  return { bootstrapChunks: e, startInlineScript: b, placeholderPrefix: w2(a + "P:"), segmentPrefix: w2(a + "S:"), boundaryPrefix: a + "B:", idPrefix: a, nextSuspenseID: 0, sentCompleteSegmentFunction: false, sentCompleteBoundaryFunction: false, sentClientRenderFunction: false };
}
function D2(a, b) {
  return { insertionMode: a, selectedValue: b };
}
function Aa(a) {
  return D2("http://www.w3.org/2000/svg" === a ? 2 : "http://www.w3.org/1998/Math/MathML" === a ? 3 : 0, null);
}
function Ba(a, b, c) {
  switch (b) {
    case "select":
      return D2(1, null != c.value ? c.value : c.defaultValue);
    case "svg":
      return D2(2, null);
    case "math":
      return D2(3, null);
    case "foreignObject":
      return D2(1, null);
    case "table":
      return D2(4, null);
    case "thead":
    case "tbody":
    case "tfoot":
      return D2(5, null);
    case "colgroup":
      return D2(7, null);
    case "tr":
      return D2(6, null);
  }
  return 4 <= a.insertionMode || 0 === a.insertionMode ? D2(1, null) : a;
}
function Da(a, b, c, d) {
  if ("" === b)
    return d;
  d && a.push(Ca);
  a.push(u(C(b)));
  return true;
}
function Ia(a, b, c) {
  if ("object" !== typeof c)
    throw Error(k2(62));
  b = true;
  for (var d in c)
    if (x2.call(c, d)) {
      var f = c[d];
      if (null != f && "boolean" !== typeof f && "" !== f) {
        if (0 === d.indexOf("--")) {
          var e = u(C(d));
          f = u(C(("" + f).trim()));
        } else {
          e = d;
          var g = Ea.get(e);
          void 0 !== g ? e = g : (g = w2(C(e.replace(pa, "-$1").toLowerCase().replace(qa, "-ms-"))), Ea.set(e, g), e = g);
          f = "number" === typeof f ? 0 === f || x2.call(B, d) ? u("" + f) : u(f + "px") : u(C(("" + f).trim()));
        }
        b ? (b = false, a.push(Fa, e, Ga, f)) : a.push(Ha, e, Ga, f);
      }
    }
  b || a.push(E);
}
function J(a, b, c, d) {
  switch (c) {
    case "style":
      Ia(a, b, d);
      return;
    case "defaultValue":
    case "defaultChecked":
    case "innerHTML":
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
      return;
  }
  if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
    if (b = z.hasOwnProperty(c) ? z[c] : null, null !== b) {
      switch (typeof d) {
        case "function":
        case "symbol":
          return;
        case "boolean":
          if (!b.acceptsBooleans)
            return;
      }
      c = u(b.attributeName);
      switch (b.type) {
        case 3:
          d && a.push(H, c, Ja);
          break;
        case 4:
          true === d ? a.push(H, c, Ja) : false !== d && a.push(H, c, I, u(C(d)), E);
          break;
        case 5:
          isNaN(d) || a.push(H, c, I, u(C(d)), E);
          break;
        case 6:
          !isNaN(d) && 1 <= d && a.push(H, c, I, u(C(d)), E);
          break;
        default:
          b.sanitizeURL && (d = "" + d), a.push(H, c, I, u(C(d)), E);
      }
    } else if (ia(c)) {
      switch (typeof d) {
        case "function":
        case "symbol":
          return;
        case "boolean":
          if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b)
            return;
      }
      a.push(H, u(c), I, u(C(d)), E);
    }
  }
}
function L(a, b, c) {
  if (null != b) {
    if (null != c)
      throw Error(k2(60));
    if ("object" !== typeof b || !("__html" in b))
      throw Error(k2(61));
    b = b.__html;
    null !== b && void 0 !== b && a.push(u("" + b));
  }
}
function La(a) {
  var b = "";
  aa.Children.forEach(a, function(a2) {
    null != a2 && (b += a2);
  });
  return b;
}
function Na(a, b, c, d) {
  a.push(M(c));
  var f = c = null, e;
  for (e in b)
    if (x2.call(b, e)) {
      var g = b[e];
      if (null != g)
        switch (e) {
          case "children":
            c = g;
            break;
          case "dangerouslySetInnerHTML":
            f = g;
            break;
          default:
            J(a, d, e, g);
        }
    }
  a.push(K);
  L(a, f, c);
  return "string" === typeof c ? (a.push(u(C(c))), null) : c;
}
function M(a) {
  var b = Qa.get(a);
  if (void 0 === b) {
    if (!Pa.test(a))
      throw Error(k2(65, a));
    b = w2("<" + a);
    Qa.set(a, b);
  }
  return b;
}
function Sa(a, b, c, d, f) {
  switch (b) {
    case "select":
      a.push(M("select"));
      var e = null, g = null;
      for (r3 in c)
        if (x2.call(c, r3)) {
          var h = c[r3];
          if (null != h)
            switch (r3) {
              case "children":
                e = h;
                break;
              case "dangerouslySetInnerHTML":
                g = h;
                break;
              case "defaultValue":
              case "value":
                break;
              default:
                J(a, d, r3, h);
            }
        }
      a.push(K);
      L(a, g, e);
      return e;
    case "option":
      g = f.selectedValue;
      a.push(M("option"));
      var m = h = null, q2 = null;
      var r3 = null;
      for (e in c)
        if (x2.call(c, e)) {
          var v2 = c[e];
          if (null != v2)
            switch (e) {
              case "children":
                h = v2;
                break;
              case "selected":
                q2 = v2;
                break;
              case "dangerouslySetInnerHTML":
                r3 = v2;
                break;
              case "value":
                m = v2;
              default:
                J(a, d, e, v2);
            }
        }
      if (null != g)
        if (c = null !== m ? "" + m : La(h), ra(g))
          for (d = 0; d < g.length; d++) {
            if ("" + g[d] === c) {
              a.push(Ma);
              break;
            }
          }
        else
          "" + g === c && a.push(Ma);
      else
        q2 && a.push(Ma);
      a.push(K);
      L(a, r3, h);
      return h;
    case "textarea":
      a.push(M("textarea"));
      r3 = g = e = null;
      for (h in c)
        if (x2.call(c, h) && (m = c[h], null != m))
          switch (h) {
            case "children":
              r3 = m;
              break;
            case "value":
              e = m;
              break;
            case "defaultValue":
              g = m;
              break;
            case "dangerouslySetInnerHTML":
              throw Error(k2(91));
            default:
              J(a, d, h, m);
          }
      null === e && null !== g && (e = g);
      a.push(K);
      if (null != r3) {
        if (null != e)
          throw Error(k2(92));
        if (ra(r3) && 1 < r3.length)
          throw Error(k2(93));
        e = "" + r3;
      }
      "string" === typeof e && "\n" === e[0] && a.push(Oa);
      null !== e && a.push(u(C("" + e)));
      return null;
    case "input":
      a.push(M("input"));
      m = r3 = h = e = null;
      for (g in c)
        if (x2.call(c, g) && (q2 = c[g], null != q2))
          switch (g) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(k2(399, "input"));
            case "defaultChecked":
              m = q2;
              break;
            case "defaultValue":
              h = q2;
              break;
            case "checked":
              r3 = q2;
              break;
            case "value":
              e = q2;
              break;
            default:
              J(a, d, g, q2);
          }
      null !== r3 ? J(
        a,
        d,
        "checked",
        r3
      ) : null !== m && J(a, d, "checked", m);
      null !== e ? J(a, d, "value", e) : null !== h && J(a, d, "value", h);
      a.push(Ka);
      return null;
    case "menuitem":
      a.push(M("menuitem"));
      for (var A2 in c)
        if (x2.call(c, A2) && (e = c[A2], null != e))
          switch (A2) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(k2(400));
            default:
              J(a, d, A2, e);
          }
      a.push(K);
      return null;
    case "title":
      a.push(M("title"));
      e = null;
      for (v2 in c)
        if (x2.call(c, v2) && (g = c[v2], null != g))
          switch (v2) {
            case "children":
              e = g;
              break;
            case "dangerouslySetInnerHTML":
              throw Error(k2(434));
            default:
              J(a, d, v2, g);
          }
      a.push(K);
      return e;
    case "listing":
    case "pre":
      a.push(M(b));
      g = e = null;
      for (m in c)
        if (x2.call(c, m) && (h = c[m], null != h))
          switch (m) {
            case "children":
              e = h;
              break;
            case "dangerouslySetInnerHTML":
              g = h;
              break;
            default:
              J(a, d, m, h);
          }
      a.push(K);
      if (null != g) {
        if (null != e)
          throw Error(k2(60));
        if ("object" !== typeof g || !("__html" in g))
          throw Error(k2(61));
        c = g.__html;
        null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push(Oa, u(c)) : a.push(u("" + c)));
      }
      "string" === typeof e && "\n" === e[0] && a.push(Oa);
      return e;
    case "area":
    case "base":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "img":
    case "keygen":
    case "link":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "wbr":
      a.push(M(b));
      for (var F2 in c)
        if (x2.call(c, F2) && (e = c[F2], null != e))
          switch (F2) {
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(k2(399, b));
            default:
              J(a, d, F2, e);
          }
      a.push(Ka);
      return null;
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return Na(a, c, b, d);
    case "html":
      return 0 === f.insertionMode && a.push(Ra), Na(a, c, b, d);
    default:
      if (-1 === b.indexOf("-") && "string" !== typeof c.is)
        return Na(a, c, b, d);
      a.push(M(b));
      g = e = null;
      for (q2 in c)
        if (x2.call(c, q2) && (h = c[q2], null != h))
          switch (q2) {
            case "children":
              e = h;
              break;
            case "dangerouslySetInnerHTML":
              g = h;
              break;
            case "style":
              Ia(a, d, h);
              break;
            case "suppressContentEditableWarning":
            case "suppressHydrationWarning":
              break;
            default:
              ia(q2) && "function" !== typeof h && "symbol" !== typeof h && a.push(H, u(q2), I, u(C(h)), E);
          }
      a.push(K);
      L(a, g, e);
      return e;
  }
}
function fb(a, b, c) {
  p(a, Ya);
  if (null === c)
    throw Error(k2(395));
  p(a, c);
  return t(a, Za);
}
function Bb(a, b, c, d) {
  switch (c.insertionMode) {
    case 0:
    case 1:
      return p(a, gb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, hb);
    case 2:
      return p(a, jb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, kb);
    case 3:
      return p(a, mb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, nb);
    case 4:
      return p(a, pb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, qb);
    case 5:
      return p(a, sb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, tb);
    case 6:
      return p(a, vb), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, wb);
    case 7:
      return p(
        a,
        yb
      ), p(a, b.segmentPrefix), p(a, u(d.toString(16))), t(a, zb);
    default:
      throw Error(k2(397));
  }
}
function Cb(a, b) {
  switch (b.insertionMode) {
    case 0:
    case 1:
      return t(a, ib);
    case 2:
      return t(a, lb);
    case 3:
      return t(a, ob);
    case 4:
      return t(a, rb);
    case 5:
      return t(a, ub);
    case 6:
      return t(a, xb);
    case 7:
      return t(a, Ab);
    default:
      throw Error(k2(397));
  }
}
function Sb(a) {
  return JSON.stringify(a).replace(Rb, function(a2) {
    switch (a2) {
      case "<":
        return "\\u003c";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
    }
  });
}
function jc(a) {
  if (null == a)
    return null;
  if ("function" === typeof a)
    return a.displayName || a.name || null;
  if ("string" === typeof a)
    return a;
  switch (a) {
    case Vb:
      return "Fragment";
    case Ub:
      return "Portal";
    case Xb:
      return "Profiler";
    case Wb:
      return "StrictMode";
    case ac:
      return "Suspense";
    case bc:
      return "SuspenseList";
  }
  if ("object" === typeof a)
    switch (a.$$typeof) {
      case Zb:
        return (a.displayName || "Context") + ".Consumer";
      case Yb:
        return (a._context.displayName || "Context") + ".Provider";
      case $b:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case cc:
        return b = a.displayName || null, null !== b ? b : jc(a.type) || "Memo";
      case dc:
        b = a._payload;
        a = a._init;
        try {
          return jc(a(b));
        } catch (c) {
        }
    }
  return null;
}
function lc(a, b) {
  a = a.contextTypes;
  if (!a)
    return kc;
  var c = {}, d;
  for (d in a)
    c[d] = b[d];
  return c;
}
function P2(a, b) {
  if (a !== b) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    var c = b.parent;
    if (null === a) {
      if (null !== c)
        throw Error(k2(401));
    } else {
      if (null === c)
        throw Error(k2(401));
      P2(a, c);
    }
    b.context._currentValue = b.value;
  }
}
function mc(a) {
  a.context._currentValue = a.parentValue;
  a = a.parent;
  null !== a && mc(a);
}
function nc(a) {
  var b = a.parent;
  null !== b && nc(b);
  a.context._currentValue = a.value;
}
function oc(a, b) {
  a.context._currentValue = a.parentValue;
  a = a.parent;
  if (null === a)
    throw Error(k2(402));
  a.depth === b.depth ? P2(a, b) : oc(a, b);
}
function pc(a, b) {
  var c = b.parent;
  if (null === c)
    throw Error(k2(402));
  a.depth === c.depth ? P2(a, c) : pc(a, c);
  b.context._currentValue = b.value;
}
function Q(a) {
  var b = O;
  b !== a && (null === b ? nc(a) : null === a ? mc(b) : b.depth === a.depth ? P2(b, a) : b.depth > a.depth ? oc(b, a) : pc(b, a), O = a);
}
function rc(a, b, c, d) {
  var f = void 0 !== a.state ? a.state : null;
  a.updater = qc;
  a.props = c;
  a.state = f;
  var e = { queue: [], replace: false };
  a._reactInternals = e;
  var g = b.contextType;
  a.context = "object" === typeof g && null !== g ? g._currentValue : d;
  g = b.getDerivedStateFromProps;
  "function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : N({}, f, g), a.state = f);
  if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount))
    if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && qc.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length)
      if (b = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b.length)
        a.state = b[0];
      else {
        e = g ? b[0] : a.state;
        f = true;
        for (g = g ? 1 : 0; g < b.length; g++) {
          var h = b[g];
          h = "function" === typeof h ? h.call(a, e, c, d) : h;
          null != h && (f ? (f = false, e = N({}, e, h)) : N(e, h));
        }
        a.state = e;
      }
    else
      e.queue = null;
}
function tc(a, b, c) {
  var d = a.id;
  a = a.overflow;
  var f = 32 - uc(d) - 1;
  d &= ~(1 << f);
  c += 1;
  var e = 32 - uc(b) + f;
  if (30 < e) {
    var g = f - f % 5;
    e = (d & (1 << g) - 1).toString(32);
    d >>= g;
    f -= g;
    return { id: 1 << 32 - uc(b) + f | c << f | d, overflow: e + a };
  }
  return { id: 1 << e | c << f | d, overflow: a };
}
function vc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (wc(a) / xc | 0) | 0;
}
function yc(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
function W() {
  if (null === R2)
    throw Error(k2(321));
  return R2;
}
function Ec() {
  if (0 < Dc)
    throw Error(k2(312));
  return { memoizedState: null, queue: null, next: null };
}
function Fc() {
  null === S ? null === Bc ? (T = false, Bc = S = Ec()) : (T = true, S = Bc) : null === S.next ? (T = false, S = S.next = Ec()) : (T = true, S = S.next);
  return S;
}
function Gc() {
  Ac = R2 = null;
  Cc = false;
  Bc = null;
  Dc = 0;
  S = V = null;
}
function Hc(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Ic(a, b, c) {
  R2 = W();
  S = Fc();
  if (T) {
    var d = S.queue;
    b = d.dispatch;
    if (null !== V && (c = V.get(d), void 0 !== c)) {
      V.delete(d);
      d = S.memoizedState;
      do
        d = a(d, c.action), c = c.next;
      while (null !== c);
      S.memoizedState = d;
      return [d, b];
    }
    return [S.memoizedState, b];
  }
  a = a === Hc ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
  S.memoizedState = a;
  a = S.queue = { last: null, dispatch: null };
  a = a.dispatch = Jc.bind(null, R2, a);
  return [S.memoizedState, a];
}
function Kc(a, b) {
  R2 = W();
  S = Fc();
  b = void 0 === b ? null : b;
  if (null !== S) {
    var c = S.memoizedState;
    if (null !== c && null !== b) {
      var d = c[1];
      a:
        if (null === d)
          d = false;
        else {
          for (var f = 0; f < d.length && f < b.length; f++)
            if (!zc(b[f], d[f])) {
              d = false;
              break a;
            }
          d = true;
        }
      if (d)
        return c[0];
    }
  }
  a = a();
  S.memoizedState = [a, b];
  return a;
}
function Jc(a, b, c) {
  if (25 <= Dc)
    throw Error(k2(301));
  if (a === R2)
    if (Cc = true, a = { action: c, next: null }, null === V && (V = /* @__PURE__ */ new Map()), c = V.get(b), void 0 === c)
      V.set(b, a);
    else {
      for (b = c; null !== b.next; )
        b = b.next;
      b.next = a;
    }
}
function Lc() {
  throw Error(k2(394));
}
function Mc() {
}
function Qc(a) {
  console.error(a);
  return null;
}
function X() {
}
function Rc(a, b, c, d, f, e, g, h, m) {
  var q2 = [], r3 = /* @__PURE__ */ new Set();
  b = { destination: null, responseState: b, progressiveChunkSize: void 0 === d ? 12800 : d, status: 0, fatalError: null, nextSegmentId: 0, allPendingTasks: 0, pendingRootTasks: 0, completedRootSegment: null, abortableTasks: r3, pingedTasks: q2, clientRenderedBoundaries: [], completedBoundaries: [], partialBoundaries: [], onError: void 0 === f ? Qc : f, onAllReady: void 0 === e ? X : e, onShellReady: void 0 === g ? X : g, onShellError: void 0 === h ? X : h, onFatalError: void 0 === m ? X : m };
  c = Sc(b, 0, null, c, false, false);
  c.parentFlushed = true;
  a = Tc(b, a, null, c, r3, kc, null, sc);
  q2.push(a);
  return b;
}
function Tc(a, b, c, d, f, e, g, h) {
  a.allPendingTasks++;
  null === c ? a.pendingRootTasks++ : c.pendingTasks++;
  var m = { node: b, ping: function() {
    var b2 = a.pingedTasks;
    b2.push(m);
    1 === b2.length && Uc(a);
  }, blockedBoundary: c, blockedSegment: d, abortSet: f, legacyContext: e, context: g, treeContext: h };
  f.add(m);
  return m;
}
function Sc(a, b, c, d, f, e) {
  return { status: 0, id: -1, index: b, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c, lastPushedText: f, textEmbedded: e };
}
function Y(a, b) {
  a = a.onError(b);
  if (null != a && "string" !== typeof a)
    throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
  return a;
}
function Vc(a, b) {
  var c = a.onShellError;
  c(b);
  c = a.onFatalError;
  c(b);
  null !== a.destination ? (a.status = 2, da(a.destination, b)) : (a.status = 1, a.fatalError = b);
}
function Wc(a, b, c, d, f) {
  R2 = {};
  Ac = b;
  U = 0;
  for (a = c(d, f); Cc; )
    Cc = false, U = 0, Dc += 1, S = null, a = c(d, f);
  Gc();
  return a;
}
function Xc(a, b, c, d) {
  var f = c.render(), e = d.childContextTypes;
  if (null !== e && void 0 !== e) {
    var g = b.legacyContext;
    if ("function" !== typeof c.getChildContext)
      d = g;
    else {
      c = c.getChildContext();
      for (var h in c)
        if (!(h in e))
          throw Error(k2(108, jc(d) || "Unknown", h));
      d = N({}, g, c);
    }
    b.legacyContext = d;
    Z(a, b, f);
    b.legacyContext = g;
  } else
    Z(a, b, f);
}
function Yc(a, b) {
  if (a && a.defaultProps) {
    b = N({}, b);
    a = a.defaultProps;
    for (var c in a)
      void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Zc(a, b, c, d, f) {
  if ("function" === typeof c)
    if (c.prototype && c.prototype.isReactComponent) {
      f = lc(c, b.legacyContext);
      var e = c.contextType;
      e = new c(d, "object" === typeof e && null !== e ? e._currentValue : f);
      rc(e, c, d, f);
      Xc(a, b, e, c);
    } else {
      e = lc(c, b.legacyContext);
      f = Wc(a, b, c, d, e);
      var g = 0 !== U;
      if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof)
        rc(f, c, d, e), Xc(a, b, f, c);
      else if (g) {
        d = b.treeContext;
        b.treeContext = tc(d, 1, 0);
        try {
          Z(a, b, f);
        } finally {
          b.treeContext = d;
        }
      } else
        Z(a, b, f);
    }
  else if ("string" === typeof c) {
    f = b.blockedSegment;
    e = Sa(f.chunks, c, d, a.responseState, f.formatContext);
    f.lastPushedText = false;
    g = f.formatContext;
    f.formatContext = Ba(g, c, d);
    $c(a, b, e);
    f.formatContext = g;
    switch (c) {
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "input":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        break;
      default:
        f.chunks.push(Ta, u(c), Ua);
    }
    f.lastPushedText = false;
  } else {
    switch (c) {
      case gc:
      case fc:
      case Wb:
      case Xb:
      case Vb:
        Z(a, b, d.children);
        return;
      case bc:
        Z(a, b, d.children);
        return;
      case ec:
        throw Error(k2(343));
      case ac:
        a: {
          c = b.blockedBoundary;
          f = b.blockedSegment;
          e = d.fallback;
          d = d.children;
          g = /* @__PURE__ */ new Set();
          var h = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, m = Sc(a, f.chunks.length, h, f.formatContext, false, false);
          f.children.push(m);
          f.lastPushedText = false;
          var q2 = Sc(a, 0, null, f.formatContext, false, false);
          q2.parentFlushed = true;
          b.blockedBoundary = h;
          b.blockedSegment = q2;
          try {
            if ($c(
              a,
              b,
              d
            ), q2.lastPushedText && q2.textEmbedded && q2.chunks.push(Ca), q2.status = 1, ad(h, q2), 0 === h.pendingTasks)
              break a;
          } catch (r3) {
            q2.status = 4, h.forceClientRender = true, h.errorDigest = Y(a, r3);
          } finally {
            b.blockedBoundary = c, b.blockedSegment = f;
          }
          b = Tc(a, e, c, m, g, b.legacyContext, b.context, b.treeContext);
          a.pingedTasks.push(b);
        }
        return;
    }
    if ("object" === typeof c && null !== c)
      switch (c.$$typeof) {
        case $b:
          d = Wc(a, b, c.render, d, f);
          if (0 !== U) {
            c = b.treeContext;
            b.treeContext = tc(c, 1, 0);
            try {
              Z(a, b, d);
            } finally {
              b.treeContext = c;
            }
          } else
            Z(a, b, d);
          return;
        case cc:
          c = c.type;
          d = Yc(c, d);
          Zc(a, b, c, d, f);
          return;
        case Yb:
          f = d.children;
          c = c._context;
          d = d.value;
          e = c._currentValue;
          c._currentValue = d;
          g = O;
          O = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c, parentValue: e, value: d };
          b.context = d;
          Z(a, b, f);
          a = O;
          if (null === a)
            throw Error(k2(403));
          d = a.parentValue;
          a.context._currentValue = d === hc ? a.context._defaultValue : d;
          a = O = a.parent;
          b.context = a;
          return;
        case Zb:
          d = d.children;
          d = d(c._currentValue);
          Z(a, b, d);
          return;
        case dc:
          f = c._init;
          c = f(c._payload);
          d = Yc(c, d);
          Zc(a, b, c, d, void 0);
          return;
      }
    throw Error(k2(
      130,
      null == c ? c : typeof c,
      ""
    ));
  }
}
function Z(a, b, c) {
  b.node = c;
  if ("object" === typeof c && null !== c) {
    switch (c.$$typeof) {
      case Tb:
        Zc(a, b, c.type, c.props, c.ref);
        return;
      case Ub:
        throw Error(k2(257));
      case dc:
        var d = c._init;
        c = d(c._payload);
        Z(a, b, c);
        return;
    }
    if (ra(c)) {
      bd(a, b, c);
      return;
    }
    null === c || "object" !== typeof c ? d = null : (d = ic && c[ic] || c["@@iterator"], d = "function" === typeof d ? d : null);
    if (d && (d = d.call(c))) {
      c = d.next();
      if (!c.done) {
        var f = [];
        do
          f.push(c.value), c = d.next();
        while (!c.done);
        bd(a, b, f);
      }
      return;
    }
    a = Object.prototype.toString.call(c);
    throw Error(k2(31, "[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a));
  }
  "string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Da(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Da(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
}
function bd(a, b, c) {
  for (var d = c.length, f = 0; f < d; f++) {
    var e = b.treeContext;
    b.treeContext = tc(e, d, f);
    try {
      $c(a, b, c[f]);
    } finally {
      b.treeContext = e;
    }
  }
}
function $c(a, b, c) {
  var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
  try {
    return Z(a, b, c);
  } catch (m) {
    if (Gc(), "object" === typeof m && null !== m && "function" === typeof m.then) {
      c = m;
      var g = b.blockedSegment, h = Sc(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
      g.children.push(h);
      g.lastPushedText = false;
      a = Tc(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
      c.then(a, a);
      b.blockedSegment.formatContext = d;
      b.legacyContext = f;
      b.context = e;
      Q(e);
    } else
      throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, Q(e), m;
  }
}
function cd(a) {
  var b = a.blockedBoundary;
  a = a.blockedSegment;
  a.status = 3;
  dd(this, b, a);
}
function ed(a, b, c) {
  var d = a.blockedBoundary;
  a.blockedSegment.status = 3;
  null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.close())) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, a = void 0 === c ? Error(k2(432)) : c, d.errorDigest = b.onError(a), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
    return ed(a2, b, c);
  }), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (d = b.onAllReady, d()));
}
function ad(a, b) {
  if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
    var c = b.children[0];
    c.id = b.id;
    c.parentFlushed = true;
    1 === c.status && ad(a, c);
  } else
    a.completedSegments.push(b);
}
function dd(a, b, c) {
  if (null === b) {
    if (c.parentFlushed) {
      if (null !== a.completedRootSegment)
        throw Error(k2(389));
      a.completedRootSegment = c;
    }
    a.pendingRootTasks--;
    0 === a.pendingRootTasks && (a.onShellError = X, b = a.onShellReady, b());
  } else
    b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && ad(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(cd, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (ad(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
  a.allPendingTasks--;
  0 === a.allPendingTasks && (a = a.onAllReady, a());
}
function Uc(a) {
  if (2 !== a.status) {
    var b = O, c = Pc.current;
    Pc.current = Oc;
    var d = Nc;
    Nc = a.responseState;
    try {
      var f = a.pingedTasks, e;
      for (e = 0; e < f.length; e++) {
        var g = f[e];
        var h = a, m = g.blockedSegment;
        if (0 === m.status) {
          Q(g.context);
          try {
            Z(h, g, g.node), m.lastPushedText && m.textEmbedded && m.chunks.push(Ca), g.abortSet.delete(g), m.status = 1, dd(h, g.blockedBoundary, m);
          } catch (G2) {
            if (Gc(), "object" === typeof G2 && null !== G2 && "function" === typeof G2.then) {
              var q2 = g.ping;
              G2.then(q2, q2);
            } else {
              g.abortSet.delete(g);
              m.status = 4;
              var r3 = g.blockedBoundary, v2 = G2, A2 = Y(h, v2);
              null === r3 ? Vc(h, v2) : (r3.pendingTasks--, r3.forceClientRender || (r3.forceClientRender = true, r3.errorDigest = A2, r3.parentFlushed && h.clientRenderedBoundaries.push(r3)));
              h.allPendingTasks--;
              if (0 === h.allPendingTasks) {
                var F2 = h.onAllReady;
                F2();
              }
            }
          } finally {
          }
        }
      }
      f.splice(0, e);
      null !== a.destination && fd(a, a.destination);
    } catch (G2) {
      Y(a, G2), Vc(a, G2);
    } finally {
      Nc = d, Pc.current = c, c === Oc && Q(b);
    }
  }
}
function gd(a, b, c) {
  c.parentFlushed = true;
  switch (c.status) {
    case 0:
      var d = c.id = a.nextSegmentId++;
      c.lastPushedText = false;
      c.textEmbedded = false;
      a = a.responseState;
      p(b, Va);
      p(b, a.placeholderPrefix);
      a = u(d.toString(16));
      p(b, a);
      return t(b, Wa);
    case 1:
      c.status = 2;
      var f = true;
      d = c.chunks;
      var e = 0;
      c = c.children;
      for (var g = 0; g < c.length; g++) {
        for (f = c[g]; e < f.index; e++)
          p(b, d[e]);
        f = hd(a, b, f);
      }
      for (; e < d.length - 1; e++)
        p(b, d[e]);
      e < d.length && (f = t(b, d[e]));
      return f;
    default:
      throw Error(k2(390));
  }
}
function hd(a, b, c) {
  var d = c.boundary;
  if (null === d)
    return gd(a, b, c);
  d.parentFlushed = true;
  if (d.forceClientRender)
    d = d.errorDigest, t(b, $a), p(b, bb), d && (p(b, db), p(b, u(C(d))), p(b, cb)), t(b, eb), gd(a, b, c);
  else if (0 < d.pendingTasks) {
    d.rootSegmentID = a.nextSegmentId++;
    0 < d.completedSegments.length && a.partialBoundaries.push(d);
    var f = a.responseState;
    var e = f.nextSuspenseID++;
    f = w2(f.boundaryPrefix + e.toString(16));
    d = d.id = f;
    fb(b, a.responseState, d);
    gd(a, b, c);
  } else if (d.byteSize > a.progressiveChunkSize)
    d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), fb(b, a.responseState, d.id), gd(a, b, c);
  else {
    t(b, Xa);
    c = d.completedSegments;
    if (1 !== c.length)
      throw Error(k2(391));
    hd(a, b, c[0]);
  }
  return t(b, ab);
}
function id(a, b, c) {
  Bb(b, a.responseState, c.formatContext, c.id);
  hd(a, b, c);
  return Cb(b, c.formatContext);
}
function jd(a, b, c) {
  for (var d = c.completedSegments, f = 0; f < d.length; f++)
    kd(a, b, c, d[f]);
  d.length = 0;
  a = a.responseState;
  d = c.id;
  c = c.rootSegmentID;
  p(b, a.startInlineScript);
  a.sentCompleteBoundaryFunction ? p(b, Jb) : (a.sentCompleteBoundaryFunction = true, p(b, Ib));
  if (null === d)
    throw Error(k2(395));
  c = u(c.toString(16));
  p(b, d);
  p(b, Kb);
  p(b, a.segmentPrefix);
  p(b, c);
  return t(b, Lb);
}
function kd(a, b, c, d) {
  if (2 === d.status)
    return true;
  var f = d.id;
  if (-1 === f) {
    if (-1 === (d.id = c.rootSegmentID))
      throw Error(k2(392));
    return id(a, b, d);
  }
  id(a, b, d);
  a = a.responseState;
  p(b, a.startInlineScript);
  a.sentCompleteSegmentFunction ? p(b, Eb) : (a.sentCompleteSegmentFunction = true, p(b, Db));
  p(b, a.segmentPrefix);
  f = u(f.toString(16));
  p(b, f);
  p(b, Gb);
  p(b, a.placeholderPrefix);
  p(b, f);
  return t(b, Hb);
}
function fd(a, b) {
  l$1 = new Uint8Array(512);
  n = 0;
  try {
    var c = a.completedRootSegment;
    if (null !== c && 0 === a.pendingRootTasks) {
      hd(a, b, c);
      a.completedRootSegment = null;
      var d = a.responseState.bootstrapChunks;
      for (c = 0; c < d.length - 1; c++)
        p(b, d[c]);
      c < d.length && t(b, d[c]);
    }
    var f = a.clientRenderedBoundaries, e;
    for (e = 0; e < f.length; e++) {
      var g = f[e];
      d = b;
      var h = a.responseState, m = g.id, q2 = g.errorDigest, r3 = g.errorMessage, v2 = g.errorComponentStack;
      p(d, h.startInlineScript);
      h.sentClientRenderFunction ? p(d, Nb) : (h.sentClientRenderFunction = true, p(
        d,
        Mb
      ));
      if (null === m)
        throw Error(k2(395));
      p(d, m);
      p(d, Ob);
      if (q2 || r3 || v2)
        p(d, Qb), p(d, u(Sb(q2 || "")));
      if (r3 || v2)
        p(d, Qb), p(d, u(Sb(r3 || "")));
      v2 && (p(d, Qb), p(d, u(Sb(v2))));
      if (!t(d, Pb))
        ;
    }
    f.splice(0, e);
    var A2 = a.completedBoundaries;
    for (e = 0; e < A2.length; e++)
      if (!jd(a, b, A2[e]))
        ;
    A2.splice(0, e);
    ba(b);
    l$1 = new Uint8Array(512);
    n = 0;
    var F2 = a.partialBoundaries;
    for (e = 0; e < F2.length; e++) {
      var G2 = F2[e];
      a: {
        f = a;
        g = b;
        var ma2 = G2.completedSegments;
        for (h = 0; h < ma2.length; h++)
          if (!kd(
            f,
            g,
            G2,
            ma2[h]
          )) {
            h++;
            ma2.splice(0, h);
            var Fb2 = false;
            break a;
          }
        ma2.splice(0, h);
        Fb2 = true;
      }
      if (!Fb2) {
        a.destination = null;
        e++;
        F2.splice(0, e);
        return;
      }
    }
    F2.splice(0, e);
    var na2 = a.completedBoundaries;
    for (e = 0; e < na2.length; e++)
      if (!jd(a, b, na2[e]))
        ;
    na2.splice(0, e);
  } finally {
    ba(b), 0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.close();
  }
}
function ld(a, b) {
  try {
    var c = a.abortableTasks;
    c.forEach(function(c2) {
      return ed(c2, a, b);
    });
    c.clear();
    null !== a.destination && fd(a, a.destination);
  } catch (d) {
    Y(a, d), Vc(a, d);
  }
}
function getContext(rendererContextResult) {
  if (contexts.has(rendererContextResult)) {
    return contexts.get(rendererContextResult);
  }
  const ctx = {
    currentIndex: 0,
    get id() {
      return ID_PREFIX + this.currentIndex.toString();
    }
  };
  contexts.set(rendererContextResult, ctx);
  return ctx;
}
function incrementId(rendererContextResult) {
  const ctx = getContext(rendererContextResult);
  const id2 = ctx.id;
  ctx.currentIndex++;
  return id2;
}
function errorIsComingFromPreactComponent(err) {
  return err.message && (err.message.startsWith("Cannot read property '__H'") || err.message.includes("(reading '__H')"));
}
async function check(Component, props, children) {
  if (typeof Component === "object") {
    return Component["$$typeof"].toString().slice("Symbol(".length).startsWith("react");
  }
  if (typeof Component !== "function")
    return false;
  if (Component.name === "QwikComponent")
    return false;
  if (typeof Component === "function" && Component["$$typeof"] === Symbol.for("react.forward_ref"))
    return false;
  if (Component.prototype != null && typeof Component.prototype.render === "function") {
    return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
  }
  let error2 = null;
  let isReactComponent = false;
  function Tester(...args) {
    try {
      const vnode = Component(...args);
      if (vnode && vnode["$$typeof"] === reactTypeof) {
        isReactComponent = true;
      }
    } catch (err) {
      if (!errorIsComingFromPreactComponent(err)) {
        error2 = err;
      }
    }
    return React.createElement("div");
  }
  await renderToStaticMarkup(Tester, props, children, {});
  if (error2) {
    throw error2;
  }
  return isReactComponent;
}
async function getNodeWritable() {
  let nodeStreamBuiltinModuleName = "node:stream";
  let { Writable } = await import(
    /* @vite-ignore */
    nodeStreamBuiltinModuleName
  );
  return Writable;
}
function needsHydration(metadata) {
  return metadata.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  let prefix;
  if (this && this.result) {
    prefix = incrementId(this.result);
  }
  const attrs = { prefix };
  delete props["class"];
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = React.createElement(StaticHtml, {
      hydrate: needsHydration(metadata),
      value,
      name
    });
  }
  const newProps = {
    ...props,
    ...slots
  };
  const newChildren = children ?? props.children;
  if (children && opts.experimentalReactChildren) {
    attrs["data-react-children"] = true;
    const convert2 = await Promise.resolve().then(() => (init_vnode_children_VTcTc4QR(), vnode_children_VTcTc4QR_exports)).then((mod) => mod.default);
    newProps.children = convert2(children);
  } else if (newChildren != null) {
    newProps.children = React.createElement(StaticHtml, {
      hydrate: needsHydration(metadata),
      value: newChildren
    });
  }
  const vnode = React.createElement(Component, newProps);
  const renderOptions = {
    identifierPrefix: prefix
  };
  let html;
  if (metadata?.hydrate) {
    if ("renderToReadableStream" in server_browser) {
      html = await renderToReadableStreamAsync(vnode, renderOptions);
    } else {
      html = await renderToPipeableStreamAsync(vnode, renderOptions);
    }
  } else {
    if ("renderToReadableStream" in server_browser) {
      html = await renderToReadableStreamAsync(vnode, renderOptions);
    } else {
      html = await renderToStaticNodeStreamAsync(vnode, renderOptions);
    }
  }
  return { html, attrs };
}
async function renderToPipeableStreamAsync(vnode, options) {
  const Writable = await getNodeWritable();
  let html = "";
  return new Promise((resolve, reject) => {
    let error2 = void 0;
    let stream = server_browser.renderToPipeableStream(vnode, {
      ...options,
      onError(err) {
        error2 = err;
        reject(error2);
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString("utf-8");
              callback();
            },
            destroy() {
              resolve(html);
            }
          })
        );
      }
    });
  });
}
async function renderToStaticNodeStreamAsync(vnode, options) {
  const Writable = await getNodeWritable();
  let html = "";
  return new Promise((resolve, reject) => {
    let stream = server_browser.renderToStaticNodeStream(vnode, options);
    stream.on("error", (err) => {
      reject(err);
    });
    stream.pipe(
      new Writable({
        write(chunk, _encoding, callback) {
          html += chunk.toString("utf-8");
          callback();
        },
        destroy() {
          resolve(html);
        }
      })
    );
  });
}
async function readResult(stream) {
  const reader = stream.getReader();
  let result = "";
  const decoder2 = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (value) {
        result += decoder2.decode(value);
      } else {
        decoder2.decode(new Uint8Array());
      }
      return result;
    }
    result += decoder2.decode(value, { stream: true });
  }
}
async function renderToReadableStreamAsync(vnode, options) {
  return await readResult(await server_browser.renderToReadableStream(vnode, options));
}
var react, react_production_min, l$3, n$1, p$2, q, r$1, t$2, u$2, v$1, w$2, x$2, y$2, z$1, B$2, C$1, D$1, H$2, I$2, J$2, K$2, L$2, P$2, U$2, V$2, W$2, reactExports, React, server_browser, reactDomServerLegacy_browser_production_min, aa$1, p$1, fa$1, ha$1, ia$1, t$1, ka$1, u$1, ma, na, oa$1, pa$1, qa$1, sa$1, wa$1, xa$1, Ca$1, B$1, Ga$1, Ha$1, Ia$1, Ja$1, Ka$1, La$1, Ma$1, Na$1, Oa$1, Pa$1, Qa$1, Ra$1, Sa$1, Ta$1, Ua$1, Va$1, Wa$1, Ya$1, E$1, db$1, fb$1, H$1, ib$1, jb$1, lb$1, I$1, ob$1, J$1, K$1, L$1, M$1, N$1, O$1, P$1, xb$1, S$1, yb$1, reactDomServer_browser_production_min, aa, l$1, n, ca2, x2, ea, fa, ha, z, ja, B, la, oa, pa, qa, ra, sa, ta, ua, va, wa, xa, Ca, Ea, Fa, Ga, Ha, H, I, E, Ja, K, Ka, Ma, Oa, Pa, Qa, Ra, Ta, Ua, Va, Wa, Xa, Ya, Za, $a, ab, bb, cb, db, eb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb, ub, vb, wb, xb, yb, zb, Ab, Db, Eb, Gb, Hb, Ib, Jb, Kb, Lb, Mb, Nb, Ob, Pb, Qb, Rb, N, Tb, Ub, Vb, Wb, Xb, Yb, Zb, $b, ac, bc, cc, dc, ec, fc, gc, hc, ic, kc, O, qc, sc, uc, wc, xc, zc, R2, Ac, Bc, S, T, Cc, U, V, Dc, Oc, Nc, Pc, l, s, contexts, ID_PREFIX, StaticHtml, opts, slotName, reactTypeof, _renderer0, renderers;
var init_renderers = __esm({
  ".wrangler/tmp/pages-L6EXwU/renderers.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_astro_Bticr204();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    react = { exports: {} };
    react_production_min = {};
    l$3 = Symbol.for("react.element");
    n$1 = Symbol.for("react.portal");
    p$2 = Symbol.for("react.fragment");
    q = Symbol.for("react.strict_mode");
    r$1 = Symbol.for("react.profiler");
    t$2 = Symbol.for("react.provider");
    u$2 = Symbol.for("react.context");
    v$1 = Symbol.for("react.forward_ref");
    w$2 = Symbol.for("react.suspense");
    x$2 = Symbol.for("react.memo");
    y$2 = Symbol.for("react.lazy");
    z$1 = Symbol.iterator;
    B$2 = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } };
    C$1 = Object.assign;
    D$1 = {};
    E$2.prototype.isReactComponent = {};
    E$2.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a)
        throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E$2.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    F$1.prototype = E$2.prototype;
    H$2 = G$1.prototype = new F$1();
    H$2.constructor = G$1;
    C$1(H$2, E$2.prototype);
    H$2.isPureReactComponent = true;
    I$2 = Array.isArray;
    J$2 = Object.prototype.hasOwnProperty;
    K$2 = { current: null };
    L$2 = { key: true, ref: true, __self: true, __source: true };
    P$2 = /\/+/g;
    U$2 = { current: null };
    V$2 = { transition: null };
    W$2 = { ReactCurrentDispatcher: U$2, ReactCurrentBatchConfig: V$2, ReactCurrentOwner: K$2 };
    react_production_min.Children = { map: S$2, forEach: function(a, b, e) {
      S$2(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S$2(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S$2(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O$2(a))
        throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    react_production_min.Component = E$2;
    react_production_min.Fragment = p$2;
    react_production_min.Profiler = r$1;
    react_production_min.PureComponent = G$1;
    react_production_min.StrictMode = q;
    react_production_min.Suspense = w$2;
    react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$2;
    react_production_min.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a)
        throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C$1({}, a.props), c = a.key, k3 = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k3 = b.ref, h = K$2.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps)
          var g = a.type.defaultProps;
        for (f in b)
          J$2.call(b, f) && !L$2.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f)
        d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++)
          g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l$3, type: a.type, key: c, ref: k3, props: d, _owner: h };
    };
    react_production_min.createContext = function(a) {
      a = { $$typeof: u$2, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t$2, _context: a };
      return a.Consumer = a;
    };
    react_production_min.createElement = M$2;
    react_production_min.createFactory = function(a) {
      var b = M$2.bind(null, a);
      b.type = a;
      return b;
    };
    react_production_min.createRef = function() {
      return { current: null };
    };
    react_production_min.forwardRef = function(a) {
      return { $$typeof: v$1, render: a };
    };
    react_production_min.isValidElement = O$2;
    react_production_min.lazy = function(a) {
      return { $$typeof: y$2, _payload: { _status: -1, _result: a }, _init: T$2 };
    };
    react_production_min.memo = function(a, b) {
      return { $$typeof: x$2, type: a, compare: void 0 === b ? null : b };
    };
    react_production_min.startTransition = function(a) {
      var b = V$2.transition;
      V$2.transition = {};
      try {
        a();
      } finally {
        V$2.transition = b;
      }
    };
    react_production_min.unstable_act = function() {
      throw Error("act(...) is not supported in production builds of React.");
    };
    react_production_min.useCallback = function(a, b) {
      return U$2.current.useCallback(a, b);
    };
    react_production_min.useContext = function(a) {
      return U$2.current.useContext(a);
    };
    react_production_min.useDebugValue = function() {
    };
    react_production_min.useDeferredValue = function(a) {
      return U$2.current.useDeferredValue(a);
    };
    react_production_min.useEffect = function(a, b) {
      return U$2.current.useEffect(a, b);
    };
    react_production_min.useId = function() {
      return U$2.current.useId();
    };
    react_production_min.useImperativeHandle = function(a, b, e) {
      return U$2.current.useImperativeHandle(a, b, e);
    };
    react_production_min.useInsertionEffect = function(a, b) {
      return U$2.current.useInsertionEffect(a, b);
    };
    react_production_min.useLayoutEffect = function(a, b) {
      return U$2.current.useLayoutEffect(a, b);
    };
    react_production_min.useMemo = function(a, b) {
      return U$2.current.useMemo(a, b);
    };
    react_production_min.useReducer = function(a, b, e) {
      return U$2.current.useReducer(a, b, e);
    };
    react_production_min.useRef = function(a) {
      return U$2.current.useRef(a);
    };
    react_production_min.useState = function(a) {
      return U$2.current.useState(a);
    };
    react_production_min.useSyncExternalStore = function(a, b, e) {
      return U$2.current.useSyncExternalStore(a, b, e);
    };
    react_production_min.useTransition = function() {
      return U$2.current.useTransition();
    };
    react_production_min.version = "18.2.0";
    {
      react.exports = react_production_min;
    }
    reactExports = react.exports;
    React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
    server_browser = {};
    reactDomServerLegacy_browser_production_min = {};
    aa$1 = reactExports;
    p$1 = Object.prototype.hasOwnProperty;
    fa$1 = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
    ha$1 = {};
    ia$1 = {};
    t$1 = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      t$1[a] = new r2(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      t$1[b] = new r2(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      t$1[a] = new r2(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      t$1[a] = new r2(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      t$1[a] = new r2(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      t$1[a] = new r2(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      t$1[a] = new r2(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      t$1[a] = new r2(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      t$1[a] = new r2(a, 5, false, a.toLowerCase(), null, false, false);
    });
    ka$1 = /[\-:]([a-z])/g;
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ka$1,
        la$1
      );
      t$1[b] = new r2(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ka$1, la$1);
      t$1[b] = new r2(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ka$1, la$1);
      t$1[b] = new r2(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      t$1[a] = new r2(a, 1, false, a.toLowerCase(), null, false, false);
    });
    t$1.xlinkHref = new r2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      t$1[a] = new r2(a, 1, false, a.toLowerCase(), null, true, true);
    });
    u$1 = {
      animationIterationCount: true,
      aspectRatio: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    ma = ["Webkit", "ms", "Moz", "O"];
    Object.keys(u$1).forEach(function(a) {
      ma.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        u$1[b] = u$1[a];
      });
    });
    na = /["'&<>]/;
    oa$1 = /([A-Z])/g;
    pa$1 = /^ms-/;
    qa$1 = Array.isArray;
    sa$1 = /* @__PURE__ */ new Map();
    wa$1 = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    xa$1 = /* @__PURE__ */ new Map();
    Ca$1 = /[<\u2028\u2029]/g;
    B$1 = Object.assign;
    Ga$1 = Symbol.for("react.element");
    Ha$1 = Symbol.for("react.portal");
    Ia$1 = Symbol.for("react.fragment");
    Ja$1 = Symbol.for("react.strict_mode");
    Ka$1 = Symbol.for("react.profiler");
    La$1 = Symbol.for("react.provider");
    Ma$1 = Symbol.for("react.context");
    Na$1 = Symbol.for("react.forward_ref");
    Oa$1 = Symbol.for("react.suspense");
    Pa$1 = Symbol.for("react.suspense_list");
    Qa$1 = Symbol.for("react.memo");
    Ra$1 = Symbol.for("react.lazy");
    Sa$1 = Symbol.for("react.scope");
    Ta$1 = Symbol.for("react.debug_trace_mode");
    Ua$1 = Symbol.for("react.legacy_hidden");
    Va$1 = Symbol.for("react.default_value");
    Wa$1 = Symbol.iterator;
    Ya$1 = {};
    E$1 = null;
    db$1 = { isMounted: function() {
      return false;
    }, enqueueSetState: function(a, b) {
      a = a._reactInternals;
      null !== a.queue && a.queue.push(b);
    }, enqueueReplaceState: function(a, b) {
      a = a._reactInternals;
      a.replace = true;
      a.queue = [b];
    }, enqueueForceUpdate: function() {
    } };
    fb$1 = { id: 1, overflow: "" };
    H$1 = Math.clz32 ? Math.clz32 : hb$1;
    ib$1 = Math.log;
    jb$1 = Math.LN2;
    lb$1 = "function" === typeof Object.is ? Object.is : kb$1;
    I$1 = null;
    ob$1 = null;
    J$1 = null;
    K$1 = null;
    L$1 = false;
    M$1 = false;
    N$1 = 0;
    O$1 = null;
    P$1 = 0;
    xb$1 = { readContext: function(a) {
      return a._currentValue2;
    }, useContext: function(a) {
      Q$1();
      return a._currentValue2;
    }, useMemo: vb$1, useReducer: tb$1, useRef: function(a) {
      I$1 = Q$1();
      K$1 = qb$1();
      var b = K$1.memoizedState;
      return null === b ? (a = { current: a }, K$1.memoizedState = a) : b;
    }, useState: function(a) {
      return tb$1(sb$1, a);
    }, useInsertionEffect: R$1, useLayoutEffect: function() {
    }, useCallback: function(a, b) {
      return vb$1(function() {
        return a;
      }, b);
    }, useImperativeHandle: R$1, useEffect: R$1, useDebugValue: R$1, useDeferredValue: function(a) {
      Q$1();
      return a;
    }, useTransition: function() {
      Q$1();
      return [
        false,
        wb$1
      ];
    }, useId: function() {
      var a = ob$1.treeContext;
      var b = a.overflow;
      a = a.id;
      a = (a & ~(1 << 32 - H$1(a) - 1)).toString(32) + b;
      var c = S$1;
      if (null === c)
        throw Error(l$2(404));
      b = N$1++;
      a = ":" + c.idPrefix + "R" + a;
      0 < b && (a += "H" + b.toString(32));
      return a + ":";
    }, useMutableSource: function(a, b) {
      Q$1();
      return b(a._source);
    }, useSyncExternalStore: function(a, b, c) {
      if (void 0 === c)
        throw Error(l$2(407));
      return c();
    } };
    S$1 = null;
    yb$1 = aa$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
    reactDomServerLegacy_browser_production_min.renderToNodeStream = function() {
      throw Error(l$2(207));
    };
    reactDomServerLegacy_browser_production_min.renderToStaticMarkup = function(a, b) {
      return Tb$1(a, b, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
    };
    reactDomServerLegacy_browser_production_min.renderToStaticNodeStream = function() {
      throw Error(l$2(208));
    };
    reactDomServerLegacy_browser_production_min.renderToString = function(a, b) {
      return Tb$1(a, b, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
    };
    reactDomServerLegacy_browser_production_min.version = "18.2.0";
    reactDomServer_browser_production_min = {};
    aa = reactExports;
    l$1 = null;
    n = 0;
    ca2 = new TextEncoder();
    x2 = Object.prototype.hasOwnProperty;
    ea = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
    fa = {};
    ha = {};
    z = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      z[a] = new y(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      z[b] = new y(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      z[a] = new y(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      z[a] = new y(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      z[a] = new y(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      z[a] = new y(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      z[a] = new y(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      z[a] = new y(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      z[a] = new y(a, 5, false, a.toLowerCase(), null, false, false);
    });
    ja = /[\-:]([a-z])/g;
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ja,
        ka
      );
      z[b] = new y(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ja, ka);
      z[b] = new y(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ja, ka);
      z[b] = new y(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      z[a] = new y(a, 1, false, a.toLowerCase(), null, false, false);
    });
    z.xlinkHref = new y("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      z[a] = new y(a, 1, false, a.toLowerCase(), null, true, true);
    });
    B = {
      animationIterationCount: true,
      aspectRatio: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    la = ["Webkit", "ms", "Moz", "O"];
    Object.keys(B).forEach(function(a) {
      la.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        B[b] = B[a];
      });
    });
    oa = /["'&<>]/;
    pa = /([A-Z])/g;
    qa = /^ms-/;
    ra = Array.isArray;
    sa = w2("<script>");
    ta = w2("<\/script>");
    ua = w2('<script src="');
    va = w2('<script type="module" src="');
    wa = w2('" async=""><\/script>');
    xa = /(<\/|<)(s)(cript)/gi;
    Ca = w2("<!-- -->");
    Ea = /* @__PURE__ */ new Map();
    Fa = w2(' style="');
    Ga = w2(":");
    Ha = w2(";");
    H = w2(" ");
    I = w2('="');
    E = w2('"');
    Ja = w2('=""');
    K = w2(">");
    Ka = w2("/>");
    Ma = w2(' selected=""');
    Oa = w2("\n");
    Pa = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    Qa = /* @__PURE__ */ new Map();
    Ra = w2("<!DOCTYPE html>");
    Ta = w2("</");
    Ua = w2(">");
    Va = w2('<template id="');
    Wa = w2('"></template>');
    Xa = w2("<!--$-->");
    Ya = w2('<!--$?--><template id="');
    Za = w2('"></template>');
    $a = w2("<!--$!-->");
    ab = w2("<!--/$-->");
    bb = w2("<template");
    cb = w2('"');
    db = w2(' data-dgst="');
    w2(' data-msg="');
    w2(' data-stck="');
    eb = w2("></template>");
    gb = w2('<div hidden id="');
    hb = w2('">');
    ib = w2("</div>");
    jb = w2('<svg aria-hidden="true" style="display:none" id="');
    kb = w2('">');
    lb = w2("</svg>");
    mb = w2('<math aria-hidden="true" style="display:none" id="');
    nb = w2('">');
    ob = w2("</math>");
    pb = w2('<table hidden id="');
    qb = w2('">');
    rb = w2("</table>");
    sb = w2('<table hidden><tbody id="');
    tb = w2('">');
    ub = w2("</tbody></table>");
    vb = w2('<table hidden><tr id="');
    wb = w2('">');
    xb = w2("</tr></table>");
    yb = w2('<table hidden><colgroup id="');
    zb = w2('">');
    Ab = w2("</colgroup></table>");
    Db = w2('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("');
    Eb = w2('$RS("');
    Gb = w2('","');
    Hb = w2('")<\/script>');
    Ib = w2('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("');
    Jb = w2('$RC("');
    Kb = w2('","');
    Lb = w2('")<\/script>');
    Mb = w2('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("');
    Nb = w2('$RX("');
    Ob = w2('"');
    Pb = w2(")<\/script>");
    Qb = w2(",");
    Rb = /[<\u2028\u2029]/g;
    N = Object.assign;
    Tb = Symbol.for("react.element");
    Ub = Symbol.for("react.portal");
    Vb = Symbol.for("react.fragment");
    Wb = Symbol.for("react.strict_mode");
    Xb = Symbol.for("react.profiler");
    Yb = Symbol.for("react.provider");
    Zb = Symbol.for("react.context");
    $b = Symbol.for("react.forward_ref");
    ac = Symbol.for("react.suspense");
    bc = Symbol.for("react.suspense_list");
    cc = Symbol.for("react.memo");
    dc = Symbol.for("react.lazy");
    ec = Symbol.for("react.scope");
    fc = Symbol.for("react.debug_trace_mode");
    gc = Symbol.for("react.legacy_hidden");
    hc = Symbol.for("react.default_value");
    ic = Symbol.iterator;
    kc = {};
    O = null;
    qc = { isMounted: function() {
      return false;
    }, enqueueSetState: function(a, b) {
      a = a._reactInternals;
      null !== a.queue && a.queue.push(b);
    }, enqueueReplaceState: function(a, b) {
      a = a._reactInternals;
      a.replace = true;
      a.queue = [b];
    }, enqueueForceUpdate: function() {
    } };
    sc = { id: 1, overflow: "" };
    uc = Math.clz32 ? Math.clz32 : vc;
    wc = Math.log;
    xc = Math.LN2;
    zc = "function" === typeof Object.is ? Object.is : yc;
    R2 = null;
    Ac = null;
    Bc = null;
    S = null;
    T = false;
    Cc = false;
    U = 0;
    V = null;
    Dc = 0;
    Oc = { readContext: function(a) {
      return a._currentValue;
    }, useContext: function(a) {
      W();
      return a._currentValue;
    }, useMemo: Kc, useReducer: Ic, useRef: function(a) {
      R2 = W();
      S = Fc();
      var b = S.memoizedState;
      return null === b ? (a = { current: a }, S.memoizedState = a) : b;
    }, useState: function(a) {
      return Ic(Hc, a);
    }, useInsertionEffect: Mc, useLayoutEffect: function() {
    }, useCallback: function(a, b) {
      return Kc(function() {
        return a;
      }, b);
    }, useImperativeHandle: Mc, useEffect: Mc, useDebugValue: Mc, useDeferredValue: function(a) {
      W();
      return a;
    }, useTransition: function() {
      W();
      return [false, Lc];
    }, useId: function() {
      var a = Ac.treeContext;
      var b = a.overflow;
      a = a.id;
      a = (a & ~(1 << 32 - uc(a) - 1)).toString(32) + b;
      var c = Nc;
      if (null === c)
        throw Error(k2(404));
      b = U++;
      a = ":" + c.idPrefix + "R" + a;
      0 < b && (a += "H" + b.toString(32));
      return a + ":";
    }, useMutableSource: function(a, b) {
      W();
      return b(a._source);
    }, useSyncExternalStore: function(a, b, c) {
      if (void 0 === c)
        throw Error(k2(407));
      return c();
    } };
    Nc = null;
    Pc = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
    reactDomServer_browser_production_min.renderToReadableStream = function(a, b) {
      return new Promise(function(c, d) {
        var f, e, g = new Promise(function(a2, b2) {
          e = a2;
          f = b2;
        }), h = Rc(a, za(b ? b.identifierPrefix : void 0, b ? b.nonce : void 0, b ? b.bootstrapScriptContent : void 0, b ? b.bootstrapScripts : void 0, b ? b.bootstrapModules : void 0), Aa(b ? b.namespaceURI : void 0), b ? b.progressiveChunkSize : void 0, b ? b.onError : void 0, e, function() {
          var a2 = new ReadableStream({ type: "bytes", pull: function(a3) {
            if (1 === h.status)
              h.status = 2, da(a3, h.fatalError);
            else if (2 !== h.status && null === h.destination) {
              h.destination = a3;
              try {
                fd(h, a3);
              } catch (A2) {
                Y(h, A2), Vc(h, A2);
              }
            }
          }, cancel: function() {
            ld(h);
          } }, { highWaterMark: 0 });
          a2.allReady = g;
          c(a2);
        }, function(a2) {
          g.catch(function() {
          });
          d(a2);
        }, f);
        if (b && b.signal) {
          var m = b.signal, q2 = function() {
            ld(h, m.reason);
            m.removeEventListener("abort", q2);
          };
          m.addEventListener("abort", q2);
        }
        Uc(h);
      });
    };
    reactDomServer_browser_production_min.version = "18.2.0";
    {
      l = reactDomServerLegacy_browser_production_min;
      s = reactDomServer_browser_production_min;
    }
    server_browser.version = l.version;
    server_browser.renderToString = l.renderToString;
    server_browser.renderToStaticMarkup = l.renderToStaticMarkup;
    server_browser.renderToNodeStream = l.renderToNodeStream;
    server_browser.renderToStaticNodeStream = l.renderToStaticNodeStream;
    server_browser.renderToReadableStream = s.renderToReadableStream;
    contexts = /* @__PURE__ */ new WeakMap();
    ID_PREFIX = "r";
    StaticHtml = ({ value, name, hydrate = true }) => {
      if (!value)
        return null;
      const tagName = hydrate ? "astro-slot" : "astro-static-slot";
      return reactExports.createElement(tagName, {
        name,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: value }
      });
    };
    StaticHtml.shouldComponentUpdate = () => false;
    opts = {
      experimentalReactChildren: false
    };
    slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_2, w3) => w3.toUpperCase());
    reactTypeof = Symbol.for("react.element");
    _renderer0 = {
      check,
      renderToStaticMarkup,
      supportsAstroStaticSlot: true
    };
    renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: _renderer0 })];
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/pages/image-endpoint_nxDOIah1.mjs
var image_endpoint_nxDOIah1_exports = {};
var init_image_endpoint_nxDOIah1 = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/pages/image-endpoint_nxDOIah1.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/image-endpoint_RvDj3-CK.mjs
var image_endpoint_RvDj3_CK_exports = {};
__export(image_endpoint_RvDj3_CK_exports, {
  page: () => page,
  renderers: () => renderers
});
var page;
var init_image_endpoint_RvDj3_CK = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/image-endpoint_RvDj3-CK.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    page = () => Promise.resolve().then(() => (init_image_endpoint_nxDOIah1(), image_endpoint_nxDOIah1_exports));
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/pages/test_Czivfogd.mjs
var test_Czivfogd_exports = {};
__export(test_Czivfogd_exports, {
  default: () => $$Test,
  file: () => $$file,
  prerender: () => prerender,
  url: () => $$url
});
var $$Astro$2, $$Layout, $$Astro$1, $$Card, $$Astro, prerender, $$Test, $$file, $$url;
var init_test_Czivfogd = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/pages/test_Czivfogd.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_astro_Bticr204();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    $$Astro$2 = createAstro();
    $$Layout = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
      Astro2.self = $$Layout;
      const { title } = Astro2.props;
      return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
    }, "C:/Users/honda/Documents/Repos/astro-cf-10-issues/src/layouts/Layout.astro", void 0);
    $$Astro$1 = createAstro();
    $$Card = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
      Astro2.self = $$Card;
      const { href, title, body } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<li class="link-card" data-astro-cid-dohjnao5> <a${addAttribute(href, "href")} data-astro-cid-dohjnao5> <h2 data-astro-cid-dohjnao5> ${title} <span data-astro-cid-dohjnao5>&rarr;</span> </h2> <p data-astro-cid-dohjnao5> ${body} </p> </a> </li> `;
    }, "C:/Users/honda/Documents/Repos/astro-cf-10-issues/src/components/Card.astro", void 0);
    $$Astro = createAstro();
    prerender = false;
    $$Test = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
      Astro2.self = $$Test;
      return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "data-astro-cid-6d7mwtum": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-6d7mwtum> <svg class="astro-a" width="495" height="623" viewBox="0 0 495 623" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-astro-cid-6d7mwtum> <path fill-rule="evenodd" clip-rule="evenodd" d="M167.19 364.254C83.4786 364.254 0 404.819 0 404.819C0 404.819 141.781 19.4876 142.087 18.7291C146.434 7.33701 153.027 0 162.289 0H332.441C341.703 0 348.574 7.33701 352.643 18.7291C352.92 19.5022 494.716 404.819 494.716 404.819C494.716 404.819 426.67 364.254 327.525 364.254L264.41 169.408C262.047 159.985 255.147 153.581 247.358 153.581C239.569 153.581 232.669 159.985 230.306 169.408L167.19 364.254ZM160.869 530.172C160.877 530.18 160.885 530.187 160.894 530.195L160.867 530.181C160.868 530.178 160.868 530.175 160.869 530.172ZM136.218 411.348C124.476 450.467 132.698 504.458 160.869 530.172C160.997 529.696 161.125 529.242 161.248 528.804C161.502 527.907 161.737 527.073 161.917 526.233C165.446 509.895 178.754 499.52 195.577 500.01C211.969 500.487 220.67 508.765 223.202 527.254C224.141 534.12 224.23 541.131 224.319 548.105C224.328 548.834 224.337 549.563 224.347 550.291C224.563 566.098 228.657 580.707 237.264 593.914C245.413 606.426 256.108 615.943 270.749 622.478C270.593 621.952 270.463 621.508 270.35 621.126C270.045 620.086 269.872 619.499 269.685 618.911C258.909 585.935 266.668 563.266 295.344 543.933C298.254 541.971 301.187 540.041 304.12 538.112C310.591 533.854 317.059 529.599 323.279 525.007C345.88 508.329 360.09 486.327 363.431 457.844C364.805 446.148 363.781 434.657 359.848 423.275C358.176 424.287 356.587 425.295 355.042 426.275C351.744 428.366 348.647 430.33 345.382 431.934C303.466 452.507 259.152 455.053 214.03 448.245C184.802 443.834 156.584 436.019 136.218 411.348Z" fill="url(#paint0_linear_1805_24383)" data-astro-cid-6d7mwtum></path> <defs data-astro-cid-6d7mwtum> <linearGradient id="paint0_linear_1805_24383" x1="247.358" y1="0" x2="247.358" y2="622.479" gradientUnits="userSpaceOnUse" data-astro-cid-6d7mwtum> <stop stop-opacity="0.9" data-astro-cid-6d7mwtum></stop> <stop offset="1" stop-opacity="0.2" data-astro-cid-6d7mwtum></stop> </linearGradient> </defs> </svg> <h1 data-astro-cid-6d7mwtum>Welcome to <span class="text-gradient" data-astro-cid-6d7mwtum>Astro</span></h1> <p class="instructions" data-astro-cid-6d7mwtum>
To get started, open the directory <code data-astro-cid-6d7mwtum>src/pages</code> in your project.<br data-astro-cid-6d7mwtum> <strong data-astro-cid-6d7mwtum>Code Challenge:</strong> Tweak the "Welcome to Astro" message above.
</p> <ul role="list" class="link-card-grid" data-astro-cid-6d7mwtum> ${renderComponent($$result2, "Card", $$Card, { "href": "https://docs.astro.build/", "title": "Documentation", "body": "Learn how Astro works and explore the official API docs.", "data-astro-cid-6d7mwtum": true })} ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/integrations/", "title": "Integrations", "body": "Supercharge your project with new frameworks and libraries.", "data-astro-cid-6d7mwtum": true })} ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/themes/", "title": "Themes", "body": "Explore a galaxy of community-built starter themes.", "data-astro-cid-6d7mwtum": true })} ${renderComponent($$result2, "Card", $$Card, { "href": "https://astro.build/chat/", "title": "Community", "body": "Come say hi to our amazing Discord community. \u2764\uFE0F", "data-astro-cid-6d7mwtum": true })} </ul> </main> ` })} `;
    }, "C:/Users/honda/Documents/Repos/astro-cf-10-issues/src/pages/test.astro", void 0);
    $$file = "C:/Users/honda/Documents/Repos/astro-cf-10-issues/src/pages/test.astro";
    $$url = "/test";
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/test_D_H-EmVF.mjs
var test_D_H_EmVF_exports = {};
__export(test_D_H_EmVF_exports, {
  page: () => page2,
  renderers: () => renderers
});
var page2;
var init_test_D_H_EmVF = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/test_D_H-EmVF.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    page2 = () => Promise.resolve().then(() => (init_test_Czivfogd(), test_Czivfogd_exports));
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/pages/index_CPLiUgeG.mjs
var index_CPLiUgeG_exports = {};
__export(index_CPLiUgeG_exports, {
  GET: () => GET,
  prerender: () => prerender2
});
var prerender2, GET;
var init_index_CPLiUgeG = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/pages/index_CPLiUgeG.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    prerender2 = false;
    GET = ({ preferredLocale, redirect, cookies }) => {
      return redirect("/test");
    };
  }
});

// .wrangler/tmp/pages-L6EXwU/chunks/index_B6euTALA.mjs
var index_B6euTALA_exports = {};
__export(index_B6euTALA_exports, {
  page: () => page3,
  renderers: () => renderers
});
var page3;
var init_index_B6euTALA = __esm({
  ".wrangler/tmp/pages-L6EXwU/chunks/index_B6euTALA.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    page3 = () => Promise.resolve().then(() => (init_index_CPLiUgeG(), index_CPLiUgeG_exports));
  }
});

// .wrangler/tmp/bundle-sphDBH/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-sphDBH/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/pages-L6EXwU/esvq4apldaa.js
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/pages-L6EXwU/bundledWorker-0.8640556108095865.mjs
init_checked_fetch();
init_modules_watch_stub();
init_renderers();

// .wrangler/tmp/pages-L6EXwU/manifest_B5pfMIo-.mjs
init_checked_fetch();
init_modules_watch_stub();
init_astro_Bticr204();
globalThis.process ??= {};
globalThis.process.env ??= {};
var dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
var levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts2, level, label, message, newLine = true) {
  const logLevel = opts2.level;
  const dest = opts2.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts2, label, message, newLine = true) {
  return log(opts2, "info", label, message, newLine);
}
function warn(opts2, label, message, newLine = true) {
  return log(opts2, "warn", label, message, newLine);
}
function error(opts2, label, message, newLine = true) {
  return log(opts2, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose"))
      ;
    else if (proc.argv.includes("--silent"))
      ;
    else
      ;
  }
}
var Logger = class {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
};
var AstroIntegrationLogger = class {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
};
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j2 = i + 1;
      while (j2 < str.length) {
        var code = str.charCodeAt(j2);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j2++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j2;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j2 = i + 1;
      if (str[j2] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j2));
      }
      while (j2 < str.length) {
        if (str[j2] === "\\") {
          pattern += str[j2++] + str[j2++];
          continue;
        }
        if (str[j2] === ")") {
          count--;
          if (count === 0) {
            j2++;
            break;
          }
        } else if (str[j2] === "(") {
          count++;
          if (str[j2 + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j2));
          }
        }
        pattern += str[j2++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j2;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
  var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || defaultPattern,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode2 = _a === void 0 ? function(x3) {
    return x3;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j2 = 0; j2 < value.length; j2++) {
          var segment = encode2(value[j2], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode2(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path;
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}
function deserializeManifest(serializedManifest) {
  const routes2 = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes2.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_2, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes: routes2
  };
}
var manifest = deserializeManifest({ "adapterName": "@astrojs/cloudflare", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "endpoint", "isIndex": false, "route": "/_image", "pattern": "^\\/_image$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "params": [], "component": "node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", "pathname": "/_image", "prerender": false, "fallbackRoutes": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [{ "type": "inline", "content": ":root{--accent: 136, 58, 234;--accent-light: 224, 204, 250;--accent-dark: 49, 10, 101;--accent-gradient: linear-gradient( 45deg, rgb(var(--accent)), rgb(var(--accent-light)) 30%, white 60% )}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px}code{font-family:Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace}.link-card[data-astro-cid-dohjnao5]{list-style:none;display:flex;padding:1px;background-color:#23262d;background-image:none;background-size:400%;border-radius:7px;background-position:100%;transition:background-position .6s cubic-bezier(.22,1,.36,1);box-shadow:inset 0 0 0 1px #ffffff1a}.link-card[data-astro-cid-dohjnao5]>a[data-astro-cid-dohjnao5]{width:100%;text-decoration:none;line-height:1.4;padding:calc(1.5rem - 1px);border-radius:8px;color:#fff;background-color:#23262d;opacity:.8}h2[data-astro-cid-dohjnao5]{margin:0;font-size:1.25rem;transition:color .6s cubic-bezier(.22,1,.36,1)}p[data-astro-cid-dohjnao5]{margin-top:.5rem;margin-bottom:0}.link-card[data-astro-cid-dohjnao5]:is(:hover,:focus-within){background-position:0;background-image:var(--accent-gradient)}.link-card[data-astro-cid-dohjnao5]:is(:hover,:focus-within) h2[data-astro-cid-dohjnao5]{color:rgb(var(--accent-light))}main[data-astro-cid-6d7mwtum]{margin:auto;padding:1rem;width:800px;max-width:calc(100% - 2rem);color:#fff;font-size:20px;line-height:1.6}.astro-a[data-astro-cid-6d7mwtum]{position:absolute;top:-32px;left:50%;transform:translate(-50%);width:220px;height:auto;z-index:-1}h1[data-astro-cid-6d7mwtum]{font-size:4rem;font-weight:700;line-height:1;text-align:center;margin-bottom:1em}.text-gradient[data-astro-cid-6d7mwtum]{background-image:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:400%;background-position:0%}.instructions[data-astro-cid-6d7mwtum]{margin-bottom:2rem;border:1px solid rgba(var(--accent-light),25%);background:linear-gradient(rgba(var(--accent-dark),66%),rgba(var(--accent-dark),33%));padding:1.5rem;border-radius:8px}.instructions[data-astro-cid-6d7mwtum] code[data-astro-cid-6d7mwtum]{font-size:.8em;font-weight:700;background:rgba(var(--accent-light),12%);color:rgb(var(--accent-light));border-radius:4px;padding:.3em .4em}.instructions[data-astro-cid-6d7mwtum] strong[data-astro-cid-6d7mwtum]{color:rgb(var(--accent-light))}.link-card-grid[data-astro-cid-6d7mwtum]{display:grid;grid-template-columns:repeat(auto-fit,minmax(24ch,1fr));gap:2rem;padding:0}\n" }], "routeData": { "route": "/test", "isIndex": false, "type": "page", "pattern": "^\\/test\\/?$", "segments": [[{ "content": "test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/test.astro", "pathname": "/test", "prerender": false, "fallbackRoutes": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "endpoint", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.ts", "pathname": "/", "prerender": false, "fallbackRoutes": [], "_meta": { "trailingSlash": "ignore" } } }], "base": "/", "trailingSlash": "ignore", "compressHTML": true, "componentMetadata": [["C:/Users/honda/Documents/Repos/astro-cf-10-issues/src/pages/test.astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var i=t=>{let e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener("change",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "\0@astrojs-ssr-virtual-entry": "index.js", "\0@astro-renderers": "renderers.mjs", "\0noop-middleware": "_noop-middleware.mjs", "/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js": "chunks/pages/image-endpoint_nxDOIah1.mjs", "/src/pages/index.ts": "chunks/pages/index_CPLiUgeG.mjs", "/src/pages/test.astro": "chunks/pages/test_Czivfogd.mjs", "\0@astrojs-manifest": "manifest_B5pfMIo-.mjs", "C:/Users/honda/Documents/Repos/astro-cf-10-issues/node_modules/@astrojs/react/vnode-children.js": "chunks/vnode-children_VTcTc4QR.mjs", "\0@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js": "chunks/image-endpoint_RvDj3-CK.mjs", "\0@astro-page:src/pages/test@_@astro": "chunks/test_D_H-EmVF.mjs", "\0@astro-page:src/pages/index@_@ts": "chunks/index_B6euTALA.mjs", "@astrojs/react/client.js": "_astro/client.CwWKiGVO.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [], "assets": ["/favicon.svg", "/_astro/client.CwWKiGVO.js", "/_worker.js/index.js", "/_worker.js/renderers.mjs", "/_worker.js/_noop-middleware.mjs", "/_worker.js/chunks/astro_Bticr204.mjs", "/_worker.js/chunks/image-endpoint_RvDj3-CK.mjs", "/_worker.js/chunks/index_B6euTALA.mjs", "/_worker.js/chunks/test_D_H-EmVF.mjs", "/_worker.js/chunks/vnode-children_VTcTc4QR.mjs", "/_worker.js/chunks/pages/image-endpoint_nxDOIah1.mjs", "/_worker.js/chunks/pages/index_CPLiUgeG.mjs", "/_worker.js/chunks/pages/test_Czivfogd.mjs"], "buildFormat": "directory" });

// .wrangler/tmp/pages-L6EXwU/bundledWorker-0.8640556108095865.mjs
init_astro_Bticr204();

// .wrangler/tmp/pages-L6EXwU/_noop-middleware.mjs
init_checked_fetch();
init_modules_watch_stub();
globalThis.process ??= {};
globalThis.process.env ??= {};
var onRequest = (_2, next) => next();

// .wrangler/tmp/pages-L6EXwU/bundledWorker-0.8640556108095865.mjs
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
globalThis.process ??= {};
globalThis.process.env ??= {};
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateSlashes(path) {
  return path.replace(/(?<!:)\/{2,}/g, "/");
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i) => {
    if (i === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new Unreachable();
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  return locales.map((loopLocale) => {
    if (typeof loopLocale === "string") {
      return loopLocale;
    } else {
      return loopLocale.codes[0];
    }
  });
}
var Unreachable = class extends Error {
  constructor() {
    super(
      "Astro encountered an unexpected line of code.\nIn most cases, this is not your fault, but a bug in astro code.\nIf there isn't one already, please create an issue.\nhttps://astro.build/issues"
    );
  }
};
var parse_1 = parse2;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse2(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;
  var index = 0;
  while (index < str.length) {
    var eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol2 = Symbol.for("astro.responseSent");
var AstroCookie = class {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false")
      return false;
    if (this.value === "0")
      return false;
    return Boolean(this.value);
  }
};
var AstroCookies = class {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const serializeOptions = {
      expires: DELETED_EXPIRATION
    };
    if (options?.domain) {
      serializeOptions.domain = options.domain;
    }
    if (options?.path) {
      serializeOptions.path = options.path;
    }
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize_1(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed(options);
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed(options);
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize_1(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol2]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null)
      return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Behaves the same as AstroCookies.prototype.headers(),
   * but allows a warning when cookies are set after the instance is consumed.
   */
  static consume(cookies) {
    cookies.#consumed = true;
    return cookies.headers();
  }
  #ensureParsed(options = void 0) {
    if (!this.#requestValues) {
      this.#parse(options);
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse(options = void 0) {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse_1(raw, options);
  }
};
var astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
var consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.log;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
var RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
var RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_2, next) => next(),
  renderers: []
};
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    let target = redirect;
    for (const param of Object.keys(params)) {
      const paramValue = params[param];
      target = target.replace(`[${param}]`, paramValue);
      target = target.replace(`[...${param}]`, paramValue);
    }
    return target;
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = toCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      if (a.qualityValue > b.qualityValue) {
        return -1;
      } else if (a.qualityValue < b.qualityValue) {
        return 1;
      }
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentLocale.path;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales.map((locale) => {
        if (typeof locale === "string") {
          return locale;
        } else {
          return locale.codes.at(0);
        }
      });
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(loopLocale.path);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales) {
  for (const segment of pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale))
          continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async () => {
    nextCalled = true;
    responseFunctionPromise = responseFunction();
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    const handler = defineMiddleware((context, next) => {
      return next();
    });
    return handler;
  }
  return defineMiddleware((context, next) => {
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async () => {
        if (i < length - 1) {
          return applyHandle(i + 1, handleContext);
        } else {
          return next();
        }
      });
      return result;
    }
  });
}
function defineMiddleware(fn) {
  return fn;
}
function pathnameHasLocale(pathname, locales) {
  const segments = pathname.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function createI18nMiddleware(i18n, base, trailingSlash, buildFormat) {
  if (!i18n)
    return (_2, next) => next();
  const prefixAlways = (url, response, context) => {
    if (url.pathname === base + "/" || url.pathname === base) {
      if (shouldAppendForwardSlash(trailingSlash, buildFormat)) {
        return context.redirect(`${appendForwardSlash(joinPaths(base, i18n.defaultLocale))}`);
      } else {
        return context.redirect(`${joinPaths(base, i18n.defaultLocale)}`);
      }
    } else if (!pathnameHasLocale(url.pathname, i18n.locales)) {
      return notFound(response);
    }
    return void 0;
  };
  const prefixOtherLocales = (url, response) => {
    let pathnameContainsDefaultLocale = false;
    for (const segment of url.pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(i18n.defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return notFound(response);
    }
    return void 0;
  };
  const prefixAlwaysNoRedirect = (url, response) => {
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathnameHasLocale(url.pathname, i18n.locales))) {
      return notFound(response);
    }
    return void 0;
  };
  return async (context, next) => {
    const response = await next();
    const type = response.headers.get(ROUTE_TYPE_HEADER);
    if (type !== "page" && type !== "fallback") {
      return response;
    }
    const { url, currentLocale } = context;
    const { locales, defaultLocale, fallback, strategy } = i18n;
    switch (i18n.strategy) {
      case "domains-prefix-other-locales": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixOtherLocales(url, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        const result = prefixOtherLocales(url, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlwaysNoRedirect(url, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        const result = prefixAlwaysNoRedirect(url, response);
        if (result) {
          return result;
        }
        break;
      }
      case "pathname-prefix-always": {
        const result = prefixAlways(url, response, context);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlways(url, response, context);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    if (response.status >= 300 && fallback) {
      const fallbackKeys = i18n.fallback ? Object.keys(i18n.fallback) : [];
      const segments = url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          newPathname = url.pathname.replace(`/${urlLocale}`, ``);
        } else {
          newPathname = url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        return context.redirect(newPathname);
      }
    }
    return response;
  };
}
function notFound(response) {
  if (response.headers.get(REROUTE_DIRECTIVE_HEADER) === "no")
    return response;
  return new Response(null, {
    status: 404,
    headers: response.headers
  });
}
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
var VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return JSON.stringify(route.generate(validatedParams));
}
function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = correctIndexRoute(routeMatch.generate({ ...params }));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(pageNum + 1) }));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        })
      );
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev }
          }
        }
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route)
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
var RouteCache = class {
  logger;
  cache = {};
  mode;
  constructor(logger, mode = "production") {
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    const key = this.key(route);
    if (this.mode === "production" && this.cache[key]?.staticPaths) {
      this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
    }
    this.cache[key] = entry;
  }
  get(route) {
    return this.cache[this.key(route)];
  }
  key(route) {
    return `${route.route}_${route.component}`;
  }
};
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
var Pipeline = class {
  constructor(logger, manifest2, mode, renderers2, resolve, serverLike, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, mode), site = manifest2.site ? new URL(manifest2.site) : void 0) {
    this.logger = logger;
    this.manifest = manifest2;
    this.mode = mode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.serverLike = serverLike;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.internalMiddleware = [
      createI18nMiddleware(i18n, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat)
    ];
  }
  internalMiddleware;
};
async function getProps(opts2) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike } = opts2;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const params = getParams(route, pathname);
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike
  });
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length)
    return {};
  const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
  if (!paramsMatch)
    return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function getFunctionExpression(slot) {
  if (!slot)
    return;
  if (slot.expressions?.length !== 1)
    return;
  return slot.expressions[0];
}
var Slots = class {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots)
      return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name))
      return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
};
var RenderContext = class {
  constructor(pipeline, locals, middleware, pathname, request, routeData, status, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = new URL(request.url)) {
    this.pipeline = pipeline;
    this.locals = locals;
    this.middleware = middleware;
    this.pathname = pathname;
    this.request = request;
    this.routeData = routeData;
    this.status = status;
    this.cookies = cookies;
    this.params = params;
    this.url = url;
  }
  static create({
    locals = {},
    middleware,
    pathname,
    pipeline,
    request,
    routeData,
    status = 200
  }) {
    return new RenderContext(
      pipeline,
      locals,
      sequence(...pipeline.internalMiddleware, middleware ?? pipeline.middleware),
      pathname,
      request,
      routeData,
      status
    );
  }
  /**
   * The main function of the RenderContext.
   *
   * Use this function to render any route known to Astro.
   * It attempts to render a route. A route can be a:
   *
   * - page
   * - redirect
   * - endpoint
   * - fallback
   */
  async render(componentInstance) {
    const { cookies, middleware, pathname, pipeline, routeData } = this;
    const { logger, routeCache, serverLike, streaming } = pipeline;
    const props = await getProps({
      mod: componentInstance,
      routeData,
      routeCache,
      pathname,
      logger,
      serverLike
    });
    const apiContext = this.createAPIContext(props);
    const lastNext = async () => {
      switch (routeData.type) {
        case "endpoint":
          return renderEndpoint(componentInstance, apiContext, serverLike, logger);
        case "redirect":
          return renderRedirect(this);
        case "page": {
          const result = await this.createResult(componentInstance);
          let response2;
          try {
            response2 = await renderPage(
              result,
              componentInstance?.default,
              props,
              {},
              streaming,
              routeData
            );
          } catch (e) {
            result.cancelled = true;
            throw e;
          }
          response2.headers.set(ROUTE_TYPE_HEADER, "page");
          if (routeData.route === "/404" || routeData.route === "/500") {
            response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          }
          return response2;
        }
        case "fallback": {
          return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
        }
      }
    };
    const response = await callMiddleware(middleware, apiContext, lastNext);
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, cookies);
    return response;
  }
  createAPIContext(props) {
    const renderContext = this;
    const { cookies, params, pipeline, request, url } = this;
    const generator = `Astro v${ASTRO_VERSION}`;
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    return {
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      generator,
      get locals() {
        return renderContext.locals;
      },
      // TODO(breaking): disallow replacing the locals object
      set locals(val) {
        if (typeof val !== "object") {
          throw new AstroError(LocalsNotAnObject);
        } else {
          renderContext.locals = val;
          Reflect.set(request, clientLocalsSymbol, val);
        }
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      props,
      redirect,
      request,
      site: pipeline.site,
      url
    };
  }
  async createResult(mod) {
    const { cookies, pathname, pipeline, routeData, status } = this;
    const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = Boolean(mod.partial);
    const response = {
      status,
      statusText: "OK",
      get headers() {
        return headers;
      },
      // Disallow `Astro.response.headers = new Headers`
      set headers(_2) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const result = {
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies,
      /** This function returns the `Astro` faux-global */
      createAstro: (astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots),
      links,
      partial,
      pathname,
      renderers: renderers2,
      resolve,
      response,
      scripts,
      styles,
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        headInTree: false,
        extraHead: [],
        propagators: /* @__PURE__ */ new Set()
      }
    };
    return result;
  }
  createAstro(result, astroGlobalPartial, props, slotValues) {
    const renderContext = this;
    const { cookies, locals, params, pipeline, request, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (request[responseSentSymbol]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const slots = new Slots(result, slotValues, pipeline.logger);
    const astroGlobalCombined = {
      ...astroGlobalPartial,
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      props,
      locals,
      redirect,
      request,
      response,
      slots,
      site: pipeline.site,
      url
    };
    return astroGlobalCombined;
  }
  clientAddress() {
    const { pipeline, request } = this;
    if (clientAddressSymbol in request) {
      return Reflect.get(request, clientAddressSymbol);
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    } else {
      throw new AstroError(StaticClientAddressNotAvailable);
    }
  }
  /**
   * API Context may be created multiple times per request, i18n data needs to be computed only once.
   * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
   */
  #currentLocale;
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n)
      return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    return this.#currentLocale ??= computeCurrentLocale(routeData.route, locales) ?? computeCurrentLocale(url.pathname, locales) ?? fallbackTo;
  }
  #preferredLocale;
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n)
      return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  #preferredLocaleList;
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n)
      return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
};
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  if (!assetsPrefix)
    return "";
  if (typeof assetsPrefix === "string")
    return assetsPrefix;
  const dotLessFileExtension = fileExtension2.slice(1);
  if (assetsPrefix[dotLessFileExtension]) {
    return assetsPrefix[dotLessFileExtension];
  }
  return assetsPrefix.fallback;
}
function createAssetLink(href, base, assetsPrefix) {
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(href), assetsPrefix);
    return joinPaths(pf, slash(href));
  } else if (base) {
    return prependForwardSlash(joinPaths(base, slash(href)));
  } else {
    return href;
  }
}
function createStylesheetElement(stylesheet, base, assetsPrefix) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix) {
  return new Set(stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix)));
}
function createModuleScriptElement(script, base, assetsPrefix) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push({
      component: DEFAULT_404_COMPONENT,
      generate: () => "",
      params: [],
      pattern: /\/404/,
      prerender: false,
      segments: [[{ content: "404", dynamic: false, spread: false }]],
      type: "page",
      route: "/404",
      fallbackRoutes: [],
      isIndex: false
    });
  }
  return manifest2;
}
function matchRoute(pathname, manifest2) {
  const decodedPathname = decodeURI(pathname);
  return manifest2.routes.find((route) => {
    return route.pattern.test(decodedPathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(decodedPathname));
  });
}
var AppPipeline = class extends Pipeline {
  static create({
    logger,
    manifest: manifest2,
    mode,
    renderers: renderers2,
    resolve,
    serverLike,
    streaming
  }) {
    return new AppPipeline(logger, manifest2, mode, renderers2, resolve, serverLike, streaming);
  }
  headElements(routeData) {
    const routeInfo = this.manifest.routes.find((route) => route.routeData === routeData);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? []);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
};
var _manifest;
var _manifestData;
var _logger;
var _baseWithoutTrailingSlash;
var _pipeline;
var _adapterLogger;
var _renderOptionsDeprecationWarningShown;
var _createPipeline;
var createPipeline_fn;
var _getPathnameFromRequest;
var getPathnameFromRequest_fn;
var _computePathnameFromDomain;
var computePathnameFromDomain_fn;
var _logRenderOptionsDeprecationWarning;
var logRenderOptionsDeprecationWarning_fn;
var _renderError;
var renderError_fn;
var _mergeResponses;
var mergeResponses_fn;
var _getDefaultStatusCode;
var getDefaultStatusCode_fn;
var _getModuleForRoute;
var getModuleForRoute_fn;
var _App = class {
  constructor(manifest2, streaming = true) {
    __privateAdd(this, _createPipeline);
    __privateAdd(this, _getPathnameFromRequest);
    __privateAdd(this, _computePathnameFromDomain);
    __privateAdd(this, _logRenderOptionsDeprecationWarning);
    __privateAdd(this, _renderError);
    __privateAdd(this, _mergeResponses);
    __privateAdd(this, _getDefaultStatusCode);
    __privateAdd(this, _getModuleForRoute);
    __privateAdd(this, _manifest, void 0);
    __privateAdd(this, _manifestData, void 0);
    __privateAdd(this, _logger, new Logger({
      dest: consoleLogDestination,
      level: "info"
    }));
    __privateAdd(this, _baseWithoutTrailingSlash, void 0);
    __privateAdd(this, _pipeline, void 0);
    __privateAdd(this, _adapterLogger, void 0);
    __privateAdd(this, _renderOptionsDeprecationWarningShown, false);
    __privateSet(this, _manifest, manifest2);
    __privateSet(this, _manifestData, ensure404Route({
      routes: manifest2.routes.map((route) => route.routeData)
    }));
    __privateSet(this, _baseWithoutTrailingSlash, removeTrailingForwardSlash(__privateGet(this, _manifest).base));
    __privateSet(this, _pipeline, __privateMethod(this, _createPipeline, createPipeline_fn).call(this, streaming));
    __privateSet(this, _adapterLogger, new AstroIntegrationLogger(
      __privateGet(this, _logger).options,
      __privateGet(this, _manifest).adapterName
    ));
  }
  getAdapterLogger() {
    return __privateGet(this, _adapterLogger);
  }
  set setManifestData(newManifestData) {
    __privateSet(this, _manifestData, newManifestData);
  }
  removeBase(pathname) {
    if (pathname.startsWith(__privateGet(this, _manifest).base)) {
      return pathname.slice(__privateGet(this, _baseWithoutTrailingSlash).length + 1);
    }
    return pathname;
  }
  match(request) {
    const url = new URL(request.url);
    if (__privateGet(this, _manifest).assets.has(url.pathname))
      return void 0;
    let pathname = __privateMethod(this, _computePathnameFromDomain, computePathnameFromDomain_fn).call(this, request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    let routeData = matchRoute(pathname, __privateGet(this, _manifestData));
    if (!routeData || routeData.prerender)
      return void 0;
    return routeData;
  }
  async render(request, routeDataOrOptions, maybeLocals) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    if (routeDataOrOptions && ("addCookieHeader" in routeDataOrOptions || "clientAddress" in routeDataOrOptions || "locals" in routeDataOrOptions || "routeData" in routeDataOrOptions)) {
      if ("addCookieHeader" in routeDataOrOptions) {
        addCookieHeader = routeDataOrOptions.addCookieHeader;
      }
      if ("clientAddress" in routeDataOrOptions) {
        clientAddress = routeDataOrOptions.clientAddress;
      }
      if ("routeData" in routeDataOrOptions) {
        routeData = routeDataOrOptions.routeData;
      }
      if ("locals" in routeDataOrOptions) {
        locals = routeDataOrOptions.locals;
      }
    } else {
      routeData = routeDataOrOptions;
      locals = maybeLocals;
      if (routeDataOrOptions || locals) {
        __privateMethod(this, _logRenderOptionsDeprecationWarning, logRenderOptionsDeprecationWarning_fn).call(this);
      }
    }
    if (locals) {
      if (typeof locals !== "object") {
        __privateGet(this, _logger).error(null, new AstroError(LocalsNotAnObject).stack);
        return __privateMethod(this, _renderError, renderError_fn).call(this, request, { status: 500 });
      }
      Reflect.set(request, clientLocalsSymbol, locals);
    }
    if (clientAddress) {
      Reflect.set(request, clientAddressSymbol, clientAddress);
    }
    if (request.url !== collapseDuplicateSlashes(request.url)) {
      request = new Request(collapseDuplicateSlashes(request.url), request);
    }
    if (!routeData) {
      routeData = this.match(request);
    }
    if (!routeData) {
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, { locals, status: 404 });
    }
    const pathname = __privateMethod(this, _getPathnameFromRequest, getPathnameFromRequest_fn).call(this, request);
    const defaultStatus = __privateMethod(this, _getDefaultStatusCode, getDefaultStatusCode_fn).call(this, routeData, pathname);
    const mod = await __privateMethod(this, _getModuleForRoute, getModuleForRoute_fn).call(this, routeData);
    let response;
    try {
      const renderContext = RenderContext.create({
        pipeline: __privateGet(this, _pipeline),
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus
      });
      response = await renderContext.render(await mod.page());
    } catch (err) {
      __privateGet(this, _logger).error(null, err.stack || err.message || String(err));
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, { locals, status: 500 });
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
        locals,
        response,
        status: response.status
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of _App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
};
var App = _App;
_manifest = /* @__PURE__ */ new WeakMap();
_manifestData = /* @__PURE__ */ new WeakMap();
_logger = /* @__PURE__ */ new WeakMap();
_baseWithoutTrailingSlash = /* @__PURE__ */ new WeakMap();
_pipeline = /* @__PURE__ */ new WeakMap();
_adapterLogger = /* @__PURE__ */ new WeakMap();
_renderOptionsDeprecationWarningShown = /* @__PURE__ */ new WeakMap();
_createPipeline = /* @__PURE__ */ new WeakSet();
createPipeline_fn = function(streaming = false) {
  return AppPipeline.create({
    logger: __privateGet(this, _logger),
    manifest: __privateGet(this, _manifest),
    mode: "production",
    renderers: __privateGet(this, _manifest).renderers,
    resolve: async (specifier) => {
      if (!(specifier in __privateGet(this, _manifest).entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = __privateGet(this, _manifest).entryModules[specifier];
      switch (true) {
        case bundlePath.startsWith("data:"):
        case bundlePath.length === 0: {
          return bundlePath;
        }
        default: {
          return createAssetLink(bundlePath, __privateGet(this, _manifest).base, __privateGet(this, _manifest).assetsPrefix);
        }
      }
    },
    serverLike: true,
    streaming
  });
};
_getPathnameFromRequest = /* @__PURE__ */ new WeakSet();
getPathnameFromRequest_fn = function(request) {
  const url = new URL(request.url);
  const pathname = prependForwardSlash(this.removeBase(url.pathname));
  return pathname;
};
_computePathnameFromDomain = /* @__PURE__ */ new WeakSet();
computePathnameFromDomain_fn = function(request) {
  let pathname = void 0;
  const url = new URL(request.url);
  if (__privateGet(this, _manifest).i18n && (__privateGet(this, _manifest).i18n.strategy === "domains-prefix-always" || __privateGet(this, _manifest).i18n.strategy === "domains-prefix-other-locales" || __privateGet(this, _manifest).i18n.strategy === "domains-prefix-always-no-redirect")) {
    let host = request.headers.get("X-Forwarded-Host");
    let protocol = request.headers.get("X-Forwarded-Proto");
    if (protocol) {
      protocol = protocol + ":";
    } else {
      protocol = url.protocol;
    }
    if (!host) {
      host = request.headers.get("Host");
    }
    if (host && protocol) {
      host = host.split(":")[0];
      try {
        let locale;
        const hostAsUrl = new URL(`${protocol}//${host}`);
        for (const [domainKey, localeValue] of Object.entries(
          __privateGet(this, _manifest).i18n.domainLookupTable
        )) {
          const domainKeyAsUrl = new URL(domainKey);
          if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
            locale = localeValue;
            break;
          }
        }
        if (locale) {
          pathname = prependForwardSlash(
            joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
          );
          if (url.pathname.endsWith("/")) {
            pathname = appendForwardSlash(pathname);
          }
        }
      } catch (e) {
        __privateGet(this, _logger).error(
          "router",
          `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
        );
        __privateGet(this, _logger).error("router", `Error: ${e}`);
      }
    }
  }
  return pathname;
};
_logRenderOptionsDeprecationWarning = /* @__PURE__ */ new WeakSet();
logRenderOptionsDeprecationWarning_fn = function() {
  if (__privateGet(this, _renderOptionsDeprecationWarningShown))
    return;
  __privateGet(this, _logger).warn(
    "deprecated",
    `The adapter ${__privateGet(this, _manifest).adapterName} is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`
  );
  __privateSet(this, _renderOptionsDeprecationWarningShown, true);
};
_renderError = /* @__PURE__ */ new WeakSet();
renderError_fn = async function(request, { locals, status, response: originalResponse, skipMiddleware = false }) {
  const errorRoutePath = `/${status}${__privateGet(this, _manifest).trailingSlash === "always" ? "/" : ""}`;
  const errorRouteData = matchRoute(errorRoutePath, __privateGet(this, _manifestData));
  const url = new URL(request.url);
  if (errorRouteData) {
    if (errorRouteData.prerender) {
      const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
      const statusURL = new URL(
        `${__privateGet(this, _baseWithoutTrailingSlash)}/${status}${maybeDotHtml}`,
        url
      );
      const response2 = await fetch(statusURL.toString());
      const override = { status };
      return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse, override);
    }
    const mod = await __privateMethod(this, _getModuleForRoute, getModuleForRoute_fn).call(this, errorRouteData);
    try {
      const renderContext = RenderContext.create({
        locals,
        pipeline: __privateGet(this, _pipeline),
        middleware: skipMiddleware ? (_2, next) => next() : void 0,
        pathname: __privateMethod(this, _getPathnameFromRequest, getPathnameFromRequest_fn).call(this, request),
        request,
        routeData: errorRouteData,
        status
      });
      const response2 = await renderContext.render(await mod.page());
      return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse);
    } catch {
      if (skipMiddleware === false) {
        return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
          locals,
          status,
          response: originalResponse,
          skipMiddleware: true
        });
      }
    }
  }
  const response = __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, new Response(null, { status }), originalResponse);
  Reflect.set(response, responseSentSymbol, true);
  return response;
};
_mergeResponses = /* @__PURE__ */ new WeakSet();
mergeResponses_fn = function(newResponse, originalResponse, override) {
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponse.headers
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
  } catch {
  }
  return new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: new Headers([
      ...Array.from(newResponse.headers),
      ...Array.from(originalResponse.headers)
    ])
  });
};
_getDefaultStatusCode = /* @__PURE__ */ new WeakSet();
getDefaultStatusCode_fn = function(routeData, pathname) {
  if (!routeData.pattern.exec(pathname)) {
    for (const fallbackRoute of routeData.fallbackRoutes) {
      if (fallbackRoute.pattern.test(pathname)) {
        return 302;
      }
    }
  }
  const route = removeTrailingForwardSlash(routeData.route);
  if (route.endsWith("/404"))
    return 404;
  if (route.endsWith("/500"))
    return 500;
  return 200;
};
_getModuleForRoute = /* @__PURE__ */ new WeakSet();
getModuleForRoute_fn = async function(route) {
  if (route.component === DEFAULT_404_COMPONENT) {
    return {
      page: async () => ({ default: () => new Response(null, { status: 404 }) }),
      renderers: []
    };
  }
  if (route.type === "redirect") {
    return RedirectSinglePageBuiltModule;
  } else {
    if (__privateGet(this, _manifest).pageMap) {
      const importComponentInstance = __privateGet(this, _manifest).pageMap.get(route.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      const pageModule = await importComponentInstance();
      return pageModule;
    } else if (__privateGet(this, _manifest).pageModule) {
      const importComponentInstance = __privateGet(this, _manifest).pageModule;
      return importComponentInstance;
    } else {
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
};
__publicField(App, "getSetCookieFromResponse", getSetCookiesFromResponse);
function createExports(manifest2) {
  const app = new App(manifest2);
  const fetch2 = async (request, env, context) => {
    const { pathname } = new URL(request.url);
    if (manifest2.assets.has(pathname)) {
      return env.ASSETS.fetch(request.url.replace(/\.html$/, ""));
    }
    const routeData = app.match(request);
    if (!routeData) {
      const asset = await env.ASSETS.fetch(request.url.replace(/index.html$/, "").replace(/\.html$/, ""));
      if (asset.status !== 404) {
        return asset;
      }
    }
    Reflect.set(request, Symbol.for("astro.clientAddress"), request.headers.get("cf-connecting-ip"));
    process.env.ASTRO_STUDIO_APP_TOKEN ??= (() => {
      if (typeof env.ASTRO_STUDIO_APP_TOKEN === "string") {
        return env.ASTRO_STUDIO_APP_TOKEN;
      }
    })();
    const locals = {
      runtime: {
        waitUntil: (promise) => {
          context.waitUntil(promise);
        },
        env,
        cf: request.cf,
        caches
      }
    };
    const response = await app.render(request, { routeData, locals });
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  };
  return { default: { fetch: fetch2 } };
}
var serverEntrypointModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createExports
}, Symbol.toStringTag, { value: "Module" }));
var _page0 = () => Promise.resolve().then(() => (init_image_endpoint_RvDj3_CK(), image_endpoint_RvDj3_CK_exports));
var _page1 = () => Promise.resolve().then(() => (init_test_D_H_EmVF(), test_D_H_EmVF_exports));
var _page2 = () => Promise.resolve().then(() => (init_index_B6euTALA(), index_B6euTALA_exports));
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/test.astro", _page1],
  ["src/pages/index.ts", _page2]
]);
var _manifest2 = Object.assign(manifest, {
  pageMap,
  renderers,
  middleware: onRequest
});
var _args = void 0;
var _exports = createExports(_manifest2);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (_start in serverEntrypointModule) {
  serverEntrypointModule[_start](_manifest2, _args);
}

// node_modules/wrangler/templates/pages-dev-util.ts
init_checked_fetch();
init_modules_watch_stub();
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}

// .wrangler/tmp/pages-L6EXwU/esvq4apldaa.js
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/favicon.svg",
    "/_astro/*"
  ]
};
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        if (__astrojsSsrVirtualEntry.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return __astrojsSsrVirtualEntry.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
};
var middleware_ensure_req_body_drained_default = drainBody;
var wrap = void 0;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;
var wrap2 = void 0;

// .wrangler/tmp/bundle-sphDBH/middleware-insertion-facade.js
var envWrappers = [wrap, wrap2].filter(Boolean);
var facade = {
  ...pages_dev_pipeline_default,
  envWrappers,
  middleware: [
    middleware_ensure_req_body_drained_default,
    middleware_miniflare3_json_error_default,
    ...pages_dev_pipeline_default.middleware ? pages_dev_pipeline_default.middleware : []
  ].filter(Boolean)
};
var middleware_insertion_facade_default = facade;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-sphDBH/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
var __facade_modules_fetch__ = function(request, env, ctx) {
  if (middleware_insertion_facade_default.fetch === void 0)
    throw new Error("Handler does not export a fetch() function.");
  return middleware_insertion_facade_default.fetch(request, env, ctx);
};
function getMaskedEnv(rawEnv) {
  let env = rawEnv;
  if (middleware_insertion_facade_default.envWrappers && middleware_insertion_facade_default.envWrappers.length > 0) {
    for (const wrapFn of middleware_insertion_facade_default.envWrappers) {
      env = wrapFn(env);
    }
  }
  return env;
}
var registeredMiddleware = false;
var facade2 = {
  ...middleware_insertion_facade_default.tail && {
    tail: maskHandlerEnv(middleware_insertion_facade_default.tail)
  },
  ...middleware_insertion_facade_default.trace && {
    trace: maskHandlerEnv(middleware_insertion_facade_default.trace)
  },
  ...middleware_insertion_facade_default.scheduled && {
    scheduled: maskHandlerEnv(middleware_insertion_facade_default.scheduled)
  },
  ...middleware_insertion_facade_default.queue && {
    queue: maskHandlerEnv(middleware_insertion_facade_default.queue)
  },
  ...middleware_insertion_facade_default.test && {
    test: maskHandlerEnv(middleware_insertion_facade_default.test)
  },
  ...middleware_insertion_facade_default.email && {
    email: maskHandlerEnv(middleware_insertion_facade_default.email)
  },
  fetch(request, rawEnv, ctx) {
    const env = getMaskedEnv(rawEnv);
    if (middleware_insertion_facade_default.middleware && middleware_insertion_facade_default.middleware.length > 0) {
      if (!registeredMiddleware) {
        registeredMiddleware = true;
        for (const middleware of middleware_insertion_facade_default.middleware) {
          __facade_register__(middleware);
        }
      }
      const __facade_modules_dispatch__ = function(type, init2) {
        if (type === "scheduled" && middleware_insertion_facade_default.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return middleware_insertion_facade_default.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(
        request,
        env,
        ctx,
        __facade_modules_dispatch__,
        __facade_modules_fetch__
      );
    } else {
      return __facade_modules_fetch__(request, env, ctx);
    }
  }
};
function maskHandlerEnv(handler) {
  return (data, env, ctx) => handler(data, getMaskedEnv(env), ctx);
}
var middleware_loader_entry_default = facade2;
export {
  middleware_loader_entry_default as default,
  pageMap
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*! https://mths.be/cssesc v3.0.0 by @mathias */
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-server-legacy.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=esvq4apldaa.js.map
