function setCSS(target, values) {
	for(prop in values) {
		target.style[prop] = values[prop];
	}
}