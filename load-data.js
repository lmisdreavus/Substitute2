fetch('speed-data.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector("#speedTable tbody");
        
        for (let item of data) {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.value}</td>
                <td>${item.name}</td>
                <td>${item.baseStat}</td>
                <td>${item.nature}</td>
                <td>${item.iv}</td>
                <td>${item.ev}</td>
                <td>${item.rank}</td>
            `;
            
            tableBody.appendChild(row);
        }
    })
    .catch(error => console.error('Error loading JSON Data: ', error));
