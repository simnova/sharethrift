// get only Microform iframes (e.g., by id, class, or src)
for (const element of document.getElementsByTagName('iframe')) {
	element.style.height = '30px';
	element.style.border = '1px solid #d9d9d9';
	element.style.paddingLeft = '10px';
	element.style.borderRadius = '3px';
}
