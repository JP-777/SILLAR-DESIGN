/* @ds-bundle: {"namespace":"SillarUI","components":[{"name":"Alert","sourcePath":"components/general/Alert/Alert.jsx"},{"name":"Badge","sourcePath":"components/general/Badge/Badge.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"Card","sourcePath":"components/general/Card/Card.jsx"},{"name":"ConfirmDialog","sourcePath":"components/general/ConfirmDialog/ConfirmDialog.jsx"},{"name":"Drawer","sourcePath":"components/general/Drawer/Drawer.jsx"},{"name":"EmptyState","sourcePath":"components/general/EmptyState/EmptyState.jsx"},{"name":"FailureAlert","sourcePath":"components/general/FailureAlert/FailureAlert.jsx"},{"name":"Field","sourcePath":"components/general/Field/Field.jsx"},{"name":"Gallery","sourcePath":"components/general/Gallery/Gallery.jsx"},{"name":"Input","sourcePath":"components/general/Input/Input.jsx"},{"name":"Pagination","sourcePath":"components/general/Pagination/Pagination.jsx"},{"name":"Spinner","sourcePath":"components/general/Spinner/Spinner.jsx"},{"name":"Switch","sourcePath":"components/general/Switch/Switch.jsx"},{"name":"Table","sourcePath":"components/general/Table/Table.jsx"},{"name":"Toasts","sourcePath":"components/general/Toasts/Toasts.jsx"}],"sourceHashes":{"components/general/Alert/Alert.jsx":"f411e093fac0","components/general/Alert/Alert.d.ts":"facbdbec1f41","components/general/Alert/Alert.prompt.md":"369f04d113c2","components/general/Badge/Badge.jsx":"aa2050e8aa81","components/general/Badge/Badge.d.ts":"97b39ffd0394","components/general/Badge/Badge.prompt.md":"5571fb756db6","components/general/Button/Button.jsx":"f5e84b67feba","components/general/Button/Button.d.ts":"983732ac7932","components/general/Button/Button.prompt.md":"4bf8be0d44be","components/general/Card/Card.jsx":"f8c2fae2cad4","components/general/Card/Card.d.ts":"78970aedb512","components/general/Card/Card.prompt.md":"6b99b34d7ca5","components/general/ConfirmDialog/ConfirmDialog.jsx":"a654f4f8095e","components/general/ConfirmDialog/ConfirmDialog.d.ts":"95822c4131bd","components/general/ConfirmDialog/ConfirmDialog.prompt.md":"09563d92f175","components/general/Drawer/Drawer.jsx":"90bd5c636187","components/general/Drawer/Drawer.d.ts":"b4c7623b50b4","components/general/Drawer/Drawer.prompt.md":"cef6d741663a","components/general/EmptyState/EmptyState.jsx":"5a5cf410ab62","components/general/EmptyState/EmptyState.d.ts":"0819acfb2a61","components/general/EmptyState/EmptyState.prompt.md":"8eaa263b9825","components/general/FailureAlert/FailureAlert.jsx":"0bcc344a3e94","components/general/FailureAlert/FailureAlert.d.ts":"dccca25c3391","components/general/FailureAlert/FailureAlert.prompt.md":"55729a136289","components/general/Field/Field.jsx":"a83ee8caa966","components/general/Field/Field.d.ts":"7787d0ebc58d","components/general/Field/Field.prompt.md":"a3214d49240d","components/general/Gallery/Gallery.jsx":"090b7f1ed696","components/general/Gallery/Gallery.d.ts":"c212ccce8324","components/general/Gallery/Gallery.prompt.md":"0c1fabc351f2","components/general/Input/Input.jsx":"cf2bc946c33f","components/general/Input/Input.d.ts":"19092d1ca3ff","components/general/Input/Input.prompt.md":"03c5ac340129","components/general/Pagination/Pagination.jsx":"bb45f38cbe77","components/general/Pagination/Pagination.d.ts":"ea5abd629d22","components/general/Pagination/Pagination.prompt.md":"41f8702044bf","components/general/Spinner/Spinner.jsx":"1e21c96991bf","components/general/Spinner/Spinner.d.ts":"3f0e4f6ce93e","components/general/Spinner/Spinner.prompt.md":"4fc42025eaee","components/general/Switch/Switch.jsx":"95cd31419dee","components/general/Switch/Switch.d.ts":"b4307b5f2019","components/general/Switch/Switch.prompt.md":"3c5251e74bdc","components/general/Table/Table.jsx":"f1eeb4a4e69d","components/general/Table/Table.d.ts":"13b82ae0927a","components/general/Table/Table.prompt.md":"57b0ea52a8ec","components/general/Toasts/Toasts.jsx":"ff66cf674660","components/general/Toasts/Toasts.d.ts":"2bee99036797","components/general/Toasts/Toasts.prompt.md":"764be67db9cb"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
var SillarUI = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx;
      module.exports.jsxs = jsxs;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs : jsx)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // shim:react-dom-shim
  var require_react_dom_shim = __commonJS({
    "shim:react-dom-shim"(exports, module) {
      init_define_import_meta_env();
      var D = window.ReactDOM;
      var n = function() {
      };
      module.exports = Object.assign({ preload: n, preinit: n, preconnect: n, prefetchDNS: n, preloadModule: n, preinitModule: n }, D);
    }
  });

  // ds-bundle/.pkg-entry.mjs
  var pkg_entry_exports = {};
  __export(pkg_entry_exports, {
    Alert: () => Alert,
    Badge: () => Badge,
    Button: () => Button,
    Card: () => Card,
    ConfirmDialog: () => ConfirmDialog,
    Drawer: () => Drawer,
    EmptyState: () => EmptyState,
    FailureAlert: () => FailureAlert,
    Field: () => Field,
    Gallery: () => Gallery,
    Input: () => Input,
    Pagination: () => Pagination,
    Spinner: () => Spinner,
    Switch: () => Switch,
    Table: () => Table,
    Toasts: () => Toasts,
    useEscape: () => useEscape,
    useToasts: () => useToasts
  });
  init_define_import_meta_env();

  // frontend/src/shared/ui/Gallery.tsx
  init_define_import_meta_env();

  // frontend/src/shared/ui/index.tsx
  init_define_import_meta_env();
  var import_react = __toESM(require_react_shim(), 1);
  function Button({
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    disabled,
    children,
    className,
    ...rest
  }) {
    const classes = [
      "ui-button",
      `ui-button--${variant}`,
      `ui-button--${size}`,
      block ? "ui-button--block" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("button", { className: classes, disabled: disabled || loading, "aria-busy": loading, ...rest }, loading && /* @__PURE__ */ React.createElement(Spinner, { size: "sm" }), children);
  }
  function Input({ invalid = false, className, ...rest }) {
    const classes = ["ui-input", invalid ? "ui-input--invalid" : "", className ?? ""].filter(Boolean).join(" ");
    return /* @__PURE__ */ React.createElement("input", { className: classes, "aria-invalid": invalid || void 0, ...rest });
  }
  function Field({ label, hint, error, required = false, children }) {
    const id = (0, import_react.useId)();
    const hintId = hint ? `${id}-hint` : void 0;
    const errorId = error ? `${id}-error` : void 0;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ React.createElement("div", { className: "ui-field" }, /* @__PURE__ */ React.createElement("label", { className: "ui-field__label", htmlFor: id }, label, required && /* @__PURE__ */ React.createElement("span", { className: "ui-field__required", "aria-hidden": "true" }, "*")), hint && /* @__PURE__ */ React.createElement("span", { className: "ui-field__hint", id: hintId }, hint), children({
      id,
      "aria-describedby": describedBy,
      "aria-invalid": error ? true : void 0,
      required
    }), error && /* @__PURE__ */ React.createElement("span", { className: "ui-field__error", id: errorId, role: "alert" }, error));
  }
  function Alert({ tone = "info", title, children }) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `ui-alert ui-alert--${tone}`,
        role: tone === "danger" ? "alert" : "status"
      },
      title && /* @__PURE__ */ React.createElement("span", { className: "ui-alert__title" }, title),
      children && /* @__PURE__ */ React.createElement("span", null, children)
    );
  }
  function Card({ title, subtitle, children }) {
    return /* @__PURE__ */ React.createElement("section", { className: "ui-card" }, title && /* @__PURE__ */ React.createElement("header", { className: "ui-card__header" }, /* @__PURE__ */ React.createElement("h2", { className: "ui-card__title" }, title), subtitle && /* @__PURE__ */ React.createElement("p", { className: "ui-card__subtitle" }, subtitle)), /* @__PURE__ */ React.createElement("div", { className: "ui-card__body" }, children));
  }
  function Badge({ tone = "neutral", children }) {
    return /* @__PURE__ */ React.createElement("span", { className: `ui-badge ui-badge--${tone}` }, children);
  }
  function Switch({ checked, onChange, label, disabled = false }) {
    return /* @__PURE__ */ React.createElement("label", { className: "ui-switch" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        className: "ui-switch__input",
        role: "switch",
        checked,
        disabled,
        onChange: (event) => onChange(event.target.checked)
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "ui-switch__track", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { className: "ui-switch__thumb" })), /* @__PURE__ */ React.createElement("span", { className: "ui-switch__label" }, label));
  }
  function EmptyState({ title, description, action }) {
    return /* @__PURE__ */ React.createElement("div", { className: "ui-empty" }, /* @__PURE__ */ React.createElement("p", { className: "ui-empty__title" }, title), description && /* @__PURE__ */ React.createElement("p", { className: "ui-empty__description" }, description), action);
  }
  function Spinner({ size = "md", label }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: `ui-spinner ui-spinner--${size}`, "aria-hidden": "true" }), label && /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, label));
  }

  // frontend/src/shared/ui/Gallery.tsx
  function Gallery({ items, itemKey, render, loading = false, empty }) {
    if (loading) {
      return /* @__PURE__ */ React.createElement("div", { className: "gal" }, /* @__PURE__ */ React.createElement("div", { className: "gal__state", style: { display: "flex", justifyContent: "center", padding: "var(--s7)" } }, /* @__PURE__ */ React.createElement(Spinner, { size: "lg", label: "Cargando archivos" })));
    }
    if (items.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { className: "gal" }, /* @__PURE__ */ React.createElement("div", { className: "gal__state" }, empty ?? /* @__PURE__ */ React.createElement(EmptyState, { title: "No hay archivos" })));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "gal" }, items.map((item) => /* @__PURE__ */ React.createElement("div", { key: itemKey(item), style: { display: "contents" } }, render(item))));
  }

  // frontend/src/shared/ui/patterns.tsx
  init_define_import_meta_env();
  var import_react3 = __toESM(require_react_shim(), 1);
  var import_react_dom = __toESM(require_react_dom_shim(), 1);

  // frontend/src/shared/ui/useFocusTrap.ts
  init_define_import_meta_env();
  var import_react2 = __toESM(require_react_shim(), 1);
  var FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(", ");
  function useFocusTrap(container, open, onEscape) {
    (0, import_react2.useEffect)(() => {
      if (!open) {
        return;
      }
      const previous = document.activeElement;
      const element = container.current;
      const first = element?.querySelector(FOCUSABLE);
      (first ?? element)?.focus();
      function handleKeyDown(event) {
        if (event.key === "Escape") {
          event.stopPropagation();
          onEscape();
          return;
        }
        if (event.key !== "Tab" || !element) {
          return;
        }
        const focusable = [...element.querySelectorAll(FOCUSABLE)].filter(
          (candidate) => candidate.offsetParent !== null
        );
        if (focusable.length === 0) {
          return;
        }
        const start = focusable[0];
        const end = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === start) {
          event.preventDefault();
          end.focus();
        } else if (!event.shiftKey && document.activeElement === end) {
          event.preventDefault();
          start.focus();
        }
      }
      document.addEventListener("keydown", handleKeyDown, true);
      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
        previous?.focus?.();
      };
    }, [container, open, onEscape]);
  }

  // frontend/src/shared/ui/patterns.tsx
  function Drawer({ open, title, description, onClose, footer, children }) {
    const panel = (0, import_react3.useRef)(null);
    useFocusTrap(panel, open, onClose);
    if (!open) {
      return null;
    }
    return (0, import_react_dom.createPortal)(
      /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "ui-drawer__backdrop", onClick: onClose, "aria-hidden": "true" }), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "ui-drawer",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "drawer-titulo",
          ref: panel,
          tabIndex: -1
        },
        /* @__PURE__ */ React.createElement("header", { className: "ui-drawer__header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "ui-drawer__title", id: "drawer-titulo" }, title), description && /* @__PURE__ */ React.createElement("p", { className: "ui-drawer__description" }, description)), /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            className: "ui-drawer__close",
            onClick: onClose,
            "aria-label": "Cerrar"
          },
          "\xD7"
        )),
        /* @__PURE__ */ React.createElement("div", { className: "ui-drawer__body" }, children),
        footer && /* @__PURE__ */ React.createElement("footer", { className: "ui-drawer__footer" }, footer)
      )),
      document.body
    );
  }
  function ConfirmDialog({
    open,
    title,
    children,
    confirmLabel,
    danger = false,
    busy = false,
    onConfirm,
    onCancel
  }) {
    const panel = (0, import_react3.useRef)(null);
    useFocusTrap(panel, open, onCancel);
    if (!open) {
      return null;
    }
    return (0, import_react_dom.createPortal)(
      /* @__PURE__ */ React.createElement("div", { className: "ui-dialog__backdrop" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "ui-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": "dialogo-titulo",
          ref: panel,
          tabIndex: -1
        },
        /* @__PURE__ */ React.createElement("h2", { className: "ui-dialog__title", id: "dialogo-titulo" }, title),
        /* @__PURE__ */ React.createElement("div", { className: "ui-dialog__body" }, children),
        /* @__PURE__ */ React.createElement("div", { className: "ui-dialog__footer" }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", onClick: onCancel, disabled: busy }, "Cancelar"), /* @__PURE__ */ React.createElement(Button, { variant: danger ? "danger" : "primary", onClick: onConfirm, loading: busy }, confirmLabel))
      )),
      document.body
    );
  }
  function useToasts() {
    const [toasts, setToasts] = (0, import_react3.useState)([]);
    const next = (0, import_react3.useRef)(0);
    const show = (0, import_react3.useCallback)((message, tone = "success") => {
      const id = next.current++;
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4e3);
    }, []);
    return { toasts, show };
  }
  function Toasts({ toasts }) {
    if (toasts.length === 0) {
      return null;
    }
    return (0, import_react_dom.createPortal)(
      /* @__PURE__ */ React.createElement("div", { className: "ui-toasts", role: "status", "aria-live": "polite" }, toasts.map((toast) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: toast.id,
          className: `ui-toast${toast.tone === "danger" ? " ui-toast--danger" : ""}`
        },
        toast.message
      ))),
      document.body
    );
  }
  function Table({
    columns,
    rows,
    rowKey,
    dimmed,
    loading = false,
    empty,
    pagination
  }) {
    return /* @__PURE__ */ React.createElement("div", { className: "ui-table-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "ui-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ui-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, columns.map((column) => /* @__PURE__ */ React.createElement(
      "th",
      {
        key: column.key,
        className: column.align === "right" ? "ui-table__actions" : void 0
      },
      column.header
    )))), /* @__PURE__ */ React.createElement("tbody", null, loading && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: columns.length, className: "ui-table__state" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Spinner, { label: "Cargando" })))), !loading && rows.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: columns.length, className: "ui-table__state" }, empty ?? /* @__PURE__ */ React.createElement(EmptyState, { title: "No hay nada que mostrar" }))), !loading && rows.map((row) => /* @__PURE__ */ React.createElement("tr", { key: rowKey(row), "data-dimmed": dimmed?.(row) ?? false }, columns.map((column) => /* @__PURE__ */ React.createElement(
      "td",
      {
        key: column.key,
        className: column.align === "right" ? "ui-table__actions" : void 0
      },
      column.render(row)
    ))))))), pagination && /* @__PURE__ */ React.createElement(Pagination, { ...pagination }));
  }
  function Pagination({ page, totalPages, totalItems, onChange }) {
    if (totalItems === 0) {
      return null;
    }
    return /* @__PURE__ */ React.createElement("div", { className: "ui-pagination" }, /* @__PURE__ */ React.createElement("span", null, totalItems, " ", totalItems === 1 ? "resultado" : "resultados", totalPages > 1 && ` \xB7 p\xE1gina ${page} de ${totalPages}`), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "ui-pagination__buttons" }, /* @__PURE__ */ React.createElement(Button, { size: "sm", variant: "secondary", disabled: page <= 1, onClick: () => onChange(page - 1) }, "Anterior"), /* @__PURE__ */ React.createElement(
      Button,
      {
        size: "sm",
        variant: "secondary",
        disabled: page >= totalPages,
        onClick: () => onChange(page + 1)
      },
      "Siguiente"
    )));
  }
  function FailureAlert({ failure }) {
    if (!failure || failure.kind === "silent" || !failure.message) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(Alert, { tone: "danger" }, failure.message);
  }
  function useEscape(active, onEscape) {
    (0, import_react3.useEffect)(() => {
      if (!active) {
        return;
      }
      function handle(event) {
        if (event.key === "Escape") {
          onEscape();
        }
      }
      document.addEventListener("keydown", handle);
      return () => document.removeEventListener("keydown", handle);
    }, [active, onEscape]);
  }
  return __toCommonJS(pkg_entry_exports);
})();
window.SillarUI=SillarUI.__dsMainNs?Object.assign({},SillarUI,SillarUI.__dsMainNs,{__dsMainNs:undefined}):SillarUI;
