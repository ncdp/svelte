/* generated by Svelte vX.Y.Z */
import {
	SvelteComponent as SvelteComponent_1,
	append,
	blank_object,
	comment,
	create_animation,
	detach,
	element,
	fix_and_outro_and_destroy_block,
	fix_position,
	init,
	insert,
	noop,
	safe_not_equal,
	set_data,
	text,
	update_keyed_each
} from "svelte/internal";

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.thing = list[i];
	return child_ctx;
}

// (19:0) {#each things as thing (thing.id)}
function create_each_block(key_1, ctx) {
	var div, t_value = ctx.thing.name, t, rect, stop_animation = noop;

	return {
		key: key_1,

		first: null,

		c() {
			div = element("div");
			t = text(t_value);
			this.first = div;
		},

		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},

		p(changed, ctx) {
			if ((changed.things) && t_value !== (t_value = ctx.thing.name)) {
				set_data(t, t_value);
			}
		},

		r() {
			rect = div.getBoundingClientRect();
		},

		f() {
			fix_position(div);
			stop_animation();
		},

		a() {
			stop_animation();
			stop_animation = create_animation(div, rect, foo, {});
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment(ctx) {
	var each_blocks = [], each_1_lookup = blank_object(), each_1_anchor;

	var each_value = ctx.things;

	const get_key = ctx => ctx.thing.id;

	for (var i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_blocks[i] = each_1_lookup[key] = create_each_block(key, child_ctx);
	}

	return {
		c() {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			each_1_anchor = comment();
		},

		m(target, anchor) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

			insert(target, each_1_anchor, anchor);
		},

		p(changed, ctx) {
			const each_value = ctx.things;
			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, fix_and_outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
			for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
		},

		i: noop,
		o: noop,

		d(detaching) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

			if (detaching) {
				detach(each_1_anchor);
			}
		}
	};
}

function foo(node, animation, params) {
	const dx = animation.from.left - animation.to.left;
	const dy = animation.from.top - animation.to.top;

	return {
		delay: params.delay,
		duration: 100,
		tick: (t, u) => {
			node.dx = u * dx;
			node.dy = u * dy;
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { things } = $$props;

	$$self.$set = $$props => {
		if ('things' in $$props) $$invalidate('things', things = $$props.things);
	};

	return { things };
}

class SvelteComponent extends SvelteComponent_1 {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, ["things"]);
	}
}

export default SvelteComponent;