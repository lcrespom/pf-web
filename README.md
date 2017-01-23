# pf-web
Experimenting with a simple pure functional + virtual DOM web app.

This architecture style is described
[here](https://github.com/paldepind/functional-frontend-architecture).

It is also _fractal_, i.e. it supports components that handle their own internal state using the same architectural pattern, and publish relevant events to the parent component. The meaning of fractal in this context is borrowed from [this article](http://staltz.com/unidirectional-user-interface-architectures.html).

## Yocto
Demo applications rely on a minimal framework called **Yocto**, providing:
- The main functional update/render loop (~16 SLOC)
- A way to create components that use the same pattern as the main application (~17 SLOC)
- A time-travel debugger, accessible via the console (~26 SLOC)

[Snabbdom](https://github.com/snabbdom/snabbdom) is used as the Virtual DOM library.

The fact that such a powerful framework can be based on such few lines of code reveal the deep strength of this architectural style in particular, and of the pure functional approach in general.

## ToDo
- Expand the CRUD demo:
	- Components
		- Form
			- Custom validation
		- Other input widgets, e.g. radios, checkboxes, etc.
		- Menu component
	- Test CSS animations
	- Expand REST-dummy service
		- Edit/add/remove contact actions should invoke REST service
		- Loading progress indicator component
	- Popup component
		- Use for contact delete confirmation
	- Search filter
- Test a pure-fractal approach where there is only one "runComponent" loop
	and all nested components are just by delegation.
	- Consider container pattern
