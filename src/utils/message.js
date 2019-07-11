import { Message } from 'element-ui';

export default ({message, type, duration = 3000}) => {
    Message({
        message,
        type,
        duration
    });
}