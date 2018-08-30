import { helper } from '@ember/component/helper';

export function breakOn([string, breakChar]: [string, string]) {
	if (string.includes('{{')) {
		string = string.replace('{{', '').replace('}}', '').replace('-', ' ');
		string = string.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
		string = '<' + string.replace(' ', '') + '>';
	}
	return string.replace(new RegExp(breakChar, 'g'), `${breakChar}\u200B`);
}

export default helper(breakOn);
