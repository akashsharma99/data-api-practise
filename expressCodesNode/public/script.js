function setup() {


        noCanvas();
        const video=createCapture(VIDEO);
        video.parent('entryTab');
        video.size=(320,240);

        const locaP = document.querySelector("#locationDetails");
        const moodInput = document.querySelector('#mood');
        const instance = M.Tabs.init(document.querySelector('.tabs'));
        let latitude = 0;
        let longitude = 0;
        const form = document.querySelector('.input-data');


        if ('geolocation' in navigator) {
                console.log('geolocation available');
                navigator.geolocation.getCurrentPosition(async position => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        locaP.innerHTML = `Your location detected at...<br>Latitude: <span class="cord">${latitude.toFixed(2)}&deg;</span><br>Longitude: <span class="cord">${longitude.toFixed(2)}&deg;</span>`;
                });
        } else {
                console.log('geolocation not available');
        }


        form.addEventListener('submit', async event => {
                event.preventDefault();
                const mood = moodInput.value;
                form.reset();
                form.blur();
                video.loadPixels();
                const image64=video.canvas.toDataURL();
                const data = {
                        latitude,
                        longitude,
                        mood,
                        image64
                };
                const response = await fetch('/api', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                });
                const dat = await response.json();
                console.log(dat);
        });

        const container = document.querySelector('#listTab');
        const getData = async () => {
                const response = await fetch('/api');
                const data = await response.json();
                data.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
                console.log(data);
                const root = document.createElement('ul');
                root.classList.add('collection');
                data.forEach(item => {
                        const data = document.createElement('li');
                        const image=document.createElement('img');
                        data.classList.add('collection-item');
                        const dateString = new Date(item.timestamp).toLocaleString();
                        image.src=item.image64;
                        data.innerText = `mood: ${item.mood}\n${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°\n${dateString}`;
                        data.append(image);
                        root.append(data);

                })
                container.append(root);
        }
        document.querySelector('.litab').addEventListener('click', event => {
                container.innerHTML = '';
                getData();
        })
        
       
        
}