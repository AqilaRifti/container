if (!navigator.clipboard || !navigator.clipboard.writeText || !navigator.clipboard.readText) {
    navigator.clipboard = {
        writeText: function(text) {
            return new Promise(function(resolve, reject) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                textarea.style.left = '-9999px';
                textarea.style.opacity = '0';
                textarea.style.pointerEvents = 'none';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    document.execCommand('copy');
                    resolve();
                } catch (err) {
                    reject(err);
                } finally {
                    document.body.removeChild(textarea);
                }
            });
        },
        readText: function() {
            return new Promise(function(resolve, reject) {
                const textarea = document.createElement('textarea');
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                textarea.style.left = '-9999px';
                textarea.style.opacity = '0';
                textarea.style.pointerEvents = 'none';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    if (document.execCommand('paste')) {
                        resolve(textarea.value);
                    } else {
                        reject('Paste command failed');
                    }
                } catch (err) {
                    reject(err);
                } finally {
                    document.body.removeChild(textarea);
                }
            });
        }
    };
}
