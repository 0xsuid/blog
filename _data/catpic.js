const axios = require("axios");


module.exports = async () => {
    const response = await axios.get("https://thiscatdoesnotexist.com/", { responseType: 'arraybuffer' });
    return "data:image/png;base64," + Buffer.from(response.data, 'utf-8').toString('base64');
};