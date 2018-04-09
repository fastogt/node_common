var KickBox = require('kickbox');

module.exports = {
    validateEmailInput: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    validateEmail: function (email, done) {
        var kickBox = new KickBox();
        var is_valid = validateEmailInput(email);

        if (!is_valid) {
            done('Invalid email input.');
            return;
        }

        var domain = email.split('@')[1];

        const dns = require('dns');
        dns.resolve(domain, 'MX', function (err, addresses) {
            if (err) {
                done(err);
                return
            }

            if (addresses && addresses.length > 0) {
                kickBox.verifyEmail(email)
                    .then(function () {
                        done(null);
                    }).catch(function (err) {
                    done(err);
                });
                return
            }
            done('Can\'t resolve domain.');
        });
    }
};