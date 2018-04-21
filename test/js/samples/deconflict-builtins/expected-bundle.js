function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function blankObject() {
	return Object.create(null);
}

class Base {
	constructor() {
		this._handlers = blankObject();
	}

	fire(eventName, data) {
		const handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (let i = 0; i < handlers.length; i += 1) {
			const handler = handlers[i];

			if (!handler.__calling) {
				handler.__calling = true;
				handler.call(this, data);
				handler.__calling = false;
			}
		}
	}

	get() {
		return this._state;
	}

	on(eventName, handler) {
		const handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				const index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	_differs(a, b) {
		return _differsImmutable(a, b) || ((a && typeof a === 'object') || typeof a === 'function');
	}
}

class Component extends Base {
	constructor(options) {
		super();
		this._bind = options._bind;

		this.options = options;
		this.root = options.root || this;
		this.store = this.root.store || options.store;
	}

	destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = this.get = noop;

		if (detach !== false) this._fragment.u();
		this._fragment.d();
		this._fragment = this._state = null;
	}

	set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		this.root._lock = true;
		callAll(this.root._beforecreate);
		callAll(this.root._oncreate);
		callAll(this.root._aftercreate);
		this.root._lock = false;
	}

	_set(newState) {
		const previous = this._state;
		const changed = {};
		let dirty = false;

		for (var key in newState) {
			if (this._differs(newState[key], previous[key])) changed[key] = dirty = 1;
		}

		if (!dirty) return;

		this._state = assign(assign({}, previous), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed, current: this._state, previous });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed, current: this._state, previous });
		}
	}

	_mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	_recompute() {}

	_unmount() {
		if (this._fragment) this._fragment.u();
	}
}

function _differsImmutable(a, b) {
	return a != a ? b == b : a !== b;
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

/* generated by Svelte vX.Y.Z */

function create_main_fragment(component, state) {
	var each_anchor;

	var each_value = state.createElement;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			node: each_value[i],
			node_index: i
		}));
	}

	return {
		c: function create() {
			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_anchor = createComment();
		},

		m: function mount(target, anchor) {
			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insertNode(each_anchor, target, anchor);
		},

		p: function update(changed, state) {
			var each_value = state.createElement;

			if (changed.createElement) {
				for (var i = 0; i < each_value.length; i += 1) {
					var each_context = assign(assign({}, state), {
						each_value: each_value,
						node: each_value[i],
						node_index: i
					});

					if (each_blocks[i]) {
						each_blocks[i].p(changed, each_context);
					} else {
						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(each_anchor.parentNode, each_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}
		},

		u: function unmount() {
			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}

			detachNode(each_anchor);
		},

		d: function destroy() {
			destroyEach(each_blocks);
		}
	};
}

// (1:0) {#each createElement as node}
function create_each_block(component, state) {
	var node = state.node, each_value = state.each_value, node_index = state.node_index;
	var span, text_value = node, text;

	return {
		c: function create() {
			span = createElement("span");
			text = createText(text_value);
		},

		m: function mount(target, anchor) {
			insertNode(span, target, anchor);
			appendNode(text, span);
		},

		p: function update(changed, state) {
			node = state.node;
			each_value = state.each_value;
			node_index = state.node_index;
			if ((changed.createElement) && text_value !== (text_value = node)) {
				text.data = text_value;
			}
		},

		u: function unmount() {
			detachNode(span);
		},

		d: noop
	};
}

class SvelteComponent extends Component {
	constructor(options) {
		super(options);
		this._state = assign({}, options.data);

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}
}

export default SvelteComponent;
