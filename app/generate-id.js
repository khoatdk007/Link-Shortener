module.exports = function (size, used_ids) {
    const allowed_letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res;
    do {
        res = '';
        for (let i = 0; i < size; i++) {
            res += allowed_letter[Math.floor(Math.random() * (allowed_letter.length))];
        }
    } while (used_ids.includes(res));
    return res;
}
