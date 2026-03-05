/**
 * Stub for antd/es/input/TextArea.
 * Renders a real <textarea> so @testing-library queries work.
 */
import React from 'react';

const TextArea = React.forwardRef(function TextArea(props, ref) {
	return React.createElement('textarea', { ...props, ref });
});

export default TextArea;
