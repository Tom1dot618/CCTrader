
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var BybitEndPointUrl;
    (function (BybitEndPointUrl) {
        BybitEndPointUrl["MainnetStreamInversePerpetual"] = "wss://stream.bybit.com/realtime";
        BybitEndPointUrl["MainnetStreamSpot"] = "wss://stream.bybit.com/spot/ws";
        BybitEndPointUrl["MainnetRestServer1"] = "https://api.bybit.com";
        BybitEndPointUrl["MainnetRestServer2"] = "https://api.bytick.com";
    })(BybitEndPointUrl || (BybitEndPointUrl = {}));
    var BybitRestEndPoint;
    (function (BybitRestEndPoint) {
        BybitRestEndPoint["QuerySymbols"] = "/v2/public/symbols";
    })(BybitRestEndPoint || (BybitRestEndPoint = {}));
    var ByBitContractStatus;
    (function (ByBitContractStatus) {
        ByBitContractStatus["Trading"] = "Trading";
        ByBitContractStatus["Settling"] = "Settling";
        ByBitContractStatus["Closed"] = "Closed";
    })(ByBitContractStatus || (ByBitContractStatus = {}));
    var ByBitStreamTopics;
    (function (ByBitStreamTopics) {
        ByBitStreamTopics["Trade"] = "trade";
        ByBitStreamTopics["OrderbookLevel2"] = "orderBookL2_25";
    })(ByBitStreamTopics || (ByBitStreamTopics = {}));

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    //--- Stores
    const DEBUG = readable(true);
    const pairs = writable([]);
    const subscriptions = writable([]);

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    /* node_modules/@smui/layout-grid/dist/InnerGrid.svelte generated by Svelte v3.47.0 */
    const file$9 = "node_modules/@smui/layout-grid/dist/InnerGrid.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();

    			attr_dev(div, "class", div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__inner': true
    			}));

    			add_location(div, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__inner': true
    			}))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InnerGrid', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	const writable_props = ['use', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InnerGrid> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('class' in $$props) $$invalidate(1, className = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('use' in $$props) $$invalidate(0, use = $$props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		element,
    		forwardEvents,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class InnerGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { use: 0, class: 1, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InnerGrid",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get use() {
    		throw new Error("<InnerGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<InnerGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<InnerGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/layout-grid/dist/LayoutGrid.svelte generated by Svelte v3.47.0 */
    const file$8 = "node_modules/@smui/layout-grid/dist/LayoutGrid.svelte";

    // (13:2) <InnerGrid {...prefixFilter($$restProps, 'innerGrid$')}>
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(13:2) <InnerGrid {...prefixFilter($$restProps, 'innerGrid$')}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let innergrid;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const innergrid_spread_levels = [prefixFilter(/*$$restProps*/ ctx[6], 'innerGrid$')];

    	let innergrid_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < innergrid_spread_levels.length; i += 1) {
    		innergrid_props = assign(innergrid_props, innergrid_spread_levels[i]);
    	}

    	innergrid = new InnerGrid({ props: innergrid_props, $$inline: true });

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid': true,
    				'mdc-layout-grid--fixed-column-width': /*fixedColumnWidth*/ ctx[2],
    				['mdc-layout-grid--align-' + /*align*/ ctx[3]]: /*align*/ ctx[3] != null
    			})
    		},
    		exclude(/*$$restProps*/ ctx[6], ['innerGrid$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(innergrid.$$.fragment);
    			set_attributes(div, div_data);
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(innergrid, div, null);
    			/*div_binding*/ ctx[9](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[5].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const innergrid_changes = (dirty & /*prefixFilter, $$restProps*/ 64)
    			? get_spread_update(innergrid_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[6], 'innerGrid$'))])
    			: {};

    			if (dirty & /*$$scope*/ 1024) {
    				innergrid_changes.$$scope = { dirty, ctx };
    			}

    			innergrid.$set(innergrid_changes);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, fixedColumnWidth, align*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-layout-grid': true,
    					'mdc-layout-grid--fixed-column-width': /*fixedColumnWidth*/ ctx[2],
    					['mdc-layout-grid--align-' + /*align*/ ctx[3]]: /*align*/ ctx[3] != null
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 64 && exclude(/*$$restProps*/ ctx[6], ['innerGrid$'])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(innergrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(innergrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(innergrid);
    			/*div_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","fixedColumnWidth","align","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayoutGrid', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { fixedColumnWidth = false } = $$props;
    	let { align = undefined } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('fixedColumnWidth' in $$new_props) $$invalidate(2, fixedColumnWidth = $$new_props.fixedColumnWidth);
    		if ('align' in $$new_props) $$invalidate(3, align = $$new_props.align);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		InnerGrid,
    		forwardEvents,
    		use,
    		className,
    		fixedColumnWidth,
    		align,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('fixedColumnWidth' in $$props) $$invalidate(2, fixedColumnWidth = $$new_props.fixedColumnWidth);
    		if ('align' in $$props) $$invalidate(3, align = $$new_props.align);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		fixedColumnWidth,
    		align,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class LayoutGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			use: 0,
    			class: 1,
    			fixedColumnWidth: 2,
    			align: 3,
    			getElement: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoutGrid",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixedColumnWidth() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixedColumnWidth(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<LayoutGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<LayoutGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/layout-grid/dist/Cell.svelte generated by Svelte v3.47.0 */
    const file$7 = "node_modules/@smui/layout-grid/dist/Cell.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-layout-grid__cell': true,
    				['mdc-layout-grid__cell--align-' + /*align*/ ctx[2]]: /*align*/ ctx[2] != null,
    				['mdc-layout-grid__cell--order-' + /*order*/ ctx[3]]: /*order*/ ctx[3] != null,
    				['mdc-layout-grid__cell--span-' + /*span*/ ctx[4]]: /*span*/ ctx[4] != null,
    				...Object.fromEntries(Object.entries(/*spanDevices*/ ctx[5]).map(func))
    			})
    		},
    		/*$$restProps*/ ctx[8]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[12](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, align, order, span, spanDevices*/ 62 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-layout-grid__cell': true,
    					['mdc-layout-grid__cell--align-' + /*align*/ ctx[2]]: /*align*/ ctx[2] != null,
    					['mdc-layout-grid__cell--order-' + /*order*/ ctx[3]]: /*order*/ ctx[3] != null,
    					['mdc-layout-grid__cell--span-' + /*span*/ ctx[4]]: /*span*/ ctx[4] != null,
    					...Object.fromEntries(Object.entries(/*spanDevices*/ ctx[5]).map(func))
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([device, span]) => [`mdc-layout-grid__cell--span-${span}-${device}`, true];

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","order","span","spanDevices","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cell', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = undefined } = $$props;
    	let { order = undefined } = $$props;
    	let { span = undefined } = $$props;
    	let { spanDevices = {} } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('order' in $$new_props) $$invalidate(3, order = $$new_props.order);
    		if ('span' in $$new_props) $$invalidate(4, span = $$new_props.span);
    		if ('spanDevices' in $$new_props) $$invalidate(5, spanDevices = $$new_props.spanDevices);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		order,
    		span,
    		spanDevices,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('order' in $$props) $$invalidate(3, order = $$new_props.order);
    		if ('span' in $$props) $$invalidate(4, span = $$new_props.span);
    		if ('spanDevices' in $$props) $$invalidate(5, spanDevices = $$new_props.spanDevices);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		order,
    		span,
    		spanDevices,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Cell$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			order: 3,
    			span: 4,
    			spanDevices: 5,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get order() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spanDevices() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spanDevices(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Cell = Cell$1;

    class Message {
        constructor(event) {
            this.topic = "";
            this.pair = "";
            this.type = "";
            this.data = [];
            const message = JSON.parse(event.data);
            this.topic = message.topic;
            this.pair = message.topic.split(".")[1];
            this.type = message.topic.split(".")[0];
            this.data = message.data;
        }
        get isTrade() {
            return this.type === ByBitStreamTopics.Trade;
        }
        get isOrderbookLevel2() {
            return this.type === ByBitStreamTopics.OrderbookLevel2;
        }
    }

    //===================== WEBSERVICE ================================
    class StreamService {
        constructor(endPointUrl, subscriptions, onMessage) {
            const webSocket = new WebSocket(endPointUrl);
            //================== onOpen ======================
            webSocket.onopen = function (event) {
                //--- set heartbeat timer
                (function () {
                    setInterval((function fn() {
                        webSocket.send('{"op":"ping"}');
                        return fn;
                    })(), 30000);
                })();
                //--- subscribe
                subscriptions.map((subscription) => webSocket.send(JSON.stringify({
                    op: "subscribe",
                    args: [subscription.topic],
                })));
            };
            //================== onMessage ======================
            webSocket.onmessage = function (event) {
                if (JSON.parse(event.data).hasOwnProperty("topic")) {
                    onMessage(new Message(event));
                }
            };
        }
    }

    class FetchUtils {
        static createRestUrl(endPoint) {
            let url = `${BybitEndPointUrl.MainnetRestServer1}${endPoint}`;
            return url;
        }
    }

    /* src/Components/Bubble/BubbleItem.svelte generated by Svelte v3.47.0 */

    const file$6 = "src/Components/Bubble/BubbleItem.svelte";

    function create_fragment$7(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = /*bubble*/ ctx[0].x);
    			attr_dev(circle, "cy", circle_cy_value = /*bubble*/ ctx[0].y);
    			attr_dev(circle, "r", circle_r_value = /*bubble*/ ctx[0].radius);
    			attr_dev(circle, "fill", circle_fill_value = /*bubble*/ ctx[0].fillColor);
    			add_location(circle, file$6, 11, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(circle, "mouseenter", showVolume, false, false, false),
    					listen_dev(circle, "mouseleave", reset, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*bubble*/ 1 && circle_cx_value !== (circle_cx_value = /*bubble*/ ctx[0].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*bubble*/ 1 && circle_cy_value !== (circle_cy_value = /*bubble*/ ctx[0].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*bubble*/ 1 && circle_r_value !== (circle_r_value = /*bubble*/ ctx[0].radius)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*bubble*/ 1 && circle_fill_value !== (circle_fill_value = /*bubble*/ ctx[0].fillColor)) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function showVolume(event) {
    	event.target.setAttribute("fill", "#ffffff");
    }

    function reset(event) {
    	event.target.setAttribute("fill", "#000000");
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BubbleItem', slots, []);
    	let { bubble } = $$props;
    	const writable_props = ['bubble'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BubbleItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('bubble' in $$props) $$invalidate(0, bubble = $$props.bubble);
    	};

    	$$self.$capture_state = () => ({ bubble, showVolume, reset });

    	$$self.$inject_state = $$props => {
    		if ('bubble' in $$props) $$invalidate(0, bubble = $$props.bubble);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bubble];
    }

    class BubbleItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { bubble: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BubbleItem",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bubble*/ ctx[0] === undefined && !('bubble' in props)) {
    			console.warn("<BubbleItem> was created without expected prop 'bubble'");
    		}
    	}

    	get bubble() {
    		throw new Error("<BubbleItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bubble(value) {
    		throw new Error("<BubbleItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Bubble/BubbleList.svelte generated by Svelte v3.47.0 */
    const file$5 = "src/Components/Bubble/BubbleList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (27:4) {#each bubbles as bubble}
    function create_each_block(ctx) {
    	let bubbleitem;
    	let current;

    	bubbleitem = new BubbleItem({
    			props: { bubble: /*bubble*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bubbleitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bubbleitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bubbleitem_changes = {};
    			if (dirty & /*bubbles*/ 4) bubbleitem_changes.bubble = /*bubble*/ ctx[3];
    			bubbleitem.$set(bubbleitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bubbleitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bubbleitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bubbleitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(27:4) {#each bubbles as bubble}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let defs;
    	let filter;
    	let feGaussianBlur;
    	let feColorMatrix;
    	let feBlend;
    	let g;
    	let rect0;
    	let rect0_y_value;
    	let rect1;
    	let svg_viewBox_value;
    	let current;
    	let each_value = /*bubbles*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			filter = svg_element("filter");
    			feGaussianBlur = svg_element("feGaussianBlur");
    			feColorMatrix = svg_element("feColorMatrix");
    			feBlend = svg_element("feBlend");
    			g = svg_element("g");
    			rect0 = svg_element("rect");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			rect1 = svg_element("rect");
    			attr_dev(feGaussianBlur, "in", "SourceGraphic");
    			attr_dev(feGaussianBlur, "stdDeviation", "8");
    			add_location(feGaussianBlur, file$5, 13, 6, 341);
    			attr_dev(feColorMatrix, "in", "blur");
    			attr_dev(feColorMatrix, "type", "matrix");
    			attr_dev(feColorMatrix, "values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -5");
    			add_location(feColorMatrix, file$5, 14, 6, 402);
    			add_location(feBlend, file$5, 19, 6, 534);
    			attr_dev(filter, "id", "goo");
    			add_location(filter, file$5, 12, 4, 317);
    			add_location(defs, file$5, 10, 2, 273);
    			attr_dev(rect0, "x", "0");
    			attr_dev(rect0, "y", rect0_y_value = /*height*/ ctx[1] - 10);
    			attr_dev(rect0, "width", /*width*/ ctx[0]);
    			attr_dev(rect0, "height", "10");
    			attr_dev(rect0, "opacity", "0.5");
    			add_location(rect0, file$5, 25, 4, 626);
    			attr_dev(rect1, "x", "0");
    			attr_dev(rect1, "y", "0");
    			attr_dev(rect1, "width", /*width*/ ctx[0]);
    			attr_dev(rect1, "height", "10");
    			attr_dev(rect1, "opacity", "0.5");
    			add_location(rect1, file$5, 29, 4, 767);
    			attr_dev(g, "filter", "url(#goo)");
    			add_location(g, file$5, 24, 2, 599);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1]);
    			add_location(svg, file$5, 9, 0, 221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, filter);
    			append_dev(filter, feGaussianBlur);
    			append_dev(filter, feColorMatrix);
    			append_dev(filter, feBlend);
    			append_dev(svg, g);
    			append_dev(g, rect0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, rect1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*height*/ 2 && rect0_y_value !== (rect0_y_value = /*height*/ ctx[1] - 10)) {
    				attr_dev(rect0, "y", rect0_y_value);
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(rect0, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*bubbles*/ 4) {
    				each_value = /*bubbles*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, rect1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(rect1, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*width, height*/ 3 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BubbleList', slots, []);
    	let { width } = $$props;
    	let { height } = $$props;
    	let { bubbles } = $$props;
    	const writable_props = ['width', 'height', 'bubbles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BubbleList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('bubbles' in $$props) $$invalidate(2, bubbles = $$props.bubbles);
    	};

    	$$self.$capture_state = () => ({ BubbleItem, width, height, bubbles });

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('bubbles' in $$props) $$invalidate(2, bubbles = $$props.bubbles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, bubbles];
    }

    class BubbleList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { width: 0, height: 1, bubbles: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BubbleList",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<BubbleList> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console.warn("<BubbleList> was created without expected prop 'height'");
    		}

    		if (/*bubbles*/ ctx[2] === undefined && !('bubbles' in props)) {
    			console.warn("<BubbleList> was created without expected prop 'bubbles'");
    		}
    	}

    	get width() {
    		throw new Error("<BubbleList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<BubbleList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<BubbleList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<BubbleList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bubbles() {
    		throw new Error("<BubbleList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bubbles(value) {
    		throw new Error("<BubbleList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/MarketOrders/MarketOrdersPairName.svelte generated by Svelte v3.47.0 */

    const file$4 = "src/Components/MarketOrders/MarketOrdersPairName.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let span0;
    	let t2;
    	let t3;
    	let span1;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*baseCurrency*/ ctx[0]);
    			t1 = space();
    			span0 = element("span");
    			t2 = text(/*quoteCurrency*/ ctx[1]);
    			t3 = space();
    			span1 = element("span");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(span0, "class", "card-subheader svelte-1aj7i59");
    			add_location(span0, file$4, 7, 2, 155);
    			attr_dev(path0, "d", "M62.0083 25.3572V3H66.5022V25.3572H62.0083Z");
    			attr_dev(path0, "fill", "#F7A600");
    			add_location(path0, file$4, 17, 6, 365);
    			attr_dev(path1, "d", "M9.63407 31.9983H0V9.64111H9.24666C13.7406 9.64111 16.3591 12.0903 16.3591 15.9214C16.3591 18.4013 14.6774 20.0039 13.5134 20.5375C14.9028 21.1652 16.6813 22.5779 16.6813 25.5624C16.6813 29.7373 13.7406 31.9983 9.63407 31.9983ZM8.89096 13.5355H4.4939V18.6852H8.89096C10.7981 18.6852 11.8652 17.6488 11.8652 16.1095C11.8652 14.5719 10.7981 13.5355 8.89096 13.5355ZM9.18151 22.6104H4.4939V28.1056H9.18151C11.2189 28.1056 12.1874 26.8503 12.1874 25.3418C12.1874 23.835 11.2171 22.6104 9.18151 22.6104Z");
    			attr_dev(path1, "fill", "white");
    			add_location(path1, file$4, 18, 6, 443);
    			attr_dev(path2, "d", "M30.3882 22.8293V31.9983H25.926V22.8293L19.0073 9.64111H23.8886L28.1888 18.6527L32.4239 9.64111H37.3052L30.3882 22.8293Z");
    			attr_dev(path2, "fill", "white");
    			add_location(path2, file$4, 22, 6, 996);
    			attr_dev(path3, "d", "M50.0457 31.9983H40.4116V9.64111H49.6583C54.1522 9.64111 56.7707 12.0903 56.7707 15.9214C56.7707 18.4013 55.089 20.0039 53.925 20.5375C55.3144 21.1652 57.093 22.5779 57.093 25.5624C57.093 29.7373 54.1522 31.9983 50.0457 31.9983ZM49.3026 13.5355H44.9055V18.6852H49.3026C51.2097 18.6852 52.2768 17.6488 52.2768 16.1095C52.2768 14.5719 51.2097 13.5355 49.3026 13.5355ZM49.5931 22.6104H44.9055V28.1056H49.5931C51.6305 28.1056 52.599 26.8503 52.599 25.3418C52.599 23.835 51.6305 22.6104 49.5931 22.6104Z");
    			attr_dev(path3, "fill", "white");
    			add_location(path3, file$4, 26, 6, 1171);
    			attr_dev(path4, "d", "M80.986 13.5355V32H76.4921V13.5355H70.4785V9.64111H86.9996V13.5355H80.986Z");
    			attr_dev(path4, "fill", "white");
    			add_location(path4, file$4, 30, 6, 1724);
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "viewBox", "0 0 87 34");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$4, 11, 4, 246);
    			attr_dev(span1, "class", "card-logo svelte-1aj7i59");
    			add_location(span1, file$4, 10, 2, 217);
    			attr_dev(div, "class", "card-header svelte-1aj7i59");
    			add_location(div, file$4, 5, 0, 110);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, span0);
    			append_dev(span0, t2);
    			append_dev(div, t3);
    			append_dev(div, span1);
    			append_dev(span1, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*baseCurrency*/ 1) set_data_dev(t0, /*baseCurrency*/ ctx[0]);
    			if (dirty & /*quoteCurrency*/ 2) set_data_dev(t2, /*quoteCurrency*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MarketOrdersPairName', slots, []);
    	let { baseCurrency } = $$props;
    	let { quoteCurrency } = $$props;
    	const writable_props = ['baseCurrency', 'quoteCurrency'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MarketOrdersPairName> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('baseCurrency' in $$props) $$invalidate(0, baseCurrency = $$props.baseCurrency);
    		if ('quoteCurrency' in $$props) $$invalidate(1, quoteCurrency = $$props.quoteCurrency);
    	};

    	$$self.$capture_state = () => ({ baseCurrency, quoteCurrency });

    	$$self.$inject_state = $$props => {
    		if ('baseCurrency' in $$props) $$invalidate(0, baseCurrency = $$props.baseCurrency);
    		if ('quoteCurrency' in $$props) $$invalidate(1, quoteCurrency = $$props.quoteCurrency);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [baseCurrency, quoteCurrency];
    }

    class MarketOrdersPairName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { baseCurrency: 0, quoteCurrency: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarketOrdersPairName",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*baseCurrency*/ ctx[0] === undefined && !('baseCurrency' in props)) {
    			console.warn("<MarketOrdersPairName> was created without expected prop 'baseCurrency'");
    		}

    		if (/*quoteCurrency*/ ctx[1] === undefined && !('quoteCurrency' in props)) {
    			console.warn("<MarketOrdersPairName> was created without expected prop 'quoteCurrency'");
    		}
    	}

    	get baseCurrency() {
    		throw new Error("<MarketOrdersPairName>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseCurrency(value) {
    		throw new Error("<MarketOrdersPairName>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quoteCurrency() {
    		throw new Error("<MarketOrdersPairName>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quoteCurrency(value) {
    		throw new Error("<MarketOrdersPairName>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/MarketOrders/MarketOrdersStatisticsLine.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/Components/MarketOrders/MarketOrdersStatisticsLine.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let span2;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(/*buy*/ ctx[0]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*label*/ ctx[1]);
    			t3 = space();
    			span2 = element("span");
    			t4 = text(/*sell*/ ctx[2]);
    			attr_dev(span0, "class", "buy " + /*addBigClass*/ ctx[3] + " svelte-shkn23");
    			add_location(span0, file$3, 10, 2, 231);
    			attr_dev(span1, "class", "label svelte-shkn23");
    			add_location(span1, file$3, 11, 2, 278);
    			attr_dev(span2, "class", "sell " + /*addBigClass*/ ctx[3] + " svelte-shkn23");
    			add_location(span2, file$3, 12, 2, 315);
    			attr_dev(div, "class", "summary svelte-shkn23");
    			add_location(div, file$3, 9, 0, 207);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    			append_dev(div, t3);
    			append_dev(div, span2);
    			append_dev(span2, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buy*/ 1) set_data_dev(t0, /*buy*/ ctx[0]);
    			if (dirty & /*label*/ 2) set_data_dev(t2, /*label*/ ctx[1]);
    			if (dirty & /*sell*/ 4) set_data_dev(t4, /*sell*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MarketOrdersStatisticsLine', slots, []);
    	let { variant = "" } = $$props;
    	let { buy } = $$props;
    	let { label } = $$props;
    	let { sell } = $$props;
    	const addBigClass = variant === "big" ? "big" : "";
    	const writable_props = ['variant', 'buy', 'label', 'sell'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MarketOrdersStatisticsLine> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('variant' in $$props) $$invalidate(4, variant = $$props.variant);
    		if ('buy' in $$props) $$invalidate(0, buy = $$props.buy);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('sell' in $$props) $$invalidate(2, sell = $$props.sell);
    	};

    	$$self.$capture_state = () => ({ variant, buy, label, sell, addBigClass });

    	$$self.$inject_state = $$props => {
    		if ('variant' in $$props) $$invalidate(4, variant = $$props.variant);
    		if ('buy' in $$props) $$invalidate(0, buy = $$props.buy);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('sell' in $$props) $$invalidate(2, sell = $$props.sell);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [buy, label, sell, addBigClass, variant];
    }

    class MarketOrdersStatisticsLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { variant: 4, buy: 0, label: 1, sell: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarketOrdersStatisticsLine",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*buy*/ ctx[0] === undefined && !('buy' in props)) {
    			console.warn("<MarketOrdersStatisticsLine> was created without expected prop 'buy'");
    		}

    		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
    			console.warn("<MarketOrdersStatisticsLine> was created without expected prop 'label'");
    		}

    		if (/*sell*/ ctx[2] === undefined && !('sell' in props)) {
    			console.warn("<MarketOrdersStatisticsLine> was created without expected prop 'sell'");
    		}
    	}

    	get variant() {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buy() {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buy(value) {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sell() {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sell(value) {
    		throw new Error("<MarketOrdersStatisticsLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const LOCALE = "nl-NL";
    class NumberUtils {
        static internationalizeNumber(number) {
            return new Intl.NumberFormat(LOCALE, {
                style: "decimal",
            }).format(number);
        }
        static financializeNumber(value, numberOfDecimals = 0) {
            let amountLetter = "";
            if (value >= 1000000) {
                amountLetter = "M";
                value = value / 1000000;
                numberOfDecimals = 2;
            }
            else if (value >= 1000) {
                amountLetter = "K";
                value = value / 1000;
            }
            value = Number.parseFloat(value.toFixed(numberOfDecimals));
            return `${this.internationalizeNumber(value)}${amountLetter}`;
        }
        static formatPrice(value, numberOfDecimals = 1) {
            let currencySign = "$";
            value = Number.parseFloat(value.toFixed(numberOfDecimals));
            return `${currencySign}${this.internationalizeNumber(value)}`;
        }
        static hasDecimals(value) {
            return value - Math.floor(value) !== 0;
        }
        static removeZeroDecimal(value) {
            return this.hasDecimals(value) ? value.toFixed(1) : value.toFixed(0);
        }
    }

    /* src/Components/MarketOrders/MarketOrdersWidget.svelte generated by Svelte v3.47.0 */
    const file$2 = "src/Components/MarketOrders/MarketOrdersWidget.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let marketorderspairname;
    	let t0;
    	let hr0;
    	let t1;
    	let marketordersstatisticsline0;
    	let t2;
    	let marketordersstatisticsline1;
    	let t3;
    	let marketordersstatisticsline2;
    	let t4;
    	let div0;
    	let t5;
    	let hr1;
    	let t6;
    	let bubblelist;
    	let current;

    	marketorderspairname = new MarketOrdersPairName({
    			props: {
    				baseCurrency: /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].pair.base_currency,
    				quoteCurrency: /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].pair.quote_currency
    			},
    			$$inline: true
    		});

    	marketordersstatisticsline0 = new MarketOrdersStatisticsLine({
    			props: {
    				buy: NumberUtils.internationalizeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].numberOfBuys),
    				label: "amount",
    				sell: NumberUtils.internationalizeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].numberOfSells)
    			},
    			$$inline: true
    		});

    	marketordersstatisticsline1 = new MarketOrdersStatisticsLine({
    			props: {
    				variant: "big",
    				buy: NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].buyVolume),
    				label: "volume",
    				sell: NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].sellVolume)
    			},
    			$$inline: true
    		});

    	marketordersstatisticsline2 = new MarketOrdersStatisticsLine({
    			props: {
    				buy: NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].averageBuyVolume),
    				label: "average",
    				sell: NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].averageSellVolume)
    			},
    			$$inline: true
    		});

    	bubblelist = new BubbleList({
    			props: {
    				width: /*width*/ ctx[1],
    				height: /*height*/ ctx[2],
    				bubbles: /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].bubbles
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(marketorderspairname.$$.fragment);
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			create_component(marketordersstatisticsline0.$$.fragment);
    			t2 = space();
    			create_component(marketordersstatisticsline1.$$.fragment);
    			t3 = space();
    			create_component(marketordersstatisticsline2.$$.fragment);
    			t4 = space();
    			div0 = element("div");
    			t5 = space();
    			hr1 = element("hr");
    			t6 = space();
    			create_component(bubblelist.$$.fragment);
    			attr_dev(hr0, "class", "svelte-dw7loo");
    			add_location(hr0, file$2, 19, 2, 640);
    			attr_dev(div0, "class", "clear");
    			add_location(div0, file$2, 42, 2, 1352);
    			attr_dev(hr1, "class", "svelte-dw7loo");
    			add_location(hr1, file$2, 44, 2, 1395);
    			attr_dev(div1, "class", "card svelte-dw7loo");
    			add_location(div1, file$2, 12, 0, 431);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(marketorderspairname, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, hr0);
    			append_dev(div1, t1);
    			mount_component(marketordersstatisticsline0, div1, null);
    			append_dev(div1, t2);
    			mount_component(marketordersstatisticsline1, div1, null);
    			append_dev(div1, t3);
    			mount_component(marketordersstatisticsline2, div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, hr1);
    			append_dev(div1, t6);
    			mount_component(bubblelist, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const marketorderspairname_changes = {};
    			if (dirty & /*$subscriptions, index*/ 9) marketorderspairname_changes.baseCurrency = /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].pair.base_currency;
    			if (dirty & /*$subscriptions, index*/ 9) marketorderspairname_changes.quoteCurrency = /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].pair.quote_currency;
    			marketorderspairname.$set(marketorderspairname_changes);
    			const marketordersstatisticsline0_changes = {};
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline0_changes.buy = NumberUtils.internationalizeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].numberOfBuys);
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline0_changes.sell = NumberUtils.internationalizeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].numberOfSells);
    			marketordersstatisticsline0.$set(marketordersstatisticsline0_changes);
    			const marketordersstatisticsline1_changes = {};
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline1_changes.buy = NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].buyVolume);
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline1_changes.sell = NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].sellVolume);
    			marketordersstatisticsline1.$set(marketordersstatisticsline1_changes);
    			const marketordersstatisticsline2_changes = {};
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline2_changes.buy = NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].averageBuyVolume);
    			if (dirty & /*$subscriptions, index*/ 9) marketordersstatisticsline2_changes.sell = NumberUtils.financializeNumber(/*$subscriptions*/ ctx[3][/*index*/ ctx[0]].averageSellVolume);
    			marketordersstatisticsline2.$set(marketordersstatisticsline2_changes);
    			const bubblelist_changes = {};
    			if (dirty & /*width*/ 2) bubblelist_changes.width = /*width*/ ctx[1];
    			if (dirty & /*height*/ 4) bubblelist_changes.height = /*height*/ ctx[2];
    			if (dirty & /*$subscriptions, index*/ 9) bubblelist_changes.bubbles = /*$subscriptions*/ ctx[3][/*index*/ ctx[0]].bubbles;
    			bubblelist.$set(bubblelist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketorderspairname.$$.fragment, local);
    			transition_in(marketordersstatisticsline0.$$.fragment, local);
    			transition_in(marketordersstatisticsline1.$$.fragment, local);
    			transition_in(marketordersstatisticsline2.$$.fragment, local);
    			transition_in(bubblelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketorderspairname.$$.fragment, local);
    			transition_out(marketordersstatisticsline0.$$.fragment, local);
    			transition_out(marketordersstatisticsline1.$$.fragment, local);
    			transition_out(marketordersstatisticsline2.$$.fragment, local);
    			transition_out(bubblelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(marketorderspairname);
    			destroy_component(marketordersstatisticsline0);
    			destroy_component(marketordersstatisticsline1);
    			destroy_component(marketordersstatisticsline2);
    			destroy_component(bubblelist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $subscriptions;
    	validate_store(subscriptions, 'subscriptions');
    	component_subscribe($$self, subscriptions, $$value => $$invalidate(3, $subscriptions = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MarketOrdersWidget', slots, []);
    	let { index } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	const writable_props = ['index', 'width', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MarketOrdersWidget> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({
    		subscriptions,
    		BubbleList,
    		MarketOrdersPairName,
    		MarketOrdersStatisticsLine,
    		NumberUtils,
    		index,
    		width,
    		height,
    		$subscriptions
    	});

    	$$self.$inject_state = $$props => {
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [index, width, height, $subscriptions];
    }

    class MarketOrdersWidget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { index: 0, width: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarketOrdersWidget",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*index*/ ctx[0] === undefined && !('index' in props)) {
    			console.warn("<MarketOrdersWidget> was created without expected prop 'index'");
    		}

    		if (/*width*/ ctx[1] === undefined && !('width' in props)) {
    			console.warn("<MarketOrdersWidget> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !('height' in props)) {
    			console.warn("<MarketOrdersWidget> was created without expected prop 'height'");
    		}
    	}

    	get index() {
    		throw new Error("<MarketOrdersWidget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<MarketOrdersWidget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<MarketOrdersWidget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<MarketOrdersWidget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<MarketOrdersWidget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<MarketOrdersWidget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //--- create bubble
    function createBubble(trade, width, height) {
        //-- initial values
        const radius = trade.size < 1000 ? 7 : (trade.size / 10000) * 10;
        let velocity = 5;
        let x = Math.random() * width;
        let y = height;
        let color = trade.side === "Buy" ? "darkgreen" : "darkred";
        //--- keep space on both sides for the text
        const spacing = 100;
        if (x - radius < 0) {
            x += x - radius + spacing;
        }
        else if (x + radius > width) {
            x -= width - (x + radius) - spacing;
        }
        //--- text
        let sizeDescription = trade.size.toString();
        let fontSize = "0.5";
        //--- font and velocity based on trade size
        if (trade.size >= 1000 * 1000) {
            sizeDescription =
                NumberUtils.removeZeroDecimal((trade.size / 1000) * 1000) + "M";
            fontSize = "1.5";
            velocity = 1;
        }
        else if (trade.size >= 100 * 1000) {
            sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
            fontSize = "1";
            velocity = 1.5;
        }
        else if (trade.size >= 10 * 1000) {
            sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
            fontSize = "0.9";
            velocity = 2;
        }
        else if (trade.size >= 1000) {
            sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
            fontSize = ".7";
            velocity = 2.5;
        }
        //--- contruct the text object
        const text = {
            x: trade.side === "Buy" ? 0 : width - 30,
            y: height + radius,
            value: sizeDescription,
            style: `font-size: ${fontSize}em;`,
            anchor: trade.side === "Buy" ? "start" : "end",
        };
        //--- construct the bubble object
        return {
            id: trade.trade_id,
            x: x,
            y: y,
            radius: radius,
            velocity: velocity,
            fillColor: color,
            text: text,
        };
    }
    /* "#27ae60" : "#c0392b", */

    const createLeverageFilter = (leverageFilter) => {
        return Object.assign(Object.assign({}, leverageFilter), { min_Leverage: leverageFilter.min_Leverage, max_leverage: leverageFilter.max_leverage, leverage_step: leverageFilter.leverage_step });
    };

    const createLotSizeFilter = (lotSizeFilter) => {
        return Object.assign(Object.assign({}, lotSizeFilter), { max_trading_qy: lotSizeFilter.max_trading_qy, min_trading_qty: lotSizeFilter.min_trading_qty, qty_step: lotSizeFilter.qty_step });
    };

    const createPriceFilter = (priceFilter) => {
        return Object.assign(Object.assign({}, priceFilter), { min_price: priceFilter.min_price, max_price: priceFilter.max_price, tick_size: priceFilter.tick_size });
    };

    const createPair = (pair) => {
        return Object.assign(Object.assign({}, pair), { leverage_filter: createLeverageFilter(pair.leverage_filter), price_filter: createPriceFilter(pair.price_filter), lot_size_filter: createLotSizeFilter(pair.lot_size_filter) });
    };

    class Subscription {
        constructor(pair, type) {
            this.pair = createPair(pair);
            this.type = type;
            this.trades = [];
            this.bubbles = [];
        }
        get topic() {
            return `${this.type}.${this.pair.alias}`;
        }
        //--- Trade statistics ---
        get numberOfBuys() {
            return this.trades.filter((trade) => trade.side === "Buy").length;
        }
        get numberOfSells() {
            return this.trades.filter((trade) => trade.side === "Sell").length;
        }
        get buyVolume() {
            return this.trades
                .filter((trade) => trade.side === "Buy")
                .reduce((acc, trade) => acc + trade.size, 0);
        }
        get sellVolume() {
            return this.trades
                .filter((trade) => trade.side === "Sell")
                .reduce((acc, trade) => acc + trade.size, 0);
        }
        get averageBuyVolume() {
            if (this.numberOfBuys === 0)
                return 0;
            return this.buyVolume / this.numberOfBuys;
        }
        get averageSellVolume() {
            if (this.numberOfSells === 0)
                return 0;
            return this.sellVolume / this.numberOfSells;
        }
    }

    /* src/Components/App.svelte generated by Svelte v3.47.0 */
    const file$1 = "src/Components/App.svelte";

    // (1:0) <script lang="ts">import { BybitEndPointUrl, BybitRestEndPoint, ByBitStreamTopics, }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { BybitEndPointUrl, BybitRestEndPoint, ByBitStreamTopics, }",
    		ctx
    	});

    	return block;
    }

    // (77:2) {:then}
    function create_then_block(ctx) {
    	let div;
    	let layoutgrid;
    	let current;

    	layoutgrid = new LayoutGrid({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layoutgrid.$$.fragment);
    			attr_dev(div, "class", "container svelte-n1r49n");
    			add_location(div, file$1, 77, 4, 3152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layoutgrid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layoutgrid_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				layoutgrid_changes.$$scope = { dirty, ctx };
    			}

    			layoutgrid.$set(layoutgrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layoutgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layoutgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layoutgrid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(77:2) {:then}",
    		ctx
    	});

    	return block;
    }

    // (81:8) <Cell>
    function create_default_slot_4(ctx) {
    	let marketorderswidget;
    	let current;

    	marketorderswidget = new MarketOrdersWidget({
    			props: { index: 0, width, height },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marketorderswidget.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marketorderswidget, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketorderswidget.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketorderswidget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marketorderswidget, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(81:8) <Cell>",
    		ctx
    	});

    	return block;
    }

    // (84:8) <Cell>
    function create_default_slot_3(ctx) {
    	let marketorderswidget;
    	let current;

    	marketorderswidget = new MarketOrdersWidget({
    			props: { index: 1, width, height },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marketorderswidget.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marketorderswidget, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketorderswidget.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketorderswidget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marketorderswidget, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(84:8) <Cell>",
    		ctx
    	});

    	return block;
    }

    // (87:8) <Cell>
    function create_default_slot_2(ctx) {
    	let marketorderswidget;
    	let current;

    	marketorderswidget = new MarketOrdersWidget({
    			props: { index: 2, width, height },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marketorderswidget.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marketorderswidget, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketorderswidget.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketorderswidget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marketorderswidget, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(87:8) <Cell>",
    		ctx
    	});

    	return block;
    }

    // (90:8) <Cell>
    function create_default_slot_1(ctx) {
    	let marketorderswidget;
    	let current;

    	marketorderswidget = new MarketOrdersWidget({
    			props: { index: 3, width, height },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(marketorderswidget.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marketorderswidget, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketorderswidget.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketorderswidget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marketorderswidget, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(90:8) <Cell>",
    		ctx
    	});

    	return block;
    }

    // (80:6) <LayoutGrid>
    function create_default_slot$1(ctx) {
    	let cell0;
    	let t0;
    	let cell1;
    	let t1;
    	let cell2;
    	let t2;
    	let cell3;
    	let current;

    	cell0 = new Cell({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell1 = new Cell({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell2 = new Cell({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cell3 = new Cell({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell0.$$.fragment);
    			t0 = space();
    			create_component(cell1.$$.fragment);
    			t1 = space();
    			create_component(cell2.$$.fragment);
    			t2 = space();
    			create_component(cell3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cell1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cell2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(cell3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cell0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				cell0_changes.$$scope = { dirty, ctx };
    			}

    			cell0.$set(cell0_changes);
    			const cell1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				cell1_changes.$$scope = { dirty, ctx };
    			}

    			cell1.$set(cell1_changes);
    			const cell2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				cell2_changes.$$scope = { dirty, ctx };
    			}

    			cell2.$set(cell2_changes);
    			const cell3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				cell3_changes.$$scope = { dirty, ctx };
    			}

    			cell3.$set(cell3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell0.$$.fragment, local);
    			transition_in(cell1.$$.fragment, local);
    			transition_in(cell2.$$.fragment, local);
    			transition_in(cell3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell0.$$.fragment, local);
    			transition_out(cell1.$$.fragment, local);
    			transition_out(cell2.$$.fragment, local);
    			transition_out(cell3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cell1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cell2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(cell3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(80:6) <LayoutGrid>",
    		ctx
    	});

    	return block;
    }

    // (75:18)      <div>LOADING...</div>   {:then}
    function create_pending_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "LOADING...";
    			add_location(div, file$1, 75, 4, 3116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(75:18)      <div>LOADING...</div>   {:then}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		blocks: [,,,]
    	};

    	handle_promise(/*promise*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			info.block.c();
    			add_location(main, file$1, 73, 0, 3086);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const width = 1000;
    const height = 1618;

    function instance$2($$self, $$props, $$invalidate) {
    	let $subscriptions;
    	let $pairs;
    	validate_store(subscriptions, 'subscriptions');
    	component_subscribe($$self, subscriptions, $$value => $$invalidate(1, $subscriptions = $$value));
    	validate_store(pairs, 'pairs');
    	component_subscribe($$self, pairs, $$value => $$invalidate(2, $pairs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	async function getTradingPairs() {
    		const response = await fetch(FetchUtils.createRestUrl(BybitRestEndPoint.QuerySymbols));
    		const json = await response.json();
    		const items = json.result;

    		items.forEach(item => {
    			$pairs.push(item);

    			//--- TEST SUBSCRIBE ONLY TO SOME SPECIFIC PAIRS
    			if (item.name === "BTCUSD" || item.name === "ETHUSD" || item.name === "DOTUSD" || item.name === "LUNAUSD") {
    				const subscription = new Subscription(item, ByBitStreamTopics.Trade);
    				$subscriptions.push(subscription);

    				setInterval(
    					() => {
    						const maxBubbleRadius = 200;

    						subscription.bubbles.filter(bubble => {
    							return bubble.y > maxBubbleRadius * -1;
    						}).map(
    							bubble => {
    								bubble.y -= bubble.velocity;
    								bubble.text.y -= bubble.velocity;
    							},
    							maxBubbleRadius * -1
    						);

    						//  return () => clearInterval(timer);
    						subscription.bubbles = subscription.bubbles;
    					},
    					100
    				);
    			}
    		});

    		pairs.set($pairs);
    		subscriptions.set($subscriptions);
    		new StreamService(BybitEndPointUrl.MainnetStreamInversePerpetual, $subscriptions, onMessage);
    		return true;
    	}

    	//--- set promise to fetch trading pairs
    	//--- rendering awaits for this promise to resolve
    	let promise = getTradingPairs();

    	//--- callback for stream messages
    	const onMessage = message => {
    		//--- trade message
    		if (message.isTrade) {
    			//--- add all the trades in the message to the store
    			message.data.forEach(trade => {
    				//if ($DEBUG) console.log(trade);
    				//--- find subscription forr the pair given by the message
    				const subscription = $subscriptions.find(subscription => subscription.pair.name === trade.symbol);

    				if (subscription === undefined) return;

    				//if ($DEBUG) console.log(subscription);
    				//--- add trade & bubble
    				subscription.trades.push(trade);

    				subscription.bubbles.push(createBubble(trade, width, height));
    			});

    			//--- necesarry to trigger the svelte reactivity
    			subscriptions.set($subscriptions);
    		} else //--- level 2 orderbook message
    		if (message.isOrderbookLevel2) ; //TODO
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		BybitEndPointUrl,
    		BybitRestEndPoint,
    		ByBitStreamTopics,
    		DEBUG,
    		pairs,
    		subscriptions,
    		LayoutGrid,
    		Cell,
    		StreamService,
    		FetchUtils,
    		MarketOrdersWidget,
    		createBubble,
    		Subscription,
    		width,
    		height,
    		getTradingPairs,
    		promise,
    		onMessage,
    		$subscriptions,
    		$pairs
    	});

    	$$self.$inject_state = $$props => {
    		if ('promise' in $$props) $$invalidate(0, promise = $$props.promise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [promise];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* node_modules/@smui/common/dist/elements/Div.svelte generated by Svelte v3.47.0 */
    const file = "node_modules/@smui/common/dist/elements/Div.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Div', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Div$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Div",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get use() {
    		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/classadder/ClassAdder.svelte generated by Svelte v3.47.0 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>
    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				[/*smuiClass*/ ctx[5]]: true,
    				.../*smuiClassMap*/ ctx[4]
    			})
    		},
    		/*props*/ ctx[6],
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[11](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, smuiClass, smuiClassMap, props, $$restProps*/ 499)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 129 && {
    						use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, smuiClass, smuiClassMap*/ 50 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							[/*smuiClass*/ ctx[5]]: true,
    							.../*smuiClassMap*/ ctx[4]
    						})
    					},
    					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[11](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[11](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const internals = {
    	component: Div$1,
    	class: '',
    	classMap: {},
    	contexts: {},
    	props: {}
    };

    function instance($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClassAdder', slots, ['default']);
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	const smuiClass = internals.class;
    	const smuiClassMap = {};
    	const smuiClassUnsubscribes = [];
    	const contexts = internals.contexts;
    	const props = internals.props;
    	let { component = internals.component } = $$props;

    	Object.entries(internals.classMap).forEach(([name, context]) => {
    		const store = getContext(context);

    		if (store && 'subscribe' in store) {
    			smuiClassUnsubscribes.push(store.subscribe(value => {
    				$$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
    			}));
    		}
    	});

    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	for (let context in contexts) {
    		if (contexts.hasOwnProperty(context)) {
    			setContext(context, contexts[context]);
    		}
    	}

    	onDestroy(() => {
    		for (const unsubscribe of smuiClassUnsubscribes) {
    			unsubscribe();
    		}
    	});

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Div: Div$1,
    		internals,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		use,
    		className,
    		element,
    		smuiClass,
    		smuiClassMap,
    		smuiClassUnsubscribes,
    		contexts,
    		props,
    		component,
    		forwardEvents,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		smuiClassMap,
    		smuiClass,
    		props,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class ClassAdder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClassAdder",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get use() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // @ts-ignore: Internals is exported... argh.
    const defaults = Object.assign({}, internals);
    function classAdderBuilder(props) {
        return new Proxy(ClassAdder, {
            construct: function (target, args) {
                Object.assign(internals, defaults, props);
                // @ts-ignore: Need spread arg.
                return new target(...args);
            },
            get: function (target, prop) {
                Object.assign(internals, defaults, props);
                return target[prop];
            },
        });
    }

    const Div = Div$1;

    classAdderBuilder({
        class: 'smui-card__content',
        component: Div,
    });

    classAdderBuilder({
        class: 'mdc-card__media-content',
        component: Div,
    });

    classAdderBuilder({
        class: 'mdc-card__action-buttons',
        component: Div,
    });

    classAdderBuilder({
        class: 'mdc-card__action-icons',
        component: Div,
    });

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
