      /* Safe storage polyfill for restricted or sandboxed iframe environments */
      (function() {
        function createStorageStore() {
          var store = {};
          return {
            getItem: function(k) {
              return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
            },
            setItem: function(k, v) {
              store[k] = String(v);
            },
            removeItem: function(k) {
              delete store[k];
            },
            clear: function() {
              store = {};
            },
            key: function(i) {
              return Object.keys(store)[i] || null;
            },
            get length() {
              return Object.keys(store).length;
            }
          };
        }

        function safePolyfill(name) {
          try {
            var s = window[name];
            if (s) {
              var t = '__spotera_' + name + '_probe__';
              s.setItem(t, '1');
              s.removeItem(t);
              return; // native storage is fully functional
            }
          } catch (_) {}

          var mem = createStorageStore();
          try {
            Object.defineProperty(window, name, {
              get: function() { return mem; },
              set: function() {},
              configurable: true,
              enumerable: true
            });
          } catch (_) {
            try {
              if (typeof Window !== 'undefined' && Window.prototype) {
                Object.defineProperty(Window.prototype, name, {
                  get: function() { return mem; },
                  set: function() {},
                  configurable: true,
                  enumerable: true
                });
              }
            } catch (_) {}
          }
        }

        safePolyfill('localStorage');
        safePolyfill('sessionStorage');

        // Global uncaught error listener to ensure diagnostics are visible if scripts fail
        window.addEventListener('error', function(e) {
          console.warn('[Spotera Runtime Warning]:', e.message || e);
        });
      })();
