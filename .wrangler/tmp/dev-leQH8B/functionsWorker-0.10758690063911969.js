var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-rBkm2S/checked-fetch.js
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

// .wrangler/tmp/pages-fFKPd4/functionsWorker-0.10758690063911969.mjs
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
var decodeBase64Url = /* @__PURE__ */ __name2((str) => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
}, "decodeBase64Url");
var encodeBase64Url = /* @__PURE__ */ __name2((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
var encodeBase64 = /* @__PURE__ */ __name2((buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}, "encodeBase64");
var decodeBase64 = /* @__PURE__ */ __name2((str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
}, "decodeBase64");
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = /* @__PURE__ */ __name2(() => {
  const global = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && true;
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}, "getRuntimeKey");
var checkUserAgentEquals = /* @__PURE__ */ __name2((platform) => {
  const userAgent = "Cloudflare-Workers";
  return userAgent.startsWith(platform);
}, "checkUserAgentEquals");
var JwtAlgorithmNotImplemented = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotImplemented");
  }
  static {
    __name2(this, "JwtAlgorithmNotImplemented");
  }
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtTokenInvalid = class extends Error {
  static {
    __name(this, "JwtTokenInvalid");
  }
  static {
    __name2(this, "JwtTokenInvalid");
  }
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  static {
    __name(this, "JwtTokenNotBefore");
  }
  static {
    __name2(this, "JwtTokenNotBefore");
  }
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  static {
    __name(this, "JwtTokenExpired");
  }
  static {
    __name2(this, "JwtTokenExpired");
  }
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  static {
    __name(this, "JwtTokenIssuedAt");
  }
  static {
    __name2(this, "JwtTokenIssuedAt");
  }
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  static {
    __name(this, "JwtTokenIssuer");
  }
  static {
    __name2(this, "JwtTokenIssuer");
  }
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  static {
    __name(this, "JwtHeaderInvalid");
  }
  static {
    __name2(this, "JwtHeaderInvalid");
  }
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  static {
    __name(this, "JwtHeaderRequiresKid");
  }
  static {
    __name2(this, "JwtHeaderRequiresKid");
  }
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  static {
    __name(this, "JwtTokenSignatureMismatched");
  }
  static {
    __name2(this, "JwtTokenSignatureMismatched");
  }
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
__name(signing, "signing");
__name2(signing, "signing");
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
__name(verifying, "verifying");
__name2(verifying, "verifying");
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, ""));
}
__name(pemToBinary, "pemToBinary");
__name2(pemToBinary, "pemToBinary");
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPrivateKey, "importPrivateKey");
__name2(importPrivateKey, "importPrivateKey");
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPublicKey, "importPublicKey");
__name2(importPublicKey, "importPublicKey");
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x, y } = jwk;
  return { kty, alg, e, n, crv, x, y, key_ops: [CryptoKeyUsage.Verify] };
}
__name(exportPublicJwkFrom, "exportPublicJwkFrom");
__name2(exportPublicJwkFrom, "exportPublicJwkFrom");
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
__name(getKeyAlgorithm, "getKeyAlgorithm");
__name2(getKeyAlgorithm, "getKeyAlgorithm");
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
__name(isCryptoKey, "isCryptoKey");
__name2(isCryptoKey, "isCryptoKey");
var encodeJwtPart = /* @__PURE__ */ __name2((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
var encodeSignaturePart = /* @__PURE__ */ __name2((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
var decodeJwtPart = /* @__PURE__ */ __name2((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
__name(isTokenHeader, "isTokenHeader");
__name2(isTokenHeader, "isTokenHeader");
var sign = /* @__PURE__ */ __name2(async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
}, "sign");
var verify = /* @__PURE__ */ __name2(async (token, publicKey, algOrOptions) => {
  const optsIn = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions || {};
  const opts = {
    alg: optsIn.alg ?? "HS256",
    iss: optsIn.iss,
    nbf: optsIn.nbf ?? true,
    exp: optsIn.exp ?? true,
    iat: optsIn.iat ?? true
  };
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  const now = Date.now() / 1e3 | 0;
  if (opts.nbf && payload.nbf && payload.nbf > now) {
    throw new JwtTokenNotBefore(token);
  }
  if (opts.exp && payload.exp && payload.exp <= now) {
    throw new JwtTokenExpired(token);
  }
  if (opts.iat && payload.iat && now < payload.iat) {
    throw new JwtTokenIssuedAt(now, payload.iat);
  }
  if (opts.iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(opts.iss, null);
    }
    if (typeof opts.iss === "string" && payload.iss !== opts.iss) {
      throw new JwtTokenIssuer(opts.iss, payload.iss);
    }
    if (opts.iss instanceof RegExp && !opts.iss.test(payload.iss)) {
      throw new JwtTokenIssuer(opts.iss, payload.iss);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    opts.alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
}, "verify");
var verifyWithJwks = /* @__PURE__ */ __name2(async (token, options, init) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    if (options.keys) {
      options.keys.push(...data.keys);
    } else {
      options.keys = data.keys;
    }
  } else if (!options.keys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = options.keys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  return await verify(token, matchingKey, {
    alg: matchingKey.alg || header.alg,
    ...verifyOpts
  });
}, "verifyWithJwks");
var decode = /* @__PURE__ */ __name2((token) => {
  try {
    const [h, p] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decode");
var decodeHeader = /* @__PURE__ */ __name2((token) => {
  try {
    const [h] = token.split(".");
    return decodeJwtPart(h);
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decodeHeader");
var Jwt = { sign, verify, decode, verifyWithJwks };
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
__name(unsafeStringify, "unsafeStringify");
__name2(unsafeStringify, "unsafeStringify");
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
__name(rng, "rng");
__name2(rng, "rng");
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = { randomUUID };
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
__name(v4, "v4");
__name2(v4, "v4");
var v4_default = v4;
var questions_default = [
  {
    id: 1,
    type: "multiple",
    question: "\u6839\u636E\u7B14\u8BB0\u5185\u5BB9\uFF0C\u5173\u4E8EJava\u96C6\u5408\uFF08Collection\uFF09\u4E0E\u6570\u7EC4\uFF08Array\uFF09\u7684\u5BF9\u6BD4\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u6570\u7EC4\u7684\u957F\u5EA6\u662F\u4E0D\u53EF\u53D8\u7684\uFF0C\u800C\u96C6\u5408\u7684\u957F\u5EA6\u662F\u53EF\u53D8\u7684\u3002",
      "\u6570\u7EC4\u53EF\u4EE5\u5B58\u50A8\u57FA\u672C\u6570\u636E\u7C7B\u578B\u548C\u5F15\u7528\u6570\u636E\u7C7B\u578B\uFF0C\u800C\u96C6\u5408\u53EA\u80FD\u5B58\u50A8\u5F15\u7528\u6570\u636E\u7C7B\u578B\u3002",
      "\u5F53\u5904\u7406\u4E00\u7EC4\u6570\u91CF\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u52A8\u6001\u53D8\u5316\u7684\u6570\u636E\u65F6\uFF0C\u96C6\u5408\u662F\u6BD4\u6570\u7EC4\u66F4\u597D\u7684\u9009\u62E9\u3002",
      "\u96C6\u5408\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u53EA\u80FD\u662F\u94FE\u8868\u6216\u54C8\u5E0C\u8868\uFF0C\u800C\u6570\u7EC4\u662F\u8FDE\u7EED\u7684\u5185\u5B58\u7A7A\u95F4\u3002"
    ],
    answer: [
      "\u6570\u7EC4\u7684\u957F\u5EA6\u662F\u4E0D\u53EF\u53D8\u7684\uFF0C\u800C\u96C6\u5408\u7684\u957F\u5EA6\u662F\u53EF\u53D8\u7684\u3002",
      "\u6570\u7EC4\u53EF\u4EE5\u5B58\u50A8\u57FA\u672C\u6570\u636E\u7C7B\u578B\u548C\u5F15\u7528\u6570\u636E\u7C7B\u578B\uFF0C\u800C\u96C6\u5408\u53EA\u80FD\u5B58\u50A8\u5F15\u7528\u6570\u636E\u7C7B\u578B\u3002",
      "\u5F53\u5904\u7406\u4E00\u7EC4\u6570\u91CF\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u52A8\u6001\u53D8\u5316\u7684\u6570\u636E\u65F6\uFF0C\u96C6\u5408\u662F\u6BD4\u6570\u7EC4\u66F4\u597D\u7684\u9009\u62E9\u3002"
    ],
    score: 3,
    explanation: "\u8FD9\u662F\u96C6\u5408\u4E0E\u6570\u7EC4\u6700\u6838\u5FC3\u7684\u533A\u522B\u3002\u96C6\u5408\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u591A\u6837\u7684\uFF0C\u5305\u62EC\u6570\u7EC4\uFF08\u5982ArrayList\uFF09\u3001\u94FE\u8868\uFF08\u5982LinkedList\uFF09\u3001\u54C8\u5E0C\u8868\uFF08\u5982HashSet\uFF09\u3001\u7EA2\u9ED1\u6811\uFF08\u5982TreeSet\uFF09\u7B49\uFF0C\u6240\u4EE5\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002"
  },
  {
    id: 2,
    type: "single",
    question: "\u5728Java\u96C6\u5408\u6846\u67B6\u4E2D\uFF0C\u54EA\u4E00\u4E2A\u9876\u5C42\u63A5\u53E3\u7528\u4E8E\u8868\u793A\u952E\u503C\u5BF9\uFF08Key-Value Pair\uFF09\u7684\u96C6\u5408\uFF1F",
    options: ["Collection", "List", "Set", "Map"],
    answer: "Map",
    score: 1,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0CJava\u96C6\u5408\u6846\u67B6\u5206\u4E3A\u4E24\u5927\u9876\u5C42\u63A5\u53E3\uFF1A`Collection`\u7528\u4E8E\u5904\u7406\u72EC\u7ACB\u7684\u3001\u5355\u4E2A\u7684\u5143\u7D20\uFF1B`Map`\u7528\u4E8E\u5904\u7406\u952E\u503C\u5BF9\u6570\u636E\u3002"
  },
  {
    id: 3,
    type: "short_answer",
    question: "\u8BF7\u7B80\u8FF0`List`\u548C`Set`\u63A5\u53E3\u5728\u6838\u5FC3\u7279\u6027\u4E0A\u7684\u4E3B\u8981\u533A\u522B\u3002",
    answer: "`List`\u63A5\u53E3\u7684\u7279\u70B9\u662F\u5143\u7D20\u6709\u5E8F\uFF08\u6309\u63D2\u5165\u987A\u5E8F\u5B58\u50A8\uFF09\u4E14\u53EF\u91CD\u590D\u3002`Set`\u63A5\u53E3\u7684\u7279\u70B9\u662F\u5143\u7D20\u901A\u5E38\u65E0\u5E8F\uFF08\u4E0D\u4FDD\u8BC1\u63D2\u5165\u987A\u5E8F\uFF09\u4E14\u4E0D\u53EF\u91CD\u590D\u3002",
    score: 2.5,
    explanation: "\u8FD9\u662F\u5BF9`Collection`\u4E24\u5927\u6838\u5FC3\u5B50\u63A5\u53E3\u57FA\u672C\u7279\u5F81\u7684\u8003\u5BDF\uFF0C\u7406\u89E3\u5B83\u4EEC\u7684\u533A\u522B\u662F\u9009\u62E9\u6B63\u786E\u96C6\u5408\u7C7B\u7684\u7B2C\u4E00\u6B65\u3002"
  },
  {
    id: 4,
    type: "single",
    question: "\u5728\u4F55\u79CD\u4E1A\u52A1\u573A\u666F\u4E0B\uFF0C\u4F7F\u7528`LinkedList`\u4F1A\u6BD4`ArrayList`\u5177\u6709\u660E\u663E\u7684\u6027\u80FD\u4F18\u52BF\uFF1F",
    options: [
      "\u9700\u8981\u9891\u7E41\u5730\u6839\u636E\u7D22\u5F15\u968F\u673A\u8BBF\u95EE\u96C6\u5408\u4E2D\u7684\u5143\u7D20\u3002",
      "\u96C6\u5408\u4E2D\u7EDD\u5927\u591A\u6570\u64CD\u4F5C\u662F\u904D\u5386\u5143\u7D20\u3002",
      "\u9700\u8981\u9891\u7E41\u5730\u5728\u5217\u8868\u7684\u5934\u90E8\u548C\u5C3E\u90E8\u8FDB\u884C\u63D2\u5165\u548C\u5220\u9664\u64CD\u4F5C\u3002",
      "\u96C6\u5408\u521B\u5EFA\u540E\uFF0C\u5143\u7D20\u6570\u91CF\u56FA\u5B9A\u4E0D\u53D8\uFF0C\u4E3B\u8981\u7528\u4E8E\u5B58\u50A8\u548C\u8BFB\u53D6\u3002"
    ],
    answer: "\u9700\u8981\u9891\u7E41\u5730\u5728\u5217\u8868\u7684\u5934\u90E8\u548C\u5C3E\u90E8\u8FDB\u884C\u63D2\u5165\u548C\u5220\u9664\u64CD\u4F5C\u3002",
    score: 3,
    explanation: "\u6839\u636E\u7B14\u8BB0\u4E2D\u7684\u9009\u578B\u603B\u7ED3\uFF0C`LinkedList`\u7684\u5E95\u5C42\u662F\u53CC\u5411\u94FE\u8868\uFF0C\u5BF9\u5934\u5C3E\u8282\u70B9\u7684\u64CD\u4F5C\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\uFF0C\u8FDC\u4F18\u4E8E`ArrayList`\u7684O(n)\u3002\u800C\u968F\u673A\u8BBF\u95EE\u662F`ArrayList`\u7684\u5F3A\u9879\uFF08O(1)\uFF09\u3002"
  },
  {
    id: 5,
    type: "multiple",
    question: "\u5173\u4E8E`ArrayList`\u7684\u5E95\u5C42\u5B9E\u73B0\u548C\u7279\u6027\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5B83\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u52A8\u6001\u6570\u7EC4\u3002",
      "\u901A\u8FC7\u7D22\u5F15`get(index)`\u8BBF\u95EE\u5143\u7D20\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\u3002",
      "\u5728\u5217\u8868\u7684\u4E2D\u95F4\u4F4D\u7F6E\u63D2\u5165\u6216\u5220\u9664\u5143\u7D20\uFF0C\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u901A\u5E38\u4E3AO(n)\u3002",
      "\u5F53\u5BB9\u91CF\u4E0D\u8DB3\u65F6\uFF0C`ArrayList`\u4F1A\u81EA\u52A8\u6269\u5BB9\uFF0C\u521B\u5EFA\u4E00\u4E2A\u66F4\u5927\u7684\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u6240\u6709\u65E7\u5143\u7D20\u3002"
    ],
    answer: [
      "\u5B83\u7684\u5E95\u5C42\u6570\u636E\u7ED3\u6784\u662F\u52A8\u6001\u6570\u7EC4\u3002",
      "\u901A\u8FC7\u7D22\u5F15`get(index)`\u8BBF\u95EE\u5143\u7D20\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u4E3AO(1)\u3002",
      "\u5728\u5217\u8868\u7684\u4E2D\u95F4\u4F4D\u7F6E\u63D2\u5165\u6216\u5220\u9664\u5143\u7D20\uFF0C\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u901A\u5E38\u4E3AO(n)\u3002",
      "\u5F53\u5BB9\u91CF\u4E0D\u8DB3\u65F6\uFF0C`ArrayList`\u4F1A\u81EA\u52A8\u6269\u5BB9\uFF0C\u521B\u5EFA\u4E00\u4E2A\u66F4\u5927\u7684\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u6240\u6709\u65E7\u5143\u7D20\u3002"
    ],
    score: 4,
    explanation: "\u8FD9\u56DB\u4E2A\u9009\u9879\u5168\u9762\u5730\u6982\u62EC\u4E86`ArrayList`\u7684\u6838\u5FC3\u5DE5\u4F5C\u539F\u7406\u548C\u6027\u80FD\u7279\u70B9\uFF0C\u8FD9\u4E9B\u90FD\u662FJava\u5F00\u53D1\u4E2D\u5FC5\u987B\u638C\u63E1\u7684\u57FA\u7840\u77E5\u8BC6\u3002"
  },
  {
    id: 6,
    type: "short_answer",
    question: "\u4E3A\u4EC0\u4E48\u5728\u521B\u5EFA `ArrayList` \u65F6\uFF0C\u63A8\u8350\u6307\u5B9A\u4E00\u4E2A\u9884\u4F30\u7684\u521D\u59CB\u5BB9\u91CF\uFF08\u5982 `new ArrayList(100)`\uFF09\uFF1F\u8FD9\u6837\u505A\u6709\u4EC0\u4E48\u597D\u5904\uFF1F",
    answer: "\u63A8\u8350\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u662F\u4E3A\u4E86\u6027\u80FD\u4F18\u5316\u3002\u5982\u679C\u9884\u5148\u77E5\u9053\u5927\u81F4\u7684\u6570\u636E\u91CF\uFF0C\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u53EF\u4EE5\u907F\u514D\u6216\u51CF\u5C11`ArrayList`\u5728\u6DFB\u52A0\u5143\u7D20\u8FC7\u7A0B\u4E2D\u56E0\u8D85\u51FA\u5BB9\u91CF\u800C\u89E6\u53D1\u7684\u591A\u6B21\u201C\u6269\u5BB9\u201D\u64CD\u4F5C\u3002\u56E0\u4E3A\u6BCF\u6B21\u6269\u5BB9\u90FD\u9700\u8981\u521B\u5EFA\u65B0\u6570\u7EC4\u5E76\u590D\u5236\u65E7\u6570\u7EC4\u7684\u5168\u90E8\u5143\u7D20\uFF0C\u8FD9\u662F\u4E00\u4E2A\u8017\u65F6\u7684\u8FC7\u7A0B\u3002",
    score: 3,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u91CD\u8981\u7684\u6027\u80FD\u4F18\u5316\u6280\u5DE7\u3002\u5728\u80FD\u9884\u4F30\u6570\u636E\u91CF\u7684\u573A\u666F\u4E0B\uFF08\u4F8B\u5982\uFF0C\u4ECE\u6570\u636E\u5E93\u4E00\u6B21\u6027\u67E5\u8BE2N\u6761\u8BB0\u5F55\u653E\u5165List\uFF09\uFF0C\u6307\u5B9A\u521D\u59CB\u5BB9\u91CF\u662F\u4E13\u4E1A\u5F00\u53D1\u8005\u7684\u4E60\u60EF\u3002"
  },
  {
    id: 7,
    type: "code",
    question: "\u8BF7\u4F7F\u7528 `LinkedList` \u7684\u7279\u6709API\uFF0C\u6A21\u62DF\u4E00\u4E2A\u6808\uFF08Stack\uFF09\u7684\u5165\u6808\uFF08push\uFF09\u548C\u51FA\u6808\uFF08pop\uFF09\u64CD\u4F5C\u3002",
    code_prompt: "LinkedList<String> stack = new LinkedList<>();",
    answer: '// \u5165\u6808 \nstack.push("element1"); \n// \u6216\u8005 \nstack.addFirst("element1"); \n\n// \u51FA\u6808 \nString element = stack.pop(); \n// \u6216\u8005 \nString element = stack.removeFirst();',
    score: 3.5,
    explanation: "\u7B14\u8BB0\u4E2D\u63D0\u5230`LinkedList`\u5B9E\u73B0\u4E86`Deque`\u63A5\u53E3\uFF0C\u56E0\u6B64\u63D0\u4F9B\u4E86`push`\u548C`pop`\u7B49\u65B9\u6CD5\uFF0C\u53EF\u4EE5\u65B9\u4FBF\u5730\u4F5C\u4E3A\u6808\u4F7F\u7528\u3002\u8FD9\u8003\u5BDF\u4E86\u5BF9`LinkedList`\u4F5C\u4E3A\u53CC\u7AEF\u961F\u5217/\u6808\u4F7F\u7528\u7684\u719F\u6089\u7A0B\u5EA6\u3002"
  },
  {
    id: 8,
    type: "single",
    question: "\u5F15\u5165\u6CDB\u578B\uFF08Generics\uFF09\u6700\u4E3B\u8981\u7684\u76EE\u6807\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u63D0\u5347\u96C6\u5408\u7684\u8FD0\u884C\u6548\u7387\u3002",
      "\u51CF\u5C11\u4EE3\u7801\u91CF\u3002",
      "\u5C06\u7C7B\u578B\u68C0\u67E5\u4ECE\u8FD0\u884C\u65F6\u63D0\u524D\u5230\u7F16\u8BD1\u65F6\uFF0C\u4EE5\u63D0\u4F9B\u7C7B\u578B\u5B89\u5168\u3002",
      "\u5B9E\u73B0\u96C6\u5408\u7684\u591A\u6001\u6027\uFF0C\u8BA9 `List<Dog>` \u6210\u4E3A `List<Animal>` \u7684\u5B50\u7C7B\u3002"
    ],
    answer: "\u5C06\u7C7B\u578B\u68C0\u67E5\u4ECE\u8FD0\u884C\u65F6\u63D0\u524D\u5230\u7F16\u8BD1\u65F6\uFF0C\u4EE5\u63D0\u4F9B\u7C7B\u578B\u5B89\u5168\u3002",
    score: 2,
    explanation: "\u6CDB\u578B\u7684\u6838\u5FC3\u4EF7\u503C\u5728\u4E8E\u7C7B\u578B\u5B89\u5168\u3002\u5B83\u5141\u8BB8\u7F16\u8BD1\u5668\u5728\u7F16\u8BD1\u9636\u6BB5\u5C31\u53D1\u73B0\u7C7B\u578B\u4E0D\u5339\u914D\u7684\u9519\u8BEF\uFF0C\u907F\u514D\u4E86\u5728\u8FD0\u884C\u65F6\u53EF\u80FD\u51FA\u73B0\u7684`ClassCastException`\uFF0C\u5E76\u514D\u53BB\u4E86\u7E41\u7410\u7684\u624B\u52A8\u7C7B\u578B\u8F6C\u6362\u3002"
  },
  {
    id: 9,
    type: "short_answer",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0C\u8BF7\u89E3\u91CA\u4E3A\u4EC0\u4E48`List<User>`\u4E0D\u662F`List<Person>`\u7684\u5B50\u7C7B\u578B\uFF0C\u5373\u4F7F`User`\u662F`Person`\u7684\u5B50\u7C7B\uFF1F\u8FD9\u4E2A\u7279\u6027\u53EB\u4EC0\u4E48\uFF1F",
    answer: "\u8FD9\u4E2A\u7279\u6027\u53EB\u505A\u201C\u6CDB\u578B\u4E0D\u5177\u6709\u591A\u6001\u6027\u201D\u3002`List<User>`\u548C`List<Person>`\u662F\u4E24\u79CD\u5B8C\u5168\u4E0D\u540C\u7684\u7C7B\u578B\uFF0C\u5B83\u4EEC\u4E4B\u95F4\u6CA1\u6709\u7EE7\u627F\u5173\u7CFB\u3002\u5982\u679C\u5141\u8BB8\u8FD9\u79CD\u8D4B\u503C\uFF08`List<Person> pList = new ArrayList<User>()`\uFF09\uFF0C\u90A3\u4E48\u4E4B\u540E\u5C31\u53EF\u4EE5\u901A\u8FC7`pList.add(new Animal())`\u5411\u4E00\u4E2A\u672C\u5E94\u53EA\u5B58\u653E`User`\u7684\u96C6\u5408\u4E2D\u6DFB\u52A0\u5176\u4ED6\u7C7B\u578B\u7684\u5BF9\u8C61\uFF0C\u8FD9\u5C06\u7834\u574F\u6CDB\u578B\u7684\u7C7B\u578B\u5B89\u5168\u4FDD\u8BC1\u3002",
    score: 3.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u6CDB\u578B\u4E2D\u975E\u5E38\u91CD\u8981\u4E14\u5BB9\u6613\u6DF7\u6DC6\u7684\u6982\u5FF5\u3002\u7406\u89E3\u8FD9\u4E00\u70B9\u5BF9\u4E8E\u6B63\u786E\u4F7F\u7528\u6CDB\u578B\u548C\u7406\u89E3\u6CDB\u578B\u901A\u914D\u7B26\uFF08\u5982`? extends Person`\uFF09\u81F3\u5173\u91CD\u8981\u3002"
  },
  {
    id: 10,
    type: "multiple",
    question: "\u8981\u786E\u4FDD\u4E00\u4E2A\u81EA\u5B9A\u4E49\u7C7B\u7684\u5BF9\u8C61\u80FD\u591F\u5728`HashSet`\u4E2D\u6B63\u786E\u5730\u5B9E\u73B0\u552F\u4E00\u6027\uFF08\u5373\u5185\u5BB9\u76F8\u540C\u7684\u5BF9\u8C61\u88AB\u89C6\u4E3A\u540C\u4E00\u4E2A\uFF09\uFF0C\u5FC5\u987B\u91C7\u53D6\u54EA\u4E9B\u63AA\u65BD\uFF1F",
    options: [
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`Serializable`\u63A5\u53E3\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`equals()`\u65B9\u6CD5\uFF0C\u5B9A\u4E49\u5BF9\u8C61\u5185\u5BB9\u76F8\u7B49\u7684\u903B\u8F91\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u4FDD\u8BC1`equals()`\u4E3A`true`\u7684\u4E24\u4E2A\u5BF9\u8C61\u5176`hashCode()`\u8FD4\u56DE\u503C\u4E5F\u5FC5\u987B\u76F8\u7B49\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`Comparable`\u63A5\u53E3\u3002"
    ],
    answer: [
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`equals()`\u65B9\u6CD5\uFF0C\u5B9A\u4E49\u5BF9\u8C61\u5185\u5BB9\u76F8\u7B49\u7684\u903B\u8F91\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u4FDD\u8BC1`equals()`\u4E3A`true`\u7684\u4E24\u4E2A\u5BF9\u8C61\u5176`hashCode()`\u8FD4\u56DE\u503C\u4E5F\u5FC5\u987B\u76F8\u7B49\u3002"
    ],
    score: 4,
    explanation: "`HashSet`\u7684\u552F\u4E00\u6027\u5224\u65AD\u4F9D\u8D56\u4E8E`hashCode()`\u548C`equals()`\u8FD9\u4E24\u4E2A\u65B9\u6CD5\u3002`hashCode()`\u7528\u4E8E\u5FEB\u901F\u5B9A\u4F4D\u5B58\u50A8\u4F4D\u7F6E\uFF0C`equals()`\u7528\u4E8E\u5728\u54C8\u5E0C\u51B2\u7A81\u65F6\u8FDB\u884C\u7CBE\u786E\u6BD4\u8F83\u3002\u4E24\u8005\u5FC5\u987B\u540C\u65F6\u88AB\u6B63\u786E\u91CD\u5199\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u96C6\u5408\u884C\u4E3A\u5F02\u5E38\u3002"
  },
  {
    id: 11,
    type: "short_answer",
    question: "\u8BF7\u7B80\u8FF0\u5F53\u5411\u4E00\u4E2A`HashSet`\u4E2D`add(element)`\u4E00\u4E2A\u65B0\u5143\u7D20\u65F6\uFF0C\u5176\u5185\u90E8\u7684\u8BE6\u7EC6\u5DE5\u4F5C\u6D41\u7A0B\u3002",
    answer: "1. \u9996\u5148\u8C03\u7528`element`\u7684`hashCode()`\u65B9\u6CD5\u8BA1\u7B97\u54C8\u5E0C\u7801\uFF0C\u901A\u8FC7\u54C8\u5E0C\u7B97\u6CD5\u5B9A\u4F4D\u5230\u5E95\u5C42`HashMap`\u4E2D\u7684\u4E00\u4E2A\u6876\uFF08bucket\uFF09\u4F4D\u7F6E\u3002\n2. \u5982\u679C\u8BE5\u6876\u4E3A\u7A7A\uFF0C\u76F4\u63A5\u5C06\u5143\u7D20\u5B58\u5165\uFF0C\u6DFB\u52A0\u6210\u529F\u3002\n3. \u5982\u679C\u8BE5\u6876\u4E0D\u4E3A\u7A7A\uFF08\u53D1\u751F\u54C8\u5E0C\u51B2\u7A81\uFF09\uFF0C\u5219\u904D\u5386\u6876\u4E2D\u7684\u6240\u6709\u73B0\u6709\u5143\u7D20\u3002\n4. \u4F7F\u7528\u65B0\u5143\u7D20`element`\u7684`equals()`\u65B9\u6CD5\u4E0E\u6876\u5185\u6BCF\u4E2A\u73B0\u6709\u5143\u7D20\u8FDB\u884C\u6BD4\u8F83\u3002\n5. \u5982\u679C\u6709\u4EFB\u4F55\u4E00\u6B21`equals()`\u6BD4\u8F83\u8FD4\u56DE`true`\uFF0C\u5219\u8BA4\u4E3A\u5143\u7D20\u5DF2\u5B58\u5728\uFF0C\u6DFB\u52A0\u5931\u8D25\u3002\n6. \u5982\u679C\u904D\u5386\u5B8C\u6240\u6709\u5143\u7D20\uFF0C`equals()`\u90FD\u8FD4\u56DE`false`\uFF0C\u5219\u5C06\u65B0\u5143\u7D20\u6DFB\u52A0\u5230\u8FD9\u4E2A\u6876\u4E2D\uFF08\u901A\u5E38\u662F\u94FE\u8868\u6216\u7EA2\u9ED1\u6811\u7684\u672B\u5C3E\uFF09\uFF0C\u6DFB\u52A0\u6210\u529F\u3002",
    score: 4.5,
    explanation: "\u8FD9\u4E2A\u95EE\u9898\u6DF1\u5165\u8003\u5BDF\u4E86`HashSet`\u552F\u4E00\u6027\u4FDD\u8BC1\u7684\u5E95\u5C42\u539F\u7406\uFF0C\u662FJava\u9762\u8BD5\u4E2D\u5173\u4E8E\u96C6\u5408\u90E8\u5206\u7684\u9AD8\u9891\u8003\u70B9\uFF0C\u4F53\u73B0\u4E86\u5BF9\u6570\u636E\u7ED3\u6784\u5B9E\u73B0\u7684\u6DF1\u5165\u7406\u89E3\u3002"
  },
  {
    id: 12,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0C`HashSet`\u7684\u5E95\u5C42\u662F\u4F7F\u7528\u54EA\u4E00\u4E2A\u96C6\u5408\u7C7B\u6765\u5B9E\u73B0\u5176\u529F\u80FD\u7684\uFF1F",
    options: ["ArrayList", "TreeMap", "LinkedList", "HashMap"],
    answer: "HashMap",
    score: 2,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0C`HashSet`\u5185\u90E8\u6301\u6709\u4E00\u4E2A`HashMap`\u5B9E\u4F8B\u3002\u6DFB\u52A0\u5230`HashSet`\u4E2D\u7684\u5143\u7D20\u5B9E\u9645\u4E0A\u662F\u4F5C\u4E3A`key`\u5B58\u50A8\u5728\u5185\u90E8\u7684`HashMap`\u4E2D\uFF0C\u800C`value`\u5219\u662F\u4E00\u4E2A\u56FA\u5B9A\u7684\u5360\u4F4D\u5BF9\u8C61\u3002"
  },
  {
    id: 13,
    type: "multiple",
    question: "\u5173\u4E8E`HashMap`\u548C`Hashtable`\u7684\u5BF9\u6BD4\uFF0C\u4E0B\u5217\u8BF4\u6CD5\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    options: [
      "`HashMap`\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\uFF0C\u800C`Hashtable`\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002",
      "`HashMap`\u5141\u8BB8\u4E00\u4E2Anull\u952E\u548C\u591A\u4E2Anull\u503C\uFF0C\u800C`Hashtable`\u4E0D\u5141\u8BB8\u4EFB\u4F55null\u952E\u6216null\u503C\u3002",
      "\u5728\u65B0\u4EE3\u7801\u4E2D\uFF0C\u5982\u679C\u9700\u8981\u7EBF\u7A0B\u5B89\u5168\u7684Map\uFF0C\u5E94\u4F18\u5148\u9009\u62E9`Hashtable`\u800C\u4E0D\u662F`ConcurrentHashMap`\u3002",
      "`HashMap`\u548C`Hashtable`\u7684\u9ED8\u8BA4\u521D\u59CB\u5BB9\u91CF\u548C\u6269\u5BB9\u673A\u5236\u5B8C\u5168\u76F8\u540C\u3002"
    ],
    answer: [
      "`HashMap`\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\uFF0C\u800C`Hashtable`\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002",
      "`HashMap`\u5141\u8BB8\u4E00\u4E2Anull\u952E\u548C\u591A\u4E2Anull\u503C\uFF0C\u800C`Hashtable`\u4E0D\u5141\u8BB8\u4EFB\u4F55null\u952E\u6216null\u503C\u3002"
    ],
    score: 3.5,
    explanation: "`Hashtable`\u662F\u9057\u7559\u7684\u7EBF\u7A0B\u5B89\u5168\u7C7B\uFF0C\u6027\u80FD\u8F83\u5DEE\uFF0C\u73B0\u4EE3\u5E76\u53D1\u7F16\u7A0B\u63A8\u8350\u4F7F\u7528`ConcurrentHashMap`\u3002`HashMap`\u548C`Hashtable`\u7684\u521D\u59CB\u5BB9\u91CF\u548C\u6269\u5BB9\u7B56\u7565\u4E5F\u4E0D\u540C\u3002\u56E0\u6B64C\u548CD\u662F\u9519\u8BEF\u7684\u3002"
  },
  {
    id: 14,
    type: "single",
    question: "\u5728\u904D\u5386\u4E00\u4E2A`Map`\u96C6\u5408\u65F6\uFF0C\u54EA\u79CD\u904D\u5386\u65B9\u5F0F\u88AB\u8BA4\u4E3A\u662F\u6700\u9AD8\u6548\u7684\uFF0C\u4E3A\u4EC0\u4E48\uFF1F",
    options: [
      "\u904D\u5386`keySet()`\uFF0C\u56E0\u4E3Akey\u662F\u552F\u4E00\u7684\u3002",
      "\u904D\u5386`values()`\uFF0C\u56E0\u4E3A\u76F4\u63A5\u83B7\u53D6\u503C\u6700\u5FEB\u3002",
      "\u904D\u5386`entrySet()`\uFF0C\u56E0\u4E3A\u5B83\u53EF\u4EE5\u4E00\u6B21\u6027\u83B7\u53D6\u5230key\u548Cvalue\u3002",
      "\u4F7F\u7528\u8FED\u4EE3\u5668\u904D\u5386`keySet()`\uFF0C\u56E0\u4E3A\u8FED\u4EE3\u5668\u6700\u6807\u51C6\u3002"
    ],
    answer: "\u904D\u5386`entrySet()`\uFF0C\u56E0\u4E3A\u5B83\u53EF\u4EE5\u4E00\u6B21\u6027\u83B7\u53D6\u5230key\u548Cvalue\u3002",
    score: 3,
    explanation: "\u904D\u5386`keySet()`\u540E\uFF0C\u8FD8\u9700\u8981\u901A\u8FC7`map.get(key)`\u518D\u6B21\u67E5\u627E`value`\uFF0C\u8FD9\u5728`HashMap`\u4E2D\u6D89\u53CA\u5230\u4E00\u6B21\u989D\u5916\u7684\u54C8\u5E0C\u5B9A\u4F4D\u3002\u800C\u904D\u5386`entrySet()`\uFF0C\u6BCF\u4E2A`Map.Entry`\u5BF9\u8C61\u5DF2\u7ECF\u5305\u542B\u4E86`key`\u548C`value`\uFF0C\u65E0\u9700\u4E8C\u6B21\u67E5\u627E\uFF0C\u56E0\u6B64\u6548\u7387\u6700\u9AD8\u3002"
  },
  {
    id: 15,
    type: "code",
    question: "\u8BF7\u8865\u5168\u4EE5\u4E0B\u4EE3\u7801\uFF0C\u4F7F\u7528\u63A8\u8350\u7684\u65B9\u5F0F\uFF08`entrySet`\uFF09\u904D\u5386\u4E00\u4E2A`HashMap`\u5E76\u6253\u5370\u5176\u6240\u6709\u952E\u503C\u5BF9\u3002",
    code_prompt: 'Map<Integer, String> map = new HashMap<>();\nmap.put(1, "Java");\nmap.put(2, "Python");',
    answer: 'Map<Integer, String> map = new HashMap<>();\nmap.put(1, "Java");\nmap.put(2, "Python");\n\nSet<Map.Entry<Integer, String>> entries = map.entrySet();\nfor (Map.Entry<Integer, String> entry : entries) {\n    System.out.println(entry.getKey() + " -> " + entry.getValue());\n}',
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9`Map`\u6700\u9AD8\u6548\u904D\u5386\u65B9\u5F0F`entrySet`\u7684\u5B9E\u9645\u7F16\u7801\u80FD\u529B\uFF0C\u8FD9\u662F\u65E5\u5E38\u5F00\u53D1\u4E2D\u7684\u5E38\u7528\u4EE3\u7801\u7247\u6BB5\u3002"
  },
  {
    id: 16,
    type: "short_answer",
    question: "\u4EC0\u4E48\u662F`ConcurrentModificationException`\uFF1F\u5728\u4EC0\u4E48\u60C5\u51B5\u4E0B\u4F1A\u53D1\u751F\uFF1F",
    answer: "`ConcurrentModificationException`\uFF08\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\uFF09\u662F\u4E00\u4E2A\u8FD0\u884C\u65F6\u5F02\u5E38\u3002\u5B83\u901A\u5E38\u53D1\u751F\u5728\u4F7F\u7528\u8FED\u4EE3\u5668\uFF08\u5305\u62EC\u589E\u5F3Afor\u5FAA\u73AF\uFF09\u904D\u5386\u4E00\u4E2A\u96C6\u5408\u7684\u8FC7\u7A0B\u4E2D\uFF0C\u540C\u65F6\u53C8\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684\u65B9\u6CD5\uFF08\u5982`list.add()`, `map.remove()`\uFF09\u5BF9\u96C6\u5408\u7684\u7ED3\u6784\u8FDB\u884C\u4E86\u4FEE\u6539\uFF08\u6DFB\u52A0\u6216\u5220\u9664\u5143\u7D20\uFF09\u3002",
    score: 3.5,
    explanation: "\u7406\u89E3\u8FD9\u4E2A\u5F02\u5E38\u7684\u89E6\u53D1\u6761\u4EF6\u662F\u907F\u514D\u5728\u96C6\u5408\u904D\u5386\u4E2D\u8E29\u5751\u7684\u5173\u952E\u3002\u6839\u672C\u539F\u56E0\u5728\u4E8E\u8FED\u4EE3\u5668\u7EF4\u62A4\u7684\u72B6\u6001\uFF08\u5982`expectedModCount`\uFF09\u4E0E\u96C6\u5408\u7684\u5B9E\u9645\u72B6\u6001\uFF08`modCount`\uFF09\u4E0D\u4E00\u81F4\u4E86\u3002"
  },
  {
    id: 17,
    type: "code",
    question: '\u4EE5\u4E0B\u4EE3\u7801\u5728\u8FD0\u884C\u65F6\u4F1A\u629B\u51FA\u5F02\u5E38\u3002\u8BF7\u4FEE\u6539\u5B83\uFF0C\u4F7F\u5176\u80FD\u591F\u5728\u904D\u5386`List`\u65F6\u5B89\u5168\u5730\u5220\u9664\u6240\u6709\u5305\u542B"bad"\u7684\u5B57\u7B26\u4E32\u3002',
    code_prompt: 'List<String> list = new ArrayList<>(Arrays.asList("good", "bad", "nice", "bad idea"));\nfor (String s : list) {\n    if (s.contains("bad")) {\n        list.remove(s); \n    }\n}',
    answer: 'List<String> list = new ArrayList<>(Arrays.asList("good", "bad", "nice", "bad idea"));\nIterator<String> iterator = list.iterator();\nwhile (iterator.hasNext()) {\n    String s = iterator.next();\n    if (s.contains("bad")) {\n        iterator.remove(); // \u4F7F\u7528\u8FED\u4EE3\u5668\u7684remove\u65B9\u6CD5\n    }\n}',
    score: 4,
    explanation: "\u6B64\u9898\u662F`ConcurrentModificationException`\u7684\u7ECF\u5178\u573A\u666F\u3002\u6B63\u786E\u505A\u6CD5\u662F\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u8FDB\u884C\u5220\u9664\uFF0C\u56E0\u4E3A\u8BE5\u65B9\u6CD5\u4F1A\u540C\u6B65\u96C6\u5408\u548C\u8FED\u4EE3\u5668\u4E24\u8005\u7684\u5185\u90E8\u72B6\u6001\uFF0C\u4ECE\u800C\u907F\u514D\u5F02\u5E38\u3002"
  },
  {
    id: 18,
    type: "multiple",
    question: "\u5173\u4E8E`Queue`\u63A5\u53E3\u4E2D\u7684`add`\u3001`offer`\u3001`put`\u4E09\u4E2A\u7528\u4E8E\u63D2\u5165\u5143\u7D20\u7684\u65B9\u6CD5\uFF0C\u4EE5\u4E0B\u63CF\u8FF0\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    options: [
      "`add(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u629B\u51FA`IllegalStateException`\u5F02\u5E38\u3002",
      "`offer(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u8FD4\u56DE`false`\uFF0C\u800C\u4E0D\u4F1A\u629B\u51FA\u5F02\u5E38\u3002",
      "`put(e)`\u662F`BlockingQueue`\u7279\u6709\u7684\u65B9\u6CD5\uFF0C\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u963B\u585E\u5F53\u524D\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u6709\u7A7A\u95F4\u3002",
      "\u5728\u4EFB\u4F55\u60C5\u51B5\u4E0B\uFF0C\u8FD9\u4E09\u4E2A\u65B9\u6CD5\u7684\u884C\u4E3A\u90FD\u662F\u5B8C\u5168\u4E00\u6837\u7684\u3002"
    ],
    answer: [
      "`add(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u629B\u51FA`IllegalStateException`\u5F02\u5E38\u3002",
      "`offer(e)`\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u8FD4\u56DE`false`\uFF0C\u800C\u4E0D\u4F1A\u629B\u51FA\u5F02\u5E38\u3002",
      "`put(e)`\u662F`BlockingQueue`\u7279\u6709\u7684\u65B9\u6CD5\uFF0C\u5728\u961F\u5217\u5DF2\u6EE1\u65F6\u4F1A\u963B\u585E\u5F53\u524D\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u6709\u7A7A\u95F4\u3002"
    ],
    score: 4,
    explanation: "Queue\u63A5\u53E3\u4E3A\u589E\u5220\u67E5\u64CD\u4F5C\u63D0\u4F9B\u4E86\u4E09\u5957API\uFF0C\u5206\u522B\u5E94\u5BF9\u4E0D\u540C\u573A\u666F\u3002`add`\u7CFB\u5217\u662F\u201C\u66B4\u529B\u6D3E\u201D\uFF0C\u5931\u8D25\u5C31\u629B\u5F02\u5E38\uFF1B`offer`\u7CFB\u5217\u662F\u201C\u6E29\u67D4\u6D3E\u201D\uFF0C\u5931\u8D25\u8FD4\u56DE\u7279\u6B8A\u503C\uFF1B`put`/`take`\u7CFB\u5217\u662F\u201C\u963B\u585E\u6D3E\u201D\uFF0C\u4E13\u4E3A\u5E76\u53D1\u573A\u666F\u8BBE\u8BA1\u3002\u7406\u89E3\u5B83\u4EEC\u7684\u533A\u522B\u5BF9\u4E8E\u7F16\u5199\u5065\u58EE\u7684\u7A0B\u5E8F\u81F3\u5173\u91CD\u8981\u3002"
  },
  {
    id: 19,
    type: "multiple",
    question: "\u4E0E`Queue`\u7684\u63D2\u5165\u65B9\u6CD5\u7C7B\u4F3C\uFF0C\u5176\u79FB\u9664\u5143\u7D20\u7684`remove()`\u3001`poll()`\u3001`take()`\u65B9\u6CD5\u4E5F\u6709\u4E0D\u540C\u884C\u4E3A\u3002\u4EE5\u4E0B\u63CF\u8FF0\u6B63\u786E\u7684\u6709\u54EA\u4E9B\uFF1F",
    options: [
      "`remove()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u629B\u51FA`NoSuchElementException`\u5F02\u5E38\u3002",
      "`poll()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u8FD4\u56DE`null`\u3002",
      "`take()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u963B\u585E\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u4E2D\u6709\u5143\u7D20\u53EF\u53D6\u3002",
      "\u5BF9\u4E8E\u975E\u963B\u585E\u961F\u5217\uFF0C`remove()`\u548C`poll()`\u662F\u5B8C\u5168\u7B49\u4EF7\u7684\u3002"
    ],
    answer: [
      "`remove()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u629B\u51FA`NoSuchElementException`\u5F02\u5E38\u3002",
      "`poll()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u8FD4\u56DE`null`\u3002",
      "`take()`\u5728\u961F\u5217\u4E3A\u7A7A\u65F6\u4F1A\u963B\u585E\u7EBF\u7A0B\uFF0C\u76F4\u5230\u961F\u5217\u4E2D\u6709\u5143\u7D20\u53EF\u53D6\u3002"
    ],
    score: 4,
    explanation: "\u8FD9\u8003\u5BDF\u4E86`Queue`\u4E09\u5957API\u4E2D\u7528\u4E8E\u79FB\u9664\u5143\u7D20\u7684\u65B9\u6CD5\u3002\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u5C24\u5176\u662F\u5728\u9AD8\u5E76\u53D1\u6216\u9700\u8981\u5904\u7406\u8FB9\u754C\u6761\u4EF6\u7684\u7CFB\u7EDF\u4E2D\uFF0C\u901A\u5E38\u4F1A\u9009\u62E9\u4F7F\u7528`poll()`\u6216`take()`\u6765\u907F\u514D\u7A0B\u5E8F\u56E0\u5F02\u5E38\u800C\u4E2D\u65AD\u3002"
  },
  {
    id: 20,
    type: "single",
    question: "\u5047\u8BBE\u4F60\u6B63\u5728\u5F00\u53D1\u4E00\u4E2A\u751F\u4EA7\u8005-\u6D88\u8D39\u8005\u6A21\u578B\uFF0C\u4F7F\u7528`ArrayBlockingQueue`\u4F5C\u4E3A\u5171\u4EAB\u7F13\u51B2\u533A\u3002\u5F53\u7F13\u51B2\u533A\u5DF2\u6EE1\u65F6\uFF0C\u4F60\u5E0C\u671B\u751F\u4EA7\u8005\u7EBF\u7A0B\u6682\u505C\u7B49\u5F85\uFF0C\u800C\u4E0D\u662F\u629B\u51FA\u5F02\u5E38\u6216\u7ACB\u5373\u8FD4\u56DE\u5931\u8D25\u3002\u4F60\u5E94\u8BE5\u4F7F\u7528\u54EA\u4E2A\u65B9\u6CD5\u6765\u653E\u5165\u5143\u7D20\uFF1F",
    options: ["add(e)", "offer(e)", "put(e)", "push(e)"],
    answer: "put(e)",
    score: 3,
    explanation: "\u6839\u636E\u7B14\u8BB0\u4E2D\u5BF9`ArrayBlockingQueue`\u7684\u63CF\u8FF0\uFF0C`put(e)`\u65B9\u6CD5\u6B63\u662F\u5728\u961F\u5217\u6EE1\u65F6\u63D0\u4F9B\u963B\u585E\u529F\u80FD\u7684API\uFF0C\u8FD9\u5B8C\u5168\u7B26\u5408\u751F\u4EA7\u8005-\u6D88\u8D39\u8005\u6A21\u578B\u4E2D\u751F\u4EA7\u8005\u9700\u8981\u7B49\u5F85\u7684\u573A\u666F\u3002"
  },
  {
    id: 21,
    type: "code",
    question: "\u8BF7\u7F16\u5199\u4E00\u4E2A`Comparator`\uFF0C\u7528\u4E8E\u5BF9\u4E00\u4E2A`List<String>`\u6309\u5B57\u7B26\u4E32\u957F\u5EA6\u8FDB\u884C\u964D\u5E8F\u6392\u5E8F\u3002\u5982\u679C\u957F\u5EA6\u76F8\u540C\uFF0C\u5219\u6309\u5B57\u5178\u5E8F\u5347\u5E8F\u6392\u5E8F\u3002",
    code_prompt: 'List<String> list = new ArrayList<>(Arrays.asList("apple", "banana", "pear", "kiwi"));',
    answer: "list.sort((s1, s2) -> {\n    if (s1.length() != s2.length()) {\n        return s2.length() - s1.length(); // \u957F\u5EA6\u964D\u5E8F\n    } else {\n        return s1.compareTo(s2); // \u5B57\u5178\u5E8F\u5347\u5E8F\n    }\n});",
    score: 4.5,
    explanation: "\u672C\u9898\u8003\u5BDF\u4E86`Comparator`\u63A5\u53E3\u7684\u7075\u6D3B\u8FD0\u7528\uFF0C\u6D89\u53CA\u4E24\u4E2A\u6392\u5E8F\u7EF4\u5EA6\uFF08\u4E3B\u3001\u6B21\u6392\u5E8F\u6761\u4EF6\uFF09\uFF0C\u662F\u5B9E\u9645\u5F00\u53D1\u4E2D\u5E38\u89C1\u7684\u81EA\u5B9A\u4E49\u6392\u5E8F\u573A\u666F\u3002\u4F7F\u7528Lambda\u8868\u8FBE\u5F0F\u662F\u73B0\u4EE3Java\u7684\u63A8\u8350\u5199\u6CD5\u3002"
  },
  {
    id: 22,
    type: "single",
    question: "\u5728\u4F7F\u7528`Arrays.binarySearch()`\u65B9\u6CD5\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u524D\uFF0C\u5BF9\u76EE\u6807\u6570\u7EC4\u6709\u4EC0\u4E48\u6837\u7684\u524D\u7F6E\u8981\u6C42\uFF1F",
    options: [
      "\u6570\u7EC4\u5FC5\u987B\u662F`String`\u7C7B\u578B\u3002",
      "\u6570\u7EC4\u5FC5\u987B\u5DF2\u7ECF\u6392\u597D\u5E8F\u3002",
      "\u6570\u7EC4\u957F\u5EA6\u5FC5\u987B\u662F2\u7684\u5E42\u3002",
      "\u6570\u7EC4\u4E0D\u80FD\u5305\u542B\u91CD\u590D\u5143\u7D20\u3002"
    ],
    answer: "\u6570\u7EC4\u5FC5\u987B\u5DF2\u7ECF\u6392\u597D\u5E8F\u3002",
    score: 2.5,
    explanation: "\u4E8C\u5206\u67E5\u627E\u7B97\u6CD5\u7684\u6709\u6548\u6027\u5EFA\u7ACB\u5728\u6570\u636E\u6709\u5E8F\u7684\u57FA\u7840\u4E0A\u3002\u5982\u679C\u5728\u4E00\u4E2A\u672A\u6392\u5E8F\u7684\u6570\u7EC4\u4E0A\u6267\u884C`binarySearch`\uFF0C\u5176\u7ED3\u679C\u662F\u672A\u5B9A\u4E49\u7684\uFF0C\u53EF\u80FD\u4F1A\u8FD4\u56DE\u9519\u8BEF\u7684\u4F4D\u7F6E\u6216\u627E\u4E0D\u5230\u5B58\u5728\u7684\u5143\u7D20\u3002"
  },
  {
    id: 23,
    type: "single",
    question: "\u8C03\u7528`Map.put(K key, V value)`\u65B9\u6CD5\u65F6\uFF0C\u5982\u679C`key`\u5728Map\u4E2D\u5DF2\u7ECF\u5B58\u5728\uFF0C\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
    options: [
      "\u64CD\u4F5C\u5931\u8D25\uFF0C\u629B\u51FA\u5F02\u5E38\u3002",
      "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8FD4\u56DE`false`\u3002",
      "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u65B0\u7684`value`\u3002",
      "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u88AB\u8986\u76D6\u7684\u65E7`value`\u3002"
    ],
    answer: "\u65E7\u7684`value`\u88AB\u65B0\u7684`value`\u8986\u76D6\uFF0C\u65B9\u6CD5\u8FD4\u56DE\u88AB\u8986\u76D6\u7684\u65E7`value`\u3002",
    score: 2,
    explanation: "\u8FD9\u662F`Map.put`\u65B9\u6CD5\u7684\u4E00\u4E2A\u91CD\u8981\u7279\u6027\u3002\u8FD4\u56DE\u65E7\u503C\u4F7F\u5F97\u8C03\u7528\u8005\u53EF\u4EE5\u77E5\u9053\u4E4B\u524D\u8BE5key\u5173\u8054\u7684\u503C\u662F\u4EC0\u4E48\uFF0C\u65B9\u4FBF\u8FDB\u884C\u4E00\u4E9B\u5982\u201C\u66F4\u65B0\u5E76\u8BB0\u5F55\u65E7\u503C\u201D\u7684\u903B\u8F91\u3002"
  },
  {
    id: 24,
    type: "short_answer",
    question: "\u5728\u4F7F\u7528\u589E\u5F3Afor\u5FAA\u73AF\uFF08for-each loop\uFF09\u904D\u5386\u4E00\u4E2AList\u65F6\uFF0C\u5176\u5E95\u5C42\u5B9E\u9645\u4E0A\u662F\u5982\u4F55\u5DE5\u4F5C\u7684\uFF1F\u4E3A\u4EC0\u4E48\u5B83\u540C\u6837\u4F1A\u53D7\u5230`ConcurrentModificationException`\u7684\u5F71\u54CD\uFF1F",
    answer: "\u589E\u5F3Afor\u5FAA\u73AF\u5728\u5E95\u5C42\u5B9E\u9645\u4E0A\u662F\u4F9D\u8D56`Iterator`\uFF08\u8FED\u4EE3\u5668\uFF09\u5DE5\u4F5C\u7684\u3002\u7F16\u8BD1\u5668\u4F1A\u5C06\u589E\u5F3Afor\u5FAA\u73AF\u4EE3\u7801\u8F6C\u6362\u4E3A\u7B49\u6548\u7684\u4F7F\u7528`iterator()`\u65B9\u6CD5\u83B7\u53D6\u8FED\u4EE3\u5668\uFF0C\u7136\u540E\u5FAA\u73AF\u8C03\u7528`hasNext()`\u548C`next()`\u7684\u4EE3\u7801\u3002\u56E0\u4E3A\u5B83\u672C\u8D28\u4E0A\u5C31\u662F\u5728\u4F7F\u7528\u8FED\u4EE3\u5668\uFF0C\u6240\u4EE5\u5F53\u5728\u5FAA\u73AF\u4F53\u5185\u90E8\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684\u65B9\u6CD5\u4FEE\u6539\u96C6\u5408\u65F6\uFF0C\u540C\u6837\u4F1A\u89E6\u53D1`ConcurrentModificationException`\u3002",
    score: 3,
    explanation: "\u7406\u89E3\u589E\u5F3Afor\u5FAA\u73AF\u7684\u8BED\u6CD5\u7CD6\u672C\u8D28\u6709\u52A9\u4E8E\u66F4\u6DF1\u523B\u5730\u7406\u89E3Java\u7684\u8FED\u4EE3\u673A\u5236\u548C\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u7684\u6839\u6E90\u3002"
  },
  {
    id: 25,
    type: "single",
    question: "\u5982\u679C\u4E00\u4E2A\u81EA\u5B9A\u4E49\u7C7B\u53EA\u91CD\u5199\u4E86`equals()`\u65B9\u6CD5\uFF0C\u800C\u6CA1\u6709\u91CD\u5199`hashCode()`\u65B9\u6CD5\uFF0C\u5E76\u5C06\u5176\u5BF9\u8C61\u4F5C\u4E3A\u5143\u7D20\u6DFB\u52A0\u5230`HashSet`\u4E2D\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u4EC0\u4E48\u95EE\u9898\uFF1F",
    options: [
      "\u7F16\u8BD1\u9519\u8BEF\u3002",
      "\u8FD0\u884C\u65F6\u629B\u51FA`IllegalStateException`\u3002",
      "\u4E24\u4E2A\u5185\u5BB9\u76F8\u7B49\uFF08`equals`\u8FD4\u56DE`true`\uFF09\u7684\u5BF9\u8C61\u53EF\u80FD\u90FD\u4F1A\u88AB\u6210\u529F\u6DFB\u52A0\u5230`HashSet`\u4E2D\u3002",
      "\u6027\u80FD\u4E0B\u964D\uFF0C\u4F46\u529F\u80FD\u5B8C\u5168\u6B63\u5E38\u3002"
    ],
    answer: "\u4E24\u4E2A\u5185\u5BB9\u76F8\u7B49\uFF08`equals`\u8FD4\u56DE`true`\uFF09\u7684\u5BF9\u8C61\u53EF\u80FD\u90FD\u4F1A\u88AB\u6210\u529F\u6DFB\u52A0\u5230`HashSet`\u4E2D\u3002",
    score: 4,
    explanation: "\u5982\u679C\u6CA1\u6709\u91CD\u5199`hashCode()`\uFF0C\u5B83\u5C06\u4F7F\u7528\u4ECE`Object`\u7C7B\u7EE7\u627F\u7684\u9ED8\u8BA4\u5B9E\u73B0\uFF0C\u8BE5\u5B9E\u73B0\u901A\u5E38\u57FA\u4E8E\u5185\u5B58\u5730\u5740\u751F\u6210\u54C8\u5E0C\u7801\u3002\u56E0\u6B64\uFF0C\u4E24\u4E2A\u5185\u5BB9\u76F8\u540C\u4F46\u5185\u5B58\u5730\u5740\u4E0D\u540C\u7684\u5BF9\u8C61\u4F1A\u6709\u4E0D\u540C\u7684\u54C8\u5E0C\u7801\uFF0C`HashSet`\u4F1A\u5C06\u5B83\u4EEC\u5B9A\u4F4D\u5230\u4E0D\u540C\u7684\u6876\u4E2D\uFF0C\u4ECE\u800C\u90FD\u6DFB\u52A0\u6210\u529F\uFF0C\u8FDD\u80CC\u4E86`Set`\u7684\u552F\u4E00\u6027\u539F\u5219\u3002"
  },
  {
    id: 26,
    type: "single",
    question: "\u6839\u636E`Comparator<T>`\u63A5\u53E3\u7684`compare(T o1, T o2)`\u65B9\u6CD5\u7684\u7EA6\u5B9A\uFF0C\u5982\u679C\u8981\u5B9E\u73B0\u5347\u5E8F\u6392\u5E8F\uFF0C\u5F53`o1`\u5E94\u8BE5\u6392\u5728`o2`\u524D\u9762\u65F6\uFF0C\u8BE5\u65B9\u6CD5\u5E94\u8BE5\u8FD4\u56DE\u4EC0\u4E48\uFF1F",
    options: ["\u6B63\u6574\u6570", "\u8D1F\u6574\u6570", "\u96F6", "true"],
    answer: "\u8D1F\u6574\u6570",
    score: 3,
    explanation: "\u8FD9\u662F`Comparator`\u63A5\u53E3\u7684\u6838\u5FC3\u7EA6\u5B9A\uFF1A\u8FD4\u56DE\u8D1F\u6570\u610F\u5473\u7740\u7B2C\u4E00\u4E2A\u53C2\u6570`o1`\u201C\u5C0F\u4E8E\u201D\u7B2C\u4E8C\u4E2A\u53C2\u6570`o2`\uFF0C\u5E94\u8BE5\u6392\u5728\u524D\u9762\uFF1B\u8FD4\u56DE\u6B63\u6570\u76F8\u53CD\uFF1B\u8FD4\u56DE\u96F6\u8868\u793A\u4E24\u8005\u76F8\u7B49\u3002"
  },
  {
    id: 27,
    type: "multiple",
    question: "`LinkedList`\u5B9E\u73B0\u4E86\u54EA\u4E9B\u91CD\u8981\u7684\u63A5\u53E3\uFF08\u6839\u636E\u7B14\u8BB0\u5185\u5BB9\uFF09\uFF1F",
    options: ["List", "Map", "Set", "Deque"],
    answer: ["List", "Deque"],
    score: 2,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA `LinkedList` \u662F `List` \u63A5\u53E3\u7684\u5B9E\u73B0\uFF0C\u540C\u65F6\u5B83\u4E5F\u5B9E\u73B0\u4E86 `Deque` (\u53CC\u7AEF\u961F\u5217) \u63A5\u53E3\uFF0C\u8FD9\u4F7F\u5F97\u5B83\u65E2\u6709\u5217\u8868\u7684\u7279\u6027\uFF0C\u4E5F\u5177\u5907\u961F\u5217\u548C\u6808\u7684\u80FD\u529B\u3002"
  },
  {
    id: 28,
    type: "short_answer",
    question: "\u8BF7\u63CF\u8FF0`ArrayList`\u548C`LinkedList`\u5728\u5185\u5B58\u5F00\u9500\u4E0A\u7684\u4E3B\u8981\u533A\u522B\u3002",
    answer: "`ArrayList`\u7684\u5185\u5B58\u5F00\u9500\u76F8\u5BF9\u8F83\u5C0F\u3002\u5B83\u53EA\u9700\u8981\u5B58\u50A8\u5143\u7D20\u672C\u8EAB\uFF0C\u4EE5\u53CA\u4E00\u4E9B\u989D\u5916\u7684\u5BB9\u91CF\u4FE1\u606F\u3002\u5176\u5185\u5B58\u662F\u8FDE\u7EED\u7684\u3002`LinkedList`\u7684\u5185\u5B58\u5F00\u9500\u8F83\u5927\uFF0C\u56E0\u4E3A\u5B83\u7684\u6BCF\u4E2A\u5143\u7D20\u90FD\u5305\u88C5\u5728\u4E00\u4E2A\u8282\u70B9\uFF08Node\uFF09\u5BF9\u8C61\u4E2D\uFF0C\u8BE5\u8282\u70B9\u9664\u4E86\u5B58\u50A8\u5143\u7D20\u6570\u636E\u5916\uFF0C\u8FD8\u9700\u989D\u5916\u5B58\u50A8\u6307\u5411\u524D\u4E00\u4E2A\u548C\u540E\u4E00\u4E2A\u8282\u70B9\u7684\u5F15\u7528\uFF08\u6307\u9488\uFF09\uFF0C\u8FD9\u589E\u52A0\u4E86\u989D\u5916\u7684\u5185\u5B58\u5360\u7528\u3002",
    score: 3,
    explanation: "\u5728\u5904\u7406\u5927\u91CF\u6570\u636E\u4E14\u5185\u5B58\u654F\u611F\u7684\u573A\u666F\u4E0B\uFF0C\u5185\u5B58\u5F00\u9500\u662F\u9009\u62E9\u96C6\u5408\u5B9E\u73B0\u65F6\u9700\u8981\u8003\u8651\u7684\u4E00\u4E2A\u56E0\u7D20\u3002"
  },
  {
    id: 29,
    type: "single",
    question: "\u6267\u884C`new ArrayList()`\u540E\uFF0C\u6B64\u65F6`ArrayList`\u7684\u5185\u90E8\u6570\u7EC4\u5BB9\u91CF\u662F\u591A\u5C11\uFF1F",
    options: ["10", "16", "0", "1"],
    answer: "0",
    score: 2.5,
    explanation: "\u6839\u636E\u7B14\u8BB0\uFF0CJDK 7\u53CA\u4EE5\u540E\u7684\u7248\u672C\uFF0C`new ArrayList()`\u4F1A\u521B\u5EFA\u4E00\u4E2A\u521D\u59CB\u5BB9\u91CF\u4E3A0\u7684\u7A7A\u5217\u8868\uFF08\u5185\u90E8\u6570\u7EC4\u662F\u4E00\u4E2A\u7A7A\u6570\u7EC4\uFF09\u3002\u5728\u7B2C\u4E00\u6B21\u8C03\u7528`add`\u65B9\u6CD5\u65F6\uFF0C\u624D\u4F1A\u8FDB\u884C\u7B2C\u4E00\u6B21\u6269\u5BB9\uFF0C\u901A\u5E38\u662F\u5206\u914D\u4E00\u4E2A\u5BB9\u91CF\u4E3A10\u7684\u6570\u7EC4\u3002"
  },
  {
    id: 30,
    type: "single",
    question: "`map.values()`\u65B9\u6CD5\u8FD4\u56DE\u7684\u662F\u4EC0\u4E48\u7C7B\u578B\uFF1F",
    options: ["List<V>", "Set<V>", "Collection<V>", "V[]"],
    answer: "Collection<V>",
    score: 2,
    explanation: "`map.values()`\u8FD4\u56DE\u4E00\u4E2A`Collection`\u89C6\u56FE\uFF0C\u56E0\u4E3A\u5B83\u53EA\u4FDD\u8BC1\u5305\u542B\u4E86map\u4E2D\u6240\u6709\u7684\u503C\uFF0C\u4F46\u4E0D\u4FDD\u8BC1\u987A\u5E8F\u6216\u552F\u4E00\u6027\uFF08\u4E0D\u540C\u7684key\u53EF\u4EE5\u6620\u5C04\u5230\u76F8\u540C\u7684value\uFF09\u3002\u56E0\u6B64\uFF0C\u4F7F\u7528\u6700\u6CDB\u5316\u7684`Collection`\u7C7B\u578B\u662F\u5408\u9002\u7684\u3002"
  },
  {
    id: 31,
    type: "short_answer",
    question: "\u4E3A\u4EC0\u4E48\u8BF4\u904D\u5386Map\u7684`entrySet()`\u662F\u6700\u9AD8\u6548\u7684\u65B9\u5F0F\uFF1F\u8BF7\u4ECE`HashMap`\u7684\u5B9E\u73B0\u89D2\u5EA6\u89E3\u91CA\u3002",
    answer: "\u56E0\u4E3A`HashMap`\u7684`entrySet()`\u8FD4\u56DE\u7684`Set`\u4E2D\uFF0C\u6BCF\u4E2A`Entry`\u5BF9\u8C61\u5DF2\u7ECF\u5305\u542B\u4E86\u952E\u548C\u503C\u3002\u904D\u5386\u65F6\uFF0C\u53EF\u4EE5\u76F4\u63A5\u4ECE`Entry`\u5BF9\u8C61\u4E2D\u83B7\u53D6`key`\u548C`value`\u3002\u76F8\u6BD4\u4E4B\u4E0B\uFF0C\u904D\u5386`keySet()`\u65F6\uFF0C\u5728\u5FAA\u73AF\u4F53\u5185\u90E8\u9700\u8981\u901A\u8FC7`map.get(key)`\u6765\u83B7\u53D6`value`\uFF0C\u8FD9\u4E2A`get`\u64CD\u4F5C\u9700\u8981\u6839\u636E`key`\u7684\u54C8\u5E0C\u503C\u518D\u6B21\u8FDB\u884C\u4E00\u6B21\u67E5\u627E\u5B9A\u4F4D\u8FC7\u7A0B\u3002\u56E0\u6B64\uFF0C\u904D\u5386`entrySet()`\u907F\u514D\u4E86\u8FD9\u6B21\u91CD\u590D\u7684\u67E5\u627E\uFF0C\u6548\u7387\u66F4\u9AD8\u3002",
    score: 4,
    explanation: "\u6B64\u9898\u8981\u6C42\u4ECE`HashMap`\u7684\u5B9E\u73B0\u7EC6\u8282\u6765\u89E3\u91CA\u6027\u80FD\u5DEE\u5F02\uFF0C\u8003\u5BDF\u5BF9`HashMap`\u5DE5\u4F5C\u539F\u7406\u7684\u7406\u89E3\u6DF1\u5EA6\u3002"
  },
  {
    id: 32,
    type: "single",
    question: "\u4E00\u4E2A`HashMap`\u5B9E\u4F8B\u4E2D\uFF0C\u53EF\u4EE5\u5B58\u5728\u591A\u5C11\u4E2A`null`\u4F5C\u4E3A`key`\uFF1F",
    options: ["0\u4E2A", "1\u4E2A", "\u65E0\u9650\u4E2A", "\u4E0D\u786E\u5B9A\uFF0C\u53D6\u51B3\u4E8EJDK\u7248\u672C"],
    answer: "1\u4E2A",
    score: 2,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u63D0\u5230\uFF0C`HashMap`\u5141\u8BB8`key`\u548C`value`\u4E3A`null`\u3002\u7531\u4E8E`key`\u5FC5\u987B\u662F\u552F\u4E00\u7684\uFF0C\u6240\u4EE5\u6700\u591A\u53EA\u80FD\u6709\u4E00\u4E2A`key`\u4E3A`null`\u3002\u800C`value`\u53EF\u4EE5\u6709\u591A\u4E2A\u4E3A`null`\u3002"
  },
  {
    id: 33,
    type: "code",
    question: "\u7ED9\u5B9A\u4E00\u4E2A`ArrayList<Integer> list`\uFF0C\u8BF7\u4F7F\u7528`list.sort()`\u65B9\u6CD5\u548CLambda\u8868\u8FBE\u5F0F\u5BF9\u5176\u8FDB\u884C\u964D\u5E8F\u6392\u5E8F\u3002",
    code_prompt: "ArrayList<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9));",
    answer: "list.sort((o1, o2) -> o2 - o1);",
    score: 3,
    explanation: "\u8003\u5BDF\u4F7F\u7528Lambda\u8868\u8FBE\u5F0F\u5FEB\u901F\u5B9E\u73B0`Comparator`\u63A5\u53E3\uFF0C\u8FD9\u662FJava 8\u4EE5\u540E\u63A8\u8350\u7684\u7B80\u6D01\u5199\u6CD5\u3002`o2 - o1`\u662F\u5B9E\u73B0Integer\u964D\u5E8F\u6392\u5E8F\u7684\u7ECF\u5178\u6280\u5DE7\u3002"
  },
  {
    id: 34,
    type: "multiple",
    question: "\u4EE5\u4E0B\u5173\u4E8E`Iterator`\u8FED\u4EE3\u5668\u7684\u8BF4\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "`Iterator`\u662F\u904D\u5386\u96C6\u5408\u7684\u7EDF\u4E00\u6807\u51C6\u63A5\u53E3\u3002",
      "\u8C03\u7528`next()`\u65B9\u6CD5\u4F1A\u8FD4\u56DE\u4E0B\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u4E14\u4F1A\u81EA\u52A8\u5C06\u5185\u90E8\u6307\u9488\u540E\u79FB\u3002",
      "\u5728\u901A\u8FC7\u8FED\u4EE3\u5668\u904D\u5386\u96C6\u5408\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u5B89\u5168\u5730\u5220\u9664\u5143\u7D20\u3002",
      "\u6240\u6709\u7684`Collection`\u5B9E\u73B0\u7C7B\u90FD\u5FC5\u987B\u5B9E\u73B0`Iterator`\u63A5\u53E3\u3002"
    ],
    answer: [
      "`Iterator`\u662F\u904D\u5386\u96C6\u5408\u7684\u7EDF\u4E00\u6807\u51C6\u63A5\u53E3\u3002",
      "\u8C03\u7528`next()`\u65B9\u6CD5\u4F1A\u8FD4\u56DE\u4E0B\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u4E14\u4F1A\u81EA\u52A8\u5C06\u5185\u90E8\u6307\u9488\u540E\u79FB\u3002",
      "\u5728\u901A\u8FC7\u8FED\u4EE3\u5668\u904D\u5386\u96C6\u5408\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u5B89\u5168\u5730\u5220\u9664\u5143\u7D20\u3002"
    ],
    score: 3.5,
    explanation: "\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002`Collection`\u7684\u5B9E\u73B0\u7C7B\u5E76\u672A\u76F4\u63A5\u5B9E\u73B0`Iterator`\u63A5\u53E3\uFF0C\u800C\u662F\u63D0\u4F9B\u4E86\u4E00\u4E2A`iterator()`\u65B9\u6CD5\u6765\u8FD4\u56DE\u4E00\u4E2A`Iterator`\u7684\u5B9E\u4F8B\u3002\u5176\u4ED6\u4E09\u9879\u90FD\u662F\u5BF9`Iterator`\u6838\u5FC3\u529F\u80FD\u548C\u7528\u6CD5\u7684\u6B63\u786E\u63CF\u8FF0\u3002"
  },
  {
    id: 35,
    type: "single",
    question: "\u5982\u679C`HashMap`\u7684key\u662F\u4E00\u4E2A\u81EA\u5B9A\u4E49\u5BF9\u8C61\uFF0C\u90A3\u4E48\u8FD9\u4E2A\u5BF9\u8C61\u5FC5\u987B\u6EE1\u8DB3\u4EC0\u4E48\u6761\u4EF6\u624D\u80FD\u4FDD\u8BC1`HashMap`\u7684\u6B63\u5E38\u5DE5\u4F5C\uFF1F",
    options: [
      "\u5FC5\u987B\u5B9E\u73B0`Comparable`\u63A5\u53E3\u3002",
      "\u5FC5\u987B\u662F\u4E0D\u53EF\u53D8\u5BF9\u8C61\uFF08Immutable\uFF09\u3002",
      "\u5FC5\u987B\u6B63\u786E\u5730\u91CD\u5199`hashCode()`\u548C`equals()`\u65B9\u6CD5\u3002",
      "\u5FC5\u987B\u6709\u4E00\u4E2A\u65E0\u53C2\u6784\u9020\u51FD\u6570\u3002"
    ],
    answer: "\u5FC5\u987B\u6B63\u786E\u5730\u91CD\u5199`hashCode()`\u548C`equals()`\u65B9\u6CD5\u3002",
    score: 3,
    explanation: "\u4E0E`HashSet`\u4E00\u6837\uFF0C`HashMap`\u901A\u8FC7key\u7684`hashCode()`\u548C`equals()`\u6765\u5B9A\u4F4D\u548C\u533A\u5206\u4E0D\u540C\u7684\u6761\u76EE\u3002\u4E3A\u4E86\u786E\u4FDD\u80FD\u591F\u6B63\u786E\u5730\u5B58\u53D6\u952E\u503C\u5BF9\uFF0C\u8FD9\u4E24\u4E2A\u65B9\u6CD5\u5FC5\u987B\u88AB\u6B63\u786E\u91CD\u5199\u3002\u867D\u7136\u5C06\u4E0D\u53EF\u53D8\u5BF9\u8C61\u7528\u4F5Ckey\u662F\u6700\u4F73\u5B9E\u8DF5\uFF0C\u4F46\u4E0D\u662F\u5F3A\u5236\u8981\u6C42\u3002"
  },
  {
    id: 36,
    type: "single",
    question: "\u5728Java\u4E2D\uFF0C\u5982\u679C\u4E00\u4E2A\u65B9\u6CD5\u9700\u8981\u63A5\u6536\u4E00\u4E2A`List`\uFF0C\u8FD9\u4E2A`List`\u4E2D\u53EF\u4EE5\u5B58\u653E`Integer`\u6216\u4EFB\u4F55`Integer`\u7684\u7236\u7C7B\u578B\uFF08\u5982`Number`, `Object`\uFF09\uFF0C\u90A3\u4E48\u8BE5\u65B9\u6CD5\u7684\u53C2\u6570\u7C7B\u578B\u5E94\u8BE5\u5982\u4F55\u58F0\u660E\uFF1F",
    options: [
      "`List<Number> list`",
      "`List<? extends Number> list`",
      "`List<? super Integer> list`",
      "`List<Object> list`"
    ],
    answer: "`List<? super Integer> list`",
    score: 4.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u5173\u4E8E\u6CDB\u578B\u901A\u914D\u7B26\u7684\u8FDB\u9636\u95EE\u9898\uFF0C\u867D\u7136\u7B14\u8BB0\u4E2D\u6CA1\u6709\u76F4\u63A5\u8BB2\u6388\u901A\u914D\u7B26\uFF0C\u4F46\u662F\u57FA\u4E8E\u201C\u6CDB\u578B\u4E0D\u5177\u6709\u591A\u6001\u6027\u201D\u7684\u6982\u5FF5\u5EF6\u4F38\u800C\u6765\u3002`? super Integer`\u8868\u793A\u4E00\u4E2A\u672A\u77E5\u7C7B\u578B\uFF0C\u8FD9\u4E2A\u7C7B\u578B\u662F`Integer`\u672C\u8EAB\u6216\u8005\u5176\u4EFB\u4F55\u7236\u7C7B\u578B\uFF0C\u7B26\u5408\u9898\u610F\u3002\u8FD9\u8003\u5BDF\u4E86\u5BF9\u6CDB\u578B\u66F4\u6DF1\u5C42\u6B21\u7684\u7406\u89E3\uFF08PECS\u539F\u5219\uFF1AProducer-Extends, Consumer-Super\uFF09\u3002"
  },
  {
    id: 37,
    type: "short_answer",
    question: "\u8BF7\u89E3\u91CA`ArrayList`\u7684`remove(int index)`\u548C`remove(Object o)`\u4E24\u4E2A\u91CD\u8F7D\u65B9\u6CD5\u4E4B\u95F4\u7684\u533A\u522B\u548C\u6F5C\u5728\u7684\u9677\u9631\u3002",
    answer: "`remove(int index)`\u662F\u6309\u7D22\u5F15\u5220\u9664\uFF0C\u5B83\u4F1A\u5220\u9664\u6307\u5B9A\u4F4D\u7F6E\u7684\u5143\u7D20\u5E76\u8FD4\u56DE\u88AB\u5220\u9664\u7684\u5143\u7D20\u3002`remove(Object o)`\u662F\u6309\u5185\u5BB9\u5220\u9664\uFF0C\u5B83\u4F1A\u5220\u9664\u96C6\u5408\u4E2D\u4E0E\u5BF9\u8C61`o`\u76F8\u7B49\u7684\u7B2C\u4E00\u4E2A\u5143\u7D20\uFF0C\u5E76\u8FD4\u56DE\u4E00\u4E2A\u5E03\u5C14\u503C\uFF08`true`\u8868\u793A\u5220\u9664\u6210\u529F\uFF09\u3002\u6F5C\u5728\u7684\u9677\u9631\u662F\u5F53`ArrayList`\u4E2D\u5B58\u50A8\u7684\u662F`Integer`\u7C7B\u578B\u65F6\uFF0C\u5982\u679C\u8C03\u7528`list.remove(10)`\uFF0C\u7F16\u8BD1\u5668\u4F1A\u4F18\u5148\u5339\u914D`remove(int index)`\uFF0C\u610F\u56FE\u662F\u5220\u9664\u7D22\u5F15\u4E3A10\u7684\u5143\u7D20\uFF0C\u800C\u4E0D\u662F\u5185\u5BB9\u4E3A10\u7684\u5143\u7D20\u3002\u5982\u679C\u60F3\u6309\u5185\u5BB9\u5220\u9664\uFF0C\u5FC5\u987B\u4F20\u9012\u4E00\u4E2A`Integer`\u5BF9\u8C61\uFF0C\u5982`list.remove(Integer.valueOf(10))`\u3002",
    score: 4,
    explanation: "\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u4E86\u5BF9`ArrayList` API\u7EC6\u8282\u7684\u638C\u63E1\uFF0C\u7279\u522B\u662F\u5728\u5904\u7406`Integer`\u96C6\u5408\u65F6\u7531\u4E8E\u81EA\u52A8\u88C5\u7BB1/\u62C6\u7BB1\u53EF\u80FD\u5F15\u53D1\u7684\u6B67\u4E49\u548C\u9519\u8BEF\uFF0C\u975E\u5E38\u5177\u6709\u5B9E\u8DF5\u6027\u3002"
  },
  {
    id: 38,
    type: "single",
    question: "`Queue`\u63A5\u53E3\u9075\u5FAA\u7684\u57FA\u672C\u539F\u5219\u662F\u4EC0\u4E48\uFF1F",
    options: ["\u540E\u8FDB\u5148\u51FA (LIFO)", "\u5148\u8FDB\u5148\u51FA (FIFO)", "\u65E0\u5E8F", "\u6309\u4F18\u5148\u7EA7"],
    answer: "\u5148\u8FDB\u5148\u51FA (FIFO)",
    score: 1.5,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u5B9A\u4E49\uFF0CQueue (\u961F\u5217) \u662F\u4E00\u79CD\u9075\u5FAA\u5148\u8FDB\u5148\u51FA (FIFO, First-In-First-Out) \u539F\u5219\u7684\u7279\u6B8A\u7EBF\u6027\u8868\u3002"
  },
  {
    id: 39,
    type: "single",
    question: "\u4EE5\u4E0B\u54EA\u4E2A\u64CD\u4F5C\u5728`LinkedList`\u4E0A\u7684\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\uFF1F",
    options: [
      "`addFirst(e)`",
      "`removeLast()`",
      "`get(int index)`",
      "`add(e)` (\u5373 addLast)"
    ],
    answer: "`get(int index)`",
    score: 2.5,
    explanation: "`LinkedList`\u7531\u4E8E\u662F\u94FE\u8868\u7ED3\u6784\uFF0C\u65E0\u6CD5\u76F4\u63A5\u901A\u8FC7\u8BA1\u7B97\u5185\u5B58\u5730\u5740\u504F\u79FB\u6765\u8BBF\u95EE\u5143\u7D20\uFF0C\u968F\u673A\u8BBF\u95EE`get(index)`\u9700\u8981\u4ECE\u5934\u6216\u5C3E\u5F00\u59CB\u904D\u5386\uFF0C\u76F4\u5230\u627E\u5230\u7B2Cindex\u4E2A\u8282\u70B9\uFF0C\u6240\u4EE5\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\u3002\u800C\u5934\u5C3E\u64CD\u4F5C\u90FD\u662FO(1)\u3002"
  },
  {
    id: 40,
    type: "short_answer",
    question: "`Iterator`\u7684`remove()`\u65B9\u6CD5\u4E3A\u4EC0\u4E48\u662F\u5B89\u5168\u7684\uFF0C\u800C\u96C6\u5408\u7684`remove()`\u65B9\u6CD5\u5728\u8FED\u4EE3\u65F6\u4F1A\u4E0D\u5B89\u5168\uFF1F\u8BF7\u4ECE`modCount`\u7684\u89D2\u5EA6\u89E3\u91CA\u3002",
    answer: "\u96C6\u5408\u5185\u90E8\u6709\u4E00\u4E2A`modCount`\u53D8\u91CF\uFF0C\u8BB0\u5F55\u96C6\u5408\u7ED3\u6784\u88AB\u4FEE\u6539\u7684\u6B21\u6570\u3002\u5F53\u521B\u5EFA\u8FED\u4EE3\u5668\u65F6\uFF0C\u8FED\u4EE3\u5668\u4F1A\u4FDD\u5B58\u4E00\u4EFD\u5F53\u524D\u96C6\u5408\u7684`modCount`\u503C\uFF08\u79F0\u4E3A`expectedModCount`\uFF09\u3002\u5728\u8FED\u4EE3\u8FC7\u7A0B\u4E2D\uFF0C\u5982\u679C\u901A\u8FC7\u96C6\u5408\u81EA\u8EAB\u7684`remove()`\u65B9\u6CD5\u4FEE\u6539\u4E86\u96C6\u5408\uFF0C\u53EA\u4F1A\u589E\u52A0\u96C6\u5408\u7684`modCount`\uFF0C\u800C\u8FED\u4EE3\u5668\u7684`expectedModCount`\u6CA1\u6709\u53D8\u3002\u4E0B\u4E00\u6B21\u8FED\u4EE3\u5668\u64CD\u4F5C\uFF08\u5982`next()`\uFF09\u4F1A\u68C0\u67E5\u5230`modCount != expectedModCount`\uFF0C\u4E8E\u662F\u629B\u51FA`ConcurrentModificationException`\u3002\n\u800C`Iterator.remove()`\u65B9\u6CD5\u662F\u5B89\u5168\u7684\uFF0C\u56E0\u4E3A\u5B83\u5728\u5185\u90E8\u5220\u9664\u5143\u7D20\u7684\u540C\u65F6\uFF0C\u4F1A\u4E3B\u52A8\u66F4\u65B0\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`expectedModCount`\u4F7F\u5176\u4E0E\u96C6\u5408\u7684`modCount`\u4FDD\u6301\u540C\u6B65\uFF0C\u6240\u4EE5\u4E0D\u4F1A\u89E6\u53D1\u5F02\u5E38\u3002",
    score: 4.5,
    explanation: "\u8FD9\u662F\u5BF9\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u5E95\u5C42\u673A\u5236\u7684\u6DF1\u5EA6\u8003\u5BDF\uFF0C\u80FD\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\u8BF4\u660E\u5BF9`Iterator`\u7684\u5DE5\u4F5C\u539F\u7406\u6709\u975E\u5E38\u6E05\u6670\u7684\u8BA4\u8BC6\u3002"
  },
  {
    id: 41,
    type: "multiple",
    question: "`java.util.Arrays`\u5DE5\u5177\u7C7B\u63D0\u4F9B\u4E86\u54EA\u4E9B\u5E38\u7528\u529F\u80FD\uFF1F",
    options: [
      "`toString(array)`: \u5C06\u6570\u7EC4\u8F6C\u6362\u4E3A\u5B57\u7B26\u4E32\u3002",
      "`sort(array)`: \u5BF9\u6570\u7EC4\u8FDB\u884C\u6392\u5E8F\u3002",
      "`binarySearch(array, key)`: \u5728\u6709\u5E8F\u6570\u7EC4\u4E2D\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u3002",
      "`toList(array)`: \u76F4\u63A5\u5C06\u4EFB\u4F55\u6570\u7EC4\u9AD8\u6548\u8F6C\u6362\u4E3A`ArrayList`\u3002"
    ],
    answer: [
      "`toString(array)`: \u5C06\u6570\u7EC4\u8F6C\u6362\u4E3A\u5B57\u7B26\u4E32\u3002",
      "`sort(array)`: \u5BF9\u6570\u7EC4\u8FDB\u884C\u6392\u5E8F\u3002",
      "`binarySearch(array, key)`: \u5728\u6709\u5E8F\u6570\u7EC4\u4E2D\u8FDB\u884C\u4E8C\u5206\u67E5\u627E\u3002"
    ],
    score: 3,
    explanation: "`Arrays`\u7C7B\u6CA1\u6709`toList()`\u65B9\u6CD5\u3002\u5C06\u6570\u7EC4\u8F6C\u4E3AList\u901A\u5E38\u4F7F\u7528`Arrays.asList()`\uFF0C\u4F46\u5B83\u8FD4\u56DE\u7684\u662F\u4E00\u4E2A\u5185\u90E8\u7C7B\u7684`List`\uFF0C\u8BE5`List`\u957F\u5EA6\u56FA\u5B9A\uFF0C\u4E0D\u652F\u6301`add`\u6216`remove`\u64CD\u4F5C\u3002\u6240\u4EE5\u9009\u9879D\u63CF\u8FF0\u4E0D\u51C6\u786E\u3002"
  },
  {
    id: 42,
    type: "single",
    question: "\u5BF9\u4E8E\u4E00\u4E2A\u5DF2\u7ECF\u5B58\u50A8\u4E861000\u4E2A\u5143\u7D20\u7684`ArrayList`\uFF0C\u5728\u5217\u8868\u7684\u8D77\u59CB\u4F4D\u7F6E\uFF08\u7D22\u5F150\uFF09\u63D2\u5165\u4E00\u4E2A\u65B0\u5143\u7D20\uFF0C\u5927\u7EA6\u9700\u8981\u6267\u884C\u591A\u5C11\u6B21\u5143\u7D20\u79FB\u52A8\u64CD\u4F5C\uFF1F",
    options: ["1\u6B21", "2\u6B21", "1000\u6B21", "\u4E0D\u9700\u8981\u79FB\u52A8"],
    answer: "1000\u6B21",
    score: 3,
    explanation: "\u5728`ArrayList`\u7684\u8D77\u59CB\u4F4D\u7F6E\u63D2\u5165\u5143\u7D20\uFF0C\u4E3A\u4E86\u7ED9\u65B0\u5143\u7D20\u817E\u51FA\u7A7A\u95F4\uFF0C\u539F\u6709\u7684\u6240\u67091000\u4E2A\u5143\u7D20\u90FD\u9700\u8981\u5411\u540E\u79FB\u52A8\u4E00\u4F4D\u3002\u8FD9\u662F\u4E00\u4E2A\u5178\u578B\u7684O(n)\u64CD\u4F5C\uFF0Cn\u662F\u96C6\u5408\u7684\u5927\u5C0F\u3002"
  },
  {
    id: 43,
    type: "single",
    question: "\u4EE5\u4E0B\u54EA\u79CD\u96C6\u5408\u5B9E\u73B0\u7C7B\u5728\u8FED\u4EE3\u65F6\u80FD\u4FDD\u8BC1\u5143\u7D20\u7684\u987A\u5E8F\u4E0E\u5176\u63D2\u5165\u65F6\u7684\u987A\u5E8F\u4E00\u81F4\uFF1F",
    options: ["HashSet", "HashMap", "ArrayList", "TreeSet"],
    answer: "ArrayList",
    score: 2,
    explanation: "`ArrayList`\u548C`LinkedList`\u90FD\u5C5E\u4E8E`List`\uFF0C\u4FDD\u8BC1\u4E86\u5143\u7D20\u7684\u63D2\u5165\u987A\u5E8F\u3002`HashSet`\u548C`HashMap`\u662F\u65E0\u5E8F\u7684\u3002`TreeSet`\u548C`TreeMap`\u4F1A\u6839\u636E\u5143\u7D20\u7684\u81EA\u7136\u987A\u5E8F\u6216\u6307\u5B9A\u7684`Comparator`\u8FDB\u884C\u6392\u5E8F\uFF0C\u800C\u4E0D\u662F\u63D2\u5165\u987A\u5E8F\u3002\uFF08\u6CE8\uFF1A`LinkedHashSet`\u548C`LinkedHashMap`\u53EF\u4EE5\u4FDD\u8BC1\u63D2\u5165\u987A\u5E8F\uFF0C\u4F46\u7B14\u8BB0\u672A\u63D0\u53CA\uFF09"
  },
  {
    id: 44,
    type: "code",
    question: "\u5982\u679C\u6709\u4E00\u4E2A`User`\u7C7B\uFF0C\u5305\u542B`id`\u548C`name`\u5C5E\u6027\u3002\u8BF7\u91CD\u5199\u5176`equals()`\u65B9\u6CD5\uFF0C\u4F7F\u5F97\u53EA\u6709\u5F53`id`\u548C`name`\u90FD\u76F8\u540C\u65F6\uFF0C\u4E24\u4E2A`User`\u5BF9\u8C61\u624D\u88AB\u8BA4\u4E3A\u662F\u76F8\u7B49\u7684\u3002",
    code_prompt: "class User {\n    private int id;\n    private String name;\n\n    // constructor, getters, setters...\n\n    @Override\n    public boolean equals(Object obj) {\n        // Your code here\n    }\n}",
    answer: "@Override\npublic boolean equals(Object obj) {\n    if (this == obj) return true;\n    if (obj == null || getClass() != obj.getClass()) return false;\n    User otherUser = (User) obj;\n    return this.id == otherUser.id && java.util.Objects.equals(this.name, otherUser.name);\n}",
    score: 3.5,
    explanation: "\u8003\u5BDF`equals`\u65B9\u6CD5\u7684\u6807\u51C6\u5199\u6CD5\uFF0C\u5305\u62EC\u5730\u5740\u6BD4\u8F83\u3001null\u68C0\u67E5\u548C\u7C7B\u578B\u68C0\u67E5\u7B49\u524D\u7F6E\u5224\u65AD\u3002\u4F7F\u7528`Objects.equals()`\u6765\u5904\u7406`name`\u53EF\u80FD\u4E3Anull\u7684\u60C5\u51B5\uFF0C\u662F\u66F4\u5065\u58EE\u7684\u5199\u6CD5\u3002"
  },
  {
    id: 45,
    type: "short_answer",
    question: "\u6CDB\u578B\u4E2D\u7684\u201C\u7C7B\u578B\u64E6\u9664\u201D\uFF08Type Erasure\uFF09\u662F\u4EC0\u4E48\u610F\u601D\uFF1F\u5B83\u5BF9Java\u7684\u6CDB\u578B\u5B9E\u73B0\u610F\u5473\u7740\u4EC0\u4E48\uFF1F",
    answer: "\u7C7B\u578B\u64E6\u9664\u662F\u6307Java\u6CDB\u578B\u4FE1\u606F\u53EA\u5B58\u5728\u4E8E\u4EE3\u7801\u7684\u7F16\u8BD1\u9636\u6BB5\uFF0C\u5728\u751F\u6210\u7684\u5B57\u8282\u7801\u4E2D\uFF0C\u6240\u6709\u7684\u6CDB\u578B\u7C7B\u578B\u53C2\u6570\u90FD\u4F1A\u88AB\u66FF\u6362\u4E3A\u5B83\u4EEC\u7684\u4E0A\u754C\uFF08\u5982`T`\u88AB\u66FF\u6362\u4E3A`Object`\uFF0C`T extends Number`\u88AB\u66FF\u6362\u4E3A`Number`\uFF09\uFF0C\u5E76\u63D2\u5165\u5FC5\u8981\u7684\u7C7B\u578B\u8F6C\u6362\u4EE3\u7801\u3002\u8FD9\u610F\u5473\u7740\uFF0C\u5BF9\u4E8EJVM\u6765\u8BF4\uFF0C`ArrayList<String>`\u548C`ArrayList<Integer>`\u5728\u8FD0\u884C\u65F6\u662F\u540C\u4E00\u4E2A\u7C7B\uFF08`ArrayList.class`\uFF09\uFF0C\u5B83\u5E76\u4E0D\u77E5\u9053\u96C6\u5408\u4E2D\u5143\u7D20\u7684\u786E\u5207\u6CDB\u578B\u7C7B\u578B\u3002",
    score: 4,
    explanation: "\u867D\u7136\u7B14\u8BB0\u4E2D\u53EA\u63D0\u5230\u4E86\u6CDB\u578B\u662F\u7F16\u8BD1\u671F\u673A\u5236\uFF0C\u4F46\u7406\u89E3\u7C7B\u578B\u64E6\u9664\u662F\u6DF1\u5165\u7406\u89E3\u6CDB\u578B\u672C\u8D28\u7684\u5173\u952E\u3002\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u4E86\u5BF9\u8FD9\u4E00\u6838\u5FC3\u6982\u5FF5\u7684\u8BA4\u77E5\u3002"
  },
  {
    id: 46,
    type: "single",
    question: "\u5F53\u4E0D\u518D\u63A8\u8350\u4F7F\u7528`Hashtable`\u65F6\uFF0C\u5982\u679C\u9700\u8981\u4E00\u4E2A\u7EBF\u7A0B\u5B89\u5168\u7684`Map`\u5B9E\u73B0\uFF0C\u5E94\u8BE5\u4F18\u5148\u9009\u62E9\u54EA\u4E2A\u7C7B\uFF1F",
    options: ["Collections.synchronizedMap(new HashMap())", "ConcurrentHashMap", "TreeMap", "\u81EA\u5DF1\u7528`synchronized`\u5173\u952E\u5B57\u5305\u88C5HashMap\u7684\u6240\u6709\u65B9\u6CD5"],
    answer: "ConcurrentHashMap",
    score: 3,
    explanation: "\u7B14\u8BB0\u4E2D\u63D0\u5230\uFF0C`ConcurrentHashMap`\u63D0\u4F9B\u4E86\u6BD4`Hashtable`\u66F4\u597D\u7684\u5E76\u53D1\u6027\u80FD\u3002`ConcurrentHashMap`\u4F7F\u7528\u4E86\u66F4\u5148\u8FDB\u7684\u9501\u673A\u5236\uFF08\u5982\u5206\u6BB5\u9501\u6216CAS\uFF09\uFF0C\u5728\u9AD8\u5E76\u53D1\u573A\u666F\u4E0B\uFF0C\u5176\u541E\u5410\u91CF\u8FDC\u8D85\u4E8E\u5BF9\u6574\u4E2A`Map`\u8FDB\u884C\u540C\u6B65\u7684`Hashtable`\u6216`Collections.synchronizedMap`\u3002"
  },
  {
    id: 47,
    type: "multiple",
    question: "\u4EE5\u4E0B\u5173\u4E8E`HashSet`\u7684\u8BF4\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5B83\u4E0D\u5141\u8BB8\u5B58\u50A8\u91CD\u590D\u7684\u5143\u7D20\u3002",
      "\u5B83\u901A\u5E38\u4E0D\u4FDD\u8BC1\u5143\u7D20\u7684\u5B58\u50A8\u548C\u53D6\u51FA\u987A\u5E8F\u3002",
      "\u5B83\u5141\u8BB8\u5B58\u50A8\u4E00\u4E2A`null`\u5143\u7D20\u3002",
      "\u5B83\u7684\u6240\u6709\u64CD\u4F5C\u90FD\u662F\u7EBF\u7A0B\u5B89\u5168\u7684\u3002"
    ],
    answer: [
      "\u5B83\u4E0D\u5141\u8BB8\u5B58\u50A8\u91CD\u590D\u7684\u5143\u7D20\u3002",
      "\u5B83\u901A\u5E38\u4E0D\u4FDD\u8BC1\u5143\u7D20\u7684\u5B58\u50A8\u548C\u53D6\u51FA\u987A\u5E8F\u3002",
      "\u5B83\u5141\u8BB8\u5B58\u50A8\u4E00\u4E2A`null`\u5143\u7D20\u3002"
    ],
    score: 3,
    explanation: "`HashSet`\u7684\u6838\u5FC3\u7279\u6027\u5C31\u662F\u65E0\u5E8F\u3001\u552F\u4E00\uFF0C\u5E76\u5141\u8BB8\u4E00\u4E2Anull\u3002\u4E0E`HashMap`\u4E00\u6837\uFF0C\u5B83\u672C\u8EAB\u662F\u975E\u7EBF\u7A0B\u5B89\u5168\u7684\u3002\u9700\u8981\u7EBF\u7A0B\u5B89\u5168\u7684Set\u53EF\u4EE5\u4F7F\u7528`Collections.synchronizedSet()`\u6216`ConcurrentHashMap.newKeySet()`\u3002"
  },
  {
    id: 48,
    type: "single",
    question: "\u5982\u679C\u4E00\u4E2A`ArrayList`\u7684`remove(Object o)`\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u5B83\u4F1A\u5982\u4F55\u67E5\u627E\u8981\u5220\u9664\u7684\u5143\u7D20\uFF1F",
    options: [
      "\u4F7F\u7528\u4E8C\u5206\u67E5\u627E\u3002",
      "\u901A\u8FC7\u54C8\u5E0C\u5B9A\u4F4D\u3002",
      "\u4ECE\u5934\u5230\u5C3E\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u6BD4\u8F83\u3002",
      "\u4ECE\u5C3E\u5230\u5934\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`==`\u8FDB\u884C\u6BD4\u8F83\u3002"
    ],
    answer: "\u4ECE\u5934\u5230\u5C3E\u4F9D\u6B21\u904D\u5386\uFF0C\u4F7F\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u6BD4\u8F83\u3002",
    score: 2.5,
    explanation: "`ArrayList`\u7684`remove(Object o)`\u5B9E\u73B0\u662F\u7EBF\u6027\u641C\u7D22\uFF0C\u5B83\u4F1A\u4ECE\u5217\u8868\u7684\u7B2C\u4E00\u4E2A\u5143\u7D20\u5F00\u59CB\uFF0C\u9010\u4E2A\u8C03\u7528`equals()`\u65B9\u6CD5\u8FDB\u884C\u5339\u914D\uFF0C\u76F4\u5230\u627E\u5230\u7B2C\u4E00\u4E2A\u5339\u914D\u7684\u5143\u7D20\u5E76\u5220\u9664\u5B83\u3002\u56E0\u6B64\u5176\u65F6\u95F4\u590D\u6742\u5EA6\u662FO(n)\u3002"
  },
  {
    id: 49,
    type: "short_answer",
    question: "\u5728Java\u4E2D\uFF0C\u4E3A\u4F55\u63A8\u8350\u4F7F\u7528\u63A5\u53E3\uFF08\u5982`List`\u3001`Map`\uFF09\u4F5C\u4E3A\u53D8\u91CF\u58F0\u660E\u7C7B\u578B\u6216\u65B9\u6CD5\u53C2\u6570\u7C7B\u578B\uFF0C\u800C\u4E0D\u662F\u5177\u4F53\u7684\u5B9E\u73B0\u7C7B\uFF08\u5982 `ArrayList`\u3001`HashMap`\uFF09\uFF1F",
    answer: "\u8FD9\u662F\u9762\u5411\u63A5\u53E3\u7F16\u7A0B\u7684\u4E00\u79CD\u4F53\u73B0\uFF0C\u4E3B\u8981\u6709\u4EE5\u4E0B\u597D\u5904\uFF1A\n1. **\u89E3\u8026\u548C\u7075\u6D3B\u6027**\uFF1A\u4EE3\u7801\u4E0D\u4F9D\u8D56\u4E8E\u5177\u4F53\u7684\u5B9E\u73B0\u7EC6\u8282\u3002\u672A\u6765\u5982\u679C\u53D1\u73B0`ArrayList`\u6027\u80FD\u4E0D\u4F73\uFF0C\u53EF\u4EE5\u5F88\u65B9\u4FBF\u5730\u5C06\u5176\u66FF\u6362\u4E3A`LinkedList`\u6216\u5176\u4ED6`List`\u5B9E\u73B0\uFF0C\u800C\u4E0D\u9700\u8981\u4FEE\u6539\u5927\u91CF\u4F7F\u7528\u8BE5`List`\u7684\u4EE3\u7801\u3002\n2. **\u53EF\u6269\u5C55\u6027**\uFF1A\u4F7F\u4EE3\u7801\u66F4\u52A0\u901A\u7528\uFF0C\u53EF\u4EE5\u63A5\u53D7\u4EFB\u4F55\u7B26\u5408\u8BE5\u63A5\u53E3\u89C4\u8303\u7684\u5B9E\u73B0\u7C7B\u7684\u5BF9\u8C61\u3002\n3. **\u7B26\u5408\u8BBE\u8BA1\u539F\u5219**\uFF1A\u7B26\u5408\u201C\u4F9D\u8D56\u5012\u7F6E\u539F\u5219\u201D\uFF0C\u5373\u5E94\u8BE5\u4F9D\u8D56\u4E8E\u62BD\u8C61\uFF0C\u800C\u4E0D\u662F\u4F9D\u8D56\u4E8E\u5177\u4F53\u3002",
    score: 3.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u91CD\u8981\u7684\u7F16\u7A0B\u5B9E\u8DF5\u95EE\u9898\uFF0C\u8003\u5BDF\u4E86\u5BF9\u9762\u5411\u5BF9\u8C61\u8BBE\u8BA1\u539F\u5219\u7684\u7406\u89E3\u3002\u4F8B\u5982\uFF0C\u58F0\u660E `List<String> users = new ArrayList<>();` \u597D\u4E8E `ArrayList<String> users = new ArrayList<>();`\u3002"
  },
  {
    id: 50,
    type: "code",
    question: '\u5047\u8BBE\u6709\u4E00\u4E2A`Map<String, Integer> map`\uFF0C\u5176\u4E2D\u4E00\u4E2A\u952E\u4E3A"b"\u3002\u4EE5\u4E0B\u8FD9\u6BB5\u5220\u9664\u64CD\u4F5C\u7684\u4EE3\u7801\u6709\u4EC0\u4E48\u95EE\u9898\uFF1F\u5E94\u8BE5\u5982\u4F55\u4FEE\u6B63\uFF1F',
    code_prompt: 'for (String key : map.keySet()) {\n    if ("b".equals(key)) {\n        map.remove("b");\n    }\n}',
    answer: '\u95EE\u9898\uFF1A\u8FD9\u6BB5\u4EE3\u7801\u4F1A\u5728\u8FD0\u884C\u65F6\u629B\u51FA`ConcurrentModificationException`\uFF0C\u56E0\u4E3A\u5728\u901A\u8FC7`keySet`\u7684\u8FED\u4EE3\u5668\u8FDB\u884C\u904D\u5386\u65F6\uFF0C\u4F7F\u7528\u4E86`map`\u81EA\u8EAB\u7684\u65B9\u6CD5`remove`\u6765\u4FEE\u6539\u96C6\u5408\u7ED3\u6784\u3002\n\n\u4FEE\u6B63\uFF1A\u5E94\u8BE5\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u8EAB\u7684`remove`\u65B9\u6CD5\u8FDB\u884C\u5220\u9664\u3002\n\nIterator<String> iterator = map.keySet().iterator();\nwhile (iterator.hasNext()) {\n    String key = iterator.next();\n    if ("b".equals(key)) {\n        iterator.remove(); // \u6B63\u786E\u505A\u6CD5\n    }\n}',
    score: 4,
    explanation: "\u8FD9\u662F\u5E76\u53D1\u4FEE\u6539\u5F02\u5E38\u7684\u53C8\u4E00\u4E2A\u7ECF\u5178\u6848\u4F8B\uFF0C\u8FD9\u6B21\u662F\u53D1\u751F\u5728`Map`\u7684\u904D\u5386\u4E2D\u3002\u5B83\u5F3A\u5316\u4E86\u201C\u5728\u8FED\u4EE3\u8FC7\u7A0B\u4E2D\u5FC5\u987B\u4F7F\u7528\u8FED\u4EE3\u5668\u81EA\u5DF1\u7684\u65B9\u6CD5\u6765\u4FEE\u6539\u96C6\u5408\u201D\u8FD9\u4E00\u9EC4\u91D1\u6CD5\u5219\u3002"
  },
  {
    id: 51,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0CJava I/O\u5C06\u590D\u6742\u7684\u6570\u636E\u4EA4\u6362\u8FC7\u7A0B\u62BD\u8C61\u4E3A\u4E00\u79CD\u7EDF\u4E00\u7684\u6A21\u578B\uFF0C\u8FD9\u4E2A\u6A21\u578B\u662F\u4EC0\u4E48\uFF1F",
    options: ["File", "Buffer", "Channel", "Stream"],
    answer: "Stream",
    score: 1.5,
    explanation: "\u7B14\u8BB0\u5F00\u7BC7\u5373\u660E\u786E\u6307\u51FA\uFF0CJava I/O\u7684\u6838\u5FC3\u601D\u60F3\u662F\u5C06\u6570\u636E\u4EA4\u6362\u62BD\u8C61\u4E3A\u201C\u6D41 (Stream)\u201D\uFF0C\u5B83\u662F\u4E00\u79CD\u62BD\u8C61\u7684\u6570\u636E\u901A\u9053\u3002"
  },
  {
    id: 52,
    type: "single",
    question: "\u5173\u4E8E`java.io.File`\u7C7B\uFF0C\u4EE5\u4E0B\u54EA\u4E2A\u63CF\u8FF0\u662F\u6700\u51C6\u786E\u7684\uFF1F",
    options: [
      "\u4E00\u4E2A`File`\u5BF9\u8C61\u5305\u542B\u4E86\u5176\u6240\u6307\u5411\u6587\u4EF6\u7684\u5B9E\u9645\u6570\u636E\u5185\u5BB9\u3002",
      '\u521B\u5EFA\u4E00\u4E2A`new File("test.txt")`\u5BF9\u8C61\u4F1A\u7ACB\u5373\u5728\u78C1\u76D8\u4E0A\u521B\u5EFA\u4E00\u4E2A\u7269\u7406\u6587\u4EF6\u3002',
      "`File`\u7C7B\u662F\u6587\u4EF6\u548C\u76EE\u5F55\u8DEF\u5F84\u540D\u7684\u62BD\u8C61\u8868\u793A\uFF0C\u662F\u64CD\u4F5C\u6587\u4EF6\u7CFB\u7EDF\u7684\u5165\u53E3\u3002",
      "\u8BFB\u5199\u6587\u4EF6\u5185\u5BB9\u662F`File`\u7C7B\u7684\u6838\u5FC3\u529F\u80FD\u3002"
    ],
    answer: "`File`\u7C7B\u662F\u6587\u4EF6\u548C\u76EE\u5F55\u8DEF\u5F84\u540D\u7684\u62BD\u8C61\u8868\u793A\uFF0C\u662F\u64CD\u4F5C\u6587\u4EF6\u7CFB\u7EDF\u7684\u5165\u53E3\u3002",
    score: 2.5,
    explanation: "\u7B14\u8BB0\u4E2D\u91CD\u70B9\u5F3A\u8C03\u4E86`File`\u7C7B\u4E0D\u7B49\u4E8E\u6587\u4EF6\u5185\u5BB9\uFF0C\u5B83\u4EC5\u4EC5\u662F\u4E00\u4E2A\u8DEF\u5F84\u7684\u4EE3\u8868\u3002\u8981\u8BFB\u5199\u5185\u5BB9\uFF0C\u5FC5\u987B\u4F7F\u7528I/O\u6D41\u3002\u521B\u5EFA`File`\u5BF9\u8C61\u5E76\u4E0D\u4F1A\u521B\u5EFA\u7269\u7406\u6587\u4EF6\uFF0C\u9700\u8981\u8C03\u7528`createNewFile()`\u65B9\u6CD5\u3002"
  },
  {
    id: 53,
    type: "short_answer",
    question: "\u8BF7\u7B80\u8FF0\u5B57\u8282\u6D41\u548C\u5B57\u7B26\u6D41\u7684\u6838\u5FC3\u533A\u522B\uFF0C\u5E76\u8BF4\u660E\u5728\u4F55\u79CD\u573A\u666F\u4E0B\u5E94\u8BE5\u4F18\u5148\u9009\u62E9\u5B57\u7B26\u6D41\uFF1F",
    answer: "\u6838\u5FC3\u533A\u522B\u5728\u4E8E\u5904\u7406\u7684\u6570\u636E\u5355\u5143\u4E0D\u540C\uFF1A\u5B57\u8282\u6D41\u4EE5\u5B57\u8282\uFF08byte\uFF09\u4E3A\u5355\u4F4D\uFF0C\u53EF\u4EE5\u5904\u7406\u4EFB\u4F55\u7C7B\u578B\u7684\u6570\u636E\uFF1B\u5B57\u7B26\u6D41\u4EE5\u5B57\u7B26\uFF08char\uFF09\u4E3A\u5355\u4F4D\uFF0C\u4E13\u4E3A\u5904\u7406\u6587\u672C\u6570\u636E\u8BBE\u8BA1\u3002\u5F53\u9700\u8981\u5904\u7406\u7EAF\u6587\u672C\u6587\u4EF6\uFF08\u5982.txt, .java, .properties, .xml\uFF09\u65F6\uFF0C\u5E94\u8BE5\u4F18\u5148\u9009\u62E9\u5B57\u7B26\u6D41\uFF0C\u56E0\u4E3A\u5B83\u53EF\u4EE5\u81EA\u52A8\u5904\u7406\u5B57\u7B26\u7F16\u7801\uFF0C\u6709\u6548\u9632\u6B62\u4E71\u7801\u95EE\u9898\u3002",
    score: 3.5,
    explanation: "\u8FD9\u662F\u5BF9I/O\u6D41\u4E24\u5927\u5206\u652F\u7684\u6839\u672C\u6027\u8003\u5BDF\uFF0C\u7406\u89E3\u5B83\u4EEC\u7684\u9002\u7528\u573A\u666F\u662F\u6B63\u786E\u4F7F\u7528Java I/O\u7684\u57FA\u7840\u3002"
  },
  {
    id: 54,
    type: "single",
    question: "\u4ECEJDK 7\u5F00\u59CB\uFF0C\u63A8\u8350\u4F7F\u7528`try-with-resources`\u8BED\u53E5\u6765\u5904\u7406I/O\u6D41\u3002\u5176\u6700\u4E3B\u8981\u7684\u597D\u5904\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u5B83\u80FD\u663E\u8457\u63D0\u9AD8\u6587\u4EF6\u8BFB\u5199\u7684\u6027\u80FD\u3002",
      "\u5B83\u80FD\u81EA\u52A8\u6355\u83B7\u5E76\u5904\u7406\u6240\u6709\u7684`IOException`\u3002",
      "\u5B83\u80FD\u4FDD\u8BC1\u6D41\u8D44\u6E90\u88AB\u81EA\u52A8\u3001\u6B63\u786E\u5730\u5173\u95ED\uFF0C\u65E0\u8BBA\u662F\u5426\u53D1\u751F\u5F02\u5E38\uFF0C\u4ECE\u800C\u907F\u514D\u8D44\u6E90\u6CC4\u6F0F\u3002",
      "\u5B83\u5141\u8BB8\u5728\u5355\u4E2A`try`\u5757\u4E2D\u5E76\u53D1\u5730\u8BFB\u5199\u591A\u4E2A\u6587\u4EF6\u3002"
    ],
    answer: "\u5B83\u80FD\u4FDD\u8BC1\u6D41\u8D44\u6E90\u88AB\u81EA\u52A8\u3001\u6B63\u786E\u5730\u5173\u95ED\uFF0C\u65E0\u8BBA\u662F\u5426\u53D1\u751F\u5F02\u5E38\uFF0C\u4ECE\u800C\u907F\u514D\u8D44\u6E90\u6CC4\u6F0F\u3002",
    score: 3,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0C`try-with-resources`\u7684\u6838\u5FC3\u4EF7\u503C\u5728\u4E8E\u81EA\u52A8\u8D44\u6E90\u7BA1\u7406\uFF0C\u5B83\u6781\u5927\u5730\u7B80\u5316\u4E86\u4EE3\u7801\u5E76\u63D0\u9AD8\u4E86\u7A0B\u5E8F\u7684\u5065\u58EE\u6027\uFF0C\u907F\u514D\u4E86\u5728\u590D\u6742\u7684`finally`\u5757\u4E2D\u624B\u52A8\u5173\u95ED\u8D44\u6E90\u7684\u9EBB\u70E6\u548C\u6F5C\u5728\u9519\u8BEF\u3002"
  },
  {
    id: 55,
    type: "short_answer",
    question: "\u5728\u4F7F\u7528\u5B57\u8282\u6570\u7EC4\u4F5C\u4E3A\u7F13\u51B2\u533A\u590D\u5236\u6587\u4EF6\u65F6\uFF0C`out.write(buffer)`\u548C`out.write(buffer, 0, len)`\u8FD9\u4E24\u4E2A\u5199\u64CD\u4F5C\u6709\u4F55\u5173\u952E\u533A\u522B\uFF1F\u4E3A\u4EC0\u4E48\u5FC5\u987B\u4F7F\u7528\u540E\u8005\uFF1F",
    answer: "\u5173\u952E\u533A\u522B\u5728\u4E8E\u5199\u5165\u7684\u6570\u636E\u91CF\u3002`out.write(buffer)`\u4F1A\u5199\u5165\u6574\u4E2A\u7F13\u51B2\u533A\u6570\u7EC4\u7684\u5185\u5BB9\uFF0C\u800C`out.write(buffer, 0, len)`\u53EA\u5199\u5165\u7F13\u51B2\u533A\u4E2D\u4ECE\u7D22\u5F150\u5F00\u59CB\u7684`len`\u4E2A\u5B57\u8282\u3002\u5FC5\u987B\u4F7F\u7528\u540E\u8005\u662F\u56E0\u4E3A\uFF0C\u5728\u6700\u540E\u4E00\u6B21\u8BFB\u53D6\u6587\u4EF6\u65F6\uFF0C\u8BFB\u5165\u7F13\u51B2\u533A\u7684\u6570\u636E\u91CF\uFF08`len`\uFF09\u5F88\u53EF\u80FD\u5C0F\u4E8E\u7F13\u51B2\u533A\u7684\u603B\u5927\u5C0F\u3002\u5982\u679C\u6B64\u65F6\u4ECD\u4F7F\u7528`out.write(buffer)`\uFF0C\u4F1A\u5C06\u7F13\u51B2\u533A\u4E2D\u4E0A\u4E00\u6B21\u8BFB\u53D6\u540E\u6B8B\u7559\u7684\u201C\u810F\u6570\u636E\u201D\u4E5F\u4E00\u5E76\u5199\u5165\u76EE\u6807\u6587\u4EF6\uFF0C\u5BFC\u81F4\u6587\u4EF6\u672B\u5C3E\u6570\u636E\u635F\u574F\u3002",
    score: 4.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u6DF1\u5165\u4E14\u6781\u5177\u5B9E\u8DF5\u610F\u4E49\u7684\u95EE\u9898\uFF0C\u8003\u5BDF\u4E86\u5BF9\u7F13\u51B2\u8BFB\u5199\u7EC6\u8282\u7684\u6DF1\u523B\u7406\u89E3\uFF0C\u662F\u8861\u91CF\u5F00\u53D1\u8005\u662F\u5426\u771F\u6B63\u638C\u63E1\u6587\u4EF6I/O\u64CD\u4F5C\u7684\u6807\u5FD7\u6027\u95EE\u9898\u3002"
  },
  {
    id: 56,
    type: "multiple",
    question: "\u4E00\u4E2AJava\u7C7B\u7684\u5BF9\u8C61\u8981\u60F3\u88AB\u6210\u529F\u5E8F\u5217\u5316\uFF0C\u5FC5\u987B\u6EE1\u8DB3\u4EE5\u4E0B\u54EA\u4E9B\u6761\u4EF6\uFF1F",
    options: [
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`java.io.Serializable`\u63A5\u53E3\u3002",
      "\u8BE5\u7C7B\u4E2D\u6240\u6709\u975E\u77AC\u6001\uFF08non-transient\uFF09\u7684\u6210\u5458\u53D8\u91CF\u4E5F\u5FC5\u987B\u662F\u53EF\u5E8F\u5217\u5316\u7684\u3002",
      "\u8BE5\u7C7B\u5FC5\u987B\u63D0\u4F9B\u4E00\u4E2A\u516C\u5F00\u7684\u65E0\u53C2\u6784\u9020\u51FD\u6570\u3002",
      "\u8BE5\u7C7B\u7684\u6240\u6709\u65B9\u6CD5\u90FD\u5FC5\u987B\u662F`public`\u7684\u3002"
    ],
    answer: [
      "\u8BE5\u7C7B\u5FC5\u987B\u5B9E\u73B0`java.io.Serializable`\u63A5\u53E3\u3002",
      "\u8BE5\u7C7B\u4E2D\u6240\u6709\u975E\u77AC\u6001\uFF08non-transient\uFF09\u7684\u6210\u5458\u53D8\u91CF\u4E5F\u5FC5\u987B\u662F\u53EF\u5E8F\u5217\u5316\u7684\u3002"
    ],
    score: 4,
    explanation: "\u5E8F\u5217\u5316\u7684\u57FA\u672C\u8981\u6C42\u662F\u5B9E\u73B0`Serializable`\u63A5\u53E3\u3002\u6B64\u5916\uFF0C\u5E8F\u5217\u5316\u662F\u9012\u5F52\u7684\uFF0C\u5982\u679C\u4E00\u4E2A\u5BF9\u8C61\u5305\u542B\u5176\u4ED6\u5BF9\u8C61\uFF0C\u8FD9\u4E9B\u88AB\u5305\u542B\u7684\u5BF9\u8C61\uFF08\u9664\u975E\u88AB`transient`\u4FEE\u9970\uFF09\u4E5F\u5FC5\u987B\u662F\u53EF\u5E8F\u5217\u5316\u7684\u3002\u65E0\u53C2\u6784\u9020\u51FD\u6570\u662F\u67D0\u4E9B\u53CD\u5E8F\u5217\u5316\u573A\u666F\uFF08\u5982`Externalizable`\uFF09\u6216\u6846\u67B6\u7684\u8981\u6C42\uFF0C\u4F46\u4E0D\u662F`Serializable`\u7684\u5F3A\u5236\u8981\u6C42\u3002"
  },
  {
    id: 57,
    type: "single",
    question: "\u5728\u4F7F\u7528`BufferedReader`\u7684`readLine()`\u65B9\u6CD5\u8BFB\u53D6\u6587\u672C\u6587\u4EF6\u65F6\uFF0C\u8BE5\u65B9\u6CD5\u5982\u4F55\u8868\u793A\u5DF2\u5230\u8FBE\u6587\u4EF6\u672B\u5C3E\uFF1F",
    options: ["\u8FD4\u56DE-1", '\u8FD4\u56DE\u4E00\u4E2A\u7A7A\u5B57\u7B26\u4E32("")', "\u629B\u51FA`EOFException`", "\u8FD4\u56DE`null`"],
    answer: "\u8FD4\u56DE`null`",
    score: 2,
    explanation: "\u7B14\u8BB0\u4E2D\u7684\u4EE3\u7801\u793A\u4F8B\u660E\u786E\u5C55\u793A\u4E86`while ((line = reader.readLine()) != null)`\u7684\u7528\u6CD5\uFF0C\u8FD9\u8BF4\u660E`readLine()`\u5728\u8BFB\u5B8C\u6240\u6709\u884C\u540E\u4F1A\u8FD4\u56DE`null`\u3002\u8FD9\u4E0E\u5B57\u8282\u6D41\u7684`read()`\u65B9\u6CD5\u8FD4\u56DE-1\u662F\u4E0D\u540C\u7684\uFF0C\u9700\u8981\u533A\u5206\u8BB0\u5FC6\u3002"
  },
  {
    id: 58,
    type: "code",
    question: "\u8BF7\u8865\u5168\u4EE3\u7801\uFF0C\u4F7F\u7528`try-with-resources`\u8BED\u53E5\u548C\u7F13\u51B2\u6D41\uFF0C\u5B9E\u73B0\u4E00\u4E2A\u5C06`source.txt`\u5185\u5BB9\u9010\u884C\u590D\u5236\u5230`dest.txt`\u7684\u529F\u80FD\u3002",
    code_prompt: "try (/* ... */) {\n    // ...\n} catch (IOException e) {\n    e.printStackTrace();\n}",
    answer: 'try (\n    BufferedReader reader = new BufferedReader(new FileReader("source.txt"));\n    BufferedWriter writer = new BufferedWriter(new FileWriter("dest.txt"))\n) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        writer.write(line);\n        writer.newLine(); // \u5199\u5165\u6362\u884C\u7B26\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}',
    score: 4,
    explanation: '\u6B64\u9898\u8003\u5BDF\u4E86\u5B57\u7B26\u7F13\u51B2\u6D41\uFF08`BufferedReader`, `BufferedWriter`\uFF09\u7684\u5178\u578B\u7528\u6CD5\uFF0C\u4EE5\u53CA`try-with-resources`\u7684\u6B63\u786E\u683C\u5F0F\u3002\u6CE8\u610F`readLine()`\u8BFB\u53D6\u7684\u5185\u5BB9\u4E0D\u5305\u542B\u6362\u884C\u7B26\uFF0C\u9700\u8981\u7528`newLine()`\u6216`write("\\n")`\u624B\u52A8\u6DFB\u52A0\u3002'
  },
  {
    id: 59,
    type: "single",
    question: "\u5982\u679C\u4F60\u9700\u8981\u521B\u5EFA\u4E00\u4E2A\u53EF\u80FD\u5305\u542B\u591A\u7EA7\u4E0D\u5B58\u5728\u7236\u76EE\u5F55\u7684\u76EE\u5F55\u7ED3\u6784\uFF0C\u4F8B\u5982 `data/logs/app`\uFF0C\u5E94\u8BE5\u4F7F\u7528`File`\u7C7B\u7684\u54EA\u4E2A\u65B9\u6CD5\uFF1F",
    options: ["create()", "mkdir()", "mkdirs()", "createNewFile()"],
    answer: "mkdirs()",
    score: 2.5,
    explanation: "\u6839\u636E\u7B14\u8BB0API\u8868\u683C\uFF0C`mkdir()`\u53EA\u80FD\u521B\u5EFA\u5355\u7EA7\u76EE\u5F55\uFF08\u7236\u76EE\u5F55\u5FC5\u987B\u5B58\u5728\uFF09\uFF0C\u800C`mkdirs()`\u53EF\u4EE5\u521B\u5EFA\u6B64\u8DEF\u5F84\u5BF9\u5E94\u7684\u6240\u6709\u4E0D\u5B58\u5728\u7684\u7236\u76EE\u5F55\uFF0C\u7B26\u5408\u9898\u610F\u3002"
  },
  {
    id: 60,
    type: "short_answer",
    question: '\u5728Java I/O\u4E2D\uFF0C`new BufferedInputStream(new FileInputStream("a.bin"))`\u8FD9\u79CD\u4EE3\u7801\u7ED3\u6784\u4F53\u73B0\u4E86\u54EA\u79CD\u8BBE\u8BA1\u6A21\u5F0F\uFF1F\u8BF7\u89E3\u91CA\u5404\u4E2A\u89D2\u8272\u7684\u5BF9\u5E94\u5173\u7CFB\u3002',
    answer: "\u8FD9\u79CD\u7ED3\u6784\u4F53\u73B0\u4E86**\u88C5\u9970\u5668\u6A21\u5F0F (Decorator Pattern)**\u3002\n- **\u62BD\u8C61\u7EC4\u4EF6 (Component)**: `InputStream` \u62BD\u8C61\u7C7B\u3002\n- **\u5177\u4F53\u7EC4\u4EF6 (Concrete Component)**: `FileInputStream`\uFF0C\u5B83\u662F\u88AB\u88C5\u9970\u7684\u539F\u59CB\u5BF9\u8C61\uFF0C\u8D1F\u8D23\u4E0E\u7269\u7406\u6587\u4EF6\u76F4\u63A5\u4EA4\u4E92\u3002\n- **\u88C5\u9970\u5668 (Decorator)**: `BufferedInputStream`\uFF0C\u5B83\u5305\u88C5\uFF08\u88C5\u9970\uFF09\u4E86\u4E00\u4E2A`InputStream`\u5BF9\u8C61\uFF0C\u5E76\u4E3A\u5176\u589E\u52A0\u4E86\u7F13\u51B2\u529F\u80FD\u4EE5\u63D0\u5347\u6027\u80FD\uFF0C\u540C\u65F6\u5B83\u4E5F\u7EE7\u627F\u81EA`InputStream`\uFF0C\u4FDD\u6301\u4E86\u63A5\u53E3\u7684\u7EDF\u4E00\u3002",
    score: 4,
    explanation: "\u5C06\u5177\u4F53\u7684I/O\u7C7B\u5E93\u4F7F\u7528\u4E0A\u5347\u5230\u8BBE\u8BA1\u6A21\u5F0F\u7684\u9AD8\u5EA6\u8FDB\u884C\u8003\u5BDF\uFF0C\u4F53\u73B0\u4E86\u5BF9\u8F6F\u4EF6\u8BBE\u8BA1\u539F\u5219\u7684\u7406\u89E3\uFF0C\u5C5E\u4E8E\u4E2D\u9AD8\u96BE\u5EA6\u9898\u76EE\u3002"
  },
  {
    id: 61,
    type: "multiple",
    question: "\u4EE5\u4E0B\u54EA\u4E9BI/O\u76F8\u5173\u7684\u5F02\u5E38\u5C5E\u4E8E\u53D7\u68C0\u5F02\u5E38 (Checked Exception)\uFF1F",
    options: [
      "IOException",
      "FileNotFoundException",
      "NotSerializableException",
      "ArrayIndexOutOfBoundsException"
    ],
    answer: ["IOException", "FileNotFoundException", "NotSerializableException"],
    score: 3,
    explanation: "`IOException`\u53CA\u5176\u5927\u90E8\u5206\u5B50\u7C7B\uFF08\u5982`FileNotFoundException`, `NotSerializableException`\uFF09\u90FD\u5C5E\u4E8E\u53D7\u68C0\u5F02\u5E38\uFF0C\u7F16\u8BD1\u5668\u4F1A\u5F3A\u5236\u8981\u6C42\u8FDB\u884C\u5904\u7406\u3002\u800C`ArrayIndexOutOfBoundsException`\u662F`RuntimeException`\u7684\u5B50\u7C7B\uFF0C\u5C5E\u4E8E\u975E\u53D7\u68C0\u5F02\u5E38\u3002"
  },
  {
    id: 62,
    type: "single",
    question: "\u8C03\u7528`File`\u5BF9\u8C61\u7684`delete()`\u65B9\u6CD5\u8BD5\u56FE\u5220\u9664\u4E00\u4E2A\u76EE\u5F55\u65F6\uFF0C\u4EC0\u4E48\u60C5\u51B5\u4E0B\u8BE5\u64CD\u4F5C\u4F1A\u5931\u8D25\uFF1F",
    options: [
      "\u76EE\u5F55\u662F\u53EA\u8BFB\u7684\u3002",
      "\u76EE\u5F55\u4E2D\u5305\u542B\u4E86\u6587\u4EF6\u6216\u5B50\u76EE\u5F55\u3002",
      "\u7A0B\u5E8F\u6CA1\u6709\u7BA1\u7406\u5458\u6743\u9650\u3002",
      "\u4EE5\u4E0A\u6240\u6709\u60C5\u51B5\u90FD\u53EF\u80FD\u5BFC\u81F4\u5931\u8D25\u3002"
    ],
    answer: "\u4EE5\u4E0A\u6240\u6709\u60C5\u51B5\u90FD\u53EF\u80FD\u5BFC\u81F4\u5931\u8D25\u3002",
    score: 3,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA`delete()`\u53EA\u80FD\u5220\u9664**\u7A7A**\u76EE\u5F55\u3002\u6B64\u5916\uFF0C\u6587\u4EF6\u7CFB\u7EDF\u7684\u6743\u9650\uFF08\u53EA\u8BFB\u3001\u64CD\u4F5C\u7CFB\u7EDF\u6743\u9650\uFF09\u4E5F\u662F`delete`\u80FD\u5426\u6210\u529F\u7684\u73B0\u5B9E\u56E0\u7D20\u3002\u56E0\u6B64\uFF0C\u8FD9\u662F\u4E00\u4E2A\u7EFC\u5408\u6027\u7684\u8003\u5BDF\u3002"
  },
  {
    id: 63,
    type: "code",
    question: "\u8BF7\u4F7F\u7528`File`\u7C7B\u7684API\uFF0C\u7F16\u5199\u4EE3\u7801\u6765\u9012\u5F52\u5730\u5220\u9664\u4E00\u4E2A\u975E\u7A7A\u76EE\u5F55\u53CA\u5176\u6240\u6709\u5185\u5BB9\u3002",
    code_prompt: "public void deleteDirectory(File directory) {\n    // Your code here\n}",
    answer: "public void deleteDirectory(File directory) {\n    File[] files = directory.listFiles();\n    if (files != null) {\n        for (File file : files) {\n            if (file.isDirectory()) {\n                deleteDirectory(file); // \u9012\u5F52\u5220\u9664\u5B50\u76EE\u5F55\n            } else {\n                file.delete(); // \u5220\u9664\u5B50\u6587\u4EF6\n            }\n        }\n    }\n    directory.delete(); // \u5220\u9664\u7A7A\u76EE\u5F55\u672C\u8EAB\n}",
    score: 4.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u7ECF\u5178\u7684\u7B97\u6CD5\u9898\uFF0C\u7ED3\u5408\u4E86`File`\u7C7B\u7684API\uFF08`listFiles`, `isDirectory`, `delete`\uFF09\u548C\u9012\u5F52\u601D\u60F3\uFF0C\u662F\u9762\u8BD5\u4E2D\u5E38\u89C1\u7684\u6587\u4EF6\u64CD\u4F5C\u8003\u70B9\u3002"
  },
  {
    id: 64,
    type: "short_answer",
    question: "\u5728\u8FDB\u884C\u5BF9\u8C61\u53CD\u5E8F\u5217\u5316\u65F6\uFF0C\u9664\u4E86`IOException`\uFF0C\u4E3A\u4EC0\u4E48\u8FD8\u5FC5\u987B\u6355\u83B7`ClassNotFoundException`\uFF1F",
    answer: "\u56E0\u4E3A\u53CD\u5E8F\u5217\u5316\u662F\u5C06\u5B57\u8282\u5E8F\u5217\u6062\u590D\u4E3AJava\u5BF9\u8C61\u7684\u8FC7\u7A0B\uFF0C\u8FD9\u4E2A\u8FC7\u7A0B\u9700\u8981JVM\u6839\u636E\u5B57\u8282\u6D41\u4E2D\u7684\u4FE1\u606F\u627E\u5230\u5E76\u52A0\u8F7D\u5BF9\u5E94\u7684`.class`\u6587\u4EF6\u6765\u6784\u5EFA\u5BF9\u8C61\u3002\u5982\u679C\u5728\u5F53\u524D\u7684\u7C7B\u8DEF\u5F84\uFF08classpath\uFF09\u4E0B\u627E\u4E0D\u5230\u8FD9\u4E2A`.class`\u6587\u4EF6\uFF08\u4F8B\u5982\uFF0C\u7A0B\u5E8F\u8FC1\u79FB\u540E\u7F3A\u5C11\u4E86\u67D0\u4E2Ajar\u5305\uFF0C\u6216\u8005\u7C7B\u540D\u5DF2\u66F4\u6539\uFF09\uFF0CJVM\u5C31\u65E0\u6CD5\u5B8C\u6210\u5BF9\u8C61\u7684\u91CD\u6784\uFF0C\u6B64\u65F6\u5C31\u4F1A\u629B\u51FA`ClassNotFoundException`\u3002",
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9\u53CD\u5E8F\u5217\u5316\u5E95\u5C42\u673A\u5236\u7684\u7406\u89E3\uFF0C\u5373\u53CD\u5E8F\u5217\u5316\u4E0D\u4EC5\u4EC5\u662F\u6570\u636E\u6062\u590D\uFF0C\u8FD8\u4F9D\u8D56\u4E8E\u8FD0\u884C\u65F6\u7684\u7C7B\u52A0\u8F7D\u673A\u5236\u3002"
  },
  {
    id: 65,
    type: "single",
    question: "`FileInputStream`\u7684`read()`\u65B9\u6CD5\u8FD4\u56DE\u4E00\u4E2A`int`\u7C7B\u578B\u800C\u4E0D\u662F`byte`\u7C7B\u578B\uFF0C\u5176\u4E3B\u8981\u76EE\u7684\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u4E3A\u4E86\u517C\u5BB9\u5927\u4E8E\u4E00\u4E2A\u5B57\u8282\u7684\u5BBD\u5B57\u7B26\u3002",
      "\u4E3A\u4E86\u80FD\u591F\u8FD4\u56DE\u4E00\u4E2A\u5728\u5408\u6CD5\u5B57\u8282\u503C\u8303\u56F4\u4E4B\u5916\u7684\u7279\u6B8A\u503C\uFF08-1\uFF09\u6765\u8868\u793A\u6D41\u7684\u672B\u5C3E\u3002",
      "\u56E0\u4E3A\u5728\u65E9\u671F\u7684Java\u4E2D\uFF0C\u5904\u7406`int`\u6BD4\u5904\u7406`byte`\u66F4\u5FEB\u3002",
      "\u8FD9\u662F\u4E00\u4E2A\u5386\u53F2\u9057\u7559\u7684API\u8BBE\u8BA1\u7F3A\u9677\u3002"
    ],
    answer: "\u4E3A\u4E86\u80FD\u591F\u8FD4\u56DE\u4E00\u4E2A\u5728\u5408\u6CD5\u5B57\u8282\u503C\u8303\u56F4\u4E4B\u5916\u7684\u7279\u6B8A\u503C\uFF08-1\uFF09\u6765\u8868\u793A\u6D41\u7684\u672B\u5C3E\u3002",
    score: 3,
    explanation: "\u4E00\u4E2A\u5B57\u8282\u80FD\u8868\u793A\u7684\u6570\u503C\u8303\u56F4\u662F0-255\uFF08\u65E0\u7B26\u53F7\uFF09\u3002\u5982\u679C`read()`\u8FD4\u56DE`byte`\uFF0C\u90A3\u4E48\u4EFB\u4F55\u8FD4\u56DE\u503C\u90FD\u53EF\u80FD\u662F\u4E00\u4E2A\u5408\u6CD5\u7684\u6570\u636E\u5B57\u8282\uFF0C\u65E0\u6CD5\u533A\u5206\u662F\u6570\u636E\u8FD8\u662F\u7ED3\u675F\u4FE1\u53F7\u3002\u901A\u8FC7\u8FD4\u56DE`int`\uFF0C\u53EF\u4EE5\u4F7F\u7528-1\u8FD9\u4E2A\u7279\u6B8A\u503C\u6E05\u6670\u5730\u8868\u793A\u5DF2\u5230\u8FBE\u6D41\u7684\u672B\u5C3E\u3002"
  },
  {
    id: 66,
    type: "single",
    question: "\u5728\u5904\u7406I/O\u6D41\u65F6\uFF0C`FileReader`\u3001`FileInputStream` \u8FD9\u7C7B\u6D41\u901A\u5E38\u88AB\u79F0\u4E3A\u201C\u8282\u70B9\u6D41\u201D\uFF0C\u800C`BufferedReader`\u3001`BufferedInputStream` \u8FD9\u7C7B\u6D41\u88AB\u79F0\u4E3A\u201C\u5904\u7406\u6D41\u201D\u3002\u201C\u8282\u70B9\u6D41\u201D\u6700\u6838\u5FC3\u7684\u7279\u5F81\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u5B83\u4EEC\u6027\u80FD\u6700\u9AD8\u3002",
      "\u5B83\u4EEC\u76F4\u63A5\u8FDE\u63A5\u5230\u5177\u4F53\u7684\u6570\u636E\u6E90\u6216\u76EE\u7684\u5730\uFF08\u5982\u6587\u4EF6\u3001\u7F51\u7EDC\u5957\u63A5\u5B57\uFF09\u3002",
      "\u5B83\u4EEC\u5185\u90E8\u81EA\u5E26\u7F13\u51B2\u533A\u3002",
      "\u5B83\u4EEC\u53EA\u80FD\u5904\u7406\u5B57\u8282\u6570\u636E\u3002"
    ],
    answer: "\u5B83\u4EEC\u76F4\u63A5\u8FDE\u63A5\u5230\u5177\u4F53\u7684\u6570\u636E\u6E90\u6216\u76EE\u7684\u5730\uFF08\u5982\u6587\u4EF6\u3001\u7F51\u7EDC\u5957\u63A5\u5B57\uFF09\u3002",
    score: 3.5,
    explanation: "\u8FD9\u662F\u5BF9I/O\u6D41\u88C5\u9970\u5668\u6A21\u5F0F\u4E2D\u89D2\u8272\u5206\u5DE5\u7684\u7406\u89E3\u3002\u8282\u70B9\u6D41\u662F\u6574\u4E2A\u6D41\u94FE\u6761\u7684\u8D77\u70B9\uFF08\u8F93\u5165\uFF09\u6216\u7EC8\u70B9\uFF08\u8F93\u51FA\uFF09\uFF0C\u662F\u4E0E\u7269\u7406\u8BBE\u5907\u76F4\u63A5\u6253\u4EA4\u9053\u7684\u201C\u7BA1\u9053\u201D\uFF0C\u800C\u5904\u7406\u6D41\u5219\u662F\u5957\u5728\u8282\u70B9\u6D41\u4E4B\u4E0A\u7684\u201C\u589E\u5F3A\u8BBE\u5907\u201D\u3002"
  },
  {
    id: 67,
    type: "multiple",
    question: "\u4EE5\u4E0B\u5173\u4E8E\u5BF9\u8C61\u5E8F\u5217\u5316\u7684\u8BF4\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5E8F\u5217\u5316\u662F\u5C06Java\u5BF9\u8C61\u72B6\u6001\u8F6C\u6362\u4E3A\u5B57\u8282\u5E8F\u5217\u7684\u8FC7\u7A0B\u3002",
      "\u53EA\u6709\u5B9E\u73B0\u4E86`Serializable`\u63A5\u53E3\u7684\u7C7B\u7684\u5BF9\u8C61\u624D\u80FD\u88AB\u5E8F\u5217\u5316\u3002",
      "\u88AB`transient`\u5173\u952E\u5B57\u4FEE\u9970\u7684\u6210\u5458\u53D8\u91CF\u4E0D\u4F1A\u88AB\u5E8F\u5217\u5316\u3002",
      "\u9759\u6001\uFF08`static`\uFF09\u6210\u5458\u53D8\u91CF\u4F1A\u88AB\u5E8F\u5217\u5316\u5230\u5BF9\u8C61\u6D41\u4E2D\u3002"
    ],
    answer: [
      "\u5E8F\u5217\u5316\u662F\u5C06Java\u5BF9\u8C61\u72B6\u6001\u8F6C\u6362\u4E3A\u5B57\u8282\u5E8F\u5217\u7684\u8FC7\u7A0B\u3002",
      "\u53EA\u6709\u5B9E\u73B0\u4E86`Serializable`\u63A5\u53E3\u7684\u7C7B\u7684\u5BF9\u8C61\u624D\u80FD\u88AB\u5E8F\u5217\u5316\u3002",
      "\u88AB`transient`\u5173\u952E\u5B57\u4FEE\u9970\u7684\u6210\u5458\u53D8\u91CF\u4E0D\u4F1A\u88AB\u5E8F\u5217\u5316\u3002"
    ],
    score: 4,
    explanation: "\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002\u5E8F\u5217\u5316\u4FDD\u5B58\u7684\u662F\u5BF9\u8C61\u7684\u72B6\u6001\uFF08\u5B9E\u4F8B\u53D8\u91CF\uFF09\uFF0C\u800C\u9759\u6001\u53D8\u91CF\u5C5E\u4E8E\u7C7B\u7EA7\u522B\uFF0C\u4E0D\u5C5E\u4E8E\u4EFB\u4F55\u7279\u5B9A\u5BF9\u8C61\u7684\u72B6\u6001\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u88AB\u5E8F\u5217\u5316\u3002`transient`\u5173\u952E\u5B57\u7684\u4F5C\u7528\u5C31\u662F\u663E\u5F0F\u5730\u6392\u9664\u67D0\u4E9B\u5B9E\u4F8B\u53D8\u91CF\uFF0C\u4F7F\u5176\u4E0D\u53C2\u4E0E\u5E8F\u5217\u5316\u8FC7\u7A0B\u3002"
  },
  {
    id: 68,
    type: "single",
    question: "\u4F60\u6B63\u5728\u7F16\u5199\u4E00\u4E2A\u7A0B\u5E8F\uFF0C\u9700\u8981\u5C06\u4E00\u4E2A\u5305\u542B\u591A\u79CD\u6570\u636E\u7C7B\u578B\uFF08\u5982`int`, `double`, `String`\uFF09\u7684\u590D\u6742\u5BF9\u8C61\u6301\u4E45\u5316\u5230\u78C1\u76D8\u3002\u54EA\u4E00\u5BF9I/O\u6D41\u662F\u5B8C\u6210\u6B64\u4EFB\u52A1\u6700\u76F4\u63A5\u548C\u5408\u9002\u7684\u9009\u62E9\uFF1F",
    options: [
      "`FileWriter` \u548C `FileReader`",
      "`FileOutputStream` \u548C `FileInputStream`",
      "`ObjectOutputStream` \u548C `ObjectInputStream`",
      "`PrintWriter` \u548C `Scanner`"
    ],
    answer: "`ObjectOutputStream` \u548C `ObjectInputStream`",
    score: 2.5,
    explanation: "\u5BF9\u8C61\u6D41\uFF08`ObjectOutputStream` / `ObjectInputStream`\uFF09\u662F\u4E13\u95E8\u4E3A\u5E8F\u5217\u5316\u548C\u53CD\u5E8F\u5217\u5316\u6574\u4E2AJava\u5BF9\u8C61\u800C\u8BBE\u8BA1\u7684\uFF0C\u662F\u5904\u7406\u590D\u6742\u5BF9\u8C61\u6301\u4E45\u5316\u7684\u6807\u51C6\u65B9\u5F0F\u3002"
  },
  {
    id: 69,
    type: "single",
    question: "\u5F53`new FileOutputStream(file)`\u88AB\u6210\u529F\u8C03\u7528\u540E\uFF0C\u5982\u679C`file`\u5DF2\u7ECF\u5B58\u5728\uFF0C\u5C06\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
    options: [
      "\u629B\u51FA`FileAlreadyExistsException`\u5F02\u5E38\u3002",
      "\u5728\u73B0\u6709\u6587\u4EF6\u7684\u672B\u5C3E\u8FFD\u52A0\u65B0\u5185\u5BB9\u3002",
      "\u73B0\u6709\u6587\u4EF6\u7684\u5185\u5BB9\u5C06\u88AB\u6E05\u7A7A\uFF08\u8986\u76D6\uFF09\uFF0C\u51C6\u5907\u5199\u5165\u65B0\u5185\u5BB9\u3002",
      "\u8BE2\u95EE\u7528\u6237\u662F\u5426\u8981\u8986\u76D6\u6587\u4EF6\u3002"
    ],
    answer: "\u73B0\u6709\u6587\u4EF6\u7684\u5185\u5BB9\u5C06\u88AB\u6E05\u7A7A\uFF08\u8986\u76D6\uFF09\uFF0C\u51C6\u5907\u5199\u5165\u65B0\u5185\u5BB9\u3002",
    score: 3,
    explanation: "`FileOutputStream`\u7684\u8FD9\u4E2A\u6784\u9020\u51FD\u6570\u9ED8\u8BA4\u4EE5\u8986\u76D6\u6A21\u5F0F\u6253\u5F00\u6587\u4EF6\u3002\u5982\u679C\u5E0C\u671B\u8FFD\u52A0\u5185\u5BB9\uFF0C\u9700\u8981\u4F7F\u7528\u53E6\u4E00\u4E2A\u6784\u9020\u51FD\u6570 `new FileOutputStream(file, true)`\u3002"
  },
  {
    id: 70,
    type: "short_answer",
    question: "`Serializable`\u63A5\u53E3\u662F\u4E00\u4E2A\u6CA1\u6709\u4EFB\u4F55\u65B9\u6CD5\u7684\u63A5\u53E3\uFF0C\u5B83\u7684\u4F5C\u7528\u662F\u4EC0\u4E48\uFF1F\u8FD9\u7C7B\u63A5\u53E3\u5728Java\u4E2D\u88AB\u79F0\u4E3A\uFF1F",
    answer: "\u8FD9\u7C7B\u63A5\u53E3\u88AB\u79F0\u4E3A**\u6807\u8BB0\u63A5\u53E3 (Marker Interface)**\u3002\u5B83\u7684\u4F5C\u7528\u662F\u5411JVM\u63D0\u4F9B\u4E00\u4E2A\u5143\u6570\u636E\u4FE1\u606F\uFF0C\u5373\u201C\u6807\u8BB0\u201D\u4E00\u4E2A\u7C7B\u7684\u5BF9\u8C61\u662F\u201C\u53EF\u4EE5\u88AB\u5E8F\u5217\u5316\u7684\u201D\u3002JVM\u7684\u5E8F\u5217\u5316\u673A\u5236\u4F1A\u5728\u8FD0\u884C\u65F6\u68C0\u67E5\u4E00\u4E2A\u5BF9\u8C61\u6240\u5C5E\u7684\u7C7B\u662F\u5426\u5B9E\u73B0\u4E86\u8FD9\u4E2A\u63A5\u53E3\uFF0C\u4EE5\u6B64\u6765\u51B3\u5B9A\u662F\u5426\u5141\u8BB8\u5BF9\u5176\u8FDB\u884C\u5E8F\u5217\u5316\u64CD\u4F5C\u3002",
    score: 3,
    explanation: "\u8003\u5BDF\u5BF9\u6807\u8BB0\u63A5\u53E3\u8FD9\u4E00\u7279\u6B8A\u8BBE\u8BA1\u6A21\u5F0F\u7684\u7406\u89E3\uFF0C\u4EE5\u53CA`Serializable`\u63A5\u53E3\u5728\u5176\u4E2D\u7684\u5177\u4F53\u4F5C\u7528\u3002"
  },
  {
    id: 71,
    type: "multiple",
    question: "\u8C03\u7528`file.listFiles()`\u65B9\u6CD5\uFF0C\u5728\u54EA\u4E9B\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u8FD4\u56DE`null`\uFF1F",
    options: [
      "\u5F53`file`\u5BF9\u8C61\u4EE3\u8868\u7684\u76EE\u5F55\u4E3A\u7A7A\u65F6\u3002",
      "\u5F53`file`\u5BF9\u8C61\u4EE3\u8868\u7684\u8DEF\u5F84\u4E0D\u5B58\u5728\u65F6\u3002",
      "\u5F53`file`\u5BF9\u8C61\u4EE3\u8868\u7684\u8DEF\u5F84\u662F\u4E00\u4E2A\u6587\u4EF6\u800C\u4E0D\u662F\u4E00\u4E2A\u76EE\u5F55\u65F6\u3002",
      "\u5F53\u53D1\u751FI/O\u9519\u8BEF\uFF08\u5982\u6743\u9650\u4E0D\u8DB3\uFF09\u65F6\u3002"
    ],
    answer: [
      "\u5F53`file`\u5BF9\u8C61\u4EE3\u8868\u7684\u8DEF\u5F84\u4E0D\u5B58\u5728\u65F6\u3002",
      "\u5F53`file`\u5BF9\u8C61\u4EE3\u8868\u7684\u8DEF\u5F84\u662F\u4E00\u4E2A\u6587\u4EF6\u800C\u4E0D\u662F\u4E00\u4E2A\u76EE\u5F55\u65F6\u3002",
      "\u5F53\u53D1\u751FI/O\u9519\u8BEF\uFF08\u5982\u6743\u9650\u4E0D\u8DB3\uFF09\u65F6\u3002"
    ],
    score: 4,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u91CD\u8981\u7684API\u7EC6\u8282\u3002\u5F53\u76EE\u5F55\u4E3A\u7A7A\u65F6\uFF0C`listFiles()`\u4F1A\u8FD4\u56DE\u4E00\u4E2A\u957F\u5EA6\u4E3A0\u7684\u7A7A\u6570\u7EC4\uFF0C\u800C\u4E0D\u662F`null`\u3002\u53EA\u6709\u5F53`File`\u5BF9\u8C61\u4E0D\u4EE3\u8868\u4E00\u4E2A\u6709\u6548\u7684\u3001\u53EF\u8BBF\u95EE\u7684\u76EE\u5F55\u65F6\uFF0C\u624D\u4F1A\u8FD4\u56DE`null`\u3002"
  },
  {
    id: 72,
    type: "single",
    question: "\u5728\u6027\u80FD\u65B9\u9762\uFF0C\u7528`BufferedReader`\u5305\u88C5`FileReader`\uFF0C\u4E0E\u7528\u54EA\u4E2A\u7C7B\u5305\u88C5`FileInputStream`\u662F\u51FA\u4E8E\u540C\u6837\u7684\u76EE\u7684\uFF1F",
    options: [
      "`ObjectInputStream`",
      "`DataInputStream`",
      "`FilterInputStream`",
      "`BufferedInputStream`"
    ],
    answer: "`BufferedInputStream`",
    score: 2.5,
    explanation: "`BufferedReader`\u4E3A\u5B57\u7B26\u6D41\u63D0\u4F9B\u7F13\u51B2\uFF0C`BufferedInputStream`\u4E3A\u5B57\u8282\u6D41\u63D0\u4F9B\u7F13\u51B2\u3002\u5B83\u4EEC\u7684\u8BBE\u8BA1\u76EE\u7684\u76F8\u540C\uFF0C\u90FD\u662F\u901A\u8FC7\u51CF\u5C11\u5BF9\u5E95\u5C42I/O\u8BBE\u5907\u7684\u76F4\u63A5\u8BBF\u95EE\u6B21\u6570\u6765\u63D0\u5347\u8BFB\u5199\u6027\u80FD\uFF0C\u662F\u88C5\u9970\u5668\u6A21\u5F0F\u5728\u4E24\u4E2A\u6D41\u4F53\u7CFB\u4E2D\u7684\u5E73\u884C\u5E94\u7528\u3002"
  },
  {
    id: 73,
    type: "short_answer",
    question: "\u4E00\u4E2A`User`\u7C7B\u5B9E\u73B0\u4E86`Serializable`\u63A5\u53E3\uFF0C\u4F46\u4F60\u5E0C\u671B\u5B83\u7684`password`\u5B57\u6BB5\u4E0D\u88AB\u5E8F\u5217\u5316\uFF0C\u5E94\u8BE5\u5982\u4F55\u64CD\u4F5C\uFF1F\u4E3A\u4EC0\u4E48\u901A\u5E38\u8981\u8FD9\u6837\u505A\uFF1F",
    answer: "\u5E94\u8BE5\u4F7F\u7528`transient`\u5173\u952E\u5B57\u4FEE\u9970`password`\u5B57\u6BB5\uFF0C\u5373 `private transient String password;`\u3002\u901A\u5E38\u8FD9\u6837\u505A\u662F\u51FA\u4E8E**\u5B89\u5168\u8003\u8651**\u3002\u5BC6\u7801\u3001\u5BC6\u94A5\u7B49\u654F\u611F\u4FE1\u606F\u4E0D\u5E94\u8BE5\u4EE5\u660E\u6587\u5F62\u5F0F\u6301\u4E45\u5316\u5230\u6587\u4EF6\u6216\u5728\u7F51\u7EDC\u4E0A\u4F20\u8F93\uFF0C\u4EE5\u9632\u6B62\u6570\u636E\u6CC4\u9732\u540E\u88AB\u6076\u610F\u5229\u7528\u3002\u5C06\u5B83\u4EEC\u58F0\u660E\u4E3A`transient`\u53EF\u4EE5\u6709\u6548\u907F\u514D\u5176\u88AB\u5305\u542B\u5728\u5E8F\u5217\u5316\u7684\u5B57\u8282\u6D41\u4E2D\u3002",
    score: 3.5,
    explanation: "\u8003\u5BDF`transient`\u5173\u952E\u5B57\u7684\u7528\u6CD5\u53CA\u5E94\u7528\u573A\u666F\uFF0C\u8FD9\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\u5904\u7406\u654F\u611F\u6570\u636E\u65F6\u975E\u5E38\u91CD\u8981\u3002"
  },
  {
    id: 74,
    type: "single",
    question: "\u5F53\u4F60\u9700\u8981\u5411\u4E00\u4E2A\u6587\u672C\u6587\u4EF6\u5199\u5165\u5185\u5BB9\uFF0C\u5E76\u4E14\u5E0C\u671B\u4EE3\u7801\u5728\u4E0D\u540C\u64CD\u4F5C\u7CFB\u7EDF\uFF08\u5982Windows\u548CLinux\uFF09\u4E0A\u90FD\u80FD\u6B63\u786E\u751F\u6210\u6362\u884C\uFF0C\u4F7F\u7528\u54EA\u4E2A\u7C7B\u7684\u54EA\u4E2A\u65B9\u6CD5\u662F\u6700\u4FBF\u6377\u548C\u53EF\u79FB\u690D\u7684\uFF1F",
    options: [
      '`BufferedWriter`\u7684`write("\\n")`\u65B9\u6CD5',
      "`FileWriter`\u7684`write(System.lineSeparator())`\u65B9\u6CD5",
      "`PrintWriter`\u7684`println()`\u65B9\u6CD5",
      "`FileOutputStream`\u7684`write()`\u65B9\u6CD5\u5199\u5165\u6362\u884C\u7B26\u7684\u5B57\u8282"
    ],
    answer: "`PrintWriter`\u7684`println()`\u65B9\u6CD5",
    score: 3,
    explanation: "`PrintWriter.println()`\u65B9\u6CD5\u4F1A\u81EA\u52A8\u5904\u7406\u5E73\u53F0\u76F8\u5173\u7684\u884C\u5206\u9694\u7B26\uFF0C\u63D0\u4F9B\u4E86\u6700\u4F73\u7684\u53EF\u79FB\u690D\u6027\u3002\u5176\u4ED6\u9009\u9879\u867D\u7136\u4E5F\u80FD\u5B9E\u73B0\uFF0C\u4F46\u4E0D\u5982`println()`\u76F4\u63A5\u548C\u65B9\u4FBF\u3002"
  },
  {
    id: 75,
    type: "multiple",
    question: "\u4EE5\u4E0B\u54EA\u4E9B\u6D41\u5C5E\u4E8E\u5B57\u7B26\u6D41\uFF08Character Stream\uFF09\uFF1F",
    options: [
      "FileReader",
      "FileOutputStream",
      "PrintWriter",
      "BufferedInputStream"
    ],
    answer: ["FileReader", "PrintWriter"],
    score: 2,
    explanation: "\u6839\u636EJava I/O\u7684\u5206\u7C7B\uFF0C\u4EE5`Reader`\u6216`Writer`\u7ED3\u5C3E\u7684\u7C7B\u901A\u5E38\u662F\u5B57\u7B26\u6D41\uFF08\u5982`FileReader`, `PrintWriter`\uFF09\u3002\u4EE5`InputStream`\u6216`OutputStream`\u7ED3\u5C3E\u7684\u7C7B\u662F\u5B57\u8282\u6D41\uFF08\u5982`FileOutputStream`, `BufferedInputStream`\uFF09\u3002"
  },
  {
    id: 76,
    type: "single",
    question: '\u7ED9\u5B9A`File f = new File("../docs/report.pdf");`\uFF0C\u8C03\u7528`f.getName()`\u4F1A\u8FD4\u56DE\u4EC0\u4E48\uFF1F',
    options: ["../docs/report.pdf", "report.pdf", "docs/report.pdf", "../docs"],
    answer: "report.pdf",
    score: 2.5,
    explanation: "`getName()`\u65B9\u6CD5\u8FD4\u56DE\u8DEF\u5F84\u4E2D\u6700\u540E\u4E00\u4E2A\u540D\u79F0\u5206\u9694\u7B26\u4E4B\u540E\u7684\u90E8\u5206\uFF0C\u5373\u6587\u4EF6\u540D\u6216\u6700\u5185\u5C42\u7684\u76EE\u5F55\u540D\uFF0C\u800C\u4E0D\u5305\u62EC\u4E4B\u524D\u7684\u8DEF\u5F84\u4FE1\u606F\u3002"
  },
  {
    id: 77,
    type: "code",
    question: "\u5047\u8BBE\u4E00\u4E2A\u6587\u4EF6`user.dat`\u4E2D\u5E8F\u5217\u5316\u5B58\u50A8\u4E86\u591A\u4E2A`User`\u5BF9\u8C61\u3002\u8BF7\u8865\u5168\u4EE3\u7801\uFF0C\u4F7F\u7528\u5FAA\u73AF\u4ECE\u6587\u4EF6\u4E2D\u8BFB\u53D6\u6240\u6709`User`\u5BF9\u8C61\uFF0C\u76F4\u5230\u6587\u4EF6\u672B\u5C3E\u3002",
    code_prompt: 'List<User> users = new ArrayList<>();\ntry (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.dat"))) {\n    // Your code here\n} catch (IOException | ClassNotFoundException e) {\n    e.printStackTrace();\n}',
    answer: 'List<User> users = new ArrayList<>();\ntry (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.dat"))) {\n    while (true) {\n        try {\n            User user = (User) ois.readObject();\n            users.add(user);\n        } catch (EOFException e) {\n            // \u5230\u8FBE\u6587\u4EF6\u672B\u5C3E\uFF0C\u6B63\u5E38\u9000\u51FA\u5FAA\u73AF\n            break;\n        }\n    }\n} catch (IOException | ClassNotFoundException e) {\n    e.printStackTrace();\n}',
    score: 4.5,
    explanation: "\u8FDE\u7EED\u8BFB\u53D6\u591A\u4E2A\u5E8F\u5217\u5316\u5BF9\u8C61\u7684\u6807\u51C6\u505A\u6CD5\u662F\u4F7F\u7528\u4E00\u4E2A\u65E0\u9650\u5FAA\u73AF\uFF0C\u5E76\u5728\u5185\u90E8\u6355\u83B7`EOFException`\uFF08End Of File Exception\uFF09\uFF0C\u8FD9\u4E2A\u5F02\u5E38\u662F`readObject()`\u5728\u8BFB\u5230\u6D41\u672B\u5C3E\u65F6\u629B\u51FA\u7684\uFF0C\u4EE5\u6B64\u4F5C\u4E3A\u5FAA\u73AF\u7ED3\u675F\u7684\u6807\u5FD7\u3002"
  },
  {
    id: 78,
    type: "single",
    question: "\u5728Java I/O\u7684\u88C5\u9970\u5668\u6A21\u5F0F\u5E94\u7528\u4E2D\uFF0C\u54EA\u4E00\u7C7B\u6D41\u662F\u6574\u4E2A\u6D41\u201C\u94FE\u6761\u201D\u7684\u57FA\u7840\uFF0C\u76F4\u63A5\u4E0E\u6570\u636E\u6E90\uFF08\u5982\u6587\u4EF6\uFF09\u8FDB\u884C\u4EA4\u4E92\uFF1F",
    options: ["\u8282\u70B9\u6D41 (Node Stream)", "\u5904\u7406\u6D41 (Processing Stream)", "\u8FC7\u6EE4\u6D41 (Filter Stream)", "\u5BF9\u8C61\u6D41 (Object Stream)"],
    answer: "\u8282\u70B9\u6D41 (Node Stream)",
    score: 3,
    explanation: "\u8282\u70B9\u6D41\uFF08\u5982`FileInputStream`, `FileReader`\uFF09\u662FI/O\u64CD\u4F5C\u7684\u8D77\u70B9\uFF0C\u5B83\u4EEC\u76F4\u63A5\u8FDE\u63A5\u5230\u7269\u7406\u6570\u636E\u6E90\u3002\u5904\u7406\u6D41\uFF08\u5982`BufferedInputStream`, `ObjectInputStream`\uFF09\u5219\u5305\u88C5\u5728\u8282\u70B9\u6D41\u4E4B\u4E0A\uFF0C\u4E3A\u5176\u6DFB\u52A0\u989D\u5916\u529F\u80FD\u3002"
  },
  {
    id: 79,
    type: "single",
    question: "`File`\u7C7B\u7684`length()`\u65B9\u6CD5\u8FD4\u56DE\u7684\u6587\u4EF6\u5927\u5C0F\uFF0C\u5176\u5355\u4F4D\u662F\u4EC0\u4E48\uFF1F",
    options: ["\u6BD4\u7279(bit)", "\u5B57\u8282(byte)", "\u5343\u5B57\u8282(KB)", "\u5B57\u7B26\u6570"],
    answer: "\u5B57\u8282(byte)",
    score: 1.5,
    explanation: "\u6839\u636E\u7B14\u8BB0\u4E2D\u7684API\u63CF\u8FF0\uFF0C`length()`\u65B9\u6CD5\u8FD4\u56DE\u7684\u662F`long`\u7C7B\u578B\u7684\u5B57\u8282\u6570\uFF0C\u8FD9\u662F\u6587\u4EF6\u5927\u5C0F\u5728\u8BA1\u7B97\u673A\u7CFB\u7EDF\u4E2D\u7684\u57FA\u672C\u5355\u4F4D\u3002"
  },
  {
    id: 80,
    type: "short_answer",
    question: "\u4E3A\u4EC0\u4E48Java I/O\u4F53\u7CFB\u8981\u8BBE\u8BA1\u6210\u9700\u8981\u5C42\u5C42\u5305\u88C5\uFF08\u5982 `new BufferedReader(new FileReader(...))`\uFF09\u7684\u7ED3\u6784\uFF1F\u8FD9\u79CD\u8BBE\u8BA1\u7684\u6838\u5FC3\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1F",
    answer: "\u8FD9\u79CD\u8BBE\u8BA1\u662F\u57FA\u4E8E**\u88C5\u9970\u5668\u8BBE\u8BA1\u6A21\u5F0F**\u3002\u5176\u6838\u5FC3\u4F18\u52BF\u5728\u4E8E**\u7075\u6D3B\u6027\u548C\u53EF\u7EC4\u5408\u6027**\u3002\u5B83\u5C06I/O\u7684\u5404\u79CD\u529F\u80FD\uFF08\u5982\u8FDE\u63A5\u6587\u4EF6\u3001\u63D0\u4F9B\u7F13\u51B2\u3001\u5904\u7406\u5B57\u7B26\u7F16\u7801\u3001\u5E8F\u5217\u5316\u5BF9\u8C61\u7B49\uFF09\u89E3\u8026\u5230\u4E0D\u540C\u7684\u7C7B\u4E2D\u3002\u5F00\u53D1\u8005\u53EF\u4EE5\u6839\u636E\u5177\u4F53\u9700\u6C42\uFF0C\u50CF\u642D\u79EF\u6728\u4E00\u6837\u81EA\u7531\u5730\u7EC4\u5408\u8FD9\u4E9B\u529F\u80FD\uFF0C\u4E3A\u57FA\u7840\u7684\u8282\u70B9\u6D41\u201C\u88C5\u9970\u201D\u4E0A\u9700\u8981\u7684\u80FD\u529B\uFF0C\u800C\u65E0\u9700\u4E3A\u6BCF\u4E00\u79CD\u529F\u80FD\u7EC4\u5408\u90FD\u521B\u5EFA\u4E00\u4E2A\u5E9E\u5927\u800C\u590D\u6742\u7684\u7C7B\u3002\u8FD9\u5927\u5927\u63D0\u9AD8\u4E86\u4EE3\u7801\u7684\u590D\u7528\u6027\u548C\u6269\u5C55\u6027\u3002",
    score: 4,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u5B8F\u89C2\u7684\u8BBE\u8BA1\u601D\u60F3\u95EE\u9898\uFF0C\u8003\u5BDF\u5BF9Java I/O\u5E93\u8BBE\u8BA1\u54F2\u5B66\u7684\u7406\u89E3\uFF0C\u80FD\u591F\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\u8868\u660E\u5BF9I/O\u4F53\u7CFB\u6709\u4E86\u7CFB\u7EDF\u6027\u7684\u8BA4\u8BC6\u3002"
  },
  {
    id: 81,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0C`Error`\u548C`Exception`\u6700\u6838\u5FC3\u7684\u533A\u522B\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "`Error`\u662F\u7F16\u8BD1\u671F\u95EE\u9898\uFF0C`Exception`\u662F\u8FD0\u884C\u671F\u95EE\u9898\u3002",
      "`Error`\u7531\u7A0B\u5E8F\u903B\u8F91\u9519\u8BEF\u5F15\u8D77\uFF0C\u800C`Exception`\u7531\u5916\u90E8\u73AF\u5883\u5BFC\u81F4\u3002",
      "`Error`\u662FJVM\u5C42\u9762\u7684\u4E25\u91CD\u95EE\u9898\uFF0C\u7A0B\u5E8F\u901A\u5E38\u65E0\u6CD5\u5904\u7406\u548C\u6062\u590D\uFF1B\u800C`Exception`\u662F\u53EF\u88AB\u7A0B\u5E8F\u6355\u83B7\u548C\u5904\u7406\u7684\u95EE\u9898\u3002",
      "`Error`\u5FC5\u987B\u4F7F\u7528`try-catch`\u5904\u7406\uFF0C\u800C`Exception`\u53EF\u4EE5\u4E0D\u5904\u7406\u3002"
    ],
    answer: "`Error`\u662FJVM\u5C42\u9762\u7684\u4E25\u91CD\u95EE\u9898\uFF0C\u7A0B\u5E8F\u901A\u5E38\u65E0\u6CD5\u5904\u7406\u548C\u6062\u590D\uFF1B\u800C`Exception`\u662F\u53EF\u88AB\u7A0B\u5E8F\u6355\u83B7\u548C\u5904\u7406\u7684\u95EE\u9898\u3002",
    score: 2.5,
    explanation: "\u8FD9\u662F\u5BF9Java\u5F02\u5E38\u4F53\u7CFB\u9876\u5C42\u8BBE\u8BA1\u7684\u6838\u5FC3\u7406\u89E3\u3002`Error`\u4EE3\u8868\u4E86\u7CFB\u7EDF\u7EA7\u7684\u3001\u707E\u96BE\u6027\u7684\u6545\u969C\uFF08\u5982\u5185\u5B58\u8017\u5C3D\uFF09\uFF0C\u8D85\u51FA\u4E86\u5E94\u7528\u7A0B\u5E8F\u7684\u5904\u7406\u80FD\u529B\u8303\u56F4\uFF0C\u800C`Exception`\u5219\u662F\u4E3A\u7A0B\u5E8F\u5065\u58EE\u6027\u8BBE\u8BA1\uFF0C\u5141\u8BB8\u5F00\u53D1\u8005\u901A\u8FC7\u7F16\u7801\u6765\u5E94\u5BF9\u3002"
  },
  {
    id: 82,
    type: "short_answer",
    question: "\u8BF7\u7B80\u8FF0\u7F16\u8BD1\u671F\u5F02\u5E38\uFF08Checked Exception\uFF09\u548C\u8FD0\u884C\u671F\u5F02\u5E38\uFF08RuntimeException\uFF09\u4E4B\u95F4\u7684\u4E3B\u8981\u533A\u522B\u3002",
    answer: "\u4E3B\u8981\u533A\u522B\u5728\u4E8E\u7F16\u8BD1\u5668\u662F\u5426\u5F3A\u5236\u68C0\u67E5\u548C\u5904\u7406\u3002\n1. **\u7F16\u8BD1\u671F\u5F02\u5E38 (Checked Exception)**\uFF1A\u7F16\u8BD1\u5668\u4F1A\u5F3A\u5236\u8981\u6C42\u7A0B\u5E8F\u5458\u5FC5\u987B\u5904\u7406\u5B83\uFF0C\u5904\u7406\u65B9\u5F0F\u8981\u4E48\u4F7F\u7528`try-catch`\u6355\u83B7\uFF0C\u8981\u4E48\u4F7F\u7528`throws`\u58F0\u660E\u629B\u51FA\uFF0C\u5426\u5219\u4EE3\u7801\u65E0\u6CD5\u901A\u8FC7\u7F16\u8BD1\u3002\u5B83\u901A\u5E38\u7528\u4E8E\u8868\u793A\u7A0B\u5E8F\u5728\u4E0E\u5916\u90E8\u8D44\u6E90\u4EA4\u4E92\u65F6\u53EF\u80FD\u53D1\u751F\u7684\u3001\u4E0D\u53EF\u907F\u514D\u7684\u610F\u5916\u60C5\u51B5\uFF0C\u5982`IOException`\u3002\n2. **\u8FD0\u884C\u671F\u5F02\u5E38 (RuntimeException)**\uFF1A\u7F16\u8BD1\u5668\u4E0D\u5F3A\u5236\u8981\u6C42\u5904\u7406\u3002\u5B83\u901A\u5E38\u662F\u7531\u7A0B\u5E8F\u81EA\u8EAB\u7684\u903B\u8F91\u9519\u8BEF\uFF08\u5982\u7A7A\u6307\u9488\u3001\u6570\u7EC4\u8D8A\u754C\uFF09\u5F15\u8D77\u7684\uFF0C\u7406\u8BBA\u4E0A\u53EF\u4EE5\u901A\u8FC7\u66F4\u4E25\u8C28\u7684\u4EE3\u7801\u6765\u907F\u514D\u3002",
    score: 4,
    explanation: "\u8FD9\u662FJava\u5F02\u5E38\u5904\u7406\u4E2D\u4E00\u4E2A\u6781\u5176\u91CD\u8981\u7684\u6982\u5FF5\uFF0C\u4E5F\u662F\u9762\u8BD5\u4E2D\u7684\u9AD8\u9891\u95EE\u9898\u3002\u7406\u89E3\u4E24\u8005\u7684\u533A\u522B\uFF0C\u6709\u52A9\u4E8E\u7F16\u5199\u51FA\u65E2\u5065\u58EE\u53C8\u6E05\u6670\u7684\u4EE3\u7801\u3002"
  },
  {
    id: 83,
    type: "multiple",
    question: "\u6839\u636E\u7B14\u8BB0\u548CJava\u89C4\u8303\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u5F02\u5E38\u5C5E\u4E8E\u8FD0\u884C\u671F\u5F02\u5E38 (RuntimeException)\uFF1F",
    options: [
      "NullPointerException",
      "IOException",
      "ClassCastException",
      "SQLException"
    ],
    answer: ["NullPointerException", "ClassCastException"],
    score: 3,
    explanation: "`NullPointerException`\u548C`ClassCastException`\u90FD\u662F`RuntimeException`\u7684\u5B50\u7C7B\uFF0C\u901A\u5E38\u7531\u4EE3\u7801\u903B\u8F91\u4E0D\u4E25\u8C28\u9020\u6210\u3002\u800C`IOException`\u548C`SQLException`\u662F\u5178\u578B\u7684\u7F16\u8BD1\u671F\u5F02\u5E38\uFF0C\u56E0\u4E3A\u5B83\u4EEC\u6D89\u53CA\u4E0E\u5916\u90E8\u7CFB\u7EDF\uFF08\u6587\u4EF6\u3001\u6570\u636E\u5E93\uFF09\u7684\u4EA4\u4E92\uFF0C\u8FD9\u4E9B\u4EA4\u4E92\u7684\u6210\u529F\u4E0E\u5426\u5728\u7F16\u8BD1\u65F6\u662F\u65E0\u6CD5\u4FDD\u8BC1\u7684\u3002"
  },
  {
    id: 84,
    type: "single",
    question: "\u5728\u4F7F\u7528\u591A\u4E2A`catch`\u5757\u6355\u83B7\u4E0D\u540C\u7C7B\u578B\u7684\u5F02\u5E38\u65F6\uFF0C\u6B63\u786E\u7684\u6392\u5217\u987A\u5E8F\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u7236\u7C7B\u5F02\u5E38\u5728\u524D\uFF0C\u5B50\u7C7B\u5F02\u5E38\u5728\u540E\u3002",
      "\u5B50\u7C7B\u5F02\u5E38\u5728\u524D\uFF0C\u7236\u7C7B\u5F02\u5E38\u5728\u540E\u3002",
      "\u987A\u5E8F\u65E0\u6240\u8C13\uFF0CJVM\u4F1A\u81EA\u52A8\u5339\u914D\u3002",
      "\u5FC5\u987B\u6309\u5B57\u6BCD\u987A\u5E8F\u6392\u5217\u3002"
    ],
    answer: "\u5B50\u7C7B\u5F02\u5E38\u5728\u524D\uFF0C\u7236\u7C7B\u5F02\u5E38\u5728\u540E\u3002",
    score: 3,
    explanation: "\u56E0\u4E3AJava\u7684\u5F02\u5E38\u5339\u914D\u673A\u5236\u662F\u4ECE\u4E0A\u5230\u4E0B\u8FDB\u884C\u7684\u3002\u5982\u679C\u7236\u7C7B\u5F02\u5E38\u5728\u524D\uFF0C\u5B83\u4F1A\u6355\u83B7\u6240\u6709\u5176\u5B50\u7C7B\u7684\u5F02\u5E38\uFF0C\u5BFC\u81F4\u540E\u9762\u7684\u5B50\u7C7B\u5F02\u5E38`catch`\u5757\u6C38\u8FDC\u65E0\u6CD5\u88AB\u6267\u884C\uFF0C\u8FD9\u5728\u7F16\u8BD1\u65F6\u5C31\u4F1A\u62A5\u9519\uFF08unreachable code\uFF09\u3002"
  },
  {
    id: 85,
    type: "code",
    question: "\u5206\u6790\u4EE5\u4E0B\u4EE3\u7801\u7684\u6267\u884C\u6D41\u7A0B\uFF0C\u5B83\u7684\u6700\u7EC8\u8F93\u51FA\u7ED3\u679C\u662F\u4EC0\u4E48\uFF1F\n\npublic int testFinally() {\n    int x = 1;\n    try {\n        x = 2;\n        System.out.println(10 / 0);\n        return x;\n    } catch (Exception e) {\n        x = 3;\n        return x;\n    } finally {\n        x = 4;\n    }\n}",
    answer: "3",
    score: 4.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u7ECF\u5178\u7684\u9762\u8BD5\u9898\uFF0C\u7528\u4E8E\u8003\u5BDF`finally`\u5757\u4E0E`return`\u8BED\u53E5\u7684\u4EA4\u4E92\u3002\u6267\u884C\u6D41\u7A0B\uFF1A\n1. `try`\u5757\u4E2D `x` \u53D8\u4E3A 2\u3002\n2. `10 / 0` \u629B\u51FA`ArithmeticException`\u3002\n3. `catch`\u5757\u88AB\u6267\u884C\uFF0C`x` \u53D8\u4E3A 3\u3002\n4. `catch`\u5757\u9047\u5230`return x;`\uFF0C\u5B83\u4F1A\u5148\u5C06\u8FD4\u56DE\u503C`3`\u6682\u5B58\u8D77\u6765\uFF0C\u51C6\u5907\u8FD4\u56DE\u3002\n5. \u5728`return`\u4E4B\u524D\uFF0C`finally`\u5757\u5FC5\u987B\u6267\u884C\uFF0C`x` \u53D8\u4E3A 4\u3002\n6. `finally`\u5757\u6267\u884C\u5B8C\u6BD5\u540E\uFF0C`catch`\u5757\u8FD4\u56DE\u4E4B\u524D\u6682\u5B58\u7684\u503C\uFF0C\u5373`3`\u3002`finally`\u5757\u4E2D\u5BF9`x`\u7684\u4FEE\u6539\u4E0D\u4F1A\u5F71\u54CD\u5DF2\u7ECF\u51C6\u5907\u597D\u7684\u8FD4\u56DE\u503C\u3002"
  },
  {
    id: 86,
    type: "short_answer",
    question: "\u8BF7\u89E3\u91CA`finally`\u4EE3\u7801\u5757\u7684\u4F5C\u7528\u4EE5\u53CA\u5B83\u7684\u6267\u884C\u65F6\u673A\u3002\u662F\u5426\u5B58\u5728`finally`\u5757\u4E0D\u4F1A\u88AB\u6267\u884C\u7684\u7279\u6B8A\u60C5\u51B5\uFF1F",
    answer: "`finally`\u5757\u7684\u4F5C\u7528\u662F\u63D0\u4F9B\u4E00\u4E2A\u201C\u65E0\u8BBA\u5982\u4F55\u90FD\u4F1A\u6267\u884C\u201D\u7684\u4EE3\u7801\u533A\u57DF\uFF0C\u901A\u5E38\u7528\u4E8E\u6267\u884C\u5FC5\u987B\u7684\u6E05\u7406\u5DE5\u4F5C\uFF0C\u5982\u5173\u95ED\u6587\u4EF6\u6D41\u3001\u6570\u636E\u5E93\u8FDE\u63A5\u3001\u91CA\u653E\u9501\u7B49\u8D44\u6E90\uFF0C\u4EE5\u907F\u514D\u8D44\u6E90\u6CC4\u6F0F\u3002\n\u5B83\u7684\u6267\u884C\u65F6\u673A\u662F\uFF1A\u5728`try-catch`\u7ED3\u6784\u6267\u884C\u5B8C\u6BD5\u4E4B\u540E\uFF0C\u65E0\u8BBA`try`\u5757\u662F\u6B63\u5E38\u7ED3\u675F\u8FD8\u662F\u56E0\u5F02\u5E38\u4E2D\u65AD\uFF0C\u4E5F\u65E0\u8BBA`catch`\u5757\u662F\u5426\u88AB\u6267\u884C\uFF0C`finally`\u5757\u603B\u4F1A\u6267\u884C\u3002\n\u5B58\u5728\u4E00\u79CD\u7279\u6B8A\u60C5\u51B5`finally`\u4E0D\u4F1A\u6267\u884C\uFF1A\u5982\u679C\u5728`try`\u6216`catch`\u5757\u4E2D\u8C03\u7528\u4E86`System.exit()`\u65B9\u6CD5\u6765\u7EC8\u6B62Java\u865A\u62DF\u673A\uFF0C\u90A3\u4E48`finally`\u5757\u5C06\u4E0D\u4F1A\u88AB\u6267\u884C\u3002",
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9`finally`\u5173\u952E\u5B57\u7684\u5168\u9762\u7406\u89E3\uFF0C\u5305\u62EC\u5176\u6838\u5FC3\u7528\u9014\u548C\u6267\u884C\u7684\u8FB9\u754C\u6761\u4EF6\u3002"
  },
  {
    id: 87,
    type: "short_answer",
    question: "\u8BF7\u6E05\u6670\u5730\u8FA8\u522B`throw`\u548C`throws`\u5173\u952E\u5B57\u5728Java\u5F02\u5E38\u5904\u7406\u4E2D\u7684\u533A\u522B\u3002",
    answer: "`throw`\u548C`throws`\u662F\u4E24\u4E2A\u5B8C\u5168\u4E0D\u540C\u7684\u5173\u952E\u5B57\uFF1A\n- **\u4F4D\u7F6E**\uFF1A`throws`\u7528\u5728\u65B9\u6CD5\u7B7E\u540D\u4E0A\uFF0C\u8DDF\u5728\u53C2\u6570\u5217\u8868\u540E\u9762\uFF1B`throw`\u7528\u5728\u65B9\u6CD5\u4F53\u5185\u90E8\u3002\n- **\u4F5C\u7528**\uFF1A`throws`\u7528\u4E8E\u201C\u58F0\u660E\u201D\u4E00\u4E2A\u65B9\u6CD5\u53EF\u80FD\u4F1A\u629B\u51FA\u54EA\u4E9B\u7C7B\u578B\u7684\u5F02\u5E38\uFF0C\u662F\u4E00\u79CD\u5BF9\u8C03\u7528\u8005\u7684\u5951\u7EA6\u6216\u8B66\u544A\uFF1B`throw`\u662F\u201C\u629B\u51FA\u201D\u4E00\u4E2A\u5177\u4F53\u7684\u5F02\u5E38\u5BF9\u8C61\u5B9E\u4F8B\u7684\u52A8\u4F5C\u3002\n- **\u5BF9\u8C61**\uFF1A`throws`\u540E\u9762\u8DDF\u7684\u662F\u5F02\u5E38\u7684\u7C7B\u578B\uFF08\u7C7B\u540D\uFF09\uFF1B`throw`\u540E\u9762\u8DDF\u7684\u662F\u4E00\u4E2A\u5F02\u5E38\u7684\u5BF9\u8C61\u5B9E\u4F8B\uFF08`new Exception()`\uFF09\u3002\n- **\u603B\u7ED3**\uFF1A`throws`\u662F\u201C\u8BF4\u201D\u53EF\u80FD\u4F1A\u51FA\u95EE\u9898\uFF0C`throw`\u662F\u201C\u505A\u201D\u2014\u2014\u771F\u7684\u628A\u95EE\u9898\u6254\u51FA\u6765\u4E86\u3002",
    score: 4,
    explanation: "\u8FD9\u662F\u5F02\u5E38\u5904\u7406\u90E8\u5206\u7684\u53E6\u4E00\u4E2A\u7ECF\u5178\u9762\u8BD5\u9898\uFF0C\u51C6\u786E\u533A\u5206\u8FD9\u4E24\u4E2A\u5173\u952E\u5B57\u7684\u7528\u6CD5\u662F\u638C\u63E1Java\u5F02\u5E38\u5904\u7406\u673A\u5236\u7684\u57FA\u7840\u3002"
  },
  {
    id: 88,
    type: "multiple",
    question: "\u5173\u4E8E`NullPointerException`\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5B83\u662F\u4E00\u79CD\u7F16\u8BD1\u671F\u5F02\u5E38\uFF0C\u5FC5\u987B\u5728\u7F16\u7801\u65F6\u5904\u7406\u3002",
      "\u5F53\u8C03\u7528\u4E00\u4E2A\u503C\u4E3A`null`\u7684\u5F15\u7528\u53D8\u91CF\u7684\u6210\u5458\u65B9\u6CD5\u6216\u5C5E\u6027\u65F6\uFF0C\u4F1A\u53D1\u751F\u6B64\u5F02\u5E38\u3002",
      "\u907F\u514D\u6B64\u5F02\u5E38\u7684\u6700\u4F73\u5B9E\u8DF5\u662F\u5728\u4F7F\u7528\u5BF9\u8C61\u5F15\u7528\u524D\u8FDB\u884C\u975E\u7A7A\u5224\u65AD\uFF08\u5982`if (obj != null)`\uFF09\u3002",
      "\u5B83\u901A\u5E38\u7531JVM\u5185\u90E8\u9519\u8BEF\u5F15\u8D77\uFF0C\u7A0B\u5E8F\u65E0\u6CD5\u907F\u514D\u3002"
    ],
    answer: [
      "\u5F53\u8C03\u7528\u4E00\u4E2A\u503C\u4E3A`null`\u7684\u5F15\u7528\u53D8\u91CF\u7684\u6210\u5458\u65B9\u6CD5\u6216\u5C5E\u6027\u65F6\uFF0C\u4F1A\u53D1\u751F\u6B64\u5F02\u5E38\u3002",
      "\u907F\u514D\u6B64\u5F02\u5E38\u7684\u6700\u4F73\u5B9E\u8DF5\u662F\u5728\u4F7F\u7528\u5BF9\u8C61\u5F15\u7528\u524D\u8FDB\u884C\u975E\u7A7A\u5224\u65AD\uFF08\u5982`if (obj != null)`\uFF09\u3002"
    ],
    score: 3,
    explanation: "`NullPointerException`\u662F\u6700\u5E38\u89C1\u7684\u8FD0\u884C\u65F6\u5F02\u5E38\uFF0C\u7531\u7A0B\u5E8F\u903B\u8F91\u4E0D\u4E25\u8C28\u5BFC\u81F4\uFF0C\u5B8C\u5168\u53EF\u4EE5\u901A\u8FC7\u9632\u5FA1\u6027\u7F16\u7A0B\u6765\u907F\u514D\u3002\u5B83\u4E0D\u662F\u7F16\u8BD1\u671F\u5F02\u5E38\uFF0C\u4E5F\u975EJVM\u9519\u8BEF\u3002"
  },
  {
    id: 89,
    type: "single",
    question: "\u4E3A\u4E86\u9632\u6B62`ClassCastException`\uFF08\u7C7B\u578B\u8F6C\u6362\u5F02\u5E38\uFF09\u7684\u53D1\u751F\uFF0C\u5728\u8FDB\u884C\u5F3A\u5236\u7C7B\u578B\u8F6C\u6362\u4E4B\u524D\uFF0C\u6700\u63A8\u8350\u4F7F\u7528\u54EA\u4E2A\u5173\u952E\u5B57\u8FDB\u884C\u5B89\u5168\u68C0\u67E5\uFF1F",
    options: ["typeof", "is_a", "instanceof", "checkcast"],
    answer: "instanceof",
    score: 2.5,
    explanation: "`instanceof`\u662FJava\u63D0\u4F9B\u7684\u7528\u4E8E\u68C0\u67E5\u4E00\u4E2A\u5BF9\u8C61\u662F\u5426\u662F\u7279\u5B9A\u7C7B\u6216\u5176\u5B50\u7C7B\u7684\u5B9E\u4F8B\u7684\u5173\u952E\u5B57\u3002`if (obj instanceof TargetType)`\u662F\u8FDB\u884C\u5B89\u5168\u7C7B\u578B\u8F6C\u6362\u7684\u6807\u51C6\u524D\u7F6E\u68C0\u67E5\u3002"
  },
  {
    id: 90,
    type: "short_answer",
    question: "\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u5F53Java\u5185\u7F6E\u7684\u5F02\u5E38\u7C7B\u578B\u5DF2\u7ECF\u5F88\u4E30\u5BCC\u65F6\uFF0C\u4E3A\u4EC0\u4E48\u6211\u4EEC\u8FD8\u9700\u8981\u521B\u5EFA\u81EA\u5B9A\u4E49\u5F02\u5E38\uFF1F",
    answer: "\u521B\u5EFA\u81EA\u5B9A\u4E49\u5F02\u5E38\u4E3B\u8981\u6709\u4EE5\u4E0B\u51E0\u4E2A\u539F\u56E0\uFF1A\n1. **\u66F4\u7CBE\u786E\u5730\u63CF\u8FF0\u95EE\u9898**\uFF1A\u5F53\u5185\u7F6E\u5F02\u5E38\u4E0D\u80FD\u51C6\u786E\u3001\u6E05\u6670\u5730\u63CF\u8FF0\u4E1A\u52A1\u903B\u8F91\u5C42\u9762\u7684\u7279\u5B9A\u9519\u8BEF\u65F6\uFF08\u5982\u201C\u7528\u6237\u540D\u4E0D\u5B58\u5728\u201D\u3001\u201C\u5BC6\u7801\u9519\u8BEF\u201D\u3001\u201C\u4F59\u989D\u4E0D\u8DB3\u201D\uFF09\uFF0C\u81EA\u5B9A\u4E49\u5F02\u5E38\u53EF\u4EE5\u63D0\u4F9B\u66F4\u5F3A\u7684\u53EF\u8BFB\u6027\u548C\u53EF\u7EF4\u62A4\u6027\u3002\n2. **\u5B9E\u73B0\u7EDF\u4E00\u7684\u5F02\u5E38\u5904\u7406**\uFF1A\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2A\u81EA\u5B9A\u4E49\u7684\u4E1A\u52A1\u5F02\u5E38\u57FA\u7C7B\uFF0C\u6240\u6709\u5177\u4F53\u7684\u4E1A\u52A1\u5F02\u5E38\u90FD\u7EE7\u627F\u81EA\u5B83\u3002\u8FD9\u6837\uFF0C\u5728\u9876\u5C42\u8C03\u7528\u5904\uFF0C\u53EF\u4EE5\u901A\u8FC7\u6355\u83B7\u8FD9\u4E2A\u57FA\u7C7B\u5F02\u5E38\u6765\u7EDF\u4E00\u5904\u7406\u6240\u6709\u9884\u671F\u7684\u4E1A\u52A1\u9519\u8BEF\u3002\n3. **\u5C01\u88C5\u9519\u8BEF\u4FE1\u606F**\uFF1A\u81EA\u5B9A\u4E49\u5F02\u5E38\u53EF\u4EE5\u643A\u5E26\u66F4\u591A\u7684\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF08\u5982\u9519\u8BEF\u7801\u3001\u8BE6\u7EC6\u63CF\u8FF0\u3001\u76F8\u5173\u6570\u636E\uFF09\uFF0C\u800C\u4E0D\u4EC5\u4EC5\u662F\u4E00\u4E2A\u7B80\u5355\u7684\u9519\u8BEF\u6D88\u606F\uFF0C\u4FBF\u4E8E\u65E5\u5FD7\u8BB0\u5F55\u3001\u95EE\u9898\u6392\u67E5\u548C\u7ED9\u524D\u7AEF\u8FD4\u56DE\u7ED3\u6784\u5316\u7684\u9519\u8BEF\u4FE1\u606F\u3002",
    score: 4,
    explanation: "\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u7684\u662F\u8F6F\u4EF6\u8BBE\u8BA1\u7684\u601D\u60F3\u3002\u521B\u5EFA\u81EA\u5B9A\u4E49\u5F02\u5E38\u662F\u6784\u5EFA\u5065\u58EE\u3001\u53EF\u7EF4\u62A4\u7684\u4F01\u4E1A\u7EA7\u5E94\u7528\u7684\u91CD\u8981\u5B9E\u8DF5\uFF0C\u5B83\u5C06\u5F02\u5E38\u5904\u7406\u4ECE\u7EAF\u7CB9\u7684\u6280\u672F\u5C42\u9762\u63D0\u5347\u5230\u4E86\u4E1A\u52A1\u5C42\u9762\u3002"
  },
  {
    id: 91,
    type: "code",
    question: "\u8BF7\u521B\u5EFA\u4E00\u4E2A\u8868\u793A\u201C\u5E93\u5B58\u4E0D\u8DB3\u201D\u7684\u81EA\u5B9A\u4E49\u8FD0\u884C\u65F6\u5F02\u5E38\u7C7B`InsufficientStockException`\uFF0C\u5B83\u5E94\u8BE5\u7EE7\u627F\u81EA\u5408\u9002\u7684\u7236\u7C7B\uFF0C\u5E76\u63D0\u4F9B\u4E00\u4E2A\u63A5\u6536\u9519\u8BEF\u6D88\u606F\u7684\u6784\u9020\u65B9\u6CD5\u3002",
    answer: "public class InsufficientStockException extends RuntimeException {\n    public InsufficientStockException(String message) {\n        super(message);\n    }\n}",
    score: 3,
    explanation: "\u6B64\u9898\u8003\u5BDF\u521B\u5EFA\u81EA\u5B9A\u4E49\u5F02\u5E38\u7684\u57FA\u672C\u8BED\u6CD5\u3002\u9009\u62E9\u7EE7\u627F`RuntimeException`\u8868\u793A\u8FD9\u662F\u4E00\u4E2A\u5728\u7F16\u7801\u65F6\u53EF\u4EE5\u88AB\u9884\u89C1\u7684\u903B\u8F91\u95EE\u9898\uFF0C\u8C03\u7528\u8005\u65E0\u9700\u5F3A\u5236\u6355\u83B7\u3002\u63D0\u4F9B\u4E00\u4E2A\u8C03\u7528`super(message)`\u7684\u6784\u9020\u65B9\u6CD5\u662F\u6807\u51C6\u5B9E\u8DF5\u3002"
  },
  {
    id: 92,
    type: "single",
    question: "\u5982\u679C\u5728\u4E00\u4E2A`try`\u5757\u4E2D\u6267\u884C\u4E86`System.exit(0);`\uFF0C\u90A3\u4E48\u7D27\u968F\u5176\u540E\u7684`finally`\u5757\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
    options: [
      "\u4F1A\u6B63\u5E38\u6267\u884C\u3002",
      "\u4E0D\u4F1A\u88AB\u6267\u884C\u3002",
      "\u4F1A\u6267\u884C\uFF0C\u4F46\u5728\u6267\u884C\u5B8C\u6BD5\u540E\u7A0B\u5E8F\u4E0D\u4F1A\u7EC8\u6B62\u3002",
      "\u4F1A\u629B\u51FA\u4E00\u4E2A\u65B0\u7684\u5F02\u5E38\u3002"
    ],
    answer: "\u4E0D\u4F1A\u88AB\u6267\u884C\u3002",
    score: 3.5,
    explanation: "`System.exit(0);`\u7684\u4F5C\u7528\u662F\u7ACB\u5373\u7EC8\u6B62\u5F53\u524D\u8FD0\u884C\u7684Java\u865A\u62DF\u673A\u3002\u8FD9\u662F\u4E00\u4E2A\u975E\u5E38\u5F7B\u5E95\u7684\u64CD\u4F5C\uFF0C\u4E00\u65E6\u8C03\u7528\uFF0C\u6574\u4E2AJVM\u8FDB\u7A0B\u90FD\u4F1A\u505C\u6B62\uFF0C\u56E0\u6B64`finally`\u5757\u6CA1\u6709\u673A\u4F1A\u6267\u884C\u3002"
  },
  {
    id: 93,
    type: "multiple",
    question: "\u4EE5\u4E0B\u5173\u4E8E`throw`\u5173\u952E\u5B57\u7684\u7528\u6CD5\uFF0C\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u53EF\u4EE5`throw`\u4E00\u4E2A`Error`\u5BF9\u8C61\u3002",
      "\u53EF\u4EE5`throw`\u4E00\u4E2A`Exception`\u5BF9\u8C61\u3002",
      '\u53EF\u4EE5`throw`\u4E00\u4E2A\u666E\u901A\u7684Java\u5BF9\u8C61\uFF08\u5982`new String("error")`\uFF09\u3002',
      "`throw`\u8BED\u53E5\u4F1A\u7ACB\u5373\u4E2D\u65AD\u5F53\u524D\u65B9\u6CD5\u7684\u6267\u884C\u3002"
    ],
    answer: [
      "\u53EF\u4EE5`throw`\u4E00\u4E2A`Error`\u5BF9\u8C61\u3002",
      "\u53EF\u4EE5`throw`\u4E00\u4E2A`Exception`\u5BF9\u8C61\u3002",
      "`throw`\u8BED\u53E5\u4F1A\u7ACB\u5373\u4E2D\u65AD\u5F53\u524D\u65B9\u6CD5\u7684\u6267\u884C\u3002"
    ],
    score: 3,
    explanation: "Java\u7684`throw`\u5173\u952E\u5B57\u540E\u9762\u5FC5\u987B\u8DDF\u4E00\u4E2A`Throwable`\u7C7B\uFF08\u6216\u5176\u5B50\u7C7B\uFF0C\u5373`Error`\u6216`Exception`\uFF09\u7684\u5B9E\u4F8B\u3002\u4E0D\u80FD\u629B\u51FA\u975E`Throwable`\u7C7B\u578B\u7684\u5BF9\u8C61\u3002\u4E00\u65E6`throw`\u88AB\u6267\u884C\uFF0C\u5B83\u4F1A\u50CF`return`\u4E00\u6837\u7ACB\u5373\u7ED3\u675F\u5F53\u524D\u65B9\u6CD5\u7684\u6267\u884C\uFF0C\u5E76\u5C06\u5F02\u5E38\u629B\u7ED9\u8C03\u7528\u6808\u7684\u4E0A\u5C42\u3002"
  },
  {
    id: 94,
    type: "single",
    question: "\u7B14\u8BB0\u4E2D\u63D0\u5230\u7684`StackOverflowError`\u901A\u5E38\u662F\u7531\u4EC0\u4E48\u539F\u56E0\u5F15\u8D77\u7684\uFF1F",
    options: [
      "\u521B\u5EFA\u4E86\u8FC7\u591A\u7684\u5BF9\u8C61\uFF0C\u5BFC\u81F4\u5806\u5185\u5B58\u8017\u5C3D\u3002",
      "\u65B9\u6CD5\u8C03\u7528\u94FE\u8FC7\u6DF1\uFF0C\u4F8B\u5982\u65E0\u9650\u9012\u5F52\uFF0C\u5BFC\u81F4\u6808\u5185\u5B58\u8017\u5C3D\u3002",
      "\u52A0\u8F7D\u4E86\u8FC7\u591A\u7684\u7C7B\uFF0C\u5BFC\u81F4\u5143\u7A7A\u95F4\u8017\u5C3D\u3002",
      "\u7EBF\u7A0B\u6570\u91CF\u8FC7\u591A\uFF0C\u65E0\u6CD5\u518D\u521B\u5EFA\u65B0\u7EBF\u7A0B\u3002"
    ],
    answer: "\u65B9\u6CD5\u8C03\u7528\u94FE\u8FC7\u6DF1\uFF0C\u4F8B\u5982\u65E0\u9650\u9012\u5F52\uFF0C\u5BFC\u81F4\u6808\u5185\u5B58\u8017\u5C3D\u3002",
    score: 2,
    explanation: "\u6BCF\u4E2A\u7EBF\u7A0B\u90FD\u6709\u4E00\u4E2A\u72EC\u7ACB\u7684Java\u865A\u62DF\u673A\u6808\uFF0C\u7528\u4E8E\u5B58\u50A8\u65B9\u6CD5\u8C03\u7528\u7684\u6808\u5E27\u3002\u65E0\u9650\u9012\u5F52\u6216\u8FC7\u6DF1\u7684\u8C03\u7528\u94FE\u4F1A\u5BFC\u81F4\u6808\u5E27\u4E0D\u65AD\u538B\u6808\u800C\u65E0\u6CD5\u51FA\u6808\uFF0C\u6700\u7EC8\u8017\u5C3D\u6808\u7A7A\u95F4\uFF0C\u5F15\u53D1`StackOverflowError`\u3002"
  },
  {
    id: 95,
    type: "code",
    question: "\u5206\u6790\u4EE5\u4E0B\u4EE3\u7801\uFF0C\u8C03\u7528`getValue()`\u65B9\u6CD5\u7684\u8FD4\u56DE\u503C\u662F\u4EC0\u4E48\uFF1F\n\npublic int getValue() {\n    try {\n        return 1;\n    } finally {\n        return 2;\n    }\n}",
    answer: "2",
    score: 4.5,
    explanation: "\u8FD9\u4E5F\u662F\u4E00\u4E2A\u5173\u4E8E`finally`\u548C`return`\u7684\u7ECF\u5178\u9677\u9631\u9898\u3002\u5F53`try`\u5757\u548C`finally`\u5757\u90FD\u5305\u542B`return`\u8BED\u53E5\u65F6\uFF0C`finally`\u5757\u4E2D\u7684`return`\u4F1A\u201C\u8986\u76D6\u201D`try`\uFF08\u6216`catch`\uFF09\u5757\u4E2D\u7684`return`\u3002`try`\u5757\u7684`return 1`\u4F1A\u88AB\u51C6\u5907\u597D\uFF0C\u4F46\u5728\u771F\u6B63\u8FD4\u56DE\u4E4B\u524D\uFF0C`finally`\u5757\u6267\u884C\uFF0C\u5B83\u7684`return 2`\u4F1A\u4F7F\u5F97\u65B9\u6CD5\u5728\u6B64\u5904\u76F4\u63A5\u8FD4\u56DE\uFF0C\u5BFC\u81F4`try`\u5757\u7684\u8FD4\u56DE\u503C\u88AB\u4E22\u5F03\u3002\u5728IDE\u4E2D\uFF0C\u8FD9\u79CD\u5199\u6CD5\u901A\u5E38\u4F1A\u6536\u5230\u4E00\u4E2A\u201Cfinally block does not complete normally\u201D\u7684\u8B66\u544A\uFF0C\u56E0\u4E3A\u5B83\u662F\u4E0D\u63A8\u8350\u7684\u7F16\u7801\u98CE\u683C\u3002"
  },
  {
    id: 96,
    type: "short_answer",
    question: "\u7B14\u8BB0\u4E2D\u63D0\u5230\uFF0C\u5E94\u5F53\u901A\u8FC7\u201C\u9632\u5FA1\u6027\u7F16\u7A0B\u201D\u6765\u4E3B\u52A8\u907F\u514D\u5E38\u89C1\u7684\u8FD0\u884C\u65F6\u5F02\u5E38\u3002\u8BF7\u89E3\u91CA\u4EC0\u4E48\u662F\u9632\u5FA1\u6027\u7F16\u7A0B\uFF0C\u5E76\u4EE5\u907F\u514D`ArrayIndexOutOfBoundsException`\u4E3A\u4F8B\u8FDB\u884C\u8BF4\u660E\u3002",
    answer: "\u9632\u5FA1\u6027\u7F16\u7A0B\u662F\u4E00\u79CD\u7F16\u7A0B\u601D\u60F3\uFF0C\u6307\u5728\u4EE3\u7801\u4E2D\u4E3B\u52A8\u9884\u6D4B\u5E76\u5904\u7406\u53EF\u80FD\u5BFC\u81F4\u9519\u8BEF\u7684\u5404\u79CD\u8FB9\u754C\u6761\u4EF6\u548C\u975E\u6CD5\u8F93\u5165\uFF0C\u4ECE\u800C\u4F7F\u7A0B\u5E8F\u5728\u9762\u5BF9\u610F\u5916\u60C5\u51B5\u65F6\u4E0D\u4F1A\u5D29\u6E83\u3002\n\u4EE5\u907F\u514D`ArrayIndexOutOfBoundsException`\u4E3A\u4F8B\uFF0C\u9632\u5FA1\u6027\u7F16\u7A0B\u4F53\u73B0\u5728\uFF1A\u5728\u8BBF\u95EE\u4E00\u4E2A\u6570\u7EC4\u7684\u67D0\u4E2A\u7D22\u5F15`i`\u4E4B\u524D\uFF0C\u5148\u8FDB\u884C\u5224\u65AD\uFF0C\u786E\u4FDD\u8BE5\u7D22\u5F15\u662F\u5408\u6CD5\u7684\u3002\u4F8B\u5982\uFF1A\n`if (i >= 0 && i < array.length) { \n    // \u7D22\u5F15\u5408\u6CD5\uFF0C\u53EF\u4EE5\u5B89\u5168\u8BBF\u95EE\n    value = array[i]; \n} else { \n    // \u7D22\u5F15\u975E\u6CD5\uFF0C\u8FDB\u884C\u9519\u8BEF\u5904\u7406\uFF0C\u5982\u6253\u5370\u65E5\u5FD7\u3001\u8FD4\u56DE\u9ED8\u8BA4\u503C\u7B49\n}`\n\u8FD9\u6837\u5C31\u4E3B\u52A8\u907F\u514D\u4E86\u5F02\u5E38\u7684\u53D1\u751F\u3002",
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9\u7F16\u7A0B\u601D\u60F3\u7684\u7406\u89E3\u548C\u5E94\u7528\u3002\u9632\u5FA1\u6027\u7F16\u7A0B\u662F\u7F16\u5199\u9AD8\u8D28\u91CF\u3001\u5065\u58EE\u4EE3\u7801\u7684\u6838\u5FC3\u6280\u80FD\u4E4B\u4E00\u3002"
  },
  {
    id: 97,
    type: "single",
    question: "\u5982\u679C\u4E00\u4E2A\u65B9\u6CD5A\u7684\u7B7E\u540D\u662F`public void methodA() throws IOException`\uFF0C\u90A3\u4E48\u8C03\u7528\u65B9\u6CD5A\u7684\u4EE3\u7801\u5FC5\u987B\u505A\u4EC0\u4E48\uFF1F",
    options: [
      "\u4EC0\u4E48\u90FD\u4E0D\u7528\u505A\uFF0C proto\u017Ee `IOException`\u662F\u8FD0\u884C\u65F6\u5F02\u5E38\u3002",
      "\u5FC5\u987B\u4F7F\u7528`try-catch`\u5757\u6355\u83B7`IOException`\uFF0C\u6216\u8005\u5728\u8C03\u7528\u65B9\u6CD5\u6240\u5728\u7684\u65B9\u6CD5\u7B7E\u540D\u4E0A\u7EE7\u7EED\u7528`throws IOException`\u58F0\u660E\u3002",
      "\u53EA\u80FD\u4F7F\u7528`try-catch`\u5757\u6355\u83B7\uFF0C\u4E0D\u80FD\u518D\u5411\u4E0A\u629B\u51FA\u3002",
      "\u5FC5\u987B\u5728\u8C03\u7528\u524D\u624B\u52A8\u5173\u95ED\u6240\u6709I/O\u8D44\u6E90\u3002"
    ],
    answer: "\u5FC5\u987B\u4F7F\u7528`try-catch`\u5757\u6355\u83B7`IOException`\uFF0C\u6216\u8005\u5728\u8C03\u7528\u65B9\u6CD5\u6240\u5728\u7684\u65B9\u6CD5\u7B7E\u540D\u4E0A\u7EE7\u7EED\u7528`throws IOException`\u58F0\u660E\u3002",
    score: 3,
    explanation: "`IOException`\u662F\u7F16\u8BD1\u671F\u5F02\u5E38\u3002`throws`\u5173\u952E\u5B57\u7684\u4F5C\u7528\u5C31\u662F\u5C06\u88AB\u58F0\u660E\u7684\u5F02\u5E38\u7684\u5904\u7406\u8D23\u4EFB\u8F6C\u5AC1\u7ED9\u8C03\u7528\u8005\u3002\u8C03\u7528\u8005\u6709\u4E24\u79CD\u9009\u62E9\uFF1A\u8981\u4E48\u5C31\u5730\u5904\u7406\uFF08`try-catch`\uFF09\uFF0C\u8981\u4E48\u7EE7\u7EED\u201C\u7529\u9505\u201D\uFF08`throws`\uFF09\u3002"
  },
  {
    id: 98,
    type: "multiple",
    question: "\u5728Java\u7684\u5F02\u5E38\u4F53\u7CFB\u4E2D\uFF0C\u4EE5\u4E0B\u5173\u4E8E`Throwable`\u7C7B\u7684\u8BF4\u6CD5\u54EA\u4E9B\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5B83\u662F\u6240\u6709`Error`\u548C`Exception`\u7684\u7236\u7C7B\u3002",
      "\u53EF\u4EE5\u76F4\u63A5`new Throwable()`\u5E76\u629B\u51FA\u3002",
      "\u5B83\u5305\u542B\u4E86\u83B7\u53D6\u5F02\u5E38\u4FE1\u606F\uFF08\u5982`getMessage()`\uFF09\u548C\u5806\u6808\u8DDF\u8E2A\uFF08\u5982`printStackTrace()`\uFF09\u7684\u65B9\u6CD5\u3002",
      "\u5B83\u662F\u4E00\u4E2A\u62BD\u8C61\u7C7B\uFF0C\u4E0D\u80FD\u88AB\u5B9E\u4F8B\u5316\u3002"
    ],
    answer: [
      "\u5B83\u662F\u6240\u6709`Error`\u548C`Exception`\u7684\u7236\u7C7B\u3002",
      "\u53EF\u4EE5\u76F4\u63A5`new Throwable()`\u5E76\u629B\u51FA\u3002",
      "\u5B83\u5305\u542B\u4E86\u83B7\u53D6\u5F02\u5E38\u4FE1\u606F\uFF08\u5982`getMessage()`\uFF09\u548C\u5806\u6808\u8DDF\u8E2A\uFF08\u5982`printStackTrace()`\uFF09\u7684\u65B9\u6CD5\u3002"
    ],
    score: 3.5,
    explanation: "`Throwable`\u662FJava\u4E2D\u6240\u6709\u53EF\u629B\u51FA\u95EE\u9898\u7684\u6839\u7C7B\u3002\u5B83\u662F\u4E00\u4E2A\u5177\u4F53\u7684\u7C7B\uFF0C\u53EF\u4EE5\u88AB\u5B9E\u4F8B\u5316\u548C\u629B\u51FA\uFF0C\u5C3D\u7BA1\u8FD9\u6837\u505A\u901A\u5E38\u6CA1\u6709`Error`\u6216`Exception`\u90A3\u6837\u8BED\u4E49\u660E\u786E\u3002\u6240\u6709\u5F02\u5E38\u5BF9\u8C61\u90FD\u4ECE`Throwable`\u7EE7\u627F\u4E86`getMessage()`\u3001`printStackTrace()`\u7B49\u6838\u5FC3\u65B9\u6CD5\u3002"
  },
  {
    id: 99,
    type: "code",
    question: '\u6839\u636E\u7B14\u8BB0\u4E2D\u7684\u81EA\u5B9A\u4E49\u5F02\u5E38\u793A\u4F8B\uFF0C\u5F53\u6267\u884C`service.login("user", "123456");`\u65F6\uFF0C`main`\u65B9\u6CD5\u7684\u63A7\u5236\u53F0\u4F1A\u8F93\u51FA\u4EC0\u4E48\uFF1F\n\n(\u63D0\u793A: `UserService`\u4EE3\u7801\u5728\u7B14\u8BB0\u4E2D)',
    answer: "\u767B\u5F55\u5931\u8D25\u63D0\u793A\uFF1A\u8D26\u53F7\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u60A8\u7684\u8D26\u53F7\u3002",
    score: 4,
    explanation: '\u6B64\u9898\u8003\u5BDF\u5BF9\u81EA\u5B9A\u4E49\u5F02\u5E38\u6355\u83B7\u6D41\u7A0B\u7684\u7406\u89E3\u3002\u5F53\u4F7F\u7528\u8D26\u53F7`"user"`\u8C03\u7528`login`\u65B9\u6CD5\u65F6\uFF0C\u4F1A\u89E6\u53D1`throw new AccountNotFoundException("\u8D26\u53F7\u4E0D\u5B58\u5728");`\u3002\u5728`main`\u65B9\u6CD5\u7684`try-catch`\u7ED3\u6784\u4E2D\uFF0C\u8FD9\u4E2A\u5F02\u5E38\u4F1A\u88AB\u7B2C\u4E00\u4E2A`catch (AccountNotFoundException e)`\u5757\u7CBE\u786E\u6355\u83B7\uFF0C\u56E0\u6B64\u4F1A\u6267\u884C\u8BE5\u5757\u5185\u7684\u6253\u5370\u8BED\u53E5\u3002'
  },
  {
    id: 100,
    type: "single",
    question: "\u8C03\u7528\u5F02\u5E38\u5BF9\u8C61\u7684`e.printStackTrace()`\u65B9\u6CD5\u7684\u4E3B\u8981\u4F5C\u7528\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u5411\u7528\u6237\u663E\u793A\u4E00\u4E2A\u53CB\u597D\u7684\u9519\u8BEF\u4FE1\u606F\u3002",
      "\u7EC8\u6B62\u7A0B\u5E8F\u7684\u8FD0\u884C\u3002",
      "\u5C06\u5F02\u5E38\u7684\u8BE6\u7EC6\u5806\u6808\u8DDF\u8E2A\u4FE1\u606F\u6253\u5370\u5230\u6807\u51C6\u9519\u8BEF\u6D41\uFF0C\u4E3B\u8981\u7528\u4E8E\u7A0B\u5E8F\u5458\u8C03\u8BD5\u548C\u95EE\u9898\u5B9A\u4F4D\u3002",
      "\u5C06\u5F02\u5E38\u4FE1\u606F\u8BB0\u5F55\u5230\u65E5\u5FD7\u6587\u4EF6\u4E2D\u3002"
    ],
    answer: "\u5C06\u5F02\u5E38\u7684\u8BE6\u7EC6\u5806\u6808\u8DDF\u8E2A\u4FE1\u606F\u6253\u5370\u5230\u6807\u51C6\u9519\u8BEF\u6D41\uFF0C\u4E3B\u8981\u7528\u4E8E\u7A0B\u5E8F\u5458\u8C03\u8BD5\u548C\u95EE\u9898\u5B9A\u4F4D\u3002",
    score: 2,
    explanation: "`printStackTrace()`\u662F\u5F00\u53D1\u548C\u8C03\u8BD5\u9636\u6BB5\u6392\u67E5\u95EE\u9898\u7684\u5229\u5668\u3002\u5B83\u4F1A\u5C55\u793A\u5F02\u5E38\u7684\u7C7B\u578B\u3001\u6D88\u606F\u4EE5\u53CA\u4ECE\u5F02\u5E38\u53D1\u751F\u70B9\u5230\u8C03\u7528\u6808\u9876\u90E8\u7684\u5B8C\u6574\u65B9\u6CD5\u8C03\u7528\u94FE\uFF0C\u80FD\u5E2E\u52A9\u5F00\u53D1\u8005\u5FEB\u901F\u5B9A\u4F4D\u4EE3\u7801\u4E2D\u7684\u95EE\u9898\u6240\u5728\u3002\u5728\u751F\u4EA7\u73AF\u5883\u4E2D\uFF0C\u901A\u5E38\u4F1A\u7528\u66F4\u4E13\u4E1A\u7684\u65E5\u5FD7\u6846\u67B6\u6765\u66FF\u4EE3\u5B83\u3002"
  },
  {
    id: 101,
    type: "short_answer",
    question: "\u5728\u521B\u5EFA\u81EA\u5B9A\u4E49\u5F02\u5E38\u65F6\uFF0C\u5224\u65AD\u5E94\u8BE5\u7EE7\u627F`Exception`\u8FD8\u662F`RuntimeException`\u7684\u4E3B\u8981\u4F9D\u636E\u662F\u4EC0\u4E48\uFF1F",
    answer: "\u4E3B\u8981\u4F9D\u636E\u662F\u5F02\u5E38\u6240\u8868\u793A\u7684\u9519\u8BEF\u7684\u6027\u8D28\uFF0C\u4EE5\u53CA\u4F60\u5E0C\u671B\u8C03\u7528\u8005\u5982\u4F55\u5904\u7406\u5B83\u3002\n- **\u7EE7\u627F`Exception` (\u521B\u5EFA\u7F16\u8BD1\u671F\u5F02\u5E38)**\uFF1A\u5982\u679C\u8FD9\u4E2A\u5F02\u5E38\u4EE3\u8868\u7684\u662F\u8C03\u7528\u8005**\u65E0\u6CD5\u9884\u89C1\u548C\u9884\u9632**\u7684\u5916\u90E8\u95EE\u9898\uFF08\u5982\u7F51\u7EDC\u4E2D\u65AD\u3001\u6587\u4EF6\u635F\u574F\uFF09\uFF0C\u6216\u8005\u662F\u4E00\u79CD\u5F3A\u5236\u8981\u6C42\u8C03\u7528\u8005\u5FC5\u987B\u5173\u6CE8\u5E76\u663E\u5F0F\u5904\u7406\u7684\u4E1A\u52A1\u6D41\u7A0B\u3002\u8FD9\u4F1A\u5F3A\u5236\u8C03\u7528\u8005\u4F7F\u7528`try-catch`\u6216`throws`\uFF0C\u63D0\u9AD8\u4E86\u4EE3\u7801\u7684\u5065\u58EE\u6027\u3002\n- **\u7EE7\u627F`RuntimeException` (\u521B\u5EFA\u8FD0\u884C\u671F\u5F02\u5E38)**\uFF1A\u5982\u679C\u8FD9\u4E2A\u5F02\u5E38\u4EE3\u8868\u7684\u662F\u4E00\u4E2A**\u7F16\u7A0B\u9519\u8BEF**\u6216**API\u7684\u8BEF\u7528**\uFF08\u5982\u4F20\u9012\u4E86\u975E\u6CD5\u53C2\u6570\uFF09\uFF0C\u662F\u8C03\u7528\u8005\u672C\u5E94\u901A\u8FC7\u7F16\u5199\u6B63\u786E\u7684\u4EE3\u7801\u6765\u907F\u514D\u7684\u3002\u5C06\u5176\u8BBE\u4E3A\u8FD0\u884C\u671F\u5F02\u5E38\u53EF\u4EE5\u907F\u514D\u4EE3\u7801\u4E2D\u5145\u65A5\u7740\u5927\u91CF\u4E0D\u5FC5\u8981\u7684`try-catch`\uFF0C\u4F7F\u4EE3\u7801\u66F4\u7B80\u6D01\u3002",
    score: 4,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u8BBE\u8BA1\u5C42\u9762\u7684\u95EE\u9898\uFF0C\u8003\u5BDF\u5F00\u53D1\u8005\u5BF9\u5F02\u5E38\u5206\u7C7B\u54F2\u5B66\u601D\u60F3\u7684\u7406\u89E3\u3002\u6B63\u786E\u7684\u9009\u62E9\u80FD\u6781\u5927\u5730\u5F71\u54CDAPI\u7684\u6613\u7528\u6027\u548C\u4EE3\u7801\u8D28\u91CF\u3002"
  },
  {
    id: 102,
    type: "code",
    question: '\u4E0B\u9762\u7684`try-catch`\u4EE3\u7801\u5757\u5B58\u5728\u4E00\u4E2A\u7F16\u8BD1\u9519\u8BEF\uFF0C\u8BF7\u6307\u51FA\u9519\u8BEF\u539F\u56E0\u5E76\u4FEE\u6B63\u5B83\u3002\n\ntry {\n    // ... some code that might throw LoginException\n} catch (LoginException e) {\n    System.out.println("Login error");\n} catch (AccountNotFoundException e) {\n    System.out.println("Account not found");\n}',
    answer: '\u9519\u8BEF\u539F\u56E0\uFF1A`AccountNotFoundException`\u662F`LoginException`\u7684\u5B50\u7C7B\u3002\u7236\u7C7B\u5F02\u5E38`LoginException`\u7684`catch`\u5757\u653E\u5728\u4E86\u5B50\u7C7B\u5F02\u5E38\u7684\u524D\u9762\uFF0C\u5BFC\u81F4\u5B50\u7C7B\u5F02\u5E38\u7684`catch`\u5757\u6C38\u8FDC\u65E0\u6CD5\u88AB\u6267\u884C\uFF08unreachable code\uFF09\uFF0C\u4ECE\u800C\u4EA7\u751F\u7F16\u8BD1\u9519\u8BEF\u3002\n\n\u4FEE\u6B63\u65B9\u6CD5\uFF1A\u5C06\u5B50\u7C7B\u5F02\u5E38\u7684`catch`\u5757\u79FB\u5230\u7236\u7C7B\u5F02\u5E38\u7684\u524D\u9762\u3002\n\ntry {\n    // ... some code\n} catch (AccountNotFoundException e) {\n    System.out.println("Account not found");\n} catch (LoginException e) {\n    System.out.println("Login error");\n}',
    score: 3.5,
    explanation: "\u6B64\u9898\u662F`catch`\u5757\u987A\u5E8F\u89C4\u5219\u7684\u5B9E\u9645\u5E94\u7528\u3002\u8003\u5BDF\u80FD\u5426\u8BC6\u522B\u51FA\u5F02\u5E38\u7C7B\u4E4B\u95F4\u7684\u7EE7\u627F\u5173\u7CFB\uFF0C\u5E76\u5E94\u7528\u6B63\u786E\u7684\u6355\u83B7\u987A\u5E8F\u3002"
  },
  {
    id: 103,
    type: "single",
    question: '\u5F53\u6267\u884C`Integer.parseInt("abc");`\u65F6\uFF0C\u4F1A\u629B\u51FA\u54EA\u79CD\u5177\u4F53\u7684\u5F02\u5E38\uFF1F',
    options: [
      "IllegalArgumentException",
      "NumberFormatException",
      "ClassCastException",
      "ArithmeticException"
    ],
    answer: "NumberFormatException",
    score: 2,
    explanation: '\u6839\u636E\u7B14\u8BB0\uFF0C`NumberFormatException`\u4E13\u95E8\u7528\u4E8E\u8868\u793A\u201C\u5C1D\u8BD5\u5C06\u4E00\u4E2A\u4E0D\u7B26\u5408\u6570\u5B57\u683C\u5F0F\u7684\u5B57\u7B26\u4E32\u8F6C\u6362\u4E3A\u6570\u5B57\u7C7B\u578B\u201D\u65F6\u53D1\u751F\u7684\u9519\u8BEF\u3002`"abc"`\u663E\u7136\u4E0D\u662F\u4E00\u4E2A\u5408\u6CD5\u7684\u6574\u6570\u683C\u5F0F\u3002'
  },
  {
    id: 104,
    type: "multiple",
    question: "\u5173\u4E8EJava\u4E2D\u7684`Error`\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u63CF\u8FF0\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u7A0B\u5E8F\u4E0D\u5E94\u8BE5\u5C1D\u8BD5\u53BB\u6355\u83B7\uFF08catch\uFF09`Error`\u3002",
      "`OutOfMemoryError`\u662F `Error`\u7684\u4E00\u4E2A\u5178\u578B\u4F8B\u5B50\u3002",
      "\u5B83\u7EE7\u627F\u81EA`Throwable`\u7C7B\u3002",
      "\u53D1\u751F`Error`\u540E\uFF0C\u7A0B\u5E8F\u901A\u5E38\u53EF\u4EE5\u81EA\u6211\u6062\u590D\u5E76\u7EE7\u7EED\u6B63\u5E38\u8FD0\u884C\u3002"
    ],
    answer: [
      "\u7A0B\u5E8F\u4E0D\u5E94\u8BE5\u5C1D\u8BD5\u53BB\u6355\u83B7\uFF08catch\uFF09`Error`\u3002",
      "`OutOfMemoryError`\u662F `Error`\u7684\u4E00\u4E2A\u5178\u578B\u4F8B\u5B50\u3002",
      "\u5B83\u7EE7\u627F\u81EA`Throwable`\u7C7B\u3002"
    ],
    score: 3.5,
    explanation: "`Error`\u8868\u793A\u7684\u662FJVM\u7EA7\u522B\u7684\u3001\u707E\u96BE\u6027\u7684\u5931\u8D25\uFF0C\u5E94\u7528\u7A0B\u5E8F\u5BF9\u6B64\u65E0\u80FD\u4E3A\u529B\uFF0C\u5C1D\u8BD5\u6062\u590D\u51E0\u4E4E\u662F\u4E0D\u53EF\u80FD\u7684\uFF0C\u6240\u4EE5\u4E0D\u5E94\u8BE5\u6355\u83B7\u3002\u5B83\u548C`Exception`\u4E00\u6837\uFF0C\u90FD\u662F`Throwable`\u7684\u5B50\u7C7B\u3002"
  },
  {
    id: 105,
    type: "short_answer",
    question: "\u5728Java\u4E2D\uFF0C`try`\u3001`catch`\u3001`finally`\u8FD9\u4E09\u4E2A\u5173\u952E\u5B57\u6709\u54EA\u4E9B\u5408\u6CD5\u7684\u7EC4\u5408\u65B9\u5F0F\uFF1F\u8BF7\u5217\u4E3E\u81F3\u5C11\u4E09\u79CD\u3002",
    answer: "\u5408\u6CD5\u7684\u7EC4\u5408\u65B9\u5F0F\u6709\uFF1A\n1. `try-catch`\uFF1A\u7528\u4E8E\u6355\u83B7\u5E76\u5904\u7406\u5F02\u5E38\uFF0C\u53EF\u4EE5\u6709\u591A\u4E2A`catch`\u5757\u3002\n2. `try-finally`\uFF1A\u4E0D\u6355\u83B7\u5F02\u5E38\uFF0C\u4F46\u4FDD\u8BC1`finally`\u5757\u4E2D\u7684\u8D44\u6E90\u6E05\u7406\u4EE3\u7801\u603B\u80FD\u6267\u884C\u3002\u5982\u679C`try`\u4E2D\u53D1\u751F\u5F02\u5E38\uFF0C\u5F02\u5E38\u4F1A\u7EE7\u7EED\u5411\u4E0A\u629B\u51FA\u3002\n3. `try-catch-finally`\uFF1A\u6700\u5B8C\u6574\u7684\u5F62\u5F0F\uFF0C\u65E2\u6355\u83B7\u5904\u7406\u5F02\u5E38\uFF0C\u53C8\u4FDD\u8BC1\u8D44\u6E90\u80FD\u591F\u88AB\u6E05\u7406\u3002\n\n\u6CE8\u610F\uFF1A`try`\u5757\u5FC5\u987B\u5B58\u5728\uFF0C`catch`\u548C`finally`\u81F3\u5C11\u9700\u8981\u51FA\u73B0\u4E00\u4E2A\u3002`catch`\u548C`finally`\u4E0D\u80FD\u5355\u72EC\u4F7F\u7528\u3002",
    score: 3,
    explanation: "\u8003\u5BDF\u5BF9\u5F02\u5E38\u5904\u7406\u8BED\u6CD5\u7ED3\u6784\u7684\u719F\u7EC3\u638C\u63E1\u3002\u7406\u89E3`try-finally`\u8FD9\u79CD\u7EC4\u5408\u5728\u9700\u8981\u4F20\u9012\u5F02\u5E38\u4F46\u53C8\u5FC5\u987B\u6E05\u7406\u8D44\u6E90\u7684\u573A\u666F\u4E0B\u975E\u5E38\u6709\u7528\u3002"
  },
  {
    id: 106,
    type: "short_answer",
    question: "\u8BF7\u6839\u636E\u7B14\u8BB0\uFF0C\u7B80\u8FF0\u8FDB\u7A0B\uFF08Process\uFF09\u4E0E\u7EBF\u7A0B\uFF08Thread\uFF09\u6700\u6838\u5FC3\u7684\u533A\u522B\u3002",
    answer: "\u6700\u6838\u5FC3\u7684\u533A\u522B\u5728\u4E8E\u8D44\u6E90\u5206\u914D\u548C\u72EC\u7ACB\u6027\u3002\u8FDB\u7A0B\u662F\u64CD\u4F5C\u7CFB\u7EDF\u8D44\u6E90\u5206\u914D\u7684\u57FA\u672C\u5355\u4F4D\uFF0C\u62E5\u6709\u81EA\u5DF1\u72EC\u7ACB\u7684\u5185\u5B58\u7A7A\u95F4\uFF0C\u8D44\u6E90\u76F8\u4E92\u9694\u79BB\u3002\u800C\u7EBF\u7A0B\u662FCPU\u8C03\u5EA6\u7684\u57FA\u672C\u5355\u4F4D\uFF0C\u662F\u8FDB\u7A0B\u7684\u4E00\u4E2A\u6267\u884C\u5355\u5143\uFF0C\u540C\u4E00\u8FDB\u7A0B\u5185\u7684\u6240\u6709\u7EBF\u7A0B\u5171\u4EAB\u8BE5\u8FDB\u7A0B\u7684\u5185\u5B58\u7A7A\u95F4\u548C\u8D44\u6E90\u3002",
    score: 3,
    explanation: "\u8FD9\u662F\u5E76\u53D1\u7F16\u7A0B\u7684\u57FA\u77F3\u6982\u5FF5\u3002\u7406\u89E3\u8FDB\u7A0B\u662F\u201C\u8D44\u6E90\u5BB9\u5668\u201D\u800C\u7EBF\u7A0B\u662F\u201C\u6267\u884C\u8DEF\u5F84\u201D\uFF0C\u662F\u7406\u89E3\u540E\u7EED\u6240\u6709\u5E76\u53D1\u95EE\u9898\u7684\u57FA\u7840\u3002"
  },
  {
    id: 107,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\u4E2D\u7684\u5BF9\u6BD4\uFF0C\u4E3A\u4EC0\u4E48\u5728Java\u4E2D\u5B9E\u73B0`Runnable`\u63A5\u53E3\u901A\u5E38\u88AB\u8BA4\u4E3A\u662F\u6BD4\u7EE7\u627F`Thread`\u7C7B\u66F4\u597D\u7684\u521B\u5EFA\u7EBF\u7A0B\u7684\u65B9\u5F0F\uFF1F",
    options: [
      "\u56E0\u4E3A`Runnable`\u63A5\u53E3\u7684`run()`\u65B9\u6CD5\u53EF\u4EE5\u6709\u8FD4\u56DE\u503C\u3002",
      "\u56E0\u4E3A`Runnable`\u7684\u5199\u6CD5\u66F4\u7B80\u5355\u3002",
      "\u56E0\u4E3A\u5B83\u5C06\u4EFB\u52A1\uFF08\u4E1A\u52A1\u903B\u8F91\uFF09\u4E0E\u7EBF\u7A0B\uFF08\u6267\u884C\u673A\u5236\uFF09\u89E3\u8026\uFF0C\u907F\u514D\u4E86Java\u5355\u7EE7\u627F\u7684\u9650\u5236\uFF0C\u5E76\u4E14\u66F4\u4FBF\u4E8E\u591A\u4E2A\u7EBF\u7A0B\u5171\u4EAB\u540C\u4E00\u4EFD\u8D44\u6E90\u3002",
      "\u56E0\u4E3A\u901A\u8FC7`Runnable`\u521B\u5EFA\u7684\u7EBF\u7A0B\u6709\u66F4\u9AD8\u7684\u4F18\u5148\u7EA7\u3002"
    ],
    answer: "\u56E0\u4E3A\u5B83\u5C06\u4EFB\u52A1\uFF08\u4E1A\u52A1\u903B\u8F91\uFF09\u4E0E\u7EBF\u7A0B\uFF08\u6267\u884C\u673A\u5236\uFF09\u89E3\u8026\uFF0C\u907F\u514D\u4E86Java\u5355\u7EE7\u627F\u7684\u9650\u5236\uFF0C\u5E76\u4E14\u66F4\u4FBF\u4E8E\u591A\u4E2A\u7EBF\u7A0B\u5171\u4EAB\u540C\u4E00\u4EFD\u8D44\u6E90\u3002",
    score: 3.5,
    explanation: "\u8FD9\u4E2A\u95EE\u9898\u8003\u5BDF\u4E86\u5BF9\u4E24\u79CD\u7EBF\u7A0B\u521B\u5EFA\u65B9\u5F0F\u4F18\u52A3\u7684\u6DF1\u523B\u7406\u89E3\uFF0C\u8FD9\u4E0D\u4EC5\u4EC5\u662F\u8BED\u6CD5\u95EE\u9898\uFF0C\u66F4\u662F\u8F6F\u4EF6\u8BBE\u8BA1\u539F\u5219\uFF08\u5982\u5355\u4E00\u804C\u8D23\u3001\u89E3\u8026\uFF09\u7684\u4F53\u73B0\u3002"
  },
  {
    id: 108,
    type: "short_answer",
    question: "\u5982\u679C\u521B\u5EFA\u4E86\u4E00\u4E2A`Thread`\u5B50\u7C7B\u7684\u5B9E\u4F8B`t1`\uFF0C\u7136\u540E\u76F4\u63A5\u8C03\u7528`t1.run()`\u65B9\u6CD5\u800C\u4E0D\u662F`t1.start()`\u65B9\u6CD5\uFF0C\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F\u8FD9\u4E0E\u771F\u6B63\u7684\u591A\u7EBF\u7A0B\u6709\u4F55\u533A\u522B\uFF1F",
    answer: "\u5982\u679C\u76F4\u63A5\u8C03\u7528`t1.run()`\uFF0C\u5E76\u4E0D\u4F1A\u542F\u52A8\u4E00\u4E2A\u65B0\u7684\u7EBF\u7A0B\u3002`run()`\u65B9\u6CD5\u4F1A\u50CF\u4E00\u4E2A\u666E\u901A\u7684\u6210\u5458\u65B9\u6CD5\u4E00\u6837\uFF0C\u5728\u5F53\u524D\u7EBF\u7A0B\uFF08\u4F8B\u5982`main`\u7EBF\u7A0B\uFF09\u4E2D\u88AB\u540C\u6B65\u6267\u884C\u3002\u8FD9\u4E0E\u771F\u6B63\u7684\u591A\u7EBF\u7A0B\u6709\u672C\u8D28\u533A\u522B\uFF1A`start()`\u65B9\u6CD5\u4F1A\u5411JVM\u8BF7\u6C42\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u7EBF\u7A0B\uFF0C\u5E76\u7531\u65B0\u7EBF\u7A0B\u6765\u5F02\u6B65\u6267\u884C`run()`\u65B9\u6CD5\u4E2D\u7684\u4EE3\u7801\uFF0C\u4ECE\u800C\u5B9E\u73B0\u5E76\u53D1\uFF1B\u800C\u76F4\u63A5\u8C03\u7528`run()`\u53EA\u662F\u4E00\u4E2A\u666E\u901A\u7684\u65B9\u6CD5\u8C03\u7528\uFF0C\u6574\u4E2A\u8FC7\u7A0B\u4ECD\u7136\u662F\u5355\u7EBF\u7A0B\u7684\u4E32\u884C\u6267\u884C\u3002",
    score: 4,
    explanation: "\u8FD9\u662F\u521D\u5B66\u8005\u5E38\u72AF\u7684\u9519\u8BEF\uFF0C\u4E5F\u662F\u4E00\u4E2A\u7ECF\u5178\u7684\u9762\u8BD5\u9898\u3002\u5B83\u6DF1\u523B\u5730\u8003\u5BDF\u4E86\u5BF9\u7EBF\u7A0B\u542F\u52A8\u673A\u5236\u7684\u7406\u89E3\u3002`start()`\u662F\u542F\u52A8\u65B0\u7EBF\u7A0B\u7684\u5165\u53E3\uFF0C\u800C`run()`\u53EA\u662F\u65B0\u7EBF\u7A0B\u8981\u6267\u884C\u7684\u4EFB\u52A1\u4F53\u3002"
  },
  {
    id: 109,
    type: "single",
    question: "\u5F53\u4E00\u4E2A`Thread`\u5BF9\u8C61\u88AB\u521B\u5EFA\uFF0C\u4F46\u5728`start()`\u65B9\u6CD5\u88AB\u8C03\u7528\u4E4B\u524D\uFF0C\u8BE5\u7EBF\u7A0B\u5904\u4E8E\u751F\u547D\u5468\u671F\u4E2D\u7684\u54EA\u4E2A\u72B6\u6001\uFF1F",
    options: ["RUNNABLE", "NEW", "BLOCKED", "TERMINATED"],
    answer: "NEW",
    score: 2,
    explanation: "\u6839\u636E\u7B14\u8BB0\u4E2D\u7684\u7EBF\u7A0B\u751F\u547D\u5468\u671F\u5B9A\u4E49\uFF0C`new Thread()`\u4E4B\u540E\uFF0C\u7EBF\u7A0B\u5BF9\u8C61\u5C31\u5DF2\u521B\u5EFA\uFF0C\u4F46\u5B83\u53EA\u662F\u4E00\u4E2A\u666E\u901A\u7684Java\u5BF9\u8C61\uFF0C\u5C1A\u672A\u4E0E\u64CD\u4F5C\u7CFB\u7EDF\u7EBF\u7A0B\u5173\u8054\uFF0C\u6B64\u65F6\u5904\u4E8E\u201C\u65B0\u5EFA (NEW)\u201D\u72B6\u6001\u3002"
  },
  {
    id: 110,
    type: "multiple",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0C\u7EBF\u7A0B\u5B89\u5168\u95EE\u9898\u7684\u53D1\u751F\u9700\u8981\u6EE1\u8DB3\u54EA\u4E9B\u6838\u5FC3\u6761\u4EF6\uFF1F",
    options: [
      "\u5B58\u5728\u591A\u4E2A\u7EBF\u7A0B\u5E76\u53D1\u6267\u884C\u3002",
      "\u5B58\u5728\u88AB\u591A\u4E2A\u7EBF\u7A0B\u5171\u4EAB\u7684\u6570\u636E\uFF08\u5171\u4EAB\u8D44\u6E90\uFF09\u3002",
      "\u81F3\u5C11\u6709\u4E00\u4E2A\u7EBF\u7A0B\u5BF9\u5171\u4EAB\u6570\u636E\u6267\u884C\u4E86\u975E\u539F\u5B50\u6027\u7684\u4FEE\u6539\u64CD\u4F5C\u3002",
      "\u6240\u6709\u7EBF\u7A0B\u90FD\u5FC5\u987B\u5904\u4E8E`RUNNABLE`\u72B6\u6001\u3002"
    ],
    answer: [
      "\u5B58\u5728\u591A\u4E2A\u7EBF\u7A0B\u5E76\u53D1\u6267\u884C\u3002",
      "\u5B58\u5728\u88AB\u591A\u4E2A\u7EBF\u7A0B\u5171\u4EAB\u7684\u6570\u636E\uFF08\u5171\u4EAB\u8D44\u6E90\uFF09\u3002",
      "\u81F3\u5C11\u6709\u4E00\u4E2A\u7EBF\u7A0B\u5BF9\u5171\u4EAB\u6570\u636E\u6267\u884C\u4E86\u975E\u539F\u5B50\u6027\u7684\u4FEE\u6539\u64CD\u4F5C\u3002"
    ],
    score: 4,
    explanation: "\u8FD9\u4E09\u4E2A\u9009\u9879\u662F\u6784\u6210\u7EBF\u7A0B\u5B89\u5168\u95EE\u9898\uFF08\u6570\u636E\u7ADE\u4E89\uFF09\u7684\u201C\u4E09\u8981\u7D20\u201D\uFF0C\u7F3A\u4E00\u4E0D\u53EF\u3002\u7406\u89E3\u8FD9\u4E09\u4E2A\u6838\u5FC3\u8BF1\u56E0\u662F\u5206\u6790\u548C\u89E3\u51B3\u6240\u6709\u7EBF\u7A0B\u5B89\u5168\u95EE\u9898\u7684\u524D\u63D0\u3002"
  },
  {
    id: 111,
    type: "multiple",
    question: "\u5173\u4E8E`Object.wait()`\u548C`Thread.sleep()`\u7684\u6DF1\u5EA6\u8FA8\u6790\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u8BF4\u6CD5\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "`wait()`\u4F1A\u91CA\u653E\u7EBF\u7A0B\u6301\u6709\u7684\u5BF9\u8C61\u9501\uFF0C\u800C`sleep()`\u4E0D\u4F1A\u91CA\u653E\u9501\u3002",
      "`wait()`\u5FC5\u987B\u5728`synchronized`\u4EE3\u7801\u5757\u6216\u65B9\u6CD5\u4E2D\u4F7F\u7528\uFF0C\u800C`sleep()`\u6CA1\u6709\u8FD9\u4E2A\u9650\u5236\u3002",
      "`wait()`\u9700\u8981\u88AB\u5176\u4ED6\u7EBF\u7A0B\u901A\u8FC7`notify()`\u6216`notifyAll()`\u5524\u9192\uFF0C\u800C`sleep()`\u5728\u6307\u5B9A\u65F6\u95F4\u540E\u4F1A\u81EA\u52A8\u5524\u9192\u3002",
      "`wait()`\u5C5E\u4E8E`Object`\u7C7B\u7684\u65B9\u6CD5\uFF0C\u800C`sleep()`\u662F`Thread`\u7C7B\u7684\u9759\u6001\u65B9\u6CD5\u3002"
    ],
    answer: [
      "`wait()`\u4F1A\u91CA\u653E\u7EBF\u7A0B\u6301\u6709\u7684\u5BF9\u8C61\u9501\uFF0C\u800C`sleep()`\u4E0D\u4F1A\u91CA\u653E\u9501\u3002",
      "`wait()`\u5FC5\u987B\u5728`synchronized`\u4EE3\u7801\u5757\u6216\u65B9\u6CD5\u4E2D\u4F7F\u7528\uFF0C\u800C`sleep()`\u6CA1\u6709\u8FD9\u4E2A\u9650\u5236\u3002",
      "`wait()`\u9700\u8981\u88AB\u5176\u4ED6\u7EBF\u7A0B\u901A\u8FC7`notify()`\u6216`notifyAll()`\u5524\u9192\uFF0C\u800C`sleep()`\u5728\u6307\u5B9A\u65F6\u95F4\u540E\u4F1A\u81EA\u52A8\u5524\u9192\u3002",
      "`wait()`\u5C5E\u4E8E`Object`\u7C7B\u7684\u65B9\u6CD5\uFF0C\u800C`sleep()`\u662F`Thread`\u7C7B\u7684\u9759\u6001\u65B9\u6CD5\u3002"
    ],
    score: 5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u6781\u5176\u91CD\u8981\u7684\u9762\u8BD5\u9AD8\u9891\u9898\uFF0C\u5168\u9762\u8003\u5BDF\u4E86`wait()`\u548C`sleep()`\u5728\u9501\u91CA\u653E\u3001\u4F7F\u7528\u73AF\u5883\u3001\u5524\u9192\u65B9\u5F0F\u548C\u6240\u5C5E\u7C7B\u8FD9\u56DB\u4E2A\u6838\u5FC3\u7EF4\u5EA6\u7684\u533A\u522B\u3002\u638C\u63E1\u8FD9\u4E9B\u533A\u522B\u662F\u7406\u89E3Java\u7EBF\u7A0B\u534F\u4F5C\u4E0E\u6682\u505C\u673A\u5236\u7684\u5173\u952E\u3002"
  },
  {
    id: 112,
    type: "short_answer",
    question: "\u4E3A\u4EC0\u4E48\u5728\u73B0\u4EE3\u5E76\u53D1\u7F16\u7A0B\u5B9E\u8DF5\u4E2D\uFF0C\u5F3A\u70C8\u63A8\u8350\u4F7F\u7528\u7EBF\u7A0B\u6C60\u800C\u4E0D\u662F\u624B\u52A8`new Thread()`\u6765\u7BA1\u7406\u7EBF\u7A0B\uFF1F\u8BF7\u81F3\u5C11\u8BF4\u51FA\u4E24\u70B9\u6838\u5FC3\u4F18\u52BF\u3002",
    answer: "1. **\u964D\u4F4E\u8D44\u6E90\u6D88\u8017**\uFF1A\u901A\u8FC7\u590D\u7528\u5DF2\u5B58\u5728\u7684\u7EBF\u7A0B\uFF0C\u907F\u514D\u4E86\u9891\u7E41\u521B\u5EFA\u548C\u9500\u6BC1\u7EBF\u7A0B\u5E26\u6765\u7684\u7CFB\u7EDF\u5F00\u9500\u3002\n2. **\u63D0\u9AD8\u54CD\u5E94\u901F\u5EA6**\uFF1A\u5F53\u4EFB\u52A1\u5230\u8FBE\u65F6\uFF0C\u53EF\u4EE5\u76F4\u63A5\u4ECE\u6C60\u4E2D\u83B7\u53D6\u7EBF\u7A0B\u6267\u884C\uFF0C\u65E0\u9700\u7B49\u5F85\u7EBF\u7A0B\u521B\u5EFA\u7684\u8FC7\u7A0B\u3002\n3. **\u63D0\u9AD8\u7EBF\u7A0B\u7684\u53EF\u7BA1\u7406\u6027**\uFF1A\u7EBF\u7A0B\u6C60\u53EF\u4EE5\u7EDF\u4E00\u5BF9\u7EBF\u7A0B\u8FDB\u884C\u5206\u914D\u3001\u8C03\u4F18\u548C\u76D1\u63A7\uFF0C\u80FD\u591F\u63A7\u5236\u6700\u5927\u5E76\u53D1\u6570\uFF0C\u9632\u6B62\u56E0\u65E0\u9650\u5236\u521B\u5EFA\u7EBF\u7A0B\u800C\u8017\u5C3D\u7CFB\u7EDF\u8D44\u6E90\u5BFC\u81F4\u670D\u52A1\u5D29\u6E83\u3002\n(\u56DE\u7B54\u4EFB\u610F\u4E24\u70B9\u5373\u53EF)",
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9\u7EBF\u7A0B\u6C60\u6838\u5FC3\u4EF7\u503C\u7684\u7406\u89E3\u3002\u5728\u4F01\u4E1A\u7EA7\u5F00\u53D1\u4E2D\uFF0C\u76F4\u63A5`new Thread()`\u88AB\u8BA4\u4E3A\u662F\u4E00\u79CD\u4E0D\u89C4\u8303\u7684\u505A\u6CD5\uFF0C\u4F7F\u7528\u7EBF\u7A0B\u6C60\u662F\u5E76\u53D1\u7F16\u7A0B\u7684\u6700\u4F73\u5B9E\u8DF5\u3002"
  },
  {
    id: 113,
    type: "code",
    question: "\u8BF7\u4F7F\u7528Java 8\u7684Lambda\u8868\u8FBE\u5F0F\uFF0C\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u7EBF\u7A0B\u5E76\u542F\u52A8\u5B83\uFF0C\u8BE5\u7EBF\u7A0B\u7684\u4EFB\u52A1\u662F\u5728\u63A7\u5236\u53F0\u6253\u5370\u51FA\u201CHello from Lambda Thread!\u201D\u3002",
    answer: 'new Thread(() -> {\n    System.out.println("Hello from Lambda Thread!");\n}).start();',
    score: 3,
    explanation: "\u8003\u5BDF\u5BF9`Runnable`\u63A5\u53E3\u4F5C\u4E3A\u51FD\u6570\u5F0F\u63A5\u53E3\u7684\u7406\u89E3\uFF0C\u4EE5\u53CA\u4F7F\u7528Lambda\u8868\u8FBE\u5F0F\u7B80\u5316\u533F\u540D\u5185\u90E8\u7C7B\u7684\u73B0\u4EE3Java\u7F16\u7A0B\u98CE\u683C\u3002"
  },
  {
    id: 114,
    type: "short_answer",
    question: "\u5728\u4E00\u4E2A\u7EBF\u7A0B`main`\u4E2D\u8C03\u7528\u53E6\u4E00\u4E2A\u7EBF\u7A0B`t1`\u7684`t1.join()`\u65B9\u6CD5\uFF0C\u5176\u786E\u5207\u542B\u4E49\u662F\u4EC0\u4E48\uFF1F\u54EA\u4E2A\u7EBF\u7A0B\u4F1A\u8FDB\u5165\u7B49\u5F85\u72B6\u6001\uFF1F",
    answer: "\u5176\u786E\u5207\u542B\u4E49\u662F\uFF0C\u8BA9**\u5F53\u524D\u6B63\u5728\u6267\u884C\u7684\u7EBF\u7A0B**\uFF08\u5373`main`\u7EBF\u7A0B\uFF09\u8FDB\u5165\u7B49\u5F85\u72B6\u6001\uFF0C\u76F4\u5230`t1`\u8FD9\u4E2A**\u76EE\u6807\u7EBF\u7A0B**\u6267\u884C\u5B8C\u6BD5\uFF08\u8FDB\u5165`TERMINATED`\u72B6\u6001\uFF09\u3002\u7B80\u5355\u6765\u8BF4\uFF0C\u5C31\u662F`main`\u7EBF\u7A0B\u6682\u505C\u4E0B\u6765\uFF0C\u7B49\u5F85`t1`\u7EBF\u7A0B\u5E72\u5B8C\u6D3B\u513F\u518D\u7EE7\u7EED\u5F80\u4E0B\u6267\u884C\u3002",
    score: 4,
    explanation: "`join()`\u7684\u8C03\u7528\u4E3B\u4F53\u548C\u4F5C\u7528\u5BF9\u8C61\u5E38\u5E38\u88AB\u6DF7\u6DC6\u3002\u6B64\u9898\u7CBE\u786E\u8003\u5BDF\u4E86\u5F00\u53D1\u8005\u662F\u5426\u6E05\u6670\u5730\u77E5\u9053\u662F\u8C01\u5728\u7B49\u5F85\u8C01\uFF0C\u8FD9\u662F\u5B9E\u73B0\u7EBF\u7A0B\u4E32\u884C\u6267\u884C\u7684\u5173\u952E\u3002"
  },
  {
    id: 115,
    type: "single",
    question: "`wait()`\u548C`sleep()`\u5728\u5BF9\u5F85\u201C\u9501\u201D\u7684\u95EE\u9898\u4E0A\uFF0C\u6700\u672C\u8D28\u7684\u533A\u522B\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "`sleep()`\u9700\u8981\u9501\uFF0C`wait()`\u4E0D\u9700\u8981\u3002",
      "`wait()`\u548C`sleep()`\u90FD\u4F1A\u91CA\u653E\u9501\u3002",
      "`sleep()`\u4F1A\u6301\u6709\u9501\u8FDB\u5165\u4F11\u7720\uFF0C\u800C`wait()`\u4F1A\u91CA\u653E\u9501\u8FDB\u5165\u7B49\u5F85\u961F\u5217\u3002",
      "`wait()`\u4F1A\u91CA\u653E\u6240\u6709\u9501\uFF0C`sleep()`\u53EA\u91CA\u653E\u90E8\u5206\u9501\u3002"
    ],
    answer: "`sleep()`\u4F1A\u6301\u6709\u9501\u8FDB\u5165\u4F11\u7720\uFF0C\u800C`wait()`\u4F1A\u91CA\u653E\u9501\u8FDB\u5165\u7B49\u5F85\u961F\u5217\u3002",
    score: 3.5,
    explanation: "\u91CA\u653E\u9501\u662F`wait()`\u65B9\u6CD5\u7684\u6838\u5FC3\u673A\u5236\uFF0C\u8FD9\u4F7F\u5F97\u5176\u4ED6\u7EBF\u7A0B\u6709\u673A\u4F1A\u83B7\u5F97\u9501\u5E76\u6267\u884C\uFF0C\u4ECE\u800C\u6539\u53D8\u6761\u4EF6\u5E76\u6700\u7EC8\u5524\u9192\u7B49\u5F85\u7684\u7EBF\u7A0B\uFF0C\u8FD9\u662F\u5B9E\u73B0\u7EBF\u7A0B\u95F4\u901A\u4FE1\u7684\u57FA\u7840\u3002\u800C`sleep()`\u53EA\u662F\u5355\u7EAF\u5730\u8BA9\u51FACPU\u65F6\u95F4\uFF0C\u5E76\u4E0D\u5F71\u54CD\u9501\u7684\u6301\u6709\u72B6\u6001\u3002"
  },
  {
    id: 116,
    type: "single",
    question: "\u4E00\u4E2A\u7EBF\u7A0B\u5728\u5C1D\u8BD5\u8FDB\u5165\u4E00\u4E2A\u88AB\u5176\u4ED6\u7EBF\u7A0B\u6301\u6709\u7684`synchronized`\u4EE3\u7801\u5757\u65F6\uFF0C\u4F1A\u8FDB\u5165\u751F\u547D\u5468\u671F\u4E2D\u7684\u54EA\u4E2A\u72B6\u6001\uFF1F",
    options: ["RUNNABLE", "WAITING", "BLOCKED", "TIMED_WAITING"],
    answer: "BLOCKED",
    score: 3,
    explanation: "\u6839\u636E\u7B14\u8BB0\uFF0C`BLOCKED`\uFF08\u963B\u585E\uFF09\u72B6\u6001\u4E13\u95E8\u7528\u4E8E\u63CF\u8FF0\u7EBF\u7A0B\u56E0\u7B49\u5F85\u83B7\u53D6`synchronized`\u7684\u76D1\u89C6\u5668\u9501\uFF08monitor lock\uFF09\u800C\u88AB\u6302\u8D77\u7684\u60C5\u51B5\u3002"
  },
  {
    id: 117,
    type: "single",
    question: "\u5982\u679C\u4F60\u9700\u8981\u4E00\u4E2A\u80FD\u4FDD\u8BC1\u6240\u6709\u4EFB\u52A1\u90FD\u6309\u7167\u63D0\u4EA4\u987A\u5E8F\uFF0C\u4E00\u4E2A\u63A5\u4E00\u4E2A\u5730\u4E32\u884C\u6267\u884C\u7684\u7EBF\u7A0B\u6C60\uFF0C\u5E94\u8BE5\u4F7F\u7528`Executors`\u7684\u54EA\u4E2A\u5DE5\u5382\u65B9\u6CD5\u6765\u521B\u5EFA\uFF1F",
    options: [
      "newFixedThreadPool(1)",
      "newCachedThreadPool()",
      "newSingleThreadExecutor()",
      "newScheduledThreadPool(1)"
    ],
    answer: "newSingleThreadExecutor()",
    score: 3,
    explanation: "`newSingleThreadExecutor()`\u662F\u4E13\u95E8\u4E3A\u6B64\u573A\u666F\u8BBE\u8BA1\u7684\uFF0C\u5B83\u5185\u90E8\u53EA\u6709\u4E00\u4E2A\u5DE5\u4F5C\u7EBF\u7A0B\uFF0C\u5E76\u4F7F\u7528\u4E00\u4E2A\u65E0\u754C\u961F\u5217\u6765\u5B58\u50A8\u4EFB\u52A1\uFF0C\u786E\u4FDD\u4E86\u4EFB\u52A1\u7684FIFO\u987A\u5E8F\u6267\u884C\u3002\u867D\u7136`newFixedThreadPool(1)`\u6548\u679C\u7C7B\u4F3C\uFF0C\u4F46`newSingleThreadExecutor`\u5728\u8BED\u4E49\u4E0A\u66F4\u6E05\u6670\uFF0C\u5E76\u4E14\u80FD\u4FDD\u8BC1\u5176\u5185\u90E8\u7684`ExecutorService`\u4E0D\u4F1A\u88AB\u91CD\u65B0\u914D\u7F6E\u4EE5\u4F7F\u7528\u66F4\u591A\u7EBF\u7A0B\u3002"
  },
  {
    id: 118,
    type: "code",
    question: "\u8BF7\u8865\u5168\u4EE5\u4E0B\u4EE3\u7801\uFF0C\u521B\u5EFA\u4E00\u4E2A\u56FA\u5B9A\u5927\u5C0F\u4E3A5\u7684\u7EBF\u7A0B\u6C60\uFF0C\u5E76\u5411\u5176\u63D0\u4EA4\u4E00\u4E2A\u6253\u5370\u5F53\u524D\u7EBF\u7A0B\u540D\u7684\u4EFB\u52A1\u3002",
    answer: 'import java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\n\npublic class ThreadPoolTask {\n    public static void main(String[] args) {\n        ExecutorService executorService = Executors.newFixedThreadPool(5);\n        executorService.submit(() -> {\n            System.out.println("Task executed by: " + Thread.currentThread().getName());\n        });\n        executorService.shutdown();\n    }\n}',
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9`Executors`\u5DE5\u5382\u65B9\u6CD5\u548C`ExecutorService.submit()`\u8FD9\u4E24\u4E2A\u6838\u5FC3API\u7684\u719F\u7EC3\u4F7F\u7528\uFF0C\u8FD9\u662F\u7EBF\u7A0B\u6C60\u64CD\u4F5C\u7684\u57FA\u7840\u3002"
  },
  {
    id: 119,
    type: "multiple",
    question: "\u5173\u4E8E`Thread.sleep()`\u65B9\u6CD5\u7684\u7279\u6027\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u63CF\u8FF0\u662F\u6B63\u786E\u7684\uFF1F",
    options: [
      "\u5B83\u662F\u4E00\u4E2A\u9759\u6001\u65B9\u6CD5\uFF0C\u8C03\u7528\u65F6\u4F1A\u4F7F\u5F53\u524D\u6267\u884C\u7684\u7EBF\u7A0B\u4F11\u7720\u3002",
      "\u7EBF\u7A0B\u5728`sleep`\u671F\u95F4\uFF0C\u4E0D\u4F1A\u91CA\u653E\u5B83\u6240\u6301\u6709\u7684\u4EFB\u4F55\u5BF9\u8C61\u9501\u3002",
      "\u8C03\u7528`sleep`\u65B9\u6CD5\u5FC5\u987B\u5904\u7406`InterruptedException`\u8FD9\u4E2A\u53D7\u68C0\u5F02\u5E38\u3002",
      "\u5B83\u662F\u4E00\u4E2A\u5B9E\u4F8B\u65B9\u6CD5\uFF0C\u7528\u4E8E\u8BA9\u6307\u5B9A\u7684\u7EBF\u7A0B\u5BF9\u8C61\u4F11\u7720\u3002"
    ],
    answer: [
      "\u5B83\u662F\u4E00\u4E2A\u9759\u6001\u65B9\u6CD5\uFF0C\u8C03\u7528\u65F6\u4F1A\u4F7F\u5F53\u524D\u6267\u884C\u7684\u7EBF\u7A0B\u4F11\u7720\u3002",
      "\u7EBF\u7A0B\u5728`sleep`\u671F\u95F4\uFF0C\u4E0D\u4F1A\u91CA\u653E\u5B83\u6240\u6301\u6709\u7684\u4EFB\u4F55\u5BF9\u8C61\u9501\u3002",
      "\u8C03\u7528`sleep`\u65B9\u6CD5\u5FC5\u987B\u5904\u7406`InterruptedException`\u8FD9\u4E2A\u53D7\u68C0\u5F02\u5E38\u3002"
    ],
    score: 4,
    explanation: "\u9759\u6001\u65B9\u6CD5\u3001\u4E0D\u91CA\u653E\u9501\u3001\u9700\u8981\u5904\u7406`InterruptedException`\u662F`Thread.sleep()`\u7684\u4E09\u4E2A\u5173\u952E\u7279\u6027\u3002\u9009\u9879D\u662F\u9519\u8BEF\u7684\uFF0C`sleep()`\u4F5C\u7528\u4E8E\u201C\u5F53\u524D\u201D\u7EBF\u7A0B\uFF0C\u800C\u4E0D\u662F\u6307\u5B9A\u7684\u67D0\u4E2A\u7EBF\u7A0B\u5BF9\u8C61\u3002"
  },
  {
    id: 120,
    type: "single",
    question: "\u5728\u9700\u8981\u591A\u4E2A\u7EBF\u7A0B\u5904\u7406\u540C\u4E00\u4EFD\u6570\u636E\uFF08\u5982\u4E00\u4E2A\u552E\u7968\u4EFB\u52A1\uFF09\u7684\u573A\u666F\u4E0B\uFF0C\u4E3A\u4F55\u4F7F\u7528`implements Runnable`\u6BD4`extends Thread`\u66F4\u5177\u4F18\u52BF\uFF1F",
    options: [
      "\u56E0\u4E3A`Runnable`\u6027\u80FD\u66F4\u9AD8\u3002",
      "\u56E0\u4E3A\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2A`Runnable`\u4EFB\u52A1\u5B9E\u4F8B\uFF0C\u5E76\u5C06\u5176\u4F20\u9012\u7ED9\u591A\u4E2A`Thread`\u5BF9\u8C61\uFF0C\u4ECE\u800C\u8BA9\u8FD9\u4E9B\u7EBF\u7A0B\u5929\u7136\u5730\u5171\u4EAB\u8BE5\u4EFB\u52A1\u5B9E\u4F8B\u4E2D\u7684\u6210\u5458\u53D8\u91CF\uFF08\u6570\u636E\uFF09\u3002",
      "\u56E0\u4E3A`Thread`\u7C7B\u4E0D\u652F\u6301\u6210\u5458\u53D8\u91CF\u3002",
      "\u56E0\u4E3A`Runnable`\u53EF\u4EE5\u907F\u514D\u7EBF\u7A0B\u5B89\u5168\u95EE\u9898\u3002"
    ],
    answer: "\u56E0\u4E3A\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2A`Runnable`\u4EFB\u52A1\u5B9E\u4F8B\uFF0C\u5E76\u5C06\u5176\u4F20\u9012\u7ED9\u591A\u4E2A`Thread`\u5BF9\u8C61\uFF0C\u4ECE\u800C\u8BA9\u8FD9\u4E9B\u7EBF\u7A0B\u5929\u7136\u5730\u5171\u4EAB\u8BE5\u4EFB\u52A1\u5B9E\u4F8B\u4E2D\u7684\u6210\u5458\u53D8\u91CF\uFF08\u6570\u636E\uFF09\u3002",
    score: 3.5,
    explanation: "\u8FD9\u76F4\u51FB\u4E86\u8D44\u6E90\u5171\u4EAB\u95EE\u9898\u7684\u6838\u5FC3\u3002\u901A\u8FC7`Runnable`\uFF0C\u6570\u636E\u548C\u4EFB\u52A1\u903B\u8F91\u5C01\u88C5\u5728\u4E00\u8D77\uFF0C\u6267\u884C\u4EFB\u52A1\u7684\u7EBF\u7A0B\u53EF\u4EE5\u5206\u5F00\u521B\u5EFA\uFF0C\u8F7B\u677E\u5B9E\u73B0\u201C\u591A\u4E2A\u6267\u884C\u8005\uFF0C\u4E00\u4E2A\u4EFB\u52A1\u8D44\u6E90\u201D\u7684\u6A21\u5F0F\u3002"
  },
  {
    id: 121,
    type: "multiple",
    question: "\u4E00\u4E2A\u7EBF\u7A0B\u5728\u6267\u884C\u4E86\u4EE5\u4E0B\u54EA\u4E9B\u65B9\u6CD5\u540E\uFF0C\u4F1A\u8FDB\u5165`TIMED_WAITING`\uFF08\u8BA1\u65F6\u7B49\u5F85\uFF09\u72B6\u6001\uFF1F",
    options: [
      "`Thread.sleep(500)`",
      "`object.wait(500)`",
      "`t.join(500)`",
      "`LockSupport.park()`"
    ],
    answer: ["`Thread.sleep(500)`", "`object.wait(500)`", "`t.join(500)`"],
    score: 3.5,
    explanation: "\u5E26\u6709\u8D85\u65F6\u53C2\u6570\u7684\u7B49\u5F85\u65B9\u6CD5\uFF08\u5982`sleep`, `wait(long)`, `join(long)`\uFF09\u90FD\u4F1A\u4F7F\u7EBF\u7A0B\u8FDB\u5165`TIMED_WAITING`\u72B6\u6001\u3002\u800C\u6CA1\u6709\u53C2\u6570\u7684`wait()`\u3001`join()`\u4EE5\u53CA`LockSupport.park()`\u4F1A\u4F7F\u7EBF\u7A0B\u8FDB\u5165\u65E0\u9650\u671F\u7684`WAITING`\u72B6\u6001\u3002"
  },
  {
    id: 122,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0C\u5F15\u5165\u591A\u7EBF\u7A0B\u6280\u672F\u7684\u6838\u5FC3\u76EE\u7684\u548C\u4EF7\u503C\u5728\u4E8E\u4EC0\u4E48\uFF1F",
    options: [
      "\u7B80\u5316\u4EE3\u7801\u903B\u8F91\u3002",
      "\u63D0\u9AD8\u7A0B\u5E8F\u7684\u5B89\u5168\u6027\u3002",
      "\u63D0\u9AD8CPU\u7684\u5229\u7528\u7387\uFF0C\u4ECE\u800C\u63D0\u5347\u7A0B\u5E8F\u6574\u4F53\u7684\u6267\u884C\u6548\u7387\u3002",
      "\u51CF\u5C11\u5185\u5B58\u7684\u4F7F\u7528\u3002"
    ],
    answer: "\u63D0\u9AD8CPU\u7684\u5229\u7528\u7387\uFF0C\u4ECE\u800C\u63D0\u5347\u7A0B\u5E8F\u6574\u4F53\u7684\u6267\u884C\u6548\u7387\u3002",
    score: 2.5,
    explanation: "\u7B14\u8BB0\u4E2D\u660E\u786E\u6307\u51FA\uFF0C\u591A\u7EBF\u7A0B\u7684\u6838\u5FC3\u4EF7\u503C\u5728\u4E8E\uFF0C\u5F53\u67D0\u4E2A\u7EBF\u7A0B\u56E0I/O\u7B49\u539F\u56E0\u963B\u585E\u65F6\uFF0CCPU\u53EF\u4EE5\u5207\u6362\u5230\u5176\u4ED6\u7EBF\u7A0B\uFF0C\u907F\u514D\u7A7A\u95F2\uFF0C\u4ECE\u800C\u538B\u69A8CPU\u7684\u6027\u80FD\uFF0C\u63D0\u5347\u6574\u4E2A\u5E94\u7528\u7684\u541E\u5410\u91CF\u3002"
  },
  {
    id: 123,
    type: "short_answer",
    question: "\u5728\u4F7F\u7528\u4E86\u7EBF\u7A0B\u6C60`ExecutorService`\u540E\uFF0C\u4E3A\u4EC0\u4E48\u901A\u5E38\u5EFA\u8BAE\u5728\u7A0B\u5E8F\u9000\u51FA\u524D\u8C03\u7528`shutdown()`\u65B9\u6CD5\uFF1F\u5B83\u548C`shutdownNow()`\u6709\u4EC0\u4E48\u4E3B\u8981\u533A\u522B\uFF1F",
    answer: "\u8C03\u7528`shutdown()`\u662F\u4E3A\u4E86\u5E73\u6ED1\u5730\u5173\u95ED\u7EBF\u7A0B\u6C60\u3002\u5B83\u4F1A\u963B\u6B62\u7EBF\u7A0B\u6C60\u63A5\u53D7\u4EFB\u4F55\u65B0\u7684\u4EFB\u52A1\uFF0C\u4F46\u4F1A\u7B49\u5F85\u5DF2\u7ECF\u63D0\u4EA4\u5230\u961F\u5217\u4E2D\u7684\u6240\u6709\u4EFB\u52A1\u6267\u884C\u5B8C\u6BD5\u540E\uFF0C\u518D\u5173\u95ED\u7EBF\u7A0B\u6C60\u5E76\u91CA\u653E\u8D44\u6E90\u3002\n\u4E3B\u8981\u533A\u522B\uFF1A\n- `shutdown()`\uFF1A\u6E29\u548C\u5173\u95ED\u3002\u4E0D\u63A5\u53D7\u65B0\u4EFB\u52A1\uFF0C\u4F46\u4F1A\u6267\u884C\u5B8C\u5DF2\u6709\u7684\u4EFB\u52A1\u3002\n- `shutdownNow()`\uFF1A\u7ACB\u5373\u5173\u95ED\u3002\u5C1D\u8BD5\u4E2D\u65AD\u6240\u6709\u6B63\u5728\u6267\u884C\u7684\u7EBF\u7A0B\uFF0C\u5E76\u8FD4\u56DE\u961F\u5217\u4E2D\u5C1A\u672A\u5F00\u59CB\u6267\u884C\u7684\u4EFB\u52A1\u5217\u8868\uFF0C\u4E0D\u4F1A\u7B49\u5F85\u4EFB\u52A1\u5B8C\u6210\u3002",
    score: 4,
    explanation: "\u8003\u5BDF\u7EBF\u7A0B\u6C60\u7684\u6B63\u786E\u5173\u95ED\u65B9\u5F0F\u3002\u4E0D\u5173\u95ED\u7EBF\u7A0B\u6C60\u4F1A\u5BFC\u81F4JVM\u65E0\u6CD5\u6B63\u5E38\u9000\u51FA\uFF0C\u56E0\u4E3A\u5DE5\u4F5C\u7EBF\u7A0B\u4ECD\u7136\u5B58\u6D3B\u3002\u7406\u89E3\u4E24\u79CD\u5173\u95ED\u65B9\u5F0F\u7684\u533A\u522B\u5BF9\u4E8E\u7F16\u5199\u5065\u58EE\u7684\u5E76\u53D1\u7A0B\u5E8F\u5F88\u91CD\u8981\u3002"
  },
  {
    id: 124,
    type: "single",
    question: "`Object.wait()`\u65B9\u6CD5\u5FC5\u987B\u5728\u4EC0\u4E48\u8BED\u5883\u4E0B\u8C03\u7528\uFF0C\u5426\u5219\u4F1A\u629B\u51FA`IllegalMonitorStateException`\uFF1F",
    options: [
      "\u4EFB\u4F55`try-catch`\u5757\u4E2D",
      "`synchronized`\u540C\u6B65\u4EE3\u7801\u5757\u6216\u540C\u6B65\u65B9\u6CD5\u4E2D",
      "\u4EFB\u4F55\u9759\u6001\u65B9\u6CD5\u4E2D",
      "\u5B9E\u73B0\u4E86`Runnable`\u63A5\u53E3\u7684\u7C7B\u7684`run`\u65B9\u6CD5\u4E2D"
    ],
    answer: "`synchronized`\u540C\u6B65\u4EE3\u7801\u5757\u6216\u540C\u6B65\u65B9\u6CD5\u4E2D",
    score: 3,
    explanation: "\u8C03\u7528`wait()`\u3001`notify()`\u3001`notifyAll()`\u7684\u524D\u63D0\u662F\u5F53\u524D\u7EBF\u7A0B\u5FC5\u987B\u6301\u6709\u8BE5\u5BF9\u8C61\u7684\u76D1\u89C6\u5668\u9501\uFF08monitor lock\uFF09\u3002`synchronized`\u5173\u952E\u5B57\u662F\u83B7\u53D6\u8FD9\u4E2A\u9501\u7684\u552F\u4E00\u65B9\u5F0F\uFF0C\u56E0\u6B64\u8FD9\u4E9B\u65B9\u6CD5\u5FC5\u987B\u5728\u540C\u6B65\u5757/\u65B9\u6CD5\u4E2D\u4F7F\u7528\u3002"
  },
  {
    id: 125,
    type: "single",
    question: "`Executors.newCachedThreadPool()`\u521B\u5EFA\u7684\u7EBF\u7A0B\u6C60\u6709\u4EC0\u4E48\u6837\u7684\u6838\u5FC3\u7279\u70B9\uFF1F",
    options: [
      "\u7EBF\u7A0B\u6570\u91CF\u56FA\u5B9A\uFF0C\u9002\u7528\u4E8E\u8D1F\u8F7D\u7A33\u5B9A\u7684\u573A\u666F\u3002",
      "\u53EA\u6709\u4E00\u4E2A\u7EBF\u7A0B\uFF0C\u4FDD\u8BC1\u4EFB\u52A1\u4E32\u884C\u6267\u884C\u3002",
      "\u7EBF\u7A0B\u6570\u91CF\u6839\u636E\u4EFB\u52A1\u91CF\u52A8\u6001\u8C03\u6574\uFF0C\u51E0\u4E4E\u6CA1\u6709\u4E0A\u9650\uFF0C\u9002\u5408\u6267\u884C\u5927\u91CF\u3001\u8017\u65F6\u77ED\u7684\u4EFB\u52A1\u3002",
      "\u53EF\u4EE5\u6267\u884C\u5B9A\u65F6\u6216\u5468\u671F\u6027\u4EFB\u52A1\u3002"
    ],
    answer: "\u7EBF\u7A0B\u6570\u91CF\u6839\u636E\u4EFB\u52A1\u91CF\u52A8\u6001\u8C03\u6574\uFF0C\u51E0\u4E4E\u6CA1\u6709\u4E0A\u9650\uFF0C\u9002\u5408\u6267\u884C\u5927\u91CF\u3001\u8017\u65F6\u77ED\u7684\u4EFB\u52A1\u3002",
    score: 3,
    explanation: "\u53EF\u7F13\u5B58\u7EBF\u7A0B\u6C60\u7684\u7279\u70B9\u662F\u5176\u9AD8\u5EA6\u7684\u4F38\u7F29\u6027\u3002\u5F53\u6709\u65B0\u4EFB\u52A1\u65F6\uFF0C\u5982\u679C\u6C60\u4E2D\u6709\u7A7A\u95F2\u7EBF\u7A0B\u5C31\u590D\u7528\uFF0C\u5982\u679C\u6CA1\u6709\u5C31\u521B\u5EFA\u65B0\u7EBF\u7A0B\uFF0C\u7406\u8BBA\u4E0A\u53EF\u4EE5\u65E0\u9650\u521B\u5EFA\u3002\u7A7A\u95F2\u8D85\u8FC7\u4E00\u5B9A\u65F6\u95F4\uFF08\u9ED8\u8BA460\u79D2\uFF09\u7684\u7EBF\u7A0B\u4F1A\u88AB\u56DE\u6536\u3002"
  },
  {
    id: 126,
    type: "single",
    question: "\u6839\u636E\u7B14\u8BB0\uFF0CJava\u53CD\u5C04\u673A\u5236\u7684\u6838\u5FC3\u601D\u60F3\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u5728\u7F16\u8BD1\u65F6\u9759\u6001\u5730\u68C0\u67E5\u548C\u94FE\u63A5\u7C7B\u7684\u6240\u6709\u6210\u5458\u3002",
      "\u5141\u8BB8\u7A0B\u5E8F\u5728\u8FD0\u884C\u65F6\u52A8\u6001\u5730\u83B7\u53D6\u7C7B\u7684\u5185\u90E8\u4FE1\u606F\u5E76\u64CD\u4F5C\u5176\u6210\u5458\u3002",
      "\u4E00\u79CD\u7528\u4E8E\u63D0\u5347\u4EE3\u7801\u6267\u884C\u6548\u7387\u7684\u5E95\u5C42\u4F18\u5316\u6280\u672F\u3002",
      "\u4E3B\u8981\u7528\u4E8E\u5B9E\u73B0\u7C7B\u7684\u591A\u91CD\u7EE7\u627F\u3002"
    ],
    answer: "\u5141\u8BB8\u7A0B\u5E8F\u5728\u8FD0\u884C\u65F6\u52A8\u6001\u5730\u83B7\u53D6\u7C7B\u7684\u5185\u90E8\u4FE1\u606F\u5E76\u64CD\u4F5C\u5176\u6210\u5458\u3002",
    score: 2.5,
    explanation: "\u7B14\u8BB0\u5F00\u7BC7\u5373\u660E\u786E\u6307\u51FA\uFF0C\u53CD\u5C04\u7684\u6838\u5FC3\u662F\u5728\u201C\u8FD0\u884C\u65F6\u201D\u52A8\u6001\u5730\u201C\u83B7\u53D6\u201D\u548C\u201C\u64CD\u4F5C\u201D\u7C7B\u7684\u5185\u90E8\u7ED3\u6784\uFF0C\u4E0E\u5E38\u89C4\u7684\u7F16\u8BD1\u65F6\u9759\u6001\u68C0\u67E5\u5F62\u6210\u5BF9\u6BD4\u3002"
  },
  {
    id: 127,
    type: "single",
    question: "\u5728\u9700\u8981\u6839\u636E\u914D\u7F6E\u6587\u4EF6\u4E2D\u7684\u5B57\u7B26\u4E32\u7C7B\u540D\u6765\u52A0\u8F7D\u5E76\u5B9E\u4F8B\u5316\u4E00\u4E2A\u5BF9\u8C61\u7684\u573A\u666F\u4E0B\uFF0C\u6700\u9002\u5408\u4F7F\u7528\u54EA\u79CD\u65B9\u5F0F\u83B7\u53D6`Class`\u5BF9\u8C61\uFF1F",
    options: [
      "`\u5BF9\u8C61.getClass()`",
      "`\u7C7B\u540D.class`",
      '`Class.forName("\u5168\u9650\u5B9A\u7C7B\u540D")`',
      "`ClassLoader.getSystemClassLoader()`"
    ],
    answer: '`Class.forName("\u5168\u9650\u5B9A\u7C7B\u540D")`',
    score: 3,
    explanation: "\u7B14\u8BB0\u4E2D\u5F3A\u8C03\uFF0C`Class.forName()`\u662F\u6700\u7075\u6D3B\u7684\u65B9\u5F0F\uFF0C\u5B83\u63A5\u6536\u4E00\u4E2A\u5B57\u7B26\u4E32\u4F5C\u4E3A\u53C2\u6570\uFF0C\u8FD9\u4F7F\u5176\u975E\u5E38\u9002\u5408\u4E8E\u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6\u3001JDBC\u9A71\u52A8\u52A0\u8F7D\u7B49\u9700\u8981\u5728\u8FD0\u884C\u65F6\u624D\u80FD\u786E\u5B9A\u5177\u4F53\u7C7B\u540D\u7684\u52A8\u6001\u573A\u666F\u3002"
  },
  {
    id: 128,
    type: "short_answer",
    question: "\u8BF7\u89E3\u91CA`Class`\u7C7B\u4E2D`getMethods()`\u548C`getDeclaredMethods()`\u8FD9\u4E24\u4E2AAPI\u7CFB\u5217\u5728\u83B7\u53D6\u65B9\u6CD5\u65F6\u7684\u6838\u5FC3\u533A\u522B\u3002",
    answer: "\u6838\u5FC3\u533A\u522B\u5728\u4E8E\u4E24\u4E2A\u7EF4\u5EA6\uFF1A\u8BBF\u95EE\u6743\u9650\u548C\u7EE7\u627F\u5173\u7CFB\u3002\n1. `getMethods()`: \u53EA\u80FD\u83B7\u53D6\u6240\u6709**\u516C\u5F00\u7684(public)**\u65B9\u6CD5\uFF0C\u4F46**\u5305\u62EC**\u4ECE\u7236\u7C7B\u548C\u63A5\u53E3\u7EE7\u627F\u800C\u6765\u7684\u516C\u6709\u65B9\u6CD5\u3002\n2. `getDeclaredMethods()`: \u53EF\u4EE5\u83B7\u53D6**\u6240\u6709\u6743\u9650**\uFF08public, protected, default, private\uFF09\u7684\u65B9\u6CD5\uFF0C\u4F46**\u4EC5\u9650\u4E8E**\u5F53\u524D\u7C7B\u81EA\u5DF1\u58F0\u660E\u7684\u65B9\u6CD5\uFF0C\u4E0D\u5305\u62EC\u4EFB\u4F55\u4ECE\u7236\u7C7B\u6216\u63A5\u53E3\u7EE7\u627F\u7684\u65B9\u6CD5\u3002",
    score: 4,
    explanation: "\u8FD9\u662F\u53CD\u5C04API\u4E2D\u4E00\u4E2A\u6781\u5176\u91CD\u8981\u7684\u547D\u540D\u89C4\u5F8B\u548C\u529F\u80FD\u533A\u5206\uFF0C\u662F\u9762\u8BD5\u4E2D\u7684\u9AD8\u9891\u8003\u70B9\u3002\u7406\u89E3`Declared`\u7684\u542B\u4E49\u2014\u2014\u201C\u4EC5\u9650\u5F53\u524D\u7C7B\u58F0\u660E\u201D\uFF0C\u662F\u638C\u63E1\u53CD\u5C04API\u7684\u5173\u952E\u3002"
  },
  {
    id: 129,
    type: "code",
    question: "\u5047\u8BBE\u6709\u4E00\u4E2A`User`\u7C7B\uFF0C\u5B83\u53EA\u6709\u4E00\u4E2A\u79C1\u6709\u7684\u65E0\u53C2\u6784\u9020\u65B9\u6CD5`private User() {}`\u3002\u8BF7\u4F7F\u7528\u53CD\u5C04\u6765\u521B\u5EFA\u8BE5`User`\u7C7B\u7684\u4E00\u4E2A\u5B9E\u4F8B\u3002",
    answer: "// 1. \u83B7\u53D6User\u7C7B\u7684Class\u5BF9\u8C61\nClass<User> userClass = User.class;\n// 2. \u83B7\u53D6\u79C1\u6709\u7684\u65E0\u53C2\u6784\u9020\u5668\nConstructor<User> constructor = userClass.getDeclaredConstructor();\n// 3. \u66B4\u529B\u7834\u89E3\uFF0C\u53D6\u6D88\u8BBF\u95EE\u6743\u9650\u68C0\u67E5\nconstructor.setAccessible(true);\n// 4. \u8C03\u7528\u6784\u9020\u5668\u521B\u5EFA\u5B9E\u4F8B\nUser userInstance = constructor.newInstance();",
    score: 4.5,
    explanation: "\u6B64\u9898\u8003\u5BDF\u4E86\u901A\u8FC7\u53CD\u5C04\u5B9E\u4F8B\u5316\u4E00\u4E2A\u5177\u6709\u79C1\u6709\u6784\u9020\u5668\u7684\u7C7B\u7684\u5B8C\u6574\u6D41\u7A0B\uFF0C\u6838\u5FC3\u6B65\u9AA4\u5305\u62EC\uFF1A\u83B7\u53D6`DeclaredConstructor`\u3001\u4F7F\u7528`setAccessible(true)`\u8FDB\u884C\u66B4\u529B\u7834\u89E3\u3001\u4EE5\u53CA\u8C03\u7528`newInstance()`\u3002\u8FD9\u662F\u53CD\u5C04\u5F3A\u5927\u80FD\u529B\u7684\u76F4\u63A5\u4F53\u73B0\u3002"
  },
  {
    id: 130,
    type: "short_answer",
    question: "\u8BF7\u7B80\u8FF0Java\u7C7B\u52A0\u8F7D\u5668\u7684\u53CC\u4EB2\u59D4\u6D3E\u6A21\u578B\uFF08Parents Delegation Model\uFF09\u7684\u5DE5\u4F5C\u6D41\u7A0B\u3002",
    answer: "\u5F53\u4E00\u4E2A\u7C7B\u52A0\u8F7D\u5668\u6536\u5230\u52A0\u8F7D\u7C7B\u7684\u8BF7\u6C42\u65F6\uFF0C\u5B83\u9996\u5148\u4E0D\u4F1A\u81EA\u5DF1\u53BB\u5C1D\u8BD5\u52A0\u8F7D\uFF0C\u800C\u662F\u5C06\u8FD9\u4E2A\u8BF7\u6C42**\u59D4\u6D3E\u7ED9\u5B83\u7684\u7236\u52A0\u8F7D\u5668**\u53BB\u6267\u884C\u3002\u6BCF\u4E00\u5C42\u52A0\u8F7D\u5668\u90FD\u4F1A\u91CD\u590D\u8FD9\u4E2A\u52A8\u4F5C\uFF0C\u76F4\u5230\u8BF7\u6C42\u6700\u7EC8\u5230\u8FBE\u9876\u5C42\u7684\u542F\u52A8\u7C7B\u52A0\u8F7D\u5668\uFF08Bootstrap ClassLoader\uFF09\u3002\u53EA\u6709\u5F53\u7236\u52A0\u8F7D\u5668\u5728\u81EA\u5DF1\u7684\u641C\u7D22\u8303\u56F4\u5185\u627E\u4E0D\u5230\u6240\u9700\u7684\u7C7B\uFF0C\u5E76\u53CD\u9988\u65E0\u6CD5\u52A0\u8F7D\u65F6\uFF0C\u5B50\u52A0\u8F7D\u5668\u624D\u4F1A\u5C1D\u8BD5\u81EA\u5DF1\u53BB\u52A0\u8F7D\u8FD9\u4E2A\u7C7B\u3002",
    score: 4.5,
    explanation: "\u53CC\u4EB2\u59D4\u6D3E\u6A21\u578B\u662FJava\u7C7B\u52A0\u8F7D\u673A\u5236\u7684\u6838\u5FC3\uFF0C\u4E5F\u662FJVM\u76F8\u5173\u9762\u8BD5\u9898\u4E2D\u7684\u91CD\u4E2D\u4E4B\u91CD\u3002\u7406\u89E3\u5176\u201C\u81EA\u4E0B\u800C\u4E0A\u59D4\u6D3E\uFF0C\u81EA\u4E0A\u800C\u4E0B\u52A0\u8F7D\u201D\u7684\u6D41\u7A0B\u5BF9\u4E8E\u7406\u89E3Java\u7684\u7C7B\u9694\u79BB\u548C\u5B89\u5168\u673A\u5236\u81F3\u5173\u91CD\u8981\u3002"
  },
  {
    id: 131,
    type: "single",
    question: "\u5F53\u4F7F\u7528\u53CD\u5C04`method.invoke(obj, args)`\u8C03\u7528\u4E00\u4E2A\u65B9\u6CD5\u65F6\uFF0C\u5982\u679C\u8BE5\u65B9\u6CD5\u5185\u90E8\u672C\u8EAB\u6267\u884C\u65F6\u629B\u51FA\u4E86\u4E00\u4E2A`ArithmeticException`\uFF0C\u90A3\u4E48`invoke`\u65B9\u6CD5\u4F1A\u5411\u5916\u629B\u51FA\u4EC0\u4E48\u5F02\u5E38\uFF1F",
    options: [
      "\u76F4\u63A5\u629B\u51FA`ArithmeticException`",
      "\u629B\u51FA`IllegalAccessException`",
      "\u629B\u51FA`InvocationTargetException`",
      "\u629B\u51FA`NoSuchMethodException`"
    ],
    answer: "\u629B\u51FA`InvocationTargetException`",
    score: 4,
    explanation: "\u6839\u636E\u7B14\u8BB0\uFF0C\u53CD\u5C04\u673A\u5236\u4F1A\u5C06\u76EE\u6807\u65B9\u6CD5\u5185\u90E8\u629B\u51FA\u7684\u539F\u59CB\u5F02\u5E38\u5305\u88C5\u5728`InvocationTargetException`\u4E2D\u518D\u5411\u5916\u629B\u51FA\u3002\u8981\u83B7\u53D6\u539F\u59CB\u7684`ArithmeticException`\uFF0C\u9700\u8981\u8C03\u7528`getCause()`\u65B9\u6CD5\u3002\u8FD9\u662F\u4E3A\u4E86\u533A\u5206\u662F\u53CD\u5C04\u8C03\u7528\u672C\u8EAB\u51FA\u9519\u4E86\uFF0C\u8FD8\u662F\u76EE\u6807\u65B9\u6CD5\u903B\u8F91\u51FA\u9519\u4E86\u3002"
  },
  {
    id: 132,
    type: "code",
    question: '\u4E00\u4E2A`Person`\u5BF9\u8C61`p`\u6709\u4E00\u4E2A\u79C1\u6709\u5C5E\u6027`private String name = "John";`\u3002\u8BF7\u4F7F\u7528\u53CD\u5C04\u5C06\u8BE5\u5BF9\u8C61\u7684`name`\u5C5E\u6027\u503C\u4FEE\u6539\u4E3A`"Doe"`\u3002',
    answer: `// 1. \u83B7\u53D6Person\u7C7B\u7684Class\u5BF9\u8C61
Class<?> personClass = p.getClass();
// 2. \u83B7\u53D6\u540D\u4E3A'name'\u7684\u79C1\u6709\u5C5E\u6027
Field nameField = personClass.getDeclaredField("name");
// 3. \u66B4\u529B\u7834\u89E3\u8BBF\u95EE\u6743\u9650
nameField.setAccessible(true);
// 4. \u4E3Ap\u5BF9\u8C61\u7684nameField\u5C5E\u6027\u8BBE\u7F6E\u65B0\u503C
nameField.set(p, "Doe");`,
    score: 4,
    explanation: "\u8003\u5BDF\u4E86\u53CD\u5C04\u64CD\u4F5C\u79C1\u6709\u5C5E\u6027\u7684\u6838\u5FC3API\uFF1A`getDeclaredField`\u3001`setAccessible`\u548C`set`\u3002\u8FD9\u662F\u52A8\u6001\u4FEE\u6539\u5BF9\u8C61\u72B6\u6001\u7684\u5E38\u7528\u53CD\u5C04\u6280\u5DE7\u3002"
  },
  {
    id: 133,
    type: "multiple",
    question: "\u4EE5\u4E0B\u54EA\u51E0\u79CD\u65B9\u5F0F\u53EF\u4EE5\u6B63\u786E\u5730\u83B7\u53D6\u5230\u4E00\u4E2A\u7C7B\u7684`Class`\u5BF9\u8C61\uFF1F",
    options: [
      "`String.class`",
      "`new String().getClass()`",
      '`Class.forName("java.lang.String")`',
      '`new Class("java.lang.String")`'
    ],
    answer: [
      "`String.class`",
      "`new String().getClass()`",
      '`Class.forName("java.lang.String")`'
    ],
    score: 3,
    explanation: "`Class`\u7C7B\u7684\u6784\u9020\u65B9\u6CD5\u662F\u79C1\u6709\u7684\uFF0C\u4E0D\u80FD\u901A\u8FC7`new`\u6765\u521B\u5EFA\uFF0C\u56E0\u6B64\u9009\u9879D\u662F\u9519\u8BEF\u7684\u3002\u9009\u9879A\u3001B\u3001C\u662F\u7B14\u8BB0\u4E2D\u5217\u51FA\u7684\u4E09\u79CD\u6700\u4E3B\u8981\u7684\u83B7\u53D6`Class`\u5BF9\u8C61\u7684\u65B9\u5F0F\u3002"
  },
  {
    id: 134,
    type: "short_answer",
    question: "\u5728Java\u4E2D\uFF0C\u4E3A\u4EC0\u4E48\u6838\u5FC3\u7C7B\u5E93\uFF08\u5982`java.lang.String`\uFF09\u7684\u7C7B\u52A0\u8F7D\u5668\u662F`null`\uFF1F",
    answer: "\u56E0\u4E3AJava\u7684\u6838\u5FC3\u7C7B\u5E93\u662F\u7531**\u542F\u52A8\u7C7B\u52A0\u8F7D\u5668 (Bootstrap ClassLoader)** \u6765\u52A0\u8F7D\u7684\u3002\u8FD9\u4E2A\u52A0\u8F7D\u5668\u662FJVM\u5B9E\u73B0\u7684\u4E00\u90E8\u5206\uFF0C\u901A\u5E38\u7531C++\u7B49\u672C\u5730\u8BED\u8A00\u7F16\u5199\uFF0C\u5B83\u5E76\u4E0D\u5B58\u5728\u4E8EJava\u7684\u7C7B\u52A0\u8F7D\u5668\u4F53\u7CFB\u4E2D\uFF0C\u6240\u4EE5\u5728Java\u4EE3\u7801\u5C42\u9762\u65E0\u6CD5\u83B7\u53D6\u5230\u5B83\u7684\u5F15\u7528\u3002\u56E0\u6B64\uFF0C\u5F53\u5C1D\u8BD5\u83B7\u53D6\u8FD9\u4E9B\u6838\u5FC3\u7C7B\u7684\u7C7B\u52A0\u8F7D\u5668\u65F6\uFF0C\u7EA6\u5B9A\u4FD7\u6210\u5730\u8FD4\u56DE`null`\u4F5C\u4E3A\u6807\u8BC6\u3002",
    score: 3.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u7ECF\u5178\u7684\u7C7B\u52A0\u8F7D\u5668\u9762\u8BD5\u9898\uFF0C\u8003\u5BDF\u5BF9\u7C7B\u52A0\u8F7D\u5668\u5C42\u6B21\u7ED3\u6784\u9876\u5C42\u7684\u7406\u89E3\u3002"
  },
  {
    id: 135,
    type: "single",
    question: "`Method.invoke(Object obj, Object... args)`\u65B9\u6CD5\u4E2D\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570`obj`\u4EE3\u8868\u4EC0\u4E48\uFF1F",
    options: [
      "\u65B9\u6CD5\u7684\u8FD4\u56DE\u503C\u3002",
      "\u8981\u8C03\u7528\u8BE5\u65B9\u6CD5\u7684\u5BF9\u8C61\u5B9E\u4F8B\uFF1B\u5982\u679C\u65B9\u6CD5\u662F\u9759\u6001\u7684\uFF0C\u5219\u6B64\u53C2\u6570\u4E3A`null`\u3002",
      "\u65B9\u6CD5\u7684\u53C2\u6570\u5217\u8868\u3002",
      "\u65B9\u6CD5\u7684`Class`\u5BF9\u8C61\u3002"
    ],
    answer: "\u8981\u8C03\u7528\u8BE5\u65B9\u6CD5\u7684\u5BF9\u8C61\u5B9E\u4F8B\uFF1B\u5982\u679C\u65B9\u6CD5\u662F\u9759\u6001\u7684\uFF0C\u5219\u6B64\u53C2\u6570\u4E3A`null`\u3002",
    score: 3,
    explanation: "`invoke`\u7684\u542B\u4E49\u662F\u201C\u8C03\u7528\u201D\uFF0C\u5176\u8BBE\u8BA1\u7684\u903B\u8F91\u662F `obj.method(args)`\u3002\u56E0\u6B64\uFF0C\u7B2C\u4E00\u4E2A\u53C2\u6570`obj`\u662F\u65B9\u6CD5\u8C03\u7528\u7684\u4E3B\u4F53\uFF08\u63A5\u6536\u8005\uFF09\u3002\u5BF9\u4E8E\u9759\u6001\u65B9\u6CD5\uFF0C\u5B83\u4E0D\u96B6\u5C5E\u4E8E\u4EFB\u4F55\u5BF9\u8C61\uFF0C\u800C\u662F\u5C5E\u4E8E\u7C7B\uFF0C\u6240\u4EE5\u8C03\u7528\u4E3B\u4F53\u662F`null`\u3002"
  },
  {
    id: 136,
    type: "multiple",
    question: "\u5728\u8FDB\u884C\u53CD\u5C04\u64CD\u4F5C\u65F6\uFF0C\u4EE5\u4E0B\u54EA\u4E9B\u662F\u5E38\u89C1\u7684\u53D7\u68C0\u5F02\u5E38\uFF1F",
    options: [
      "ClassNotFoundException",
      "NoSuchMethodException",
      "NullPointerException",
      "IllegalAccessException"
    ],
    answer: ["ClassNotFoundException", "NoSuchMethodException", "IllegalAccessException"],
    score: 3.5,
    explanation: "`ClassNotFoundException`, `NoSuchMethodException`, `NoSuchFieldException`, `IllegalAccessException` \u7B49\u90FD\u662F\u53CD\u5C04\u64CD\u4F5C\u4E2D\u5E38\u89C1\u7684\u53D7\u68C0\u5F02\u5E38\uFF0C\u7F16\u8BD1\u5668\u4F1A\u5F3A\u5236\u8981\u6C42\u5904\u7406\u3002\u800C`NullPointerException`\u662F\u8FD0\u884C\u65F6\u5F02\u5E38\uFF0C\u901A\u5E38\u7531\u4EE3\u7801\u903B\u8F91\u9519\u8BEF\u5F15\u8D77\u3002"
  },
  {
    id: 137,
    type: "short_answer",
    question: "\u7ED3\u5408\u5B9E\u9645\u5F00\u53D1\uFF0C\u8BF7\u8BF4\u660E\u4E3A\u4EC0\u4E48\u50CFSpring\u8FD9\u6837\u7684\u73B0\u4EE3\u6846\u67B6\u5927\u91CF\u4F7F\u7528\u53CD\u5C04\u673A\u5236\u6765\u5B9E\u73B0\u5176\u6838\u5FC3\u529F\u80FD\uFF08\u5982\u4F9D\u8D56\u6CE8\u5165\uFF09\uFF1F",
    answer: "\u56E0\u4E3A\u6846\u67B6\u9700\u8981\u5728**\u8FD0\u884C\u65F6**\u6839\u636E\u914D\u7F6E\u6587\u4EF6\uFF08\u5982XML\u6216\u6CE8\u89E3\uFF09\u52A8\u6001\u5730\u521B\u5EFA\u548C\u7BA1\u7406\u5BF9\u8C61\uFF0C\u800C\u4E0D\u662F\u5728\u7F16\u8BD1\u65F6\u786C\u7F16\u7801\u3002\u53CD\u5C04\u63D0\u4F9B\u4E86\u8FD9\u79CD\u80FD\u529B\uFF1A\n1. **\u89E3\u8026**\uFF1A\u6846\u67B6\u53EF\u4EE5\u901A\u8FC7\u8BFB\u53D6\u914D\u7F6E\uFF08\u5982`@Autowired`\u6CE8\u89E3\u6216XML\u4E2D\u7684\u7C7B\u540D\uFF09\u83B7\u53D6\u5230\u7C7B\u6216\u63A5\u53E3\u7684\u5168\u9650\u5B9A\u540D\u5B57\u7B26\u4E32\u3002\n2. **\u52A8\u6001\u521B\u5EFA\u5BF9\u8C61**\uFF1A\u4F7F\u7528`Class.forName()`\u52A0\u8F7D\u7C7B\uFF0C\u5E76\u901A\u8FC7\u53CD\u5C04\u8C03\u7528\u6784\u9020\u5668`newInstance()`\u521B\u5EFA\u5BF9\u8C61\u5B9E\u4F8B\uFF0C\u65E0\u9700`new`\u5173\u952E\u5B57\u3002\n3. **\u52A8\u6001\u8C03\u7528\u65B9\u6CD5/\u8D4B\u503C**\uFF1A\u901A\u8FC7\u53CD\u5C04\u83B7\u53D6`Field`\u6216`Method`\uFF0C\u5B9E\u73B0\u4F9D\u8D56\u6CE8\u5165\uFF08DI\uFF09\uFF0C\u5373\u52A8\u6001\u5730\u4E3A\u5BF9\u8C61\u7684\u5C5E\u6027\u8D4B\u503C\uFF08`field.set`\uFF09\u6216\u8C03\u7528\u5176setter\u65B9\u6CD5\uFF08`method.invoke`\uFF09\u3002\n\u8FD9\u4F7F\u5F97\u5E94\u7528\u7A0B\u5E8F\u7684\u7EC4\u4EF6\u53EF\u4EE5\u7075\u6D3B\u63D2\u62D4\uFF0C\u6781\u5927\u5730\u63D0\u9AD8\u4E86\u7A0B\u5E8F\u7684\u53EF\u914D\u7F6E\u6027\u548C\u6269\u5C55\u6027\u3002",
    score: 4.5,
    explanation: "\u8FD9\u662F\u4E00\u4E2A\u7ED3\u5408\u5B9E\u9645\u5F00\u53D1\u573A\u666F\u7684\u9AD8\u9636\u95EE\u9898\uFF0C\u8003\u5BDF\u662F\u5426\u80FD\u5C06\u53CD\u5C04\u7684\u7406\u8BBA\u77E5\u8BC6\u4E0E\u6846\u67B6\uFF08\u5982Spring IoC/DI\uFF09\u7684\u8BBE\u8BA1\u601D\u60F3\u8054\u7CFB\u8D77\u6765\uFF0C\u7406\u89E3\u53CD\u5C04\u5728\u6784\u5EFA\u901A\u7528\u3001\u7075\u6D3B\u6846\u67B6\u4E2D\u7684\u5173\u952E\u4F5C\u7528\u3002"
  },
  {
    id: 138,
    type: "code",
    question: "\u4E00\u4E2A`Calculator`\u7C7B\u6709\u4E00\u4E2A\u79C1\u6709\u65B9\u6CD5 `private int add(int a, int b) { return a + b; }`\u3002\u8BF7\u4F7F\u7528\u53CD\u5C04\u8C03\u7528`Calculator`\u5B9E\u4F8B`calc`\u7684\u8FD9\u4E2A`add`\u65B9\u6CD5\uFF0C\u5E76\u4F20\u5165\u53C2\u65705\u548C3\u3002",
    answer: '// 1. \u83B7\u53D6Class\u5BF9\u8C61\nClass<?> clazz = calc.getClass();\n// 2. \u83B7\u53D6add\u65B9\u6CD5\uFF0C\u9700\u8981\u6307\u5B9A\u53C2\u6570\u7C7B\u578B\nMethod addMethod = clazz.getDeclaredMethod("add", int.class, int.class);\n// 3. \u66B4\u529B\u7834\u89E3\naddMethod.setAccessible(true);\n// 4. \u8C03\u7528\u65B9\u6CD5\u5E76\u83B7\u53D6\u8FD4\u56DE\u503C\nObject result = addMethod.invoke(calc, 5, 3); \n// System.out.println(result); // result\u4F1A\u662FInteger\u7C7B\u578B\u76848',
    score: 4.5,
    explanation: "\u6B64\u9898\u662F\u53CD\u5C04\u8C03\u7528\u5E26\u53C2\u6570\u7684\u79C1\u6709\u65B9\u6CD5\u7684\u5B8C\u6574\u793A\u4F8B\uFF0C\u96BE\u70B9\u5728\u4E8E`getDeclaredMethod`\u65F6\u9700\u8981\u7CBE\u786E\u5730\u63D0\u4F9B\u65B9\u6CD5\u7684\u53C2\u6570\u7C7B\u578B\u5217\u8868\uFF08`int.class`\uFF09\uFF0C\u4EE5\u53CA\u5728`invoke`\u65F6\u6B63\u786E\u5730\u4F20\u9012\u53C2\u6570\u3002"
  },
  {
    id: 139,
    type: "single",
    question: "\u5728\u8BBF\u95EE\u4E00\u4E2A\u7C7B\u7684\u79C1\u6709\u6210\u5458\uFF08\u5C5E\u6027\u3001\u65B9\u6CD5\u6216\u6784\u9020\u5668\uFF09\u4E4B\u524D\uFF0C\u8C03\u7528`member.setAccessible(true)`\u7684\u76EE\u7684\u662F\u4EC0\u4E48\uFF1F",
    options: [
      "\u5C06\u8BE5\u6210\u5458\u53D8\u4E3A`public`\u3002",
      "\u4E3A\u8BE5\u6210\u5458\u521B\u5EFA\u4E00\u4E2A\u516C\u5F00\u7684\u4EE3\u7406\u3002",
      "\u4E34\u65F6\u53D6\u6D88Java\u8BED\u8A00\u5BF9\u8BE5\u6210\u5458\u7684\u8BBF\u95EE\u6743\u9650\u68C0\u67E5\uFF0C\u4EE5\u4FBF\u540E\u7EED\u7684\u53CD\u5C04\u8C03\u7528\u53EF\u4EE5\u6210\u529F\u3002",
      "\u68C0\u67E5\u8BE5\u6210\u5458\u662F\u5426\u53EF\u4EE5\u88AB\u8BBF\u95EE\u3002"
    ],
    answer: "\u4E34\u65F6\u53D6\u6D88Java\u8BED\u8A00\u5BF9\u8BE5\u6210\u5458\u7684\u8BBF\u95EE\u6743\u9650\u68C0\u67E5\uFF0C\u4EE5\u4FBF\u540E\u7EED\u7684\u53CD\u5C04\u8C03\u7528\u53EF\u4EE5\u6210\u529F\u3002",
    score: 3,
    explanation: "`setAccessible(true)`\u5E76\u4E0D\u4F1A\u6C38\u4E45\u6027\u5730\u6539\u53D8\u6210\u5458\u7684\u8BBF\u95EE\u4FEE\u9970\u7B26\uFF08\u5982`private`\uFF09\uFF0C\u5B83\u4EC5\u4EC5\u662F\u5728\u672C\u6B21\u53CD\u5C04\u64CD\u4F5C\u7684\u4E0A\u4E0B\u6587\u4E2D\uFF0C\u5411JVM\u8BF7\u6C42\u4E00\u4E2A\u201C\u7EFF\u8272\u901A\u9053\u201D\uFF0C\u6682\u65F6\u5FFD\u7565\u6743\u9650\u68C0\u67E5\u3002\u8FD9\u88AB\u79F0\u4E3A\u201C\u66B4\u529B\u7834\u89E3\u201D\u6216\u201C\u6291\u5236\u8BBF\u95EE\u6743\u9650\u68C0\u67E5\u201D\u3002"
  },
  {
    id: 140,
    type: "single",
    question: "\u5F53\u901A\u8FC7\u53CD\u5C04\u83B7\u53D6\u4E00\u4E2A\u7C7B\u7684\u6784\u9020\u5668\u65F6\uFF0C\u4F7F\u7528`clazz.getDeclaredConstructor(int.class, String.class)`\uFF0C\u8FD9\u91CC\u7684`int.class`\u4EE3\u8868\u4EC0\u4E48\uFF1F",
    options: [
      "\u4E00\u4E2A\u540D\u4E3A`int`\u7684\u7C7B\u3002",
      "\u4EE3\u8868\u57FA\u672C\u6570\u636E\u7C7B\u578B`int`\u7684`Class`\u5BF9\u8C61\u3002",
      "\u4EE3\u8868\u5305\u88C5\u7C7B`Integer`\u7684`Class`\u5BF9\u8C61\u3002",
      "\u4E00\u4E2A\u8BED\u6CD5\u9519\u8BEF\u3002"
    ],
    answer: "\u4EE3\u8868\u57FA\u672C\u6570\u636E\u7C7B\u578B`int`\u7684`Class`\u5BF9\u8C61\u3002",
    score: 3,
    explanation: "Java\u4E2D\uFF0C\u4E0D\u4EC5\u5F15\u7528\u7C7B\u578B\u6709\u5BF9\u5E94\u7684`Class`\u5BF9\u8C61\uFF0C\u6240\u6709\u57FA\u672C\u6570\u636E\u7C7B\u578B\uFF08`int`, `double`, `boolean`\u7B49\uFF09\u4EE5\u53CA`void`\u4E5F\u90FD\u6709\u4E00\u4E2A\u5BF9\u5E94\u7684`Class`\u5BF9\u8C61\u3002`int.class`\u5C31\u662F\u83B7\u53D6`int`\u8FD9\u4E2A\u57FA\u672C\u7C7B\u578B\u7684`Class`\u5B9E\u4F8B\uFF0C\u7528\u4E8E\u5728\u53CD\u5C04\u4E2D\u7CBE\u786E\u5339\u914D\u65B9\u6CD5\u6216\u6784\u9020\u5668\u7684\u53C2\u6570\u7B7E\u540D\u3002"
  },
  {
    id: 141,
    type: "short_answer",
    question: "\u53CD\u5C04\u673A\u5236\u867D\u7136\u5F3A\u5927\uFF0C\u4F46\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\u4E3A\u4EC0\u4E48\u4E0D\u5EFA\u8BAE\u6EE5\u7528\uFF1F\u8BF7\u6307\u51FA\u5B83\u7684\u81F3\u5C11\u4E24\u4E2A\u4E3B\u8981\u7F3A\u70B9\u3002",
    answer: "\u4E3B\u8981\u7F3A\u70B9\u6709\uFF1A\n1. **\u6027\u80FD\u5F00\u9500\u5927**\uFF1A\u53CD\u5C04\u64CD\u4F5C\u6D89\u53CA\u52A8\u6001\u7C7B\u578B\u89E3\u6790\u3001\u65B9\u6CD5\u67E5\u627E\u7B49\u4E00\u7CFB\u5217\u8017\u65F6\u64CD\u4F5C\uFF0C\u5176\u6267\u884C\u6548\u7387\u8FDC\u4F4E\u4E8E\u5E38\u89C4\u7684\u76F4\u63A5\u8C03\u7528\u3002\n2. **\u7834\u574F\u5C01\u88C5\u6027**\uFF1A\u901A\u8FC7`setAccessible(true)`\u53EF\u4EE5\u8BBF\u95EE\u548C\u4FEE\u6539\u7C7B\u7684\u79C1\u6709\u6210\u5458\uFF0C\u8FD9\u8FDD\u80CC\u4E86\u9762\u5411\u5BF9\u8C61\u7684\u5C01\u88C5\u539F\u5219\uFF0C\u53EF\u80FD\u5BFC\u81F4\u5BF9\u8C61\u72B6\u6001\u4E0D\u4E00\u81F4\u6216\u6A21\u5757\u95F4\u7684\u8FB9\u754C\u88AB\u7834\u574F\u3002\n3. **\u5B89\u5168\u6027\u95EE\u9898**\uFF1A\u53CD\u5C04\u80FD\u529B\u8FC7\u5F3A\uFF0C\u5982\u679C\u88AB\u6076\u610F\u4EE3\u7801\u5229\u7528\uFF0C\u53EF\u80FD\u4F1A\u7ED5\u8FC7\u5B89\u5168\u68C0\u67E5\uFF0C\u6267\u884C\u672A\u6388\u6743\u7684\u64CD\u4F5C\u3002\n4. **\u4EE3\u7801\u53EF\u8BFB\u6027\u548C\u7EF4\u62A4\u6027\u5DEE**\uFF1A\u53CD\u5C04\u4EE3\u7801\u901A\u5E38\u66F4\u590D\u6742\u3001\u5197\u957F\uFF0C\u4E14\u9519\u8BEF\u5728\u7F16\u8BD1\u671F\u65E0\u6CD5\u53D1\u73B0\uFF0C\u53EA\u80FD\u5728\u8FD0\u884C\u65F6\u66B4\u9732\uFF0C\u589E\u52A0\u4E86\u8C03\u8BD5\u548C\u7EF4\u62A4\u7684\u96BE\u5EA6\u3002\n(\u56DE\u7B54\u4EFB\u610F\u4E24\u70B9\u5373\u53EF)",
    score: 3.5,
    explanation: "\u8003\u5BDF\u5BF9\u53CD\u5C04\u6280\u672F\u201C\u53CC\u5203\u5251\u201D\u7279\u6027\u7684\u7406\u89E3\u3002\u77E5\u9053\u4F55\u65F6\u4F7F\u7528\uFF08\u6846\u67B6\u3001\u52A8\u6001\u4EE3\u7406\uFF09\u548C\u4E3A\u4F55\u8981\u8C28\u614E\u4F7F\u7528\uFF08\u6027\u80FD\u3001\u5C01\u88C5\u6027\uFF09\u662F\u8861\u91CF\u4E00\u4E2A\u5F00\u53D1\u8005\u662F\u5426\u6210\u719F\u7684\u6807\u5FD7\u3002"
  }
];
var materials_default = [
  { id: "java-collection", name: "Java - Collection.md" },
  { id: "java-thread", name: "Java\u7EBF\u7A0B.md" },
  { id: "java-new-material", name: "Java-New-Material.md" },
  { id: "java-reflection", name: "Java \u53CD\u5C04\u673A\u5236.md" }
];
var app = new Hono2().basePath("/api");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = new TextEncoder().encode(password);
  const saltData = new TextEncoder().encode(new TextDecoder("utf-8").decode(salt));
  const key = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltData,
      iterations: 1e5,
      hash: "SHA-256"
    },
    key,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  const passwordData = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    key,
    256
  );
  const newHashArray = Array.from(new Uint8Array(derivedBits));
  const newHashHex = newHashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return newHashHex === hashHex;
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
async function authMiddleware(c, next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: No token provided" }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify2(token, c.env.JWT_SECRET_1);
    c.set("userId", payload.userId);
    await next();
  } catch (e) {
    return c.json({ error: "Unauthorized: Invalid token", details: e.message }, 401);
  }
}
__name(authMiddleware, "authMiddleware");
__name2(authMiddleware, "authMiddleware");
async function getQuestions(c) {
  return questions_default;
}
__name(getQuestions, "getQuestions");
__name2(getQuestions, "getQuestions");
app.get("/questions", async (c) => {
  const questions = await getQuestions(c);
  return c.json(questions);
});
app.post("/register", async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }
  try {
    const hashedPassword = await hashPassword(password);
    const userId = v4_default();
    await c.env.DB.prepare("INSERT INTO Users (id, username, password_hash) VALUES (?, ?, ?)").bind(userId, username, hashedPassword).run();
    const token = await sign2({ userId, username }, c.env.JWT_SECRET_1);
    return c.json({ success: true, userId, username, token });
  } catch (e) {
    if (e.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Username already exists" }, 409);
    }
    return c.json({ error: "Failed to register user", details: e.message }, 500);
  }
});
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }
  try {
    const { results } = await c.env.DB.prepare("SELECT id, username, password_hash FROM Users WHERE username = ?").bind(username).all();
    const user = results[0];
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return c.json({ error: "Invalid username or password" }, 401);
    }
    const token = await sign2({ userId: user.id, username: user.username }, c.env.JWT_SECRET_1);
    return c.json({ success: true, userId: user.id, username: user.username, token });
  } catch (e) {
    return c.json({ error: "Failed to login", details: e.message }, 500);
  }
});
app.get("/wrong-questions", authMiddleware, async (c) => {
  const userId = c.get("userId");
  try {
    const questions = await getQuestions(c);
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
app.post("/wrong-questions", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { questionId, userAnswer } = await c.req.json();
  if (!questionId) {
    return c.json({ error: "Question ID is required" }, 400);
  }
  try {
    const stmt = c.env.DB.prepare(
      "INSERT OR REPLACE INTO WrongAnswers (userId, questionId, userAnswer) VALUES (?, ?, ?)"
    );
    await stmt.bind(userId, questionId, JSON.stringify(userAnswer)).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to add or update wrong question", details: e.message }, 500);
  }
});
app.delete("/wrong-questions/:questionId", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { questionId } = c.req.param();
  try {
    await c.env.DB.prepare("DELETE FROM WrongAnswers WHERE userId = ? AND questionId = ?").bind(userId, parseInt(questionId, 10)).run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to delete wrong question", details: e.message }, 500);
  }
});
app.post("/mastery/:questionId", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { questionId } = c.req.param();
  const { correct } = await c.req.json();
  const qId = parseInt(questionId, 10);
  try {
    if (correct) {
      await c.env.DB.prepare(
        `INSERT INTO QuestionMastery (userId, questionId, correctStreak, lastAnsweredAt)
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(userId, questionId) DO UPDATE SET
         correctStreak = correctStreak + 1,
         lastAnsweredAt = CURRENT_TIMESTAMP`
      ).bind(userId, qId).run();
    } else {
      await c.env.DB.prepare(
        `INSERT INTO QuestionMastery (userId, questionId, correctStreak, lastAnsweredAt)
         VALUES (?, ?, 0, CURRENT_TIMESTAMP)
         ON CONFLICT(userId, questionId) DO UPDATE SET
         correctStreak = 0,
         lastAnsweredAt = CURRENT_TIMESTAMP`
      ).bind(userId, qId).run();
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: "Failed to update mastery", details: e.message }, 500);
  }
});
app.get("/mastered-questions", authMiddleware, async (c) => {
  const userId = c.get("userId");
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT questionId FROM QuestionMastery WHERE userId = ? AND correctStreak >= 3"
    ).bind(userId).all();
    const masteredIds = results.map((r) => r.questionId);
    return c.json(masteredIds);
  } catch (e) {
    return c.json({ error: "Failed to fetch mastered questions", details: e.message }, 500);
  }
});
app.get("/materials", async (c) => {
  c.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
  return c.json(materials_default);
});
app.get("/mastery-progress", authMiddleware, async (c) => {
  const userId = c.get("userId");
  try {
    const allQuestions = await getQuestions(c);
    const totalQuestions = allQuestions.length;
    if (totalQuestions === 0) {
      return c.json({ masteredCount: 0, totalQuestions: 0, progress: 0 });
    }
    const { results } = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM QuestionMastery WHERE userId = ? AND correctStreak >= 3"
    ).bind(userId).all();
    const masteredCount = results[0]?.count || 0;
    const progress = Math.round(masteredCount / totalQuestions * 100);
    return c.json({ masteredCount, totalQuestions, progress });
  } catch (e) {
    return c.json({ error: "Failed to fetch mastery progress", details: e.message }, 500);
  }
});
app.post("/proxy/gemini", async (c) => {
  const GEMINI_API_KEY = c.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return c.json({ error: "GEMINI_API_KEY secret not found. Please configure it in Cloudflare dashboard." }, 500);
  }
  const GEMINI_API_ENDPOINT = "https://pilaoban.dpdns.org";
  const GEMINI_MODEL = "gemini-1.5-flash";
  const apiUrl = `${GEMINI_API_ENDPOINT}/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const requestBody = await c.req.json();
    const request = new Request(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Cloudflare-Worker-Proxy/1.0"
        // Set a user agent
      },
      body: JSON.stringify(requestBody)
    });
    const response = await fetch(request);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`AI Proxy Error: ${response.status} ${response.statusText}`, errorBody);
      return c.json({ error: "AI service proxy failed", details: errorBody }, response.status);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error in AI proxy:", error);
    return c.json({ error: "Failed to proxy AI request", details: error.message }, 500);
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
function parse2(str, options) {
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
__name(parse2, "parse2");
__name2(parse2, "parse");
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
  var _a = options.decode, decode3 = _a === void 0 ? function(x) {
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
          return decode3(value, key);
        });
      } else {
        params[key.name] = decode3(m[i2], key);
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
  return tokensToRegexp(parse2(path, options), keys, options);
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

// .wrangler/tmp/bundle-rBkm2S/middleware-insertion-facade.js
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

// .wrangler/tmp/bundle-rBkm2S/middleware-loader.entry.ts
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
//# sourceMappingURL=functionsWorker-0.10758690063911969.js.map
