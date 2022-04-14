(function(){

  /**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

  function require(path, parent, orig) {
    const resolved = require.resolve(path);

    // lookup failed
    if (resolved == null) {
      orig = orig || path;
      parent = parent || 'root';
      const err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    const module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      const mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  }

  /**
 * Registered modules.
 */

  require.modules = {};

  /**
 * Registered aliases.
 */

  require.aliases = {};

  /**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') {
      path = path.slice(1);
    }

    const paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (let i = 0; i < paths.length; i++) {
      var path = paths[i];
      if (require.modules.hasOwnProperty(path)) {
        return path;
      }
      if (require.aliases.hasOwnProperty(path)) {
        return require.aliases[path];
      }
    }
  };

  /**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

  require.normalize = function(curr, path) {
    const segs = [];

    if (path.charAt(0) != '.') {
      return path;
    }

    curr = curr.split('/');
    path = path.split('/');

    for (let i = 0; i < path.length; ++i) {
      if (path[i] == '..') {
        curr.pop();
      }
      else if (path[i] != '.' && path[i] != '') {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

  require.relative = function(parent) {
    const p = require.normalize(parent, '..');

    /**
   * lastIndexOf helper.
   */

    function lastIndexOf(arr, obj) {
      let i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return i;
        }
      }

      return -1;
    }

    /**
   * The relative require() itself.
   */

    function localRequire(path) {
      const resolved = localRequire.resolve(path);

      return require(resolved, parent, path);
    }

    /**
   * Resolve relative to the parent.
   */

    localRequire.resolve = function(path) {
      const c = path.charAt(0);
      if (c == '/') {
        return path.slice(1);
      }
      if (c == '.') {
        return require.normalize(p, path);
      }

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      const segs = parent.split('/');
      let i = lastIndexOf(segs, 'deps') + 1;
      if (!i) {
        i = 0;
      }
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;

      return path;
    };

    /**
   * Check if module is defined at `path`.
   */

    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };
  require.register('component-emitter/index.js', function(exports, require, module){

    /**
 * Expose `Emitter`.
 */

    module.exports = Emitter;

    /**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

    function Emitter(obj) {
      if (obj) {
        return mixin(obj);
      }
    }

    /**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

    function mixin(obj) {
      for (const key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }

      return obj;
    }

    /**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

    Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);

  return this;
};

    /**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

    Emitter.prototype.once = function(event, fn){
      const self = this;
      this._callbacks = this._callbacks || {};

      function on() {
        self.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);

      return this;
    };

    /**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

    Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (arguments.length == 0) {
    this._callbacks = {};

    return this;
  }

  // specific event
  const callbacks = this._callbacks[event];
  if (!callbacks) {
    return this;
  }

  // remove all handlers
  if (arguments.length == 1) {
    delete this._callbacks[event];

    return this;
  }

  // remove specific handler
  let cb;
  for (let i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  return this;
};

    /**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      let args = [].slice.call(arguments, 1),
        callbacks = this._callbacks[event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (let i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};

      return this._callbacks[event] || [];
    };

    /**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

    Emitter.prototype.hasListeners = function(event){
      return !!this.listeners(event).length;
    };

  });
  require.register('component-reduce/index.js', function(exports, require, module){

    /**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

    module.exports = function(arr, fn, initial){
      let idx = 0;
      const len = arr.length;
      let curr = arguments.length == 3
        ? initial
        : arr[idx++];

      while (idx < len) {
        curr = fn.call(null, curr, arr[idx], ++idx, arr);
      }

      return curr;
    };
  });
  require.register('superagent/lib/client.js', function(exports, require, module){
    /**
 * Module dependencies.
 */

    const Emitter = require('emitter');
    const reduce = require('reduce');

    /**
 * Root reference for iframes.
 */

    const root = typeof window === 'undefined'
      ? this
      : window;

    /**
 * Noop.
 */

    function noop(){}

    /**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

    function isHost(obj) {
      const str = {}.toString.call(obj);

      switch (str) {
      case '[object File]':
      case '[object Blob]':
      case '[object FormData]':
        return true;
      default:
        return false;
      }
    }

    /**
 * Determine XHR.
 */

    function getXHR() {
      if (root.XMLHttpRequest
    && (root.location.protocol != 'file:' || !root.ActiveXObject)) {
        return new XMLHttpRequest();
      }
      else {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (e) {}
        try {
          return new ActiveXObject('Msxml2.XMLHTTP.6.0');
        }
        catch (e) {}
        try {
          return new ActiveXObject('Msxml2.XMLHTTP.3.0');
        }
        catch (e) {}
        try {
          return new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (e) {}
      }

      return false;
    }

    /**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

    const trim = ''.trim
      ? function(s) {
        return s.trim();
      }
      : function(s) {
        return s.replace(/(^\s*|\s*$)/g, '');
      };

    /**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

    function isObject(obj) {
      return obj === Object(obj);
    }

    /**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

    function serialize(obj) {
      if (!isObject(obj)) {
        return obj;
      }
      const pairs = [];
      for (const key in obj) {
        if (obj[key] != null) {
          pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
        }
      }

      return pairs.join('&');
    }

    /**
 * Expose serialization method.
 */

    request.serializeObject = serialize;

    /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

    function parseString(str) {
      const obj = {};
      const pairs = str.split('&');
      let parts;
      let pair;

      for (let i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i];
        parts = pair.split('=');
        obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }

      return obj;
    }

    /**
 * Expose parser.
 */

    request.parseString = parseString;

    /**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

    request.types = {
      html: 'text/html',
      json: 'application/json',
      xml: 'application/xml',
      urlencoded: 'application/x-www-form-urlencoded',
      form: 'application/x-www-form-urlencoded',
      'form-data': 'application/x-www-form-urlencoded'
    };

    /**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

    request.serialize = {
      'application/x-www-form-urlencoded': serialize,
      'application/json': JSON.stringify
    };

    /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

    request.parse = {
      'application/x-www-form-urlencoded': parseString,
      'application/json': JSON.parse
    };

    /**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

    function parseHeader(str) {
      const lines = str.split(/\r?\n/);
      const fields = {};
      let index;
      let line;
      let field;
      let val;

      lines.pop(); // trailing CRLF

      for (let i = 0, len = lines.length; i < len; ++i) {
        line = lines[i];
        index = line.indexOf(':');
        field = line.slice(0, index).toLowerCase();
        val = trim(line.slice(index + 1));
        fields[field] = val;
      }

      return fields;
    }

    /**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

    function type(str){
      return str.split(/ *; */).shift();
    }

    /**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

    function params(str){
      return reduce(str.split(/ *; */), function(obj, str){
        let parts = str.split(/ *= */),
          key = parts.shift(),
          val = parts.shift();

        if (key && val) {
          obj[key] = val;
        }

        return obj;
      }, {});
    }

    /**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

    function Response(req, options) {
      options = options || {};
      this.req = req;
      this.xhr = this.req.xhr;
      this.text = this.xhr.responseText;
      this.setStatusProperties(this.xhr.status);
      this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
      // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
      // getResponseHeader still works. so we get content-type even if getting
      // other headers fails.
      this.header['content-type'] = this.xhr.getResponseHeader('content-type');
      this.setHeaderProperties(this.header);
      this.body = this.req.method != 'HEAD'
        ? this.parseBody(this.text)
        : null;
    }

    /**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

    Response.prototype.get = function(field){
      return this.header[field.toLowerCase()];
    };

    /**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

    Response.prototype.setHeaderProperties = function(header){
      // content-type
      const ct = this.header['content-type'] || '';
      this.type = type(ct);

      // params
      const obj = params(ct);
      for (const key in obj) {
        this[key] = obj[key];
      }
    };

    /**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

    Response.prototype.parseBody = function(str){
      const parse = request.parse[this.type];

      return parse && str && str.length
        ? parse(str)
        : null;
    };

    /**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

    Response.prototype.setStatusProperties = function(status){
      const type = status / 100 | 0;

      // status / class
      this.status = status;
      this.statusType = type;

      // basics
      this.info = type == 1;
      this.ok = type == 2;
      this.clientError = type == 4;
      this.serverError = type == 5;
      this.error = type == 4 || type == 5
        ? this.toError()
        : false;

      // sugar
      this.accepted = status == 202;
      this.noContent = status == 204 || status == 1223;
      this.badRequest = status == 400;
      this.unauthorized = status == 401;
      this.notAcceptable = status == 406;
      this.notFound = status == 404;
      this.forbidden = status == 403;
    };

    /**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

    Response.prototype.toError = function(){
      const req = this.req;
      const method = req.method;
      const url = req.url;

      const msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
      const err = new Error(msg);
      err.status = this.status;
      err.method = method;
      err.url = url;

      return err;
    };

    /**
 * Expose `Response`.
 */

    request.Response = Response;

    /**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

    function Request(method, url) {
      const self = this;
      Emitter.call(this);
      this._query = this._query || [];
      this.method = method;
      this.url = url;
      this.header = {};
      this._header = {};
      this.on('end', function(){
        try {
          const res = new Response(self);
          if (method == 'HEAD') {
            res.text = null;
          }
          self.callback(null, res);
        }
        catch (e) {
          const err = new Error('Parser is unable to parse the response');
          err.parse = true;
          err.original = e;
          self.callback(err);
        }
      });
    }

    /**
 * Mixin `Emitter`.
 */

    Emitter(Request.prototype);

    /**
 * Allow for extension
 */

    Request.prototype.use = function(fn) {
      fn(this);

      return this;
    };

    /**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.timeout = function(ms){
      this._timeout = ms;

      return this;
    };

    /**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.clearTimeout = function(){
      this._timeout = 0;
      clearTimeout(this._timer);

      return this;
    };

    /**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

    Request.prototype.abort = function(){
      if (this.aborted) {
        return;
      }
      this.aborted = true;
      this.xhr.abort();
      this.clearTimeout();
      this.emit('abort');

      return this;
    };

    /**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.set = function(field, val){
      if (isObject(field)) {
        for (const key in field) {
          this.set(key, field[key]);
        }

        return this;
      }
      this._header[field.toLowerCase()] = val;
      this.header[field] = val;

      return this;
    };

    /**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.unset = function(field){
      delete this._header[field.toLowerCase()];
      delete this.header[field];

      return this;
    };

    /**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

    Request.prototype.getHeader = function(field){
      return this._header[field.toLowerCase()];
    };

    /**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.type = function(type){
      this.set('Content-Type', request.types[type] || type);

      return this;
    };

    /**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.accept = function(type){
      this.set('Accept', request.types[type] || type);

      return this;
    };

    /**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.auth = function(user, pass){
      const str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);

      return this;
    };

    /**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

    Request.prototype.query = function(val){
      if (typeof val !== 'string') {
        val = serialize(val);
      }
      if (val) {
        this._query.push(val);
      }

      return this;
    };

    /**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.field = function(name, val){
      if (!this._formData) {
        this._formData = new FormData();
      }
      this._formData.append(name, val);

      return this;
    };

    /**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.attach = function(field, file, filename){
      if (!this._formData) {
        this._formData = new FormData();
      }
      this._formData.append(field, file, filename);

      return this;
    };

    /**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.send = function(data){
      const obj = isObject(data);
      let type = this.getHeader('Content-Type');

      // merge
      if (obj && isObject(this._data)) {
        for (const key in data) {
          this._data[key] = data[key];
        }
      }
      else if (typeof data === 'string') {
        if (!type) {
          this.type('form');
        }
        type = this.getHeader('Content-Type');
        if (type == 'application/x-www-form-urlencoded') {
          this._data = this._data
            ? this._data + '&' + data
            : data;
        }
        else {
          this._data = (this._data || '') + data;
        }
      }
      else {
        this._data = data;
      }

      if (!obj) {
        return this;
      }
      if (!type) {
        this.type('json');
      }

      return this;
    };

    /**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

    Request.prototype.callback = function(err, res){
      const fn = this._callback;
      if (fn.length == 2) {
        return fn(err, res);
      }
      if (err) {
        return this.emit('error', err);
      }
      fn(res);
    };

    /**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

    Request.prototype.crossDomainError = function(){
      const err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
      err.crossDomain = true;
      this.callback(err);
    };

    /**
 * Invoke callback with timeout error.
 *
 * @api private
 */

    Request.prototype.timeoutError = function(){
      const timeout = this._timeout;
      const err = new Error('timeout of ' + timeout + 'ms exceeded');
      err.timeout = timeout;
      this.callback(err);
    };

    /**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

    Request.prototype.withCredentials = function(){
      this._withCredentials = true;

      return this;
    };

    /**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

    Request.prototype.end = function(fn){
      const self = this;
      const xhr = this.xhr = getXHR();
      let query = this._query.join('&');
      const timeout = this._timeout;
      let data = this._formData || this._data;

      // store callback
      this._callback = fn || noop;

      // state change
      xhr.onreadystatechange = function(){
        if (xhr.readyState != 4) {
          return;
        }
        if (xhr.status == 0) {
          if (self.aborted) {
            return self.timeoutError();
          }

          return self.crossDomainError();
        }
        self.emit('end');
      };

      // progress
      if (xhr.upload) {
        xhr.upload.onprogress = function(e){
          e.percent = e.loaded / e.total * 100;
          self.emit('progress', e);
        };
      }

      // timeout
      if (timeout && !this._timer) {
        this._timer = setTimeout(function(){
          self.abort();
        }, timeout);
      }

      // querystring
      if (query) {
        query = request.serializeObject(query);
        this.url += ~this.url.indexOf('?')
          ? '&' + query
          : '?' + query;
      }

      // initiate request
      xhr.open(this.method, this.url, true);

      // CORS
      if (this._withCredentials) {
        xhr.withCredentials = true;
      }

      // body
      if (this.method != 'GET' && this.method != 'HEAD' && typeof data !== 'string' && !isHost(data)) {
        // serialize stuff
        const serialize = request.serialize[this.getHeader('Content-Type')];
        if (serialize) {
          data = serialize(data);
        }
      }

      // set header fields
      for (const field in this.header) {
        if (this.header[field] == null) {
          continue;
        }
        xhr.setRequestHeader(field, this.header[field]);
      }

      // send stuff
      this.emit('request', this);
      xhr.send(data);

      return this;
    };

    /**
 * Expose `Request`.
 */

    request.Request = Request;

    /**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

    function request(method, url) {
      // callback
      if (typeof url === 'function') {
        return new Request('GET', method).end(url);
      }

      // url first
      if (arguments.length == 1) {
        return new Request('GET', method);
      }

      return new Request(method, url);
    }

    /**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.get = function(url, data, fn){
      const req = request('GET', url);
      if (typeof data === 'function') {
        fn = data, data = null;
      }
      if (data) {
        req.query(data);
      }
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.head = function(url, data, fn){
      const req = request('HEAD', url);
      if (typeof data === 'function') {
        fn = data, data = null;
      }
      if (data) {
        req.send(data);
      }
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.del = function(url, fn){
      const req = request('DELETE', url);
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.patch = function(url, data, fn){
      const req = request('PATCH', url);
      if (typeof data === 'function') {
        fn = data, data = null;
      }
      if (data) {
        req.send(data);
      }
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.post = function(url, data, fn){
      const req = request('POST', url);
      if (typeof data === 'function') {
        fn = data, data = null;
      }
      if (data) {
        req.send(data);
      }
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

    request.put = function(url, data, fn){
      const req = request('PUT', url);
      if (typeof data === 'function') {
        fn = data, data = null;
      }
      if (data) {
        req.send(data);
      }
      if (fn) {
        req.end(fn);
      }

      return req;
    };

    /**
 * Expose `request`.
 */

    module.exports = request;

  });


  require.alias('component-emitter/index.js', 'superagent/deps/emitter/index.js');
  require.alias('component-emitter/index.js', 'emitter/index.js');

  require.alias('component-reduce/index.js', 'superagent/deps/reduce/index.js');
  require.alias('component-reduce/index.js', 'reduce/index.js');

  require.alias('superagent/lib/client.js', 'superagent/index.js'); if (typeof exports === 'object') {
    module.exports = require('superagent');
  }
  else if (typeof define === 'function' && define.amd) {
    define([], function(){
      return require('superagent');
    });
  }
  else {
    this.superagent = require('superagent');
  }
})();
