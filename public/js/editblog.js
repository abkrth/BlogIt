window.onload = function () {
    const element = document.getElementById('patch-form');
    if(element) {
        element.addEventListener('submit', event => {
            event.preventDefault();
            const url = window.location.href
            //const form = new FormData(document.getElementById('patch-form'));
            console.log(url)
            var title = document.getElementById('title').value;
            var body = document.getElementById('body').value;
            let _data = {
                title,
                body
            }
            console.log(_data)
            fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => {
                // HTTP 301 response
                // HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
                console.log('Is it working')
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(function(err) {
                console.info(err + " url: " + url);
            });
        });
    }
}