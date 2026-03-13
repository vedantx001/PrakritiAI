// Purpose: Build and parse slugs for series, chapters, and topics.

export const slugify = (value = '') =>
	value
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

export const isSameLabel = (left = '', right = '') =>
	left.trim().toLowerCase() === right.trim().toLowerCase();
