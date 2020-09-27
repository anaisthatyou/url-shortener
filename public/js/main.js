const Main = (() => {
    
    const getUrlApiCall = async () => {
        const input = document.getElementById('input');
        console.log(input)
        console.log(input.value);

        const response = await fetch('/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: input.value })
        });

        const body = await response.text();
        return body;

    };

    const getShortenedUrl = async (originalUrl) => {
        const url = await getUrlApiCall(originalUrl);
        const display = document.getElementById('display')

        console.log(display);

        display.style = "visibility: visible;"
        display.href = url;
        display.innerText = url;

    }

    return {
        getShortenedUrl,
    };
})();


