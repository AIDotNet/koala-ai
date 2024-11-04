import { UAParser } from 'ua-parser-js';

/**
 * check mobile device in server
 */
export const isMobileDevice = () => {

    const device = new UAParser('').getDevice();

    // 如果当前宽度小于 768px 则认为是移动端
    if (window.innerWidth < 768) {
        return true;
    }

    return device.type === 'mobile';
};

/**
 * check mobile device in server
 */
export const gerServerDeviceInfo = () => {
    const parser = new UAParser('');

    return {
        browser: parser.getBrowser().name,
        isMobile: isMobileDevice(),
        os: parser.getOS().name,
    };
};
