function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function timeRangesToArray(ranges) {
	var array = [];
	for (var i = 0; i < ranges.length; i += 1) {
		array.push({ start: ranges.start(i), end: ranges.end(i) });
	}
	return array;
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
	var audio, audio_is_paused = true, audio_updating = false, audio_animationframe;

	function audio_timeupdate_handler() {
		cancelAnimationFrame(audio_animationframe);
		if (!audio.paused) audio_animationframe = requestAnimationFrame(audio_timeupdate_handler);
		audio_updating = true;
		component.set({ played: timeRangesToArray(audio.played), currentTime: audio.currentTime });
		audio_updating = false;
	}

	function audio_durationchange_handler() {
		component.set({ duration: audio.duration });
	}

	function audio_play_pause_handler() {
		audio_updating = true;
		component.set({ paused: audio.paused });
		audio_updating = false;
	}

	function audio_progress_handler() {
		component.set({ buffered: timeRangesToArray(audio.buffered) });
	}

	function audio_loadedmetadata_handler() {
		component.set({ buffered: timeRangesToArray(audio.buffered), seekable: timeRangesToArray(audio.seekable) });
	}

	function audio_volumechange_handler() {
		audio_updating = true;
		component.set({ volume: audio.volume });
		audio_updating = false;
	}

	return {
		c: function create() {
			audio = createElement("audio");
			this.h();
		},

		h: function hydrate() {
			addListener(audio, "timeupdate", audio_timeupdate_handler);
			if (!('played' in state && 'currentTime' in state)) component.root._beforecreate.push(audio_timeupdate_handler);
			addListener(audio, "durationchange", audio_durationchange_handler);
			if (!('duration' in state)) component.root._beforecreate.push(audio_durationchange_handler);
			addListener(audio, "play", audio_play_pause_handler);
			addListener(audio, "pause", audio_play_pause_handler);
			addListener(audio, "progress", audio_progress_handler);
			if (!('buffered' in state)) component.root._beforecreate.push(audio_progress_handler);
			addListener(audio, "loadedmetadata", audio_loadedmetadata_handler);
			if (!('buffered' in state && 'seekable' in state)) component.root._beforecreate.push(audio_loadedmetadata_handler);
			addListener(audio, "volumechange", audio_volumechange_handler);
		},

		m: function mount(target, anchor) {
			insertNode(audio, target, anchor);

			audio.volume = state.volume;
		},

		p: function update(changed, state) {
			if (!audio_updating && !isNaN(state.currentTime )) audio.currentTime = state.currentTime ;
			if (!audio_updating && audio_is_paused !== (audio_is_paused = state.paused )) audio[audio_is_paused ? "pause" : "play"]();
			if (!audio_updating && !isNaN(state.volume)) audio.volume = state.volume;
		},

		u: function unmount() {
			detachNode(audio);
		},

		d: function destroy() {
			removeListener(audio, "timeupdate", audio_timeupdate_handler);
			removeListener(audio, "durationchange", audio_durationchange_handler);
			removeListener(audio, "play", audio_play_pause_handler);
			removeListener(audio, "pause", audio_play_pause_handler);
			removeListener(audio, "progress", audio_progress_handler);
			removeListener(audio, "loadedmetadata", audio_loadedmetadata_handler);
			removeListener(audio, "volumechange", audio_volumechange_handler);
		}
	};
}

class SvelteComponent extends Component {
	constructor(options) {
		super(options);
		this._state = assign({}, options.data);

		if (!options.root) {
			this._oncreate = [];
			this._beforecreate = [];
		}

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			callAll(this._beforecreate);
		}
	}
}

export default SvelteComponent;
