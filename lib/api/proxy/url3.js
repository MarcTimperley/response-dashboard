const got = require('got')
module.exports = async (url, callback = () => {  }) => {
    try {
        if (!url) url='http://www.example.com'
        const response = await got(url);
        // console.log(response.body);

        callback
        return {url:url,response:response.timings.phases.total}
        //=> '<!doctype html> ...'
    } catch (error) {
        return(error.response.body);
        //=> 'Internal server error ...'
    }

}