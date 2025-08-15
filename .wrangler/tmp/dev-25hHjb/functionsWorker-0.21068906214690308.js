var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-NL43no/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
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
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-OGihfm/functionsWorker-0.21068906214690308.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
var compose = /* @__PURE__ */ __name2((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
    __name2(dispatch, "dispatch");
  };
}, "compose");
var GET_MATCH_RESULT = Symbol();
var parseBody = /* @__PURE__ */ __name2(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
__name2(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
__name2(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name2((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name2((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");
var splitPath = /* @__PURE__ */ __name2((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name2((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name2((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name2((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name2((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name2((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name2((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name2((request) => {
  const url = request.url;
  const start = url.indexOf(
    "/",
    url.charCodeAt(9) === 58 ? 13 : 8
  );
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name2((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name2((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name2((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name2((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name2((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name2((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;
var tryDecodeURIComponent = /* @__PURE__ */ __name2((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  static {
    __name2(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : void 0;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name2((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name2((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name2(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name2((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  static {
    __name2(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name2((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name2((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name2(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name2((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name2((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name2((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name2((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name2((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name2((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name2((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name2((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name2((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name2((html, arg, headers) => {
    const res = /* @__PURE__ */ __name2((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name2((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name2(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
  static {
    __name2(this, "UnsupportedPathError");
  }
};
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
var notFoundHandler = /* @__PURE__ */ __name2((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name2((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  static {
    __name2(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name2(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name2((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name2((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name2((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name2(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name2((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name2((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name2(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
__name2(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  static {
    __name2(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};
var Trie = class {
  static {
    __name(this, "Trie");
  }
  static {
    __name2(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
__name2(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
__name2(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes2) {
  const trie = new Trie();
  const handlerData = [];
  if (routes2.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes2.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
__name2(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
__name2(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  static {
    __name2(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes2 = this.#routes;
    if (!middleware || !routes2) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes2].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes2).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes2[m]).forEach(
            (p) => re.test(p) && routes2[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes2).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes2[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes2[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match2 = path2.match(matcher[0]);
      if (!match2) {
        return [[], emptyParam];
      }
      const index = match2.indexOf("", 1);
      return [matcher[1][index], match2];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const routes2 = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes2.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes2.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes2);
    }
  }
};
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  static {
    __name2(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes2 = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes2.length; i2 < len2; i2++) {
          router.add(...routes2[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node2");
  }
  static {
    __name2(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  static {
    __name2(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono2");
  }
  static {
    __name2(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};
var handle = /* @__PURE__ */ __name2((app2) => (eventContext) => {
  return app2.fetch(
    eventContext.request,
    { ...eventContext.env, eventContext },
    {
      waitUntil: eventContext.waitUntil,
      passThroughOnException: eventContext.passThroughOnException,
      props: {}
    }
  );
}, "handle");
var questions = [
  {
    "id": 1,
    "type": "multiple",
    "question": "\u6839\u636E\u7B14\u8BB0\u5185\u5BB9\uFF0C\u5173\u4E8EJava\u96C6\u5408\uFF08Collection\uFF09\u4E0E\u6570\u7EC4\uFF08Array\uFF09\u7684\u5BF9\u6BD4\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    "options": [
      "\u6570\u7EC4\u7684\u957F\u5EA6\u662F\u4E0D\u53EF\u53D8\u7684\uFF0C\u800C\u96C6\u5408\u7684\u957F\u5EA6\u662F\u53EF\u53D8\u7684\u3002",
      "\u6570\u7EC4\u53EF\u4EE5\u5B58\u50A8\u57FA\u672C\u6570\u636E\u7C7B\u578B\u548C\u5F15\u7528\u6570\u636E\u7C7B\u578B\uFF0C\u800C\u96C6\u5408\u53EA\u80FD\u5B58\u50A8\u5F15\u7528\u6570\u636E\u7C7B\u578B\u3002",
      "\u5F53\u5904\u7406\u4E00\u7EC4\u6570\u91CF\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u52A8\u6001\u53D8\u5316\u7684\u6570\u636E\u65F6\uFF0C\u96C6\u5408\u662F\u6BD4\u6570\u7EC4\u66F4\u597D\u7684\u9009\u62E9\u3002",
      "\u96C6\u5408\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u53EA\u80FD\u662F\u94FE\u8868\u6216\u54C8\u5E0C\u8868\uFF0C\u800C\u6570\u7EC4\u662F\u8FDE\u7EED\u7684\u5185\u5B58\u7A7A\u95F4\u3002"
    ],
    "answer": [
      "\u6570\u7EC4\u7684\u957F\u5EA6\u662F\u4E0D\u53EF\u53D8\u7684\uFF0C\u800C\u96C6\u5408\u7684\u957F\u5EA6\u662F\u53EF\u53D8\u7684\u3002",
      "\u6570\u7EC4\u53EF\u4EE5\u5B58\u50A8\u57FA\u672C\u6570\u636E\u7C7B\u578B\u548C\u5F15\u7528\u6570\u636E\u7C7B\u578B\uFF0C\u800C\u96C6\u5408\u53EA\u80FD\u5B58\u50A8\u5F15\u7528\u6570\u636E\u7C7B\u578B\u3002",
      "\u5F53\u5904\u7406\u4E00\u7EC4\u6570\u91CF\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u52A8\u6001\u53D8\u5316\u7684\u6570\u636E\u65F6\uFF0C\u96C6\u5408\u662F\u6BD4\u6570\u7EC4\u66F4\u597D\u7684\u9009\u62E9\u3002"
    ],
    "score": 3,
    "explanation": "\u8FD9\u662F\u96C6\u5408\u4E0E\u6570\u7EC4\u6700\u6838\u5FC3\u7684\u533A\u522B\u3002\u96C6\u5408\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u591A\u6837\u7684\uFF0C\u5305\u62EC\u6570\u7EC4\uFF08\u5982ArrayList\uFF09\u3001\u94FE\u8868\uFF08\u5982LinkedList\uFF09\u3001\u54C8\u5E0C\u8868\uFF08\u5982HashSet\uFF09\u3001\u7EA2\u9ED1\u6811\uFF08\u5982TreeSet\uFF09\u7B49\uFF0C\u6240\u4EE5\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002"
  },
  {
    "id": 2,
    "type": "single",
    "question": "\u5728Java\u96C6\u5408\u6846\u67B6\u4E2D\uFF0C\u54EA\u4E00\u4E2A\u9876\u5C42\u63A5\u53E3\u7528\u4E8E\u8868\u793A\u952E\u503C\u5BF9\uFF08Key-Value Pair\uFF09\u7684\u96C6\u5408\uFF1F",
    "options": ["Collection", "List", "Set", "Map"],
    "answer": "Map",
    "score": 1,
    "explanation": "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0CJava\u96C6\u5408\u6846\u67B6\u5206\u4E3A\u4E24\u5927\u9876\u5C42\u63A5\u53E3\uFF1A`Collection`\u7528\u4E8E\u5904\u7406\u72EC\u7ACB\u7684\u3001\u5355\u4E2A\u7684\u5143\u7D20\uFF1B`Map`\u7528\u4E8E\u5904\u7406\u952E\u503C\u5BF9\u6570\u636E\u3002"
  },
  {
    "id": 3,
    "type": "short_answer",
    "question": "\u8BF7\u7B80\u8FF0`List`\u548C`Set`\u63A5\u53E3\u5728\u6838\u5FC3\u7279\u6027\u4E0A\u7684\u4E3B\u8981\u533A\u522B\u3002",
    "answer": "`List`\u63A5\u53E3\u7684\u7279\u70B9\u662F\u5143\u7D20\u6709\u5E8F\uFF08\u6309\u63D2\u5165\u987A\u5E8F\u5B58\u50A8\uFF09\u4E14\u53EF\u91CD\u590D\u3002`Set`\u63A5\u53E3\u7684\u7279\u70B9\u662F\u5143\u7D20\u901A\u5E38\u65E0\u5E8F\uFF08\u4E0D\u4FDD\u8BC1\u63D2\u5165\u987A\u5E8F\uFF09\u4E14\u4E0D\u53EF\u91CD\u590D\u3002",
    "score": 2.5,
    "explanation": "\u8FD9\u662F\u5BF9`Collection`\u4E24\u5927\u6838\u5FC3\u5B50\u63A5\u53E3\u57FA\u672C\u7279\u5F81\u7684\u8003\u5BDF\uFF0C\u7406\u89E3\u5B83\u4EEC\u7684\u533A\u522B\u662F\u9009\u62E9\u6B63\u786E\u96C6\u5408\u7C7B\u7684\u7B2C\u4E00\u6B65\u3002"
  },
  {
    "id": 4,
    "type": "single",
    "question": "\u5728\u4F55\u79CD\u4E1A\u52A1\u573A\u666F\u4E0B\uFF0C\u4F7F\u7528`LinkedList`\u4F1A\u6BD4`ArrayList`\u5177\u6709\u660E\u663E\u7684\u6027\u80FD\u4F18\u52BF\uFF1F",
    "options": [
      "\u9700\u8981\u9891\u7E41\u5730\u6839\u636E\u7D22\u5F15\u968F\u673A\u8BBF\u95EE\u96C6\u5408\u4E2D\u7684\u5143\u7D20\u3002",
      "\u96C6\u5408\u4E2D\u7EDD\u5927\u591A\u6570\u64CD\u4F5C\u662F\u904D\u5386\u5143\u7D20\u3002",
      "\u9700\u8981\u9891\u7E41\u5730\u5728\u5217\u8868\u7684\u5934\u90E8\u548C\u5C3E\u90E8\u8FDB\u884C\u63D2\u5165\u548C\u5220\u9664\u64CD\u4F5C\u3002",
      "\u96C6\u5408\u521B\u5EFA\u540E\uFF0C\u5143\u7D20\u6570\u91CF\u56FA\u5B9A\u4E0D\u53D8\uFF0C\u4E3B\u8981\u7528\u4E8E\u5B58\u50A8\u548C\u8BFB\u53D6\u3002"
    ],
    "answer": "\u9700\u8981\u9891\u7E41\u5730\u5728\u5217\u8868\u7684\u5934\u90E8\u548C\u5C3E\u90E8\u8FDB\u884C\u63D2\u5165\u548C\u5220\u9664\u64CD\u4F5C\u3002",
    "score": 3,
    "explanation": "\u6839\u636E\u7B14\u8BB0\u4E2D\u7684\u9009\u578B\u603B\u7ED3\uFF0C`LinkedList`\u7684\u5E95\u5C42\u662F\u53CC\u5411\u94FE\u8868\uFF0C\u5BF9\u5934\u5C3E\u8282\u70B9\u7684\u64CD\u4F5C\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\uFF0C\u8FDC\u4F18\u4E8E`ArrayList`\u7684O(n)\u3002\u800C\u968F\u673A\u8BBF\u95EE\u662F`ArrayList`\u7684\u5F3A\u9879\uFF08O(1)\uFF09\u3002"
  },
  {
    "id": 5,
    "type": "multiple",
    "question": "\u5173\u4E8E`ArrayList`\u7684\u5E95\u5C42\u5B9E\u73B0\u548C\u7279\u6027\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    "options": [
      "\u5B83\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u52A8\u6001\u6570\u7EC4\u3002",
      "\u901A\u8FC7\u7D22\u5F15`get(index)`\u8BBF\u95EE\u5143\u7D20\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\u3002",
      "\u5728\u5217\u8868\u7684\u4E2D\u95F4\u4F4D\u7F6E\u63D2\u5165\u6216\u5220\u9664\u5143\u7D20\uFF0C\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u901A\u5E38\u4E3AO(n)\u3002",
      "\u5F53\u5BB9\u91CF\u4E0D\u8DB3\u65F6\uFF0C`ArrayList`\u4F1A\u81EA\u52A8\u6269\u5BB9\uFF0C\u521B\u5EFA\u4E00\u4E2A\u66F4\u5927\u7684\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u6240\u6709\u65E7\u5143\u7D20\u3002"
    ],
    "answer": [
      "\u5B83\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u52A8\u6001\u6570\u7EC4\u3002",
      "\u901A\u8FC7\u7D22\u5F15`get(index)`\u8BBF\u95EE\u5143\u7D20\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\u3002",
      "\u5728\u5217\u8868\u7684\u4E2D\u95F4\u4F4D\u7F6E\u63D2\u5165\u6216\u5220\u9664\u5143\u7D20\uFF0C\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u901A\u5E38\u4E3AO(n)\u3002",
      "\u5F53\u5BB9\u91CF\u4E0D\u8DB3\u65F6\uFF0C`ArrayList`\u4F1A\u81EA\u52A8\u6269\u5BB9\uFF0C\u521B\u5EFA\u4E00\u4E2A\u66F4\u5927\u7684\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u6240\u6709\u65E7\u5143\u7D20\u3002"
    ],
    "score": 4,
    "explanation": "\u8FD9\u56DB\u4E2A\u9009\u9879\u5168\u9762\u5730\u6982\u62EC\u4E86`ArrayList`\u7684\u6838\u5FC3\u5DE5\u4F5C\u539F\u7406\u548C\u6027\u80FD\u7279\u70B9\uFF0C\u8FD9\u4E9B\u90FD\u662FJava\u5F00\u53D1\u4E2D\u5FC5\u987B\u638C\u63E1\u7684\u57FA\u7840\u77E5\u8BC6\u3002"
  },
  {
    "id": 6,
    "type": "short_answer",
    "question": "\u4E3A\u4EC0\u4E48\u5728\u521B\u5EFA `ArrayList` \u65F6\uFF0C\u63A8\u8350\u6307\u5B9A\u4E00\u4E2A\u9884\u4F30\u7684\u521D\u59CB\u5BB9\u91CF\uFF08\u5982 `new ArrayList(100)`\uFF09\uFF1F\u8FD9\u6837\u505A\u6709\u4EC0\u4E48\u597D\u5904\uFF1F",
    "answer": "\u63A8\u8350\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u662F\u4E3A\u4E86\u6027\u80FD\u4F18\u5316\u3002\u5982\u679C\u9884\u5148\u77E5\u9053\u5927\u81F4\u7684\u6570\u636E\u91CF\uFF0C\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u53EF\u4EE5\u907F\u514D\u6216\u51CF\u5C11`ArrayList`\u5728\u6DFB\u52A0\u5143\u7D20\u8FC7\u7A0B\u4E2D\u56E0\u8D85\u51FA\u5BB9\u91CF\u800C\u89E6\u53D1\u7684\u591A\u6B21\u201C\u6269\u5BB9\u201D\u64CD\u4F5C\u3002\u56E0\u4E3A\u6BCF\u6B21\u6269\u5BB9\u90FD\u9700\u8981\u521B\u5EFA\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u65E7\u6570\u7EC4\u7684\u5168\u90E8\u5143\u7D20\uFF0C\u8FD9\u662F\u4E00\u4E2A\u8017\u65F6\u7684\u8FC7\u7A0B\u3002",
    "score": 3,
    "explanation": "\u8FD9\u662F\u4E00\u4E2A\u91CD\u8981\u7684\u6027\u80FD\u4F18\u5316\u6280\u5DE7\u3002\u5728\u80FD\u9884\u4F30\u6570\u636E\u91CF\u7684\u573A\u666F\u4E0B\uFF08\u4F8B\u5982\uFF0C\u4ECE\u6570\u636E\u5E93\u4E00\u6B21\u6027\u67E5\u8BE2N\u6761\u8BB0\u5F55\u653E\u5165List\uFF09\uFF0C\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u662F\u4E13\u4E1A\u5F00\u53D1\u8005\u7684\u4E60\u60EF\u3002"
  },
  {
    "id": 7,
    "type": "code",
    "question": "\u8BF7\u4F7F\u7528 `LinkedList` \u7684\u7279\u6709API\uFF0C\u6A21\u62DF\u4E00\u4E2A\u6808\uFF08Stack\uFF09\u7684\u5165\u6808\uFF08push\uFF09\u548C\u51FA\u6808\uFF08pop\uFF09\u64CD\u4F5C\u3002\u5047\u8BBE `LinkedList<String> stack = new LinkedList<>();`",
    "answer": '// \u5165\u6808 \nstack.push("element1"); \n// \u6216\u8005 \nstack.addFirst("element1"); \n\n// \u51FA\u6808 \nString element = stack.pop(); \n// \u6216\u8005 \nString element = stack.removeFirst();',
    "score": 3.5,
    "explanation": "\u7B14\u8BB0\u4E2D\u63D0\u5230`LinkedList`\u5B9E\u73B0\u4E86`Deque`\u63A5\u53E3\uFF0C\u56E0\u6B64\u63D0\u4F9B\u4E86`push`\u548C`pop`\u7B49\u65B9\u6CD5\uFF0C\u53EF\u4EE5\u65B9\u4FBF\u5730\u4F5C\u4E3A\u6808\u4F7F\u7528\u3002\u8FD9\u8003\u5BDF\u4E86\u5BF9`LinkedList`\u4F5C\u4E3A\u53CC\u7AEF\u961F\u5217/\u6808\u4F7F\u7528\u7684\u719F\u6089\u7A0B\u5EA6\u3002"
  },
  {
    "id": 8,
    "type": "single",
    "question": "\u5F15\u5165\u6CDB\u578B\uFF08Generics\uFF09\u6700\u4E3B\u8981\u7684\u76EE\u6807\u662F\u4EC0\u4E48\uFF1F",
    "options": [
      "\u63D0\u5347\u96C6\u5408\u7684\u8FD0\u884C\u6548\u7387\u3002",
      "\u51CF\u5C11\u4EE3\u7801\u91CF\u3002",
      "\u5C06\u7C7B\u578B\u68C0\u67E5\u4ECE\u8FD0\u884C\u65F6\u63D0\u524D\u5230\u7F16\u8BD1\u65F6\uFF0C\u4EE5\u63D0\u4F9B\u7C7B\u578B\u5B89\u5168\u3002",
      "\u5B9E\u73B0\u96C6\u5408\u7684\u591A\u6001\u6027\uFF0C\u8BA9 `List<Dog>` \u6210\u4E3A `List<Animal>` \u7684\u5B50\u7C7B\u3002"
    ],
    "answer": "\u5C06\u7C7B\u578B\u68C0\u67E5\u4ECE\u8FD0\u884C\u65F6\u63D0\u524D\u5230\u7F16\u8BD1\u65F6\uFF0C\u4EE5\u63D0\u4F9B\u7C7B\u578B\u5B89\u5168\u3002",
    "score": 2,
    "explanation": "\u6CDB\u578B\u7684\u6838\u5FC3\u4EF7\u503C\u5728\u4E8E\u7C7B\u578B\u5B89\u5168\u3002\u5B83\u5141\u8BB8\u7F16\u8BD1\u5668\u5728\u7F16\u8BD1\u9636\u6BB5\u5C31\u53D1\u73B0\u7C7B\u578B\u4E0D\u5339\u914D\u7684\u9519\u8BEF\uFF0C\u907F\u514D\u4E86\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u51FA\u73B0\u7684`ClassCastException`\uFF0C\u5E76\u514D\u53BB\u4E86\u7E41\u7410\u7684\u624B\u52A8\u7C7B\u578B\u8F6C\u6362\u3002"
  },
  {
    "id": 9,
    "type": "short_answer",
    "question": "\u6839\u636E\u7B14\u8BB0\uFF0C\u8BF7\u89E3\u91CA\u4E3A\u4EC0\u4E48`List<User>`\u4E0D\u662F`List<Person>`\u7684\u5B50\u7C7B\u578B\uFF0C\u5373\u4F7F`User`\u662F`Person`\u7684\u5B50\u7C7B\uFF1F\u8FD9\u4E2A\u7279\u6027\u53EB\u4EC0\u4E48\uFF1F",
    "answer": "\u8FD9\u4E2A\u7279\u6027\u53EB\u505A\u201C\u6CDB\u578B\u4E0D\u5177\u6709\u591A\u6001\u6027\u201D\u3002`List<User>`\u548C`List<Person>`\u662F\u4E24\u79CD\u5B8C\u5168\u4E0D\u540C\u7684\u7C7B\u578B\uFF0C\u5B83\u4EEC\u4E4B\u95F4\u6CA1\u6709\u7EE7\u627F\u5173\u7CFB\u3002\u5982\u679C\u5141\u8BB8\u8FD9\u79CD\u8D4B\u503C\uFF08`List<Person> pList = new ArrayList<User>()`\uFF09\uFF0C\u90A3\u4E48\u4E4B\u540E\u5C31\u53EF\u4EE5\u901A\u8FC7`pList.add(new Animal())`\u5411\u4E00\u4E2A\u672C\u5E94\u53EA\u5B58\u653E`User`\u7684\u96C6\u5408\u4E2D\u6DFB\u52A0\u5176\u4ED6\u7C7B\u578B\u7684\u5BF9\u8C61\uFF0C\u8FD9\u5C06\u7834\u574F\u6CDB\u578B\u7684\u7C7B\u578B\u5B89\u5168\u4FDD\u8BC1\u3002",
    "score": 3.5,
    "explanation": "\u8FD9\u662F\u4E00\u4E2A\u6CDB\u578B\u4E2D\u975E\u5E38\u91CD\u8981\u4E14\u5BB9\u6613\u6DF7\u6DC6\u7684\u6982\u5FF5\u3002\u7406\u89E3\u8FD9\u4E00\u70B9\u5BF9\u4E8E\u6B63\u786E\u4F7F\u7528\u6CDB\u578B\u548C\u7406\u89E3\u6CDB\u578B\u901A\u914D\u7B26\uFF08\u5982`? extends Person`\uFF09\u81F3\u5173\u91CD\u8981\u3002"
  },
  {
    "id": 10,
    "type": "multiple",
    "question": "\u8981\u786E\u4FDD\u4E00\u4E2A\u81EA\u5B9A\u4E49\u7C7B\u7684\u5BF9\u8C61\u80FD\u591F\u5728`HashSet`\u4E2D\u6B63\u786E\u5730\u5B9E\u73B0\u552F\u4E00\u6027\uFF08\u5373\u5185\u5BB9\u76F8\u540C\u7684\u5BF9\u8C61\u88AB\u89C6\u4E3A\u540C\u4E00\u4E2A\uFF09\uFF0C\u5FC5\u987B\u91C7\u53D6\u54EA\u4E9B\u63AA\u65BD\uFF1F",
    "options": [
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`Serializable`\u63A5\u53E3\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`equals()`\u65B9\u6CD5\uFF0C\u5B9A\u4E49\u5BF9\u8C61\u5185\u5BB9\u76F8\u7B49\u7684\u903B\u8F91\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u4FDD\u8BC1`equals()`\u4E3A`true`\u7684\u4E24\u4E2A\u5BF9\u8C61\u5176`hashCode()`\u8FD4\u56DE\u503C\u4E5F\u5FC5\u987B\u76F8\u7B49\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`Comparable`\u63A5\u53E3\u3002"
    ],
    "answer": [
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`equals()`\u65B9\u6CD5\uFF0C\u5B9A\u4E49\u5BF9\u8C61\u5185\u5BB9\u76F8\u7B49\u7684\u903B\u8F91\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u4FDD\u8BC1`equals()`\u4E3A`true`\u7684\u4E24\u4E2A\u5BF9\u8C61\u5176`hashCode()`\u8FD4\u56DE\u503C\u4E5F\u5FC5\u987B\u76F8\u7B49\u3002"
    ],
    "score": 4,
    "explanation": "`HashSet`\u7684\u552F\u4E00\u6027\u5224\u65AD\u4F9D\u8D56\u4E8E`hashCode()`\u548C`equals()`\u8FD9\u4E24\u4E2A\u65B9\u6CD5\u3002`hashCode()`\u7528\u4E8E\u5FEB\u901F\u5B9A\u4F4D\u5B58\u50A8\u4F4D\u7F6E\uFF0C`equals()`\u7528\u4E8E\u5728\u54C8\u5E0C\u51B2\u7A81\u65F6\u8FDB\u884C\u7CBE\u786E\u6BD4\u8F83\u3002\u4E24\u8005\u5FC5\u987B\u540C\u65F6\u88AB\u6B63\u786E\u91CD\u5199\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u96C6\u5408\u884C\u4E3A\u5F02\u5E38\u3002"
  },
  {
    "id": 11,
    "type": "short_answer",
    "question": "\u8BF7\u7B80\u8FF0\u5F53\u5411\u4E00\u4E2A`HashSet`\u4E2D`add(element)`\u4E00\u4E2A\u65B0\u5143\u7D20\u65F6\uFF0C\u5176\u5185\u90E8\u7684\u8BE6\u7EC6\u5DE5\u4F5C\u6D41\u7A0B\u3002",
    "answer": "1. \u9996\u5148\u8C03\u7528`element`\u7684`hashCode()`\u65B9\u6CD5\u8BA1\u7B97\u54C8\u5E0C\u7801\uFF0C\u901A\u8FC7\u54C8\u5E0C\u7B97\u6CD5\u5B9A\u4F4D\u5230\u5E95\u5C42`HashMap`\u4E2D\u7684\u4E00\u4E2A\u6876\uFF08bucket\uFF09\u4F4D\u7F6E\u3002\n2. \u5982\u679C\u8BE5\u6876\u4E3A\u7A7A\uFF0C\u76F4\u63A5\u5C06\u5143\u7D20\u5B58\u5165\uFF0C\u6DFB\u52A0\u6210\u529F\u3002\n3. \u5982\u679C\u8BE5\u6876\u4E0D\u4E3A\u7A7A\uFF08\u53D1\u751F\u54C8\u5E0C\u51B2\u7A81\uFF09\uFF0C\u5219\u904D\u5386\u6876\u4E2D\u7684\u6240\u6709\u73B0\u6709\u5143\u7D20\u3002\n4. \u4F7F\u7528\u65B0\u5143\u7D20`element`\u7684`equals()`\u65B9\u6CD5\u4E0E\u6876\u5185\u6BCF\u4E2A\u73B0\u6709\u5143\u7D20\u8FDB\u884C\u6BD4\u8F83\u3002\n5. \u5982\u679C\u6709\u4EFB\u4F55\u4E00\u6B21`equals()`\u6BD4\u8F83\u8FD4\u56DE`true`\uFF0C\u5219\u8BA4\u4E3A\u5143\u7D20\u5DF2\u5B58\u5728\uFF0C\u6DFB\u52A0\u5931\u8D25\u3002\n6. \u5982\u679C\u904D\u5386\u5B8C\u6240\u6709\u5143\u7D20\uFF0C`equals()`\u90FD\u8FD4\u56DE`false`\uFF0C\u5219\u5C06\u65B0\u5143\u7D20\u6DFB\u52A0\u5230\u8FD9\u4E2A\u6876\u4E2D\uFF08\u901A\u5E38\u662F\u94FE\u8868\u6216\u7EA2\u9ED1\u6811\u7684\u672B\u5C3E\uFF09\uFF0C\u6DFB\u52A0\u6210\u529F\u3002",
    "score": 4.5,
    "explanation": "\u8FD9\u4E2A\u95EE\u9898\u6DF1\u5165\u8003\u5BDF\u4E86`HashSet`\u552F\u4E00\u6027\u4FDD\u8BC1\u7684\u5E95\u5C42\u539F\u7406\uFF0C\u662FJava\u9762\u8BD5\u4E2D\u5173\u4E8E\u96C6\u5408\u90E8\u5206\u7684\u9AD8\u9891\u8003\u70B9\uFF0C\u4F53\u73B0\u4E86\u5BF9\u6570\u636E\u7ED3\u6784\u5B9E\u73B0\u7684\u6DF1\u5165\u7406\u89E3\u3002"
  },
  {
    "id": 12,
    "type": "single",
    "question": "\u6839\u636E\u7B14\u8BB0\uFF0C`HashSet`\u7684\u5E95\u5C42\u662F\u4F7F\u7528\u54EA\u4E00\u4E2A\u96C6\u5408\u7C7B\u6765\u5B9E\u73B0\u5176\u529F\u80FD\u7684\uFF1F",
    "options": ["ArrayList", "TreeMap", "LinkedList", "HashMap"],
    "answer": "HashMap",
    "score": 2,
    "explanation": "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0C`HashSet`\u5185\u90E8\u6301\u6709\u4E00\u4E2A`HashMap`\u5B9E\u4F8B\u3002\u6DFB\u52A0\u5230`HashSet`\u4E2D\u7684\u5143\u7D20\u5B9E\u9645\u4E0A\u662F\u4F5C\u4E3A`key`\u5B58\u50A8\u5728\u5185\u90E8\u7684`HashMap`\u4E2D\uFF0C\u800C`value`\u5219\u662F\u4E00\u4E2A\u56FA\u5B9A\u7684\u5360\u4F4D\u5BF9\u8C61\u3002"
  },
  {
    "id": 13,
    "type": "multiple",
    "question": "\u5173\u4E8E`HashMap`\u548C`Hashtable`\u7684\u5BF9\u6BD4\uFF0C\u4E0B\u5217\u8BF4\u6CD5\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    "options": [
      "`HashMap`\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\uFF0C\u800C`Hashtable`\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002",
      "`HashMap`\u5141\u8BB8\u4E00\u4E2Anull\u952E\u548C\u591A\u4E2Anull\u503C\uFF0C\u800C`Hashtable`\u4E0D\u5141\u8BB8\u4EFB\u4F55null\u952E\u6216null\u503C\u3002",
      "\u5728\u65B0\u4EE3\u7801\u4E2D\uFF0C\u5982\u679C\u9700\u8981\u7EBF\u7A0B\u5B89\u5168\u7684Map\uFF0C\u5E94\u4F18\u5148\u9009\u62E9`Hashtable`\u800C\u4E0D\u662F`ConcurrentHashMap`\u3002",
      "`HashMap`\u548C`Hashtable`\u7684\u9ED8\u8BA4\u521D\u59CB\u5BB9\u91CF\u548C\u6269\u5BB9\u673A\u5236\u5B8C\u5168\u76F8\u540C\u3002"
    ],
    "answer": [
      "`HashMap`\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\uFF0C\u800C`Hashtable`\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002",
      "`HashMap`\u5141\u8BB8\u4E00\u4E2Anull\u952E\u548C\u591A\u4E2Anull\u503C\uFF0C\u800C`Hashtable`\u4E0D\u5141\u8BB8\u4EFB\u4F55null\u952E\u6216null\u503C\u3002"
    ],
    "score": 3.5,
    "explanation": "`Hashtable`\u662F\u9057\u7559\u7684\u7EBF\u7A0B\u5B89\u5168\u7C7B\uFF0C\u6027\u80FD\u8F83\u5DEE\uFF0C\u73B0\u4EE3\u5E76\u53D1\u7F16\u7A0B\u63A8\u8350\u4F7F\u7528`ConcurrentHashMap`\u3002`HashMap`\u548C`Hashtable`\u7684\u521D\u59CB\u5BB9\u91CF\u548C\u6269\u5BB9\u7B56\u7565\u4E5F\u4E0D\u540C\u3002\u56E0\u6B64C\u548CD\u662F\u9519\u8BEF\u7684\u3002"
  },
  {
    "id": 14,
    "type": "single",
    "question": "\u5728\u904D\u5386\u4E00\u4E2A`Map`\u96C6\u5408\u65F6\uFF0C\u54EA\u79CD\u904D\u5386\u65B9\u5F0F\u88AB\u8BA4\u4E3A\u662F\u6700\u9AD8\u6548\u7684\uFF0C\u4E3A\u4EC0\u4E48\uFF1F",
    "options": [
      "\u904D\u5386`keySet()`\uFF0C\u56E0\u4E3Akey\u662F\u552F\u4E00\u7684\u3002",
      "\u904D\u5386`values()`\uFF0C\u56E0\u4E3A\u76F4\u63A5\u83B7\u53D6\u503C\u6700\u5FEB\u3002",
      "\u904D\u5386`entrySet()`\uFF0C\u56E0\u4E3A\u5B83\u53EF\u4EE5\u4E00\u6B21\u6027\u83B7\u53D6\u5230key\u548Cvalue\u3002",
      "\u4F7F\u7528\u8FED\u4EE3\u5668\u904D\u5386`keySet()`\uFF0C\u56E0\u4E3A\u8FED\u4EE3\u5668\u6700\u6807\u51C6\u3002"
    ],
    "answer": "\u904D\u5386`entrySet()`\uFF0C\u56E0\u4E3A\u5B83\u53EF\u4EE5\u4E00\u6B21\u6027\u83B7\u53D6\u5230key\u548Cvalue\u3002",
    "score": 3,
    "explanation": "\u904D\u5386`keySet()`\u540E\uFF0C\u8FD8\u9700\u8981\u901A\u8FC7`map.get(key)`\u518D\u6B21\u67E5\u627E`value`\uFF0C\u8FD9\u5728`HashMap`\u4E2D\u6D89\u53CA\u5230\u4E00\u6B21\u989D\u5916\u7684\u54C8\u5E0C\u5B9A\u4F4D\u3002\u800C\u904D\u5386`entrySet()`\uFF0C\u6BCF\u4E2A`Map.Entry`\u5BF9\u8C61\u5DF2\u7ECF\u5305\u542B\u4E86`key`\u548C`value`\uFF0C\u65E0\u9700\u4E8C\u6B21\u67E5\u627E\uFF0C\u56E0\u6B64\u6548\u7387\u6700\u9AD8\u3002"
  },
  {
    "id": 15,
    "type": "code",
    "question": "\u8BF7\u8865\u5168\u4EE5\u4E0B\u4EE3\u7801\uFF0C\u4F7F\u7528\u63A8\u8350\u7684\u65B9\u5F0F\uFF08`entrySet`\uFF09\u904D\u5386\u4E00\u4E2A`HashMap`\u5E76\u6253\u5370\u5176\u6240\u6709\u952E\u503C\u5BF9\u3002",
    "answer": 'Map<Integer, String> map = new HashMap<>();\nmap.put(1, "Java");\nmap.put(2, "Python");\n\nSet<Map.Entry<Integer, String>> entries = map.entrySet();\nfor (Map.Entry<Integer, String> entry : entries) {\n    System.out.println(entry.getKey() + " -> " + entry.getValue());\n}',
    "score": 3.5,
    "explanation": "\u8003\u5BDF\u5BF9`Map`\u6700\u9AD8\u6548\u904D\u5386\u65B9\u5F0F`entrySet`\u7684\u5B9E\u9645\u7F16\u7801\u80FD\u529B\uFF0C\u8FD9\u662F\u65E5\u5E38\u5F00\u53D1\u4E2D\u7684\u5E38\u7528\u4EE3\u7801\u7247\u6BB5\u3002"
  },
  {
    "id": 16,
    "type": "short_answer",
    "question": "\u4EC0\u4E48\u662F`ConcurrentModificationException`\uFF1F\u5728\u4EC0\u4E48\u60C5\u51B5\u4E0B\u4F1A\u53D1\u751F\uFF1F",
    "answer": "`ConcurrentModificationException`\uFF08\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\uFF09\u662F\u4E00\u4E2A\u8FD0\u884C\u65F6\u5F02\u5E38\u3002\u5B83\u901A\u5E38\u53D1\u751F\u5728\u4F7F\u7528\u8FED\u4EE3\u5668\uFF08\u5305\u62EC\u589E\u5F3Afor\u5FAA\u73AF\uFF09\u904D\u5386\u4E00\u4E2A\u96C6\u5408\u7684\u8FC7\u7A0B\u4E2D\uFF0C\u540C\u65F6\u53C8\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684\u65B9\u6CD5\uFF08\u5982`list.add()`, `map.remove()`\uFF09\u5BF9\u96C6\u5408\u7684\u7ED3\u6784\u8FDB\u884C\u4E86\u4FEE\u6539\uFF08\u6DFB\u52A0\u6216\u5220\u9664\u5143\u7D20\uFF09\u3002",
    "score": 3.5,
    "explanation": "\u7406\u89E3\u8FD9\u4E2A\u5F02\u5E38\u7684\u89E6\u53D1\u6761\u4EF6\u662F\u907F\u514D\u5728\u96C6\u5408\u904D\u5386\u4E2D\u8E29\u5751\u7684\u5173\u952E\u3002\u6839\u672C\u539F\u56E0\u5728\u4E8E\u8FED\u4EE3\u5668\u7EF4\u62A4\u7684\u72B6\u6001\uFF08\u5982`expectedModCount`\uFF09\u4E0E\u96C6\u5408\u7684\u5B9E\u9645\u72B6\u6001\uFF08`modCount`\uFF09\u4E0D\u4E00\u81F4\u4E86\u3002"
  },
  {
    "id": 17,
    "type": "code",
    "question": '\u4EE5\u4E0B\u4EE3\u7801\u5728\u8FD0\u884C\u65F6\u4F1A\u629B\u51FA\u5F02\u5E38\u3002\u8BF7\u4FEE\u6539\u5B83\uFF0C\u4F7F\u5176\u80FD\u591F\u5728\u904D\u5386`List`\u65F6\u5B89\u5168\u5730\u5220\u9664\u6240\u6709\u5305\u542B"bad"\u7684\u5B57\u7B26\u4E32\u3002',
    "code_prompt": 'List<String> list = new ArrayList<>(Arrays.asList("good", "bad", "nice", "bad idea"));\nfor (String s : list) {\n    if (s.contains("bad")) {\n        list.remove(s); \n    }\n}',
    "answer": 'List<String> list = new ArrayList<>(Arrays.asList("good", "bad", "nice", "bad idea"));\nIterator<String> iterator = list.iterator();\nwhile (iterator.hasNext()) {\n    String s = iterator.next();\n    if (s.contains("bad")) {\n        iterator.remove(); // \u4F7F\u7528\u8FED\u4EE3\u5668\u7684remove\u65B9\u6CD5\n    }\n}',
    "score": 4,
    "explanation": "\u6B64\u9898\u662F`ConcurrentModificationException`\u7684\u7ECF\u5178\u573A\u666F\u3002\u6B63\u786E\u505A\u6CD5\u662F\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u8FDB\u884C\u5220\u9664\uFF0C\u56E0\u4E3A\u8BE5\u65B9\u6CD5\u4F1A\u540C\u6B65\u96C6\u5408\u548C\u8FED\u4EE3\u5668\u4E24\u8005\u7684\u5185\u90E8\u72B6\u6001\uFF0C\u4ECE\u800C\u907F\u514D\u5F02\u5E38\u3002"
  },
  {
    "id": 18,
    "type": "multiple",
    "question": "\u5173\u4E8E`Queue`\u63A5\u53E3\u4E2D\u7684`add`\u3001`offer`\u3001`put`\u4E09\u4E2A\u7528\u4E8E\u63D2\u5165\u5143\u7D20\u7684\u65B9\u6CD5\uFF0C\u4EE5\u4E0B\u63CF\u8FF0\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    "options": [
      "`add(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u629B\u51FA`IllegalStateException`\u5F02\u5E38\u3002",
      "`offer(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u8FD4\u56DE`false`\uFF0C\u800C\u4E0D\u4F1A\u629B\u51FA\u5F02\u5E38\u3002",
      "`put(e)`\u662F`BlockingQueue`\u7279\u6709\u7684\u65B9\u6CD5\uFF0C\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u963B\u585E\u5F53\u524D\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u6709\u7A7A\u95F4\u3002",
      "\u5728\u4EFB\u4F55\u60C5\u51B5\u4E0B\uFF0C\u8FD9\u4E09\u4E2A\u65B9\u6CD5\u7684\u884C\u4E3A\u90FD\u662F\u5B8C\u5168\u4E00\u6837\u7684\u3002"
    ],
    "answer": [
      "`add(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u629B\u51FA`IllegalStateException`\u5F02\u5E38\u3002",
      "`offer(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u8FD4\u56DE`false`\uFF0C\u800C\u4E0D\u4F1A\u629B\u51FA\u5F02\u5E38\u3002",
      "`put(e)`\u662F`BlockingQueue`\u7279\u6709\u7684\u65B9\u6CD5\uFF0C\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u963B\u585E\u5F53\u524D\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u6709\u7A7A\u95F4\u3002"
    ],
    "score": 4,
    "explanation": "Queue\u63A5\u53E3\u4E3A\u589E\u5220\u67E5\u64CD\u4F5C\u63D0\u4F9B\u4E86\u4E09\u5957API\uFF0C\u5206\u522B\u5E94\u5BF9\u4E0D\u540C\u573A\u666F\u3002`add`\u7CFB\u5217\u662F\u201C\u66B4\u529B\u6D3E\u201D\uFF0C\u5931\u8D25\u5C31\u629B\u5F02\u5E38\uFF1B`offer`\u7CFB\u5217\u662F\u201C\u6E29\u67D4\u6D3E\u201D\uFF0C\u5931\u8D25\u8FD4\u56DE\u7279\u6B8A\u503C\uFF1B`put`/`take`\u7CFB\u5217\u662F\u201C\u963B\u585E\u6D3E\u201D\uFF0C\u4E13\u4E3A\u5E76\u53D1\u573A\u666F\u8BBE\u8BA1\u3002\u7406\u89E3\u5B83\u4EEC\u7684\u533A\u522B\u5BF9\u4E8E\u7F16\u5199\u5065\u58EE\u7684\u7A0B\u5E8F\u81F3\u5173\u91CD\u8981\u3002"
  },
  {
    "id": 19,
    "type": "multiple",
    "question": "\u4E0E`Queue`\u7684\u63D2\u5165\u65B9\u6CD5\u7C7B\u4F3C\uFF0C\u5176\u79FB\u9664\u5143\u7D20\u7684`remove()`\u3001`poll()`\u3001`take()`\u65B9\u6CD5\u4E5F\u6709\u4E0D\u540C\u884C\u4E3A\u3002\u4EE5\u4E0B\u63CF\u8FF0\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    "options": [
      "`remove()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u629B\u51FA`NoSuchElementException`\u5F02\u5E38\u3002",
      "`poll()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u8FD4\u56DE`null`\u3002",
      "`take()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u963B\u585E\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u4E2D\u6709\u5143\u7D20\u53EF\u53D6\u3002",
      "\u5BF9\u4E8E\u975E\u963B\u585E\u961F\u5217\uFF0C`remove()`\u548C`poll()`\u662F\u5B8C\u5168\u7B49\u4EF7\u7684\u3002"
    ],
    "answer": [
      "`remove()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u629B\u51FA`NoSuchElementException`\u5F02\u5E38\u3002",
      "`poll()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u8FD4\u56DE`null`\u3002",
      "`take()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u963B\u585E\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u4E2D\u6709\u5143\u7D20\u53EF\u53D6\u3002"
    ],
    "score": 4,
    "explanation": "\u8FD9\u8003\u5BDF\u4E86`Queue`\u4E09\u5957API\u4E2D\u7528\u4E8E\u79FB\u9664\u5143\u7D20\u7684\u65B9\u6CD5\u3002\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u5C24\u5176\u662F\u5728\u9AD8\u5E76\u53D1\u6216\u9700\u8981\u5904\u7406\u8FB9\u754C\u6761\u4EF6\u7684\u7CFB\u7EDF\u4E2D\uFF0C\u901A\u5E38\u4F1A\u9009\u62E9\u4F7F\u7528`poll()`\u6216`take()`\u6765\u907F\u514D\u7A0B\u5E8F\u56E0\u5F02\u5E38\u800C\u4E2D\u65AD\u3002"
  },
  {
    "id": 20,
    "type": "single",
    "question": "\u5047\u8BBE\u4F60\u6B63\u5728\u5F00\u53D1\u4E00\u4E2A\u751F\u4EA7\u8005-\u6D88\u8D39\u8005\u6A21\u578B\uFF0C\u4F7F\u7528`ArrayBlockingQueue`\u4F5C\u4E3A\u5171\u4EAB\u7F13\u51B2\u533A\u3002\u5F53\u7F13\u51B2\u533A\u5DF2\u6EE1\u65F6\uFF0C\u4F60\u5E0C\u671B\u751F\u4EA7\u8005\u7EBF\u7A0B\u6682\u505C\u7B49\u5F85\uFF0C\u800C\u4E0D\u662F\u629B\u51FA\u5F02\u5E38\u6216\u7ACB\u5373\u8FD4\u56DE\u5931\u8D25\u3002\u4F60\u5E94\u8BE5\u4F7F\u7528\u54EA\u4E2A\u65B9\u6CD5\u6765\u653E\u5165\u5143\u7D20\uFF1F",
    "options": ["add(e)", "offer(e)", "put(e)", "push(e)"],
    "answer": "put(e)",
    "score": 3,
    "explanation": "\u6839\u636E\u7B14\u8BB0\u4E2D\u5BF9`ArrayBlockingQueue`\u7684\u63CF\u8FF0\uFF0C`put(e)`\u65B9\u6CD5\u6B63\u662F\u5728\u961F\u5217\u6EE1\u65F6\u63D0\u4F9B\u963B\u585E\u529F\u80FD\u7684API\uFF0C\u8FD9\u5B8C\u5168\u7B26\u5408\u751F\u4EA7\u8005-\u6D88\u8D39\u8005\u6A21\u578B\u4E2D\u751F\u4EA7\u8005\u9700\u8981\u7B49\u5F85\u7684\u573A\u666F\u3002"
  },
  {
    "id": 21,
    "type": "code",
    "question": "\u8BF7\u7F16\u5199\u4E00\u4E2A`Comparator`\uFF0C\u7528\u4E8E\u5BF9\u4E00\u4E2A`List<String>`\u6309\u5B57\u7B26\u4E32\u957F\u5EA6\u8FDB\u884C\u964D\u5E8F\u6392\u5E8F\u3002\u5982\u679C\u957F\u5EA6\u76F8\u540C\uFF0C\u5219\u6309\u5B57\u5178\u5E8F\u5347\u5E8F\u6392\u5E8F\u3002",
    "answer": "list.sort((s1, s2) -> {\n    if (s1.length() != s2.length()) {\n        return s2.length() - s1.length(); // \u957F\u5EA6\u964D\u5E8F\n    } else {\n        return s1.compareTo(s2); // \u5B57\u5178\u5E8F\u5347\u5E8F\n    }\n});",
    "score": 4.5,
    "explanation": "\u672C\u9898\u8003\u5BDF\u4E86`Comparator`\u63A5\u53E3\u7684\u7075\u6D3B\u8FD0\u7528\uFF0C\u6D89\u53CA\u4E24\u4E2A\u6392\u5E8F\u7EF4\u5EA6\uFF08\u4E3B\u3001\u6B21\u6392\u5E8F\u6761\u4EF6\uFF09\uFF0C\u662F\u5B9E\u9645\u5F00\u53D1\u4E2D\u5E38\u89C1\u7684\u81EA\u5B9A\u4E49\u6392\u5E8F\u573A\u666F\u3002\u4F7F\u7528Lambda\u8868\u8FBE\u5F0F\u662F\u73B0\u4EE3Java\u7684\u63A8\u8350\u5199\u6CD5\u3002"
  },
  {
    "id": 22,
    "type": "single",
    "question": "\u5728\u4F7F\u7528`Arrays.binarySearch()`\u65B9\u6CD5\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u524D\uFF0C\u5BF9\u76EE\u6807\u6570\u7EC4\u6709\u4EC0\u4E48\u6837\u7684\u524D\u7F6E\u8981\u6C42\uFF1F",
    "options": [
      "\u6570\u7EC4\u5FC5\u987B\u662F`String`\u7C7B\u578B\u3002",
      "\u6570\u7EC4\u5FC5\u987B\u5DF2\u7ECF\u6392\u597D\u5E8F\u3002",
      "\u6570\u7EC4\u957F\u5EA6\u5FC5\u987B\u662F2\u7684\u5E42\u3002",
      "\u6570\u7EC4\u4E0D\u80FD\u5305\u542B\u91CD\u590D\u5143\u7D20\u3002"
    ],
    "answer": "\u6570\u7EC4\u5FC5\u987B\u5DF2\u7ECF\u6392\u597D\u5E8F\u3002",
    "score": 2.5,
    "explanation": "\u4E8C\u5206\u67E5\u627E\u7B97\u6CD5\u7684\u6709\u6548\u6027\u5EFA\u7ACB\u5728\u6570\u636E\u6709\u5E8F\u7684\u57FA\u7840\u4E0A\u3002\u5982\u679C\u5728\u4E00\u4E2A\u672A\u6392\u5E8F\u7684\u6570\u7EC4\u4E0A\u6267\u884C`binarySearch`\uFF0C\u5176\u7ED3\u679C\u662F\u672A\u5B9A\u4E49\u7684\uFF0C\u53EF\u80FD\u4F1A\u8FD4\u56DE\u9519\u8BEF\u7684\u4F4D\u7F6E\u6216\u627E\u4E0D\u5230\u5B58\u5728\u7684\u5143\u7D20\u3002"
  },
  {
    "id": 23,
    "type": "single",
    "question": "\u8C03\u7528`Map.put(K key, V value)`\u65B9\u6CD5\u65F6\uFF0C\u5982\u679C`key`\u5728Map\u4E2D\u5DF2\u7ECF\u5B58\u5728\uFF0C\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
    "options": [
      "\u64CD\u4F5C\u5931\u8D25\uFF0C\u629B\u51FA\u5F02\u5E38\u3002",
      "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8FD4\u56DE`false`\u3002",
      "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u65B0\u7684`value`\u3002",
      "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u88AB\u8986\u76D6\u7684\u65E7`value`\u3002"
    ],
    "answer": "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u88AB\u8986\u76D6\u7684\u65E7`value`\u3002",
    "score": 2,
    "explanation": "\u8FD9\u662F`Map.put`\u65B9\u6CD5\u7684\u4E00\u4E2A\u91CD\u8981\u7279\u6027\u3002\u8FD4\u56DE\u65E7\u503C\u4F7F\u5F97\u8C03\u7528\u8005\u53EF\u4EE5\u77E5\u9053\u4E4B\u524D\u8BE5key\u5173\u8054\u7684\u503C\u662F\u4EC0\u4E48\uFF0C\u65B9\u4FBF\u8FDB\u884C\u4E00\u4E9B\u5982\u201C\u66F4\u65B0\u5E76\u8BB0\u5F55\u65E7\u503C\u201D\u7684\u903B\u8F91\u3002"
  },
  {
    "id": 24,
    "type": "short_answer",
    "question": "\u5728\u4F7F\u7528\u589E\u5F3Afor\u5FAA\u73AF\uFF08for-each loop\uFF09\u904D\u5386\u4E00\u4E2AList\u65F6\uFF0C\u5176\u5E95\u5C42\u5B9E\u9645\u4E0A\u662F\u5982\u4F55\u5DE5\u4F5C\u7684\uFF1F\u4E3A\u4EC0\u4E48\u5B83\u540C\u6837\u4F1A\u53D7\u5230`ConcurrentModificationException`\u7684\u5F71\u54CD\uFF1F",
    "answer": "\u589E\u5F3Afor\u5FAA\u73AF\u5728\u5E95\u5C42\u5B9E\u9645\u4E0A\u662F\u4F9D\u8D56`Iterator`\uFF08\u8FED\u4EE3\u5668\uFF09\u5DE5\u4F5C\u7684\u3002\u7F16\u8BD1\u5668\u4F1A\u5C06\u589E\u5F3Afor\u5FAA\u73AF\u4EE3\u7801\u8F6C\u6362\u4E3A\u7B49\u6548\u7684\u4F7F\u7528`iterator()`\u65B9\u6CD5\u83B7\u53D6\u8FED\u4EE3\u5668\uFF0C\u7136\u540E\u5FAA\u73AF\u8C03\u7528`hasNext()`\u548C`next()`\u7684\u4EE3\u7801\u3002\u56E0\u4E3A\u5B83\u672C\u8D28\u4E0A\u5C31\u662F\u5728\u4F7F\u7528\u8FED\u4EE3\u5668\uFF0C\u6240\u4EE5\u5F53\u5728\u5FAA\u73AF\u4F53\u5185\u90E8\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684\u65B9\u6CD5\u4FEE\u6539\u96C6\u5408\u65F6\uFF0C\u540C\u6837\u4F1A\u89E6\u53D1`ConcurrentModificationException`\u3002",
    "score": 3,
    "explanation": "\u7406\u89E3\u589E\u5F3Afor\u5FAA\u73AF\u7684\u8BED\u6CD5\u7CD6\u672C\u8D28\u6709\u52A9\u4E8E\u66F4\u6DF1\u523B\u5730\u7406\u89E3Java\u7684\u8FED\u4EE3\u673A\u5236\u548C\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u7684\u6839\u6E90\u3002"
  },
  {
    "id": 25,
    "type": "single",
    "question": "\u5982\u679C\u4E00\u4E2A\u81EA\u5B9A\u4E49\u7C7B\u53EA\u91CD\u5199\u4E86`equals()`\u65B9\u6CD5\uFF0C\u800C\u6CA1\u6709\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u5C06\u5176\u5BF9\u8C61\u4F5C\u4E3A\u5143\u7D20\u6DFB\u52A0\u5230`HashSet`\u4E2D\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u4EC0\u4E48\u95EE\u9898\uFF1F",
    "options": [
      "\u7F16\u8BD1\u9519\u8BEF\u3002",
      "\u8FD0\u884C\u65F6\u629B\u51FA`IllegalStateException`\u3002",
      "\u4E24\u4E2A\u5185\u5BB9\u76F8\u7B49\uFF08`equals`\u8FD4\u56DE`true`\uFF09\u7684\u5BF9\u8C61\u53EF\u80FD\u90FD\u4F1A\u88AB\u6210\u529F\u6DFB\u52A0\u5230`HashSet`\u4E2D\u3002",
      "\u6027\u80FD\u4E0B\u964D\uFF0C\u4F46\u529F\u80FD\u5B8C\u5168\u6B63\u5E38\u3002"
    ],
    "answer": "\u4E24\u4E2A\u5185\u5BB9\u76F8\u7B49\uFF08`equals`\u8FD4\u56DE`true`\uFF09\u7684\u5BF9\u8C61\u53EF\u80FD\u90FD\u4F1A\u88AB\u6210\u529F\u6DFB\u52A0\u5230`HashSet`\u4E2D\u3002",
    "score": 4,
    "explanation": "\u5982\u679C\u6CA1\u6709\u91CD\u5199`hashCode()`\uFF0C\u5B83\u5C06\u4F7F\u7528\u4ECE`Object`\u7C7B\u7EE7\u627F\u7684\u9ED8\u8BA4\u5B9E\u73B0\uFF0C\u8BE5\u5B9E\u73B0\u901A\u5E38\u57FA\u4E8E\u5185\u5B58\u5730\u5740\u751F\u6210\u54C8\u5E0C\u7801\u3002\u56E0\u6B64\uFF0C\u4E24\u4E2A\u5185\u5BB9\u76F8\u540C\u4F46\u5185\u5B58\u5730\u5740\u4E0D\u540C\u7684\u5BF9\u8C61\u4F1A\u6709\u4E0D\u540C\u7684\u54C8\u5E0C\u7801\uFF0C`HashSet`\u4F1A\u5C06\u5B83\u4EEC\u5B9A\u4F4D\u5230\u4E0D\u540C\u7684\u6876\u4E2D\uFF0C\u4ECE\u800C\u90FD\u6DFB\u52A0\u6210\u529F\uFF0C\u8FDD\u80CC\u4E86`Set`\u7684\u552F\u4E00\u6027\u539F\u5219\u3002"
  },
  {
    "id": 26,
    "type": "single",
    "question": "\u6839\u636E`Comparator<T>`\u63A5\u53E3\u7684`compare(T o1, T o2)`\u65B9\u6CD5\u7684\u7EA6\u5B9A\uFF0C\u5982\u679C\u8981\u5B9E\u73B0\u5347\u5E8F\u6392\u5E8F\uFF0C\u5F53`o1`\u5E94\u8BE5\u6392\u5728`o2`\u524D\u9762\u65F6\uFF0C\u8BE5\u65B9\u6CD5\u5E94\u8BE5\u8FD4\u56DE\u4EC0\u4E48\uFF1F",
    "options": ["\u6B63\u6574\u6570", "\u8D1F\u6574\u6570", "\u96F6", "true"],
    "answer": "\u8D1F\u6574\u6570",
    "score": 3,
    "explanation": "\u8FD9\u662F`Comparator`\u63A5\u53E3\u7684\u6838\u5FC3\u7EA6\u5B9A\uFF1A\u8FD4\u56DE\u8D1F\u6570\u610F\u5473\u7740\u7B2C\u4E00\u4E2A\u53C2\u6570`o1`\u201C\u5C0F\u4E8E\u201D\u7B2C\u4E8C\u4E2A\u53C2\u6570`o2`\uFF0C\u5E94\u8BE5\u6392\u5728\u524D\u9762\uFF1B\u8FD4\u56DE\u6B63\u6570\u76F8\u53CD\uFF1B\u8FD4\u56DE\u96F6\u8868\u793A\u4E24\u8005\u76F8\u7B49\u3002"
  },
  {
    "id": 27,
    "type": "multiple",
    "question": "`LinkedList`\u5B9E\u73B0\u4E86\u54EA\u4E9B\u91CD\u8981\u7684\u63A5\u53E3\uFF08\u6839\u636E\u7B14\u8BB0\u5185\u5BB9\uFF09\uFF1F",
    "options": ["List", "Map", "Set", "Deque"],
    "answer": ["List", "Deque"],
    "score": 2,
    "explanation": "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA `LinkedList` \u662F `List` \u63A5\u53E3\u7684\u5B9E\u73B0\uFF0C\u540C\u65F6\u5B83\u4E5F\u5B9E\u73B0\u4E86 `Deque` (\u53CC\u7AEF\u961F\u5217) \u63A5\u53E3\uFF0C\u8FD9\u4F7F\u5F97\u5B83\u65E2\u6709\u5217\u8868\u7684\u7279\u6027\uFF0C\u4E5F\u5177\u5907\u961F\u5217\u548C\u6808\u7684\u80FD\u529B\u3002"
  },
  {
    "id": 28,
    "type": "short_answer",
    "question": "\u8BF7\u63CF\u8FF0`ArrayList`\u548C`LinkedList`\u5728\u5185\u5B58\u5F00\u9500\u4E0A\u7684\u4E3B\u8981\u533A\u522B\u3002",
    "answer": "`ArrayList`\u7684\u5185\u5B58\u5F00\u9500\u76F8\u5BF9\u8F83\u5C0F\u3002\u5B83\u53EA\u9700\u8981\u5B58\u50A8\u5143\u7D20\u672C\u8EAB\uFF0C\u4EE5\u53CA\u4E00\u4E9B\u989D\u5916\u7684\u5BB9\u91CF\u4FE1\u606F\u3002\u5176\u5185\u5B58\u662F\u8FDE\u7EED\u7684\u3002`LinkedList`\u7684\u5185\u5B58\u5F00\u9500\u8F83\u5927\uFF0C\u56E0\u4E3A\u5B83\u7684\u6BCF\u4E2A\u5143\u7D20\u90FD\u5305\u88C5\u5728\u4E00\u4E2A\u8282\u70B9\uFF08Node\uFF09\u5BF9\u8C61\u4E2D\uFF0C\u8BE5\u8282\u70B9\u9664\u4E86\u5B58\u50A8\u5143\u7D20\u6570\u636E\u5916\uFF0C\u8FD8\u9700\u989D\u5916\u5B58\u50A8\u6307\u5411\u524D\u4E00\u4E2A\u548C\u540E\u4E00\u4E2A\u8282\u70B9\u7684\u5F15\u7528\uFF08\u6307\u9488\uFF09\uFF0C\u8FD9\u589E\u52A0\u4E86\u989D\u5916\u7684\u5185\u5B58\u5360\u7528\u3002",
    "score": 3,
    "explanation": "\u5728\u5904\u7406\u5927\u91CF\u6570\u636E\u4E14\u5185\u5B58\u654F\u611F\u7684\u573A\u666F\u4E0B\uFF0C\u5185\u5B58\u5F00\u9500\u662F\u9009\u62E9\u96C6\u5408\u5B9E\u73B0\u65F6\u9700\u8981\u8003\u8651\u7684\u4E00\u4E2A\u56E0\u7D20\u3002"
  },
  {
    "id": 29,
    "type": "single",
    "question": "\u6267\u884C`new ArrayList()`\u540E\uFF0C\u6B64\u65F6`ArrayList`\u7684\u5185\u90E8\u6570\u7EC4\u5BB9\u91CF\u662F\u591A\u5C11\uFF1F",
    "options": ["10", "16", "0", "1"],
    "answer": "0",
    "score": 2.5,
    "explanation": "\u6839\u636E\u7B14\u8BB0\uFF0CJDK 7\u53CA\u4EE5\u540E\u7684\u7248\u672C\uFF0C`new ArrayList()`\u4F1A\u521B\u5EFA\u4E00\u4E2A\u521D\u59CB\u5BB9\u91CF\u4E3A0\u7684\u7A7A\u5217\u8868\uFF08\u5185\u90E8\u6570\u7EC4\u662F\u4E00\u4E2A\u7A7A\u6570\u7EC4\uFF09\u3002\u5728\u7B2C\u4E00\u6B21\u8C03\u7528`add`\u65B9\u6CD5\u65F6\uFF0C\u624D\u4F1A\u8FDB\u884C\u7B2C\u4E00\u6B21\u6269\u5BB9\uFF0C\u901A\u5E38\u662F\u5206\u914D\u4E00\u4E2A\u5BB9\u91CF\u4E3A10\u7684\u6570\u7EC4\u3002"
  },
  {
    "id": 30,
    "type": "single",
    "question": "`map.values()`\u65B9\u6CD5\u8FD4\u56DE\u7684\u662F\u4EC0\u4E48\u7C7B\u578B\uFF1F",
    "options": ["List<V>", "Set<V>", "Collection<V>", "V[]"],
    "answer": "Collection<V>",
    "score": 2,
    "explanation": "`map.values()`\u8FD4\u56DE\u4E00\u4E2A`Collection`\u89C6\u56FE\uFF0C\u56E0\u4E3A\u5B83\u53EA\u4FDD\u8BC1\u5305\u542B\u4E86map\u4E2D\u6240\u6709\u7684\u503C\uFF0C\u4F46\u4E0D\u4FDD\u8BC1\u987A\u5E8F\u6216\u552F\u4E00\u6027\uFF08\u4E0D\u540C\u7684key\u53EF\u4EE5\u6620\u5C04\u5230\u76F8\u540C\u7684value\uFF09\u3002\u56E0\u6B64\uFF0C\u4F7F\u7528\u6700\u6CDB\u5316\u7684`Collection`\u7C7B\u578B\u662F\u5408\u9002\u7684\u3002"
  },
  {
    "id": 31,
    "type": "short_answer",
    "question": "\u4E3A\u4EC0\u4E48\u8BF4\u904D\u5386Map\u7684`entrySet()`\u662F\u6700\u9AD8\u6548\u7684\u65B9\u5F0F\uFF1F\u8BF7\u4ECE`HashMap`\u7684\u5B9E\u73B0\u89D2\u5EA6\u89E3\u91CA\u3002",
    "answer": "\u56E0\u4E3A`HashMap`\u7684`entrySet()`\u8FD4\u56DE\u7684`Set`\u4E2D\uFF0C\u6BCF\u4E2A`Entry`\u5BF9\u8C61\u5DF2\u7ECF\u5305\u542B\u4E86\u952E\u548C\u503C\u3002\u904D\u5386\u65F6\uFF0C\u53EF\u4EE5\u76F4\u63A5\u4ECE`Entry`\u5BF9\u8C61\u4E2D\u83B7\u53D6`key`\u548C`value`\u3002\u76F8\u6BD4\u4E4B\u4E0B\uFF0C\u904D\u5386`keySet()`\u65F6\uFF0C\u5728\u5FAA\u73AF\u4F53\u5185\u90E8\u9700\u8981\u901A\u8FC7`map.get(key)`\u6765\u83B7\u53D6`value`\uFF0C\u8FD9\u4E2A`get`\u64CD\u4F5C\u9700\u8981\u6839\u636E`key`\u7684\u54C8\u5E0C\u503C\u518D\u6B21\u8FDB\u884C\u4E00\u6B21\u67E5\u627E\u5B9A\u4F4D\u8FC7\u7A0B\u3002\u56E0\u6B64\uFF0C\u904D\u5386`entrySet()`\u907F\u514D\u4E86\u8FD9\u6B21\u91CD\u590D\u7684\u67E5\u627E\uFF0C\u6548\u7387\u66F4\u9AD8\u3002",
    "score": 4,
    "explanation": "\u6B64\u9898\u8981\u6C42\u4ECE`HashMap`\u7684\u5B9E\u73B0\u7EC6\u8282\u6765\u89E3\u91CA\u6027\u80FD\u5DEE\u5F02\uFF0C\u8003\u5BDF\u5BF9`HashMap`\u5DE5\u4F5C\u539F\u7406\u7684\u7406\u89E3\u6DF1\u5EA6\u3002"
  },
  {
    "id": 32,
    "type": "single",
    "question": "\u4E00\u4E2A`HashMap`\u5B9E\u4F8B\u4E2D\uFF0C\u53EF\u4EE5\u5B58\u5728\u591A\u5C11\u4E2A`null`\u4F5C\u4E3A`key`\uFF1F",
    "options": ["0\u4E2A", "1\u4E2A", "\u65E0\u9650\u4E2A", "\u4E0D\u786E\u5B9A\uFF0C\u53D6\u51B3\u4E8EJDK\u7248\u672C"],
    "answer": "1\u4E2A",
    "score": 2,
    "explanation": "\u7B14\u8BB0\u4E2D\u660E\u786E\u63D0\u5230\uFF0C`HashMap`\u5141\u8BB8`key`\u548C`value`\u4E3A`null`\u3002\u7531\u4E8E`key`\u5FC5\u987B\u662F\u552F\u4E00\u7684\uFF0C\u6240\u4EE5\u6700\u591A\u53EA\u80FD\u6709\u4E00\u4E2A`key`\u4E3A`null`\u3002\u800C`value`\u53EF\u4EE5\u6709\u591A\u4E2A\u4E3A`null`\u3002"
  },
  {
    "id": 33,
    "type": "code",
    "question": "\u7ED9\u5B9A\u4E00\u4E2A`ArrayList<Integer> list`\uFF0C\u8BF7\u4F7F\u7528`list.sort()`\u65B9\u6CD5\u548CLambda\u8868\u8FBE\u5F0F\u5BF9\u5176\u8FDB\u884C\u964D\u5E8F\u6392\u5E8F\u3002",
    "answer": "list.sort((o1, o2) -> o2 - o1);",
    "score": 3,
    "explanation": "\u8003\u5BDF\u4F7F\u7528Lambda\u8868\u8FBE\u5F0F\u5FEB\u901F\u5B9E\u73B0`Comparator`\u63A5\u53E3\uFF0C\u8FD9\u662FJava 8\u4EE5\u540E\u63A8\u8350\u7684\u7B80\u6D01\u5199\u6CD5\u3002`o2 - o1`\u662F\u5B9E\u73B0Integer\u964D\u5E8F\u6392\u5E8F\u7684\u7ECF\u5178\u6280\u5DE7\u3002"
  },
  {
    "id": 34,
    "type": "multiple",
    "question": "\u4EE5\u4E0B\u5173\u4E8E`Iterator`\u8FED\u4EE3\u5668\u7684\u8BF4\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    "options": [
      "`Iterator`\u662F\u904D\u5386\u96C6\u5408\u7684\u7EDF\u4E00\u6807\u51C6\u63A5\u53E3\u3002",
      "\u8C03\u7528`next()`\u65B9\u6CD5\u4F1A\u8FD4\u56DE\u4E0B\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u4E14\u4F1A\u81EA\u52A8\u5C06\u5185\u90E8\u6307\u9488\u540E\u79FB\u3002",
      "\u5728\u901A\u8FC7\u8FED\u4EE3\u5668\u904D\u5386\u96C6\u5408\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u5B89\u5168\u5730\u5220\u9664\u5143\u7D20\u3002",
      "\u6240\u6709\u7684`Collection`\u5B9E\u73B0\u7C7B\u90FD\u5FC5\u987B\u5B9E\u73B0`Iterator`\u63A5\u53E3\u3002"
    ],
    "answer": [
      "`Iterator`\u662F\u904D\u5386\u96C6\u5408\u7684\u7EDF\u4E00\u6807\u51C6\u63A5\u53E3\u3002",
      "\u8C03\u7528`next()`\u65B9\u6CD5\u4F1A\u8FD4\u56DE\u4E0B\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u4E14\u4F1A\u81EA\u52A8\u5C06\u5185\u90E8\u6307\u9488\u540E\u79FB\u3002",
      "\u5728\u901A\u8FC7\u8FED\u4EE3\u5668\u904D\u5386\u96C6\u5408\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u5B89\u5168\u5730\u5220\u9664\u5143\u7D20\u3002"
    ],
    "score": 3.5,
    "explanation": "\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002`Collection`\u7684\u5B9E\u73B0\u7C7B\u5E76\u672A\u76F4\u63A5\u5B9E\u73B0`Iterator`\u63A5\u53E3\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u4E2A`iterator()`\u65B9\u6CD5\u6765\u8FD4\u56DE\u4E00\u4E2A`Iterator`\u7684\u5B9E\u4F8B\u3002\u5176\u4ED6\u4E09\u9879\u90FD\u662F\u5BF9`Iterator`\u6838\u5FC3\u529F\u80FD\u548C\u7528\u6CD5\u7684\u6B63\u786E\u63CF\u8FF0\u3002"
  },
  {
    "id": 35,
    "type": "single",
    "question": "\u5982\u679C`HashMap`\u7684key\u662F\u4E00\u4E2A\u81EA\u5B9A\u4E49\u5BF9\u8C61\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u5BF9\u8C61\u5FC5\u987B\u6EE1\u8DB3\u4EC0\u4E48\u6761\u4EF6\u624D\u80FD\u4FDD\u8BC1`HashMap`\u7684\u6B63\u5E38\u5DE5\u4F5C\uFF1F",
    "options": [
      "\u5FC5\u987B\u5B9E\u73B0`Comparable`\u63A5\u53E3\u3002",
      "\u5FC5\u987B\u662F\u4E0D\u53EF\u53D8\u5BF9\u8C61\uFF08Immutable\uFF09\u3002",
      "\u5FC5\u987B\u6B63\u786E\u5730\u91CD\u5199`hashCode()`\u548C`equals()`\u65B9\u6CD5\u3002",
      "\u5FC5\u987B\u6709\u4E00\u4E2A\u65E0\u53C2\u6784\u9020\u51FD\u6570\u3002"
    ],
    "answer": "\u5FC5\u987B\u6B63\u786E\u5730\u91CD\u5199`hashCode()`\u548C`equals()`\u65B9\u6CD5\u3002",
    "score": 3,
    "explanation": "\u4E0E`HashSet`\u4E00\u6837\uFF0C`HashMap`\u901A\u8FC7key\u7684`hashCode()`\u548C`equals()`\u6765\u5B9A\u4F4D\u548C\u533A\u5206\u4E0D\u540C\u7684\u6761\u76EE\u3002\u4E3A\u4E86\u786E\u4FDD\u80FD\u591F\u6B63\u786E\u5730\u5B58\u53D6\u952E\u503C\u5BF9\uFF0C\u8FD9\u4E24\u4E2A\u65B9\u6CD5\u5FC5\u987B\u88AB\u6B63\u786E\u91CD\u5199\u3002\u867D\u7136\u5C06\u4E0D\u53EF\u53D8\u5BF9\u8C61\u7528\u4F5Ckey\u662F\u6700\u4F73\u5B9E\u8DF5\uFF0C\u4F46\u4E0D\u662F\u5F3A\u5236\u8981\u6C42\u3002"
  },
  {
    "id": 36,
    "type": "single",
    "question": "\u5728Java\u4E2D\uFF0C\u5982\u679C\u4E00\u4E2A\u65B9\u6CD5\u9700\u8981\u63A5\u6536\u4E00\u4E2A`List`\uFF0C\u8FD9\u4E2A`List`\u4E2D\u53EF\u4EE5\u5B58\u653E`Integer`\u6216\u4EFB\u4F55`Integer`\u7684\u7236\u7C7B\u578B\uFF08\u5982`Number`, `Object`\uFF09\uFF0C\u90A3\u4E48\u8BE5\u65B9\u6CD5\u7684\u53C2\u6570\u7C7B\u578B\u5E94\u8BE5\u5982\u4F55\u58F0\u660E\uFF1F",
    "options": [
      "`List<Number> list`",
      "`List<? extends Number> list`",
      "`List<? super Integer> list`",
      "`List<Object> list`"
    ],
    "answer": "`List<? super Integer> list`",
    "score": 4.5,
    "explanation": "\u8FD9\u662F\u4E00\u4E2A\u5173\u4E8E\u6CDB\u578B\u901A\u914D\u7B26\u7684\u8FDB\u9636\u95EE\u9898\uFF0C\u867D\u7136\u7B14\u8BB0\u4E2D\u6CA1\u6709\u76F4\u63A5\u8BB2\u6388\u901A\u914D\u7B26\uFF0C\u4F46\u662F\u57FA\u4E8E\u201C\u6CDB\u578B\u4E0D\u5177\u6709\u591A\u6001\u6027\u201D\u7684\u6982\u5FF5\u5EF6\u4F38\u800C\u6765\u3002`? super Integer`\u8868\u793A\u4E00\u4E2A\u672A\u77E5\u7C7B\u578B\uFF0C\u8FD9\u4E2A\u7C7B\u578B\u662F`Integer`\u672C\u8EAB\u6216\u8005\u5176\u4EFB\u4F55\u7236\u7C7B\u578B\uFF0C\u7B26\u5408\u9898\u610F\u3002\u8FD9\u8003\u5BDF\u4E86\u5BF9\u6CDB\u578B\u66F4\u6DF1\u5C42\u6B21\u7684\u7406\u89E3\uFF08PECS\u539F\u5219\uFF1AProducer-Extends, Consumer-Super\uFF09\u3002"
  },
  {
    "id": 37,
    "type": "short_answer",
    "question": "\u8BF7\u89E3\u91CA`ArrayList`\u7684`remove(int index)`\u548C`remove(Object o)`\u4E24\u4E2A\u91CD\u8F7D\u65B9\u6CD5\u4E4B\u95F4\u7684\u533A\u522B\u548C\u6F5C\u5728\u7684\u9677\u9631\u3002",
    "answer": "`remove(int index)`\u662F\u6309\u7D22\u5F15\u5220\u9664\uFF0C\u5B83\u4F1A\u5220\u9664\u6307\u5B9A\u4F4D\u7F6E\u7684\u5143\u7D20\u5E76\u8FD4\u56DE\u88AB\u5220\u9664\u7684\u5143\u7D20\u3002`remove(Object o)`\u662F\u6309\u5185\u5BB9\u5220\u9664\uFF0C\u5B83\u4F1A\u5220\u9664\u96C6\u5408\u4E2D\u4E0E\u5BF9\u8C61`o`\u76F8\u7B49\u7684\u7B2C\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u8FD4\u56DE\u4E00\u4E2A\u5E03\u5C14\u503C\uFF08`true`\u8868\u793A\u5220\u9664\u6210\u529F\uFF09\u3002\u6F5C\u5728\u7684\u9677\u9631\u662F\u5F53`ArrayList`\u4E2D\u5B58\u50A8\u7684\u662F`Integer`\u7C7B\u578B\u65F6\uFF0C\u5982\u679C\u8C03\u7528`list.remove(10)`\uFF0C\u7F16\u8BD1\u5668\u4F1A\u4F18\u5148\u5339\u914D`remove(int index)`\uFF0C\u610F\u56FE\u662F\u5220\u9664\u7D22\u5F15\u4E3A10\u7684\u5143\u7D20\uFF0C\u800C\u4E0D\u662F\u5185\u5BB9\u4E3A10\u7684\u5143\u7D20\u3002\u5982\u679C\u60F3\u6309\u5185\u5BB9\u5220\u9664\uFF0C\u5FC5\u987B\u4F20\u9012\u4E00\u4E2A`Integer`\u5BF9\u8C61\uFF0C\u5982`list.remove(Integer.valueOf(10))`\u3002",
    "score": 4,
    "explanation": "\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u4E86\u5BF9`ArrayList` API\u7EC6\u8282\u7684\u638C\u63E1\uFF0C\u7279\u522B\u662F\u5728\u5904\u7406`Integer`\u96C6\u5408\u65F6\u7531\u4E8E\u81EA\u52A8\u88C5\u7BB1/\u62C6\u7BB1\u53EF\u80FD\u5F15\u53D1\u7684\u6B67\u4E49\u548C\u9519\u8BEF\uFF0C\u975E\u5E38\u5177\u6709\u5B9E\u8DF5\u6027\u3002"
  },
  {
    "id": 38,
    "type": "single",
    "question": "`Queue`\u63A5\u53E3\u9075\u5FAA\u7684\u57FA\u672C\u539F\u5219\u662F\u4EC0\u4E48\uFF1F",
    "options": ["\u540E\u8FDB\u5148\u51FA (LIFO)", "\u5148\u8FDB\u5148\u51FA (FIFO)", "\u65E0\u5E8F", "\u6309\u4F18\u5148\u7EA7"],
    "answer": "\u5148\u8FDB\u5148\u51FA (FIFO)",
    "score": 1.5,
    "explanation": "\u7B14\u8BB0\u4E2D\u660E\u786E\u5B9A\u4E49\uFF0CQueue (\u961F\u5217) \u662F\u4E00\u79CD\u9075\u5FAA\u5148\u8FDB\u5148\u51FA (FIFO, First-In-First-Out) \u539F\u5219\u7684\u7279\u6B8A\u7EBF\u6027\u8868\u3002"
  },
  {
    "id": 39,
    "type": "single",
    "question": "\u4EE5\u4E0B\u54EA\u4E2A\u64CD\u4F5C\u5728`LinkedList`\u4E0A\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\uFF1F",
    "options": [
      "`addFirst(e)`",
      "`removeLast()`",
      "`get(int index)`",
      "`add(e)` (\u5373 addLast)"
    ],
    "answer": "`get(int index)`",
    "score": 2.5,
    "explanation": "`LinkedList`\u7531\u4E8E\u662F\u94FE\u8868\u7ED3\u6784\uFF0C\u65E0\u6CD5\u76F4\u63A5\u901A\u8FC7\u8BA1\u7B97\u5185\u5B58\u5730\u5740\u504F\u79FB\u6765\u8BBF\u95EE\u5143\u7D20\uFF0C\u968F\u673A\u8BBF\u95EE`get(index)`\u9700\u8981\u4ECE\u5934\u6216\u5C3E\u5F00\u59CB\u904D\u5386\uFF0C\u76F4\u5230\u627E\u5230\u7B2Cindex\u4E2A\u8282\u70B9\uFF0C\u6240\u4EE5\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\u3002\u800C\u5934\u5C3E\u64CD\u4F5C\u90FD\u662FO(1)\u3002"
  },
  {
    "id": 40,
    "type": "short_answer",
    "question": "`Iterator`\u7684`remove()`\u65B9\u6CD5\u4E3A\u4EC0\u4E48\u662F\u5B89\u5168\u7684\uFF0C\u800C\u96C6\u5408\u7684`remove()`\u65B9\u6CD5\u5728\u8FED\u4EE3\u65F6\u4F1A\u4E0D\u5B89\u5168\uFF1F\u8BF7\u4ECE`modCount`\u7684\u89D2\u5EA6\u89E3\u91CA\u3002",
    "answer": "\u96C6\u5408\u5185\u90E8\u6709\u4E00\u4E2A`modCount`\u53D8\u91CF\uFF0C\u8BB0\u5F55\u96C6\u5408\u7ED3\u6784\u88AB\u4FEE\u6539\u7684\u6B21\u6570\u3002\u5F53\u521B\u5EFA\u8FED\u4EE3\u5668\u65F6\uFF0C\u8FED\u4EE3\u5668\u4F1A\u4FDD\u5B58\u4E00\u4EFD\u5F53\u524D\u96C6\u5408\u7684`modCount`\u503C\uFF08\u79F0\u4E3A`expectedModCount`\uFF09\u3002\u5728\u8FED\u4EE3\u8FC7\u7A0B\u4E2D\uFF0C\u5982\u679C\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u4FEE\u6539\u4E86\u96C6\u5408\uFF0C\u53EA\u4F1A\u589E\u52A0\u96C6\u5408\u7684`modCount`\uFF0C\u800C\u8FED\u4EE3\u5668\u7684`expectedModCount`\u6CA1\u6709\u53D8\u3002\u4E0B\u4E00\u6B21\u8FED\u4EE3\u5668\u64CD\u4F5C\uFF08\u5982`next()`\uFF09\u4F1A\u68C0\u67E5\u5230`modCount != expectedModCount`\uFF0C\u4E8E\u662F\u629B\u51FA`ConcurrentModificationException`\u3002\n\u800C`Iterator.remove()`\u65B9\u6CD5\u662F\u5B89\u5168\u7684\uFF0C\u56E0\u4E3A\u5B83\u5728\u5185\u90E8\u5220\u9664\u5143\u7D20\u7684\u540C\u65F6\uFF0C\u4F1A\u4E3B\u52A8\u66F4\u65B0\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`expectedModCount`\u4F7F\u5176\u4E0E\u96C6\u5408\u7684`modCount`\u4FDD\u6301\u540C\u6B65\uFF0C\u6240\u4EE5\u4E0D\u4F1A\u89E6\u53D1\u5F02\u5E38\u3002",
    "score": 4.5,
    "explanation": "\u8FD9\u662F\u5BF9\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u5E95\u5C42\u673A\u5236\u7684\u6DF1\u5EA6\u8003\u5BDF\uFF0C\u80FD\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\u8BF4\u660E\u5BF9`Iterator`\u7684\u5DE5\u4F5C\u539F\u7406\u6709\u975E\u5E38\u6E05\u6670\u7684\u8BA4\u8BC6\u3002"
  },
  {
    "id": 41,
    "type": "multiple",
    "question": "`java.util.Arrays`\u5DE5\u5177\u7C7B\u63D0\u4F9B\u4E86\u54EA\u4E9B\u5E38\u7528\u529F\u80FD\uFF1F",
    "options": [
      "`toString(array)`: \u5C06\u6570\u7EC4\u8F6C\u6362\u4E3A\u5B57\u7B26\u4E32\u3002",
      "`sort(array)`: \u5BF9\u6570\u7EC4\u8FDB\u884C\u6392\u5E8F\u3002",
      "`binarySearch(array, key)`: \u5728\u6709\u5E8F\u6570\u7EC4\u4E2D\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u3002",
      "`toList(array)`: \u76F4\u63A5\u5C06\u4EFB\u4F55\u6570\u7EC4\u9AD8\u6548\u8F6C\u6362\u4E3A`ArrayList`\u3002"
    ],
    "answer": [
      "`toString(array)`: \u5C06\u6570\u7EC4\u8F6C\u6362\u4E3A\u5B57\u7B26\u4E32\u3002",
      "`sort(array)`: \u5BF9\u6570\u7EC4\u8FDB\u884C\u6392\u5E8F\u3002",
      "`binarySearch(array, key)`: \u5728\u6709\u5E8F\u6570\u7EC4\u4E2D\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u3002"
    ],
    "score": 3,
    "explanation": "`Arrays`\u7C7B\u6CA1\u6709`toList()`\u65B9\u6CD5\u3002\u5C06\u6570\u7EC4\u8F6C\u4E3AList\u901A\u5E38\u4F7F\u7528`Arrays.asList()`\uFF0C\u4F46\u5B83\u8FD4\u56DE\u7684\u662F\u4E00\u4E2A\u5185\u90E8\u7C7B\u7684`List`\uFF0C\u8BE5`List`\u957F\u5EA6\u56FA\u5B9A\uFF0C\u4E0D\u652F\u6301`add`\u6216`remove`\u64CD\u4F5C\u3002\u6240\u4EE5\u9009\u9879D\u63CF\u8FF0\u4E0D\u51C6\u786E\u3002"
  },
  {
    "id": 42,
    "type": "single",
    "question": "\u5BF9\u4E8E\u4E00\u4E2A\u5DF2\u7ECF\u5B58\u50A8\u4E861000\u4E2A\u5143\u7D20\u7684`ArrayList`\uFF0C\u5728\u5217\u8868\u7684\u8D77\u59CB\u4F4D\u7F6E\uFF08\u7D22\u5F150\uFF09\u63D2\u5165\u4E00\u4E2A\u65B0\u5143\u7D20\uFF0C\u5927\u7EA6\u9700\u8981\u6267\u884C\u591A\u5C11\u6B21\u5143\u7D20\u79FB\u52A8\u64CD\u4F5C\uFF1F",
    "options": ["1\u6B21", "2\u6B21", "1000\u6B21", "\u4E0D\u9700\u8981\u79FB\u52A8"],
    "answer": "1000\u6B21",
    "score": 3,
    "explanation": "\u5728`ArrayList`\u7684\u8D77\u59CB\u4F4D\u7F6E\u63D2\u5165\u5143\u7D20\uFF0C\u4E3A\u4E86\u7ED9\u65B0\u5143\u7D20\u817E\u51FA\u7A7A\u95F4\uFF0C\u539F\u6709\u7684\u6240\u67091000\u4E2A\u5143\u7D20\u90FD\u9700\u8981\u5411\u540E\u79FB\u52A8\u4E00\u4F4D\u3002\u8FD9\u662F\u4E00\u4E2A\u5178\u578B\u7684O(n)\u64CD\u4F5C\uFF0Cn\u662F\u96C6\u5408\u7684\u5927\u5C0F\u3002"
  },
  {
    "id": 43,
    "type": "single",
    "question": "\u4EE5\u4E0B\u54EA\u79CD\u96C6\u5408\u5B9E\u73B0\u7C7B\u5728\u8FED\u4EE3\u65F6\u80FD\u4FDD\u8BC1\u5143\u7D20\u7684\u987A\u5E8F\u4E0E\u5176\u63D2\u5165\u65F6\u7684\u987A\u5E8F\u4E00\u81F4\uFF1F",
    "options": ["HashSet", "HashMap", "ArrayList", "TreeSet"],
    "answer": "ArrayList",
    "score": 2,
    "explanation": "`ArrayList`\u548C`LinkedList`\u90FD\u5C5E\u4E8E`List`\uFF0C\u4FDD\u8BC1\u4E86\u5143\u7D20\u7684\u63D2\u5165\u987A\u5E8F\u3002`HashSet`\u548C`HashMap`\u662F\u65E0\u5E8F\u7684\u3002`TreeSet`\u548C`TreeMap`\u4F1A\u6839\u636E\u5143\u7D20\u7684\u81EA\u7136\u987A\u5E8F\u6216\u6307\u5B9A\u7684`Comparator`\u8FDB\u884C\u6392\u5E8F\uFF0C\u800C\u4E0D\u662F\u63D2\u5165\u987A\u5E8F\u3002\uFF08\u6CE8\uFF1A`LinkedHashSet`\u548C`LinkedHashMap`\u53EF\u4EE5\u4FDD\u8BC1\u63D2\u5165\u987A\u5E8F\uFF0C\u4F46\u7B14\u8BB0\u672A\u63D0\u53CA\uFF09"
  },
  {
    "id": 44,
    "type": "code",
    "question": "\u5982\u679C\u6709\u4E00\u4E2A`User`\u7C7B\uFF0C\u5305\u542B`id`\u548C`name`\u5C5E\u6027\u3002\u8BF7\u91CD\u5199\u5176`equals()`\u65B9\u6CD5\uFF0C\u4F7F\u5F97\u53EA\u6709\u5F53`id`\u548C`name`\u90FD\u76F8\u540C\u65F6\uFF0C\u4E24\u4E2A`User`\u5BF9\u8C61\u624D\u88AB\u8BA4\u4E3A\u662F\u76F8\u7B49\u7684\u3002",
    "answer": "@Override\npublic boolean equals(Object obj) {\n    if (this == obj) return true;\n    if (obj == null || getClass() != obj.getClass()) return false;\n    User otherUser = (User) obj;\n    return this.id == otherUser.id && java.util.Objects.equals(this.name, otherUser.name);\n}",
    "score": 3.5,
    "explanation": "\u8003\u5BDF`equals`\u65B9\u6CD5\u7684\u6807\u51C6\u5199\u6CD5\uFF0C\u5305\u62EC\u5730\u5740\u6BD4\u8F83\u3001null\u68C0\u67E5\u548C\u7C7B\u578B\u68C0\u67E5\u7B49\u524D\u7F6E\u5224\u65AD\u3002\u4F7F\u7528`Objects.equals()`\u6765\u5904\u7406`name`\u53EF\u80FD\u4E3Anull\u7684\u60C5\u51B5\uFF0C\u662F\u66F4\u5065\u58EE\u7684\u5199\u6CD5\u3002"
  },
  {
    "id": 45,
    "type": "short_answer",
    "question": "\u6CDB\u578B\u4E2D\u7684\u201C\u7C7B\u578B\u64E6\u9664\u201D\uFF08Type Erasure\uFF09\u662F\u4EC0\u4E48\u610F\u601D\uFF1F\u5B83\u5BF9Java\u7684\u6CDB\u578B\u5B9E\u73B0\u610F\u5473\u7740\u4EC0\u4E48\uFF1F",
    "answer": "\u7C7B\u578B\u64E6\u9664\u662F\u6307Java\u6CDB\u578B\u4FE1\u606F\u53EA\u5B58\u5728\u4E8E\u4EE3\u7801\u7684\u7F16\u8BD1\u9636\u6BB5\uFF0C\u5728\u751F\u6210\u7684\u5B57\u8282\u7801\u4E2D\uFF0C\u6240\u6709\u7684\u6CDB\u578B\u7C7B\u578B\u53C2\u6570\u90FD\u4F1A\u88AB\u66FF\u6362\u4E3A\u5B83\u4EEC\u7684\u4E0A\u754C\uFF08\u5982`T`\u88AB\u66FF\u6362\u4E3A`Object`\uFF0C`T extends Number`\u88AB\u66FF\u6362\u4E3A`Number`\uFF09\uFF0C\u5E76\u63D2\u5165\u5FC5\u8981\u7684\u7C7B\u578B\u8F6C\u6362\u4EE3\u7801\u3002\u8FD9\u610F\u5473\u7740\uFF0C\u5BF9\u4E8EJVM\u6765\u8BF4\uFF0C`ArrayList<String>`\u548C`ArrayList<Integer>`\u5728\u8FD0\u884C\u65F6\u662F\u540C\u4E00\u4E2A\u7C7B\uFF08`ArrayList.class`\uFF09\uFF0C\u5B83\u5E76\u4E0D\u77E5\u9053\u96C6\u5408\u4E2D\u5143\u7D20\u7684\u786E\u5207\u6CDB\u578B\u7C7B\u578B\u3002",
    "score": 4,
    "explanation": "\u867D\u7136\u7B14\u8BB0\u4E2D\u53EA\u63D0\u5230\u4E86\u6CDB\u578B\u662F\u7F16\u8BD1\u671F\u673A\u5236\uFF0C\u4F46\u7406\u89E3\u7C7B\u578B\u64E6\u9664\u662F\u6DF1\u5165\u7406\u89E3\u6CDB\u578B\u672C\u8D28\u7684\u5173\u952E\u3002\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u4E86\u5BF9\u8FD9\u4E00\u6838\u5FC3\u6982\u5FF5\u7684\u8BA4\u77E5\u3002"
  },
  {
    "id": 46,
    "type": "single",
    "question": "\u5F53\u4E0D\u518D\u63A8\u8350\u4F7F\u7528`Hashtable`\u65F6\uFF0C\u5982\u679C\u9700\u8981\u4E00\u4E2A\u7EBF\u7A0B\u5B89\u5168\u7684`Map`\u5B9E\u73B0\uFF0C\u5E94\u8BE5\u4F18\u5148\u9009\u62E9\u54EA\u4E2A\u7C7B\uFF1F",
    "options": ["Collections.synchronizedMap(new HashMap())", "ConcurrentHashMap", "TreeMap", "\u81EA\u5DF1\u7528`synchronized`\u5173\u952E\u5B57\u5305\u88C5HashMap\u7684\u6240\u6709\u65B9\u6CD5"],
    "answer": "ConcurrentHashMap",
    "score": 3,
    "explanation": "\u7B14\u8BB0\u4E2D\u63D0\u5230\uFF0C`ConcurrentHashMap`\u63D0\u4F9B\u4E86\u6BD4`Hashtable`\u66F4\u597D\u7684\u5E76\u53D1\u6027\u80FD\u3002`ConcurrentHashMap`\u4F7F\u7528\u4E86\u66F4\u5148\u8FDB\u7684\u9501\u673A\u5236\uFF08\u5982\u5206\u6BB5\u9501\u6216CAS\uFF09\uFF0C\u5728\u9AD8\u5E76\u53D1\u573A\u666F\u4E0B\uFF0C\u5176\u541E\u5410\u91CF\u8FDC\u8D85\u4E8E\u5BF9\u6574\u4E2A`Map`\u8FDB\u884C\u540C\u6B65\u7684`Hashtable`\u6216`Collections.synchronizedMap`\u3002"
  },
  {
    "id": 47,
    "type": "multiple",
    "question": "\u4EE5\u4E0B\u5173\u4E8E`HashSet`\u7684\u8BF4\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    "options": [
      "\u5B83\u4E0D\u5141\u8BB8\u5B58\u50A8\u91CD\u590D\u7684\u5143\u7D20\u3002",
      "\u5B83\u901A\u5E38\u4E0D\u4FDD\u8BC1\u5143\u7D20\u7684\u5B58\u50A8\u548C\u53D6\u51FA\u987A\u5E8F\u3002",
      "\u5B83\u5141\u8BB8\u5B58\u50A8\u4E00\u4E2A`null`\u5143\u7D20\u3002",
      "\u5B83\u7684\u6240\u6709\u64CD\u4F5C\u90FD\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002"
    ],
    "answer": [
      "\u5B83\u4E0D\u5141\u8BB8\u5B58\u50A8\u91CD\u590D\u7684\u5143\u7D20\u3002",
      "\u5B83\u901A\u5E38\u4E0D\u4FDD\u8BC1\u5143\u7D20\u7684\u5B58\u50A8\u548C\u53D6\u51FA\u987A\u5E8F\u3002",
      "\u5B83\u5141\u8BB8\u5B58\u50A8\u4E00\u4E2A`null`\u5143\u7D20\u3002"
    ],
    "score": 3,
    "explanation": "`HashSet`\u7684\u6838\u5FC3\u7279\u6027\u5C31\u662F\u65E0\u5E8F\u3001\u552F\u4E00\uFF0C\u5E76\u5141\u8BB8\u4E00\u4E2Anull\u3002\u4E0E`HashMap`\u4E00\u6837\uFF0C\u5B83\u672C\u8EAB\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\u3002\u9700\u8981\u7EBF\u7A0B\u5B89\u5168\u7684Set\u53EF\u4EE5\u4F7F\u7528`Collections.synchronizedSet()`\u6216`ConcurrentHashMap.newKeySet()`\u3002"
  },
  {
    "id": 48,
    "type": "single",
    "question": "\u5982\u679C\u4E00\u4E2A`ArrayList`\u7684`remove(Object o)`\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u5B83\u4F1A\u5982\u4F55\u67E5\u627E\u8981\u5220\u9664\u7684\u5143\u7D20\uFF1F",
    "options": [
      "\u4F7F\u7528\u4E8C\u5206\u67E5\u627E\u3002",
      "\u901A\u8FC7\u54C8\u5E0C\u5B9A\u4F4D\u3002",
      "\u4ECE\u5934\u5230\u5C3E\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u6BD4\u8F83\u3002",
      "\u4ECE\u5C3E\u5230\u5934\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`==`\u8FDB\u884C\u6BD4\u8F83\u3002"
    ],
    "answer": "\u4ECE\u5934\u5230\u5C3E\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u6BD4\u8F83\u3002",
    "score": 2.5,
    "explanation": "`ArrayList`\u7684`remove(Object o)`\u5B9E\u73B0\u662F\u7EBF\u6027\u641C\u7D22\uFF0C\u5B83\u4F1A\u4ECE\u5217\u8868\u7684\u7B2C\u4E00\u4E2A\u5143\u7D20\u5F00\u59CB\uFF0C\u9010\u4E2A\u8C03\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u5339\u914D\uFF0C\u76F4\u5230\u627E\u5230\u7B2C\u4E00\u4E2A\u5339\u914D\u7684\u5143\u7D20\u5E76\u5220\u9664\u5B83\u3002\u56E0\u6B64\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\u3002"
  },
  {
    "id": 49,
    "type": "short_answer",
    "question": "\u5728Java\u4E2D\uFF0C\u4E3A\u4F55\u63A8\u8350\u4F7F\u7528\u63A5\u53E3\uFF08\u5982`List`\u3001`Map`\uFF09\u4F5C\u4E3A\u53D8\u91CF\u58F0\u660E\u7C7B\u578B\u6216\u65B9\u6CD5\u53C2\u6570\u7C7B\u578B\uFF0C\u800C\u4E0D\u662F\u5177\u4F53\u7684\u5B9E\u73B0\u7C7B\uFF08\u5982 `ArrayList`\u3001`HashMap`\uFF09\uFF1F",
    "answer": "\u8FD9\u662F\u9762\u5411\u63A5\u53E3\u7F16\u7A0B\u7684\u4E00\u79CD\u4F53\u73B0\uFF0C\u4E3B\u8981\u6709\u4EE5\u4E0B\u597D\u5904\uFF1A\n1. **\u89E3\u8026\u548C\u7075\u6D3B\u6027**\uFF1A\u4EE3\u7801\u4E0D\u4F9D\u8D56\u4E8E\u5177\u4F53\u7684\u5B9E\u73B0\u7EC6\u8282\u3002\u672A\u6765\u5982\u679C\u53D1\u73B0`ArrayList`\u6027\u80FD\u4E0D\u4F73\uFF0C\u53EF\u4EE5\u5F88\u65B9\u4FBF\u5730\u5C06\u5176\u66FF\u6362\u4E3A`LinkedList`\u6216\u5176\u4ED6`List`\u5B9E\u73B0\uFF0C\u800C\u4E0D\u9700\u8981\u4FEE\u6539\u5927\u91CF\u4F7F\u7528\u8BE5`List`\u7684\u4EE3\u7801\u3002\n2. **\u53EF\u6269\u5C55\u6027**\uFF1A\u4F7F\u4EE3\u7801\u66F4\u52A0\u901A\u7528\uFF0C\u53EF\u4EE5\u63A5\u53D7\u4EFB\u4F55\u7B26\u5408\u8BE5\u63A5\u53E3\u89C4\u8303\u7684\u5B9E\u73B0\u7C7B\u7684\u5BF9\u8C61\u3002\n3. **\u7B26\u5408\u8BBE\u8BA1\u539F\u5219**\uFF1A\u7B26\u5408\u201C\u4F9D\u8D56\u5012\u7F6E\u539F\u5219\u201D\uFF0C\u5373\u5E94\u8BE5\u4F9D\u8D56\u4E8E\u62BD\u8C61\uFF0C\u800C\u4E0D\u662F\u4F9D\u8D56\u4E8E\u5177\u4F53\u3002",
    "score": 3.5,
    "explanation": "\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u91CD\u8981\u7684\u7F16\u7A0B\u5B9E\u8DF5\u95EE\u9898\uFF0C\u8003\u5BDF\u4E86\u5BF9\u9762\u5411\u5BF9\u8C61\u8BBE\u8BA1\u539F\u5219\u7684\u7406\u89E3\u3002\u4F8B\u5982\uFF0C\u58F0\u660E `List<String> users = new ArrayList<>();` \u597D\u4E8E `ArrayList<String> users = new ArrayList<>();`\u3002"
  },
  {
    "id": 50,
    "type": "code",
    "question": '\u5047\u8BBE\u6709\u4E00\u4E2A`Map<String, Integer> map`\uFF0C\u5176\u4E2D\u4E00\u4E2A\u952E\u4E3A"b"\u3002\u4EE5\u4E0B\u8FD9\u6BB5\u5220\u9664\u64CD\u4F5C\u7684\u4EE3\u7801\u6709\u4EC0\u4E48\u95EE\u9898\uFF1F\u5E94\u8BE5\u5982\u4F55\u4FEE\u6B63\uFF1F\n\nfor (String key : map.keySet()) {\n    if ("b".equals(key)) {\n        map.remove("b");\n    }\n}',
    "answer": '\u95EE\u9898\uFF1A\u8FD9\u6BB5\u4EE3\u7801\u4F1A\u5728\u8FD0\u884C\u65F6\u629B\u51FA`ConcurrentModificationException`\uFF0C\u56E0\u4E3A\u5728\u901A\u8FC7`keySet`\u7684\u8FED\u4EE3\u5668\u8FDB\u884C\u904D\u5386\u65F6\uFF0C\u4F7F\u7528\u4E86`map`\u81EA\u8EAB\u7684\u65B9\u6CD5`remove`\u6765\u4FEE\u6539\u96C6\u5408\u7ED3\u6784\u3002\n\n\u4FEE\u6B63\uFF1A\u5E94\u8BE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove`\u65B9\u6CD5\u8FDB\u884C\u5220\u9664\u3002\n\nIterator<String> iterator = map.keySet().iterator();\nwhile (iterator.hasNext()) {\n    String key = iterator.next();\n    if ("b".equals(key)) {\n        iterator.remove(); // \u6B63\u786E\u505A\u6CD5\n    }\n}',
    "score": 4,
    "explanation": "\u8FD9\u662F\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u7684\u53C8\u4E00\u4E2A\u7ECF\u5178\u6848\u4F8B\uFF0C\u8FD9\u6B21\u662F\u53D1\u751F\u5728`Map`\u7684\u904D\u5386\u4E2D\u3002\u5B83\u5F3A\u5316\u4E86\u201C\u5728\u8FED\u4EE3\u8FC7\u7A0B\u4E2D\u5FC5\u987B\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u5DF1\u7684\u65B9\u6CD5\u6765\u4FEE\u6539\u96C6\u5408\u201D\u8FD9\u4E00\u9EC4\u91D1\u6CD5\u5219\u3002"
  }
];
var app = new Hono2().basePath("/api");
app.get("/questions", (c) => {
  return c.json(questions);
});
app.post("/users", async (c) => {
  const { userId } = await c.req.json();
  if (!userId) {
    return c.json({ error: "User ID is required" }, 400);
  }
  try {
    await c.env.DB.prepare("INSERT INTO Users (id) VALUES (?)").bind(userId).run();
    return c.json({ success: true, userId });
  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return c.json({ success: true, message: "User already exists.", userId });
    }
    return c.json({ error: "Failed to create user", details: e.message }, 500);
  }
});
app.get("/users/:userId/wrong-questions", async (c) => {
  const { userId } = c.req.param();
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT questionId, userAnswer FROM WrongAnswers WHERE userId = ?"
    ).bind(userId).all();
    const wrongQuestionData = results.map((r) => ({
      id: r.questionId,
      userAnswer: r.userAnswer
    }));
    const wrongQuestions = wrongQuestionData.map((wq) => {
      const questionDetails = questions.find((q) => q.id === wq.id);
      return { ...questionDetails, userAnswer: wq.userAnswer };
    });
    return c.json(wrongQuestions);
  } catch (e) {
    return c.json({ error: "Failed to fetch wrong questions", details: e.message }, 500);
  }
});
app.post("/users/:userId/wrong-questions", async (c) => {
  const { userId } = c.req.param();
  const { questionId, userAnswer } = await c.req.json();
  console.log(`Received request to add wrong question: userId=${userId}, questionId=${questionId}`);
  if (!questionId) {
    console.error("Validation failed: Question ID is required.");
    return c.json({ error: "Question ID is required" }, 400);
  }
  try {
    console.log("Ensuring user exists in DB...");
    await c.env.DB.prepare("INSERT OR IGNORE INTO Users (id) VALUES (?)").bind(userId).run();
    console.log("User ensured.");
    console.log("Adding/updating wrong answer...");
    const stmt = c.env.DB.prepare(
      "INSERT OR REPLACE INTO WrongAnswers (userId, questionId, userAnswer) VALUES (?, ?, ?)"
    );
    const result = await stmt.bind(userId, questionId, JSON.stringify(userAnswer)).run();
    console.log("Database operation result:", JSON.stringify(result));
    return c.json({ success: true });
  } catch (e) {
    console.error("Failed to add or update wrong question:", e.message);
    return c.json({ error: "Failed to add or update wrong question", details: e.message }, 500);
  }
});
app.delete("/users/:userId/wrong-questions/:questionId", async (c) => {
  const { userId, questionId } = c.req.param();
  try {
    await c.env.DB.prepare("DELETE FROM WrongAnswers WHERE userId = ? AND questionId = ?").bind(userId, parseInt(questionId, 10)).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to delete wrong question", details: e.message }, 500);
  }
});
var onRequest = handle(app);
var routes = [
  {
    routePath: "/api/:path*",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];
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
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
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
        pattern: pattern || safePattern(prefix),
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
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
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
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
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
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
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
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../.nvm/versions/node/v22.18.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
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
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../.nvm/versions/node/v22.18.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-NL43no/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../.nvm/versions/node/v22.18.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-NL43no/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.21068906214690308.js.map
