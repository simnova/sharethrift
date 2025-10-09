// get only Microform iframes (e.g., by id, class, or src)
for (const element of document.getElementsByTagName('iframe')) {
	element.style.height = '30px';
	// element.style.border = '1px solid #d5d0da';
	element.style.paddingLeft = '10px';
}
