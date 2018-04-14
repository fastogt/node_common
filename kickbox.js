var https = require('https');

function KickBox() {
    var self = this;

    // this._apiKey = 'live_be5531bb88ad884ff1314858437ca9d445d3d13be20a571664082b87aae529cc';
    this._host = 'open.kickbox.com'; //https://open.kickbox.com/v1/disposable/{emal}

    /**
     * Send request method
     *
     * @param method
     * @param path
     * @param data
     * @returns {Promise}
     * @private
     */
    this._request = function (method, path, data) {
        return new Promise(function (resolve, reject) {
            var request = https.request({
                method: method,
                hostname: self._host,
                path: path,
                headers: {}
            }, function (response) {
                if (response.statusCode !== 200) {
                    reject(new Error('Failed response: ' + response.statusCode));
                }

                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    resolve(str);
                });
            }, function (e) {
                reject(e);
            });

            request.on('error', function (e) {
                console.error('problem with request: ', e.message);
                reject(e);
            });

            data && request.write(data);

            request.end();
        });
    };

    return {
        verifyEmail: KickBox.prototype.verifyEmail.bind(this)
    }
}

/**
 * Check to see if an email address is real and retrieve additional metadata its overall quality
 *
 * @param {String} email
 * @returns {Promise}
 */
KickBox.prototype.verifyEmail = function (email) {
    var path = '/v1/disposable/' + email;

    return this._request('GET', path)
        .then(function (response) {
            var data = JSON.parse(response);
            if (!data.hasOwnProperty('disposable')) {
                throw new Error('Invalid data response!');
            }

            if (data.disposable) {
                throw new Error('Invalid domain for email!');
            }

            return !data.disposable
        });
};

module.exports = KickBox;